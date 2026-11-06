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
]

test('batch 028 groups 1–3 publish all thirteen included identities exactly once',()=>{
  for(const id of included){
    assert.equal(canonical.filter(record=>record.stable_id===id).length,1,id)
    assert.equal(publicData.records.filter(record=>record.id===id).length,1,id)
    assert.equal(ambiguities.some(item=>item.record_id===id||item.candidate_matches.some(match=>match.record_id===id)),false,id)
  }
})

test('group 3 keeps review-only NZSki identities out of public results',()=>{
  for(const id of ['openstreetmap:way:482928475','openstreetmap:way:482928468']){
    const record=canonical.find(candidate=>candidate.stable_id===id)
    assert.ok(record,id);assert.equal(record.confidence,'low');assert.equal(record.verification_status,'uncertain')
    assert.equal(record.overview,undefined);assert.equal(record.mountain_observations?.length||0,0)
    assert.equal(publicData.records.some(candidate=>candidate.id===id),false)
  }
  const coronet=canonical.find(record=>record.stable_id==='openstreetmap:way:482928475')
  assert.ok(coronet.source_records.some(source=>source.record_id==='relation/6451819'))
  assert.ok(coronet.source_records.every(source=>!['Q2997639','Q125722238','Q136984149'].includes(source.record_id)))
})

test('group 3 preserves elevation meanings and excludes derived figures',()=>{
  const treble=publicData.records.find(record=>record.id==='wikidata:item:Q7837389')
  const portillo=publicData.records.find(record=>record.id==='wikidata:item:Q167843')
  const valle=publicData.records.find(record=>record.id==='wikidata:item:Q3051592')
  assert.equal(treble.mf.find(fact=>fact.key==='skiing_elevation').scope,'lift_served')
  assert.equal(treble.mf.some(fact=>fact.key==='vertical'||fact.key==='terrain_area'),false)
  assert.equal(portillo.mf.find(fact=>fact.key==='summit').scope,'local_resort')
  assert.equal(portillo.mf.find(fact=>fact.key==='base_area_elevation').value,2800)
  assert.equal(portillo.mf.some(fact=>fact.key==='vertical'||fact.key==='skiing_elevation'),false)
  assert.equal(valle.mf.find(fact=>fact.key==='development_elevation').scope,'other')
  assert.equal(valle.mf.find(fact=>fact.key==='development_elevation').confidence,'low')
  assert.equal(valle.mf.find(fact=>fact.key==='development_elevation').unit,'ft')
  assert.equal(valle.mf.find(fact=>fact.key==='opening_year').value,'1988')
  assert.equal(valle.mf.some(fact=>fact.key==='lifts'||fact.key==='vertical'||fact.key==='base'||fact.key==='summit'),false)
})

test('group 3 keeps neighbouring resort identities separate',()=>{
  for(const id of ['wikidata:item:Q5038784','wikidata:item:Q6464300','wikidata:item:Q5821498'])assert.equal(publicData.records.filter(record=>record.id===id).length,1,id)
  const treble=canonical.find(record=>record.stable_id==='wikidata:item:Q7837389')
  assert.ok(treble.source_records.every(source=>!['Q31658865','Q31660242','Q5038784'].includes(source.record_id)))
  const valle=canonical.find(record=>record.stable_id==='wikidata:item:Q3051592')
  assert.ok(valle.source_records.every(source=>!['Q6464300','Q5821498'].includes(source.record_id)))
})

test('group 3 operating evidence remains provenance-only',()=>{
  for(const id of included.slice(-3)){
    const record=canonical.find(candidate=>candidate.stable_id===id)
    assert.equal(record.operating_status,'unknown')
    assert.equal(record.field_provenance.operating_status_research.value,'seasonal')
    assert.equal(record.field_provenance.operating_status_research.displayed_value_unchanged,'unknown')
  }
})

test('group 3 report records three profiles and fourteen observations',async()=>{
  const report=JSON.parse(await readFile(new URL('../generated/official-batch-028-group-3-report.json',import.meta.url),'utf8'))
  assert.deepEqual(report,{reviewed_at:'2026-11-06',group:3,profiles:3,observations:14,operating_status_display_changes:0})
})
