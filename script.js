// =========================================================
// The Powder Files — Public site + approved editors
// (UI unchanged; fixes auth wiring + prevents double-load crash)
// =========================================================

// ---------------------------------------------------------
// HARD GUARD: prevent "Identifier 'supabase' has already been declared"
// If script.js is loaded twice (service worker, cache-busting, etc.),
// we skip re-defining everything.
// ---------------------------------------------------------
if (window.__powderfiles_script_loaded) {
  console.warn("[PowderFiles] script.js loaded more than once — skipping re-init to prevent redeclare crash.");
} else {
  window.__powderfiles_script_loaded = true;

  // Helpful: confirms JS is actually running
  console.log("[PowderFiles] script.js loaded");

  // Global error visibility (so you always see something in console)
  window.addEventListener("error", (e) => {
    console.error("[PowderFiles] window error:", e?.error || e?.message || e);
  });

  window.addEventListener("unhandledrejection", (e) => {
    console.error("[PowderFiles] unhandled promise rejection:", e?.reason || e);
  });

  // ===== Supabase Config =====
  const SUPABASE_URL = "https://zpxvcvspiiueelmstyjb.supabase.co";
  const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpweHZjdnNwaWl1ZWVsbXN0eWpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3MjA2ODIsImV4cCI6MjA4NTI5NjY4Mn0.pfpPInX45JLrZmqpXi1p4zIUoAn49oeg74KugseHIDU";

  // Create client once (avoid duplicate declarations / double init)
  window.__powder_supabase =
    window.__powder_supabase ||
    window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: "pkce",
        storage: window.localStorage
      }
    });

  // IMPORTANT: use a function-scoped alias; never redeclare on double-load
  const supabase = window.__powder_supabase;

  // ===== Offline cache key (public data) =====
  const STORAGE_KEY = "powderfiles_public_cache_v1";

  // ===== State =====
  const state = {
    view: "resorts", // resorts | itins | resortDetail
    selectedResortId: null,
    resortSearch: "",
    itinSearch: "",

    // auth
    user: null,
    session: null,

    // editor status
    editorStatus: "none", // none | pending | approved | rejected
    username: null
  };

  function setState(patch) {
    Object.assign(state, patch);
  }

  // ===== Utilities =====
  function escapeHtml(s) {
    return String(s ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function escapeAttr(s) {
    return escapeHtml(s).replaceAll("\n", " ");
  }

  function money(n) {
    const x = Number(n);
    if (!Number.isFinite(x)) return "—";
    return `$${Math.round(x).toLocaleString()}`;
  }

  function clamp(n, lo, hi) {
    if (Number.isNaN(n)) return n;
    return Math.max(lo, Math.min(hi, n));
  }

  function stars(n) {
    const x = Number(n);
    if (!Number.isFinite(x)) return "—";
    const full = "★".repeat(clamp(Math.round(x), 0, 5));
    const empty = "☆".repeat(5 - clamp(Math.round(x), 0, 5));
    return `${full}${empty}`;
  }

  function computeTripTotal(trip) {
    const flights = Number(trip.costFlights) || 0;
    const lodging = Number(trip.costLodging) || 0;
    const hotelOther = Number(trip.costHotelOther) || 0;
    return { flights, lodging, hotelOther, totalBase: flights + lodging + hotelOther };
  }

  function isEditorApproved() {
    return state.editorStatus === "approved";
  }

  function toNumOrNull(v) {
    const s = String(v ?? "").trim();
    if (!s) return null;
    const n = Number(s);
    return Number.isFinite(n) ? n : null;
  }

  // ===== Cache =====
  function loadCache() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { resorts: [], trips: [], updatedAt: 0 };
    try {
      const parsed = JSON.parse(raw);
      return {
        resorts: Array.isArray(parsed.resorts) ? parsed.resorts : [],
        trips: Array.isArray(parsed.trips) ? parsed.trips : [],
        updatedAt: Number(parsed.updatedAt) || 0
      };
    } catch {
      return { resorts: [], trips: [], updatedAt: 0 };
    }
  }

  function saveCache(cache) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  }

  // =========================================================
  // Auth + Editor Status
  // =========================================================
  async function refreshAuthState() {
    const { data } = await supabase.auth.getSession();
    const session = data.session ?? null;
    const user = session?.user ?? null;
    setState({ session, user });

    if (user) {
      // NOTE: requires RLS policy allowing users to SELECT their own row.
      const { data: er, error } = await supabase
        .from("editor_requests")
        .select("status, username")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.warn("[PowderFiles] editor_requests read error:", error);
        setState({ editorStatus: "none", username: null });
      } else if (!er) {
        setState({ editorStatus: "none", username: null });
      } else {
        setState({ editorStatus: er.status, username: er.username });
      }
    } else {
      setState({ editorStatus: "none", username: null });
    }

    renderAuthBar();
  }

  function renderAuthBar() {
    const statusEl = document.getElementById("auth-status");
    const loggedOut = document.getElementById("auth-logged-out");
    const loggedIn = document.getElementById("auth-logged-in");
    const editorBadge = document.getElementById("editor-badge");

    if (!statusEl || !loggedOut || !loggedIn || !editorBadge) return;

    if (!state.user) {
      statusEl.textContent = "Public view";
      loggedOut.classList.remove("hidden");
      loggedIn.classList.add("hidden");
      return;
    }

    statusEl.textContent = `Signed in: ${state.user.email}`;
    loggedOut.classList.add("hidden");
    loggedIn.classList.remove("hidden");

    if (state.editorStatus === "approved") {
      editorBadge.textContent = `Editor: Approved (${state.username ?? "—"})`;
    } else if (state.editorStatus === "pending") {
      editorBadge.textContent = `Editor: Pending approval (${state.username ?? "—"})`;
    } else if (state.editorStatus === "rejected") {
      editorBadge.textContent = `Editor: Rejected`;
    } else {
      editorBadge.textContent = `Editor: Not requested`;
    }
  }

  function wireAuthUI() {
    const btnLogin = document.getElementById("btn-login");
    const btnLogout = document.getElementById("btn-logout");
    const btnShowRegister = document.getElementById("btn-show-register");

    console.log("[PowderFiles] wireAuthUI", {
      btnLogin: !!btnLogin,
      btnLogout: !!btnLogout,
      btnShowRegister: !!btnShowRegister
    });

    btnLogin?.addEventListener("click", async () => {
      try {
        const email = document.getElementById("login-email")?.value?.trim();
        const pass = document.getElementById("login-pass")?.value ?? "";
        if (!email || !pass) return alert("Enter email and password.");

        const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
        if (error) return alert(error.message);

        await refreshAuthState();
        await refreshPublicData();
        render();
      } catch (e) {
        console.error("[PowderFiles] login failed:", e);
        alert("Login failed. Check console.");
      }
    });

    btnLogout?.addEventListener("click", async () => {
      try {
        const { error } = await supabase.auth.signOut();
        if (error) return alert(error.message);
        await refreshAuthState();
        render();
      } catch (e) {
        console.error("[PowderFiles] logout failed:", e);
        alert("Logout failed. Check console.");
      }
    });

    btnShowRegister?.addEventListener("click", () => {
      openRegisterModal();
    });
  }

  /**
   * IMPORTANT CHANGE (RLS-safe):
   * Do NOT insert into editor_requests from the browser.
   * Store username in user_metadata and let a DB trigger create editor_requests row.
   */
  async function registerUser({ email, password, username }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username }, // trigger can read this
        emailRedirectTo: window.location.origin
      }
    });
    if (error) throw error;
    return data;
  }

  function openRegisterModal() {
    openModal(`
      <h2>Register</h2>
      <p class="small muted">Create an account. To become an editor, your request must be approved by the site owner.</p>

      <form id="register-form" class="form-grid">
        <div class="grid-2">
          <div>
            <label class="field-label">Email</label>
            <input id="reg-email" class="field-input" type="email" required />
          </div>
          <div>
            <label class="field-label">Username (public)</label>
            <input id="reg-username" class="field-input" type="text" required />
          </div>
        </div>

        <div class="grid-2">
          <div>
            <label class="field-label">Password</label>
            <input id="reg-pass" class="field-input" type="password" minlength="8" required />
            <div class="small muted">Minimum 8 characters.</div>
          </div>
          <div>
            <label class="field-label">Confirm password</label>
            <input id="reg-pass2" class="field-input" type="password" minlength="8" required />
          </div>
        </div>

        <div id="reg-errors" class="inline-error"></div>

        <div class="modal-footer">
          <button class="btn-secondary" type="button" id="reg-cancel">Cancel</button>
          <button class="btn-primary" type="submit">Create account</button>
        </div>
      </form>
    `);

    document.getElementById("reg-cancel")?.addEventListener("click", closeModal);

    document.getElementById("register-form")?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const errEl = document.getElementById("reg-errors");
      errEl.textContent = "";

      const email = document.getElementById("reg-email").value.trim();
      const username = document.getElementById("reg-username").value.trim();
      const pass = document.getElementById("reg-pass").value;
      const pass2 = document.getElementById("reg-pass2").value;

      if (!email || !username || !pass) return;
      if (pass !== pass2) {
        errEl.textContent = "Passwords do not match.";
        return;
      }

      try {
        await registerUser({ email, password: pass, username });
        closeModal();
        alert("Account created. Check your email to confirm, then log in. Your editor request will be pending approval.");
      } catch (err) {
        console.error("[PowderFiles] registration failed:", err);
        errEl.textContent = err?.message || "Registration failed.";
      }
    });
  }

  // =========================================================
  // Editor: Add Resort (CREATE)
  // =========================================================
  function openAddResortModal() {
    if (!isEditorApproved()) {
      alert("You must be an approved editor to add resorts.");
      return;
    }

    openModal(`
      <h2>Add Resort</h2>
      <p class="small muted">Add a new resort to the public database.</p>

      <form id="add-resort-form" class="form-grid">
        <div class="grid-2">
          <div>
            <label class="field-label">Resort name *</label>
            <input id="ar-name" class="field-input" type="text" required />
          </div>
          <div>
            <label class="field-label">Location *</label>
            <input id="ar-location" class="field-input" type="text" placeholder="City, State / Country" required />
          </div>
        </div>

        <div class="grid-3">
          <div>
            <label class="field-label">Miles from Rochester</label>
            <input id="ar-miles" class="field-input" type="number" inputmode="numeric" />
          </div>
          <div>
            <label class="field-label">Vertical feet</label>
            <input id="ar-vertical" class="field-input" type="number" inputmode="numeric" />
          </div>
          <div>
            <label class="field-label">Trail count</label>
            <input id="ar-trails" class="field-input" type="number" inputmode="numeric" />
          </div>
        </div>

        <div class="grid-3">
          <div>
            <label class="field-label">Mountain stars (0–5)</label>
            <input id="ar-mtnstars" class="field-input" type="number" min="0" max="5" step="1" inputmode="numeric" />
          </div>
          <div>
            <label class="field-label">Area activities stars (0–5)</label>
            <input id="ar-areastars" class="field-input" type="number" min="0" max="5" step="1" inputmode="numeric" />
          </div>
          <div>
            <label class="field-label">Thumbnail URL</label>
            <input id="ar-thumb" class="field-input" type="url" placeholder="https://..." />
          </div>
        </div>

        <div class="grid-2">
          <div>
            <label class="field-label">Typical flight cost</label>
            <input id="ar-flight" class="field-input" type="number" inputmode="numeric" />
          </div>
          <div>
            <label class="field-label">Avg lodging / night</label>
            <input id="ar-avg-lodge" class="field-input" type="number" inputmode="numeric" />
          </div>
        </div>

        <div class="grid-3">
          <div>
            <label class="field-label">Cheapest lodging / night</label>
            <input id="ar-cheap-lodge" class="field-input" type="number" inputmode="numeric" />
          </div>
          <div>
            <label class="field-label">Ski-in/ski-out / night</label>
            <input id="ar-skiin" class="field-input" type="number" inputmode="numeric" />
          </div>
          <div></div>
        </div>

        <div id="ar-errors" class="inline-error"></div>

        <div class="modal-footer">
          <button class="btn-secondary" type="button" id="ar-cancel">Cancel</button>
          <button class="btn-primary" type="submit">Save resort</button>
        </div>
      </form>
    `);

    document.getElementById("ar-cancel")?.addEventListener("click", closeModal);

    document.getElementById("add-resort-form")?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const errEl = document.getElementById("ar-errors");
      errEl.textContent = "";

      const name = document.getElementById("ar-name")?.value?.trim();
      const location = document.getElementById("ar-location")?.value?.trim();

      if (!name || !location) {
        errEl.textContent = "Name and location are required.";
        return;
      }

      // Build insert row using your DB column names (snake_case)
      const row = {
        name,
        location,
        miles_from_rochester: toNumOrNull(document.getElementById("ar-miles")?.value),
        vertical_feet: toNumOrNull(document.getElementById("ar-vertical")?.value),
        trail_count: toNumOrNull(document.getElementById("ar-trails")?.value),
        mountain_stars: toNumOrNull(document.getElementById("ar-mtnstars")?.value),
        area_activities_stars: toNumOrNull(document.getElementById("ar-areastars")?.value),
        typical_flight_cost: toNumOrNull(document.getElementById("ar-flight")?.value),
        avg_lodging_night: toNumOrNull(document.getElementById("ar-avg-lodge")?.value),
        cheapest_lodging_night: toNumOrNull(document.getElementById("ar-cheap-lodge")?.value),
        ski_in_out_night: toNumOrNull(document.getElementById("ar-skiin")?.value),
        thumbnail_url: (document.getElementById("ar-thumb")?.value || "").trim() || null
      };

      // Clamp stars if provided
      if (row.mountain_stars != null) row.mountain_stars = clamp(row.mountain_stars, 0, 5);
      if (row.area_activities_stars != null) row.area_activities_stars = clamp(row.area_activities_stars, 0, 5);

      try {
        const { error } = await supabase.from("resorts").insert([row]);
        if (error) {
          console.error("[PowderFiles] add resort error:", error);
          // RLS messages often look like "new row violates row-level security policy"
          errEl.textContent = error.message || "Failed to add resort.";
          return;
        }

        closeModal();
        await refreshPublicData();
        setState({ view: "resorts", selectedResortId: null });
        render();
      } catch (ex) {
        console.error("[PowderFiles] add resort exception:", ex);
        errEl.textContent = ex?.message || "Failed to add resort.";
      }
    });
  }

  // =========================================================
  // Public Data
  // =========================================================
  async function fetchResorts() {
    const { data, error } = await supabase.from("resorts").select("*").order("name", { ascending: true });
    if (error) throw error;
    return data ?? [];
  }

  async function fetchTrips() {
    const { data, error } = await supabase.from("trips").select("*");
    if (error) throw error;
    return data ?? [];
  }

  function mapResortRowToUI(r) {
    return {
      id: r.id,
      name: r.name,
      location: r.location,
      milesFromRochester: r.miles_from_rochester ?? 0,
      verticalFeet: r.vertical_feet ?? 0,
      trailCount: r.trail_count ?? 0,
      mountainStars: r.mountain_stars ?? 3,
      typicalFlightCost: r.typical_flight_cost ?? 0,
      avgLodgingNight: r.avg_lodging_night ?? 0,
      cheapestLodgingNight: r.cheapest_lodging_night ?? 0,
      skiInOutNight: r.ski_in_out_night ?? 0,
      areaActivitiesStars: r.area_activities_stars ?? 3,
      thumbnailUrl: r.thumbnail_url ?? "",
      createdAt: r.created_at ? Date.parse(r.created_at) : Date.now(),
      updatedAt: r.updated_at ? Date.parse(r.updated_at) : Date.now()
    };
  }

  function mapTripRowToUI(t) {
    return {
      id: t.id,
      resortId: t.resort_id,
      days: t.days,
      compositeScore: t.composite_score ?? 0,
      costFlights: t.cost_flights ?? 0,
      costLodging: t.cost_lodging ?? 0,
      costHotelOther: t.cost_hotel_other ?? 0,
      dayPlans: Array.isArray(t.day_plans) ? t.day_plans : [],
      createdAt: t.created_at ? Date.parse(t.created_at) : Date.now(),
      updatedAt: t.updated_at ? Date.parse(t.updated_at) : Date.now()
    };
  }

  async function refreshPublicData() {
    try {
      const [resorts, trips] = await Promise.all([fetchResorts(), fetchTrips()]);
      const cache = {
        resorts: resorts.map(mapResortRowToUI),
        trips: trips.map(mapTripRowToUI),
        updatedAt: Date.now()
      };
      saveCache(cache);
    } catch (e) {
      console.warn("[PowderFiles] Public fetch failed, using cache:", e);
    }
  }

  // =========================================================
  // Views + Tabs
  // =========================================================
  function setActiveTab() {
    document.getElementById("tab-resorts")?.classList.toggle(
      "segmented-btn--active",
      state.view === "resorts" || state.view === "resortDetail"
    );
    document.getElementById("tab-itins")?.classList.toggle("segmented-btn--active", state.view === "itins");
  }

  function getData() {
    return loadCache();
  }

  function render() {
    setActiveTab();
    const root = document.getElementById("view-root");
    if (!root) return;

    if (state.view === "resorts") {
      root.innerHTML = renderResortsView();
      wireResortsView();
      return;
    }

    if (state.view === "resortDetail") {
      root.innerHTML = renderResortDetailView(state.selectedResortId);
      wireResortDetailView(state.selectedResortId);
      return;
    }

    if (state.view === "itins") {
      root.innerHTML = renderItinsView();
      wireItinsView();
      return;
    }
  }

  function wireTabs() {
    const tabResorts = document.getElementById("tab-resorts");
    const tabItins = document.getElementById("tab-itins");

    console.log("[PowderFiles] wireTabs", { tabResorts: !!tabResorts, tabItins: !!tabItins });

    tabResorts?.addEventListener("click", () => {
      setState({ view: "resorts", selectedResortId: null });
      render();
    });

    tabItins?.addEventListener("click", () => {
      setState({ view: "itins", selectedResortId: null });
      render();
    });
  }

  // -------------------------
  // Resorts List
  // -------------------------
  function renderResortsView() {
    const { resorts } = getData();
    const q = state.resortSearch.trim().toLowerCase();

    const filtered = resorts
      .slice()
      .sort((a, b) => (a.name || "").localeCompare(b.name || ""))
      .filter((r) => {
        if (!q) return true;
        return `${r.name} ${r.location}`.toLowerCase().includes(q);
      });

    const editorBar = isEditorApproved()
      ? `<button id="btn-add-resort" class="btn-primary" type="button">Add Resort</button>`
      : `<span class="small muted">Log in + get approved to edit.</span>`;

    return `
      <section class="card">
        <div class="toolbar">
          <div style="flex:1; min-width: 220px;">
            <label class="field-label" for="resort-search">Search resorts</label>
            <input id="resort-search" class="field-input" type="text"
              placeholder="Search by name or location..." value="${escapeHtml(state.resortSearch)}" />
          </div>
          <div class="btn-row">${editorBar}</div>
        </div>

        <div class="list-grid">
          ${filtered.length ? filtered.map(resortButtonHTML).join("") : `<p class="muted">No resorts found.</p>`}
        </div>
      </section>
    `;
  }

  function resortButtonHTML(r) {
    const thumb = r.thumbnailUrl
      ? `<img alt="${escapeHtml(r.name)} thumbnail" src="${escapeAttr(r.thumbnailUrl)}" />`
      : `<span>No<br/>image</span>`;

    return `
      <button class="resort-btn" type="button" data-open-resort="${r.id}">
        <div class="thumb">${thumb}</div>
        <div class="resort-meta">
          <h3>${escapeHtml(r.name)}</h3>
          <p>${escapeHtml(r.location)} • ${stars(r.mountainStars)} • ${Number(r.verticalFeet || 0).toLocaleString()} ft</p>
        </div>
      </button>
    `;
  }

  function wireResortsView() {
    document.getElementById("resort-search")?.addEventListener("input", (e) => {
      setState({ resortSearch: e.target.value });
      render();
    });

    // ✅ REAL Add Resort handler (replaces the old placeholder alert)
    document.getElementById("btn-add-resort")?.addEventListener("click", () => {
      openAddResortModal();
    });

    document.querySelectorAll("[data-open-resort]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-open-resort");
        setState({ view: "resortDetail", selectedResortId: id });
        render();
      });
    });
  }

  // -------------------------
  // Resort detail
  // -------------------------
  function renderResortDetailView(resortId) {
    const { resorts } = getData();
    const r = resorts.find((x) => x.id === resortId);
    if (!r) {
      return `<section class="card"><p class="muted">Resort not found.</p><button id="btn-back" class="btn-secondary" type="button">Back</button></section>`;
    }

    return `
      <section class="card">
        <div class="toolbar">
          <div class="btn-row">
            <button id="btn-back" class="btn-secondary" type="button">← Back</button>
          </div>
        </div>

        <div style="display:flex; gap:1rem; align-items:center; flex-wrap: wrap;">
          <div class="thumb" style="width:84px; height:84px;">
            ${r.thumbnailUrl ? `<img alt="${escapeHtml(r.name)} thumbnail" src="${escapeAttr(r.thumbnailUrl)}" />` : `<span>No<br/>image</span>`}
          </div>
          <div style="flex:1; min-width: 240px;">
            <h2 style="margin:0 0 .25rem;">${escapeHtml(r.name)}</h2>
            <p class="muted" style="margin:0;">${escapeHtml(r.location)} • ${stars(r.mountainStars)} mountain</p>
          </div>
        </div>

        <div class="hr"></div>

        <div class="kpi">
          <span class="kpi-pill"><strong>Miles from Rochester</strong> ${Number(r.milesFromRochester).toLocaleString()}</span>
          <span class="kpi-pill"><strong>Vertical</strong> ${Number(r.verticalFeet).toLocaleString()} ft</span>
          <span class="kpi-pill"><strong>Trails</strong> ${Number(r.trailCount).toLocaleString()}</span>
          <span class="kpi-pill"><strong>Area activities</strong> ${stars(r.areaActivitiesStars)}</span>
        </div>

        <div class="hr"></div>

        <div class="grid-3">
          <div><div class="field-label">Typical flight cost</div><div><strong>${money(r.typicalFlightCost)}</strong></div></div>
          <div><div class="field-label">Avg lodging / night</div><div><strong>${money(r.avgLodgingNight)}</strong></div></div>
          <div><div class="field-label">Cheapest lodging / night</div><div><strong>${money(r.cheapestLodgingNight)}</strong></div></div>
          <div><div class="field-label">Ski-in/ski-out / night</div><div><strong>${money(r.skiInOutNight)}</strong></div></div>
        </div>

        <div class="hr"></div>
        <p class="small muted">
          Itineraries are listed under the <strong>Itineraries</strong> tab.
        </p>
      </section>
    `;
  }

  function wireResortDetailView() {
    document.getElementById("btn-back")?.addEventListener("click", () => {
      setState({ view: "resorts", selectedResortId: null });
      render();
    });
  }

  // -------------------------
  // Itineraries View (organized)
  // -------------------------
  function renderItinsView() {
    const { resorts, trips } = getData();
    const resortById = Object.fromEntries(resorts.map((r) => [r.id, r]));

    const q = state.itinSearch.trim().toLowerCase();

    const normalized = trips
      .map((t) => {
        const d1 = t.dayPlans?.[0] || {};
        const country = d1.country || "—";
        const st = d1.state || "—";
        const city = d1.city || "—";
        return {
          ...t,
          resort: t.resortId ? resortById[t.resortId] : null,
          primaryCountry: country,
          primaryState: st,
          primaryCity: city
        };
      })
      .filter((t) => {
        if (!q) return true;
        const hay = [
          t.resort?.name,
          t.resort?.location,
          t.primaryCity,
          t.primaryState,
          t.primaryCountry,
          ...(t.dayPlans || []).map((d) => d?.text)
        ]
          .join(" ")
          .toLowerCase();
        return hay.includes(q);
      });

    const groups = {};
    for (const t of normalized) {
      const dur = String(t.days);
      groups[dur] ||= {};
      groups[dur][t.primaryCountry] ||= {};
      groups[dur][t.primaryCountry][t.primaryState] ||= {};
      groups[dur][t.primaryCountry][t.primaryState][t.primaryCity] ||= [];
      groups[dur][t.primaryCountry][t.primaryState][t.primaryCity].push(t);
    }

    return `
      <section class="card">
        <div class="toolbar">
          <div style="flex:1; min-width: 220px;">
            <label class="field-label" for="itin-search">Search itineraries</label>
            <input id="itin-search" class="field-input" type="text"
              placeholder="Search text, resort, city/state/country..." value="${escapeHtml(state.itinSearch)}" />
          </div>
          <div class="btn-row">
            ${isEditorApproved() ? `<span class="small muted">Editing enabled</span>` : `<span class="small muted">Log in + get approved to edit.</span>`}
          </div>
        </div>

        ${renderItinGroups(groups)}
      </section>
    `;
  }

  function renderItinGroups(groups) {
    const durs = Object.keys(groups).sort((a, b) => Number(a) - Number(b));
    if (!durs.length) return `<p class="muted">No itineraries found.</p>`;

    let html = "";
    for (const dur of durs) {
      html += `<div class="accordion">
        <button class="accordion-header" type="button" data-acc-dur="${dur}">
          <div>
            <div class="accordion-title">${dur}-Day Itineraries</div>
            <div class="accordion-sub">Grouped by Country → State → City (Day 1 location)</div>
          </div>
          <div class="pill-score">▼</div>
        </button>
        <div class="accordion-body hidden" data-acc-body="${dur}">
          ${renderLocationTree(groups[dur])}
        </div>
      </div>`;
    }
    return html;
  }

  function renderLocationTree(countryObj) {
    let out = "";
    const countries = Object.keys(countryObj).sort();
    for (const c of countries) {
      out += `<h3 style="margin:1rem 0 .25rem;">${escapeHtml(c)}</h3>`;
      const states = countryObj[c];
      const stKeys = Object.keys(states).sort();
      for (const s of stKeys) {
        out += `<h4 style="margin:.5rem 0 .25rem;" class="muted">${escapeHtml(s)}</h4>`;
        const cities = states[s];
        const cityKeys = Object.keys(cities).sort();
        for (const city of cityKeys) {
          out += `<div class="trip-card" style="margin:.5rem 0;">
            <div class="trip-top">
              <div>
                <strong>${escapeHtml(city)}</strong>
                <div class="small muted">${escapeHtml(s)}, ${escapeHtml(c)}</div>
              </div>
            </div>
            <div class="form-grid">
              ${cities[city]
                .sort((a, b) => (b.compositeScore || 0) - (a.compositeScore || 0))
                .map(itinCardHTML)
                .join("")}
            </div>
          </div>`;
        }
      }
    }
    return out;
  }

  function itinCardHTML(t) {
    const totals = computeTripTotal(t);
    const resortLine = t.resort ? `${t.resort.name} • ${t.resort.location}` : "No resort linked";

    return `
      <div class="trip-card" data-itin="${t.id}">
        <div class="trip-top">
          <div>
            <h4 style="margin:0;">
              ${t.days}-day itinerary <span class="pill-score">Score ${t.compositeScore}</span>
            </h4>
            <div class="small muted">${escapeHtml(resortLine)}</div>
            <div class="kpi" style="margin-top:.35rem;">
              <span class="kpi-pill"><strong>Total</strong> ${money(totals.totalBase)}</span>
              <span class="kpi-pill"><strong>Flights</strong> ${money(totals.flights)}</span>
              <span class="kpi-pill"><strong>Lodging</strong> ${money(totals.lodging)}</span>
            </div>
          </div>
        </div>

        <ol class="day-list">
          ${(t.dayPlans || [])
            .map((d, i) => {
              const loc = [d?.city, d?.state, d?.country].filter(Boolean).join(", ");
              return `<li><strong>Day ${i + 1}:</strong> ${escapeHtml(d?.text || "")}
                ${loc ? `<div class="small muted">${escapeHtml(loc)}</div>` : ``}
              </li>`;
            })
            .join("")}
        </ol>
      </div>
    `;
  }

  function wireItinsView() {
    document.getElementById("itin-search")?.addEventListener("input", (e) => {
      setState({ itinSearch: e.target.value });
      render();
    });

    document.querySelectorAll("[data-acc-dur]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const dur = btn.getAttribute("data-acc-dur");
        document.querySelector(`[data-acc-body="${dur}"]`)?.classList.toggle("hidden");
      });
    });
  }

  // =========================================================
  // Modals
  // =========================================================
  function openModal(innerHTML) {
    const backdrop = document.getElementById("modal-backdrop");
    backdrop.innerHTML = `<div class="modal" role="dialog" aria-modal="true">${innerHTML}</div>`;
    backdrop.classList.remove("hidden");
    backdrop.setAttribute("aria-hidden", "false");

    backdrop.addEventListener(
      "click",
      (e) => {
        if (e.target === backdrop) closeModal();
      },
      { once: true }
    );

    document.addEventListener(
      "keydown",
      function esc(e) {
        if (e.key === "Escape") closeModal();
      },
      { once: true }
    );
  }

  function closeModal() {
    const backdrop = document.getElementById("modal-backdrop");
    backdrop.classList.add("hidden");
    backdrop.setAttribute("aria-hidden", "true");
    backdrop.innerHTML = "";
  }

  // =========================================================
  // App init (ONE time only)
  // =========================================================
  document.addEventListener("DOMContentLoaded", async () => {
    try {
      wireAuthUI();
      wireTabs();

      await refreshAuthState();
      await refreshPublicData();

      setState({ view: "resorts" });
      render();

      supabase.auth.onAuthStateChange(async () => {
        await refreshAuthState();
        await refreshPublicData();
        render();
      });
    } catch (e) {
      console.error("[PowderFiles] init error:", e);
    }
  });
}
