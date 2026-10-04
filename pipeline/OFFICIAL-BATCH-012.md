# Official-source research batch 012

Reviewed August 31, 2026. This block adds original, source-linked mountain-character summaries to 100 previously unresearched public profiles. It remains local on `powderfiles-redesign`.

## Results

- 100 new summaries from 100 distinct primary operator, municipality or official destination URLs.
- 21 supported numerical observations across six profiles: Grandeco, Itoigawa Seaside Valley, Iwate Kogen, Kandatsu, Ninox and Norn Minakami.
- 94 profiles are summary-only. This is intentional: an official page can establish a mountain's character and current public identity without supporting an unambiguous trail, lift, acreage, vertical or elevation total.
- Identifier-only display labels on this block's affected Wikidata records are replaced with the official resort names while preserving their stable IDs and recording name-field provenance.
- Cumulative public coverage is 703 source-linked overviews and 507 profiles with official numerical observations.
- Public inventory remains 1,521 medium/high-confidence profiles across 54 country labels. Bristol Mountain remains the sole verified profile; its 1,200-foot vertical, 39 trails, 138 acres and August 30 review date are unchanged.
- Canonical inventory remains 6,089 records from 7,439 cached raw records, with 366 ambiguities and 230 exclusions: 39 closed/disused, 165 Nordic-only, 25 private clubs and one indoor slope.
- Canonical source identifiers now include 4,873 OpenStreetMap records, 1,950 Wikidata records, 780 official URLs and one Powder Files record. These are source identifiers, not independent resort counts.
- Compact directory JSON is 2,387,090 bytes and 262,438 bytes gzip.

## Countries in this block

Japan 52; France 13; United States 5; Canada 4; Russia 3; Spain 2; Sweden 2; Czechia 2; and one each from Austria, Belarus, Chile, Greece, Iceland, Iran, Israel, Italy, Kosovo, Lesotho, Mexico, Montenegro, Morocco, New Zealand, North Macedonia, Norway and Slovenia. Total: 100 profiles across 25 country labels.

## Scope and limitations

- Grandeco's operator course guide supports a 1,010 m base, 1,590 m upper ski elevation, 580 m rise, ten courses, five lifts and a 4 km longest run. Its five parks are not added to the course count.
- Itoigawa's 3 km figure is a linked upper-to-lower descent, not a single named piste. Iwate Kogen's 2.6 km figure is likewise an advertised linked route. Kandatsu's 2.5 km measurement combines three named course sections. Norn's 2 km route combines its C and D courses.
- Ninox's 216 m elevation difference is transparently derived from the operator's 533 m upper and 317 m lower ski elevations. Its two-course total excludes learning features and the terrain park.
- Summaries are original Powder Files editorial descriptions of cited primary material, not resort marketing copy, visitor reviews or independent verification. Missing dimensions remain missing.
- Candidate status is not promoted by editorial enrichment. A source review date means the page was checked; it does not mean every lift is currently open or every number was independently surveyed.
- Several questionable next-in-line identities were deferred, including closed or stale operations, Nordic-only centers, private clubs, village or regional-pass identities, possible duplicates and sites whose present ski operation could not be established safely. No ambiguity or exclusion record was silently changed to fill the quota.
- Some older official sites still use HTTP. Their exact publisher URLs are retained rather than rewritten to a possibly invalid HTTPS address.
- No commercial resort-directory text, third-party descriptions or imagery was copied. Official-page facts remain subject to publisher copyright; Wikidata CC0 and OpenStreetMap ODbL attribution remains intact.

## Reproduction and verification

Run `npm run data:build`, `npm run data:test`, `npm run lint` and `npm run build`. Generation uses existing local structured-data caches and authored observations; it performs no Supabase request.

The complete identifiers, sources, summaries, observations, scope notes and review dates are in [official-batch-012.mjs](official-batch-012.mjs). The generated [per-resort report](generated/official-batch-012-report.json) records missing core fields and the summary-only list.

All 73 data tests pass, including five batch-012 tests covering unique identities, strict joins, provenance retention, official-name repair, derived and linked-route scope, public output and Bristol preservation. Lint, production build and whitespace checks pass. Desktop checks covered Grandeco's card, thumbnail navigation, complete field guide and source-backed facts at 1440 × 1100. Mobile checks covered Ooana's repaired display name, summary-only state, thumbnail navigation, source URL and menu at 390 × 844. Neither viewport had horizontal overflow.

No commit, push, deployment, main-branch change or Supabase write was performed.
