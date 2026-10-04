import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { officialBatch, applyOfficialBatch009 } from '../official-batch-009.mjs'

test('ninth batch contains 100 new public identities with sourced original summaries',async()=>{
  const previous=(await Promise.all(['001','002','003','004','005','006','007','008'].map(n=>import(`../official-batch-${n}.mjs`)))).flatMap(m=>m.officialBatch)
  const ids=new Set(previous.map(e=>e.id))
  assert.equal(officialBatch.length,100)
  for(const e of officialBatch){
    assert.ok(!ids.has(e.id),e.id);ids.add(e.id)
    assert.ok(e.summary.length>60&&e.summary.length<400,e.name)
    assert.equal(e.summary_reviewed_at,'2026-08-31')
    assert.ok(e.summary_sources.length)
    for(const url of e.summary_sources)assert.equal(new URL(url).protocol,'https:')
    assert.ok(!e.summary_sources.some(u=>new URL(u).hostname==='www.chaillol.fr'))
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

test('ninth batch preserves field provenance, missingness and strict joins',()=>{
  const records=officialBatch.map(e=>({stable_id:e.id,confidence:'medium',verification_status:'candidate',field_provenance:{},source_records:[]}))
  const report=applyOfficialBatch009(records)
  assert.equal(report.researched_profiles,100)
  assert.equal(report.source_checked_observations,217)
  assert.equal(report.conflict_fields,11)
  assert.equal(report.summary_only_profiles.length,24)
  for(const r of records){
    assert.equal(r.verification_status,'candidate');assert.equal(r.confidence,'medium')
    for(const f of r.mountain_observations){
      const p=r.field_provenance[`mountain.${f.key}`]
      assert.equal(p.batch,'official-009');assert.equal(p.retrieved_at,'2026-08-31')
      assert.deepEqual(p.alternatives,f.alternatives)
      for(const url of p.source_record_ids)assert.ok(r.source_records.some(s=>s.url===url))
    }
  }
  assert.throws(()=>applyOfficialBatch009([]),/missing/)
  assert.throws(()=>applyOfficialBatch009(records),/Duplicate mountain field/)
  records[0].confidence='low'
  assert.throws(()=>applyOfficialBatch009(records),/confidence scope/)
})

test('ninth batch distinguishes piste lengths, broad areas, sector scope and conflicts',()=>{
  const fact=(id,key)=>officialBatch.find(e=>e.id===`wikidata:item:${id}`).observations.find(f=>f.key===key)
  assert.equal(fact('Q2274046','area').value,410)
  assert.equal(fact('Q2274046','piste_length').value,250)
  assert.equal(fact('Q933254','trails').value,78)
  assert.equal(fact('Q688517','skiing_elevation').value,2700)
  assert.match(fact('Q688517','skiing_elevation').label,/sector/)
  assert.equal(fact('Q61159493','piste_length').qualifier,'+')
  assert.equal(fact('Q61232702','trails'),undefined)
  assert.equal(fact('Q1085709','skiing_elevation'),undefined)
  assert.equal(fact('Q1414722','piste_length'),undefined)
  assert.equal(fact('Q3209895','piste_length'),undefined)
  assert.equal(fact('Q60726558','skiing_elevation').value,null)
  assert.equal(fact('Q3230567','trails').status,'conflict')
  assert.equal(fact('Q130260373','trails').status,'conflict')
  assert.equal(fact('Q433534','lifts').status,'conflict')
})

test('all 100 additions reach public cards and guides while Bristol and older dates stay intact',async()=>{
  const {records}=JSON.parse(await readFile(new URL('../../public/data/resorts.compact.json',import.meta.url),'utf8'))
  assert.equal(records.length,1421)
  assert.ok(records.filter(r=>r.ov).length>=403)
  const countries={}
  for(const e of officialBatch){
    const r=records.find(r=>r.id===e.id)
    assert.ok(r,e.id);assert.equal(r.ov.text,e.summary);assert.equal(r.ov.reviewed_at,'2026-08-31')
    assert.ok(['medium','high'].includes(r.q));assert.notEqual(r.v,'verified')
    countries[r.c]=(countries[r.c]||0)+1
    for(const url of r.ov.sources)assert.ok(r.sx.some(s=>s.url===url))
    for(const f of e.observations)assert.deepEqual(r.mf.find(o=>o.key===f.key),f)
  }
  assert.deepEqual(countries,{Austria:27,France:50,Spain:8,Finland:6,Italy:2,Switzerland:7})
  const bristol=records.find(r=>r.id==='powderfiles:verified:bristol-mountain')
  assert.equal(bristol.v,'verified');assert.equal(bristol.ov.reviewed_at,'2026-08-30')
  assert.equal(bristol.f.vertical_drop_ft,1200);assert.equal(bristol.f.trails,39)
})
