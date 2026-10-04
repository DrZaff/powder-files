# Official-source research batch 010

Reviewed August 31, 2026. This block covers 100 previously unresearched public-directory identities. Each receives an original, source-linked mountain-character summary on its card and field guide. Work remains local on `powderfiles-redesign`.

## Results

- 100 new summaries; 185 supported numerical observations across 80 profiles; 20 summary-only profiles. Numerical coverage includes auxiliary course measurements and does not mean complete mountain specifications.
- 114 distinct new official/primary source URLs. Two explicit withheld course-count conflicts, at Aomori Spring and Asarigawa Onsen. Other scope/date disagreements are documented in entry notes and those measurements omitted.
- Countries in this block: Japan 80; Spain 4; Slovenia 3; Greece 3; Azerbaijan 2; Canada 2; Italy 2; Uzbekistan 1; Czechia 1; Poland 1; Switzerland 1.
- Cumulative: 503 sourced summaries, 420 profiles with official numerical observations, 579 distinct official URLs, 136 profiles with structured elevation, and 109 profiles with conflicts including earlier structured-source conflicts.
- Public inventory unchanged: 1,521 medium/high-confidence profiles and 54 country labels. Turkey/Türkiye remains a duplicate label. Bristol remains the sole staff-verified profile, with its August 30 review date, 1,200-foot vertical, 39 trails and 138 acres unchanged.
- Canonical inventory unchanged: 6,089 records from 7,439 cached raw records; 366 ambiguities; 230 exclusions (39 closed/disused, 165 Nordic-only, 25 private clubs, one indoor slope). No identity merges, new exclusions or structured-source refresh in this block.
- Retained canonical source coverage: 4,873 OpenStreetMap identifiers, 1,950 Wikidata identifiers, 579 official URLs, one owned Bristol source. Source identifiers are not independent resort counts.
- Compact directory JSON: 2,186,980 bytes; 234,390 bytes gzip (19,719 compressed bytes larger than batch 009). Loaded separately from application JavaScript. JS unchanged at 274.06 kB / 85.48 kB gzip; CSS unchanged at 30.88 kB / 7.34 kB gzip. No imagery added.

## Inventory and gaps

The complete 100-profile inventory, stable IDs, summaries, URLs, dates, values and scope notes live in [official-batch-010.mjs](official-batch-010.mjs). The generated [per-resort report](generated/official-batch-010-report.json) records missing core fields and conflicting alternatives.

Summary-only profiles: Charmant Hiuchi; Daisetsuzan Kurodake; Fujiten; Hachi Kogen; Parnassos; Jigatake; Hodaigi; Manza Onsen; Kiroro; Kuma Skiland; NASPA Ski Garden; Niseko Moiwa; Okutone; Sahoro; Komagane Kogen; Ski Valley; Yuzawa Kogen; Hoch-Ybrig; Sapporo Bankei; Okutadami Maruyama. Earlier community-maintained elevations may still be present on these profiles.

## Interpretation and limitations

- Named-course distances and verticals retain explicit labels. Kawaba's 3,300 m is a linked Sakuragawa–Crystal route, Biwako's 224 m is Champion-course vertical, and Kurumayama's 2,000 m includes the Family course. These are not silently promoted to whole-resort statistics.
- Piste length, area, course count and lift count are separate measurements. Klínovec's lift categories remain separate. Sapporo Kokusai's lift count explicitly includes a snow escalator. Petit Chamonix's trail count includes two snowparks. Course inventories can count connecting runs or upper/lower sections differently.
- Local statistics exclude shared-pass networks: examples include Klínovec/Fichtelberg, Szczyrk's combined pass, Skiworld Ahrntal, Yuzawa Snow Link, Madarao/Tangram, Hachi/Hachikita, Shiga Kogen and Naeba/Kagura. Speikboden uses its dedicated page rather than older combined-area widgets.
- Geographic summits, hiking, CAT skiing, Nordic routes, tubing, snow play and sledding are not treated as lift-served skiing measurements. Kagura's published endpoint range is retained as published and is not a claim of one continuous descent. Manza's reduced operations/hike-up ambiguity prevents importing historical endpoints.
- Source dates and periods matter. Gala's numerical source period is 2024–25; several other guides describe 2025–26. A review date means a page was checked, not that its figures were independently surveyed or describe today's operations. Summer closure counters are not evidence of permanent closure.
- Aomori's English/Japanese course totals disagree. Asarigawa's headline conflicts with the calculated sum of difficulty categories; the second alternative is labeled as a calculation. Competing values and URLs are preserved, and the UI says “Needs review.” Other unresolved inventory/date differences remain in entry notes instead of guessed values.
- Charmant's main-quad outage, Manza's reduced operations and Okutadami's midwinter access closure are described cautiously. Ski Jam's current JAM Fukui Katsuyama branding appears in the summary without silently changing its canonical identity.
- Under the strict five-core-field definition, 1,517 public profiles still lack at least one field; only four currently have all five accepted fields. There are still 799 profiles without a canonical official-website field. Source-linked observations do not automatically replace that field or promote candidate status.
- This block is Japan-heavy because many previously unresearched operator guides were available there. It is not a geographically representative sample. Remaining candidates, duplicate identities, operational status and missing geography were not globally re-audited.
- Failed-access pages were not bypassed. No commercial resort-directory descriptions, numerical inventories or imagery were copied. Summaries are original editorial writing based on limited factual observations from operators or official tourism sources.

## Reproduction, attribution and refresh

Run `npm run data:build`, `npm run data:test`, `npm run lint` and `npm run build`. The build uses existing structured-data caches and the authored observations, with no Supabase requests. Set `POWDERFILES_COLLECTION_DATE` to a fixed timestamp for byte-for-byte generated-metadata comparisons. Existing source collection dates and older editorial review dates are not advanced by generation.

For refreshes, reopen each linked primary page, verify the exact resort or sector, preserve native units and periods, and record uncertainty rather than averaging or guessing. Official pages retain publisher copyright; factual observations and original summaries are not relicensed as CC0. Wikidata CC0 and OpenStreetMap ODbL attribution remains intact.

## Verification and changed files

All 64 data tests pass, including four new tests for unique identities, provenance, strict joins, missingness, source periods, course/network scope, public output and Bristol preservation. Offline directory generation, lint, production build and Git whitespace checks pass.

Browser checks cover Sapporo Teine's desktop card and field guide, its 390 × 844 mobile profile, and Aomori's mobile thumbnail-to-guide navigation, withheld course total and alternative source URLs. Mobile menu opens correctly. Inspected pages have no horizontal overflow; existing React components and styles needed no changes for this block.

Added `official-batch-010.mjs`, `tests/official-batch-010.test.mjs`, this report and the generated batch-010 report. Updated `build-directory.mjs`, `resort-summaries.mjs`, the cumulative summary test, batch 009's historical minimum assertion, and `README.md`. Regenerated canonical, summary, quality, coverage and research reports plus `public/data/resorts.compact.json`.

Existing unrelated dirty files remain intact. No commit, push, deployment, main-branch modification or Supabase write. Local preview remains at `http://127.0.0.1:5173/resorts`. The pre-existing Node environment warning about disabled TLS certificate validation remains; this work did not change that setting.
