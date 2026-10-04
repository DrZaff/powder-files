# Official research batch 003 and resort summaries

Reviewed 2026-08-30. Local-only; no Supabase changes, publication, commits or pushes.

## Results

- 25 newly researched public profiles: 22 United States, 3 Canada.
- 81 source-checked numerical observations across 20 profiles; 5 unresolved conflict fields.
- 30 cited official pages in this batch, including narrative evidence.
- All 25 receive original summaries. Boreal, Buck Hill, Caberfae Peaks, Calabogie Peaks and Greek Peak have summary-only research in this batch; their numerical mountain facts remain unsourced.
- 53 previously enriched profiles backfilled: 78 summaries total, 73 profiles with official numerical observations.
- Public directory remains 1,521 medium/high-confidence profiles and 54 country labels. Bristol remains the sole verified profile. Summary writing does not promote verification.
- No changes to inclusion/deduplication: 230 exclusions and 366 ambiguities remain.

## Evidence and limitations

`official-batch-003.mjs` contains exact identity joins, original summaries, sources, dates, units and scope notes. `generated/official-batch-003-report.json` lists every profile, its missing core fields and cited sources. `generated/resort-summaries-report.json` lists all original summaries and source links.

Conflicts are retained for Arctic Valley acreage, Boyne trail totals, Burke trail totals, Camden glades and Dodge Ridge trail totals. Individual-chair rise is not resort vertical; developed acreage is not permit acreage; summer bike trails are not ski trails; tubing lifts are not silently counted as skiing lifts. Current-season operation is not established by a marketing page. Historical and planned source periods remain explicit.

Berkshire East research was deferred after official HTML access failed; Asessippi was selected instead. Bromley and Park City were considered but not joined because no matching public profile was present. No identity/confidence changes were made to force a match. Some other reviewed official HTML pages exposed no numerical facts; no estimates or commercial-directory statistics filled those gaps.

## Summary policy for every subsequent batch

1. Write a short original mountain-character paragraph from checked sources, not copied marketing prose. Prefer useful differences in terrain, scale, learning, freestyle or night access.
2. Cite exact source pages. Backfilled summaries declare evidence keys; new entries declare narrative sources. Retain original attribution, review date and editorial status in canonical field provenance.
3. Distinguish interpretation from official statistics. Avoid unsupported promises about crowds, snow reliability, safety or visitor experience. Do not turn an old statistic into a current-season claim.
4. Render the same summary on the directory card and field guide. Bristol uses the same data while retaining its featured profile.
5. Add each new batch to the summary application. The build fails if an official-fact profile lacks a summary or a declared evidence key is missing.
6. Run the local data build, tests, lint, production build and desktop/mobile review. Never edit generated files by hand.

## Licensing and refresh

Summaries are original Powder Files editorial work. Official pages remain copyrighted by their publishers; only limited factual observations and original interpretations are retained, with links. No descriptions, maps or images were copied. Existing Wikidata CC0 and OpenStreetMap ODbL notices remain in place; these additions do not relicense the underlying directory.

Refresh by reviewing the exact cited pages, updating authored entries and review dates, then running `npm run data:build`. Preserve conflicts until scope or timing can be resolved. Network collection is not needed to rebuild from existing local structured-source caches. An editorial review date does not change an observation's historical source period.

## Verification

37 automated tests pass, including unique batch IDs, summary coverage, provenance retention and Bristol preservation. Lint and production build pass. Data remains loaded separately from the JavaScript bundle. Browser review covers directory cards and field guides at desktop/mobile widths, including summary-only profiles and keyboard source-link access.
