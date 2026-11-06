import test from 'node:test'
import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'
import {applyCurrentSeasonStatuses} from '../current-season-status.mjs'

const canonical=JSON.parse(await readFile(new URL('../generated/canonical-resorts.json',import.meta.url),'utf8'))
const publicData=JSON.parse(await readFile(new URL('../../public/data/resorts.compact.json',import.meta.url),'utf8'))
const ambiguities=JSON.parse(await readFile(new URL('../generated/ambiguities.json',import.meta.url),'utf8'))
const exclusions=JSON.parse(await readFile(new URL('../generated/exclusions.json',import.meta.url),'utf8'))
const group5=['openstreetmap:way:1362257705','openstreetmap:way:508236935','wikidata:item:Q110811619','wikidata:item:Q1789966','wikidata:item:Q110821425']

test('batch 028 publishes all twenty-three included identities exactly once',()=>{
  const earlier=['wikidata:item:Q1548153','wikidata:item:Q4251293','wikidata:item:Q109412412','wikidata:item:Q1547750','openstreetmap:way:866496711','wikidata:item:Q1231413','wikidata:item:Q2255843','wikidata:item:Q60777517','wikidata:item:Q111983623','wikidata:item:Q6919901','wikidata:item:Q7837389','wikidata:item:Q167843','wikidata:item:Q3051592','wikidata:item:Q214364','wikidata:item:Q974478','wikidata:item:Q530721','openstreetmap:way:599441663','wikidata:item:Q138779655']
  for(const id of [...earlier,...group5]){assert.equal(canonical.filter(r=>r.stable_id===id).length,1,id);assert.equal(publicData.records.filter(r=>r.id===id).length,1,id);assert.equal(ambiguities.some(item=>item.record_id===id||item.candidate_matches.some(match=>match.record_id===id)),false,id)}
})

test('group 5 preserves fact scope and does not invent resort totals',()=>{
  const engelberg=publicData.records.find(r=>r.id===group5[0]),livigno=publicData.records.find(r=>r.id===group5[2]),kronplatz=publicData.records.find(r=>r.id===group5[3]),courmayeur=publicData.records.find(r=>r.id===group5[4])
  assert.equal(engelberg.mf.find(f=>f.key==='named_run_vertical').scope,'named_run')
  assert.equal(engelberg.mf.some(f=>f.key==='vertical'),false)
  assert.equal(livigno.mf.find(f=>f.key==='piste_length').scope,'linked_domain')
  assert.equal(livigno.mf.find(f=>f.key==='piste_length').qualifier,'more_than')
  assert.equal(kronplatz.mf.some(f=>['vertical','base','skiing_elevation','piste_length','lifts','trails'].includes(f.key)),false)
  assert.equal(courmayeur.mf.find(f=>f.key==='slopes_and_offpiste').scope,'other')
  assert.equal(courmayeur.mf.some(f=>f.key==='piste_length'),false)
})

test('group 5 keeps related sectors and excluded facilities unmerged',()=>{
  for(const id of ['wikidata:item:Q992902','wikidata:item:Q3866453','wikidata:item:Q123989949','openstreetmap:way:1018289508','openstreetmap:way:1148964313'])assert.ok(canonical.some(r=>r.stable_id===id)||exclusions.some(r=>r.stable_id===id),id)
})

test('current-season status is sourced and automatically downgrades stale evidence',()=>{
  for(const id of group5){const record=publicData.records.find(r=>r.id===id);assert.ok(record.cs?.source_url,id);assert.equal(record.cs.checked_at,'2026-11-06')}
  const sample=structuredClone(canonical);applyCurrentSeasonStatuses(sample,{today:new Date('2027-01-01T12:00:00Z')});assert.equal(sample.find(r=>r.stable_id==='wikidata:item:Q3051592').current_season_status.state,'not_confirmed')
})

test('group 5 report records five profiles and twenty-seven observations',async()=>{
 const report=JSON.parse(await readFile(new URL('../generated/official-batch-028-group-5-report.json',import.meta.url),'utf8'))
 assert.deepEqual(report,{reviewed_at:'2026-11-06',group:5,profiles:5,observations:27,operating_status_display_changes:0})
})
