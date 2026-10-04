# Global mountain-fact coverage

Run `node pipeline/fetch-mountain-facts.mjs` after building the canonical directory, then `npm run data:build`. The fetch step reads Wikidata elevation statements for exact Wikidata IDs attached to medium/high-confidence records. It caches for 30 days, fingerprints the ID list, identifies the client, and backs off on server errors. No commercial directories are used.

`mountain-coverage.json` reports actual coverage. `mountain-research-queue.json` contains one entry per public profile, missing official metrics, website availability, lookup status and conflicts. This is a research inventory, not evidence that those official sites have been visited. A profile is not complete just because an elevation was found. The queue distinguishes records without a Wikidata ID from queried records.

Wikidata P2044 is the elevation of the geographical item, not necessarily summit/base/lift-served elevation. Native units, statement IDs, qualifiers and references are retained. Multiple values, unsupported units or any qualifiers are withheld for review. These observations are labeled community-maintained, never official-source checked. Do not subtract elevations to invent vertical drop; do not turn generic land area into skiable terrain or count OSM segments as named trails.

Official-source enrichment still requires per-resort checking. The reviewed pilot remains the only set of manually source-checked official statistics. Missing fields are explicitly not yet sourced, with no invented values or confidence promotion. Official sites without permissive structured feeds require review of access terms before bulk collection; this stage does not crawl them. The source-linked, colored presentation now works for all public profiles, including partially populated records.

Sources: Wikidata structured data CC0; OSM ODbL attribution remains unchanged. Official observations retain publisher copyright notes and are not relabeled CC0. No images or descriptions are copied. Raw responses remain in the ignored cache; generated observations preserve provenance in version-reviewable outputs.
