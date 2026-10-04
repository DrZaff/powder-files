import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { officialBatch, applyOfficialBatch019 } from '../official-batch-019.mjs'

test('nineteenth batch contains 34 screened structured-source overviews',async()=>{
  const previous=(await Promise.all(Array.from({length:18},(_,i)=>import(`../official-batch-${String(i+1).padStart(3,'0')}.mjs`)))).flatMap(m=>m.officialBatch)
  const ids=new Set(previous.map(e=>e.id));assert.equal(officialBatch.length,34)
  for(const e of officialBatch){assert.ok(!ids.has(e.id),e.id);ids.add(e.id);assert.ok(e.summary.length>60&&e.summary.length<400,e.name);assert.equal(e.summary_reviewed_at,'2026-10-03');assert.equal(e.observations.length,0);assert.equal(new URL(e.summary_sources[0]).protocol,'https:')}
})

test('nineteenth batch preserves candidate state and repairs structured labels',()=>{
  const records=officialBatch.map(e=>({stable_id:e.id,name:e.id.startsWith('wikidata:')?e.id.split(':').at(-1):'old map label',normalized_name:'placeholder',confidence:'medium',verification_status:'candidate',field_provenance:{},source_records:[{source:e.id.startsWith('wikidata:')?'wikidata':'openstreetmap',record_id:e.id,url:e.summary_sources[0]}]}))
  const report=applyOfficialBatch019(records);assert.equal(report.researched_profiles,34);assert.equal(report.source_checked_observations,0);assert.equal(report.summary_only_profiles.length,34)
  for(const [i,r] of records.entries()){assert.equal(r.name,officialBatch[i].name);assert.notEqual(r.normalized_name,'placeholder');assert.equal(r.verification_status,'candidate');assert.equal(r.confidence,'medium');assert.deepEqual(r.mountain_observations,[])}
  assert.throws(()=>applyOfficialBatch019([]),/missing/)
})

test('all batch nineteen profiles reach public cards and guides',async()=>{
  const {records}=JSON.parse(await readFile(new URL('../../public/data/resorts.compact.json',import.meta.url),'utf8'))
  assert.equal(records.length,1400);assert.equal(records.filter(r=>r.ov).length,1336)
  for(const e of officialBatch){const matches=records.filter(r=>r.id===e.id);assert.equal(matches.length,1,e.id);const r=matches[0];assert.ok(!/^Q\d+$/.test(r.n));assert.equal(r.ov.text,e.summary);assert.ok(['medium','high'].includes(r.q));assert.notEqual(r.v,'verified');assert.equal(r.mf.filter(f=>f.status==='source_checked').length,0);assert.ok(r.sx.some(s=>s.url===e.summary_sources[0]))}
  const bristol=records.find(r=>r.id==='powderfiles:verified:bristol-mountain');assert.equal(records.filter(r=>r.v==='verified').length,1);assert.equal(bristol.f.vertical_drop_ft,1200);assert.equal(bristol.f.trails,39);assert.equal(bristol.f.skiable_acres,138)
})
