import test from 'node:test'
import assert from 'node:assert/strict'
import { officialBatch as first } from '../official-batch-001.mjs'
import { officialBatch as second } from '../official-batch-002.mjs'
import { officialBatch as third } from '../official-batch-003.mjs'
import { officialBatch, applyOfficialBatch004 } from '../official-batch-004.mjs'

test('fourth batch adds 25 distinct profiles with sourced original summaries',()=>{
  assert.equal(officialBatch.length,25)
  const ids=new Set([...first,...second,...third].map(e=>e.id))
  for(const e of officialBatch){
    assert.ok(!ids.has(e.id));ids.add(e.id)
    assert.ok(e.summary.length>60&&e.summary.length<400)
    assert.ok(e.summary_sources.length)
    for(const url of e.summary_sources)assert.equal(new URL(url).protocol,'https:')
    const keys=new Set()
    for(const f of e.observations){
      assert.ok(!keys.has(f.key));keys.add(f.key)
      assert.equal(f.retrieved_at,'2026-08-30')
      assert.equal(new URL(f.source).protocol,'https:')
      if(f.status==='conflict'){assert.equal(f.value,null);assert.ok(f.alternatives.length>=2)}
      else assert.ok(Number.isFinite(f.value)&&f.value>0)
    }
  }
})
test('fourth batch retains provenance and does not promote verification',()=>{
  const records=officialBatch.map(e=>({stable_id:e.id,confidence:'medium',verification_status:'candidate',field_provenance:{},source_records:[]}))
  const report=applyOfficialBatch004(records)
  assert.equal(report.summary_only_profiles.length,3)
  assert.equal(report.conflict_fields,4)
  for(const r of records){
    assert.equal(r.verification_status,'candidate');assert.equal(r.confidence,'medium')
    for(const f of r.mountain_observations){
      const p=r.field_provenance[`mountain.${f.key}`]
      assert.equal(p.batch,'official-004')
      assert.deepEqual(p.alternatives,f.alternatives)
      for(const url of p.source_record_ids)assert.ok(r.source_records.some(s=>s.url===url))
    }
  }
  assert.throws(()=>applyOfficialBatch004([]),/missing/)
  records[0].confidence='low'
  assert.throws(()=>applyOfficialBatch004(records),/confidence scope/)
})
test('batch four preserves access scope, historical dates and exact resort identities',()=>{
  const get=id=>officialBatch.find(e=>e.id===`wikidata:item:${id}`)
  assert.ok(get('Q5364061'));assert.ok(!get('Q5364053'))
  assert.ok(get('Q4921353').name.includes('Maine'))
  assert.match(get('Q4947991').observations.find(f=>f.key==='area').note,/combined/)
  assert.match(get('Q5028348').observations.find(f=>f.key==='lifts').note,/tubing lift excluded/)
  assert.equal(get('Q5316220').observations[0].source_published_at,'2023-11-12')
  assert.equal(get('Q19878257').observations.find(f=>f.key==='area').value,140)
  assert.equal(get('Q4883736').observations.find(f=>f.key==='area').value,null)
  assert.ok(!get('Q5225725').observations.some(f=>f.key==='base'))
})
