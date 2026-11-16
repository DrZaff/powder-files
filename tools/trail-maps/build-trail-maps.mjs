#!/usr/bin/env node
// Build Powder Files trail maps from OpenStreetMap ski data (via OpenSkiMap's daily GeoJSON export).
//
//   1. Download https://tiles.openskimap.org/geojson/{ski_areas,runs,lifts}.geojson into one folder.
//   2. node tools/trail-maps/build-trail-maps.mjs --osm <folder> [--date 2026-11-16]
//
// Writes, for every resort matched to an OSM ski area that has downhill runs:
//   public/data/trails/<key>.json   compact runs + lifts ("pf-trails/1"), drawn in 3D by src/trails/
//   public/data/trails/<key>.svg    a small plan-view trail map for cards (no basemap, no official artwork)
//   public/data/trails/index.json   { resortId: { key, runs, lifts, km, coverage, match } }
// Data is © OpenStreetMap contributors, ODbL 1.0. These files are a derived database and stay under ODbL.
import { createReadStream, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { createInterface } from 'node:readline'
import { join } from 'node:path'

const args = Object.fromEntries(process.argv.slice(2).reduce((pairs, value, index, all) => (value.startsWith('--') ? [...pairs, [value.slice(2), all[index + 1]]] : pairs), []))
if (!args.osm) { console.error('Usage: build-trail-maps.mjs --osm <folder with OpenSkiMap geojson> [--date YYYY-MM-DD]'); process.exit(1) }
const ROOT = new URL('../../', import.meta.url).pathname
const OUT = join(ROOT, 'public/data/trails')
const DATA_DATE = args.date || new Date().toISOString().slice(0, 10)
const MATCH_RADIUS_M = 4000, DISTANCE_ONLY_M = 1500, CROP_RADIUS_M = 7000, CROP_IF_RUNS_OVER = 250
const SIMPLIFY_M = 4, THUMB_SIMPLIFY_M = 18

// ---------- geometry helpers ----------
const R = 6371000, rad = Math.PI / 180
const dist = ([la1, lo1], [la2, lo2]) => R * Math.hypot((lo2 - lo1) * rad * Math.cos((la1 + la2) / 2 * rad), (la2 - la1) * rad)
function simplify(points, toleranceM, lat0) {
  // Douglas–Peucker on an equirectangular projection (metres).
  const kx = R * rad * Math.cos(lat0 * rad), ky = R * rad
  const xy = points.map(([lon, lat]) => [lon * kx, lat * ky])
  const keep = new Uint8Array(points.length); keep[0] = keep[points.length - 1] = 1
  const stack = [[0, points.length - 1]]
  while (stack.length) {
    const [a, b] = stack.pop(); let maxD = 0, index = -1
    const [ax, ay] = xy[a], [bx, by] = xy[b], dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy) || 1
    for (let i = a + 1; i < b; i++) { const d = Math.abs(dy * xy[i][0] - dx * xy[i][1] + bx * ay - by * ax) / len; if (d > maxD) { maxD = d; index = i } }
    if (maxD > toleranceM) { keep[index] = 1; stack.push([a, index], [index, b]) }
  }
  return points.filter((_, i) => keep[i])
}
const lineLengthM = points => points.slice(1).reduce((sum, p, i) => sum + dist([points[i][1], points[i][0]], [p[1], p[0]]), 0)

// ---------- matching resorts to OSM ski areas ----------
const norm = s => (s || '').normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
const STOP = new Set(['ski', 'resort', 'area', 'mountain', 'station', 'skigebiet', 'the'])
const tokens = s => new Set(norm(s).split(' ').filter(t => t.length > 2 && !STOP.has(t)))
const downhillStats = props => {
  const byDifficulty = props.statistics?.runs?.byActivity?.downhill?.byDifficulty || {}
  const runs = Object.values(byDifficulty).reduce((n, v) => n + (v.count || 0), 0)
  const lifts = Object.values(props.statistics?.lifts?.byType || {}).reduce((n, v) => n + (v.count || 0), 0)
  return { runs, lifts }
}
const areaCenter = feature => feature.geometry.type === 'Point' ? [feature.geometry.coordinates[1], feature.geometry.coordinates[0]] : feature.properties.viewportHint?.center ? [feature.properties.viewportHint.center[1], feature.properties.viewportHint.center[0]] : null

const resorts = JSON.parse(readFileSync(join(ROOT, 'public/data/resorts.compact.json'), 'utf8')).records
const areas = JSON.parse(readFileSync(join(args.osm, 'ski_areas.geojson'), 'utf8')).features
  .filter(a => (a.properties.activities || []).includes('downhill') && a.properties.status !== 'abandoned')
const byWikidata = new Map()
for (const area of areas) if (area.properties.wikidataID) byWikidata.set(area.properties.wikidataID, [...(byWikidata.get(area.properties.wikidataID) || []), area])

const matches = new Map() // resortId -> { area, method }
for (const resort of resorts) {
  const qid = resort.id.startsWith('wikidata:item:') ? resort.id.split(':').pop() : null
  let candidates = qid && byWikidata.get(qid), method = 'wikidata'
  if (!candidates) {
    const near = areas.map(area => { const c = areaCenter(area); return c && Math.abs(c[0] - resort.p[0]) < .1 && Math.abs(c[1] - resort.p[1]) < .15 ? [dist(resort.p, c), area] : null })
      .filter(x => x && x[0] < MATCH_RADIUS_M).sort((a, b) => a[0] - b[0])
    const named = near.filter(([, area]) => [...tokens(resort.n)].some(t => tokens(area.properties.name).has(t)))
    const pick = named[0] || (near[0] && near[0][0] < DISTANCE_ONLY_M ? near[0] : null)
    if (pick) { candidates = [pick[1]]; method = named.length ? 'name+distance' : 'distance' }
  }
  if (!candidates) continue
  const area = candidates.reduce((best, a) => (downhillStats(a.properties).runs > downhillStats(best.properties).runs ? a : best))
  if (downhillStats(area.properties).runs > 0) matches.set(resort.id, { area, method, resort })
}
const resortsByArea = new Map()
for (const [id, m] of matches) resortsByArea.set(m.area.properties.id, [...(resortsByArea.get(m.area.properties.id) || []), id])
console.log(`Matched ${matches.size} of ${resorts.length} resorts to OSM ski areas with downhill runs`)

// ---------- stream runs and lifts ----------
async function* features(path) {
  const lines = createInterface({ input: createReadStream(path), crlfDelay: Infinity })
  for await (const raw of lines) {
    const line = raw.trim().replace(/,$/, '')
    if (line.startsWith('{"type":"Feature"')) yield JSON.parse(line)
  }
}
const collected = new Map() // areaId -> { runs: [], lifts: [] }
const bucket = id => collected.get(id) || collected.set(id, { runs: [], lifts: [] }).get(id)
const lineOf = geometry => geometry.type === 'LineString' ? [geometry.coordinates] : geometry.type === 'MultiLineString' ? geometry.coordinates : geometry.type === 'Polygon' ? [geometry.coordinates[0]] : geometry.type === 'MultiPolygon' ? geometry.coordinates.map(p => p[0]) : []
for await (const f of features(join(args.osm, 'runs.geojson'))) {
  const p = f.properties
  if (!(p.uses || []).includes('downhill') || (p.status && p.status !== 'operating')) continue
  const areaIds = (p.skiAreas || []).map(a => a.properties?.id).filter(id => resortsByArea.has(id))
  if (!areaIds.length) continue
  const isArea = f.geometry.type.endsWith('Polygon')
  for (const coords of lineOf(f.geometry)) for (const id of areaIds) bucket(id).runs.push({ d: p.difficulty || null, c: p.difficultyConvention || null, n: p.name || null, r: p.ref || null, a: isArea ? 1 : 0, g: p.gladed ? 1 : 0, pts: coords.map(([lon, lat]) => [lon, lat]) })
}
for await (const f of features(join(args.osm, 'lifts.geojson'))) {
  const p = f.properties
  if (p.status && p.status !== 'operating') continue
  if (['funicular', 'railway', 'goods', 'zip_line'].includes(p.liftType)) continue
  const areaIds = (p.skiAreas || []).map(a => a.properties?.id).filter(id => resortsByArea.has(id))
  for (const coords of lineOf(f.geometry)) for (const id of areaIds) bucket(id).lifts.push({ t: p.liftType || 'lift', n: p.name || null, pts: coords.map(([lon, lat]) => [lon, lat]) })
}

// ---------- write files ----------
const LICENSE_TEXT = "# Licence for the files in this folder\n\nThese trail-map files (`*.json`, `*.svg`, `index.json`) are derived from OpenStreetMap data,\n\u00a9 OpenStreetMap contributors, obtained through OpenSkiMap (https://openskimap.org).\n\nThey are made available under the Open Database License (ODbL) 1.0:\nhttps://opendatacommons.org/licenses/odbl/1-0/ and https://www.openstreetmap.org/copyright\n\nGenerated by `tools/trail-maps/build-trail-maps.mjs`. They are not official resort trail maps.\n"
const keyOf = id => id.replace(/[^A-Za-z0-9]+/g, '_')
rmSync(OUT, { recursive: true, force: true }); mkdirSync(OUT, { recursive: true })
writeFileSync(join(OUT, 'LICENSE.md'), LICENSE_TEXT)
const COLORS = {
  europe: { novice: '#22a35a', easy: '#2f6fe0', intermediate: '#e23b3b', advanced: '#111111', expert: '#111111', freeride: '#ef7d1a', extreme: '#ef7d1a' },
  north_america: { novice: '#22a35a', easy: '#22a35a', intermediate: '#2f6fe0', advanced: '#111111', expert: '#111111', freeride: '#ef7d1a', extreme: '#ef7d1a' },
  japan: { novice: '#22a35a', easy: '#22a35a', intermediate: '#e23b3b', advanced: '#111111', expert: '#111111', freeride: '#ef7d1a', extreme: '#ef7d1a' },
}
const index = {}
let totalBytes = 0
for (const [resortId, { area, method, resort }] of matches) {
  const data = collected.get(area.properties.id)
  if (!data?.runs.length) continue
  let { runs, lifts } = data, cropped = false
  if (runs.length > CROP_IF_RUNS_OVER) {
    const near = item => item.pts.some(([lon, lat]) => dist(resort.p, [lat, lon]) < CROP_RADIUS_M)
    runs = runs.filter(near); lifts = lifts.filter(near); cropped = true
    if (!runs.length) continue
  }
  const all = [...runs, ...lifts].flatMap(item => item.pts)
  const bbox = [Math.min(...all.map(p => p[0])), Math.min(...all.map(p => p[1])), Math.max(...all.map(p => p[0])), Math.max(...all.map(p => p[1]))]
  const lat0 = (bbox[1] + bbox[3]) / 2, origin = [bbox[0], bbox[1]]
  // Quantise to 1e-5 degrees (about 1 m) relative to the south-west corner, delta-encoded.
  const encode = pts => { let px = 0, py = 0; return simplify(pts, SIMPLIFY_M, lat0).flatMap(([lon, lat]) => { const x = Math.round((lon - origin[0]) * 1e5), y = Math.round((lat - origin[1]) * 1e5), out = [x - px, y - py]; px = x; py = y; return out }) }
  const convention = runs.find(r => r.c)?.c || area.properties.runConvention || 'europe'
  const km = runs.filter(r => !r.a).reduce((sum, r) => sum + lineLengthM(r.pts), 0) / 1000
  const liftCount = new Set(lifts.map(l => l.pts.map(p => p.join()).join('|'))).size
  const runCount = runs.filter(r => !r.a).length
  const coverage = runCount >= 10 && liftCount >= 3 ? 'good' : runCount >= 3 ? 'partial' : 'minimal'
  const key = keyOf(resortId)
  const file = {
    version: 'pf-trails/1', resort_id: resortId,
    osm_ski_area: { id: area.properties.id, name: area.properties.name || null, match: method, osm_sources: (area.properties.sources || []).slice(0, 3).map(s => `${s.type}:${s.id}`) },
    source: { name: 'OpenStreetMap contributors', via: 'OpenSkiMap', licence: 'ODbL 1.0', url: 'https://www.openstreetmap.org/copyright', via_url: 'https://openskimap.org', data_date: DATA_DATE },
    convention, origin, scale: 1e-5, bbox: bbox.map(v => Math.round(v * 1e5) / 1e5),
    stats: { runs: runCount, run_areas: runs.length - runCount, lifts: liftCount, km: Math.round(km * 10) / 10, cropped, crop_radius_km: cropped ? CROP_RADIUS_M / 1000 : null },
    runs: runs.map(r => ({ d: r.d, n: r.n, r: r.r, ...(r.a ? { a: 1 } : {}), ...(r.g ? { g: 1 } : {}), p: encode(r.pts) })),
    lifts: lifts.map(l => ({ t: l.t, n: l.n, p: encode(l.pts) })),
  }
  const json = JSON.stringify(file)
  writeFileSync(join(OUT, `${key}.json`), json); totalBytes += json.length

  // Plan-view thumbnail on a snow background, 600×360, north up.
  const kx = Math.cos(lat0 * rad), W = 600, H = 360, pad = 18
  const spanX = (bbox[2] - bbox[0]) * kx || 1e-4, spanY = (bbox[3] - bbox[1]) || 1e-4, s = Math.min((W - 2 * pad) / spanX, (H - 2 * pad) / spanY)
  const ox = (W - spanX * s) / 2, oy = (H - spanY * s) / 2
  const path = pts => simplify(pts, THUMB_SIMPLIFY_M, lat0).map(([lon, lat], i) => `${i ? 'L' : 'M'}${Math.round(ox + (lon - bbox[0]) * kx * s)} ${Math.round(H - oy - (lat - bbox[1]) * s)}`).join('')
  const palette = COLORS[convention] || COLORS.europe
  const groups = {}
  for (const r of runs) if (!r.a) (groups[palette[r.d] || '#7c8a96'] ||= []).push(path(r.pts))
  const order = Object.keys(groups).sort((a, b) => (a === '#111111') - (b === '#111111'))
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img"><title>${(resort.n || 'Resort').replace(/[<&>]/g, '')} trail map from OpenStreetMap</title><rect width="${W}" height="${H}" fill="#eef3f6"/>`
    + `<g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.2">${order.map(color => `<path stroke="${color}" d="${groups[color].join('')}"/>`).join('')}</g>`
    + `<path fill="none" stroke="#5b6670" stroke-width="1.4" stroke-dasharray="5 3" d="${lifts.map(l => path(l.pts)).join('')}"/></svg>`
  writeFileSync(join(OUT, `${key}.svg`), svg); totalBytes += svg.length

  index[resortId] = { key, runs: runCount, lifts: liftCount, km: file.stats.km, coverage, match: method, cropped }
}
writeFileSync(join(OUT, 'index.json'), JSON.stringify({ version: 'pf-trails-index/1', data_date: DATA_DATE, source: 'OpenStreetMap contributors via OpenSkiMap (ODbL 1.0)', resorts: index }))
const counts = Object.values(index).reduce((c, v) => (c[v.coverage] = (c[v.coverage] || 0) + 1, c), {})
console.log(`Wrote ${Object.keys(index).length} trail maps (${(totalBytes / 1e6).toFixed(1)} MB):`, counts)
