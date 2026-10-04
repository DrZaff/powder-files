# Official-source research batch 008

Reviewed August 31, 2026. Fifty additional public-directory identities now have original mountain-character summaries on cards and field guides. All edits remain local on `powderfiles-redesign`.

## Results

- 50 new summaries; 146 supported numerical observations across 40 profiles. Some observations are auxiliary measurements, not complete core mountain facts.
- Ten summary-only profiles: White Pass, Wild Mountain, Bald Mountain (Idaho), Craigieburn Valley, Charlotte Pass, Mount Lemmon Ski Valley, Idre Fjäll, Skimore Kongsberg, Selwyn and Storklinten.
- Seven withheld conflict fields: Wintergreen trails, Wisp acreage, Glencoe lifts, Åre slopes, Kittelfjäll lifts, Ramundberget slopes and Skimore Oslo slopes.
- 56 distinct official source URLs; 50 exact Wikidata identity joins. Countries: United States 17, Canada 4, New Zealand 10, Australia 3, United Kingdom 1, Sweden 8, Norway 7.
- Cumulative coverage: 303 summaries, 264 profiles with official numerical facts, 359 distinct official URLs, 136 profiles with structured elevation and 99 profiles with conflicts (including earlier structured-source conflicts).
- Public inventory unchanged: 1,521 medium/high-confidence profiles across 54 country labels. Turkey/Türkiye remains duplicated. Bristol remains the sole staff-verified profile with its earlier review date, 1,200-foot vertical and 39 trails intact.
- Canonical inventory unchanged: 6,089 records from 7,439 cached structured-source records. 230 exclusions (39 closed/disused, 165 Nordic-only, 25 private clubs, one indoor slope) and 366 ambiguity entries. No identity merges, new exclusions or structured API refresh in this batch.
- Canonical source coverage: 4,873 retained OSM source identifiers, 1,950 Wikidata source identifiers, 359 official URLs and one owned Bristol source. These are retained source records, not independent resort counts.
- Compact JSON: 1,894,245 bytes; 192,532 bytes gzip. Loaded separately from JavaScript, which remains 274.06 kB / 85.48 kB gzip. CSS remains 30.88 kB / 7.34 kB gzip. No imagery added.

## Resorts

Waterville Valley; Whiteface; Whitewater; Wintergreen; Winterplace; Wisp; Wolf Creek; Wilmot; Whitetail; Welch Village; White Pass; Wild Mountain; Bousquet; Bald Mountain (Idaho); Duck Mountain; Magic Mountain (Idaho); White Hills; Mount Hood Skibowl; Porters; Roundhill; Tūroa; Ōhau; Rainbow; Broken River; Craigieburn Valley; Mount Olympus; Charlotte Pass; Corin Forest; Hurricane Ridge; Mount Lemmon Ski Valley; Glencoe; Åre; Björkliden; Branäs; Idre Fjäll; Kittelfjäll; Kläppen; Ramundberget; Geilo; Kvitfjell; Myrkdalen; Voss Resort; Skimore Oslo; Skimore Kongsberg; Selwyn; Manganui; Temple Basin; Fairview Ski Hill; Storklinten; Stryn Sommerski.

Exact IDs, source links, retrieval dates, alternatives and field notes are in `official-batch-008.mjs`; generated missing-field and provenance reports are in `generated/official-batch-008-report.json`.

## Scope and limitations

- Whiteface uses 3,166 feet of lift-served vertical, excluding the Slides extension. Whitewater uses 553 hectares in bounds, not its broader total. Ōhau uses 125 hectares from the chair rather than 600 hectares from Mt Sutton, and preserves the source's 2025 season label.
- Mount Olympus separates rope-tow terrain from hike-accessed vertical. Stryn uses the current chairlift's 290 m drop and 1,300 m upper elevation, not the removed glacier tow or 1,800 m snowcat access. Seasonal closure notices are not permanent closures.
- Manganui, Temple Basin, Rainbow, Broken River, Craigieburn and Mount Olympus have public visitor access despite club operation. Lodge membership restrictions are not assumed to restrict day skiing. Manganui's goods lift is excluded; its T-bar vertical is a sector fact rather than resort-wide vertical.
- Hurricane Ridge's advertised vertical is withheld because its published endpoints do not reconcile. Skibowl and Porters retain explicitly labeled published verticals with endpoint-arithmetic caveats; these are not newly calculated or independently surveyed values.
- Bousquet and Duck Mountain separate ski uplift from tubing. Magic Mountain's mixed ski/sled/tubing acreage is not skiable acreage. Corin Forest's permanent outdoor carpet-served learning slope is not an indoor slope or temporary snowplay park.
- Nordic distances, geographic peaks, property acreage, shared-pass totals, future expansions and snowcat/hiking terrain are not silently treated as a resort's lift-served ski dimensions. Björkliden's 23 slopes are not the 44 slopes across its shared pass. Geilo's figures describe the SkiGeilo network, not town-wide terrain.
- Ramundberget's 43-slope alternative and Kittelfjäll's five-lift alternative are explicitly calculated category sums, not independent published headlines. No conflict alternative is selected as settled fact.
- Skimore Oslo uses an operator-authored offer on VisitOSLO; its indexed content and dynamic HTML differ in visibility. The operator's network widget conflicts with its 18-slope offer. Skimore Kongsberg's summer widgets and cross-resort English template text are not used for winter inventory. Source checking does not validate currently open counts.
- Selwyn's summary explicitly records its early 2026 season ending and stated 2027 return. Planned improvements and its toboggan conveyor are not imported as current ski dimensions.
- Lecht and Yad Moss access failed; other accessible identities were selected. Whitecap's inspected page contained unrelated gambling content and was not used. No numerical details were copied from commercial resort directories or third-party widgets.
- Existing Whitetail identities remain an unresolved potential duplicate; only the selected Wikidata identity receives research credit. This batch does not audit eligibility across the entire candidate directory, promote profiles to verified status, or guarantee present-day operation.
- Missing core measurements remain missing even where summaries or auxiliary statistics exist. Original summaries interpret the linked evidence; they do not imply a staff visit.

## Reproduction and licensing

Run `npm run data:build`, `npm run data:test`, `npm run lint` and `npm run build`. Generation reads existing caches and authored observations offline. No Supabase access occurs. Recheck linked official sources before refreshing, preserving native units, scope, dates, source periods and conflicting alternatives. Earlier review dates are not overwritten by regeneration.

Official pages remain copyrighted. This batch retains limited factual observations and original editorial summaries, not copied descriptions or images; it does not relicense official observations as CC0. Existing Wikidata CC0 and OpenStreetMap ODbL attribution remains in place.

## Verification and files

All 56 tests pass, including four new tests covering unique joins, summaries, provenance, scope, conflicts, public output and Bristol preservation. Lint and production build pass. Desktop Whiteface card-to-guide navigation and its mobile guide were inspected; Wisp's mobile card and guide show withheld acreage with the source and explanation. Source keyboard focus is visible. No horizontal document overflow at desktop or 390 × 844 mobile size. No layout changes required.

Added `official-batch-008.mjs`, `tests/official-batch-008.test.mjs` and this report. Updated `build-directory.mjs`, `resort-summaries.mjs`, the cumulative summary test, the previous batch's historical-minimum assertion and `README.md`. Regenerated canonical/research reports under `generated/` and `public/data/resorts.compact.json`. Earlier local work preserved; no React/style changes this batch.

Local preview remains at `http://127.0.0.1:5173/resorts`. A pre-existing Node warning reports disabled TLS certificate validation; this batch did not change that environment setting. Nothing committed, pushed, deployed or written to Supabase; main untouched.
