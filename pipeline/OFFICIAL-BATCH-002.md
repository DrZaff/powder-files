# Official mountain facts: batch 002

Checked 2026-08-30. Adds 25 previously unenriched public profiles across the United States, Canada, Japan, Australia and France. All joins use exact existing IDs; no confidence or verification promotions occur.

## Source and measurement rules

Facts were manually transcribed from official resort, operator and destination HTML pages. Only individual factual observations are stored, not copied descriptions, images or page bodies. Official page copyright remains with its publisher; these observations do not relabel those pages as CC0 or ODbL. Existing Wikidata/OSM licensing and provenance remain separate.

Each observation retains its URL, check date, publication date when explicitly available, original unit, qualification and explanatory scope. Japanese/French sources are translated only to concise factual labels. Counts are not extrapolated from unrelated terrain, equipment capacities or trail-map line segments.

`source_period` identifies a dated season or publication where necessary. Checking a source today does not make old measurements current. This period appears both on directory tiles and in the field guide; publication dates also appear in the guide. Approximate length remains approximate (Avoriaz: about 75 km). Length is not acreage.

## Important review items

- Deer Valley retains the 2025–26 configuration. Its planned 2026–27 expansion is recorded in research notes, not represented as already available. Published trail counts conflict. This is a skiing-only resort.
- Fernie, Avoriaz, Goryu–Hakuba47 and Palisades publish conflicting counts. Numeric values for the flagged fields are withheld and alternative sources retained.
- Palisades' advertised 288-trail total does not reconcile with the separate mountain subtotals (187 + 109 = 296). The alternate value is explicitly marked as a sum, not a separately published count. Overlap and scope are unresolved; the displayed count is withheld.
- Whitefish's FAQ operating-lift count is narrower than its equipment list; the displayed label and note preserve that distinction.
- RED's animated counters were not used when extraction returned zero. Broader resort acreage may include cat-accessed terrain. Promotional vertical descriptions differ, so vertical remains unfilled.
- Hakuba47's statistics table is still dated 2023–24; Nozawa's company table is dated 2024–25; Hotham's stats table is dated 2025. Telluride's HTML fact block is a 2020 publication. These dates are visible; newer authoritative fact-sheet checks remain necessary. Old Telluride lift/trail counts are not imported.
- Hotham's lifted terrain (245 ha) differs from its broader ski area (320 ha). Nozawa's course area (297 ha) differs from its overall footprint (785 ha). Neither larger number is substituted for the narrower measurement.
- Sun Peaks' 2026–27 published table is labeled planning information, not live operation. Its out-of-boundary Mount Tod summit is not used as skiing elevation.
- Grand Hirafu, Annupuri and Hanazono remain separate profiles, not copies of Niseko United totals. Goryu's linked-area count is explicitly not standalone Goryu.
- Furano, Cortina, Hirafu and Nozawa provide skiing-area elevations. Goryu's gondola station and Iwatake's summit recreation area are narrower observations and do not fill the highest-skiing-elevation requirement.
- Some profiles remain sparse. The report lists missing core fields, rather than claiming complete coverage after finding one fact.

## Reproduce, inspect and refresh

Run `npm run data:build`, `npm run data:test`, `npm run lint` and `npm run build`. The build uses existing source caches plus the checked-in batch definitions; it does not reread official pages. `generated/official-batch-002-report.json` lists per-resort sources, research notes, missing core fields and conflicts. Canonical provenance, the global research queue, coverage and public compact JSON are also regenerated.

For refreshes, revisit the stored official URLs, check source period and measurement scope, preserve unresolved alternatives and update the true retrieval date. Announced projects require confirmation before treating them as current. Never fill missing vertical by subtracting unrelated elevations.

The browser loads the directory JSON separately from JavaScript. This batch does not change authentication, Supabase, publishing or user-content functionality. Bristol and batch 001 remain preserved.
