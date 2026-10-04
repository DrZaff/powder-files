import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { officialBatch, applyOfficialBatch006 } from '../official-batch-006.mjs'

test('sixth batch contains fifty new identities and sourced original summaries',async()=>{
  const previous=(await Promise.all(['001','002','003','004','005'].map(n=>import(`../official-batch-${n}.mjs`)))).flatMap(m=>m.officialBatch)
  const ids=new Set(previous.map(e=>e.id))
  assert.equal(officialBatch.length,50)
  for(const e of officialBatch){
    assert.ok(!ids.has(e.id));ids.add(e.id)
    assert.ok(e.summary.length>60&&e.summary.length<400)
    assert.equal(e.summary_reviewed_at,'2026-08-31')
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

test('sixth batch preserves provenance, uncertainty and strict joins',()=>{
  const records=officialBatch.map(e=>({stable_id:e.id,confidence:'medium',verification_status:'candidate',field_provenance:{},source_records:[]}))
  const report=applyOfficialBatch006(records)
  assert.equal(report.researched_profiles,50)
  assert.equal(report.source_checked_observations,215)
  assert.equal(report.conflict_fields,9)
  assert.deepEqual(report.summary_only_profiles,['wikidata:item:Q14875770'])
  for(const r of records){
    assert.equal(r.verification_status,'candidate');assert.equal(r.confidence,'medium')
    for(const f of r.mountain_observations){
      const p=r.field_provenance[`mountain.${f.key}`]
      assert.equal(p.batch,'official-006');assert.equal(p.retrieved_at,'2026-08-31')
      assert.deepEqual(p.alternatives,f.alternatives)
      for(const url of p.source_record_ids)assert.ok(r.source_records.some(s=>s.url===url))
    }
  }
  assert.throws(()=>applyOfficialBatch006([]),/missing/)
  assert.throws(()=>applyOfficialBatch006(records),/Duplicate mountain field/)
  records[0].confidence='low'
  assert.throws(()=>applyOfficialBatch006(records),/confidence scope/)
})

test('sixth batch does not confuse future terrain, sector statistics or learning lifts with totals',()=>{
  const fact=(id,key)=>officialBatch.find(e=>e.id===`wikidata:item:${id}`).observations.find(f=>f.key===key)
  assert.equal(fact('Q104864484','area').value,30)
  assert.match(fact('Q7548711','vertical').label,/Western Territory/)
  assert.equal(fact('Q7548711','silver_creek_trails').status,'conflict')
  assert.ok(!fact('Q7548711','area'))
  assert.equal(fact('Q7278590','learning_lifts').value,4)
  assert.ok(!fact('Q7278590','lifts'))
  assert.ok(!fact('Q7235982','area'))
  assert.equal(fact('Q7195117','vertical').value,null)
  assert.equal(fact('Q14704736','chairlifts').source_period,'2025–26')
})

test('sixth batch reaches public cards and guides without replacing Bristol or redating earlier research',async()=>{
  const {records}=JSON.parse(await readFile(new URL('../../public/data/resorts.compact.json',import.meta.url),'utf8'))
  assert.ok(records.filter(r=>r.ov).length>=203)
  for(const e of officialBatch){
    const r=records.find(r=>r.id===e.id)
    assert.ok(r);assert.equal(r.ov.text,e.summary);assert.equal(r.ov.reviewed_at,'2026-08-31')
    assert.notEqual(r.v,'verified')
    for(const url of r.ov.sources)assert.ok(r.sx.some(s=>s.url===url))
    for(const f of e.observations)assert.deepEqual(r.mf.find(o=>o.key===f.key),f)
  }
  assert.equal(records.find(r=>r.id==='wikidata:item:Q4883736').ov.reviewed_at,'2026-08-30')
  const bristol=records.find(r=>r.id==='powderfiles:verified:bristol-mountain')
  assert.equal(bristol.v,'verified');assert.equal(bristol.ov.reviewed_at,'2026-08-30')
  assert.equal(bristol.f.vertical_drop_ft,1200);assert.equal(bristol.f.trails,39)
})
