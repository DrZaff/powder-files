# Trail maps

Community trail maps for resort pages, built from OpenStreetMap ski data via OpenSkiMap's daily export.

## Refresh the data

```sh
mkdir -p /tmp/openskimap && cd /tmp/openskimap
for f in ski_areas runs lifts; do curl -sS --compressed -o $f.geojson https://tiles.openskimap.org/geojson/$f.geojson; done
cd -  # back to the repository
node --max-old-space-size=8000 tools/trail-maps/build-trail-maps.mjs --osm /tmp/openskimap --date YYYY-MM-DD
npm run trails:test
```

The runs export is about 850 MB; the build streams it and takes under a minute.

## Matching

Each resort is matched to one OSM ski area with downhill runs: by Wikidata ID first, then by a shared name word
within 4 km, then by distance alone within 1.5 km. The method is stored per resort and shown on the page when it
is "distance". Ski areas with more than 250 runs are cropped to 7 km around the resort point, and the page says so.

## Licences

- Runs and lifts: © OpenStreetMap contributors, ODbL 1.0. `public/data/trails/` is a derived database and is
  available under the same licence (see `public/data/trails/LICENSE.md`).
- Terrain at view time: Mapzen Terrain Tiles on AWS Open Data; attribution list:
  https://github.com/tilezen/joerd/blob/master/docs/attribution.md
- No resort trail-map artwork is copied or traced.
