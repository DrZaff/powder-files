# Official-source research batch 013

Reviewed September 5, 2026. This block adds original, source-linked mountain-character summaries to 100 previously unresearched public profiles. All work remains local on `powderfiles-redesign`.

## Results

- 100 new summaries backed by 99 distinct primary operator, municipality or official destination URLs. Roc d'Enfer is legitimately shared by its domain and Saint-Jean-d'Aulps profiles.
- Six supported numerical observations across three profiles: Alpe du Grand Serre, Ski amadé and Whitetail.
- 97 profiles are summary-only. Missing vertical, terrain, trail, lift and elevation values remain visibly missing rather than inferred from marketing language, trail-map graphics or third-party directories.
- Cumulative public coverage is 803 source-linked overviews and 510 profiles with official numerical observations.
- Public inventory remains 1,521 medium/high-confidence profiles across 54 country labels. Bristol Mountain remains the sole verified profile; its 1,200-foot vertical, 39 trails, 138 acres and August 30 review date are unchanged.
- Canonical inventory remains 6,089 records from 7,439 cached raw records, with 366 ambiguities and 230 exclusions: 39 closed/disused, 165 Nordic-only, 25 private clubs and one indoor slope.
- Canonical source identifiers now include 4,873 OpenStreetMap records, 1,950 Wikidata records, 878 official URLs and one Powder Files record. These are source identifiers, not independent resort counts.
- Compact directory JSON is 2,437,300 bytes and 270,436 bytes gzip. Application code remains separately bundled.

## Countries in this block

France 36; Japan 29; Russia 7; Spain 5; Austria 5; Switzerland 4; Germany 2; United States 2; and one each from Belarus, Chile, Czechia, Greece, Italy, Norway, Poland, South Korea, Ukraine and the People's Republic of China. Total: 100 profiles across 18 country labels.

## Scope and limitations

- Alpe du Grand Serre's official destination page confirms its completed public 2025–26 season and publishes 1,367 m and 2,184 m station elevations. They remain station elevations; the pipeline does not automatically convert their difference into a verified ski vertical.
- Ski amadé is explicitly a five-region, 25-community pass network. Its maximum 760 km and 260-lift figures are network-wide and must not be added to member-resort figures.
- Whitetail's operator describes its vertical as close to 1,000 feet, so the value retains an approximate qualifier.
- Village and sector profiles such as La Tania, the Les Arcs bases, Saint-Martin-de-Belleville and Vaujany describe their distinct access points. Shared-domain totals are not assigned to them.
- Nordic terrain at La Stèle, Le Barioz, Les Fourgs and Plateau de Retord is not added to downhill dimensions. Snowcat, touring and other separately accessed experiences are likewise excluded from ordinary lift-served statistics.
- Identifier-only source labels are replaced with official resort names while stable IDs and name-field provenance are preserved. Current-brand wording is retained in the editorial name where it prevents a misleading obsolete label.
- Candidate status is not promoted by this research. A review date means a source page was checked; it is not a guarantee of today's lift operations or an independent survey.
- Questionable identities were deferred rather than used to fill the block, including private clubs, Nordic-only centers, closed areas, ski jumps, duplicate source records, and records representing municipalities without a distinct downhill area.
- Some small official sites still use HTTP. Their publisher URLs are preserved instead of inventing an HTTPS address that may not work.
- No commercial directory descriptions, copyrighted imagery or third-party mountain totals were copied.

## Reproduction and verification

Run `npm run data:build`, `npm run data:test`, `npm run lint` and `npm run build`. Generation uses the existing local structured-data caches and authored observations; it performs no Supabase request.

The full profile inventory is in [official-batch-013.mjs](official-batch-013.mjs). The generated [per-resort report](generated/official-batch-013-report.json) records missing core fields and the complete summary-only list.

All 77 data tests pass, including four batch-013 tests covering exact identities, source retention, official-name repair, network and station scope, approximation, public output and Bristol preservation. Lint, the production build and whitespace checks pass. Desktop review covered Ski amadé's card, thumbnail navigation, three scoped facts and source links at 1440 × 1100. Mobile review covered KitzSki's repaired name, summary-only state, thumbnail navigation, source link and menu at 390 × 844. Neither viewport had horizontal overflow.

No commit, push, deployment, main-branch change or Supabase write was performed.
