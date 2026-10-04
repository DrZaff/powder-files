import test from 'node:test'
import assert from 'node:assert/strict'
import { classifyCandidate } from '../lib/classify.mjs'

const base={name:'Example Mountain',alternate_names:[],source_records:[{source:'openstreetmap'}],rawTags:{landuse:'winter_sports'}}
test('includes a named downhill winter-sports area as a candidate',()=>{assert.equal(classifyCandidate(base).included,true)})
test('excludes indoor slopes',()=>{assert.deepEqual(classifyCandidate({...base,rawTags:{indoor:'yes'}}).reason,'indoor_slope')})
test('excludes private clubs',()=>{assert.equal(classifyCandidate({...base,rawTags:{access:'private'}}).reason,'private_club')})
test('excludes Nordic-only records',()=>{const record={...base,name:'Nordic Center',source_records:[{source:'openstreetmap'}],rawTags:{sport:'cross_country'}};assert.equal(classifyCandidate(record).reason,'nordic_only')})
test('does not let generic winter-sports landuse override Nordic-only evidence',()=>{const record={...base,name:'Valley Nordic',source_records:[{source:'openstreetmap'}],rawTags:{landuse:'winter_sports',sport:'cross_country'}};assert.equal(classifyCandidate(record).reason,'nordic_only')})
test('excludes closed records',()=>{assert.equal(classifyCandidate({...base,rawTags:{abandoned:'yes'}}).reason,'closed_or_disused')})
