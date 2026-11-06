# Official enrichment batch 028

Group 1 reviewed 2026-11-06. This group adds current, first-party mountain facts for Heavenly, Hakuba Happo-one, Taos Ski Valley, Sugarloaf and Mt. Hood Meadows.

Before enrichment, repeated structured-source rows are collapsed by stable ID so one Wikidata item cannot become ambiguous with itself. All coordinate alternatives remain in provenance, while reviewed coordinates are selected for seven affected identities. The audit also resolves the 14 stable IDs that previously appeared more than once in the canonical output.

Taos combines its Wikidata identity with the OpenStreetMap resort relation and uses the current `skitaos.com` operator domain. Mt. Hood Meadows retains its OpenStreetMap identity. Sugarloaf remains separate from the Nordic Sugarloaf Outdoor Center, which is excluded from downhill results. The Monts du Pilat Nordic domain is likewise excluded; current first-party evidence confirms Artouste, Monts Jura, Kendall Mountain and Axalp as public downhill areas.

Scope is intentionally conservative. Heavenly's highest elevation and the Taos and Sugarloaf summits are not represented as highest lift-served points. Happo-one and Mt. Hood Meadows have explicit lift-served top elevations. No vertical is calculated for Heavenly, Happo-one or Mt. Hood Meadows, and Hood Meadows' hike-to vertical is stored separately from lift-served terrain. Four same-source discrepancies remain attached to the selected facts rather than being silently discarded.

Seasonal operating evidence is retained in field provenance, but this group does not change the site's displayed operating-status field. No publisher prose or imagery is copied.

## Group 2

Group 2 adds Mont-Sainte-Anne, Schweitzer, Thredbo, Falls Creek and Mt Buller. Each Wikidata identity is merged with its reviewed OpenStreetMap ski-area polygon, retaining the Wikidata ID and the OSM coordinate. Mt Buller's repeated Wikidata coordinate statements are collapsed before ambiguity matching, following the same source-row rule used for Heavenly.

The enrichment preserves native units and does not calculate missing verticals or elevations. Thredbo's explicit 2,037 m highest lifted point remains separate from its low-confidence 1,365–1,930 m mountain range. Schweitzer's 6,400 ft top elevation is not promoted to a lift-served top. Mont-Sainte-Anne displays 137.5 ha of snowmaking and withholds the inconsistent 80% claim; its 868 ha total property acreage is not treated as skiable terrain. Falls Creek facts retain public-authority provenance, and Mt Buller's lift count explicitly includes carpets.

Current-season evidence remains provenance-only. Mont-Sainte-Anne is recorded as uncertain because no dated 2026–27 evidence was found, while the other four have seasonal evidence. Their displayed operating-status fields remain unchanged. Follow-up research is still needed for Thredbo's numeric statistics, Australian elevation and vertical figures, and current Mont-Sainte-Anne ownership and season confirmation.

## Group 3

Group 3 publishes Treble Cone, Portillo and Valle Nevado after reviewed Wikidata/OpenStreetMap identity merges. Treble Cone remains separate from Cardrona and nearby hill or summit identities. Portillo uses the mapped ski-area coordinate rather than a Wikidata point several kilometres east. Valle Nevado retains the operator-published coordinate, while La Parva and El Colorado remain independent profiles.

Elevation semantics remain conservative. Treble Cone's 1,960 m figure is stored only as an explicit highest lifted point, never as vertical. Portillo's 3,310 m highest point is a summit, while its 2,800 m hotel altitude uses `base_area_elevation` rather than lift base. Valle Nevado's historical 9,924 ft development elevation uses `development_elevation` with low confidence and cannot populate base, top or summit. No vertical is calculated, no heli-ski terrain is included, and no multi-mountain or linked-area totals are attached.

Coronet Peak's two OpenStreetMap records are resolved under the ski-area way, and The Remarkables retains its mapped identity, but both remain low-confidence, uncertain and non-public. They have no overview or mountain facts until current first-party NZSki pages can be reviewed without the bot challenge.
