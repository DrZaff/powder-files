# Official research batch 004

Reviewed 2026-08-30. Local-only changes on `powderfiles-redesign`; no commits, pushes, deployment or Supabase changes.

## Results

- 25 newly researched profiles: 23 United States, 2 Canada.
- 25 original, source-linked mountain-character summaries, displayed by the existing shared component on directory cards and field guides.
- 86 supported numerical observations across 22 profiles; 4 unresolved fields explicitly withheld for source review.
- 28 distinct cited official pages/documents, including indexed PDF evidence retained only for unresolved conflicts.
- Bryce, Catamount and Frost Fire are summary-only additions. Missing dimensions remain unsourced.
- Cumulative: 103 summaries, 95 profiles with official numerical observations, 123 distinct official source URLs.
- Public directory unchanged at 1,521 medium/high-confidence profiles and 54 country labels; Bristol remains the sole verified profile.
- Structured elevation coverage remains 136 profiles. Total conflict profiles now 69. Existing 230 exclusions and 366 identity ambiguities unchanged.
- Compact data: 1,475,957 bytes (141,988 bytes gzip at this build). It remains separate from the JavaScript bundle; JS remains 274.06 kB / 85.48 kB gzip.

## Profiles

Belleayre; Black Mountain of Maine; Blacktail; Blue Hills; Boston Mills / Brandywine; Bretton Woods; Brian Head; Brighton; Bryce; Buena Vista; Campgaw; Castle Mountain; Catamount; Cherry Peak; Dartmouth Skiway; Devil’s Head; Discovery; Purgatory (existing Durango Mountain Resort record); Eaglecrest; Elk Mountain Ski Area (Pennsylvania); Ferguson Ridge; Frost Fire; Manning Park (existing Gibson Pass record); Granite Gorge; Granite Peak (Wisconsin).

## Evidence and limitations

`official-batch-004.mjs` is the authored evidence ledger: exact identifiers, original summaries, source URLs, dates, units and scope notes. `generated/official-batch-004-report.json` enumerates missing core fields, sources and unresolved observations per profile. `generated/resort-summaries-report.json` retains all summaries. No existing identities were renamed or merged to force matches.

Belleayre acreage, Blacktail top elevation, and Bretton Woods acreage/glade count have inconsistent official evidence. Their alternative values and links are retained with null headline values and low confidence. PDF text was available through indexing, but rendered page images were not successfully available for visual validation; no PDF-only numerical facts were accepted as checked observations. These discrepancies still require source-scope and visual review.

Brian Head has two supported terrain parks, while inconsistent core dimensions across HTML and press-kit text remain withheld. Dartmouth’s base value duplicates its advertised vertical, and Brighton’s listed elevations do not reconcile with its advertised lift-served vertical; no arithmetic correction was invented. Purgatory acreage is explicitly a 2023 observation, not a current-season survey. Report denominators for Cherry Peak and Bretton Woods describe total networks, not current openings.

Boston Mills / Brandywine totals combine two separate areas. Campgaw’s skiing lifts exclude its tubing lift. Manning Park alpine acreage excludes the surrounding park. Discovery acreage is patrolled terrain, not groomed piste. National Forest extent, summer bike trails, Nordic trails, snowcat terrain and surrounding backcountry are not silently added to downhill statistics.

Catamount’s official ticket page was available in the search index but direct retrieval returned HTTP 403. Its limited summary reflects the indexed 2025–26 offering, not a verified current schedule. Bryce sells non-member access despite membership-based ownership; some dates remain restricted. Numerical facts alone do not establish current operation, safety, snow conditions or independent staff verification.

## Licensing and refresh

Summaries are original Powder Files interpretations. Official publishers retain copyright in their pages, maps and descriptions. Only limited factual observations, original prose and source links are included; no copied descriptions or images. Existing Wikidata CC0 and OpenStreetMap ODbL attribution remains intact.

Revisit the cited official pages before updating the authored batch and review dates. Preserve unresolved alternatives until their scope or period is clarified. Rebuild from local cached structured sources using `npm run data:build`; no network or Supabase connection is needed for this step. Future batches must include original sourced summaries, and the build continues to reject official-fact profiles without one.

## Verification

40 automated tests pass, including batch uniqueness, exact identity selection, scope exclusions, provenance and date retention, conflict withholding, all 103 summaries in generated output, and Bristol preservation. Lint, production build and whitespace checks pass. Desktop directory and mobile directory/field-guide inspection covered Belleayre conflicts, Bryce summary-only states, thumbnail/heading navigation and keyboard-visible source focus. No horizontal overflow was detected at 390 pixels. No frontend layout changes were needed.

The host continues to emit a pre-existing `NODE_TLS_REJECT_UNAUTHORIZED=0` warning; this batch did not set or change that environment setting. The data rebuild used local caches; official research used the web tool, not that Node networking configuration.
