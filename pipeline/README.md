# Powder Files global resort-data pipeline

Latest manual enrichment: [official batch 023](./OFFICIAL-BATCH-023.md), adding local Flaine facts and preserving Bottineau's official lift-count conflict.

This local pipeline builds a reviewable worldwide directory of active or potentially active, publicly accessible, lift-served downhill ski and snowboard areas. It is intentionally conservative: incomplete records remain candidates, and plausible duplicates enter an ambiguity queue rather than being merged without strong evidence.

## Sources and licensing

- **Wikidata:** structured records from the Wikidata Query Service. Wikidata structured data is available under CC0 1.0. Stable Q identifiers and item URLs are retained.
- **OpenStreetMap:** structured features obtained through the Overpass API. OpenStreetMap data is © OpenStreetMap contributors and available under ODbL 1.0. Element type/ID, source URL, collection time, and field provenance are retained.
- **Powder Files:** the existing Bristol Mountain profile is retained as the single locally verified seed record.

The pipeline does not scrape commercial resort directories and does not download resort descriptions or images.

Official mountain measurements are maintained separately as source-linked factual observations. See [batch 001 methodology and refresh instructions](OFFICIAL-BATCH-001.md). Building the directory also writes its per-resort coverage and conflict report.

[Batch 002](OFFICIAL-BATCH-002.md) extends coverage to 25 more profiles and adds visible source-period labels for historical or season-specific measurements. Each batch has a separate generated report.

## Refresh

Use Node.js 22 or later.

1. `npm run data:fetch` downloads source responses into the ignored `pipeline/cache` directory. Responses younger than 30 days are reused to respect public endpoints.
2. `npm run data:build` normalizes, classifies, deduplicates, and writes all generated outputs.
3. `npm run data:test` runs normalization, classification, deduplication, and provenance tests.

The source clients send a descriptive Powder Files user agent, use one request per endpoint, pause between providers, and apply bounded exponential retry/backoff. To force a complete refresh, remove only the individual cached source response after confirming the endpoint is healthy.

## Outputs

- `pipeline/generated/canonical-resorts.json`: complete canonical candidate records and field provenance.
- `pipeline/generated/ambiguities.json`: possible matches requiring human review.
- `pipeline/generated/exclusions.json`: excluded records and reasons.
- `pipeline/generated/curated-exclusions-report.json`: exact-record cleanup counts by exclusion reason.
- `pipeline/generated/summary.json`: country and source counts.
- `pipeline/generated/quality-report.json` and `QUALITY_REPORT.md`: coverage and limitations.
- `pipeline/generated/profile-coverage-audit.json` and `PROFILE_COVERAGE_AUDIT.md`: field-by-field coverage, conflicts, staleness and research priority for every public profile.
- `pipeline/generated/enrichment-priority-queue.json`: actionable resort research order with source recommendations.
- `public/data/resorts.compact.json`: compact, read-only browser dataset loaded separately from the main JavaScript bundle.

## Important limitations

Wikidata and OpenStreetMap are community-maintained and incomplete. A `candidate` label does not prove current operation, public access, or lift service. OSM tagging practices vary by region. No reverse-geocoding service is used, so missing country/locality fields remain incomplete. Human verification is required before a record becomes `verified`.
# Resort character summaries

Every researched batch now includes original, source-linked mountain-character copy on directory cards and field guides. See [batch 003 and the summary policy](OFFICIAL-BATCH-003.md). Missing numerical data remains missing even when a narrative summary is available.
# Latest official research batch

See [batch 019](OFFICIAL-BATCH-019.md) for the latest 34 structured-source mountain-character summaries and readable label repairs. Cumulative coverage is 1,337 summaries. This smaller conservative block reflects exhaustion of clearly eligible records in the remaining candidate pool and adds no numerical facts or verification upgrades. [Batch 018](OFFICIAL-BATCH-018.md) retains the preceding 100-profile report, while [batch 013](OFFICIAL-BATCH-013.md) retains the latest official-source research report.

Research batches are now 100 previously unresearched public profiles by default, checked in smaller groups. This is a research/profile quota, not a guarantee of complete numerical dimensions: summary-only profiles and unresolved source conflicts are reported explicitly. Each summary retains its actual review date; regenerating the directory does not redate older research.

# Latest directory cleanup

See [curated exclusion cleanup 001](CURATED-EXCLUSIONS-001.md). It removes 112 clearly closed, Nordic-only, private, indoor, lift-free or non-resort records from normal results using exact stable IDs, while retaining their source provenance and exclusion reasons.

# Latest identity and enrichment pass

See [identity cleanup and enrichment batch 020](IDENTITY-AND-ENRICHMENT-020.md) for the general identity policy. [Official batch 024](OFFICIAL-BATCH-024.md) resolves the split Vail and Breckenridge source identities and adds their official mountain facts. The current public directory contains 1,402 unique profiles, with 527 profiles carrying at least one official fact.
