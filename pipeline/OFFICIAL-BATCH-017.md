# Structured-source overview batch 017

Reviewed October 3, 2026. This block resolves 100 more identifier-only Wikidata candidates into readable resort names and adds concise mountain-character overviews using Wikidata CC0 identity and geographic records. Work was completed on `powderfiles-redesign`.

## Results

- 100 additional public candidate profiles now have readable names and source-linked overview summaries.
- Every name repair and overview retains its stable Wikidata ID, source URL and October 3 review date.
- No numerical mountain facts were added and no verification status or confidence level was promoted.
- Cumulative coverage reaches 1,203 profiles with source-linked overviews. Official numerical-fact coverage remains 510 profiles.
- Bristol Mountain remains the sole staff-verified profile with its existing facts and August 30 review date unchanged.
- This block spans ten country labels: France 59; Japan and Poland 11 each; Italy 6; Austria, Finland and Switzerland 3 each; Germany 2; and Slovakia and Spain one each.
- The public directory remains 1,521 medium/high-confidence profiles. Its compact JSON is 2,566,082 bytes and 295,726 bytes gzip.
- The public candidate backlog now contains 159 unresolved identifier-only names.

## Editorial limits

- Names come from Wikidata’s multilingual entity API. Display forms are transliterations, translations or concise normalized forms, while stable IDs remain unchanged.
- Summaries are original Powder Files descriptions of identity, setting and relative character. They are not copied marketing text, visitor reviews or live operating reports.
- No trail, lift, acreage, elevation, vertical or longest-run figure was inferred from labels, coordinates or third-party directories.
- Regional networks, village bases and distinct lift sectors remain explicitly described as such.
- Current operation still needs official-source review. Candidate status explicitly does not guarantee that a resort is open today.

## Reproduction and verification

The complete inventory is in [official-batch-017.mjs](official-batch-017.mjs). Run `npm run data:build`, `npm run data:test`, `npm run lint` and `npm run build` to reproduce and verify the output. The generated [per-resort report](generated/official-batch-017-report.json) records the complete summary-only list. All 89 data tests, lint, production build and whitespace checks pass.

No Supabase schema, policy, authentication, storage or live-data operation is part of this block.
