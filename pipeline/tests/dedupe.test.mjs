import test from 'node:test'
import assert from 'node:assert/strict'
import { collapseStableIds, deduplicate } from '../lib/dedupe.mjs'

function record(id,name,lat,lon,source='openstreetmap'){return {stable_id:id,name,normalized_name:name.toLowerCase(),alternate_names:[],country:'United States',coordinates:{latitude:lat,longitude:lon},source_records:[{source,record_id:id}],field_provenance:{name:{value:name,source_record_ids:[id],confidence:'high'},coordinates:{value:{latitude:lat,longitude:lon},source_record_ids:[id],confidence:'high'},country:{value:'United States',source_record_ids:[id],confidence:'high'}}}}
test('merges exact-name records within the strong distance threshold',()=>{const result=deduplicate([record('osm:1','Example Peak',40,-75),record('wd:1','Example Peak',40.01,-75,'wikidata')]);assert.equal(result.canonical.length,1);assert.equal(result.canonical[0].source_records.length,2);assert.equal(result.ambiguities.length,0)})
test('queues a nearby fuzzy match rather than guessing',()=>{const result=deduplicate([record('a','Mountain Ridge',40,-75),record('b','Mountain Ridge Resort',40.04,-75)]);assert.equal(result.canonical.length,2);assert.equal(result.ambiguities.length,1)})
test('does not merge same-name resorts far apart',()=>{const result=deduplicate([record('a','Summit Hill',40,-75),record('b','Summit Hill',43,-75)]);assert.equal(result.canonical.length,2)})
test('keeps a verified local profile as canonical when its known alias matches a source record',()=>{const verified={...record('local','Bristol Mountain',42.7456,-77.4044,'powderfiles'),alternate_names:['Bristol Mountain Ski Resort'],verification_status:'verified'};const sourced={...record('wd','Bristol Mountain Ski Resort',42.745,-77.404444,'wikidata'),verification_status:'candidate'};const result=deduplicate([sourced,verified]);assert.equal(result.canonical.length,1);assert.equal(result.canonical[0].stable_id,'local');assert.equal(result.canonical[0].source_records.length,2)})

test('collapses repeated source IDs before ambiguity matching and retains coordinate alternatives',()=>{
  const first=record('wikidata:item:Q1','Example Peak',40,-75,'wikidata'),second=record('wikidata:item:Q1','Example Peak',40.02,-75,'wikidata')
  first.region='First region';second.region='Second region'
  const result=collapseStableIds([first,second],{coordinateOverrides:{'wikidata:item:Q1':{coordinates:{latitude:40.02,longitude:-75},reviewed_at:'2026-11-06',note:'Reviewed ski-area point.'}}})
  assert.equal(result.records.length,1);assert.equal(result.report.removed_repeated_rows,1);assert.equal(result.report.repeated_stable_ids,1)
  assert.deepEqual(result.records[0].coordinates,{latitude:40.02,longitude:-75});assert.equal(result.records[0].source_row_resolution.coordinate_candidates.length,2)
  assert.equal(deduplicate(result.records).ambiguities.length,0)
})
