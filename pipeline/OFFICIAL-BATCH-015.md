# Structured-source overview batch 015

Reviewed October 3, 2026. This block adds concise mountain-character overviews to 100 previously unresearched public profiles using their existing Wikidata CC0 identity and geographic records. Work was completed on `powderfiles-redesign`.

## Results

- 100 new overview summaries across medium-confidence, lift-served downhill candidates.
- Every overview links to its Wikidata source and retains the October 3 review date.
- No numerical mountain facts were added. All 100 profiles remain summary-only because an official operator source with clear measurement scope was not established during this pass.
- No verification status or confidence level was promoted.
- Cumulative coverage reaches 1,003 profiles with source-linked overviews. Official numerical-fact coverage remains 510 profiles.
- Bristol Mountain remains the sole staff-verified profile with its existing facts and August 30 review date unchanged.
- This block spans 26 country labels: France 22; Italy 11; Austria 8; Switzerland 7; Japan 6; Germany and Iran 5 each; Canada, Finland, Poland and Slovakia 4 each; United States 3; Pakistan, Spain and Turkey 2 each; and one each from Australia, Bulgaria, Chile, China, Lebanon, Mongolia, North Korea, North Macedonia, Romania, Slovenia and the United Kingdom.
- The public directory remains 1,521 medium/high-confidence profiles. Its compact JSON is 2,501,488 bytes and 282,110 bytes gzip.

## Editorial limits

- These are original Powder Files descriptions of the resort identity, geographic setting and relative character supported by the structured record. They are not visitor reviews, copied marketing descriptions or claims about current openings.
- No trail, lift, acreage, elevation, vertical or longest-run figure was inferred from a name, map shape or third-party directory.
- Regional networks, village bases and mountain sectors are described as such. Their summaries do not silently assign shared-domain totals to a local sector.
- Candidates that appeared private, Nordic-only, lift-free, indoor, permanently closed, duplicated or too ambiguous were skipped during selection.
- Current operation still needs an official-source audit for this block. Candidate status explicitly does not guarantee that a resort is open today.

## Reproduction and verification

The complete inventory is in [official-batch-015.mjs](official-batch-015.mjs). Run `npm run data:build`, `npm run data:test`, `npm run lint` and `npm run build` to reproduce and verify the output. The generated [per-resort report](generated/official-batch-015-report.json) records the complete summary-only list. All 83 data tests, lint, production build and whitespace checks pass.

No Supabase schema, policy, authentication, storage or live-data operation is part of this block.
