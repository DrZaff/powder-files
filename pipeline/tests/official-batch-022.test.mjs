import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const records=JSON.parse(await readFile(new URL('../../public/data/resorts.compact.json',import.meta.url),'utf8')).records

test('twenty-second batch adds scoped current facts to four profiles',()=>{
  const aillons=records.find(r=>r.id==='wikidata:item:Q3230435'),semnoz=records.find(r=>r.id==='wikidata:item:Q130260373'),val=records.find(r=>r.id==='wikidata:item:Q207589'),berger=records.find(r=>r.id==='wikidata:item:Q46995824')
  assert.equal(aillons.mf.find(f=>f.key==='lifts').value,10)
  assert.equal(semnoz.mf.find(f=>f.key==='trails').status,'conflict')
  assert.equal(semnoz.mf.find(f=>f.key==='piste_length').value,15)
  assert.equal(val.mf.find(f=>f.key==='trails').note.includes('Combined'),true)
  assert.equal(val.mf.find(f=>f.key==='summit').qualifier,'more_than')
  assert.equal(berger.mf.find(f=>f.key==='operating_season').source_period,'2026–27')
})

test('twenty-second batch report and provenance are complete',async()=>{
  const report=JSON.parse(await readFile(new URL('../generated/official-batch-022-report.json',import.meta.url),'utf8'))
  assert.deepEqual(report,{reviewed_at:'2026-10-04',profiles:4,observations:18})
  for(const id of ['wikidata:item:Q3230435','wikidata:item:Q130260373','wikidata:item:Q207589','wikidata:item:Q46995824']){const profile=records.find(r=>r.id===id);for(const fact of profile.mf.filter(x=>x.retrieved_at==='2026-10-04')){assert.match(fact.source,/^https:\/\//);assert.ok(fact.note!==undefined)}}
})
