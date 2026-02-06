// ===== Supabase Config =====
const SUPABASE_URL = "https://zpxvcvspiiueelmstyjb.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpweHZjdnNwaWl1ZWVsbXN0eWpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3MjA2ODIsImV4cCI6MjA4NTI5NjY4Mn0.pfpPInX45JLrZmqpXi1p4zIUoAn49oeg74KugseHIDU";

// Create supabase client exactly once (prevents "already declared" issues)
window.__powder_supabase =
  window.__powder_supabase || window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
var supabase = window.__powder_supabase;

// ===== App Keys =====
const STORAGE_KEY = "powderfiles_db_v1";             // local offline cache
const POWDER_GROUP_KEY = "powderfiles_group_id_v1";  // saved group id
const DEFAULT_GROUP_NAME = "The Powder Files";

// ===== App State =====
const state = {
  view: "resorts", // resorts | allTrips | resortDetail
  selectedResortId: null,
  resortSearch: "",
  tripSearch: "",
  tripSort: "scoreDesc", // scoreDesc | scoreAsc | daysDesc | daysAsc

  // auth
  user: null,
  session: null,

  // sharing
  groupId: null
};

function setState(patch) {
  Object.assign(state, patch);
}

/* =========================================================
   Supabase: Group Helpers
========================================================= */

function getGroupId() {
  return localStorage.getItem(POWDER_GROUP_KEY) || null;
}

function setGroupId(id) {
  localStorage.setItem(POWDER_GROUP_KEY, id);
}

async function ensureGroup() {
  if (!state.user) return null;

  const existing = getGroupId();
  if (existing) return existing;

  // Requires you created the SQL function: public.create_group_with_owner(text)
  const { data, error } = await supabase.rpc("create_group_with_owner", {
    group_name: DEFAULT_GROUP_NAME
  });

  if (error) {
    alert(`Group create failed: ${error.message}`);
    return null;
  }

  setGroupId(data);
  return data;
}

/* =========================================================
   Auth UI
========================================================= */

async function initAuthUI() {
  const statusEl = document.getElementById("auth-status");
  const btnLogin = document.getElementById("btn-login");
  const btnLogout = document.getElementById("btn-logout");
  const emailInput = document.getElementById("auth-email");

  let lastOtpSentAt = 0;

  async function refresh() {
    const { data } = await supabase.auth.getSession();
    const session = data.session ?? null;
    const user = session?.user ?? null;

    setState({ session, user });

    // Load groupId (either existing in localStorage or create once)
    if (user) {
      const gid = await ensureGroup();
      setState({ groupId: gid });
    } else {
      setState({ groupId: null });
    }

    // Update auth UI
    if (user) {
      statusEl.textContent = `Signed in: ${user.email}`;
      btnLogout.classList.remove("hidden");
      btnLogin.classList.add("hidden");
      emailInput.classList.add("hidden");
    } else {
      statusEl.textContent = "Not signed in";
      btnLogout.classList.add("hidden");
      btnLogin.classList.remove("hidden");
      emailInput.classList.remove("hidden");
    }
  }

  btnLogin?.addEventListener("click", async () => {
    const email = emailInput.value.trim();
    if (!email) return alert("Enter an email.");

    // simple cooldown to reduce 429 spam during dev
    const now = Date.now();
    const cooldownMs = 30_000;
    const remaining = cooldownMs - (now - lastOtpSentAt);
    if (remaining > 0) {
      alert(`Please wait ${Math.ceil(remaining / 1000)}s before requesting another link.`);
      return;
    }
    lastOtpSentAt = now;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin }
    });

    if (error) return alert(error.message);

    alert("Magic link sent. Open the link from your email on this device/browser.");
  });

  btnLogout?.addEventListener("click", async () => {
    await supabase.auth.signOut();
    await refresh();
    await initApp(); // reload local cache view after logout
  });

  supabase.auth.onAuthStateChange(async () => {
    await refresh();
    await initApp(); // reload data whenever auth changes
  });

  await refresh();
}

/* =========================================================
   Pure Helpers / Logic
========================================================= */

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

function clamp(n, lo, hi) {
  if (Number.isNaN(n)) return n;
  return Math.max(lo, Math.min(hi, n));
}

function money(n) {
  const x = Number(n);
  if (!Number.isFinite(x)) return "—";
  return `$${Math.round(x).toLocaleString()}`;
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
  const totalBase = flights + lodging + hotelOther;
  return { flights, lodging, hotelOther, totalBase };
}

function labelFor(key) {
  const map = {
    milesFromRochester: "Miles from Rochester, NY",
    verticalFeet: "Vertical feet",
    trailCount: "Trail count",
    mountainStars: "Mountain rating",
    typicalFlightCost: "Typical in-season flight cost",
    avgLodgingNight: "Average lodging cost/night",
    cheapestLodgingNight: "Cheapest lodging cost/night",
    skiInOutNight: "Ski-in/ski-out cost/night",
    areaActivitiesStars: "Area activities rating",
    costFlights: "Flights (per person)",
    costLodging: "Lodging (per person)",
    costHotelOther: "Hotel/Transit (per person)"
  };
  return map[key] || key;
}

function validateResortPayload(p) {
  const errors = [];
  if (!p.name?.trim()) errors.push("Resort name is required.");
  if (!p.location?.trim()) errors.push("Location is required.");

  const stars1 = Number(p.mountainStars);
  const stars2 = Number(p.areaActivitiesStars);
  if (!Number.isFinite(stars1) || stars1 < 1 || stars1 > 5) errors.push("Mountain rating must be 1–5 stars.");
  if (!Number.isFinite(stars2) || stars2 < 1 || stars2 > 5) errors.push("Area activities rating must be 1–5 stars.");

  [
    "milesFromRochester",
    "verticalFeet",
    "trailCount",
    "typicalFlightCost",
    "avgLodgingNight",
    "cheapestLodgingNight",
    "skiInOutNight"
  ].forEach(k => {
    const v = Number(p[k]);
    if (!Number.isFinite(v) || v < 0) errors.push(`${labelFor(k)} must be a valid number (≥ 0).`);
  });

  return errors;
}

function validateTripPayload(p) {
  const errors = [];
  const days = Number(p.days);
  if (!Number.isFinite(days) || days < 1 || days > 30) errors.push("Trip length must be 1–30 days.");

  const score = Number(p.compositeScore);
  if (!Number.isFinite(score) || score < 0 || score > 100) errors.push("Composite score must be 0–100.");

  ["costFlights", "costLodging", "costHotelOther"].forEach(k => {
    const v = Number(p[k]);
    if (!Number.isFinite(v) || v < 0) errors.push(`${labelFor(k)} must be a valid number (≥ 0).`);
  });

  if (!Array.isArray(p.dayPlans) || p.dayPlans.length !== days) {
    errors.push("Day plans must have exactly one entry per day.");
  } else {
    for (let i = 0; i < p.dayPlans.length; i++) {
      if (!String(p.dayPlans[i] ?? "").trim()) {
        errors.push(`Day ${i + 1} activity/summary is required.`);
        break;
      }
    }
  }

  return errors;
}

/* =========================================================
   Local Persistence (Offline Cache)
========================================================= */

function loadDB() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    if (!Array.isArray(parsed.resorts)) parsed.resorts = [];
    if (!Array.isArray(parsed.trips)) parsed.trips = [];
    return parsed;
  } catch {
    return null;
  }
}

function saveDB(db) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

function emptyDB() {
  return { resorts: [], trips: [], version: 1, source: "local" };
}

function seedDB() {
  const now = Date.now();
  const r1 = {
    id: uid("resort"),
    name: "Example Resort",
    location: "Somewhere, CO",
    thumbnailDataUrl: "",
    milesFromRochester: 1650,
    verticalFeet: 3200,
    trailCount: 115,
    mountainStars: 4,
    typicalFlightCost: 520,
    avgLodgingNight: 240,
    cheapestLodgingNight: 160,
    skiInOutNight: 420,
    areaActivitiesStars: 4,
    createdAt: now,
    updatedAt: now
  };

  const t1 = {
    id: uid("trip"),
    resortId: r1.id,
    days: 3,
    costFlights: 520,
    costLodging: 480,
    costHotelOther: 120,
    compositeScore: 86,
    dayPlans: [
      "Arrive + rental + afternoon warm-up laps + hot food.",
      "Full mountain day + sidecountry scouting + night in town.",
      "Early turns + pack + fly home."
    ],
    createdAt: now,
    updatedAt: now
  };

  return { resorts: [r1], trips: [t1], version: 1, source: "local-seed" };
}

function ensureLocalDBExists() {
  const existing = loadDB();
  if (existing) return existing;

  // If signed in, don't auto-seed (avoid confusion; Supabase is source of truth).
  // If signed out, seed for demo/offline use.
  const db = state.user ? emptyDB() : seedDB();
  saveDB(db);
  return db;
}

function getDB() {
  return ensureLocalDBExists();
}

/* =========================================================
   Supabase Mapping
   (Supabase schema assumed from your SQL: snake_case)
========================================================= */

function mapResortRowToUI(r) {
  return {
    id: r.id,
    name: r.name,
    location: r.location,
    // thumbnails via Storage later; keep local-only dataUrl for now
    thumbnailDataUrl: "",

    milesFromRochester: r.miles_from_rochester ?? 0,
    verticalFeet: r.vertical_feet ?? 0,
    trailCount: r.trail_count ?? 0,
    mountainStars: r.mountain_stars ?? 3,

    typicalFlightCost: r.typical_flight_cost ?? 0,
    avgLodgingNight: r.avg_lodging_night ?? 0,
    cheapestLodgingNight: r.cheapest_lodging_night ?? 0,
    skiInOutNight: r.ski_in_out_night ?? 0,
    areaActivitiesStars: r.area_activities_stars ?? 3,

    createdAt: r.created_at ? Date.parse(r.created_at) : Date.now(),
    updatedAt: r.updated_at ? Date.parse(r.updated_at) : Date.now()
  };
}

function mapTripRowToUI(t) {
  return {
    id: t.id,
    resortId: t.resort_id,
    days: t.days,
    costFlights: t.cost_flights ?? 0,
    costLodging: t.cost_lodging ?? 0,
    costHotelOther: t.cost_hotel_other ?? 0,
    compositeScore: t.composite_score ?? 0,
    dayPlans: Array.isArray(t.day_plans) ? t.day_plans : (t.day_plans || []),
    createdAt: t.created_at ? Date.parse(t.created_at) : Date.now(),
    updatedAt: t.updated_at ? Date.parse(t.updated_at) : Date.now()
  };
}

function mapResortUIToRow(payload) {
  return {
    group_id: state.groupId,
    name: payload.name,
    location: payload.location,
    thumbnail_path: null, // TODO: Supabase Storage later

    miles_from_rochester: Number(payload.milesFromRochester) || 0,
    vertical_feet: Number(payload.verticalFeet) || 0,
    trail_count: Number(payload.trailCount) || 0,
    mountain_stars: Number(payload.mountainStars) || 3,

    typical_flight_cost: Number(payload.typicalFlightCost) || 0,
    avg_lodging_night: Number(payload.avgLodgingNight) || 0,
    cheapest_lodging_night: Number(payload.cheapestLodgingNight) || 0,
    ski_in_out_night: Number(payload.skiInOutNight) || 0,
    area_activities_stars: Number(payload.areaActivitiesStars) || 3,

    created_by: state.user?.id
  };
}

function mapTripUIToRow(payload, resortId) {
  return {
    group_id: state.groupId,
    resort_id: resortId,

    days: Number(payload.days),
    cost_flights: Number(payload.costFlights) || 0,
    cost_lodging: Number(payload.costLodging) || 0,
    cost_hotel_other: Number(payload.costHotelOther) || 0,
    composite_score: Number(payload.compositeScore) || 0,
    day_plans: payload.dayPlans || [],

    created_by: state.user?.id
  };
}

/* =========================================================
   Supabase Reads/Writes
========================================================= */

async function fetchResortsFromSupabase(groupId) {
  const { data, error } = await supabase
    .from("resorts")
    .select("*")
    .eq("group_id", groupId)
    .order("name", { ascending: true });

  if (error) throw error;
  return data || [];
}

async function fetchTripsFromSupabase(groupId) {
  const { data, error } = await supabase
    .from("trips")
    .select("*")
    .eq("group_id", groupId);

  if (error) throw error;
  return data || [];
}

async function refreshFromSupabaseToLocalCache() {
  if (!state.user || !state.groupId) return;

  const [resortRows, tripRows] = await Promise.all([
    fetchResortsFromSupabase(state.groupId),
    fetchTripsFromSupabase(state.groupId)
  ]);

  const db = {
    resorts: resortRows.map(mapResortRowToUI),
    trips: tripRows.map(mapTripRowToUI),
    version: 2,
    source: "supabase"
  };

  saveDB(db);
}

/* =========================================================
   App Init
========================================================= */

document.addEventListener("DOMContentLoaded", async () => {
  await initAuthUI();
  wireTabs();
  await initApp();
});

async function initApp() {
  // Ensure local cache exists (seed only when logged out)
  ensureLocalDBExists();

  // If signed in, refresh local cache from Supabase
  if (state.user && state.groupId) {
    try {
      await refreshFromSupabaseToLocalCache();
    } catch (e) {
      console.warn("Supabase load failed; using local cache.", e);
    }
  }

  setState({
    view: "resorts",
    selectedResortId: null,
    resortSearch: "",
    tripSearch: "",
    tripSort: "scoreDesc"
  });

  render();
}

/* =========================================================
   Tabs
========================================================= */

function wireTabs() {
  const tabResorts = document.getElementById("tab-resorts");
  const tabTrips = document.getElementById("tab-trips");

  tabResorts.addEventListener("click", () => {
    setState({ view: "resorts", selectedResortId: null });
    render();
  });

  tabTrips.addEventListener("click", () => {
    setState({ view: "allTrips", selectedResortId: null });
    render();
  });
}

/* =========================================================
   CRUD (Write-through)
========================================================= */

async function upsertResort(payload, { id = null } = {}) {
  const db = getDB();
  const now = Date.now();
  const errors = validateResortPayload(payload);
  if (errors.length) return { ok: false, errors };

  // Local update first (offline-first UX)
  if (id) {
    const idx = db.resorts.findIndex(r => r.id === id);
    if (idx === -1) return { ok: false, errors: ["Resort not found."] };
    db.resorts[idx] = { ...db.resorts[idx], ...payload, id, updatedAt: now };
  } else {
    const resort = { ...payload, id: uid("resort"), createdAt: now, updatedAt: now };
    db.resorts.push(resort);
    id = resort.id;
  }
  saveDB(db);

  // If signed in, write to Supabase
  if (state.user && state.groupId) {
    try {
      const row = mapResortUIToRow(payload);

      if (!id.startsWith("resort_")) {
        // already a UUID, treat as update
      }

      if (db.resorts.find(r => r.id === id)?.id?.startsWith("resort_")) {
        // Local-only ID — create in Supabase, then replace local ID with UUID
        const { data, error } = await supabase
          .from("resorts")
          .insert(row)
          .select("*")
          .single();

        if (error) throw error;

        const newId = data.id;
        // Replace resort id in local cache + update all associated trips resortId
        const db2 = getDB();
        db2.resorts = db2.resorts.map(r => (r.id === id ? { ...r, id: newId } : r));
        db2.trips = db2.trips.map(t => (t.resortId === id ? { ...t, resortId: newId } : t));
        saveDB(db2);
        return { ok: true, newId };
      } else {
        // UUID already: update
        const { error } = await supabase
          .from("resorts")
          .update(row)
          .eq("id", id);

        if (error) throw error;
      }

      // pull fresh cache (optional; keeps timestamps consistent)
      await refreshFromSupabaseToLocalCache();
    } catch (e) {
      console.warn("Supabase resort upsert failed; kept local changes.", e);
      // We keep local change; could add a "pending sync" queue later
    }
  }

  return { ok: true };
}

async function deleteResort(resortId) {
  const db = getDB();
  db.resorts = db.resorts.filter(r => r.id !== resortId);
  db.trips = db.trips.filter(t => t.resortId !== resortId);
  saveDB(db);

  if (state.user && state.groupId && !String(resortId).startsWith("resort_")) {
    try {
      const { error } = await supabase.from("resorts").delete().eq("id", resortId);
      if (error) throw error;
      await refreshFromSupabaseToLocalCache();
    } catch (e) {
      console.warn("Supabase resort delete failed; kept local delete.", e);
    }
  }

  return { ok: true };
}

async function upsertTrip(payload, { id = null } = {}) {
  const db = getDB();
  const now = Date.now();
  const errors = validateTripPayload(payload);
  if (errors.length) return { ok: false, errors };

  const totals = computeTripTotal(payload);
  const normalized = {
    ...payload,
    days: Number(payload.days),
    costFlights: Number(payload.costFlights),
    costLodging: Number(payload.costLodging),
    costHotelOther: Number(payload.costHotelOther),
    compositeScore: Number(payload.compositeScore),
    totalBase: totals.totalBase
  };

  // Local update first
  if (id) {
    const idx = db.trips.findIndex(t => t.id === id);
    if (idx === -1) return { ok: false, errors: ["Trip not found."] };
    db.trips[idx] = { ...db.trips[idx], ...normalized, id, updatedAt: now };
  } else {
    const trip = { ...normalized, id: uid("trip"), createdAt: now, updatedAt: now };
    db.trips.push(trip);
    id = trip.id;
  }
  saveDB(db);

  // Supabase write-through
  if (state.user && state.groupId) {
    try {
      const resortId = normalized.resortId;
      if (!resortId || String(resortId).startsWith("resort_")) {
        // Resort isn't synced yet. Keep local; we'll sync after resort becomes UUID.
        return { ok: true, warning: "Resort not synced to Supabase yet; trip saved locally." };
      }

      const row = mapTripUIToRow(normalized, resortId);

      if (String(id).startsWith("trip_")) {
        // local-only trip -> insert -> replace id
        const { data, error } = await supabase
          .from("trips")
          .insert(row)
          .select("*")
          .single();
        if (error) throw error;

        const newId = data.id;
        const db2 = getDB();
        db2.trips = db2.trips.map(t => (t.id === id ? { ...t, id: newId } : t));
        saveDB(db2);
        await refreshFromSupabaseToLocalCache();
        return { ok: true, newId };
      } else {
        // update
        const { error } = await supabase.from("trips").update(row).eq("id", id);
        if (error) throw error;
        await refreshFromSupabaseToLocalCache();
      }
    } catch (e) {
      console.warn("Supabase trip upsert failed; kept local changes.", e);
    }
  }

  return { ok: true };
}

async function deleteTrip(tripId) {
  const db = getDB();
  db.trips = db.trips.filter(t => t.id !== tripId);
  saveDB(db);

  if (state.user && state.groupId && !String(tripId).startsWith("trip_")) {
    try {
      const { error } = await supabase.from("trips").delete().eq("id", tripId);
      if (error) throw error;
      await refreshFromSupabaseToLocalCache();
    } catch (e) {
      console.warn("Supabase trip delete failed; kept local delete.", e);
    }
  }

  return { ok: true };
}

/* =========================================================
   Rendering
========================================================= */

function setActiveTab() {
  const tabResorts = document.getElementById("tab-resorts");
  const tabTrips = document.getElementById("tab-trips");
  tabResorts.classList.toggle("segmented-btn--active", state.view === "resorts" || state.view === "resortDetail");
  tabTrips.classList.toggle("segmented-btn--active", state.view === "allTrips");
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

  if (state.view === "allTrips") {
    root.innerHTML = renderAllTripsView();
    wireAllTripsView();
    return;
  }

  if (state.view === "resortDetail") {
    root.innerHTML = renderResortDetailView(state.selectedResortId);
    wireResortDetailView(state.selectedResortId);
    return;
  }
}

/* ===== Resorts view ===== */

function renderResortsView() {
  const db = getDB();
  const q = (state.resortSearch || "").trim().toLowerCase();

  const resorts = db.resorts
    .slice()
    .sort((a, b) => (a.name || "").localeCompare(b.name || ""))
    .filter(r => {
      if (!q) return true;
      const hay = `${r.name} ${r.location}`.toLowerCase();
      return hay.includes(q);
    });

  const modeNote = state.user && state.groupId
    ? `<p class="small muted">Shared mode: connected to Supabase group <code>${escapeHtml(state.groupId.slice(0, 8))}…</code></p>`
    : `<p class="small muted">Local mode: changes save only on this device until you sign in.</p>`;

  return `
    <section class="card">
      ${modeNote}
      <div class="toolbar">
        <div style="flex:1; min-width: 220px;">
          <label class="field-label" for="resort-search">Search resorts</label>
          <input id="resort-search" class="field-input" type="text" placeholder="Search by name or location..." value="${escapeHtml(state.resortSearch)}" />
        </div>
        <div class="btn-row">
          <button id="btn-add-resort" class="btn-primary" type="button">Add Resort</button>
        </div>
      </div>

      <div class="list-grid">
        ${resorts.length ? resorts.map(r => resortButtonHTML(r)).join("") : `<p class="muted">No resorts found.</p>`}
      </div>

      <div class="hr"></div>
      <p class="small muted">
        Note: Thumbnails are currently stored locally (Data URL). We’ll add Supabase Storage syncing next.
      </p>
    </section>
  `;
}

function resortButtonHTML(r) {
  const thumb = r.thumbnailDataUrl
    ? `<img alt="${escapeHtml(r.name)} thumbnail" src="${r.thumbnailDataUrl}" />`
    : `<span>No<br/>image</span>`;

  return `
    <button class="resort-btn" type="button" data-resort-open="${r.id}">
      <div class="thumb">${thumb}</div>
      <div class="resort-meta">
        <h3>${escapeHtml(r.name)}</h3>
        <p>${escapeHtml(r.location)} • ${stars(r.mountainStars)} • ${Number(r.verticalFeet || 0).toLocaleString()} ft</p>
      </div>
    </button>
  `;
}

function wireResortsView() {
  const search = document.getElementById("resort-search");
  const addBtn = document.getElementById("btn-add-resort");

  search?.addEventListener("input", (e) => {
    setState({ resortSearch: e.target.value });
    render();
  });

  addBtn?.addEventListener("click", () => {
    if (!state.user) {
      alert("Sign in to add resorts.");
      return;
    }
    openResortModal({ mode: "create" });
  });

  document.querySelectorAll("[data-resort-open]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-resort-open");
      setState({ view: "resortDetail", selectedResortId: id });
      render();
    });
  });
}

/* ===== All trips view ===== */

function renderAllTripsView() {
  const db = getDB();
  const q = (state.tripSearch || "").trim().toLowerCase();

  const resortById = Object.fromEntries(db.resorts.map(r => [r.id, r]));

  let trips = db.trips
    .map(t => ({ ...t, resort: resortById[t.resortId] }))
    .filter(t => t.resort)
    .filter(t => {
      if (!q) return true;
      const hay = `${t.resort.name} ${t.resort.location} ${t.dayPlans.join(" ")}`.toLowerCase();
      return hay.includes(q);
    });

  trips = sortTrips(trips, state.tripSort);

  return `
    <section class="card">
      <div class="toolbar">
        <div style="flex:1; min-width: 220px;">
          <label class="field-label" for="trip-search">Search itineraries</label>
          <input id="trip-search" class="field-input" type="text" placeholder="Search resort, location, or text..." value="${escapeHtml(state.tripSearch)}" />
        </div>
        <div style="min-width: 220px;">
          <label class="field-label" for="trip-sort">Sort</label>
          <select id="trip-sort" class="field-select">
            <option value="scoreDesc" ${state.tripSort === "scoreDesc" ? "selected" : ""}>Score (high → low)</option>
            <option value="scoreAsc" ${state.tripSort === "scoreAsc" ? "selected" : ""}>Score (low → high)</option>
            <option value="daysDesc" ${state.tripSort === "daysDesc" ? "selected" : ""}>Days (high → low)</option>
            <option value="daysAsc" ${state.tripSort === "daysAsc" ? "selected" : ""}>Days (low → high)</option>
          </select>
        </div>
      </div>

      <div class="form-grid">
        ${trips.length ? trips.map(t => allTripCardHTML(t)).join("") : `<p class="muted">No itineraries found.</p>`}
      </div>
    </section>
  `;
}

function sortTrips(trips, sortKey) {
  const arr = trips.slice();
  const byScore = (a, b) => (a.compositeScore ?? 0) - (b.compositeScore ?? 0);
  const byDays = (a, b) => (a.days ?? 0) - (b.days ?? 0);

  if (sortKey === "scoreAsc") return arr.sort(byScore);
  if (sortKey === "scoreDesc") return arr.sort((a, b) => byScore(b, a));
  if (sortKey === "daysAsc") return arr.sort(byDays);
  if (sortKey === "daysDesc") return arr.sort((a, b) => byDays(b, a));
  return arr;
}

function allTripCardHTML(t) {
  const totals = computeTripTotal(t);
  return `
    <div class="trip-card">
      <div class="trip-top">
        <div>
          <h4>${escapeHtml(t.resort.name)} • ${t.days}-day</h4>
          <div class="kpi" style="margin-top:.35rem;">
            <span class="kpi-pill"><strong>Score</strong> ${t.compositeScore}</span>
            <span class="kpi-pill"><strong>Total</strong> ${money(totals.totalBase)}</span>
            <span class="kpi-pill"><strong>Location</strong> ${escapeHtml(t.resort.location)}</span>
          </div>
        </div>
        <div class="btn-row">
          <button class="btn-secondary" type="button" data-open-trip="${t.id}">Open</button>
        </div>
      </div>
      <ol class="day-list">
        ${t.dayPlans.map((d, i) => `<li><strong>Day ${i+1}:</strong> ${escapeHtml(d)}</li>`).join("")}
      </ol>
    </div>
  `;
}

function wireAllTripsView() {
  const search = document.getElementById("trip-search");
  const sort = document.getElementById("trip-sort");

  search?.addEventListener("input", (e) => {
    setState({ tripSearch: e.target.value });
    render();
  });

  sort?.addEventListener("change", (e) => {
    setState({ tripSort: e.target.value });
    render();
  });

  document.querySelectorAll("[data-open-trip]").forEach(btn => {
    btn.addEventListener("click", () => {
      const tripId = btn.getAttribute("data-open-trip");
      const db = getDB();
      const trip = db.trips.find(t => t.id === tripId);
      if (!trip) return;

      setState({ view: "resortDetail", selectedResortId: trip.resortId });
      render();

      setTimeout(() => {
        const acc = document.querySelector(`[data-accordion-days="${trip.days}"]`);
        acc?.click();
        const target = document.querySelector(`[data-trip-card="${trip.id}"]`);
        target?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 0);
    });
  });
}

/* ===== Resort detail view ===== */

function renderResortDetailView(resortId) {
  const db = getDB();
  const resort = db.resorts.find(r => r.id === resortId);

  if (!resort) {
    return `
      <section class="card">
        <p class="muted">Resort not found.</p>
        <button id="btn-back" class="btn-secondary" type="button">Back</button>
      </section>
    `;
  }

  const trips = db.trips.filter(t => t.resortId === resortId);
  const grouped = groupTripsByDays(trips);

  return `
    <section class="card">
      <div class="toolbar">
        <div class="btn-row">
          <button id="btn-back" class="btn-secondary" type="button">← Back</button>
        </div>
        <div class="btn-row">
          <button id="btn-edit-resort" class="btn-ghost" type="button">Edit Resort</button>
          <button id="btn-delete-resort" class="btn-danger" type="button">Delete Resort</button>
          <button id="btn-add-trip" class="btn-primary" type="button">Add a Trip</button>
        </div>
      </div>

      <div style="display:flex; gap:1rem; align-items:center; flex-wrap: wrap;">
        <div class="thumb" style="width:84px; height:84px;">
          ${resort.thumbnailDataUrl
            ? `<img alt="${escapeHtml(resort.name)} thumbnail" src="${resort.thumbnailDataUrl}" />`
            : `<span>No<br/>image</span>`}
        </div>
        <div style="flex:1; min-width: 240px;">
          <h2 style="margin:0 0 .25rem;">${escapeHtml(resort.name)}</h2>
          <p class="muted" style="margin:0;">${escapeHtml(resort.location)} • ${stars(resort.mountainStars)} mountain</p>
        </div>
      </div>

      <div class="hr"></div>

      <div class="kpi">
        <span class="kpi-pill"><strong>Miles from Rochester</strong> ${Number(resort.milesFromRochester).toLocaleString()}</span>
        <span class="kpi-pill"><strong>Vertical</strong> ${Number(resort.verticalFeet).toLocaleString()} ft</span>
        <span class="kpi-pill"><strong>Trails</strong> ${Number(resort.trailCount).toLocaleString()}</span>
        <span class="kpi-pill"><strong>Area activities</strong> ${stars(resort.areaActivitiesStars)}</span>
      </div>

      <div class="hr"></div>

      <div class="grid-3">
        <div>
          <div class="field-label">Typical in-season flight cost</div>
          <div><strong>${money(resort.typicalFlightCost)}</strong></div>
        </div>
        <div>
          <div class="field-label">Avg lodging / night</div>
          <div><strong>${money(resort.avgLodgingNight)}</strong></div>
        </div>
        <div>
          <div class="field-label">Cheapest lodging / night</div>
          <div><strong>${money(resort.cheapestLodgingNight)}</strong></div>
        </div>
        <div>
          <div class="field-label">Ski-in/ski-out / night</div>
          <div><strong>${money(resort.skiInOutNight)}</strong></div>
        </div>
      </div>

      <div class="hr"></div>

      <h3 style="margin:0 0 .6rem;">Itineraries</h3>

      ${Object.keys(grouped).length
        ? Object.entries(grouped)
            .sort((a, b) => Number(a[0]) - Number(b[0]))
            .map(([days, list]) => accordionHTML(days, list, resort))
            .join("")
        : `<p class="muted">No trips yet. Click “Add a Trip” to create the first itinerary.</p>`
      }

      <p class="small muted" style="margin-top: 1rem;">
        Composite score is user-defined (0–100) and powers sorting/filtering in “All Itineraries”.
      </p>
    </section>
  `;
}

function groupTripsByDays(trips) {
  const out = {};
  for (const t of trips) {
    const k = String(t.days);
    if (!out[k]) out[k] = [];
    out[k].push(t);
  }
  Object.values(out).forEach(arr => arr.sort((a, b) => (b.compositeScore ?? 0) - (a.compositeScore ?? 0)));
  return out;
}

function accordionHTML(days, trips, resort) {
  const tripCount = trips.length;
  const avgScore = tripCount
    ? Math.round(trips.reduce((s, t) => s + (Number(t.compositeScore) || 0), 0) / tripCount)
    : 0;

  return `
    <div class="accordion">
      <button class="accordion-header" type="button" data-accordion-days="${days}">
        <div>
          <div class="accordion-title">${days}-Day Trip</div>
          <div class="accordion-sub">${tripCount} itinerary(ies) • avg score ${avgScore}</div>
        </div>
        <div class="pill-score">▼</div>
      </button>
      <div class="accordion-body hidden" data-accordion-body-days="${days}">
        ${trips.map(t => tripCardHTML(t, resort)).join("")}
      </div>
    </div>
  `;
}

function tripCardHTML(t, resort) {
  const totals = computeTripTotal(t);
  return `
    <div class="trip-card" data-trip-card="${t.id}">
      <div class="trip-top">
        <div>
          <h4>${t.days}-day itinerary <span class="pill-score">Score ${t.compositeScore}</span></h4>
          <div class="small muted">${escapeHtml(resort.name)} • ${escapeHtml(resort.location)}</div>
        </div>
        <div class="trip-actions">
          <button class="btn-ghost" type="button" data-trip-edit="${t.id}">Edit</button>
          <button class="btn-danger" type="button" data-trip-delete="${t.id}">Delete</button>
        </div>
      </div>

      <div class="cost-grid">
        <div class="line"><strong>Flights:</strong> ${money(totals.flights)}</div>
        <div class="line"><strong>Lodging:</strong> ${money(totals.lodging)}</div>
        <div class="line"><strong>Hotel/Transit:</strong> ${money(totals.hotelOther)}</div>
        <div class="line"><strong>Total base:</strong> ${money(totals.totalBase)}</div>
      </div>

      <ol class="day-list">
        ${t.dayPlans.map((d, i) => `<li><strong>Day ${i+1}:</strong> ${escapeHtml(d)}</li>`).join("")}
      </ol>
    </div>
  `;
}

function wireResortDetailView(resortId) {
  const db = getDB();
  const resort = db.resorts.find(r => r.id === resortId);

  document.getElementById("btn-back")?.addEventListener("click", () => {
    setState({ view: "resorts", selectedResortId: null });
    render();
  });

  document.getElementById("btn-edit-resort")?.addEventListener("click", () => {
    if (!state.user) return alert("Sign in to edit resorts.");
    openResortModal({ mode: "edit", resortId });
  });

  document.getElementById("btn-delete-resort")?.addEventListener("click", async () => {
    if (!state.user) return alert("Sign in to delete resorts.");
    if (!resort) return;

    const ok = confirm(`Delete resort "${resort.name}" and ALL its trips? This cannot be undone.`);
    if (!ok) return;

    await deleteResort(resortId);
    setState({ view: "resorts", selectedResortId: null });
    render();
  });

  document.getElementById("btn-add-trip")?.addEventListener("click", () => {
    if (!state.user) return alert("Sign in to add trips.");
    openTripModal({ mode: "create", resortId });
  });

  // accordions
  document.querySelectorAll("[data-accordion-days]").forEach(btn => {
    btn.addEventListener("click", () => {
      const days = btn.getAttribute("data-accordion-days");
      const body = document.querySelector(`[data-accordion-body-days="${days}"]`);
      body?.classList.toggle("hidden");
    });
  });

  // trip edit/delete
  document.querySelectorAll("[data-trip-edit]").forEach(btn => {
    btn.addEventListener("click", () => {
      if (!state.user) return alert("Sign in to edit trips.");
      const tripId = btn.getAttribute("data-trip-edit");
      openTripModal({ mode: "edit", resortId, tripId });
    });
  });

  document.querySelectorAll("[data-trip-delete]").forEach(btn => {
    btn.addEventListener("click", async () => {
      if (!state.user) return alert("Sign in to delete trips.");
      const tripId = btn.getAttribute("data-trip-delete");
      const trip = db.trips.find(t => t.id === tripId);
      if (!trip) return;
      const ok = confirm(`Delete this ${trip.days}-day itinerary?`);
      if (!ok) return;
      await deleteTrip(tripId);
      render();
    });
  });
}

/* =========================================================
   Modals (UI)
========================================================= */

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

  document.addEventListener("keydown", escCloseOnce, { once: true });
  function escCloseOnce(e) {
    if (e.key === "Escape") closeModal();
  }
}

function closeModal() {
  const backdrop = document.getElementById("modal-backdrop");
  backdrop.classList.add("hidden");
  backdrop.setAttribute("aria-hidden", "true");
  backdrop.innerHTML = "";
}

function openResortModal({ mode, resortId = null }) {
  const db = getDB();
  const resort = mode === "edit" ? db.resorts.find(r => r.id === resortId) : null;

  const initial = resort || {
    name: "",
    location: "",
    thumbnailDataUrl: "",
    milesFromRochester: 0,
    verticalFeet: 0,
    trailCount: 0,
    mountainStars: 3,
    typicalFlightCost: 0,
    avgLodgingNight: 0,
    cheapestLodgingNight: 0,
    skiInOutNight: 0,
    areaActivitiesStars: 3
  };

  openModal(`
    <h2>${mode === "edit" ? "Edit Resort" : "Add Resort"}</h2>
    <form id="resort-form" class="form-grid">
      <div class="grid-2">
        <div>
          <label class="field-label">Resort name</label>
          <input class="field-input" id="r-name" type="text" value="${escapeAttr(initial.name)}" required />
        </div>
        <div>
          <label class="field-label">Location</label>
          <input class="field-input" id="r-location" type="text" value="${escapeAttr(initial.location)}" placeholder="Town/State or Country" required />
        </div>
      </div>

      <div class="grid-2">
        <div>
          <label class="field-label">Thumbnail image (stored locally for now)</label>
          <input class="field-input" id="r-thumb" type="file" accept="image/*" />
          <div class="small muted">We’ll add shared thumbnail syncing via Supabase Storage next.</div>
        </div>
        <div>
          <label class="field-label">Miles from Rochester, NY</label>
          <input class="field-input" id="r-miles" type="number" min="0" step="1" value="${escapeAttr(initial.milesFromRochester)}" />
        </div>
      </div>

      <div class="grid-3">
        <div>
          <label class="field-label">Vertical feet</label>
          <input class="field-input" id="r-vert" type="number" min="0" step="1" value="${escapeAttr(initial.verticalFeet)}" />
        </div>
        <div>
          <label class="field-label">Number of trails</label>
          <input class="field-input" id="r-trails" type="number" min="0" step="1" value="${escapeAttr(initial.trailCount)}" />
        </div>
        <div>
          <label class="field-label">Mountain rating (1–5)</label>
          <input class="field-input" id="r-mstars" type="number" min="1" max="5" step="1" value="${escapeAttr(initial.mountainStars)}" />
        </div>
      </div>

      <div class="grid-3">
        <div>
          <label class="field-label">Typical flight cost (per person)</label>
          <input class="field-input" id="r-flight" type="number" min="0" step="1" value="${escapeAttr(initial.typicalFlightCost)}" />
        </div>
        <div>
          <label class="field-label">Avg lodging / night</label>
          <input class="field-input" id="r-avg" type="number" min="0" step="1" value="${escapeAttr(initial.avgLodgingNight)}" />
        </div>
        <div>
          <label class="field-label">Cheapest lodging / night</label>
          <input class="field-input" id="r-cheap" type="number" min="0" step="1" value="${escapeAttr(initial.cheapestLodgingNight)}" />
        </div>
      </div>

      <div class="grid-2">
        <div>
          <label class="field-label">Ski-in/ski-out / night</label>
          <input class="field-input" id="r-skiio" type="number" min="0" step="1" value="${escapeAttr(initial.skiInOutNight)}" />
        </div>
        <div>
          <label class="field-label">Area activities rating (1–5)</label>
          <input class="field-input" id="r-astars" type="number" min="1" max="5" step="1" value="${escapeAttr(initial.areaActivitiesStars)}" />
        </div>
      </div>

      <div id="resort-errors" class="inline-error"></div>

      <div class="modal-footer">
        <button class="btn-secondary" type="button" id="resort-cancel">Cancel</button>
        <button class="btn-primary" type="submit">${mode === "edit" ? "Save Changes" : "Create Resort"}</button>
      </div>
    </form>
  `);

  document.getElementById("resort-cancel")?.addEventListener("click", closeModal);

  const form = document.getElementById("resort-form");
  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const errorsEl = document.getElementById("resort-errors");
    errorsEl.textContent = "";

    const payload = {
      name: document.getElementById("r-name").value.trim(),
      location: document.getElementById("r-location").value.trim(),
      thumbnailDataUrl: initial.thumbnailDataUrl || "",
      milesFromRochester: Number(document.getElementById("r-miles").value),
      verticalFeet: Number(document.getElementById("r-vert").value),
      trailCount: Number(document.getElementById("r-trails").value),
      mountainStars: Number(document.getElementById("r-mstars").value),
      typicalFlightCost: Number(document.getElementById("r-flight").value),
      avgLodgingNight: Number(document.getElementById("r-avg").value),
      cheapestLodgingNight: Number(document.getElementById("r-cheap").value),
      skiInOutNight: Number(document.getElementById("r-skiio").value),
      areaActivitiesStars: Number(document.getElementById("r-astars").value)
    };

    const fileInput = document.getElementById("r-thumb");
    const file = fileInput?.files?.[0];
    if (file) {
      payload.thumbnailDataUrl = await fileToDataUrl(file);
    }

    const result = await upsertResort(payload, { id: mode === "edit" ? resortId : null });
    if (!result.ok) {
      errorsEl.textContent = result.errors.join(" ");
      return;
    }

    closeModal();

    if (mode === "create") {
      const db2 = getDB();
      const created = db2.resorts.slice().sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))[0];
      setState({ view: "resortDetail", selectedResortId: created.id });
    }
    render();
  });
}

function openTripModal({ mode, resortId, tripId = null }) {
  const db = getDB();
  const resort = db.resorts.find(r => r.id === resortId);
  if (!resort) return;

  const trip = mode === "edit" ? db.trips.find(t => t.id === tripId) : null;

  const initial = trip || {
    resortId,
    days: 3,
    costFlights: Number(resort.typicalFlightCost) || 0,
    costLodging: (Number(resort.avgLodgingNight) || 0) * 3,
    costHotelOther: 0,
    compositeScore: 75,
    dayPlans: ["", "", ""]
  };

  const daysN = Number(initial.days) || 1;
  const dayPlans = Array.from({ length: daysN }, (_, i) => (initial.dayPlans?.[i] ?? ""));

  openModal(`
    <h2>${mode === "edit" ? "Edit Trip" : "Add a Trip"} • ${escapeHtml(resort.name)}</h2>
    <form id="trip-form" class="form-grid">

      <div class="grid-3">
        <div>
          <label class="field-label">Trip length (days)</label>
          <input class="field-input" id="t-days" type="number" min="1" max="30" step="1" value="${escapeAttr(daysN)}" />
          <div class="small muted">Changing days will rebuild the day list.</div>
        </div>
        <div>
          <label class="field-label">Composite score (0–100)</label>
          <input class="field-input" id="t-score" type="number" min="0" max="100" step="1" value="${escapeAttr(initial.compositeScore)}" />
        </div>
        <div>
          <label class="field-label">Total base (auto)</label>
          <input class="field-input" id="t-total" type="text" value="${money(computeTripTotal(initial).totalBase)}" disabled />
        </div>
      </div>

      <div class="grid-3">
        <div>
          <label class="field-label">Flights (per person)</label>
          <input class="field-input" id="t-flights" type="number" min="0" step="1" value="${escapeAttr(initial.costFlights)}" />
        </div>
        <div>
          <label class="field-label">Lodging (per person)</label>
          <input class="field-input" id="t-lodging" type="number" min="0" step="1" value="${escapeAttr(initial.costLodging)}" />
        </div>
        <div>
          <label class="field-label">Hotel/Transit (per person)</label>
          <input class="field-input" id="t-hotel" type="number" min="0" step="1" value="${escapeAttr(initial.costHotelOther)}" />
        </div>
      </div>

      <div>
        <div class="toolbar" style="margin:0 0 .35rem;">
          <div>
            <div class="field-label">Day-by-day plan</div>
            <div class="small muted">One summary per day. Use “+ Day” to append.</div>
          </div>
          <div class="btn-row">
            <button class="btn-secondary" type="button" id="btn-add-day">+ Day</button>
            <button class="btn-ghost" type="button" id="btn-remove-day">− Day</button>
          </div>
        </div>

        <div id="day-plans" class="form-grid">
          ${dayPlans.map((txt, i) => dayPlanRowHTML(i, txt)).join("")}
        </div>
      </div>

      <div id="trip-errors" class="inline-error"></div>

      <div class="modal-footer">
        <button class="btn-secondary" type="button" id="trip-cancel">Cancel</button>
        <button class="btn-primary" type="submit">${mode === "edit" ? "Save Trip" : "Create Trip"}</button>
      </div>
    </form>
  `);

  document.getElementById("trip-cancel")?.addEventListener("click", closeModal);

  const totalEl = document.getElementById("t-total");
  ["t-flights", "t-lodging", "t-hotel"].forEach(id => {
    document.getElementById(id)?.addEventListener("input", () => {
      const totals = computeTripTotal({
        costFlights: Number(document.getElementById("t-flights").value),
        costLodging: Number(document.getElementById("t-lodging").value),
        costHotelOther: Number(document.getElementById("t-hotel").value)
      });
      totalEl.value = money(totals.totalBase);
    });
  });

  document.getElementById("btn-add-day")?.addEventListener("click", () => {
    const container = document.getElementById("day-plans");
    const count = container.querySelectorAll("[data-day-row]").length;
    const next = count;
    container.insertAdjacentHTML("beforeend", dayPlanRowHTML(next, ""));
    document.getElementById("t-days").value = String(count + 1);
  });

  document.getElementById("btn-remove-day")?.addEventListener("click", () => {
    const container = document.getElementById("day-plans");
    const rows = container.querySelectorAll("[data-day-row]");
    if (rows.length <= 1) return;
    rows[rows.length - 1].remove();
    document.getElementById("t-days").value = String(rows.length - 1);
  });

  document.getElementById("t-days")?.addEventListener("change", () => {
    const days = clamp(Number(document.getElementById("t-days").value), 1, 30);
    document.getElementById("t-days").value = String(days);
    const container = document.getElementById("day-plans");
    const existing = Array.from(container.querySelectorAll("textarea")).map(t => t.value);

    container.innerHTML = "";
    for (let i = 0; i < days; i++) {
      container.insertAdjacentHTML("beforeend", dayPlanRowHTML(i, existing[i] ?? ""));
    }
  });

  document.getElementById("trip-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const errorsEl = document.getElementById("trip-errors");
    errorsEl.textContent = "";

    const container = document.getElementById("day-plans");
    const dayPlansOut = Array.from(container.querySelectorAll("textarea")).map(t => t.value.trim());

    const payload = {
      resortId,
      days: Number(document.getElementById("t-days").value),
      compositeScore: Number(document.getElementById("t-score").value),
      costFlights: Number(document.getElementById("t-flights").value),
      costLodging: Number(document.getElementById("t-lodging").value),
      costHotelOther: Number(document.getElementById("t-hotel").value),
      dayPlans: dayPlansOut
    };

    const result = await upsertTrip(payload, { id: mode === "edit" ? tripId : null });
    if (!result.ok) {
      errorsEl.textContent = result.errors.join(" ");
      return;
    }

    if (result.warning) {
      alert(result.warning);
    }

    closeModal();
    render();
  });
}

function dayPlanRowHTML(i, txt) {
  return `
    <div data-day-row="1">
      <label class="field-label">Day ${i + 1}</label>
      <textarea class="field-input" rows="2" placeholder="Activities / plan..." spellcheck="true">${escapeHtml(txt)}</textarea>
    </div>
  `;
}

/* =========================================================
   Utilities
========================================================= */

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

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}