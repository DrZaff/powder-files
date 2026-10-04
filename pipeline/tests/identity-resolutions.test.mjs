import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

test('identity cleanup leaves one row per stable ID and no unresolved same-name groups',async()=>{
  const audit=JSON.parse(await readFile(new URL('../generated/profile-coverage-audit.json',import.meta.url),'utf8'))
  assert.equal(audit.summary.profiles,1400);assert.equal(audit.summary.unique_stable_ids,1400)
  assert.equal(audit.summary.repeated_stable_ids,0);assert.equal(audit.summary.possible_duplicate_groups,0)
})

test('identity merges preserve facts, overviews and source provenance',async()=>{
  const records=JSON.parse(await readFile(new URL('../generated/canonical-resorts.json',import.meta.url),'utf8'))
  for(const id of ['wikidata:item:Q110914605','wikidata:item:Q3368414','wikidata:item:Q60726558']){const r=records.find(x=>x.stable_id===id);assert.ok(r);assert.ok(r.overview);assert.ok(r.identity_resolution);assert.ok(r.source_records.length>=2)}
  assert.equal(records.find(r=>r.stable_id==='wikidata:item:Q1624333').name,'Crystal Mountain (Washington)')
  assert.equal(records.find(r=>r.stable_id==='wikidata:item:Q5191297').name,'Crystal Mountain (Michigan)')
})

test('non-resort identities are retained in exclusions, not public results',async()=>{
  const exclusions=JSON.parse(await readFile(new URL('../generated/exclusions.json',import.meta.url),'utf8'))
  for(const id of ['wikidata:item:Q592910','wikidata:item:Q3311533']){const e=exclusions.find(x=>x.stable_id===id);assert.ok(e);assert.equal(e.reason,'lift_free_or_non_resort');assert.ok(e.source_records.length)}
})
