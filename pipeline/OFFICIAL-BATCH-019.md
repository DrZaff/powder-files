# Structured-source overview batch 019

Reviewed October 3, 2026. This smaller block adds source-linked overviews to 34 medium-confidence public candidates using Wikidata CC0 and OpenStreetMap ODbL records. Work was completed on `powderfiles-redesign`.

## Results

- 34 additional profiles now have concise mountain-character summaries and readable display names.
- Cumulative coverage reaches 1,337 of 1,521 public profiles. Official numerical-fact coverage remains 510 profiles.
- No numerical facts, verification promotions or confidence upgrades were added.
- Bristol Mountain remains the sole staff-verified profile with its existing facts unchanged.
- This block spans 17 country labels, led by France 8, Sweden 4 and Spain 3.
- The compact public directory is 2,608,103 bytes and 302,968 bytes gzip.
- 184 public profiles remain without an overview, including 68 identifier-only records.

## Why this batch is smaller

The remaining source pool is dominated by records that are explicitly closed, indoor, Nordic-only, lift-free, private, duplicated or too ambiguous to classify safely. Those entries were not used merely to reach an arbitrary batch size. Further expansion should begin with an exclusion-cleanup pass and targeted official-source verification.

## Editorial limits

- Summaries are original Powder Files descriptions, not copied marketing text, visitor reviews or live operating reports.
- No trail, lift, acreage, elevation, vertical or longest-run figure was inferred from a label or coordinate.
- Current operation still needs official-source review. Candidate status does not guarantee that a resort is open today.

## Reproduction and verification

The complete inventory is in [official-batch-019.mjs](official-batch-019.mjs). Run `npm run data:build`, `npm run data:test`, `npm run lint` and `npm run build` to reproduce and verify the output. The generated [per-resort report](generated/official-batch-019-report.json) records the complete summary-only list. All 95 data tests, lint, production build and whitespace checks pass.

No Supabase schema, policy, authentication, storage or live-data operation is part of this block.
