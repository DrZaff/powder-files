import test from 'node:test'
import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'

const canonical=JSON.parse(await readFile(new URL('../generated/canonical-resorts.json',import.meta.url),'utf8'))
const publicData=JSON.parse(await readFile(new URL('../../public/data/resorts.compact.json',import.meta.url),'utf8'))
const ambiguities=JSON.parse(await readFile(new URL('../generated/ambiguities.json',import.meta.url),'utf8'))
const included=[
  'wikidata:item:Q1548153','wikidata:item:Q4251293','wikidata:item:Q109412412','wikidata:item:Q1547750','openstreetmap:way:866496711',
  'wikidata:item:Q1231413','wikidata:item:Q2255843','wikidata:item:Q60777517','wikidata:item:Q111983623','wikidata:item:Q6919901',
  'wikidata:item:Q7837389','wikidata:item:Q167843','wikidata:item:Q3051592',
  'wikidata:item:Q214364','wikidata:item:Q974478','wikidata:item:Q530721','openstreetmap:way:599441663','wikidata:item:Q138779655',
]

test('batch 028 groups 1–4 publish all eighteen included identities exactly once',()=>{
  for(const id of included){
    assert.equal(canonical.filter(record=>record.stable_id===id).length,1,id)
    assert.equal(publicData.records.filter(record=>record.id===id).length,1,id)
    assert.equal(ambiguities.some(item=>item.record_id===id||item.candidate_matches.some(match=>match.record_id===id)),false,id)
  }
})

test('group 4 preserves linked village and sector profiles',()=>{
  for(const id of ['wikidata:item:Q1388437','wikidata:item:Q30158101','wikidata:item:Q2871914','wikidata:item:Q844641','wikidata:item:Q99437634']){
    assert.equal(canonical.filter(record=>record.stable_id===id).length,1,id)
    assert.equal(publicData.records.filter(record=>record.id===id).length,1,id)
  }
})

test('group 4 retains conservative scope and conflict handling',()=>{
  const alpe=publicData.records.find(record=>record.id==='wikidata:item:Q214364')
  const deux=publicData.records.find(record=>record.id==='wikidata:item:Q974478')
  const clusaz=publicData.records.find(record=>record.id==='wikidata:item:Q530721')
  const laaxRecord=publicData.records.find(record=>record.id==='openstreetmap:way:599441663')
  const cransRecord=publicData.records.find(record=>record.id==='wikidata:item:Q138779655')
  assert.equal(alpe.mf.find(fact=>fact.key==='piste_length').scope,'linked_domain')
  assert.equal(alpe.mf.find(fact=>fact.key==='skiing_elevation').scope,'lift_served')
  assert.equal(alpe.mf.find(fact=>fact.key==='named_run_vertical').value,1350)
  assert.equal(alpe.mf.some(fact=>fact.key==='vertical'),false)
  assert.equal(deux.mf.find(fact=>fact.key==='vertical').value,2300)
  assert.equal(deux.mf.some(fact=>['trails','difficulty_mix','terrain_area'].includes(fact.key)),false)
  assert.equal(clusaz.mf.find(fact=>fact.key==='vertical').qualifier,'more_than')
  assert.match(clusaz.mf.find(fact=>fact.key==='piste_length').note,/middle of each piste/i)
  assert.equal(laaxRecord.mf.find(fact=>fact.key==='skiing_elevation').confidence,'medium')
  assert.equal(laaxRecord.mf.some(fact=>fact.key==='vertical'),false)
  assert.equal(cransRecord.mf.find(fact=>fact.key==='base').qualifier,'approximately')
  assert.equal(cransRecord.mf.find(fact=>fact.key==='skiing_elevation').qualifier,'approximately')
})

test('group 4 excludes unrelated identities from merged source records',()=>{
  const deux=canonical.find(record=>record.stable_id==='wikidata:item:Q974478')
  assert.ok(deux.source_records.every(source=>!['relation/15014025','relation/15014181'].includes(source.record_id)))
  const alpe=canonical.find(record=>record.stable_id==='wikidata:item:Q214364')
  assert.ok(alpe.source_records.every(source=>!['Q1388437','Q30158101','Q2871914'].includes(source.record_id)))
})

test('group 4 operating evidence remains provenance-only',()=>{
  for(const id of included.slice(-5)){
    const record=canonical.find(candidate=>candidate.stable_id===id)
    assert.equal(record.operating_status,'unknown')
    assert.equal(record.field_provenance.operating_status_research.value,'seasonal')
    assert.equal(record.field_provenance.operating_status_research.displayed_value_unchanged,'unknown')
  }
})

test('group 4 report records five profiles and thirty-two observations',async()=>{
  const report=JSON.parse(await readFile(new URL('../generated/official-batch-028-group-4-report.json',import.meta.url),'utf8'))
  assert.deepEqual(report,{reviewed_at:'2026-11-06',group:4,profiles:5,observations:32,operating_status_display_changes:0})
})
