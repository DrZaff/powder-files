import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { officialBatch, applyOfficialBatch017 } from '../official-batch-017.mjs'

test('seventeenth batch contains 100 new structured-source overviews and label repairs',async()=>{
  const previous=(await Promise.all(Array.from({length:16},(_,i)=>import(`../official-batch-${String(i+1).padStart(3,'0')}.mjs`)))).flatMap(m=>m.officialBatch)
  const ids=new Set(previous.map(e=>e.id));assert.equal(officialBatch.length,100)
  for(const e of officialBatch){assert.ok(!ids.has(e.id),e.id);ids.add(e.id);assert.ok(e.summary.length>60&&e.summary.length<400,e.name);assert.equal(e.summary_reviewed_at,'2026-10-03');assert.equal(e.observations.length,0);assert.deepEqual(e.summary_sources,[`https://www.wikidata.org/wiki/${e.id.split(':').at(-1)}`])}
})

test('seventeenth batch repairs labels while preserving candidate state',()=>{
  const records=officialBatch.map(e=>({stable_id:e.id,name:e.id.split(':').at(-1),normalized_name:'placeholder',confidence:'medium',verification_status:'candidate',field_provenance:{},source_records:[{source:'wikidata',record_id:e.id,url:e.summary_sources[0]}]}))
  const report=applyOfficialBatch017(records);assert.equal(report.researched_profiles,100);assert.equal(report.source_checked_observations,0);assert.equal(report.summary_only_profiles.length,100)
  for(const [i,r] of records.entries()){assert.equal(r.name,officialBatch[i].name);assert.notEqual(r.normalized_name,'placeholder');assert.equal(r.verification_status,'candidate');assert.equal(r.confidence,'medium');assert.deepEqual(r.mountain_observations,[]);assert.equal(r.field_provenance.name.note,'Wikidata label repair; identity and stable ID are unchanged.')}
  assert.throws(()=>applyOfficialBatch017([]),/missing/)
})

test('all batch seventeen profiles reach public cards and guides with readable names',async()=>{
  const {records}=JSON.parse(await readFile(new URL('../../public/data/resorts.compact.json',import.meta.url),'utf8'))
  assert.equal(records.length,1411);assert.ok(records.filter(r=>r.ov).length>=1203)
  const resolutions=new Map([['wikidata:item:Q116459866','wikidata:item:Q60726558'],['wikidata:item:Q137052565','wikidata:item:Q3368414'],['wikidata:item:Q30141184','wikidata:item:Q110914605']])
  for(const e of officialBatch){const resolved=resolutions.get(e.id)||e.id;const matches=records.filter(r=>r.id===resolved);assert.equal(matches.length,1,e.id);const r=matches[0];if(resolved===e.id){assert.equal(r.n,e.name);assert.equal(r.ov.text,e.summary);assert.equal(r.ov.reviewed_at,'2026-10-03');assert.equal(r.mf.filter(f=>f.status==='source_checked').length,0)}assert.ok(['medium','high'].includes(r.q));assert.notEqual(r.v,'verified');assert.ok(r.sx.some(s=>s.url===e.summary_sources[0]&&s.name==='wikidata'))}
  const bristol=records.find(r=>r.id==='powderfiles:verified:bristol-mountain');assert.equal(records.filter(r=>r.v==='verified').length,1);assert.equal(bristol.ov.reviewed_at,'2026-08-30');assert.equal(bristol.f.vertical_drop_ft,1200);assert.equal(bristol.f.trails,39);assert.equal(bristol.f.skiable_acres,138)
})
