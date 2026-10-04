import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { officialBatch, applyOfficialBatch008 } from '../official-batch-008.mjs'

test('eighth batch has fifty new identities and sourced original summaries',async()=>{
  const previous=(await Promise.all(['001','002','003','004','005','006','007'].map(n=>import(`../official-batch-${n}.mjs`)))).flatMap(m=>m.officialBatch)
  const ids=new Set(previous.map(e=>e.id))
  assert.equal(officialBatch.length,50)
  for(const e of officialBatch){
    assert.ok(!ids.has(e.id));ids.add(e.id)
    assert.ok(e.summary.length>60&&e.summary.length<400)
    assert.equal(e.summary_reviewed_at,'2026-08-31')
    assert.ok(e.summary_sources.length)
    for(const url of e.summary_sources)assert.equal(new URL(url).protocol,'https:')
    for(const f of e.observations){
      assert.equal(f.retrieved_at,'2026-08-31')
      assert.equal(new URL(f.source).protocol,'https:')
      if(f.status==='conflict'){
        assert.equal(f.value,null);assert.equal(f.confidence,'low')
        assert.ok(f.alternatives.length>=2)
        for(const a of f.alternatives)assert.equal(new URL(a.source).protocol,'https:')
      }else assert.ok(Number.isFinite(f.value)&&f.value>0)
    }
  }
})

test('eighth batch retains provenance and uncertainty with strict joins',()=>{
  const records=officialBatch.map(e=>({stable_id:e.id,confidence:'medium',verification_status:'candidate',field_provenance:{},source_records:[]}))
  const report=applyOfficialBatch008(records)
  assert.equal(report.researched_profiles,50)
  assert.equal(report.source_checked_observations,146)
  assert.equal(report.conflict_fields,7)
  assert.equal(report.summary_only_profiles.length,10)
  for(const r of records){
    assert.equal(r.verification_status,'candidate');assert.equal(r.confidence,'medium')
    for(const f of r.mountain_observations){
      const p=r.field_provenance[`mountain.${f.key}`]
      assert.equal(p.batch,'official-008');assert.equal(p.retrieved_at,'2026-08-31')
      assert.deepEqual(p.alternatives,f.alternatives)
      for(const url of p.source_record_ids)assert.ok(r.source_records.some(s=>s.url===url))
    }
  }
  assert.throws(()=>applyOfficialBatch008([]),/missing/)
  assert.throws(()=>applyOfficialBatch008(records),/Duplicate mountain field/)
  records[0].confidence='low'
  assert.throws(()=>applyOfficialBatch008(records),/confidence scope/)
})

test('eighth batch separates lift access, broader terrain and seasonal facilities',()=>{
  const fact=(id,key)=>officialBatch.find(e=>e.id===`wikidata:item:${id}`).observations.find(f=>f.key===key)
  assert.equal(fact('Q51766765','vertical').value,3166)
  assert.equal(fact('Q7996356','area').value,553)
  assert.equal(fact('Q7080625','area').value,125)
  assert.equal(fact('Q7080625','area').source_period,'2025')
  assert.equal(fact('Q6922586','vertical').value,450)
  assert.equal(fact('Q10856520','skiing_elevation').value,1300)
  assert.ok(!fact('Q14713688','vertical'))
  assert.ok(!fact('Q15244599','vertical'))
  assert.equal(fact('Q8027682','area').status,'conflict')
  assert.equal(fact('Q10726608','trails').value,null)
  assert.equal(fact('Q1943086','lifts').value,null)
  assert.ok(!fact('Q2268802','lifts'))
})

test('eighth batch reaches every public card and guide without changing Bristol',async()=>{
  const {records}=JSON.parse(await readFile(new URL('../../public/data/resorts.compact.json',import.meta.url),'utf8'))
  assert.ok(records.filter(r=>r.ov).length>=303)
  for(const e of officialBatch){
    const r=records.find(r=>r.id===e.id)
    assert.ok(r);assert.equal(r.ov.text,e.summary);assert.equal(r.ov.reviewed_at,'2026-08-31')
    assert.notEqual(r.v,'verified')
    for(const url of r.ov.sources)assert.ok(r.sx.some(s=>s.url===url))
    for(const f of e.observations)assert.deepEqual(r.mf.find(o=>o.key===f.key),f)
  }
  const bristol=records.find(r=>r.id==='powderfiles:verified:bristol-mountain')
  assert.equal(bristol.v,'verified');assert.equal(bristol.ov.reviewed_at,'2026-08-30')
  assert.equal(bristol.f.vertical_drop_ft,1200);assert.equal(bristol.f.trails,39)
})
