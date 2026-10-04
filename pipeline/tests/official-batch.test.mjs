import test from 'node:test'
import assert from 'node:assert/strict'
import { officialBatch, applyOfficialBatch, checked } from '../official-batch-001.mjs'
import { formatMountainFact } from '../../src/mountain-fact-format.js'

const records = () => officialBatch.map(r => ({ stable_id:r.id, confidence:'medium', verification_status:'candidate', field_provenance:{}, source_records:[] }))
test('batch contains 25 unique exact identifiers and no Bristol overwrite', () => {
  assert.equal(officialBatch.length,25)
  assert.equal(new Set(officialBatch.map(r=>r.id)).size,25)
  for(const r of officialBatch) assert.match(r.id,/^wikidata:item:Q\d+$/)
})
test('every observation retains source, date, units, scope and confidence', () => {
  for(const r of officialBatch) {
    assert.equal(new Set(r.observations.map(o=>o.key)).size,r.observations.length)
    for(const o of r.observations) {
      assert.equal(new URL(o.source).protocol,'https:')
      assert.equal(o.retrieved_at,checked)
      assert.ok(['','ft','m','acres','ha','km','%'].includes(o.unit))
      assert.equal(typeof o.note,'string')
      assert.ok(Object.hasOwn(o,'source_published_at'))
      if(o.status==='conflict') {
        assert.equal(o.value,null)
        assert.equal(o.confidence,'low')
        assert.ok(o.alternatives.length>=2)
        for(const a of o.alternatives) {assert.ok(Number.isFinite(a.value));assert.equal(new URL(a.source).protocol,'https:')}
      } else { assert.ok(Number.isFinite(o.value));assert.equal(o.confidence,'medium') }
    }
  }
})
test('joining does not promote confidence or verification and keeps alternative provenance', () => {
  const data=records(), report=applyOfficialBatch(data)
  assert.equal(report.researched_profiles,25)
  for(const r of data) {
    assert.equal(r.confidence,'medium');assert.equal(r.verification_status,'candidate')
    for(const o of r.mountain_observations) {
      const p=r.field_provenance[`mountain.${o.key}`]
      assert.equal(p.batch,'official-001')
      assert.equal(p.qualifier,o.qualifier)
      for(const source of [o.source,...(o.alternatives||[]).map(a=>a.source)]) {
        assert.ok(p.source_record_ids.includes(source))
        assert.ok(r.source_records.some(s=>s.url===source&&s.collected_at===checked))
      }
    }
  }
  assert.ok(report.profiles.some(r=>r.missing_core_fields.length))
})
test('missing identities, low confidence and duplicate fields fail closed', () => {
  assert.throws(()=>applyOfficialBatch([]),/missing/)
  const low=records();low[0].confidence='low'
  assert.throws(()=>applyOfficialBatch(low),/confidence scope/)
  const data=records();applyOfficialBatch(data)
  assert.throws(()=>applyOfficialBatch(data),/Duplicate mountain field/)
})
test('display preserves lower bounds, approximate counts, conflicts and missing values', () => {
  assert.equal(formatMountainFact({value:120,unit:'',qualifier:'+'}),'120+')
  assert.equal(formatMountainFact({value:40,unit:'km',qualifier:'>'}),'Over 40 km')
  assert.equal(formatMountainFact({value:null,status:'conflict'}),'Needs review')
  assert.equal(formatMountainFact({value:null,unit:'ft'}),'Not yet sourced')
})
test('length, summit and restricted terrain are not silently reclassified', () => {
  const glenshee=officialBatch.find(r=>r.id==='wikidata:item:Q5569328')
  assert.ok(glenshee.observations.some(o=>o.key==='piste_length'&&o.unit==='km'))
  assert.ok(!glenshee.observations.some(o=>o.key==='area'))
  const snowbowl=officialBatch.find(r=>r.id==='wikidata:item:Q4791400')
  assert.match(snowbowl.observations.find(o=>o.key==='vertical').note,/hike-to/)
  const brundage=officialBatch.find(r=>r.id==='wikidata:item:Q4978877')
  assert.match(brundage.observations.find(o=>o.key==='area').note,/unpatrolled/)
})
