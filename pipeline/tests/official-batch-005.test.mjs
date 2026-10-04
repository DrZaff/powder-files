import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { officialBatch as first } from '../official-batch-001.mjs'
import { officialBatch as second } from '../official-batch-002.mjs'
import { officialBatch as third } from '../official-batch-003.mjs'
import { officialBatch as fourth } from '../official-batch-004.mjs'
import { officialBatch, applyOfficialBatch005 } from '../official-batch-005.mjs'

test('fifth batch adds 50 distinct sourced profiles with positive facts or explicit conflicts',()=>{
  assert.equal(officialBatch.length,50)
  const ids=new Set([...first,...second,...third,...fourth].map(e=>e.id))
  for(const e of officialBatch){
    assert.ok(!ids.has(e.id));ids.add(e.id)
    assert.ok(e.summary.length>60&&e.summary.length<400)
    assert.equal(e.summary_reviewed_at,'2026-08-31')
    assert.ok(e.summary_sources.length)
    for(const url of e.summary_sources)assert.equal(new URL(url).protocol,'https:')
    const keys=new Set()
    for(const f of e.observations){
      assert.ok(!keys.has(f.key));keys.add(f.key)
      assert.equal(f.retrieved_at,'2026-08-31')
      assert.equal(new URL(f.source).protocol,'https:')
      if(f.status==='conflict'){
        assert.equal(f.value,null);assert.equal(f.confidence,'low');assert.ok(f.alternatives.length>=2)
        for(const a of f.alternatives)assert.equal(new URL(a.source).protocol,'https:')
      }else assert.ok(Number.isFinite(f.value)&&f.value>0)
    }
  }
})

test('fifth batch preserves field provenance and confidence, with strict identity joins',()=>{
  const records=officialBatch.map(e=>({stable_id:e.id,confidence:'medium',verification_status:'candidate',field_provenance:{},source_records:[]}))
  const report=applyOfficialBatch005(records)
  assert.equal(report.researched_profiles,50)
  assert.equal(report.conflict_fields,4)
  assert.ok(report.summary_only_profiles.includes('wikidata:item:Q5906070'))
  for(const r of records){
    assert.equal(r.verification_status,'candidate');assert.equal(r.confidence,'medium')
    for(const f of r.mountain_observations){
      const p=r.field_provenance[`mountain.${f.key}`]
      assert.equal(p.batch,'official-005');assert.equal(p.retrieved_at,'2026-08-31')
      assert.deepEqual(p.alternatives,f.alternatives)
      for(const url of p.source_record_ids)assert.ok(r.source_records.some(s=>s.url===url&&s.collected_at==='2026-08-31'))
    }
  }
  assert.throws(()=>applyOfficialBatch005([]),/missing/)
  assert.throws(()=>applyOfficialBatch005(records),/Duplicate mountain field/)
  records[0].confidence='low'
  assert.throws(()=>applyOfficialBatch005(records),/confidence scope/)
})

test('fifth batch keeps ski-area scopes, identities and source seasons explicit',()=>{
  const get=id=>officialBatch.find(e=>e.id===(id.includes(':')?id:`wikidata:item:${id}`))
  const fact=(id,key)=>get(id).observations.find(f=>f.key===key)
  assert.equal(fact('Q6492638','area').value,195)
  assert.equal(fact('Q6492638','trails').value,null)
  assert.equal(fact('Q3228008','area').value,138)
  assert.equal(fact('Q4804085','area').value,26)
  assert.equal(fact('Q4804085','vertical').value,450)
  assert.match(fact('Q4804085','area').label,/Current T-bar/)
  assert.equal(fact('Q6898025','area').value,1017)
  assert.equal(fact('Q6898025','trails').value,72)
  assert.ok(!fact('Q6651957','area'));assert.equal(fact('Q6651957','park_area').value,8)
  assert.ok(!fact('Q5598742','area'))
  assert.equal(fact('Q15229111','trails').value,20)
  assert.equal(fact('Q14711916','area').value,1509)
  assert.match(fact('Q6411954','trails').source_period,/2025–26/)
  assert.ok(get('Q16895225'));assert.ok(get('Q6730788'));assert.ok(!get('Q6730786'))
  assert.ok(get('openstreetmap:way:278930064'));assert.ok(get('openstreetmap:way:691521199'))
  assert.match(get('Q6726042').summary,/snowboards are not permitted/)
  assert.match(get('Q4796182').summary,/limited/)
})

test('batch-five content reaches public guides without redating old reviews or replacing Bristol',async()=>{
  const {records}=JSON.parse(await readFile(new URL('../../public/data/resorts.compact.json',import.meta.url),'utf8'))
  for(const e of officialBatch){
    const r=records.find(r=>r.id===e.id)
    assert.ok(r);assert.equal(r.ov.text,e.summary);assert.equal(r.ov.reviewed_at,'2026-08-31')
    assert.notEqual(r.v,'verified')
    for(const url of r.ov.sources)assert.ok(r.sx.some(s=>s.url===url))
    for(const fact of e.observations)assert.deepEqual(r.mf.find(f=>f.key===fact.key),fact)
  }
  assert.equal(records.find(r=>r.id==='wikidata:item:Q4883736').ov.reviewed_at,'2026-08-30')
  const bristol=records.find(r=>r.id==='powderfiles:verified:bristol-mountain')
  assert.equal(bristol.v,'verified');assert.equal(bristol.ov.reviewed_at,'2026-08-30')
  assert.equal(bristol.f.vertical_drop_ft,1200);assert.equal(bristol.f.trails,39)
})
