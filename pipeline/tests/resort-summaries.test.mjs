import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { officialBatch as first } from '../official-batch-001.mjs'
import { officialBatch as second } from '../official-batch-002.mjs'
import { officialBatch, applyOfficialBatch003 } from '../official-batch-003.mjs'
import { applyResortSummaries } from '../resort-summaries.mjs'

test('third batch has 25 distinct new profiles with original sourced summaries',()=>{
  assert.equal(officialBatch.length,25)
  const ids=new Set([...first,...second].map(r=>r.id))
  for(const r of officialBatch){
    assert.ok(!ids.has(r.id));ids.add(r.id)
    assert.ok(r.summary.length>60&&r.summary.length<400)
    assert.ok(r.summary_sources.length)
    for(const source of r.summary_sources)assert.equal(new URL(source).protocol,'https:')
    for(const f of r.observations){
      assert.equal(f.retrieved_at,'2026-08-30')
      assert.equal(new URL(f.source).protocol,'https:')
      if(f.status==='conflict'){assert.equal(f.value,null);assert.ok(f.alternatives.length>=2)}
      else assert.ok(Number.isFinite(f.value)&&f.value>0)
    }
  }
})
test('third batch preserves verification and field-level source records',()=>{
  const records=officialBatch.map(r=>({stable_id:r.id,confidence:'medium',verification_status:'candidate',field_provenance:{},source_records:[]}))
  const report=applyOfficialBatch003(records)
  assert.equal(report.summary_only_profiles.length,5)
  for(const r of records){
    assert.equal(r.verification_status,'candidate');assert.equal(r.confidence,'medium')
    for(const f of r.mountain_observations){
      const p=r.field_provenance[`mountain.${f.key}`]
      assert.equal(p.batch,'official-003')
      for(const url of p.source_record_ids)assert.ok(r.source_records.some(s=>s.url===url))
    }
  }
  assert.throws(()=>applyOfficialBatch003([]),/missing/)
})
test('all 1357 in-scope researched summaries survive canonical and compact generation',async()=>{
  const canonical=JSON.parse(await readFile(new URL('../generated/canonical-resorts.json',import.meta.url),'utf8'))
  const {records}=JSON.parse(await readFile(new URL('../../public/data/resorts.compact.json',import.meta.url),'utf8'))
  assert.equal(records.length,1421)
  assert.equal(records.filter(r=>r.ov).length,1357)
  for(const r of records.filter(r=>r.ov)){
    const full=canonical.find(c=>c.stable_id===r.id)
    assert.deepEqual(r.ov,full.overview)
    assert.equal(r.ov.kind,'editorial_summary')
    assert.equal(full.field_provenance.overview.confidence,'medium')
    assert.ok(r.ov.sources.every(url=>r.sx.some(s=>s.url===url)))
  }
  assert.ok(records.filter(r=>r.mf.some(f=>f.status==='source_checked')).every(r=>r.ov))
  assert.equal(records.find(r=>r.id==='powderfiles:verified:bristol-mountain').v,'verified')
  assert.equal(records.filter(r=>r.v==='verified').length,1)
  const missing=structuredClone(canonical);delete missing.find(r=>r.stable_id==='wikidata:item:Q7620695').mountain_observations
  assert.throws(()=>applyResortSummaries(missing),/evidence missing/)
})
