# Official mountain facts: batch 001

Checked 2026-08-30. This is a manually researched batch of 25 additional public-directory profiles, not a claim that the global directory is complete or independently verified.

## Method and licensing

`official-batch-001.mjs` stores individually transcribed factual measurements from official resort, operator and destination pages. No commercial directory data, descriptions, images or copied page bodies are included. Copyright in each linked page stays with its publisher. This batch does not label official-site content CC0 or ODbL; existing Wikidata/OSM attribution remains separate and unchanged.

Every measurement carries the exact source URL, retrieval date, publication date when known, native unit, confidence and scope notes. A missing publication date means unknown, not current-season confirmation. Resort identity joins use exact stored identifiers; they fail if an expected profile is missing or outside the medium/high-confidence public set. Sourcing measurements never upgrades the overall profile to verified. Bristol remains the verified featured seed.

## Reproduce and refresh

Run `npm run data:build` using the existing Wikidata/OSM caches, then `npm run data:test`, `npm run lint` and `npm run build`. The build applies this versioned batch before structured elevation enrichment. It produces `generated/official-batch-001-report.json`, including per-resort sources, missing core fields and conflicting observations, and updates the canonical dataset, research queue, coverage report and public compact dataset.

This reproduces the checked observations; it does not automatically recheck official websites. To refresh, open each cited official page, compare the exact terrain/count definition and season, update only supported observations and their actual check dates, preserve conflicting alternatives, then rebuild and test. Do not add estimated statistics to fill gaps. Do not infer vertical drop by subtracting unrelated village, summit or base-area elevations.

## Scope and known gaps

- The batch is deliberately North America-heavy, with Glenshee and Val Thorens as European examples; it is not representative worldwide coverage.
- Lower bounds (over 3,500 acres) and open-ended counts (120+ runs) remain qualified in the interface.
- Piste length in kilometres remains length, never converted to acreage. Cards use sourced piste length when acreage is unavailable.
- Summit elevation is not automatically the highest lift-served skiing elevation. Village bases may not be the lowest point.
- Brundage's lift-accessed area includes unpatrolled backcountry; Snowbowl's advertised vertical includes hike-to terrain. Notes make these limitations explicit.
- Alta is skiing-only. Lift counts may include conveyors, school-only or real-estate access lifts; included scope is noted where published.
- Buttermilk acreage, Crystal trail terminology, Gore trail counts and Val Thorens run/lift totals require review. Conflicts remain blank numeric values with source links, rather than selecting a preferred number.
- 49 Degrees North's advertised vertical differs from the arithmetic difference between its published elevations; the advertised figure is labeled and the discrepancy retained. Angel Fire lift totals remain unsourced here because equipment lists and FAQ totals differ.
- Banff Sunshine and Glenshee have especially sparse coverage in this batch. The queue records every missing core field; a summit value does not satisfy a missing highest-skiing-elevation field.
- Buttermilk uses official HTML observations only. The PDF fact sheet was considered but not incorporated because its visual preview was unavailable.

No Supabase changes, automated source scraping, account functionality, commits or deployment are part of this batch.
