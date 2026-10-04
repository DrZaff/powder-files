# Official-source research batch 005

Reviewed August 31, 2026. First 50-profile batch; future batches default to 50 researched profiles, not 50 guaranteed complete fact sets.

## Results

- 50 new original, source-linked mountain-character summaries, displayed on directory cards and field guides.
- 170 supported numerical observations across 40 profiles. This includes auxiliary facts such as park acreage and base-area counts, not necessarily complete core mountain dimensions.
- 10 profiles have summaries but no settled numerical facts: Hogadon, Horseshoe, Hyland Hills, Lost Valley, Massif du Sud, Bottineau, Mission Ridge Winter Park (Saskatchewan), Mont Farlagne, Alta Sierra and Arrowhead. Horseshoe also has a withheld conflict.
- Four explicitly withheld fields: Horseshoe trails (29/28), Lee Canyon trails (31/27), Lutsen lifts (7/9), Mohawk lifts (eight headline versus nine by adding the listed types).
- 57 distinct official source URLs retained for this batch. 38 US and 12 Canadian records, joined to 48 Wikidata IDs and two OSM way IDs. No fuzzy name joins or source-record replacement.
- Cumulative: 153 profiles with summaries; 135 with official numerical observations; 180 distinct official source URLs; 73 profiles with at least one conflict, including pre-existing structured-source conflicts.
- Public directory unchanged at 1,521 medium/high-confidence profiles and 54 country labels. Bristol remains the sole staff-verified profile. Country labels are not perfectly normalized (for example Turkey/Türkiye); this batch does not fix geography or expand global coverage.
- Canonical inventory remains 6,089 records from 7,439 cached source records, with 230 exclusions and 366 ambiguities. No new identity merges or exclusions.
- Read-only compact JSON: 1,576,857 bytes; 153,849 bytes gzip. Loaded separately from the unchanged 274.06 kB JavaScript bundle (85.48 kB gzip).

## Resorts

Granlibakken; Great Bear; Great Divide; Grouse Mountain; Gunstock; Harper Mountain; Hidden Valley (Pennsylvania); Hilltop; Hogadon; Holiday Valley; Horseshoe; Howelsen Hill; Hunter Mountain; Hyland Hills; Jack Frost; Jay Peak; Killington; Kimberley; King Pine; Labrador Mountain; Lee Canyon; Laurel Mountain; Le Relais; Le Valinouet; Liberty Mountain; Little Ski Hill; Lonesome Pine; Loon Mountain; Lost Valley; Loveland; Lutsen; Mad River Glen; Mad River Mountain (Ohio); Magic Mountain (Vermont); Marmot Basin; Marquette Mountain; Massif du Sud; Bottineau Winter Park; McIntyre; Middlebury Snowbowl; Mission Ridge Winter Park (Saskatchewan); Mohawk Mountain; Monarch; Mont Blanc (Quebec); Mont Farlagne; Mont Orignal; Alpine Valley (Michigan); Alta Sierra; Arrowhead (New Hampshire); Ascutney Outdoors.

Exact stable IDs, individual sources, observations, dates, scope notes and missing core fields are in `official-batch-005.mjs` and the generated `official-batch-005-report.json`.

## Scope decisions and limitations

- Lee Canyon uses 195 lift-served acres, not the additional hike-to area. Loveland uses 1,800 lift-served acres and the highest lift elevation, not the mountain summit. Monarch uses 1,017 lift-served acres and 72 lift-served trails, excluding hike-to and cat-skiing terrain.
- Ascutney describes the current T-bar footprint (26 acres, eight trails, 450 feet), not the former full resort. Arrowhead's limited volunteer operation is explicit. Neither is promised to be operating on the visitor's chosen date.
- Great Bear park acreage, Little Ski Hill park acreage, summer mountain-bike counts, Nordic trails and tubing lifts are not silently turned into downhill ski-area totals. Little Ski Hill's sourced park area has its own field, not `area`.
- Jack Frost does not absorb Big Boulder; Killington does not absorb Pico; Labrador does not absorb Song. Glade counts are kept separate when the operator separates them.
- Kimberley trail totals and Lutsen acreage/trail scope remain unresolved and are withheld. Gunstock's conflicting night-trail counts are noted but not displayed as a settled number. No PDF-only dimensions imported.
- Advertised verticals at Kimberley and Mohawk retain arithmetic caveats. No vertical is invented by subtracting unrelated base and summit elevations. Monarch's published vertical is explicitly not guaranteed to be wholly lift-served.
- King Pine, Grouse and Le Relais retain 2025–26 source periods. Condition-report denominators describe network totals, not current open terrain or an independently checked 2026–27 configuration.
- Mad River Glen's official equipment restriction is explicit: skiing only, no snowboards. Cooperative ownership is not confused with a members-only ski club.
- Enrichment does not promote candidate records to staff-verified status. Current operation, public access and exact lift service still require human verification. Missing core-field reports are deliberately strict: a `summit`, `chairlifts` or park statistic does not automatically satisfy `skiing_elevation`, `lifts` or skiable `area`.

## Reproduction and licensing

Run `npm run data:build`, `npm run data:test`, `npm run lint` and `npm run build`. The build joins authored observations onto the existing ignored local source caches; it performs no network requests and no Supabase writes. A fresh source fetch is separate and must follow the endpoint etiquette in the main README.

Recheck the cited official pages before changing an observation. Preserve native units, scope, qualifiers, source periods and conflicts; update only the observations and summaries actually reviewed. Older summaries keep their August 30 review date when this August 31 batch is built.

Official web pages remain copyrighted by their publishers. Only limited factual observations, citations and original Powder Files editorial interpretations are retained; no copied descriptions or images, and no commercial resort-directory scraping. Existing Wikidata CC0 and OSM ODbL attribution remains intact. Official observations are not relicensed as Wikidata CC0.

## Verification

44 automated tests pass, including 50 unique public identities, numeric/conflict validation, field provenance, exact OSM joins, source seasons, terrain scope, no verification promotion, preserved Bristol facts and unchanged older review dates. Lint and production build pass. Directory cards and field guides are checked in the local browser at desktop and mobile sizes; source links, conflict labels and summary-only gaps are reviewed. No commit, push, deployment, main-branch or Supabase changes.

Browser checks cover Hunter's populated card and guide, Horseshoe's withheld-count card and both source links, and Hogadon's summary-only card. Phone checks use a 390 × 844 viewport, with no horizontal document overflow and a visible keyboard focus outline. Temporary viewport override reset afterwards.

## Files changed in this batch

- Added `official-batch-005.mjs`, `tests/official-batch-005.test.mjs` and this report.
- Updated `build-directory.mjs`, `resort-summaries.mjs`, `tests/resort-summaries.test.mjs` and `README.md`.
- Regenerated local `generated/` reports/canonical outputs and `public/data/resorts.compact.json` through the existing pipeline. No React component or styling changes needed; existing summary and fact components render the new content.
- Preserved all pre-existing uncommitted prototype/pipeline changes. Ignored caches and build output were not staged.
