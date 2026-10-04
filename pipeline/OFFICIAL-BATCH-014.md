# Structured-source overview batch 014

Reviewed October 3, 2026. This block adds concise mountain-character overviews to 100 previously unresearched public profiles using their existing Wikidata CC0 identity and geographic records. Work was completed on `powderfiles-redesign`.

## Results

- 100 new overview summaries across medium-confidence, lift-served downhill candidates.
- Every overview links to its Wikidata source and retains the October 3 review date.
- No numerical mountain facts were added. All 100 profiles remain summary-only because an official operator source with clear measurement scope was not established during this pass.
- No verification status or confidence level was promoted.
- Cumulative coverage reaches 903 profiles with source-linked overviews. Official numerical-fact coverage remains 510 profiles.
- Bristol Mountain remains the sole staff-verified profile with its existing facts and August 30 review date unchanged.
- This block spans 27 country labels: France 16; Japan 15; United States 10; Austria 9; Switzerland 8; Italy 6; Spain 5; Chile and Ukraine 3 each; Finland, Germany, Lebanon, Russia, South Korea, Sweden and Turkey 2 each; and one each from Australia, Bulgaria, Canada, China, Iran, Morocco, Norway, Poland, Romania, Slovenia and Uzbekistan.
- The public directory remains 1,521 medium/high-confidence profiles. Its compact JSON is 2,469,071 bytes and 276,157 bytes gzip.

## Editorial limits

- These are original Powder Files descriptions of the resort identity, geographic setting and relative character supported by the structured record. They are not visitor reviews, copied marketing descriptions or claims about current openings.
- No trail, lift, acreage, elevation, vertical or longest-run figure was inferred from a name, map shape or third-party directory.
- Regional networks and village sectors are described as such. Their summaries do not silently assign shared-domain totals to a local sector.
- Candidates that appeared private, Nordic-only, lift-free, indoor, permanently closed or duplicated were skipped during selection.
- Current operation still needs an official-source audit for this block. Candidate status explicitly does not guarantee that a resort is open today.

## Reproduction and verification

The complete inventory is in [official-batch-014.mjs](official-batch-014.mjs). Run `npm run data:build`, `npm run data:test`, `npm run lint` and `npm run build` to reproduce and verify the output. The generated [per-resort report](generated/official-batch-014-report.json) records the complete summary-only list. All 80 data tests, lint, production build and whitespace checks pass.

No Supabase schema, policy, authentication, storage or live-data operation is part of this block.
