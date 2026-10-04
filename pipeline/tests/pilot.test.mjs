import test from 'node:test'
import assert from 'node:assert/strict'
import {pilotFacts,applyPilotFacts} from '../pilot-facts.mjs'
test('pilot retains units, dates, source URLs and scope notes',()=>{for(const observations of Object.values(pilotFacts))for(const f of observations){assert.match(f.source,/^https:\/\//);assert.equal(f.retrieved_at,'2026-08-30');assert.ok('unit' in f);assert.ok('note' in f)}})
test('conflicting snowfall values are withheld but both sources retained',()=>{const f=pilotFacts['wikidata:item:Q7620695'].find(f=>f.key==='snowfall');assert.equal(f.value,null);assert.equal(f.status,'conflict');assert.equal(f.alternatives.length,2)})
test('enrichment preserves identity and confidence and adds field provenance',()=>{const records=Object.keys(pilotFacts).map(stable_id=>({stable_id,confidence:'medium',source_records:[],field_provenance:{}}));applyPilotFacts(records);assert.equal(records[0].confidence,'medium');assert.equal(records[0].field_provenance['mountain.vertical'].value,1200);assert.ok(records[0].source_records.length)})
