# Powder Files global resort-data pipeline

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
- `pipeline/generated/summary.json`: country and source counts.
- `pipeline/generated/quality-report.json` and `QUALITY_REPORT.md`: coverage and limitations.
- `public/data/resorts.compact.json`: compact, read-only browser dataset loaded separately from the main JavaScript bundle.

## Important limitations

Wikidata and OpenStreetMap are community-maintained and incomplete. A `candidate` label does not prove current operation, public access, or lift service. OSM tagging practices vary by region. No reverse-geocoding service is used, so missing country/locality fields remain incomplete. Human verification is required before a record becomes `verified`.
# Resort character summaries

Every researched batch now includes original, source-linked mountain-character copy on directory cards and field guides. See [batch 003 and the summary policy](OFFICIAL-BATCH-003.md). Missing numerical data remains missing even when a narrative summary is available.
# Latest official research batch

See [batch 014](OFFICIAL-BATCH-014.md) for the latest 100 structured-source mountain-character summaries. Cumulative coverage is 903 summaries. This conservative block adds no numerical facts or verification upgrades. All summaries appear in both directory cards and field guides. [Batch 013](OFFICIAL-BATCH-013.md) retains the preceding official-source research report.

Research batches are now 100 previously unresearched public profiles by default, checked in smaller groups. This is a research/profile quota, not a guarantee of complete numerical dimensions: summary-only profiles and unresolved source conflicts are reported explicitly. Each summary retains its actual review date; regenerating the directory does not redate older research.
