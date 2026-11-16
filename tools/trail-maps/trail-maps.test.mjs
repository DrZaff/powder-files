// Integrity checks for the generated trail-map files (npm run trails:test).
import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { decodeTrails, chooseTiles, padBbox } from '../../src/trails/trail-scene.js'

const root = new URL('../../public/data/', import.meta.url)
const index = JSON.parse(readFileSync(new URL('trails/index.json', root)))
const resorts = new Set(JSON.parse(readFileSync(new URL('resorts.compact.json', root))).records.map(r => r.id))

test('index lists only known resorts, each with a JSON and an SVG file', () => {
  assert.equal(index.version, 'pf-trails-index/1')
  assert.match(index.source, /OpenStreetMap contributors/)
  for (const [id, entry] of Object.entries(index.resorts)) {
    assert.ok(resorts.has(id), `unknown resort ${id}`)
    assert.ok(existsSync(new URL(`trails/${entry.key}.json`, root)), `${entry.key}.json`)
    assert.ok(existsSync(new URL(`trails/${entry.key}.svg`, root)), `${entry.key}.svg`)
    assert.ok(['good', 'partial', 'minimal'].includes(entry.coverage))
    assert.ok(entry.runs > 0)
  }
})

test('every trail file decodes inside its bounding box and keeps its licence', () => {
  for (const entry of Object.values(index.resorts)) {
    const file = JSON.parse(readFileSync(new URL(`trails/${entry.key}.json`, root)))
    assert.equal(file.version, 'pf-trails/1'); assert.equal(file.source.licence, 'ODbL 1.0')
    const [w, s, e, n] = file.bbox, eps = 2e-5
    const { runs, lifts } = decodeTrails(file)
    for (const item of [...runs, ...lifts]) for (const [lon, lat] of item.pts) assert.ok(lon >= w - eps && lon <= e + eps && lat >= s - eps && lat <= n + eps, `${entry.key} point outside bbox`)
    assert.equal(runs.filter(r => !r.a).length, file.stats.runs)
  }
})

test('terrain never needs more than six tiles', () => {
  for (const entry of Object.values(index.resorts)) {
    const file = JSON.parse(readFileSync(new URL(`trails/${entry.key}.json`, root)))
    assert.ok(chooseTiles(padBbox(file.bbox)).tiles.length <= 6, entry.key)
  }
})
