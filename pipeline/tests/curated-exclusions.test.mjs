import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { curatedExclusions, applyCuratedExclusions } from '../curated-exclusions.mjs'

test('curated exclusions have unique stable IDs, evidence and approved reasons',()=>{
  assert.equal(curatedExclusions.length,112)
  assert.equal(new Set(curatedExclusions.map(e=>e.id)).size,112)
  const reasons=new Set(['closed_or_disused','nordic_only','private_club','indoor_slope','lift_free_or_non_resort'])
  for(const e of curatedExclusions){assert.ok(reasons.has(e.reason));assert.equal(new URL(e.source_url).protocol,'https:');assert.ok(e.name.length>2)}
})

test('curated exclusion pass removes records and retains provenance',()=>{
  const records=curatedExclusions.map(e=>({stable_id:e.id,name:e.name,source_records:[{source:e.id.startsWith('wikidata:')?'wikidata':'openstreetmap',record_id:e.id,url:e.source_url}]}))
  const exclusions=[];const report=applyCuratedExclusions(records,exclusions)
  assert.equal(records.length,0);assert.equal(report.removed,112);assert.equal(report.unique_ids,112);assert.equal(exclusions.length,112)
  for(const e of exclusions){assert.equal(e.curated,true);assert.ok(e.source_records.length);assert.equal(new URL(e.evidence_url).protocol,'https:')}
})

test('curated exclusions do not appear in the public directory',async()=>{
  const {records}=JSON.parse(await readFile(new URL('../../public/data/resorts.compact.json',import.meta.url),'utf8'))
  const publicIds=new Set(records.map(r=>r.id));for(const e of curatedExclusions)assert.ok(!publicIds.has(e.id),e.id)
  assert.equal(records.length,1400);assert.equal(records.filter(r=>r.ov).length,1336)
  const bristol=records.find(r=>r.id==='powderfiles:verified:bristol-mountain');assert.ok(bristol);assert.equal(bristol.v,'verified')
})
