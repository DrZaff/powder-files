// =========================================================
// The Powder Files — Public site + approved editors
// Adds: working Add/Edit/Delete Resort + file uploads (thumbnail + trail map)
// Updates requested (JS-side):
// - Trips label already set (Itineraries -> Trips)
// - Remove Edit/Delete buttons on Resorts list (only in resort detail view)
// - Add additional star metrics fields to Resort add/edit + detail view
// =========================================================

if (window.__powderfiles_script_loaded) {
  console.warn(
    "[PowderFiles] script.js loaded more than once — skipping re-init to prevent redeclare crash."
  );
} else {
  window.__powderfiles_script_loaded = true;

  console.log("[PowderFiles] script.js loaded");

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

  const supabase = window.__powder_supabase;

  const STORAGE_KEY = "powderfiles_public_cache_v1";
  const RESORT_BUCKET = "resort-assets";

  const state = {
    view: "resorts", // resorts | itins | resortDetail
    selectedResortId: null,
    resortSearch: "",
    itinSearch: "",

    user: null,
    session: null,

    editorStatus: "none", // none | pending | approved | rejected
    username: null,

    groupId: null,
    groupRole: null
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
    const v = clamp(Math.round(x), 0, 5);
    const full = "★".repeat(v);
    const empty = "☆".repeat(5 - v);
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

  function nowIsoSafe() {
    return new Date().toISOString().replaceAll(":", "-");
  }

  function extFromFile(file) {
    const name = file?.name || "";
    const idx = name.lastIndexOf(".");
    return idx >= 0 ? name.slice(idx + 1).toLowerCase() : "";
  }

  function buildLocation(city, st, country) {
    const parts = [city, st, country].map((x) => (x || "").trim()).filter(Boolean);
    return parts.join(", ");
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
  // Groups
  // =========================================================
  async function fetchMyGroupMembership() {
    if (!state.user) {
      setState({ groupId: null, groupRole: null });
      return;
    }

    try {
      const { data, error } = await supabase
        .from("group_members")
        .select("group_id, role")
        .eq("user_id", state.user.id);

      if (error) {
        console.warn("[PowderFiles] group_members read error:", error);
        setState({ groupId: null, groupRole: null });
        return;
      }

      const rows = Array.isArray(data) ? data : [];
      if (!rows.length) {
        setState({ groupId: null, groupRole: null });
        return;
      }

      const preferred =
        rows.find((r) => ["owner", "editor"].includes(String(r.role || "").toLowerCase())) || rows[0];

      setState({
        groupId: preferred.group_id || null,
        groupRole: preferred.role || null
      });
    } catch (e) {
      console.warn("[PowderFiles] group_members read exception:", e);
      setState({ groupId: null, groupRole: null });
    }
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

      await fetchMyGroupMembership();
    } else {
      setState({ editorStatus: "none", username: null, groupId: null, groupRole: null });
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

  async function registerUser({ email, password, username }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
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

  function storagePublicUrl(path) {
    if (!path) return "";
    const { data } = supabase.storage.from(RESORT_BUCKET).getPublicUrl(path);
    return data?.publicUrl || "";
  }

  function mapResortRowToUI(r) {
    const thumbUrl = r.thumbnail_path ? storagePublicUrl(r.thumbnail_path) : (r.thumbnail_url ?? "");

    return {
      id: r.id,
      name: r.name,
      location: r.location,
      milesFromRochester: r.miles_from_rochester ?? 0,
      verticalFeet: r.vertical_feet ?? 0,
      trailCount: r.trail_count ?? 0,

      // semantics:
      resortQuality: r.mountain_stars ?? 3,
      resortValue: r.typical_flight_cost ?? 3, // reused column
      thingsToDo: r.area_activities_stars ?? 3,

      avgLodgingNight: r.avg_lodging_night ?? 0,
      cheapestLodgingNight: r.cheapest_lodging_night ?? 0,
      skiInOutNight: r.ski_in_out_night ?? 0,

      // NEW star metrics (assumed columns)
      mountainDifficulty: r.mountain_difficulty_stars ?? 0,
      mountainMaintenance: r.mountain_maintenance_stars ?? 0,
      lodgeQuality: r.lodge_quality_stars ?? 0,
      trailVariety: r.trail_variety_stars ?? 0,
      trailLength: r.trail_length_stars ?? 0,
      gladesQuality: r.glades_quality_stars ?? 0,
      terrainParkQuality: r.terrain_park_quality_stars ?? 0,

      thumbnailUrl: thumbUrl,
      thumbnailPath: r.thumbnail_path ?? "",
      trailMapUrl: r.trail_map_url ?? "",

      createdAt: r.created_at ? Date.parse(r.created_at) : Date.now(),
      updatedAt: r.updated_at ? Date.parse(r.updated_at) : Date.now(),

      createdBy: r.created_by ?? null,
      groupId: r.group_id ?? null
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
  // Storage upload helpers
  // =========================================================
  async function uploadResortFile({ file, kind }) {
    if (!file) return { path: "", publicUrl: "" };
    if (!state.user) throw new Error("You must be logged in.");
    if (!state.groupId) throw new Error("No group membership found for your user. (group_id is required)");

    const ext = extFromFile(file) || (kind === "trailmap" ? "pdf" : "jpg");
    const safeKind = kind === "trailmap" ? "trailmaps" : "thumbnails";

    const path = `${state.groupId}/${safeKind}/${state.user.id}/${nowIsoSafe()}-${crypto.randomUUID()}.${ext}`;

    const { error } = await supabase.storage.from(RESORT_BUCKET).upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || undefined
    });

    if (error) throw error;

    const publicUrl = storagePublicUrl(path);
    return { path, publicUrl };
  }

  // =========================================================
  // Resort Create / Update / Delete
  // =========================================================
  async function createResort(payload) {
    if (!state.user) throw new Error("You must be logged in.");
    if (!state.groupId) throw new Error("No group membership found for your user. (group_id is required)");
    if (!isEditorApproved()) throw new Error("You must be an approved editor to add resorts.");

    const row = {
      group_id: state.groupId,
      created_by: state.user.id,

      name: payload.name,
      location: payload.location,

      miles_from_rochester: payload.milesFromRochester,
      vertical_feet: payload.verticalFeet,
      trail_count: payload.trailCount,

      mountain_stars: payload.resortQuality,
      typical_flight_cost: payload.resortValue, // reused column
      area_activities_stars: payload.thingsToDo,

      avg_lodging_night: payload.avgLodgingNight,
      cheapest_lodging_night: payload.cheapestLodgingNight,
      ski_in_out_night: payload.skiInOutNight,

      // NEW star metrics
      mountain_difficulty_stars: payload.mountainDifficulty,
      mountain_maintenance_stars: payload.mountainMaintenance,
      lodge_quality_stars: payload.lodgeQuality,
      trail_variety_stars: payload.trailVariety,
      trail_length_stars: payload.trailLength,
      glades_quality_stars: payload.gladesQuality,
      terrain_park_quality_stars: payload.terrainParkQuality,

      thumbnail_path: payload.thumbnailPath || null,
      trail_map_url: payload.trailMapUrl || null
    };

    const { error } = await supabase.from("resorts").insert(row);
    if (error) throw error;
  }

  async function updateResort(resortId, payload) {
    if (!state.user) throw new Error("You must be logged in.");
    if (!state.groupId) throw new Error("No group membership found for your user. (group_id is required)");
    if (!isEditorApproved()) throw new Error("You must be an approved editor to edit resorts.");

    const row = {
      name: payload.name,
      location: payload.location,

      miles_from_rochester: payload.milesFromRochester,
      vertical_feet: payload.verticalFeet,
      trail_count: payload.trailCount,

      mountain_stars: payload.resortQuality,
      typical_flight_cost: payload.resortValue,
      area_activities_stars: payload.thingsToDo,

      avg_lodging_night: payload.avgLodgingNight,
      cheapest_lodging_night: payload.cheapestLodgingNight,
      ski_in_out_night: payload.skiInOutNight,

      // NEW star metrics
      mountain_difficulty_stars: payload.mountainDifficulty,
      mountain_maintenance_stars: payload.mountainMaintenance,
      lodge_quality_stars: payload.lodgeQuality,
      trail_variety_stars: payload.trailVariety,
      trail_length_stars: payload.trailLength,
      glades_quality_stars: payload.gladesQuality,
      terrain_park_quality_stars: payload.terrainParkQuality
    };

    if (payload.thumbnailPath !== undefined) row.thumbnail_path = payload.thumbnailPath || null;
    if (payload.trailMapUrl !== undefined) row.trail_map_url = payload.trailMapUrl || null;

    const { error } = await supabase.from("resorts").update(row).eq("id", resortId);
    if (error) throw error;
  }

  async function deleteResort(resortId) {
    if (!state.user) throw new Error("You must be logged in.");
    if (!state.groupId) throw new Error("No group membership found for your user. (group_id is required)");
    if (!isEditorApproved()) throw new Error("You must be an approved editor to delete resorts.");

    const { error } = await supabase.from("resorts").delete().eq("id", resortId);
    if (error) throw error;
  }

  // =========================================================
  // Star picker UI
  // =========================================================
  function starsPickerHTML({ id, label, value = 3, help = "" }) {
    const v = clamp(Number(value) || 0, 0, 5);
    return `
      <div>
        <label class="field-label">${escapeHtml(label)}</label>
        <div class="stars" data-stars="${escapeAttr(id)}" role="radiogroup" aria-label="${escapeAttr(label)}">
          ${[1, 2, 3, 4, 5]
            .map(
              (n) => `
            <button type="button"
              class="star-btn ${n <= v ? "star-btn--on" : ""}"
              data-star="${n}"
              aria-checked="${n === v ? "true" : "false"}"
              role="radio">★</button>
          `
            )
            .join("")}
        </div>
        <input type="hidden" id="${escapeAttr(id)}" value="${escapeAttr(String(v))}" />
        ${help ? `<div class="small muted">${escapeHtml(help)}</div>` : ``}
      </div>
    `;
  }

  function wireStarsPickers(scopeEl = document) {
    scopeEl.querySelectorAll(".stars[data-stars]").forEach((wrap) => {
      wrap.addEventListener("click", (e) => {
        const btn = e.target.closest(".star-btn");
        if (!btn) return;
        const n = Number(btn.getAttribute("data-star")) || 0;

        const inputId = wrap.getAttribute("data-stars");
        const input = document.getElementById(inputId);
        if (input) input.value = String(n);

        wrap.querySelectorAll(".star-btn").forEach((b) => {
          const bn = Number(b.getAttribute("data-star")) || 0;
          b.classList.toggle("star-btn--on", bn <= n);
          b.setAttribute("aria-checked", bn === n ? "true" : "false");
        });
      });
    });
  }

  // =========================================================
  // Resort Modals
  // =========================================================
  function openAddResortModal() {
    if (!state.user) return alert("Please log in first.");
    if (!isEditorApproved()) return alert("You must be an approved editor to add resorts.");
    if (!state.groupId) {
      return alert("No group membership found for your user.\n\nFix: ensure your user exists in group_members with a valid group_id.");
    }
    openResortModal({ mode: "add" });
  }

  function openEditResortModal(resortId) {
    const { resorts } = loadCache();
    const r = resorts.find((x) => x.id === resortId);
    if (!r) return alert("Resort not found.");
    if (!state.user) return alert("Please log in first.");
    if (!isEditorApproved()) return alert("You must be an approved editor to edit resorts.");
    openResortModal({ mode: "edit", resort: r });
  }

  function openResortModal({ mode, resort }) {
    const isEdit = mode === "edit";
    const title = isEdit ? "Edit Resort" : "Add Resort";

    const locParts = String(resort?.location || "").split(",").map((s) => s.trim()).filter(Boolean);
    const city0 = isEdit ? (locParts[0] || "") : "";
    const state0 = isEdit ? (locParts[1] || "") : "";
    const country0 = isEdit ? (locParts[2] || "") : "";

    openModal(`
      <h2>${escapeHtml(title)}</h2>
      <p class="small muted">Thumbnail + Trail Map are uploaded files. Star ratings are clickable.</p>

      <form id="resort-form" class="form-grid">
        <div class="grid-2">
          <div>
            <label class="field-label">Resort name</label>
            <input id="r-name" class="field-input" type="text" required value="${escapeAttr(resort?.name || "")}" />
          </div>
          <div>
            <label class="field-label">Miles from Rochester</label>
            <input id="r-miles" class="field-input" type="number" min="0" step="1" value="${escapeAttr(String(resort?.milesFromRochester ?? 0))}" required />
          </div>
        </div>

        <div class="grid-3">
          <div>
            <label class="field-label">City</label>
            <input id="r-city" class="field-input" type="text" placeholder="e.g., Aspen" value="${escapeAttr(city0)}" />
          </div>
          <div>
            <label class="field-label">State</label>
            <input id="r-state" class="field-input" type="text" placeholder="e.g., CO" value="${escapeAttr(state0)}" />
          </div>
          <div>
            <label class="field-label">Country</label>
            <input id="r-country" class="field-input" type="text" placeholder="e.g., USA" value="${escapeAttr(country0)}" />
          </div>
        </div>

        <div class="grid-3">
          <div>
            <label class="field-label">Vertical (ft)</label>
            <input id="r-vert" class="field-input" type="number" min="0" step="1" value="${escapeAttr(String(resort?.verticalFeet ?? 0))}" required />
          </div>
          <div>
            <label class="field-label">Trail count</label>
            <input id="r-trails" class="field-input" type="number" min="0" step="1" value="${escapeAttr(String(resort?.trailCount ?? 0))}" required />
          </div>
          <div>
            ${starsPickerHTML({
              id: "r-quality",
              label: "Resort Quality",
              value: resort?.resortQuality ?? 3
            })}
          </div>
        </div>

        <div class="grid-3">
          <div>
            ${starsPickerHTML({
              id: "r-value",
              label: "Resort Value",
              value: resort?.resortValue ?? 3
            })}
          </div>
          <div>
            <label class="field-label">Avg lodging / night ($)</label>
            <input id="r-avg-lodge" class="field-input" type="number" min="0" step="1" value="${escapeAttr(String(resort?.avgLodgingNight ?? 0))}" required />
          </div>
          <div>
            <label class="field-label">Cheapest lodging / night ($)</label>
            <input id="r-cheap-lodge" class="field-input" type="number" min="0" step="1" value="${escapeAttr(String(resort?.cheapestLodgingNight ?? 0))}" required />
          </div>
        </div>

        <div class="grid-2">
          <div>
            <label class="field-label">Ski-in/ski-out / night ($)</label>
            <input id="r-skiio" class="field-input" type="number" min="0" step="1" value="${escapeAttr(String(resort?.skiInOutNight ?? 0))}" required />
          </div>
          <div>
            ${starsPickerHTML({
              id: "r-ttd",
              label: "Things To Do in the Region",
              value: resort?.thingsToDo ?? 3
            })}
          </div>
        </div>

        <div class="hr"></div>
        <h3 style="margin:.25rem 0;">Mountain & Terrain Metrics</h3>

        <div class="grid-3">
          ${starsPickerHTML({ id: "r-mdiff", label: "Mountain Difficulty", value: resort?.mountainDifficulty ?? 0 })}
          ${starsPickerHTML({ id: "r-mmaint", label: "Mountain Maintenance", value: resort?.mountainMaintenance ?? 0 })}
          ${starsPickerHTML({ id: "r-lodgeq", label: "Lodge Quality", value: resort?.lodgeQuality ?? 0 })}
        </div>

        <div class="grid-3">
          ${starsPickerHTML({ id: "r-tvar", label: "Trail Variety", value: resort?.trailVariety ?? 0 })}
          ${starsPickerHTML({ id: "r-tlen", label: "Trail Length", value: resort?.trailLength ?? 0 })}
          ${starsPickerHTML({ id: "r-glades", label: "Glades Quality", value: resort?.gladesQuality ?? 0 })}
        </div>

        <div class="grid-2">
          <div>
            ${starsPickerHTML({ id: "r-park", label: "Terrain Park Quality", value: resort?.terrainParkQuality ?? 0 })}
          </div>
          <div></div>
        </div>

        <div class="grid-2">
          <div>
            <label class="field-label">Thumbnail image (upload)</label>
            <input id="r-thumb-file" class="field-input" type="file" accept="image/*" />
            <div class="small muted">
              ${isEdit && resort?.thumbnailUrl ? `Current: <a href="${escapeAttr(resort.thumbnailUrl)}" target="_blank" rel="noopener noreferrer">view</a>` : "Recommended: square-ish JPG/PNG/WebP."}
            </div>
          </div>
          <div>
            <label class="field-label">Trail map (upload)</label>
            <input id="r-trailmap-file" class="field-input" type="file" accept="application/pdf,image/*" />
            <div class="small muted">
              ${isEdit && resort?.trailMapUrl ? `Current: <a href="${escapeAttr(resort.trailMapUrl)}" target="_blank" rel="noopener noreferrer">open</a>` : "PDF preferred; images also accepted."}
            </div>
          </div>
        </div>

        <div id="resort-errors" class="inline-error"></div>

        <div class="modal-footer">
          <button class="btn-secondary" type="button" id="r-cancel">Cancel</button>
          <button class="btn-primary" type="submit" id="r-save">${isEdit ? "Save changes" : "Save"}</button>
        </div>
      </form>
    `);

    wireStarsPickers(document.getElementById("modal-backdrop"));

    document.getElementById("r-cancel")?.addEventListener("click", closeModal);

    document.getElementById("resort-form")?.addEventListener("submit", async (e) => {
      e.preventDefault();

      const errEl = document.getElementById("resort-errors");
      errEl.textContent = "";

      const btn = document.getElementById("r-save");
      if (btn) btn.disabled = true;

      try {
        const name = document.getElementById("r-name").value.trim();

        const city = document.getElementById("r-city").value.trim();
        const st = document.getElementById("r-state").value.trim();
        const country = document.getElementById("r-country").value.trim();
        const location = buildLocation(city, st, country);

        if (!name) throw new Error("Resort name is required.");
        if (!location) throw new Error("Please enter at least City/State/Country (for Location).");

        const milesFromRochester = Number(document.getElementById("r-miles").value);
        const verticalFeet = Number(document.getElementById("r-vert").value);
        const trailCount = Number(document.getElementById("r-trails").value);

        const resortQuality = Number(document.getElementById("r-quality").value);
        const resortValue = Number(document.getElementById("r-value").value);
        const thingsToDo = Number(document.getElementById("r-ttd").value);

        const avgLodgingNight = Number(document.getElementById("r-avg-lodge").value);
        const cheapestLodgingNight = Number(document.getElementById("r-cheap-lodge").value);
        const skiInOutNight = Number(document.getElementById("r-skiio").value);

        const mountainDifficulty = Number(document.getElementById("r-mdiff").value);
        const mountainMaintenance = Number(document.getElementById("r-mmaint").value);
        const lodgeQuality = Number(document.getElementById("r-lodgeq").value);
        const trailVariety = Number(document.getElementById("r-tvar").value);
        const trailLength = Number(document.getElementById("r-tlen").value);
        const gladesQuality = Number(document.getElementById("r-glades").value);
        const terrainParkQuality = Number(document.getElementById("r-park").value);

        const thumbFile = document.getElementById("r-thumb-file").files?.[0] || null;
        const trailMapFile = document.getElementById("r-trailmap-file").files?.[0] || null;

        let thumbnailPath = undefined; // undefined = leave as-is
        let trailMapUrl = undefined;

        if (thumbFile) {
          const up = await uploadResortFile({ file: thumbFile, kind: "thumbnail" });
          thumbnailPath = up.path;
        } else if (!isEdit) {
          thumbnailPath = "";
        }

        if (trailMapFile) {
          const up = await uploadResortFile({ file: trailMapFile, kind: "trailmap" });
          trailMapUrl = up.publicUrl;
        } else if (!isEdit) {
          trailMapUrl = "";
        }

        const payload = {
          name,
          location,
          milesFromRochester,
          verticalFeet,
          trailCount,
          resortQuality,
          resortValue,
          thingsToDo,
          avgLodgingNight,
          cheapestLodgingNight,
          skiInOutNight,

          mountainDifficulty,
          mountainMaintenance,
          lodgeQuality,
          trailVariety,
          trailLength,
          gladesQuality,
          terrainParkQuality,

          thumbnailPath,
          trailMapUrl
        };

        if (!isEdit) {
          await createResort(payload);
        } else {
          await updateResort(resort.id, payload);
        }

        closeModal();
        await refreshPublicData();
        render();
        alert(isEdit ? "Resort updated." : "Resort saved.");
      } catch (err) {
        console.error("[PowderFiles] resort save exception:", err);
        errEl.textContent = err?.message || "Failed to save resort.";
      } finally {
        if (btn) btn.disabled = false;
      }
    });
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

    if (tabItins) tabItins.textContent = "Trips";

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
  // Resorts List (NO edit/delete here)
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
          ${filtered.length ? filtered.map(resortRowHTML).join("") : `<p class="muted">No resorts found.</p>`}
        </div>
      </section>
    `;
  }

  function resortRowHTML(r) {
    const thumb = r.thumbnailUrl
      ? `<img alt="${escapeHtml(r.name)} thumbnail" src="${escapeAttr(r.thumbnailUrl)}" />`
      : `<span>No<br/>image</span>`;

    return `
      <button class="resort-btn" type="button" data-open-resort="${escapeAttr(r.id)}">
        <div class="thumb">${thumb}</div>
        <div class="resort-meta">
          <h3>${escapeHtml(r.name)}</h3>
          <p>
            ${escapeHtml(r.location)}
            • ${stars(r.resortQuality)}
            • ${Number(r.verticalFeet || 0).toLocaleString()} ft
          </p>
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
  // Resort detail (Edit/Delete ONLY here)
  // -------------------------
  function renderResortDetailView(resortId) {
    const { resorts } = getData();
    const r = resorts.find((x) => x.id === resortId);
    if (!r) {
      return `<section class="card"><p class="muted">Resort not found.</p><button id="btn-back" class="btn-secondary" type="button">Back</button></section>`;
    }

    const editorControls = isEditorApproved()
      ? `
        <div class="btn-row" style="gap:.4rem;">
          <button id="btn-edit-resort" class="btn-ghost" type="button">Edit</button>
          <button id="btn-del-resort" class="btn-ghost" type="button">Delete</button>
        </div>
      `
      : ``;

    return `
      <section class="card resort-file">
        <div class="toolbar" style="align-items:center;">
          <div class="btn-row">
            <button id="btn-back" class="btn-secondary" type="button">← Back</button>
          </div>
          <div style="flex:1;"></div>
          ${editorControls}
        </div>

        <div class="resort-head">
          <div class="thumb resort-thumb" style="width:92px; height:92px;">
            ${r.thumbnailUrl ? `<img alt="${escapeHtml(r.name)} thumbnail" src="${escapeAttr(r.thumbnailUrl)}" />` : `<span>No<br/>image</span>`}
          </div>
          <div class="resort-head-meta">
            <h2 class="resort-title">${escapeHtml(r.name)}</h2>
            <div class="resort-sub">${escapeHtml(r.location)}</div>
          </div>
        </div>

        <div class="hr"></div>

        <div class="kpi">
          <span class="kpi-pill"><strong>Miles from Rochester</strong> ${Number(r.milesFromRochester).toLocaleString()}</span>
          <span class="kpi-pill"><strong>Vertical</strong> ${Number(r.verticalFeet).toLocaleString()} ft</span>
          <span class="kpi-pill"><strong>Trails</strong> ${Number(r.trailCount).toLocaleString()}</span>
        </div>

        <div class="hr"></div>

        <div class="grid-3">
          <div class="metric-card"><div class="field-label">Resort Quality</div><div class="metric-value">${stars(r.resortQuality)}</div></div>
          <div class="metric-card"><div class="field-label">Resort Value</div><div class="metric-value">${stars(r.resortValue)}</div></div>
          <div class="metric-card"><div class="field-label">Things To Do in the Region</div><div class="metric-value">${stars(r.thingsToDo)}</div></div>
        </div>

        <div class="hr"></div>

        <div class="grid-3">
          <div class="metric-card"><div class="field-label">Avg lodging / night</div><div class="money-value">${money(r.avgLodgingNight)}</div></div>
          <div class="metric-card"><div class="field-label">Cheapest lodging / night</div><div class="money-value">${money(r.cheapestLodgingNight)}</div></div>
          <div class="metric-card"><div class="field-label">Ski-in/ski-out / night</div><div class="money-value">${money(r.skiInOutNight)}</div></div>
        </div>

        <div class="hr"></div>

        <h3 class="section-title">Mountain & Terrain Metrics</h3>

        <div class="grid-3">
          <div class="metric-card"><div class="field-label">Mountain Difficulty</div><div class="metric-value">${stars(r.mountainDifficulty)}</div></div>
          <div class="metric-card"><div class="field-label">Mountain Maintenance</div><div class="metric-value">${stars(r.mountainMaintenance)}</div></div>
          <div class="metric-card"><div class="field-label">Lodge Quality</div><div class="metric-value">${stars(r.lodgeQuality)}</div></div>
        </div>

        <div class="grid-3" style="margin-top:.75rem;">
          <div class="metric-card"><div class="field-label">Trail Variety</div><div class="metric-value">${stars(r.trailVariety)}</div></div>
          <div class="metric-card"><div class="field-label">Trail Length</div><div class="metric-value">${stars(r.trailLength)}</div></div>
          <div class="metric-card"><div class="field-label">Glades Quality</div><div class="metric-value">${stars(r.gladesQuality)}</div></div>
        </div>

        <div class="grid-3" style="margin-top:.75rem;">
          <div class="metric-card"><div class="field-label">Terrain Park Quality</div><div class="metric-value">${stars(r.terrainParkQuality)}</div></div>
          <div></div><div></div>
        </div>

        ${r.trailMapUrl ? `
          <div class="hr"></div>
          <div class="trailmap-row">
            <div>
              <div class="field-label">Trail map</div>
              <div class="small muted">Opens in a new tab</div>
            </div>
            <a class="btn-secondary trailmap-btn"
               href="${escapeAttr(r.trailMapUrl)}" target="_blank" rel="noopener noreferrer">Open Trail Map</a>
          </div>
        ` : ""}

        <div class="hr"></div>
        <p class="small muted">
          Trips are listed under the <strong>Trips</strong> tab.
        </p>
      </section>
    `;
  }

  function wireResortDetailView(resortId) {
    document.getElementById("btn-back")?.addEventListener("click", () => {
      setState({ view: "resorts", selectedResortId: null });
      render();
    });

    document.getElementById("btn-edit-resort")?.addEventListener("click", () => {
      openEditResortModal(resortId);
    });

    document.getElementById("btn-del-resort")?.addEventListener("click", async () => {
      const ok = confirm("Delete this resort? This cannot be undone.");
      if (!ok) return;
      try {
        await deleteResort(resortId);
        setState({ view: "resorts", selectedResortId: null });
        await refreshPublicData();
        render();
        alert("Resort deleted.");
      } catch (err) {
        console.error("[PowderFiles] delete resort error:", err);
        alert(err?.message || "Failed to delete resort.");
      }
    });
  }

  // -------------------------
  // Trips View
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
            <label class="field-label" for="itin-search">Search trips</label>
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
    if (!durs.length) return `<p class="muted">No trips found.</p>`;

    let html = "";
    for (const dur of durs) {
      html += `<div class="accordion">
        <button class="accordion-header" type="button" data-acc-dur="${dur}">
          <div>
            <div class="accordion-title">${dur}-Day Trips</div>
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
              ${t.days}-day trip <span class="pill-score">Score ${t.compositeScore}</span>
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
