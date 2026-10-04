import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const load=async()=>JSON.parse(await readFile(new URL('../../public/data/resorts.compact.json',import.meta.url),'utf8')).records

test('twenty-first batch retains official facts and a documented source conflict',async()=>{
  const records=await load(),berkshire=records.find(r=>r.id==='wikidata:item:Q4892259'),buck=records.find(r=>r.id==='wikidata:item:Q4982867')
  assert.equal(berkshire.mf.find(f=>f.key==='vertical').value,1180)
  assert.equal(berkshire.mf.find(f=>f.key==='lifts').status,'conflict')
  assert.deepEqual(berkshire.mf.find(f=>f.key==='lifts').alternatives.map(x=>x.value),[5,6])
  assert.equal(buck.mf.find(f=>f.key==='trails').value,15)
  assert.equal(buck.mf.find(f=>f.key==='lifts').note.includes('snow-tubing'),true)
})

test('twenty-first batch covers six profiles with source-linked observations',async()=>{
  const records=await load(),ids=['wikidata:item:Q4892259','wikidata:item:Q4944773','wikidata:item:Q4982867','wikidata:item:Q16890068','wikidata:item:Q5018299','wikidata:item:Q257350']
  for(const id of ids){const profile=records.find(r=>r.id===id);assert.ok(profile);assert.ok(profile.mf.length);for(const observation of profile.mf.filter(x=>x.retrieved_at==='2026-10-04'))assert.match(observation.source,/^https:\/\//)}
  const report=JSON.parse(await readFile(new URL('../generated/official-batch-021-report.json',import.meta.url),'utf8'))
  assert.deepEqual(report,{reviewed_at:'2026-10-04',profiles:6,observations:22})
})

test('Hoch-Ybrig installation facts do not overstate resort vertical or summit',async()=>{
  const records=await load(),profile=records.find(r=>r.id==='wikidata:item:Q257350')
  assert.equal(profile.mf.find(f=>f.key==='highest_lift_station').value,1831)
  assert.equal(profile.mf.some(f=>f.key==='vertical'),false)
  assert.equal(profile.mf.some(f=>f.key==='summit'),false)
})
