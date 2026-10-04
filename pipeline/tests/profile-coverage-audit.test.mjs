import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { auditProfile, buildProfileCoverageAudit } from '../lib/profile-coverage-audit.mjs'

const record=(extra={})=>({stable_id:'test:resort',name:'Test Mountain',country:'Canada',verification_status:'candidate',confidence:'medium',coordinates:{latitude:50,longitude:-120},official_website:'https://example.test',source_records:[{source:'wikidata'},{source:'openstreetmap'}],mountain_observations:[],...extra})

test('profile audit distinguishes official values, structured values and conflicts',()=>{
  const result=auditProfile(record({mountain_observations:[
    {key:'vertical',value:500,unit:'m',status:'source_checked',source:'https://example.test/stats',retrieved_at:'2026-09-01'},
    {key:'mapped_elevation',value:1200,unit:'m',status:'structured_source',source:'https://www.wikidata.org/wiki/Q1',retrieved_at:'2026-09-01'},
    {key:'trails',value:null,status:'conflict',source:'https://example.test/map',retrieved_at:'2026-09-01'},
  ]}),'2026-10-03')
  assert.equal(result.facts.vertical.source_checked,true)
  assert.deepEqual(result.conflicts,['trails'])
  assert.ok(result.missing_core_fields.includes('trails'))
  assert.equal(result.official_fact_count,1)
})

test('profile audit flags stale facts and prioritizes sparse profiles',()=>{
  const sparse=auditProfile(record({official_website:null,overview:null,mountain_observations:[{key:'vertical',value:300,status:'source_checked',source:'https://example.test',retrieved_at:'2024-01-01'}]}),'2026-10-03')
  assert.deepEqual(sparse.stale_fields,['vertical'])
  assert.ok(['critical','high'].includes(sparse.priority))
  assert.equal(sparse.recommended_sources[0].type,'official_site_discovery')
})

test('generated audit covers every public profile and preserves Bristol',async()=>{
  const records=JSON.parse(await readFile(new URL('../generated/canonical-resorts.json',import.meta.url),'utf8'))
  const audit=buildProfileCoverageAudit(records,'2026-10-03')
  assert.equal(audit.summary.profiles,1400)
  assert.equal(audit.summary.unique_stable_ids,1400)
  assert.equal(audit.summary.with_overview,1336)
  assert.ok(audit.profiles.find(p=>p.id==='powderfiles:verified:bristol-mountain'))
  assert.equal(audit.summary.profiles,Object.values(audit.summary.priorities).reduce((a,b)=>a+b,0))
  assert.equal(audit.summary.possible_duplicate_profiles,audit.profiles.filter(p=>p.possible_duplicate_ids.length).length)
})

test('same-name records are flagged for identity review rather than merged',()=>{
  const audit=buildProfileCoverageAudit([record(),record({stable_id:'test:other',coordinates:{latitude:51,longitude:-121}})],'2026-10-03')
  assert.equal(audit.summary.possible_duplicate_groups,1)
  assert.equal(audit.profiles[0].possible_duplicate_ids.length,1)
})
