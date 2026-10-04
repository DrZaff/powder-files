# Structured-source overview batch 018

Reviewed October 3, 2026. This block adds source-linked overviews to 100 more medium-confidence public candidates and repairs 62 identifier-only names using Wikidata CC0 records. Work was completed on `powderfiles-redesign`.

## Results

- 100 additional profiles now have concise mountain-character summaries; 62 also receive readable display names without changing their stable IDs.
- No numerical mountain facts were added and no verification status or confidence level was promoted.
- Cumulative coverage reaches 1,303 profiles with source-linked overviews. Official numerical-fact coverage remains 510 profiles.
- Bristol Mountain remains the sole staff-verified profile with its existing facts unchanged.
- This block spans 24 country labels, led by Poland 29, Japan 25, France 12, Austria 5 and Finland 4.
- The public directory remains 1,521 medium/high-confidence profiles. Its compact JSON is 2,597,303 bytes and 300,715 bytes gzip.
- The unresolved identifier-only public backlog is now 97 profiles.

## Editorial limits

- Names come from Wikidata’s multilingual entity API or the existing structured record. Stable source identities are unchanged.
- Summaries are original Powder Files descriptions, not copied marketing text, visitor reviews or live operating reports.
- No trail, lift, acreage, elevation, vertical or longest-run figure was inferred from a label or coordinate.
- Current operation still needs official-source review. Candidate status does not guarantee that a resort is open today.

## Reproduction and verification

The complete inventory is in [official-batch-018.mjs](official-batch-018.mjs). Run `npm run data:build`, `npm run data:test`, `npm run lint` and `npm run build` to reproduce and verify the output. The generated [per-resort report](generated/official-batch-018-report.json) records the complete summary-only list. All 92 data tests, lint, production build and whitespace checks pass.

No Supabase schema, policy, authentication, storage or live-data operation is part of this block.
