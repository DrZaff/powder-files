import test from 'node:test'
import assert from 'node:assert/strict'
import {findFact,isComparable,normalizeCompareIds,scopeLabel} from '../../src/data/comparison.js'

test('comparison selection is unique and capped at four resorts',()=>{
  assert.deepEqual(normalizeCompareIds(['a','b','a','c','d','e']),['a','b','c','d'])
})

test('comparison finds only explicitly mapped source facts',()=>{
  const resort={mf:[{key:'terrain_area',value:100},{key:'summit',value:2000}]}
  assert.equal(findFact(resort,{keys:['terrain_area','area']}).value,100)
  assert.equal(findFact(resort,{keys:['vertical']}),null)
})

test('comparison refuses to rank different scopes, measures, units or disputes',()=>{
  const local={label:'Skiable terrain',unit:'acres',scope:'local_resort',status:'source_checked'}
  assert.equal(isComparable([local,{...local}]),true)
  assert.equal(isComparable([local,{...local,scope:'linked_domain'}]),false)
  assert.equal(isComparable([local,{...local,label:'Patrolled terrain'}]),false)
  assert.equal(isComparable([local,{...local,unit:'ha'}]),false)
  assert.equal(isComparable([local,{...local,status:'conflict'}]),false)
})

test('comparison exposes plain-language scope labels',()=>{
  assert.equal(scopeLabel('linked_domain'),'Whole domain')
  assert.equal(scopeLabel('named_run'),'Single run')
  assert.equal(scopeLabel('local_resort'),null)
})
