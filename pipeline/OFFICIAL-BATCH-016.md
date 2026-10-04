# Structured-source overview batch 016

Reviewed October 3, 2026. This block resolves 100 identifier-only Wikidata candidates into readable resort names and adds concise mountain-character overviews using Wikidata CC0 identity and geographic records. Work was completed on `powderfiles-redesign`.

## Results

- 100 public candidate profiles now have readable names and source-linked overview summaries.
- Every name repair and overview retains its stable Wikidata ID, source URL and October 3 review date.
- No numerical mountain facts were added and no verification status or confidence level was promoted.
- Cumulative coverage reaches 1,103 profiles with source-linked overviews. Official numerical-fact coverage remains 510 profiles.
- Bristol Mountain remains the sole staff-verified profile with its existing facts and August 30 review date unchanged.
- This block spans seven country labels: Japan 36; France 33; Poland 19; Austria 6; Finland 4; and Germany and Italy one each.
- The public directory remains 1,521 medium/high-confidence profiles. Its compact JSON is 2,533,970 bytes and 289,345 bytes gzip.
- The public candidate backlog now contains 259 unresolved identifier-only names; these remain unpublished as overviews until they can be screened safely.

## Editorial limits

- Names come from Wikidata’s multilingual entity API. The English display forms are transliterations, translations or concise normalized forms, while stable IDs remain unchanged.
- Summaries are original Powder Files descriptions of identity, setting and relative character. They are not copied marketing text, visitor reviews or live operating reports.
- No trail, lift, acreage, elevation, vertical or longest-run figure was inferred from labels, coordinates or third-party directories.
- Current operation still needs official-source review. Candidate status explicitly does not guarantee that a resort is open today.

## Reproduction and verification

The complete inventory is in [official-batch-016.mjs](official-batch-016.mjs). Run `npm run data:build`, `npm run data:test`, `npm run lint` and `npm run build` to reproduce and verify the output. The generated [per-resort report](generated/official-batch-016-report.json) records the complete summary-only list. All 86 data tests, lint, production build and whitespace checks pass.

No Supabase schema, policy, authentication, storage or live-data operation is part of this block.
