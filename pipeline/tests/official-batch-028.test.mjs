import test from 'node:test'
import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'

const canonical=JSON.parse(await readFile(new URL('../generated/canonical-resorts.json',import.meta.url),'utf8'))
const publicData=JSON.parse(await readFile(new URL('../../public/data/resorts.compact.json',import.meta.url),'utf8'))
const ambiguities=JSON.parse(await readFile(new URL('../generated/ambiguities.json',import.meta.url),'utf8'))
const exclusions=JSON.parse(await readFile(new URL('../generated/exclusions.json',import.meta.url),'utf8'))
const ids=['wikidata:item:Q1548153','wikidata:item:Q4251293','wikidata:item:Q109412412','wikidata:item:Q1547750','openstreetmap:way:866496711']

test('batch 028 group 1 publishes each resort exactly once',()=>{
  for(const id of ids){
    assert.equal(canonical.filter(record=>record.stable_id===id).length,1,id)
    assert.equal(publicData.records.filter(record=>record.id===id).length,1,id)
  }
  assert.equal(new Set(canonical.map(record=>record.stable_id)).size,canonical.length)
  assert.equal(canonical.some(record=>record.stable_id==='openstreetmap:way:1233552673'),false)
  assert.equal(publicData.records.some(record=>record.id==='openstreetmap:way:1233552673'),false)
  assert.equal(exclusions.find(record=>record.stable_id==='openstreetmap:way:1233552673')?.reason,'nordic_only')
})

test('batch 028 retains reviewed elevation and vertical scopes',()=>{
  const heavenly=publicData.records.find(record=>record.id===ids[0])
  const happo=publicData.records.find(record=>record.id===ids[1])
  const taos=publicData.records.find(record=>record.id===ids[2])
  const hood=publicData.records.find(record=>record.id===ids[4])
  for(const record of [heavenly,happo,hood]) assert.equal(record.mf.some(fact=>fact.key==='vertical'),false)
  assert.equal(heavenly.mf.find(fact=>fact.key==='summit').scope,'local_resort')
  assert.equal(happo.mf.find(fact=>fact.key==='skiing_elevation').scope,'lift_served')
  assert.equal(hood.mf.find(fact=>fact.key==='skiing_elevation').scope,'lift_served')
  assert.equal(hood.mf.find(fact=>fact.key==='hike_to_vertical').scope,'hike_to')
  const taosVertical=taos.mf.find(fact=>fact.key==='vertical')
  assert.equal(taosVertical.value,3131)
  assert.equal(taosVertical.unit,'ft')
  assert.equal(taosVertical.scope,'other')
})

test('batch 028 keeps seasonal evidence in provenance without changing display status',()=>{
  for(const id of ids){
    const record=canonical.find(candidate=>candidate.stable_id===id)
    assert.equal(record.operating_status,'unknown')
    assert.equal(record.field_provenance.operating_status_research.value,'seasonal')
    assert.equal(record.field_provenance.operating_status_research.displayed_value_unchanged,'unknown')
  }
})

test('source-row collapse removes self ambiguity and preserves reviewed coordinates',async()=>{
  const report=JSON.parse(await readFile(new URL('../generated/source-row-collapse-report.json',import.meta.url),'utf8'))
  assert.deepEqual({input:report.input_rows,output:report.output_rows,repeated:report.repeated_stable_ids,removed:report.removed_repeated_rows,overrides:report.reviewed_coordinate_overrides},{input:7439,output:7053,repeated:217,removed:386,overrides:8})
  assert.ok(ambiguities.every(item=>item.candidate_matches.every(match=>match.record_id!==item.record_id)))
  assert.equal(ambiguities.some(item=>ids.includes(item.record_id)||item.candidate_matches.some(match=>ids.includes(match.record_id))),false)
  assert.deepEqual(canonical.find(record=>record.stable_id===ids[0]).coordinates,{latitude:38.9353,longitude:-119.94})
  assert.deepEqual(canonical.find(record=>record.stable_id===ids[1]).coordinates,{latitude:36.702077,longitude:137.837133})
})

test('batch 028 report records all observations and documented conflicts',async()=>{
  const report=JSON.parse(await readFile(new URL('../generated/official-batch-028-report.json',import.meta.url),'utf8'))
  assert.deepEqual(report,{reviewed_at:'2026-11-06',profiles:5,observations:45,documented_conflicts:4,operating_status_display_changes:0})
})
