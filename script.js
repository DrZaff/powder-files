// =========================================================
// The Powder Files — Public site + approved editors
// (UI unchanged; fixes "buttons do nothing")
// =========================================================

(() => {
  // Prevent double-init if script gets included twice somehow
  if (window.__powder_app_initialized) return;
  window.__powder_app_initialized = true;

  // ===== Supabase Config =====
  const SUPABASE_URL = "https://zpxvcvspiiueelmstyjb.supabase.co";
  const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpweHZjdnNwaWl1ZWVsbXN0eWpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3MjA2ODIsImV4cCI6MjA4NTI5NjY4Mn0.pfpPInX45JLrZmqpXi1p4zIUoAn49oeg74KugseHIDU";

  if (!window.supabase) {
    console.error("Supabase library not found. Check the CDN script tag in index.html.");
    return;
  }

  // Create client once (store on window to survive hot reloads)
  window.__powder_supabase =
    window.__powder_supabase ||
    window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: "pkce",
        storage: window.localStorage,
      },
    });

  const sb = window.__powder_supabase;

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
    username: null,
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

  // ===== Cache =====
  function loadCache() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { resorts: [], trips: [], updatedAt: 0 };
    try {
      const parsed = JSON.parse(raw);
      return {
        resorts: Array.isArray(parsed.resorts) ? parsed.resorts : [],
        trips: Array.isArray(parsed.trips) ? parsed.trips : [],
        updatedAt: Number(parsed.updatedAt) || 0,
      };
    } catch {
      return { resorts: [], trips: [], updatedAt: 0 };
    }
  }

  function saveCache(cache) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  }

  // =========================================================
  // Auth + Editor Requests
  // =========================================================

  async function refreshAuthState() {
    const { data } = await sb.auth.getSession();
    const session = data.session ?? null;
    const user = session?.user ?? null;
    setState({ session, user });

    // determine editor status
    if (user) {
      const { data: er, error } = await sb
        .from("editor_requests")
        .select("status, username")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.warn("editor_requests read error:", error);
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
    const loginBtn = document.getElementById("btn-login");
    const logoutBtn = document.getElementById("btn-logout");
    const regBtn = document.getElementById("btn-show-register");

    if (!loginBtn || !logoutBtn || !regBtn) {
      console.warn("Auth buttons not found in DOM (check index.html IDs).");
      return;
    }

    loginBtn.addEventListener("click", async () => {
      const email = document.getElementById("login-email")?.value?.trim();
      const pass = document.getElementById("login-pass")?.value ?? "";
      if (!email || !pass) return alert("Enter email and password.");

      const { error } = await sb.auth.signInWithPassword({ email, password: pass });
      if (error) return alert(error.message);

      await refreshAuthState();
      await refreshPublicData();
      render();
    });

    logoutBtn.addEventListener("click", async () => {
      const { error } = await sb.auth.signOut();
      if (error) return alert(error.message);
      await refreshAuthState();
      render();
    });

    regBtn.addEventListener("click", () => {
      openRegisterModal();
    });
  }

  async function registerUser({ email, password, username }) {
    const { data, error } = await sb.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });

    if (error) throw error;

    const newUserId = data.user?.id;
    if (newUserId) {
      const { error: insErr } = await sb.from("editor_requests").insert({
        user_id: newUserId,
        username,
        status: "pending",
      });
      if (insErr) throw insErr;
    }

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
        alert(
          "Account created. If email confirmation is enabled, confirm your email then log in. Your editor request is pending approval."
        );
      } catch (err) {
        console.error(err);
        errEl.textContent = err.message || "Registration failed.";
      }
    });
  }

  // =========================================================
  // Public Data: fetch into cache (works for anon)
  // =========================================================

  async function fetchResorts() {
    const { data, error } = await sb.from("resorts").select("*").order("name", { ascending: true });
    if (error) throw error;
    return data ?? [];
  }

  async function fetchTrips() {
    const { data, error } = await sb.from("trips").select("*");
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
      updatedAt: r.updated_at ? Date.parse(r.updated_at) : Date.now(),
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
      updatedAt: t.updated_at ? Date.parse(t.updated_at) : Date.now(),
    };
  }

  async function refreshPublicData() {
    try {
      const [resorts, trips] = await Promise.all([fetchResorts(), fetchTrips()]);
      const cache = {
        resorts: resorts.map(mapResortRowToUI),
        trips: trips.map(mapTripRowToUI),
        updatedAt: Date.now(),
      };
      saveCache(cache);
    } catch (e) {
      console.warn("Public fetch failed, using cache:", e);
    }
  }

  // =========================================================
  // CRUD (Editors only)
  // =========================================================

  function validateResortPayload(p) {
    const errors = [];
    if (!p.name?.trim()) errors.push("Resort name is required.");
    if (!p.location?.trim()) errors.push("Location is required.");
    const ms = Number(p.mountainStars);
    const as = Number(p.areaActivitiesStars);
    if (!Number.isFinite(ms) || ms < 1 || ms > 5) errors.push("Mountain stars must be 1–5.");
    if (!Number.isFinite(as) || as < 1 || as > 5) errors.push("Area activities stars must be 1–5.");
    return errors;
  }

  function resortInsertRow(p) {
    return {
      name: p.name,
      location: p.location,
      thumbnail_url: p.thumbnailUrl || null,
      miles_from_rochester: Number(p.milesFromRochester) || 0,
      vertical_feet: Number(p.verticalFeet) || 0,
      trail_count: Number(p.trailCount) || 0,
      mountain_stars: Number(p.mountainStars) || 3,
      typical_flight_cost: Number(p.typicalFlightCost) || 0,
      avg_lodging_night: Number(p.avgLodgingNight) || 0,
      cheapest_lodging_night: Number(p.cheapestLodgingNight) || 0,
      ski_in_out_night: Number(p.skiInOutNight) || 0,
      area_activities_stars: Number(p.areaActivitiesStars) || 3,
      created_by: state.user?.id,
    };
  }

  function resortUpdateRow(p) {
    return {
      name: p.name,
      location: p.location,
      thumbnail_url: p.thumbnailUrl || null,
      miles_from_rochester: Number(p.milesFromRochester) || 0,
      vertical_feet: Number(p.verticalFeet) || 0,
      trail_count: Number(p.trailCount) || 0,
      mountain_stars: Number(p.mountainStars) || 3,
      typical_flight_cost: Number(p.typicalFlightCost) || 0,
      avg_lodging_night: Number(p.avgLodgingNight) || 0,
      cheapest_lodging_night: Number(p.cheapestLodgingNight) || 0,
      ski_in_out_night: Number(p.skiInOutNight) || 0,
      area_activities_stars: Number(p.areaActivitiesStars) || 3,
    };
  }

  function validateTripPayload(p) {
    const errors = [];
    const days = Number(p.days);
    if (!Number.isFinite(days) || days < 1 || days > 30) errors.push("Duration must be 1–30 days.");
    const score = Number(p.compositeScore);
    if (!Number.isFinite(score) || score < 0 || score > 100) errors.push("Score must be 0–100.");
    if (!Array.isArray(p.dayPlans) || p.dayPlans.length !== days) errors.push("Day plans must match duration.");
    return errors;
  }

  function normalizeDayPlan(d) {
    return {
      text: String(d?.text ?? "").trim(),
      city: d?.city ? String(d.city).trim() : null,
      state: d?.state ? String(d.state).trim() : null,
      country: d?.country ? String(d.country).trim() : null,
    };
  }

  function tripInsertRow(p) {
    return {
      resort_id: p.resortId || null,
      days: Number(p.days),
      composite_score: Number(p.compositeScore) || 0,
      cost_flights: Number(p.costFlights) || 0,
      cost_lodging: Number(p.costLodging) || 0,
      cost_hotel_other: Number(p.costHotelOther) || 0,
      day_plans: (p.dayPlans || []).map(normalizeDayPlan),
      created_by: state.user?.id,
    };
  }

  function tripUpdateRow(p) {
    return {
      resort_id: p.resortId || null,
      days: Number(p.days),
      composite_score: Number(p.compositeScore) || 0,
      cost_flights: Number(p.costFlights) || 0,
      cost_lodging: Number(p.costLodging) || 0,
      cost_hotel_other: Number(p.costHotelOther) || 0,
      day_plans: (p.dayPlans || []).map(normalizeDayPlan),
    };
  }

  // =========================================================
  // Views
  // =========================================================

  function setActiveTab() {
    document
      .getElementById("tab-resorts")
      ?.classList.toggle("segmented-btn--active", state.view === "resorts" || state.view === "resortDetail");
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
          ${
            filtered.length
              ? filtered.map(resortButtonHTML).join("")
              : `<p class="muted">No resorts found.</p>`
          }
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

    document.getElementById("btn-add-resort")?.addEventListener("click", () => {
      openResortModal({ mode: "create" });
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
  // Resort detail (NO itineraries here now)
  // -------------------------
  function renderResortDetailView(resortId) {
    const { resorts } = getData();
    const r = resorts.find((x) => x.id === resortId);
    if (!r) {
      return `<section class="card"><p class="muted">Resort not found.</p><button id="btn-back" class="btn-secondary" type="button">Back</button></section>`;
    }

    const editorActions = isEditorApproved()
      ? `
        <button id="btn-edit-resort" class="btn-ghost" type="button">Edit</button>
        <button id="btn-delete-resort" class="btn-danger" type="button">Delete</button>
      `
      : ``;

    return `
      <section class="card">
        <div class="toolbar">
          <div class="btn-row">
            <button id="btn-back" class="btn-secondary" type="button">← Back</button>
          </div>
          <div class="btn-row">${editorActions}</div>
        </div>

        <div style="display:flex; gap:1rem; align-items:center; flex-wrap: wrap;">
          <div class="thumb" style="width:84px; height:84px;">
            ${
              r.thumbnailUrl
                ? `<img alt="${escapeHtml(r.name)} thumbnail" src="${escapeAttr(r.thumbnailUrl)}" />`
                : `<span>No<br/>image</span>`
            }
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
          Itineraries are now listed under the <strong>Itineraries</strong> tab.
        </p>
      </section>
    `;
  }

  function wireResortDetailView(resortId) {
    document.getElementById("btn-back")?.addEventListener("click", () => {
      setState({ view: "resorts", selectedResortId: null });
      render();
    });

    document.getElementById("btn-edit-resort")?.addEventListener("click", () =>
      openResortModal({ mode: "edit", resortId })
    );

    document.getElementById("btn-delete-resort")?.addEventListener("click", async () => {
      if (!confirm("Delete this resort? (Trips referencing it remain unless you delete them too.)")) return;
      const { error } = await sb.from("resorts").delete().eq("id", resortId);
      if (error) return alert(error.message);
      await refreshPublicData();
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
          primaryCity: city,
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
          ...(t.dayPlans || []).map((d) => d?.text),
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

    const editorBar = isEditorApproved()
      ? `<button id="btn-add-itin" class="btn-primary" type="button">Add Itinerary</button>`
      : `<span class="small muted">Log in + get approved to add/edit.</span>`;

    return `
      <section class="card">
        <div class="toolbar">
          <div style="flex:1; min-width: 220px;">
            <label class="field-label" for="itin-search">Search itineraries</label>
            <input id="itin-search" class="field-input" type="text"
              placeholder="Search text, resort, city/state/country..." value="${escapeHtml(state.itinSearch)}" />
          </div>
          <div class="btn-row">${editorBar}</div>
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

    const editorBtns = isEditorApproved()
      ? `<div class="btn-row">
          <button class="btn-ghost" type="button" data-itin-edit="${t.id}">Edit</button>
          <button class="btn-danger" type="button" data-itin-del="${t.id}">Delete</button>
        </div>`
      : "";

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
          ${editorBtns}
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

    document.getElementById("btn-add-itin")?.addEventListener("click", () => {
      openItinModal({ mode: "create" });
    });

    document.querySelectorAll("[data-itin-edit]").forEach((btn) => {
      btn.addEventListener("click", () =>
        openItinModal({ mode: "edit", itinId: btn.getAttribute("data-itin-edit") })
      );
    });

    document.querySelectorAll("[data-itin-del]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-itin-del");
        if (!confirm("Delete this itinerary?")) return;
        const { error } = await sb.from("trips").delete().eq("id", id);
        if (error) return alert(error.message);
        await refreshPublicData();
        render();
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

  // Resort modal
  function openResortModal({ mode, resortId = null }) {
    if (!isEditorApproved()) return alert("Editor approval required.");
    const { resorts } = getData();
    const r = mode === "edit" ? resorts.find((x) => x.id === resortId) : null;

    const initial =
      r || {
        name: "",
        location: "",
        thumbnailUrl: "",
        milesFromRochester: 0,
        verticalFeet: 0,
        trailCount: 0,
        mountainStars: 3,
        typicalFlightCost: 0,
        avgLodgingNight: 0,
        cheapestLodgingNight: 0,
        skiInOutNight: 0,
        areaActivitiesStars: 3,
      };

    openModal(`
      <h2>${mode === "edit" ? "Edit Resort" : "Add Resort"}</h2>
      <form id="resort-form" class="form-grid">
        <div class="grid-2">
          <div>
            <label class="field-label">Resort name</label>
            <input id="r-name" class="field-input" type="text" value="${escapeAttr(initial.name)}" required />
          </div>
          <div>
            <label class="field-label">Location</label>
            <input id="r-loc" class="field-input" type="text" value="${escapeAttr(initial.location)}" required />
          </div>
        </div>

        <div class="grid-2">
          <div>
            <label class="field-label">Thumbnail URL (optional)</label>
            <input id="r-thumb" class="field-input" type="text" value="${escapeAttr(initial.thumbnailUrl || "")}" placeholder="https://..." />
          </div>
          <div>
            <label class="field-label">Miles from Rochester</label>
            <input id="r-miles" class="field-input" type="number" min="0" step="1" value="${escapeAttr(initial.milesFromRochester)}" />
          </div>
        </div>

        <div class="grid-3">
          <div><label class="field-label">Vertical feet</label><input id="r-vert" class="field-input" type="number" min="0" step="1" value="${escapeAttr(initial.verticalFeet)}" /></div>
          <div><label class="field-label">Trails</label><input id="r-trails" class="field-input" type="number" min="0" step="1" value="${escapeAttr(initial.trailCount)}" /></div>
          <div><label class="field-label">Mountain stars (1–5)</label><input id="r-mstars" class="field-input" type="number" min="1" max="5" step="1" value="${escapeAttr(initial.mountainStars)}" /></div>
        </div>

        <div class="grid-3">
          <div><label class="field-label">Typical flight cost</label><input id="r-flight" class="field-input" type="number" min="0" step="1" value="${escapeAttr(initial.typicalFlightCost)}" /></div>
          <div><label class="field-label">Avg lodging/night</label><input id="r-avg" class="field-input" type="number" min="0" step="1" value="${escapeAttr(initial.avgLodgingNight)}" /></div>
          <div><label class="field-label">Cheapest/night</label><input id="r-cheap" class="field-input" type="number" min="0" step="1" value="${escapeAttr(initial.cheapestLodgingNight)}" /></div>
        </div>

        <div class="grid-2">
          <div><label class="field-label">Ski-in/ski-out/night</label><input id="r-skiio" class="field-input" type="number" min="0" step="1" value="${escapeAttr(initial.skiInOutNight)}" /></div>
          <div><label class="field-label">Area activities stars (1–5)</label><input id="r-astars" class="field-input" type="number" min="1" max="5" step="1" value="${escapeAttr(initial.areaActivitiesStars)}" /></div>
        </div>

        <div id="r-errors" class="inline-error"></div>

        <div class="modal-footer">
          <button class="btn-secondary" type="button" id="r-cancel">Cancel</button>
          <button class="btn-primary" type="submit">${mode === "edit" ? "Save" : "Create"}</button>
        </div>
      </form>
    `);

    document.getElementById("r-cancel")?.addEventListener("click", closeModal);

    document.getElementById("resort-form")?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const errEl = document.getElementById("r-errors");
      errEl.textContent = "";

      const payload = {
        name: document.getElementById("r-name").value.trim(),
        location: document.getElementById("r-loc").value.trim(),
        thumbnailUrl: document.getElementById("r-thumb").value.trim(),
        milesFromRochester: Number(document.getElementById("r-miles").value),
        verticalFeet: Number(document.getElementById("r-vert").value),
        trailCount: Number(document.getElementById("r-trails").value),
        mountainStars: Number(document.getElementById("r-mstars").value),
        typicalFlightCost: Number(document.getElementById("r-flight").value),
        avgLodgingNight: Number(document.getElementById("r-avg").value),
        cheapestLodgingNight: Number(document.getElementById("r-cheap").value),
        skiInOutNight: Number(document.getElementById("r-skiio").value),
        areaActivitiesStars: Number(document.getElementById("r-astars").value),
      };

      const errors = validateResortPayload(payload);
      if (errors.length) {
        errEl.textContent = errors.join(" ");
        return;
      }

      try {
        if (mode === "create") {
          const { error } = await sb.from("resorts").insert(resortInsertRow(payload));
          if (error) throw error;
        } else {
          const { error } = await sb.from("resorts").update(resortUpdateRow(payload)).eq("id", resortId);
          if (error) throw error;
        }

        await refreshPublicData();
        closeModal();
        render();
      } catch (err) {
        console.error(err);
        errEl.textContent = err.message || "Save failed.";
      }
    });
  }

  // Itinerary modal
  function openItinModal({ mode, itinId = null }) {
    if (!isEditorApproved()) return alert("Editor approval required.");

    const { resorts, trips } = getData();
    const t = mode === "edit" ? trips.find((x) => x.id === itinId) : null;

    const initial =
      t || {
        resortId: "",
        days: 3,
        compositeScore: 75,
        costFlights: 0,
        costLodging: 0,
        costHotelOther: 0,
        dayPlans: Array.from({ length: 3 }, () => ({ text: "", city: "", state: "", country: "" })),
      };

    const daysN = Number(initial.days) || 1;
    const dayPlans = Array.from({ length: daysN }, (_, i) => ({
      text: initial.dayPlans?.[i]?.text ?? "",
      city: initial.dayPlans?.[i]?.city ?? "",
      state: initial.dayPlans?.[i]?.state ?? "",
      country: initial.dayPlans?.[i]?.country ?? "",
    }));

    openModal(`
      <h2>${mode === "edit" ? "Edit Itinerary" : "Add Itinerary"}</h2>

      <form id="itin-form" class="form-grid">
        <div class="grid-3">
          <div>
            <label class="field-label">Duration (days)</label>
            <input id="t-days" class="field-input" type="number" min="1" max="30" value="${escapeAttr(daysN)}" />
          </div>
          <div>
            <label class="field-label">Composite score (0–100)</label>
            <input id="t-score" class="field-input" type="number" min="0" max="100" value="${escapeAttr(initial.compositeScore)}" />
          </div>
          <div>
            <label class="field-label">Resort (optional link)</label>
            <select id="t-resort" class="field-select">
              <option value="">— none —</option>
              ${resorts
                .map(
                  (r) =>
                    `<option value="${r.id}" ${r.id === initial.resortId ? "selected" : ""}>${escapeHtml(r.name)}</option>`
                )
                .join("")}
            </select>
          </div>
        </div>

        <div class="grid-3">
          <div><label class="field-label">Flights</label><input id="t-flights" class="field-input" type="number" min="0" step="1" value="${escapeAttr(initial.costFlights)}" /></div>
          <div><label class="field-label">Lodging</label><input id="t-lodging" class="field-input" type="number" min="0" step="1" value="${escapeAttr(initial.costLodging)}" /></div>
          <div><label class="field-label">Hotel/Transit</label><input id="t-hotel" class="field-input" type="number" min="0" step="1" value="${escapeAttr(initial.costHotelOther)}" /></div>
        </div>

        <div class="toolbar" style="margin:0 0 .35rem;">
          <div>
            <div class="field-label">Day-by-day plan</div>
            <div class="small muted">Each day includes text + City/State/Country. Use “Same as prior day” to copy location.</div>
          </div>
          <div class="btn-row">
            <button class="btn-secondary" type="button" id="btn-add-day">+ Day</button>
            <button class="btn-ghost" type="button" id="btn-remove-day">− Day</button>
          </div>
        </div>

        <div id="day-plans" class="form-grid">
          ${dayPlans.map((d, i) => dayRowHTML(i, d)).join("")}
        </div>

        <div id="t-errors" class="inline-error"></div>

        <div class="modal-footer">
          <button class="btn-secondary" type="button" id="t-cancel">Cancel</button>
          <button class="btn-primary" type="submit">${mode === "edit" ? "Save" : "Create"}</button>
        </div>
      </form>
    `);

    document.getElementById("t-cancel")?.addEventListener("click", closeModal);

    const dayContainer = document.getElementById("day-plans");
    const daysEl = document.getElementById("t-days");

    function syncDaysInput() {
      const count = dayContainer.querySelectorAll("[data-day-row]").length;
      daysEl.value = String(count);
    }

    document.getElementById("btn-add-day")?.addEventListener("click", () => {
      const count = dayContainer.querySelectorAll("[data-day-row]").length;
      dayContainer.insertAdjacentHTML("beforeend", dayRowHTML(count, { text: "", city: "", state: "", country: "" }));
      syncDaysInput();
      wireSameAsPriorHandlers();
    });

    document.getElementById("btn-remove-day")?.addEventListener("click", () => {
      const rows = dayContainer.querySelectorAll("[data-day-row]");
      if (rows.length <= 1) return;
      rows[rows.length - 1].remove();
      syncDaysInput();
    });

    daysEl?.addEventListener("change", () => {
      const target = clamp(Number(daysEl.value), 1, 30);
      daysEl.value = String(target);
      const existing = collectDayPlansFromDOM();
      dayContainer.innerHTML = "";
      for (let i = 0; i < target; i++) {
        dayContainer.insertAdjacentHTML(
          "beforeend",
          dayRowHTML(i, existing[i] || { text: "", city: "", state: "", country: "" })
        );
      }
      wireSameAsPriorHandlers();
    });

    function collectDayPlansFromDOM() {
      const rows = Array.from(dayContainer.querySelectorAll("[data-day-row]"));
      return rows.map((row) => ({
        text: row.querySelector("[data-field='text']").value,
        city: row.querySelector("[data-field='city']").value,
        state: row.querySelector("[data-field='state']").value,
        country: row.querySelector("[data-field='country']").value,
      }));
    }

    function wireSameAsPriorHandlers() {
      dayContainer.querySelectorAll("[data-same-as-prior]").forEach((cb) => {
        cb.addEventListener("change", () => {
          const idx = Number(cb.getAttribute("data-same-as-prior"));
          if (idx <= 0) return;
          const rows = Array.from(dayContainer.querySelectorAll("[data-day-row]"));
          const prev = rows[idx - 1];
          const cur = rows[idx];
          if (!prev || !cur) return;

          if (cb.checked) {
            cur.querySelector("[data-field='city']").value = prev.querySelector("[data-field='city']").value;
            cur.querySelector("[data-field='state']").value = prev.querySelector("[data-field='state']").value;
            cur.querySelector("[data-field='country']").value = prev.querySelector("[data-field='country']").value;
          }
        });
      });
    }
    wireSameAsPriorHandlers();

    document.getElementById("itin-form")?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const errEl = document.getElementById("t-errors");
      errEl.textContent = "";

      const dayPlansOut = collectDayPlansFromDOM().map((d) => ({
        text: String(d.text || "").trim(),
        city: d.city ? String(d.city).trim() : null,
        state: d.state ? String(d.state).trim() : null,
        country: d.country ? String(d.country).trim() : null,
      }));

      const payload = {
        resortId: document.getElementById("t-resort").value || null,
        days: Number(document.getElementById("t-days").value),
        compositeScore: Number(document.getElementById("t-score").value),
        costFlights: Number(document.getElementById("t-flights").value),
        costLodging: Number(document.getElementById("t-lodging").value),
        costHotelOther: Number(document.getElementById("t-hotel").value),
        dayPlans: dayPlansOut,
      };

      const errors = validateTripPayload(payload);
      if (errors.length) {
        errEl.textContent = errors.join(" ");
        return;
      }

      try {
        if (mode === "create") {
          const { error } = await sb.from("trips").insert(tripInsertRow(payload));
          if (error) throw error;
        } else {
          const { error } = await sb.from("trips").update(tripUpdateRow(payload)).eq("id", itinId);
          if (error) throw error;
        }

        await refreshPublicData();
        closeModal();
        render();
      } catch (err) {
        console.error(err);
        errEl.textContent = err.message || "Save failed.";
      }
    });
  }

  function dayRowHTML(i, d) {
    return `
      <div data-day-row="1" class="trip-card" style="padding:.8rem;">
        <div class="toolbar" style="margin:0 0 .5rem;">
          <div><strong>Day ${i + 1}</strong></div>
          <div class="btn-row">
            ${
              i > 0
                ? `<label class="small muted" style="display:flex; gap:.35rem; align-items:center;">
                  <input type="checkbox" data-same-as-prior="${i}" />
                  Same as prior day
                </label>`
                : ``
            }
          </div>
        </div>

        <label class="field-label">Summary</label>
        <textarea class="field-input" rows="2" data-field="text" placeholder="Activities / plan...">${escapeHtml(
          d.text || ""
        )}</textarea>

        <div class="grid-3" style="margin-top:.6rem;">
          <div>
            <label class="field-label">City</label>
            <input class="field-input" type="text" data-field="city" value="${escapeAttr(d.city || "")}" />
          </div>
          <div>
            <label class="field-label">State/Province</label>
            <input class="field-input" type="text" data-field="state" value="${escapeAttr(d.state || "")}" />
          </div>
          <div>
            <label class="field-label">Country</label>
            <input class="field-input" type="text" data-field="country" value="${escapeAttr(d.country || "")}" />
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================
  // App init + tabs
  // =========================================================

  function wireTabs() {
    document.getElementById("tab-resorts")?.addEventListener("click", () => {
      setState({ view: "resorts", selectedResortId: null });
      render();
    });

    document.getElementById("tab-itins")?.addEventListener("click", () => {
      setState({ view: "itins", selectedResortId: null });
      render();
    });
  }

  document.addEventListener("DOMContentLoaded", async () => {
    // This log should appear. If it doesn't, script.js isn't loading.
    console.log("[PowderFiles] script.js loaded");

    wireAuthUI();
    wireTabs();

    await refreshAuthState();
    await refreshPublicData();

    setState({ view: "resorts" });
    render();

    sb.auth.onAuthStateChange(async () => {
      await refreshAuthState();
      await refreshPublicData();
      render();
    });
  });
})();
