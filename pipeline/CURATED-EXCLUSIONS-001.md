# Curated exclusion cleanup 001

Reviewed October 3, 2026. This pass removes clearly out-of-scope structured-source records from normal public resort results while retaining their identities, source records, exclusion reasons and evidence links in the reviewable pipeline output.

## Results

- 112 records were removed from the public directory: 60 closed or disused areas, 27 Nordic-only centers, 9 private clubs, 2 indoor slopes and 14 lift-free or non-resort features.
- The public directory now contains 1,409 medium- or high-confidence profiles across 62 represented country labels.
- All 1,337 researched mountain-character summaries remain available. The 72 remaining profiles without an overview have readable names; no identifier-only labels remain in normal results.
- Bristol Mountain remains the sole staff-verified profile and its facts are unchanged.
- The compact browser dataset is 2,525,007 bytes and 294,013 bytes gzip.

## Method

Each exclusion is keyed to an exact canonical stable ID. The cleanup runs only after source normalization, deduplication and official research joins, then moves the matching record into the exclusions output. It does not use fuzzy removal rules.

Every curated rule records:

- an approved exclusion category;
- a concise reason;
- the source identity URL used during review; and
- the review date.

The moved exclusion also retains the canonical record's source records, so Wikidata and OpenStreetMap attribution is not lost. The generated `curated-exclusions-report.json` provides the reproducible count by reason.

## Conservative boundary

Only clearly out-of-scope entries were removed. Records with unclear current operation, access or lift service remain candidates for later official-source review rather than being guessed into an exclusion category. A curated exclusion can be reversed by removing its exact rule and rebuilding if stronger evidence changes the classification.

## Reproduction and verification

Run `npm run data:build`, then `npm run data:test`. The exclusion tests require unique stable IDs, approved reasons, evidence URLs, retained source provenance, the expected 1,409-record public inventory, all 1,337 researched summaries and the Bristol Mountain seed.

No Supabase schema, policy, authentication, storage or live-data operation is part of this cleanup.
