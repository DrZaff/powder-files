import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { officialBatch, applyOfficialBatch013 } from '../official-batch-013.mjs'

test('thirteenth batch contains exactly 100 new source-linked identities',async()=>{
  const previous=(await Promise.all(Array.from({length:12},(_,i)=>import(`../official-batch-${String(i+1).padStart(3,'0')}.mjs`)))).flatMap(m=>m.officialBatch)
  const ids=new Set(previous.map(e=>e.id))
  assert.equal(officialBatch.length,100)
  for(const e of officialBatch){
    assert.ok(!ids.has(e.id),e.id);ids.add(e.id)
    assert.ok(e.summary.length>60&&e.summary.length<400,e.name)
    assert.equal(e.summary_reviewed_at,'2026-09-05')
    for(const url of e.summary_sources)assert.ok(['http:','https:'].includes(new URL(url).protocol))
    for(const f of e.observations){
      assert.equal(f.retrieved_at,'2026-09-05');assert.equal(f.status,'source_checked');assert.equal(f.confidence,'medium')
      assert.ok(Number.isFinite(f.value)&&f.value>0)
    }
  }
})

test('thirteenth batch retains provenance, missingness and verification state',()=>{
  const records=officialBatch.map(e=>({stable_id:e.id,name:e.id.split(':').at(-1),normalized_name:'placeholder',confidence:'medium',verification_status:'candidate',field_provenance:{},source_records:[]}))
  const report=applyOfficialBatch013(records)
  assert.equal(report.researched_profiles,100);assert.equal(report.source_checked_observations,6);assert.equal(report.summary_only_profiles.length,97)
  for(const r of records){
    assert.equal(r.verification_status,'candidate');assert.equal(r.confidence,'medium')
    for(const f of r.mountain_observations){
      const p=r.field_provenance[`mountain.${f.key}`];assert.equal(p.batch,'official-013')
      for(const [key,value] of Object.entries(f))assert.deepEqual(p[key],value)
      assert.ok(r.source_records.some(s=>s.url===f.source))
    }
  }
  assert.throws(()=>applyOfficialBatch013([]),/missing/)
  assert.throws(()=>applyOfficialBatch013(records),/Duplicate mountain field/)
})

test('network, approximate and station scopes remain explicit',()=>{
  const find=id=>officialBatch.find(e=>e.id===(id.includes(':')?id:`wikidata:item:${id}`))
  const fact=(id,key)=>find(id).observations.find(f=>f.key===key)
  assert.equal(fact('Q2839398','base').value,1367);assert.equal(fact('Q2839398','vertical'),undefined)
  assert.equal(fact('Q873234','piste_length').value,760);assert.match(find('Q873234').notes,/Network-wide/)
  assert.equal(fact('openstreetmap:way:893138900','vertical').qualifier,'approximately')
})

test('official name repairs and all summaries reach public cards and guides',async()=>{
  const {records}=JSON.parse(await readFile(new URL('../../public/data/resorts.compact.json',import.meta.url),'utf8'))
  assert.equal(records.length,1400);assert.ok(records.filter(r=>r.ov).length>=803)
  for(const e of officialBatch){
    const matches=records.filter(r=>r.id===e.id);assert.equal(matches.length,1,e.id)
    const r=matches[0];assert.equal(r.ov.text,e.summary);assert.equal(r.ov.reviewed_at,'2026-09-05')
    assert.ok(['medium','high'].includes(r.q));assert.notEqual(r.v,'verified')
    for(const url of e.summary_sources)assert.ok(r.ov.sources.includes(url)&&r.sx.some(s=>s.url===url))
    for(const f of e.observations)assert.deepEqual(r.mf.find(o=>o.key===f.key),f)
  }
  assert.equal(records.find(r=>r.id==='wikidata:item:Q2515208').n,'KitzSki')
  assert.equal(records.find(r=>r.id==='openstreetmap:way:252602840').n,'Chokai Kogen Yashima Ski Area')
  const bristol=records.find(r=>r.id==='powderfiles:verified:bristol-mountain')
  assert.equal(records.filter(r=>r.v==='verified').length,1);assert.equal(bristol.ov.reviewed_at,'2026-08-30')
  assert.equal(bristol.f.vertical_drop_ft,1200);assert.equal(bristol.f.trails,39);assert.equal(bristol.f.skiable_acres,138)
})
