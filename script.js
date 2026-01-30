document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("checklistRoot");
  const resetBtn = document.getElementById("resetBtn");

  const STORAGE_KEY = "ctdev.admissionChecklist.v1";

  // ---------- Data (TEXT EXACTLY AS PROVIDED) ----------
  const checklist = [
    {
      title: "Admitting Diagnosis & Code Status",
      items: [
        "Confirm admitting diagnosis",
	"Determine level of care (if stepdown, document why)",
        "Confirm code status (Full, DNR, DNI, CMO)",
	"Document ACP note (or addend prior)",
        "Consider isolation precautions (COVID, C. diff, etc.)"
      ]
    },
    {
      title: "Labs",
      items: [
        "Admission labs (CBC, BMP/CMP, Mg, Phos, LFTs, Coags)",
        "Type and screen (if indicated)",
        "Additional labs (Troponin, BNP, lactate, cultures)",
        "Morning lab draws (repeats)"
      ]
    },
    {
      title: "Imaging",
      items: [
        "CXR, CT, US, MRI ordered (if indicated)",
        "Bedside studies (bladder scan, POCUS)"
      ]
    },
    {
      title: "Medications",
      items: [
        "Review and reconcile home meds (continue, hold, adjust)",
        "Review nephrotoxic meds (ACEi/ARBs, NSAIDs, diuretics, etc.)",
        "Review blood thinners (warfarin, DOACs, antiplatelets)",
        "DVT prophylaxis (heparin, enoxaparin, SCDs)",
        "Antibiotics started (if indicated)",
        "Pain control",
        "Antiemetics",
        "Bowel regimen",
        "Glucose control",
        "Sleep/agitation",
	"IV fluids (if indicated)",
        "Nicotine replacement therapy (if indicated)"
      ]
    },
    {
      title: "Consults",
      items: [
        "Place specialty consults (cardiology, ID, nephrology, etc.)",
        "Wound care orders (wound care consult if indicated)",
        "Document that consults were requested"
      ]
    },
    {
      title: "Nursing Orders / Special Instructions",
      items: [
        "I&O monitoring/daily weights",
        "Diet orders",
	"Telemetry/pulseOX (if indicated)",
        "Sleep bundle (lights off, minimize disturbances, melatonin PRN)",
	"CIWA/COWS (if indicated)"
      ]
    },
    {
      title: "Disposition Planning",
      items: [
        "PT/OT consult (if indicated)",
        "Case management / discharge planning referral"
      ]
    }
  ];

  // ---------- Persistence ----------
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return (parsed && typeof parsed === "object") ? parsed : {};
    } catch {
      return {};
    }
  }

  function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function makeItemKey(sectionTitle, itemText) {
    // Stable, human-readable key; avoids depending on array index.
    return `${sectionTitle}::${itemText}`;
  }

  // ---------- Render ----------
  const state = loadState();

  function render() {
    root.innerHTML = "";

    checklist.forEach((section) => {
      const sectionEl = document.createElement("div");
      sectionEl.className = "section";

      const titleEl = document.createElement("h3");
      titleEl.className = "section-title";
      titleEl.textContent = section.title;
      sectionEl.appendChild(titleEl);

      section.items.forEach((text) => {
        const key = makeItemKey(section.title, text);
        const checked = Boolean(state[key]);

        const row = document.createElement("div");
        row.className = "item" + (checked ? " checked" : "");

        const id = "cb_" + hashString(key);

        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.id = id;
        cb.checked = checked;

        const label = document.createElement("label");
        label.htmlFor = id;
        label.textContent = text;

        cb.addEventListener("change", () => {
          state[key] = cb.checked;
          saveState(state);
          row.classList.toggle("checked", cb.checked);
        });

        row.appendChild(cb);
        row.appendChild(label);
        sectionEl.appendChild(row);
      });

      root.appendChild(sectionEl);
    });
  }

  // Simple deterministic hash for element IDs (not for security)
  function hashString(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = (h << 5) - h + str.charCodeAt(i);
      h |= 0;
    }
    return String(Math.abs(h));
  }

  resetBtn.addEventListener("click", () => {
    // Clear persisted state and re-render
    for (const k of Object.keys(state)) delete state[k];
    localStorage.removeItem(STORAGE_KEY);
    render();
  });

  render();
});
