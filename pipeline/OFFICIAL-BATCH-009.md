# Official-source research batch 009

Reviewed August 31, 2026. The requested larger batch covers 100 previously unresearched public-directory identities. All 100 have original source-linked mountain-character summaries on cards and field guides. Changes remain local on `powderfiles-redesign`.

## Results

- 100 new summaries; 217 supported numerical observations across 76 profiles. Auxiliary measurements and sector facts are not a claim of complete core mountain data.
- 24 summary-only profiles; 11 withheld conflict fields across ten profiles. Summary-only means no newly supported numerical observation, although a profile may have a withheld conflict or earlier community-maintained elevation.
- 106 distinct official/primary source URLs. Exact Wikidata identity joins only; no fuzzy matching in this enrichment batch.
- Batch countries: France 50, Austria 27, Spain 8, Switzerland 7, Finland 6, Italy 2.
- Cumulative: 403 summaries; 340 profiles with official numerical observations; 465 distinct official URLs; 136 profiles with structured elevation; 107 profiles with conflicts, including earlier structured-source conflicts.
- Public inventory unchanged: 1,521 medium/high-confidence profiles, 54 country labels, one staff-verified profile. Turkey/Türkiye is still a duplicated country label. Bristol Mountain retains its earlier review date, 1,200-foot vertical, 39 trails and featured/verified status.
- Canonical inventory unchanged: 6,089 records from 7,439 cached raw records. 230 exclusions: 39 closed/disused, 165 Nordic-only, 25 private clubs, one indoor slope. 366 ambiguity entries. No identity merges, new exclusions or structured-source refresh in this batch.
- Canonical source coverage: 4,873 OSM source identifiers, 1,950 Wikidata identifiers, 465 official URLs and one owned Bristol source. These are retained identifiers, not independent resort totals.
- Compact JSON: 2,050,661 bytes, 214,671 bytes gzip; an increase of 22,139 gzip bytes. It loads separately from the application JavaScript. JS remains 274.06 kB / 85.48 kB gzip; CSS remains 30.88 kB / 7.34 kB gzip. No images added.

## Resort inventory and gaps

The full 100-name inventory, exact stable IDs, original summaries, sources, review dates, values and field-level scope notes are in [official-batch-009.mjs](official-batch-009.mjs). The generated [per-resort report](generated/official-batch-009-report.json) lists every profile's missing core fields and conflicting alternatives.

Summary-only profiles: Bergeralm; Planneralm; Kühtai; Flaine; Combloux; Notre-Dame-de-Bellecombe; Formigal; Levi; La Mongie; Forsteralm; Obertauern; Schnepfenried; Camurac; Semnoz; Les Carroz; Les Menuires; Eggberge; Val d’Isère; Peisey-Vallandry; Les Rousses; La Joue du Loup; Crest-Voland Cohennoz; Chaillol; Sedrun.

Explicit withheld conflicts: St. Jakob upper skiing elevation; Vall de Núria piste length; Les Angles pistes and piste length; Les Karellis lifts; Alta Badia lifts; Semnoz pistes; Le Mont-Dore pistes; Ballon d’Alsace pistes; Valfréjus pistes; Gourette area. Competing sources and values remain in the provenance record; the UI displays “Needs review” rather than a selected number.

## Scope and limitations

- Resort networks are not local resort totals. This especially affects Grand Massif, Three Valleys, Paradiski, Alpe d’Huez, Espace Diamant, Four Valleys, Dévoluy and Andermatt–Sedrun–Disentis. Summary-only coverage is preferable to assigning an entire network's statistics to each village.
- Verbier's 1,500–2,700 m range is explicitly its main sector, not the Four Valleys or Mont Fort. Kitzsteinhorn's upper piste elevation is labeled as the glacier sector, not the entire Kaprun area's elevation range. Golm's named descent vertical and Jakobshorn's Davos Vertical are not surveyed whole-resort verticals.
- Piste kilometres are length, not skiable area. Broader domain hectares at Les Karellis and Valdesquí retain their scope rather than being presented as groomed-piste acreage. Lachtal's distance includes routes; Valdezcaray's piste count includes itineraries.
- Sportgastein's Kreuzkogel summit and Chaillol's Vieux Chaillol summit are not lift-served skiing high points. No vertical is silently calculated from rounded or differently scoped endpoints.
- Nordic trails, walking routes, snowcat access, sledding and tubing are excluded from downhill dimensions. Saariselkä's sledding-inclusive headline counts and Mont Serein's repeated/learning-space piste inventory are not imported as distinct alpine trail totals.
- Counts calculated from difficulty categories are explicitly identified as calculations in conflict notes, not described as independent operator headlines. Where two figures may reflect different sector definitions rather than a genuine contradiction, scope notes are kept and the uncertain metric is omitted.
- Numerical fields still need official research on 1,518 public profiles under the strict five-core-field completeness definition. Only three currently have all five accepted core fields. A sourced summary, piste length or learning-area measurement does not make a profile complete or staff verified.
- Official pages sometimes contain stale seasons or inconsistent live widgets. Review dates mean the source was checked, not that every fact was independently surveyed or the resort is operating today. Summer closure counters are not permanent-closure evidence.
- Public API caches were not refreshed. Existing candidate eligibility, unresolved duplicates and incomplete geography were not re-audited globally. Bödele's potential duplicate was not separately enriched; Superdévoluy was not given duplicate Dévoluy figures in this batch.
- Failed-access pages were not bypassed. The former chaillol.fr site contained unrelated gambling-affiliate material and was rejected; official regional tourism evidence was used instead. The canonical Chaillol website remains its existing municipal URL. No commercial resort-directory facts or imagery were copied.

## Reproduction, attribution and refresh

Run `npm run data:build`, `npm run data:test`, `npm run lint` and `npm run build`. Generation reads cached structured data and the authored observations; it makes no Supabase requests. For byte-for-byte comparisons across runs, set `POWDERFILES_COLLECTION_DATE` to a fixed timestamp for both builds because generated metadata otherwise uses the current time. Source collection and editorial review dates are retained independently.

For research refreshes, reopen each linked primary source, verify resort/sector identity, preserve units and source periods, and record unresolved alternatives rather than averaging or guessing. Missing values remain missing. Never update earlier review dates merely because generation ran again.

Official pages remain copyrighted. Only limited factual observations and original editorial summaries are retained; no descriptions or images were copied. Official observations are not relicensed as CC0. Wikidata CC0 and OpenStreetMap ODbL attribution remains intact. Italian Cimone evidence comes from the national winter-sports federation; other observations use operators or official tourism/owner sources.

## Verification and changed files

All 60 data tests pass, including four new batch tests for distinct identities, source retention, strict joins, missing values, conflicts, sector scope, public output and Bristol preservation. Lint and production build pass. Directory regeneration succeeds from existing caches. Git whitespace checks pass.

Desktop and 390 × 844 mobile preview checks cover Serre Chevalier's card and field guide, Les Angles' withheld figures and alternative source links, mobile navigation and filters. Source targets and summary text were inspected in rendered page state. No horizontal overflow was found on inspected pages; no React or style changes were required for this batch.

Added:

- `official-batch-009.mjs`
- `tests/official-batch-009.test.mjs`
- This report
- `generated/official-batch-009-report.json`

Updated:

- `build-directory.mjs` and `resort-summaries.mjs` to integrate batch 009
- Cumulative summary test and batch 008's historical minimum assertion
- `README.md` to document the 100-profile default
- Generated canonical, coverage, quality, summary and research reports, plus `public/data/resorts.compact.json`

Earlier dirty files are preserved. No commit, push, deployment, main-branch mutation or Supabase write. Preview remains at `http://127.0.0.1:5173/resorts`. The pre-existing Node warning about disabled TLS certificate validation remains; no environment security setting was changed by this work.
