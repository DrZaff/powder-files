import test from 'node:test';import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises'
const directory=JSON.parse(await readFile(new URL('../../public/data/resorts.compact.json',import.meta.url),'utf8')),records=directory.records

test('Vail and Breckenridge are visible as resolved, source-linked profiles',()=>{
  for(const id of ['wikidata:item:Q14685139','wikidata:item:Q12053500']){const x=records.find(r=>r.id===id);assert.ok(x);assert.equal(x.q,'high');assert.equal(x.v,'candidate');assert.ok(x.ov?.text);assert.ok(x.sx.some(s=>s.name==='official_resort'))}
})

test('batch 024 preserves official mountain facts and report totals',async()=>{
  const vail=records.find(r=>r.id==='wikidata:item:Q14685139'),breck=records.find(r=>r.id==='wikidata:item:Q12053500')
  assert.equal(vail.mf.find(f=>f.key==='terrain_area').value,5317);assert.equal(vail.mf.find(f=>f.key==='trails').value,278)
  assert.equal(breck.mf.find(f=>f.key==='terrain_area').value,2908);assert.equal(breck.mf.find(f=>f.key==='trails').value,187)
  const report=JSON.parse(await readFile(new URL('../generated/official-batch-024-report.json',import.meta.url),'utf8'));assert.deepEqual(report,{reviewed_at:'2026-10-04',profiles:2,observations:16})
})
