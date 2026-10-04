# Official-source research batch 007

Reviewed August 31, 2026. The interrupted selection of fifty profiles is now integrated, with original mountain-character summaries on directory cards and field guides. No substitutions were made during the integration/resumption. During initial research, inaccessible Mountain High pages led to selection of Mount Rose instead, before the fifty-entry batch was authored.

## Results

- 50 new summaries; 147 supported numerical observations across 40 profiles. Auxiliary statistics do not imply complete core mountain dimensions.
- Ten summary-only profiles: Otis Ridge, Rotarun, Sasquatch Mountain, Ski Ben Eoin, Sommet Morin Heights, Snowhaven, Song Mountain, Summit Pass, Tussey Mountain and Vorlage. Missing measurements remain unverified.
- 14 withheld conflict fields across 11 profiles: Mountain Creek lifts; Ober vertical; Mont-Comi trails; Bradford lifts; Montcalm parks; Morin Heights trails and lifts; Snowriver acreage, trails and lifts; Snow Summit lifts; Stratton lifts; Sundance acreage; Tenney trails.
- 63 distinct official URLs, 37 US and 13 Canadian profiles; 49 Wikidata IDs and one OSM way ID. Exact identity joins only.
- Cumulative: 253 summaries (previously 203), 224 profiles with official numerical facts (previously 184), 303 distinct official source URLs, 136 profiles with structured elevation and 92 profiles with conflicts, including earlier structured-source conflicts.
- Public inventory unchanged: 1,521 medium/high-confidence profiles across 54 country labels. Turkey/Türkiye duplication remains. Bristol is still the sole staff-verified profile; its 1,200-foot vertical, 39 trails and earlier review date are preserved.
- Canonical inventory unchanged: 6,089 records from 7,439 cached structured-source records; 230 exclusions and 366 ambiguities. No new identity merges or exclusions and no structured API refresh in this batch.
- Compact read-only JSON: 1,801,354 bytes, 180,672 bytes gzip, loaded separately. JavaScript stays 274.06 kB (85.48 kB gzip); CSS 30.88 kB (7.34 kB gzip). Existing owned hero image unchanged.

## Resorts

Mountain Creek; Mount Rose Ski Tahoe; Nashoba Valley; Ober Mountain; Otis Ridge; Mont-Comi; Powder Ridge (Connecticut); Quechee; Rotarun; Sasquatch Mountain; Silverton Mountain; Ski Ben Eoin; Ski Bradford; Ski Montcalm; Sommet Morin Heights; Snowstar; Ski Land; Snowriver; Snow Summit; Snow Valley (California); Snow Valley (Edmonton); Snowhaven; Sommet Edelweiss; Song Mountain; Spirit Mountain; Stevens Pass; Stoneham; Stratton; Sugar Bowl; Sugarbush; Saskadena Six (formerly Suicide Six); Summit Pass; Sundance; Sunday River; Sunlight; Sunridge; Tamarack Resort; Tenney Mountain; Teton Pass (Montana); Summit at Snoqualmie; Thunder Ridge; Thunderhill; Timber Ridge; Timberline Lodge; Titcomb Mountain; Titus Mountain; Troll Resort; Tussey Mountain; Val Saint-Côme; Vorlage.

Exact IDs, per-field citations, scope notes, alternatives and retrieval dates are in `official-batch-007.mjs`. Missing core fields, source lists and conflicts are in `generated/official-batch-007-report.json`.

## Scope and limitations

- Silverton uses 1,900 feet of lift-served vertical, not helicopter or hiking totals. Its expert terrain, avalanche-equipment requirement and season-dependent access model are described. Hiking/heli acreage is not presented as lift-served ski acreage.
- Timberline's 4,540-foot shuttle descent is not imported as lift-served vertical. Its Palmer operating elevation explicitly notes chair or snowcat access. Combined acreage includes Summit Pass; Summit Pass receives no duplicate Timberline-wide statistics.
- Snowstar's 28-acre park is not whole-resort ski acreage. Stoneham's 135.8 hectares of ski terrain are not 816.8 hectares of property. Powder Ridge's ski area is not the full property. Sugarbush's wooded acreage is separate from on-trail acreage.
- Snowriver statistics describe the combined two-mountain operation. Its named-sector identity and the existing Blackjack profile are not automatically merged; acreage/trail/lift contradictions are retained for review.
- Trail totals retain scope such as glades, terrain areas or features. Learning carpets, chairlifts and whole-resort lifts remain distinct. Tubing verticals/lifts, Nordic distances, mountain geographic summits and summer bike trails are not imported as downhill skiing totals.
- Ober and Snow Valley Edmonton retain 2025–26 source-period labels. Report denominators are not currently open counts. Troll's fourth T-bar is explicitly described as opened in 2026; the conflicting older paragraph is documented, not counted as an additional lift.
- Tussey's current operator notice describes conversion of its tubing hill to beginner/intermediate ski terrain. Its summary reflects that change; old tubing descriptions are not carried forward.
- Unresolved numbers remain withheld. Calculated alternatives such as sums of lift types are identified as calculated, not independent published headlines. Missing measurements are never inferred by subtraction or copied from commercial directories.
- Original summaries are editorial interpretations of cited operator material, not staff visits or copied marketing descriptions. Research does not promote candidate status, establish present-day operation, or guarantee every resort meets the active/public inclusion definition. Remaining candidate eligibility and stale identity issues need a separate review; this is not an eligibility audit of the full directory.

## Reproduction, licensing and verification

Run `npm run data:build`, `npm run data:test`, `npm run lint` and `npm run build`. Regeneration uses existing local caches and the authored observations, performs no network requests and makes no Supabase writes. Recheck linked operator sources before revisions. Preserve native units, qualifiers, periods, alternatives and actual review dates; older summaries are not redated during regeneration.

Official pages remain copyrighted by their publishers. Retained material consists of limited factual observations, citations and original summaries, not copied descriptions or imagery. No commercial resort directory scraping. Existing Wikidata CC0 and OpenStreetMap ODbL attribution remain; official-source observations are not relicensed as CC0.

All 52 tests pass, including exact identity joins, provenance, scope distinctions, conflict handling, generated summaries, old review dates and Bristol preservation. Lint, production build and tracked-diff whitespace checks pass. Browser checks cover Stoneham's desktop facts and thumbnail navigation, its mobile guide, Sundance's mobile card and paired conflict citations, and Tussey's summary-only gaps. No horizontal document overflow at the desktop size or the 390 × 844 mobile override. Keyboard source focus remains visible. No material layout changes were required.

The local preview server was restarted at `http://127.0.0.1:5173/`. A pre-existing environment warning reports disabled TLS certificate validation for Node; this batch did not change that setting. Local generation is offline.

## Files changed in this batch

- Added `official-batch-007.mjs`, `tests/official-batch-007.test.mjs` and this report.
- Updated `build-directory.mjs`, `resort-summaries.mjs`, `tests/resort-summaries.test.mjs`, `tests/official-batch-006.test.mjs` and `README.md`. The older batch test now checks its historical minimum; the summary test enforces the new exact cumulative total.
- Regenerated canonical data and reports under `generated/`, plus `public/data/resorts.compact.json`.
- No React/style changes. Earlier local work preserved. No commit, push, deployment, main-branch or Supabase changes.
