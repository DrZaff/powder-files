import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { officialBatch, applyOfficialBatch027 } from '../official-batch-027.mjs'

test('batch 027 contains fifty unique, source-linked candidate profiles', async () => {
  const previous = (await Promise.all(Array.from({ length: 26 }, (_, index) => import(`../official-batch-${String(index + 1).padStart(3, '0')}.mjs`))))
    .flatMap(module => module.officialBatch)
  const ids = new Set(previous.map(entry => entry.id))
  assert.equal(officialBatch.length, 50)
  for (const entry of officialBatch) {
    assert.ok(!ids.has(entry.id), entry.id)
    ids.add(entry.id)
    assert.ok(entry.summary.length > 100 && entry.summary.length < 400, entry.name)
    assert.equal(entry.summary_reviewed_at, '2026-11-05')
    assert.deepEqual(entry.observations, [])
    assert.equal(new URL(entry.summary_sources[0]).hostname, 'www.wikidata.org')
  }
})

test('batch 027 repairs opaque labels without inventing mountain facts', () => {
  const records = officialBatch.map(entry => ({
    stable_id: entry.id,
    name: entry.id.split(':').at(-1),
    normalized_name: 'placeholder',
    confidence: 'medium',
    verification_status: 'candidate',
    operating_status: 'unknown',
    field_provenance: {},
    source_records: [{ source: 'wikidata', record_id: entry.id.split(':').at(-1), url: entry.summary_sources[0] }],
  }))
  const report = applyOfficialBatch027(records)
  assert.equal(report.researched_profiles, 50)
  assert.equal(report.source_checked_observations, 0)
  assert.equal(report.conflict_fields, 0)
  assert.equal(report.name_repairs, 50)
  for (const record of records) {
    assert.equal(record.verification_status, 'candidate')
    assert.equal(record.operating_status, 'unknown')
    assert.deepEqual(record.mountain_observations, [])
    assert.ok(record.overview?.sources[0])
    assert.notEqual(record.normalized_name, 'placeholder')
  }
})

test('all batch 027 profiles reach public cards with explicit missing facts', async () => {
  const { records } = JSON.parse(await readFile(new URL('../../public/data/resorts.compact.json', import.meta.url), 'utf8'))
  for (const entry of officialBatch) {
    const matches = records.filter(record => record.id === entry.id)
    assert.equal(matches.length, 1, entry.id)
    const record = matches[0]
    assert.equal(record.ov.text, entry.summary)
    assert.ok(['medium', 'high'].includes(record.q))
    assert.notEqual(record.v, 'verified')
    assert.equal(record.mf.filter(fact => fact.status === 'source_checked').length, 0)
    assert.ok(record.sx.some(source => source.url === entry.summary_sources[0]))
  }
})
