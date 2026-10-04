import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { officialBatch as firstBatch, applyOfficialBatch } from '../official-batch-001.mjs'
import { officialBatch, applyOfficialBatch002, checked } from '../official-batch-002.mjs'
import { formatMountainFact } from '../../src/mountain-fact-format.js'

const mock = entries => entries.map(r=>({stable_id:r.id,confidence:'medium',verification_status:'candidate',field_provenance:{},source_records:[]}))
test('second batch has 25 distinct profiles and does not overlap previous batch',()=>{
  assert.equal(officialBatch.length,25)
  const ids=new Set(firstBatch.map(r=>r.id))
  for(const r of officialBatch) { assert.ok(!ids.has(r.id));ids.add(r.id) }
  assert.equal(ids.size,50)
})
test('second batch observations preserve numeric integrity, dates and source provenance',()=>{
  for(const r of officialBatch){
    assert.ok(r.observations.length)
    assert.equal(new Set(r.observations.map(o=>o.key)).size,r.observations.length)
    for(const f of r.observations){
      assert.equal(new URL(f.source).protocol,'https:')
      assert.equal(f.retrieved_at,checked)
      assert.ok(['','m','ft','km','ha','acres'].includes(f.unit))
      assert.ok(['','+','>','~'].includes(f.qualifier||''))
      if(f.status==='conflict'){
        assert.equal(f.value,null);assert.equal(f.confidence,'low');assert.ok(f.alternatives.length>=2)
        for(const a of f.alternatives){assert.ok(Number.isFinite(a.value));assert.equal(new URL(a.source).protocol,'https:')}
      }else{assert.ok(Number.isFinite(f.value)&&f.value>0);assert.equal(f.status,'source_checked');assert.equal(f.confidence,'medium')}
      if(f.source_period)assert.equal(typeof f.source_period,'string')
    }
  }
})
test('both batches retain independent provenance without promoting verification',()=>{
  const records=mock([...firstBatch,...officialBatch])
  applyOfficialBatch(records)
  const before=structuredClone(records.slice(0,25)),report=applyOfficialBatch002(records)
  assert.deepEqual(records.slice(0,25),before)
  assert.equal(report.batch,'official-002')
  assert.equal(report.profiles.length,25)
  for(const r of records.slice(25)){
    assert.equal(r.confidence,'medium');assert.equal(r.verification_status,'candidate')
    for(const f of r.mountain_observations){
      const p=r.field_provenance[`mountain.${f.key}`]
      assert.equal(p.batch,'official-002');assert.equal(p.source_period,f.source_period)
      for(const url of [f.source,...(f.alternatives||[]).map(a=>a.source)]){
        assert.ok(p.source_record_ids.includes(url));assert.ok(r.source_records.some(s=>s.url===url&&s.collected_at===checked))
      }
    }
  }
})
test('second batch cannot silently join absent or low-confidence profiles',()=>{
  assert.throws(()=>applyOfficialBatch002([]),/missing/)
  const records=mock(officialBatch);records[0].confidence='low'
  assert.throws(()=>applyOfficialBatch002(records),/confidence scope/)
})
test('historical, linked-area and approximate figures remain explicit',()=>{
  const get=q=>officialBatch.find(r=>r.id===`wikidata:item:${q}`).observations
  assert.ok(get('Q11222992').every(f=>f.source_period==='2023–24'))
  assert.ok(get('Q7067399').every(f=>f.source_period==='2024–25'))
  assert.ok(get('Q7697675').every(f=>f.source_published_at==='2020-09-30'))
  assert.equal(get('Q3021172').find(f=>f.key==='area').value,4300)
  assert.match(get('Q3021172').find(f=>f.key==='area').note,/2025–26/)
  assert.equal(get('Q61451059').find(f=>f.key==='area').value,245)
  assert.equal(get('Q7067399').find(f=>f.key==='area').value,297)
  assert.match(get('Q11580462').find(f=>f.key==='gondola_elevation').note,/not the highest/)
  const palisades=get('Q2182804').find(f=>f.key==='trails')
  assert.equal(palisades.status,'conflict');assert.equal(palisades.value,null)
  assert.match(palisades.alternatives[1].derivation,/187 \+ 109/)
  assert.equal(formatMountainFact(get('Q127037').find(f=>f.key==='piste_length')),'About 75 km')
})
test('generated public dataset includes each batch profile and preserves Bristol',async()=>{
  const path=new URL('../../public/data/resorts.compact.json',import.meta.url)
  const {records}=JSON.parse(await readFile(path,'utf8'))
  assert.equal(records.length,1402)
  for(const entry of officialBatch){
    const r=records.find(r=>r.id===entry.id)
    assert.ok(r,entry.id);assert.ok(['medium','high'].includes(r.q))
    for(const f of entry.observations)assert.deepEqual(r.mf.find(o=>o.key===f.key),f)
  }
  const bristol=records.find(r=>r.id==='powderfiles:verified:bristol-mountain')
  assert.equal(bristol.v,'verified');assert.equal(bristol.q,'high')
  assert.equal(records.filter(r=>r.v==='verified').length,1)
})
