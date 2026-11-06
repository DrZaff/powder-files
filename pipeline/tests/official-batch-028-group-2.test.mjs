import test from 'node:test'
import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'

const canonical=JSON.parse(await readFile(new URL('../generated/canonical-resorts.json',import.meta.url),'utf8'))
const publicData=JSON.parse(await readFile(new URL('../../public/data/resorts.compact.json',import.meta.url),'utf8'))
const ambiguities=JSON.parse(await readFile(new URL('../generated/ambiguities.json',import.meta.url),'utf8'))
const group1=['wikidata:item:Q1548153','wikidata:item:Q4251293','wikidata:item:Q109412412','wikidata:item:Q1547750','openstreetmap:way:866496711']
const group2=['wikidata:item:Q1231413','wikidata:item:Q2255843','wikidata:item:Q60777517','wikidata:item:Q111983623','wikidata:item:Q6919901']

test('batch 028 groups 1 and 2 publish all ten identities exactly once without ambiguity',()=>{
  for(const id of [...group1,...group2]){
    assert.equal(canonical.filter(record=>record.stable_id===id).length,1,id)
    assert.equal(publicData.records.filter(record=>record.id===id).length,1,id)
    assert.equal(ambiguities.some(item=>item.record_id===id||item.candidate_matches.some(match=>match.record_id===id)),false,id)
  }
})

test('group 2 identity merges retain reviewed OSM coordinates',()=>{
  const expected=new Map([
    ['wikidata:item:Q1231413',[47.087351,-70.92582]],['wikidata:item:Q2255843',[48.378148,-116.618143]],['wikidata:item:Q60777517',[-36.493357,148.295149]],['wikidata:item:Q111983623',[-36.868416,147.275143]],['wikidata:item:Q6919901',[-37.148474,146.439377]],
  ])
  for(const [id,coordinates] of expected)assert.deepEqual(publicData.records.find(record=>record.id===id).p,coordinates,id)
  assert.equal(canonical.find(record=>record.stable_id==='wikidata:item:Q6919901').official_website,'https://www.mtbuller.com.au')
})

test('group 2 applies conservative fact scopes and conflict handling',()=>{
  const msa=publicData.records.find(record=>record.id==='wikidata:item:Q1231413')
  const schweitzer=publicData.records.find(record=>record.id==='wikidata:item:Q2255843')
  const thredbo=publicData.records.find(record=>record.id==='wikidata:item:Q60777517')
  const falls=publicData.records.find(record=>record.id==='wikidata:item:Q111983623')
  const buller=publicData.records.find(record=>record.id==='wikidata:item:Q6919901')
  assert.equal(msa.mf.find(fact=>fact.key==='snowmaking_area').value,137.5)
  assert.equal(msa.mf.some(fact=>fact.value===80&&fact.unit==='%'),false)
  assert.equal(msa.mf.find(fact=>fact.key==='terrain_area').value,221.5)
  assert.equal(schweitzer.mf.find(fact=>fact.key==='skiing_elevation').scope,'local_resort')
  assert.equal(schweitzer.mf.find(fact=>fact.key==='skiing_elevation').confidence,'medium')
  assert.equal(thredbo.mf.find(fact=>fact.key==='skiing_elevation').scope,'lift_served')
  assert.equal(thredbo.mf.find(fact=>fact.key==='elevation_range').scope,'other')
  assert.equal(thredbo.mf.find(fact=>fact.key==='elevation_range').confidence,'low')
  assert.equal(thredbo.mf.some(fact=>fact.key==='vertical'||fact.key==='base'),false)
  assert.ok(falls.x.includes('public_authority'))
  assert.equal(falls.mf.some(fact=>fact.key==='night_skiing'),false)
  assert.equal(buller.mf.find(fact=>fact.key==='terrain_area').qualifier,'more_than')
  assert.match(buller.mf.find(fact=>fact.key==='lifts').note,/carpets/i)
})

test('group 2 stores operating evidence without changing displayed status',()=>{
  for(const id of group2){
    const record=canonical.find(candidate=>candidate.stable_id===id)
    assert.equal(record.operating_status,'unknown')
    assert.equal(record.field_provenance.operating_status_research.displayed_value_unchanged,'unknown')
  }
  assert.equal(canonical.find(record=>record.stable_id==='wikidata:item:Q1231413').field_provenance.operating_status_research.value,'uncertain')
  for(const id of group2.slice(1))assert.equal(canonical.find(record=>record.stable_id===id).field_provenance.operating_status_research.value,'seasonal')
})

test('group 2 report records all profiles and observations',async()=>{
  const report=JSON.parse(await readFile(new URL('../generated/official-batch-028-group-2-report.json',import.meta.url),'utf8'))
  assert.deepEqual(report,{reviewed_at:'2026-11-06',group:2,profiles:5,observations:40,documented_conflicts:2,operating_status_display_changes:0})
})
