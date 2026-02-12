// =========================================================
// The Powder Files — script.js
// Supabase + offline-first local cache
// =========================================================

// ===== Supabase Config =====
const SUPABASE_URL = "https://zpxvcvspiiueelmstyjb.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpweHZjdnNwaWl1ZWVsbXN0eWpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3MjA2ODIsImV4cCI6MjA4NTI5NjY4Mn0.pfpPInX45JLrZmqpXi1p4zIUoAn49oeg74KugseHIDU";

// Create supabase client exactly once (prevents "already declared" issues)
window.__powder_supabase =
  window.__powder_supabase || window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const supabase = window.__powder_supabase;

// ===== App Keys =====
const STORAGE_KEY = "powderfiles_db_v1";             // local offline cache
const POWDER_GROUP_KEY = "powderfiles_group_id_v1";  // saved group id
const DEFAULT_GROUP_NAME = "The Powder Files";
const THUMB_BUCKET = "powder-files-thumbs";

// ===== App State (MUST be defined before initAuthUI runs) =====
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
   Group Helpers
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

  // Requires SQL function: public.create_group_with_owner(text)
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

  if (!btnLogin || !btnLogout || !emailInput || !statusEl) {
    console.warn("Auth UI elements not found. Check index.html IDs.");
    return;
  }

  let lastOtpSentAt = 0;

  async function refresh() {
    const { data } = await supabase.auth.getSession();
    const session = data.session ?? null;
    const user = session?.user ?? null;

    setState({ session, user });

    if (user) {
      const gid = await ensureGroup();
      setState({ groupId: gid });

      statusEl.textContent = `Signed in: ${user.email}`;
      btnLogout.classList.remove("hidden");
      btnLogin.classList.add("hidden");
      emailInput.classList.add("hidden");
    } else {
      setState({ groupId: null });

      statusEl.textContent = "Not signed in";
      btnLogout.classList.add("hidden");
      btnLogin.classList.remove("hidden");
      emailInput.classList.remove("hidden");
    }
  }

  btnLogin.addEventListener("click", async () => {
    try {
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

      btnLogin.disabled = true;
      btnLogin.textContent = "Sending...";

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          // IMPORTANT: this must be an allowed redirect URL in Supabase Auth settings
          emailRedirectTo: window.location.origin
        }
      });

      if (error) {
        alert(error.message);
        return;
      }

      alert("Magic link sent. Open the link from your email on this device/browser.");
    } catch (e) {
      console.error(e);
      alert("Send link failed. Check Console for details.");
    } finally {
      btnLogin.disabled = false;
      btnLogin.textContent = "Send Link";
    }
  });

  btnLogout.addEventListener("click", async () => {
    try {
      await supabase.auth.signOut();
      await refresh();
      await initApp();
    } catch (e) {
      console.error(e);
      alert("Logout failed. Check Console.");
    }
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

function getThumbUrlFromPath(path) {
  if (!path) return null;
  const { data } = supabase.storage.from(THUMB_BUCKET).getPublicUrl(path);
  return data?.publicUrl || null;
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
   Supabase Mapping (snake_case DB ↔ camelCase UI)
========================================================= */

function mapResortRowToUI(r) {
  return {
    id: r.id,
    name: r.name,
    location: r.location,
    thumbnailDataUrl: "",
    thumbnailPath: r.thumbnail_path || null,

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
    thumbnail_path: payload.thumbnailPath ?? null,

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

  saveDB({
    resorts: resortRows.map(mapResortRowToUI),
    trips: tripRows.map(mapTripRowToUI),
    version: 2,
    source: "supabase"
  });
}

async function uploadResortThumbnail({ resortId, file }) {
  if (!state.user || !state.groupId) throw new Error("Not signed in / no group");
  if (!file) return null;

  const safeName = file.name.replace(/[^\w.\-]+/g, "_");
  const path = `${state.groupId}/resorts/${resortId}/${Date.now()}_${safeName}`;

  const { error: upErr } = await supabase.storage
    .from(THUMB_BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type });

  if (upErr) throw upErr;
  return path;
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
  ensureLocalDBExists();

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

  tabResorts?.addEventListener("click", () => {
    setState({ view: "resorts", selectedResortId: null });
    render();
  });

  tabTrips?.addEventListener("click", () => {
    setState({ view: "allTrips", selectedResortId: null });
    render();
  });
}

/* =========================================================
   Rendering (basic skeleton)
========================================================= */

function setActiveTab() {
  const tabResorts = document.getElementById("tab-resorts");
  const tabTrips = document.getElementById("tab-trips");
  tabResorts?.classList.toggle("segmented-btn--active", state.view === "resorts" || state.view === "resortDetail");
  tabTrips?.classList.toggle("segmented-btn--active", state.view === "allTrips");
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
    root.innerHTML = `<section class="card"><p class="muted">All Trips view not included in this minimal fix. (Your previous version can be pasted back in.)</p></section>`;
    return;
  }

  if (state.view === "resortDetail") {
    root.innerHTML = `<section class="card"><p class="muted">Resort detail view not included in this minimal fix.</p></section>`;
    return;
  }
}

/* ===== Resorts view (minimal) ===== */

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
    ? `<p class="small muted">Signed in • group <code>${escapeHtml(state.groupId.slice(0, 8))}…</code></p>`
    : `<p class="small muted">Signed out • local-only mode</p>`;

  return `
    <section class="card">
      ${modeNote}
      <div class="toolbar">
        <div style="flex:1; min-width: 220px;">
          <label class="field-label" for="resort-search">Search resorts</label>
          <input id="resort-search" class="field-input" type="text"
            placeholder="Search by name or location..." value="${escapeHtml(state.resortSearch)}" />
        </div>
      </div>

      <div class="list-grid">
        ${resorts.length
          ? resorts.map(r => `<div class="trip-card"><strong>${escapeHtml(r.name)}</strong><div class="small muted">${escapeHtml(r.location)}</div></div>`).join("")
          : `<p class="muted">No resorts found.</p>`}
      </div>
    </section>
  `;
}

function wireResortsView() {
  const search = document.getElementById("resort-search");
  search?.addEventListener("input", (e) => {
    setState({ resortSearch: e.target.value });
    render();
  });
}
