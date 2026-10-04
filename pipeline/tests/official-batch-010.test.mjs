import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { officialBatch, applyOfficialBatch010 } from '../official-batch-010.mjs'

test('tenth batch adds 100 distinct public identities with sourced original summaries',async()=>{
  const previous=(await Promise.all(['001','002','003','004','005','006','007','008','009'].map(n=>import(`../official-batch-${n}.mjs`)))).flatMap(m=>m.officialBatch)
  const ids=new Set(previous.map(e=>e.id))
  assert.equal(officialBatch.length,100)
  for(const e of officialBatch){
    assert.ok(!ids.has(e.id),e.id);ids.add(e.id)
    assert.ok(e.summary.length>60&&e.summary.length<400,e.name)
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

test('tenth batch retains provenance and missingness without promoting verification',()=>{
  const records=officialBatch.map(e=>({stable_id:e.id,confidence:'medium',verification_status:'candidate',field_provenance:{},source_records:[]}))
  const report=applyOfficialBatch010(records)
  assert.equal(report.researched_profiles,100)
  assert.equal(report.source_checked_observations,185)
  assert.equal(report.conflict_fields,2)
  assert.equal(report.summary_only_profiles.length,20)
  for(const r of records){
    assert.equal(r.verification_status,'candidate');assert.equal(r.confidence,'medium')
    for(const f of r.mountain_observations){
      const p=r.field_provenance[`mountain.${f.key}`]
      assert.equal(p.batch,'official-010');assert.equal(p.retrieved_at,'2026-08-31')
      assert.deepEqual(p.alternatives,f.alternatives)
      for(const url of p.source_record_ids)assert.ok(r.source_records.some(s=>s.url===url))
    }
  }
  assert.throws(()=>applyOfficialBatch010([]),/missing/)
  assert.throws(()=>applyOfficialBatch010(records),/Duplicate mountain field/)
  records[0].confidence='low'
  assert.throws(()=>applyOfficialBatch010(records),/confidence scope/)
})

test('tenth batch separates named routes, local scope, source periods and disputed totals',()=>{
  const fact=(id,key)=>officialBatch.find(e=>e.id===`wikidata:item:${id}`).observations.find(f=>f.key===key)
  assert.equal(fact('Q7421109','area').value,76)
  assert.equal(fact('Q7421109','area').unit,'ha')
  assert.equal(fact('Q7421109','vertical').value,683)
  assert.equal(fact('Q11296546','trails').source_period,'2024–25')
  assert.equal(fact('Q11478144','named_run_length').value,3300)
  assert.equal(fact('Q11478144','longest_run'),undefined)
  assert.equal(fact('Q11276859','named_run_vertical').value,224)
  assert.equal(fact('Q11276859','vertical'),undefined)
  assert.equal(fact('Q11441804','skiing_elevation'),undefined)
  assert.equal(fact('Q12054440','piste_length').value,31.5)
  assert.equal(fact('Q11801624','piste_length').qualifier,'+')
  assert.equal(fact('Q2554578','piste_length').value,43.5)
  assert.equal(fact('Q11323752','trails').status,'conflict')
  assert.equal(fact('Q11517725','trails').value,null)
  assert.equal(fact('Q11500723','lifts'),undefined)
  assert.equal(fact('Q11563653','trails'),undefined)
})

test('all 100 tenth-batch summaries and observations reach cards and guides; Bristol stays intact',async()=>{
  const {records}=JSON.parse(await readFile(new URL('../../public/data/resorts.compact.json',import.meta.url),'utf8'))
  assert.equal(records.length,1400)
  assert.ok(records.filter(r=>r.ov).length>=503)
  const countries={}
  for(const e of officialBatch){
    const r=records.find(r=>r.id===e.id)
    assert.ok(r,e.id);assert.equal(r.ov.text,e.summary);assert.equal(r.ov.reviewed_at,'2026-08-31')
    assert.ok(['medium','high'].includes(r.q));assert.notEqual(r.v,'verified')
    countries[r.c]=(countries[r.c]||0)+1
    for(const url of r.ov.sources)assert.ok(r.sx.some(s=>s.url===url))
    for(const f of e.observations)assert.deepEqual(r.mf.find(o=>o.key===f.key),f)
  }
  assert.deepEqual(countries,{Japan:80,Spain:4,Uzbekistan:1,Azerbaijan:2,Slovenia:3,Greece:3,Canada:2,Czechia:1,Poland:1,Italy:2,Switzerland:1})
  const bristol=records.find(r=>r.id==='powderfiles:verified:bristol-mountain')
  assert.equal(records.filter(r=>r.v==='verified').length,1)
  assert.equal(bristol.v,'verified');assert.equal(bristol.ov.reviewed_at,'2026-08-30')
  assert.equal(bristol.f.vertical_drop_ft,1200);assert.equal(bristol.f.trails,39);assert.equal(bristol.f.skiable_acres,138)
})
