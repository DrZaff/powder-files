# Official-source research batch 006

Reviewed August 31, 2026. Fifty previously unresearched public profiles, with original mountain-character summaries on directory cards and field guides.

## Results

- 50 summaries; 215 supported numerical observations across 49 profiles. These include auxiliary facts and do not imply complete core mountain dimensions.
- Ski Martock is summary-only: trail-map labels support its character but do not establish reliable headline totals.
- Nine withheld conflict fields across eight profiles: Mont Grand-Fonds trails, Mt. Brighton trails, Mount St. Louis Moonstone trails and acreage, Mt. Abram trails, Ski Ward lifts, Pine Creek vertical, Snowy Range trails and Snowshoe's Silver Creek sector trails.
- 61 distinct official source URLs retained. 34 US and 16 Canadian profiles; 48 Wikidata IDs and two OSM way IDs. Exact identity joins only.
- Cumulative: 203 summaries, 184 profiles with official numerical facts, 241 distinct official source URLs and 81 profiles with conflicts (including previous structured-source conflicts).
- Directory remains 1,521 medium/high-confidence profiles across 54 country labels. Bristol remains the only staff-verified profile. Existing Turkey/Türkiye label duplication is not addressed here.
- Canonical inventory unchanged: 6,089 records from 7,439 cached source records, 230 exclusions and 366 ambiguities. No new identity merges, exclusions or source fetches.
- Compact read-only JSON: 1,700,178 bytes; 168,246 bytes gzip, loaded separately. JavaScript remains 274.06 kB (85.48 kB gzip); existing image assets unchanged.

## Resorts

Mont Grand-Fonds; Montana Snowbowl; Baldy Mountain Resort (British Columbia); Mount Bohemia; Mt. Brighton; Mount Hood Meadows; Mount Seymour; Mount Shasta Ski Park; Mount Spokane; Mount St. Louis Moonstone; Mont Sutton; Mount Washington (British Columbia); Mt. Abram; Mount Norquay; Nakiska; Nub's Nob; Okemo; Paoli Peaks; Pats Peak; Pebble Creek; Perfect North Slopes; Powder King; Purden; Rabbit Hill; Ragged Mountain; Saddleback; Searchmont; Seven Springs; SilverStar; Ski Apache; Ski Butternut; Ski Cooper; Ski Brule; Bluewood; Ski Sundown; Snowshoe; Solitude; Ski Cloudcroft; Ski Ward; Bromont; Ski Chantecler; Ski Martock; Snow Creek; Snowy Range; Skeetawk; Ski Big Bear (Pennsylvania); Mt. Holly; Pine Knob; Pine Creek; Sandia Peak.

Exact identities, citations, review dates, observations and scope notes are in `official-batch-006.mjs`; per-profile missing fields and conflicts are in `generated/official-batch-006-report.json`.

## Scope and limitations

- Skeetawk uses the current 30-acre chairlift footprint, not proposed gondola terrain or the entire lease. Cooper's acreage is lift-served, excluding separate snowcat terrain. Bohemia's published acreage includes hiking/bus-return sectors and says so explicitly.
- Baldy's marked trails and glades are separate acreage fields. Rabbit Hill's four learning lifts are not a whole-resort total. Ski Brule uses skiable acreage, not property acreage. Tubing lifts and scenic tramways are not downhill totals.
- Snowshoe's Western Territory and Basin verticals are separately labeled. Silver Creek's conflicting counts are withheld, with both sources retained. No combined trail total or property-wide ski acreage is invented.
- Highest lift, mountain summit and lodge elevation remain distinct. Advertised verticals with arithmetic/scope caveats retain notes; no vertical is manufactured by subtracting unrelated elevations. Powder King's inconsistent area/elevation conversions are withheld.
- Mt. Abram's alternative count is the sum of published ability categories, not an independent headline. Snowy Range's alternative is a count of named report rows including segments. Both remain unresolved rather than falsely precise.
- Montana Snowbowl, Mt. Abram and Perfect North retain 2025–26 source-period labels. Report denominators are not currently open terrain. Announced future lifts are not counted as operational.
- Official-source research does not promote a candidate to staff verified or guarantee current access, operation or lift configuration. Strict missing-core-field reports do not treat learning-lift or summit statistics as complete resort lift/elevation coverage.

## Reproduction, licensing and verification

Run `npm run data:build`, `npm run data:test`, `npm run lint` and `npm run build`. Regeneration uses existing local caches, performs no network requests and makes no Supabase writes. Recheck cited official pages before changing facts; preserve native units, scope, qualifiers, source periods and alternative values. Only actually reviewed entries receive new review dates.

Official pages remain copyrighted by their publishers. This batch retains limited factual observations, citations and original editorial summaries, not copied descriptions or imagery. It does not scrape commercial resort directories. Existing Wikidata CC0 and OpenStreetMap ODbL attribution/provenance remain intact; official observations are not relicensed as CC0.

All 48 automated tests pass, including exact joins, source retention, conflicts, terrain scope, generated content, old dates and Bristol preservation. Lint, production build and tracked-diff whitespace checks pass. Browser checks cover Nakiska's desktop card, thumbnail navigation and mobile field guide, Pine Creek's conflicting vertical and source links, and Martock's summary-only gaps. At 390 × 844 there is no horizontal document overflow and source links retain visible keyboard focus. No material layout changes needed.

## Files changed

- Added `official-batch-006.mjs`, `tests/official-batch-006.test.mjs` and this report.
- Updated `build-directory.mjs`, `resort-summaries.mjs`, `tests/resort-summaries.test.mjs` and `README.md`.
- Regenerated `generated/` canonical/report outputs and `public/data/resorts.compact.json` through the existing pipeline.
- No React/style changes. Existing uncommitted work preserved; no commit, push, deployment, main-branch or Supabase changes.
