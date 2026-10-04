# Official-source research batch 011

Reviewed August 31, 2026. This block enriches 100 previously unresearched public profiles with original, source-linked mountain-character summaries on directory cards and field guides. All work remains local on `powderfiles-redesign`.

## Results

- 100 new summaries; 211 numerical observations across 81 profiles; 19 summary-only profiles. Numerical coverage includes named-course and other auxiliary measurements, not just core mountain dimensions.
- 102 distinct primary URLs used by this block, of which 101 are new to the directory. The Bödele operator URL was already associated with earlier research. Cumulative official-source coverage is 680 distinct URLs.
- Cumulative coverage: 603 sourced summaries; 501 profiles with official numerical observations; 136 with structured-source elevation; 109 with conflicts, including older structured-source disagreements. This batch adds no explicit alternative-value conflict objects; uncertain measurements are withheld with reasons in entry notes.
- Public inventory remains 1,521 medium/high-confidence profiles and 54 country labels. Turkey/Türkiye remains a duplicate country label. Bristol remains the sole staff-verified profile with its August 30 review date, 1,200-foot vertical, 39 trails and 138 acres unchanged.
- Canonical inventory remains 6,089 records from 7,439 cached raw records, with 366 ambiguities and 230 exclusions: 39 closed/disused, 165 Nordic-only, 25 private clubs and one indoor slope. No identity merges, new exclusions or structured-source refresh was performed.
- Canonical source coverage: 4,873 OpenStreetMap identifiers, 1,950 Wikidata identifiers, 680 official URLs and one owned Bristol source. These are identifiers, not independent resort counts.
- Application JavaScript remains 274.06 kB / 85.48 kB gzip and CSS remains 30.88 kB / 7.34 kB gzip. Directory JSON is separately loaded. No imagery added; the existing owned hero remains approximately 3.18 MB.
- Compact directory JSON: 2,332,672 bytes; 254,188 bytes gzip, an increase of 19,798 compressed bytes over batch 010. Generated metadata timestamps can slightly change compressed size.

## Countries in this block

Japan 54; Austria 10; France 9; United States 5; South Korea 4; Spain 2; Greece 2; Finland 2; Kazakhstan 2; Sweden 1; Slovenia 1; Bosnia and Herzegovina 1; Serbia 1; Bulgaria 1; Liechtenstein 1; Switzerland 1; Croatia 1; Ukraine 1; Germany 1. Total: 100 profiles across 19 country labels.

## Inventory and gaps

The complete inventory, exact identifiers, original summaries, measurements, URLs, review dates, periods and scope notes are in [official-batch-011.mjs](official-batch-011.mjs). The generated [per-resort report](generated/official-batch-011-report.json) lists missing core fields and research notes.

Summary-only profiles: Tandådalen; Niseko Village; Stara Planina; Seli; Zürs; Stuben; Ikawa Kainayama; Inosawa; Iozen; Koide; Kyowa; Mt.T / Tanigawadake Tenjindaira; Mount Holiday; Valberg; Alpine Meadows; Shymbulak; Oz Station; Dorfgastein; Grossarl. Previously sourced community-maintained elevation can still appear on these profiles.

Under the strict five-core-field definition, 1,517 public profiles still lack at least one field; only four have all five accepted fields. There remain 799 profiles without a canonical official-website field. Adding a source URL to observations or an overview does not automatically replace that canonical field or promote verification.

## Scope and uncertainty

- Shiga Kogen local sectors retain operator-published local figures. Shared gondolas mean lift counts are not additive. The full network has its own separately scoped profile. Lift rise is not substituted for published ski vertical, and multi-sector routes do not become local longest runs.
- Homewood's operator confirms a 2025–26 season and offers 2026–27 passes. Its former seven-lift inventory is withheld because Madden is being replaced by a gondola. Snowcat acreage is not added to lift-served terrain. Both the trail-map source and current operator homepage are retained.
- Iozen's municipal notice closes upper/forest courses indefinitely after flood damage and equipment problems; the Family slope operated during 2025–26. Its summary states the reduced offering. Hautacam uses its current small learning-area inventory, not historical mountain totals.
- Named-course lengths and verticals remain named-course measurements: examples include Okuibuki, Vihti, Muju, Yongpyong and Ontake. The Hochkönig Königstour is explicitly a multi-run circuit, not a continuous downhill run. Village elevation at Plagne Aime 2000 is not the lowest ski elevation of La Plagne.
- Valgrande-Pajares excludes Nordic and touring distance from alpine piste distance. Vigla excludes Nordic and snowmobile routes. Les Portes du Mont-Blanc excludes unlinked Cordon from its linked-core distance. Regional Evasion, Arlberg, Gastein, Ski amadé, Alpe d'Huez and Paradiski totals are not assigned to individual sectors or villages.
- Konjiam's published base footprint is not skiable acreage. Yongpyong's property and base areas are not slope area; its headline trail count appears alongside sledding and is withheld pending scope clarification. Okunakayama's maximum operating-lift count differs in scope from its installation list. Vihti's headline and category counts disagree. These gaps are recorded, not silently resolved.
- Snow-dependent routes at Vogel, Bödele and Mizuho remain conditional. White Valley's special-day grooming percentage is not treated as a permanent whole-area statistic. Upper mountain geography and off-piste/touring access are not assumed to be ordinary lift-served skiing.
- Explicit source periods remain visible. Owani's individual course measurement dates to 2020 despite a 2025–26 operating footer; Bukovel's figures are tied to the 2024 sustainability report. Selected 2025–26 guides carry that source period. Review dates mean a page was checked, not that figures were independently surveyed or reflect today's openings.
- Original summaries mention current branding for Hatley Pointe, Romance no Kamisama and Mt.T without silently renaming canonical identities. Candidate/unknown status is not promoted by editorial enrichment.
- Remaining identities have not been globally re-audited. During selection, possible duplicate Okutadami identities, questionable lift-service/temporary-park scope, closed/private candidates, stale sites and a repurposed Bottières website were deferred rather than used to fill the quota. The existing ambiguity/exclusion queues were not altered by this research block. A separate identity and operating-status cleanup remains worthwhile.
- Inaccessible pages were not bypassed. No commercial resort-directory inventories, copyrighted descriptions or imagery were copied. PDF search snippets were not used as measurement evidence in this batch; imported facts come from primary HTML pages.

## Reproduction and licensing

Run `npm run data:build`, `npm run data:test`, `npm run lint` and `npm run build`. Generation uses existing local structured-data caches and authored observations; it makes no Supabase requests. Set `POWDERFILES_COLLECTION_DATE` for fixed generated metadata when comparing outputs. Existing editorial review dates are retained, not advanced on each build.

Refresh by reopening each cited primary page, verifying the exact sector and operating scope, retaining native units and source periods, and withholding uncertain values. Official pages retain publisher copyright; factual observations and original summaries are not relicensed as CC0. Wikidata CC0 and OpenStreetMap ODbL attribution remain intact.

## Verification and files

All 68 data tests pass, including four new tests for batch uniqueness, exact joins, field provenance, valid qualifiers, historical periods, local/course scope, public output and Bristol preservation. Offline generation, lint, production build and Git whitespace checks pass.

Browser checks covered Homewood's desktop card and colored fact tiles, mobile thumbnail-to-guide navigation, its summary/source links and full fact inventory, the mobile menu, and Iōzen's summary-only card and guide with reduced-operation wording. Checked viewports were 1440 × 1100 and 390 × 844; neither had horizontal overflow. No component or style changes were needed. The existing search is accent-sensitive: `Iozen` does not match canonical `Iōzen`, while `Kanazawa` does. That search improvement remains outside this data-only block. Full-page screenshot stitching produced duplicate image sections; DOM inspection and viewport screenshots did not show duplicated page content.

Added this report, `official-batch-011.mjs`, `tests/official-batch-011.test.mjs` and the generated batch-011 report. Updated `build-directory.mjs`, `resort-summaries.mjs`, the cumulative summary test, batch 010's historical-minimum assertion and `README.md`. Regenerated canonical, quality, coverage, research and summary outputs plus `public/data/resorts.compact.json`.

Existing unrelated dirty files remain intact. No commit, push, deployment, main-branch modification or Supabase write. The pre-existing Node warning about disabled TLS certificate validation remains; this work did not change that environment setting.
