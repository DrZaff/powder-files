import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { officialBatch, applyOfficialBatch012 } from '../official-batch-012.mjs'

test('twelfth batch adds exactly 100 new source-linked profiles',async()=>{
  const previous=(await Promise.all(Array.from({length:11},(_,i)=>import(`../official-batch-${String(i+1).padStart(3,'0')}.mjs`)))).flatMap(m=>m.officialBatch)
  const ids=new Set(previous.map(e=>e.id))
  assert.equal(officialBatch.length,100)
  for(const e of officialBatch){
    assert.ok(!ids.has(e.id),e.id);ids.add(e.id)
    assert.ok(e.summary.length>60&&e.summary.length<400,e.name)
    assert.equal(e.summary_reviewed_at,'2026-08-31')
    assert.ok(e.summary_sources.length)
    for(const url of e.summary_sources)assert.ok(['http:','https:'].includes(new URL(url).protocol))
    for(const f of e.observations){
      assert.equal(f.retrieved_at,'2026-08-31')
      assert.equal(f.status,'source_checked');assert.equal(f.confidence,'medium')
      assert.ok(Number.isFinite(f.value)&&f.value>0)
    }
  }
})

test('twelfth batch retains provenance and does not promote verification',()=>{
  const records=officialBatch.map(e=>({stable_id:e.id,confidence:'medium',verification_status:'candidate',field_provenance:{},source_records:[]}))
  const report=applyOfficialBatch012(records)
  assert.equal(report.researched_profiles,100)
  assert.equal(report.source_checked_observations,21)
  assert.equal(report.summary_only_profiles.length,94)
  for(const r of records){
    assert.equal(r.verification_status,'candidate');assert.equal(r.confidence,'medium')
    for(const f of r.mountain_observations){
      const p=r.field_provenance[`mountain.${f.key}`]
      assert.equal(p.batch,'official-012')
      for(const [key,value] of Object.entries(f))assert.deepEqual(p[key],value)
      assert.ok(r.source_records.some(s=>s.url===f.source))
    }
  }
  assert.throws(()=>applyOfficialBatch012([]),/missing/)
  assert.throws(()=>applyOfficialBatch012(records),/Duplicate mountain field/)
})

test('twelfth batch preserves local and linked-route scope',()=>{
  const find=id=>officialBatch.find(e=>e.id===`wikidata:item:${id}`)
  const fact=(id,key)=>find(id).observations.find(f=>f.key===key)
  assert.equal(fact('Q20044116','vertical').value,580)
  assert.equal(fact('Q20044116','trails').value,10)
  assert.equal(fact('Q11604871','longest_run').value,3000)
  assert.match(fact('Q11604871','longest_run').note,/Links/)
  assert.equal(fact('Q11475057','longest_run').value,2600)
  assert.equal(fact('Q11590728','named_run_length').value,2500)
  assert.equal(fact('Q11235669','vertical').derivation,'533 m - 317 m')
  assert.equal(fact('Q11325790','trails').value,5)
})

test('official names replace identifier-only labels without changing stable identity',()=>{
  const e=officialBatch.find(e=>e.id==='wikidata:item:Q17989535')
  const record={stable_id:e.id,name:'Q17989535',normalized_name:'q17989535',confidence:'medium',verification_status:'candidate',field_provenance:{name:{value:'Q17989535'}},source_records:[]}
  applyOfficialBatch012([record,...officialBatch.filter(x=>x.id!==e.id).map(x=>({stable_id:x.id,name:x.name,normalized_name:x.name.toLowerCase(),confidence:'medium',verification_status:'candidate',field_provenance:{},source_records:[]}))])
  assert.equal(record.stable_id,e.id);assert.equal(record.name,'Ooana Ski Resort');assert.equal(record.normalized_name,'ooana ski resort')
  assert.equal(record.field_provenance.name.value,'Ooana Ski Resort')
  assert.ok(record.field_provenance.name.source_record_ids.includes('http://ooana-ski.com'))
})

test('all twelfth-batch profiles reach public cards and guides; Bristol remains unchanged',async()=>{
  const {records}=JSON.parse(await readFile(new URL('../../public/data/resorts.compact.json',import.meta.url),'utf8'))
  assert.equal(records.length,1402)
  assert.ok(records.filter(r=>r.ov).length>=703)
  for(const e of officialBatch){
    const matches=records.filter(r=>r.id===e.id)
    assert.equal(matches.length,1,e.id)
    const r=matches[0]
    assert.equal(r.ov.text,e.summary);assert.equal(r.ov.reviewed_at,'2026-08-31')
    assert.ok(['medium','high'].includes(r.q));assert.notEqual(r.v,'verified')
    for(const url of e.summary_sources)assert.ok(r.ov.sources.includes(url)&&r.sx.some(s=>s.url===url))
    for(const f of e.observations)assert.deepEqual(r.mf.find(o=>o.key===f.key),f)
  }
  const bristol=records.find(r=>r.id==='powderfiles:verified:bristol-mountain')
  assert.equal(records.filter(r=>r.v==='verified').length,1)
  assert.equal(bristol.ov.reviewed_at,'2026-08-30')
  assert.equal(bristol.f.vertical_drop_ft,1200);assert.equal(bristol.f.trails,39);assert.equal(bristol.f.skiable_acres,138)
})
