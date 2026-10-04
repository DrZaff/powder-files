import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { officialBatch, applyOfficialBatch015 } from '../official-batch-015.mjs'

test('fifteenth batch contains exactly 100 new structured-source overviews',async()=>{
  const previous=(await Promise.all(Array.from({length:14},(_,i)=>import(`../official-batch-${String(i+1).padStart(3,'0')}.mjs`)))).flatMap(m=>m.officialBatch)
  const ids=new Set(previous.map(e=>e.id))
  assert.equal(officialBatch.length,100)
  for(const e of officialBatch){
    assert.ok(!ids.has(e.id),e.id);ids.add(e.id)
    assert.ok(e.summary.length>60&&e.summary.length<400,e.name)
    assert.equal(e.summary_reviewed_at,'2026-10-03')
    assert.equal(e.observations.length,0)
    assert.deepEqual(e.summary_sources,[`https://www.wikidata.org/wiki/${e.id.split(':').at(-1)}`])
  }
})

test('fifteenth batch preserves candidate state and records intentional missingness',()=>{
  const records=officialBatch.map(e=>({stable_id:e.id,name:e.name,confidence:'medium',verification_status:'candidate',field_provenance:{},source_records:[{source:'wikidata',record_id:e.id,url:e.summary_sources[0]}]}))
  const report=applyOfficialBatch015(records)
  assert.equal(report.researched_profiles,100);assert.equal(report.source_checked_observations,0);assert.equal(report.summary_only_profiles.length,100)
  for(const r of records){assert.equal(r.verification_status,'candidate');assert.equal(r.confidence,'medium');assert.deepEqual(r.mountain_observations,[])}
  assert.throws(()=>applyOfficialBatch015([]),/missing/)
})

test('all batch fifteen summaries reach public cards and guides with Wikidata provenance',async()=>{
  const {records}=JSON.parse(await readFile(new URL('../../public/data/resorts.compact.json',import.meta.url),'utf8'))
  assert.equal(records.length,1421);assert.ok(records.filter(r=>r.ov).length>=1003)
  for(const e of officialBatch){
    const matches=records.filter(r=>r.id===e.id);assert.equal(matches.length,1,e.id)
    const r=matches[0];assert.equal(r.ov.text,e.summary);assert.equal(r.ov.reviewed_at,'2026-10-03')
    assert.ok(['medium','high'].includes(r.q));assert.notEqual(r.v,'verified');assert.equal(r.mf.filter(f=>f.status==='source_checked').length,0)
    assert.ok(r.ov.sources.includes(e.summary_sources[0]));assert.ok(r.sx.some(s=>s.url===e.summary_sources[0]&&s.name==='wikidata'))
  }
  const bristol=records.find(r=>r.id==='powderfiles:verified:bristol-mountain')
  assert.equal(records.filter(r=>r.v==='verified').length,1);assert.equal(bristol.ov.reviewed_at,'2026-08-30')
  assert.equal(bristol.f.vertical_drop_ft,1200);assert.equal(bristol.f.trails,39);assert.equal(bristol.f.skiable_acres,138)
})
