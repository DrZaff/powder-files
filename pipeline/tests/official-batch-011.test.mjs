import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { officialBatch, applyOfficialBatch011 } from '../official-batch-011.mjs'

test('eleventh batch adds 100 new identities with original source-linked summaries',async()=>{
  const previous=(await Promise.all(Array.from({length:10},(_,i)=>import(`../official-batch-${String(i+1).padStart(3,'0')}.mjs`)))).flatMap(m=>m.officialBatch)
  const ids=new Set(previous.map(e=>e.id))
  assert.equal(officialBatch.length,100)
  for(const e of officialBatch){
    assert.ok(!ids.has(e.id),e.id);ids.add(e.id)
    assert.ok(e.summary.length>60&&e.summary.length<400,e.name)
    assert.equal(e.summary_reviewed_at,'2026-08-31')
    assert.ok(e.summary_sources.length)
    for(const url of e.summary_sources)assert.equal(new URL(url).protocol,'https:')
    for(const f of e.observations){
      assert.equal(f.retrieved_at,'2026-08-31')
      assert.equal(new URL(f.source).protocol,'https:')
      assert.equal(f.status,'source_checked')
      assert.equal(f.confidence,'medium')
      assert.ok(Number.isFinite(f.value)&&f.value>0)
      if(f.qualifier)assert.ok(['~','>','+'].includes(f.qualifier))
    }
  }
})

test('eleventh batch strictly joins identities and retains field provenance without verification promotion',()=>{
  const records=officialBatch.map(e=>({stable_id:e.id,confidence:'medium',verification_status:'candidate',field_provenance:{},source_records:[]}))
  const report=applyOfficialBatch011(records)
  assert.equal(report.researched_profiles,100)
  assert.equal(report.source_checked_observations,211)
  assert.equal(report.summary_only_profiles.length,19)
  for(const r of records){
    assert.equal(r.verification_status,'candidate');assert.equal(r.confidence,'medium')
    for(const f of r.mountain_observations){
      const p=r.field_provenance[`mountain.${f.key}`]
      assert.equal(p.batch,'official-011')
      for(const [key,value] of Object.entries(f))assert.deepEqual(p[key],value)
      assert.ok(r.source_records.some(s=>s.url===f.source))
    }
  }
  assert.throws(()=>applyOfficialBatch011([]),/missing/)
  assert.throws(()=>applyOfficialBatch011(records),/Duplicate mountain field/)
  records[0].confidence='low'
  assert.throws(()=>applyOfficialBatch011(records),/confidence scope/)
})

test('eleventh batch preserves sector, course, operating and historical scope',()=>{
  const entry=id=>officialBatch.find(e=>e.id===`wikidata:item:${id}`)
  const fact=(id,key)=>entry(id).observations.find(f=>f.key===key)
  assert.equal(fact('Q60986831','vertical').value,260)
  assert.equal(fact('Q60986764','named_run_length').value,4000)
  assert.equal(fact('Q60986764','longest_run'),undefined)
  assert.equal(fact('Q11445605','vertical'),undefined)
  assert.equal(fact('Q11445605','named_run_vertical').value,115)
  assert.equal(fact('Q10298014','lifts'),undefined)
  assert.ok(entry('Q10298014').summary_sources.includes('https://skihomewood.com/'))
  assert.equal(fact('Q11404621','trails'),undefined)
  assert.match(entry('Q11404621').summary,/closed/)
  assert.equal(fact('Q111212130','trails').value,9)
  assert.equal(fact('Q6159000','piste_length').value,22.5)
  assert.equal(fact('Q30158143','piste_length').value,89)
  assert.equal(fact('Q85973438','area'),undefined)
  assert.equal(fact('Q11901276','lifts'),undefined)
  assert.equal(fact('Q485409','trails'),undefined)
  assert.equal(fact('Q47968092','named_run_length').source_published_at,'2020-01-01')
  assert.equal(fact('Q1003394','piste_length').source_period,'2024 sustainability report')
  assert.equal(fact('Q11677134','lifts').source_period,'2025–26')
  assert.equal(fact('Q56401426','vertical').qualifier,'~')
  assert.equal(fact('Q101807431','base'),undefined)
  assert.equal(fact('Q101807431','village_elevation').value,2100)
})

test('all 100 eleventh-batch summaries and facts reach cards and guides; Bristol is unchanged',async()=>{
  const {records}=JSON.parse(await readFile(new URL('../../public/data/resorts.compact.json',import.meta.url),'utf8'))
  assert.equal(records.length,1400)
  assert.ok(records.filter(r=>r.ov).length>=603)
  const countries={}
  for(const e of officialBatch){
    const matches=records.filter(r=>r.id===e.id)
    assert.equal(matches.length,1,e.id)
    const r=matches[0]
    assert.equal(r.ov.text,e.summary);assert.equal(r.ov.reviewed_at,'2026-08-31')
    assert.ok(['medium','high'].includes(r.q));assert.notEqual(r.v,'verified')
    countries[r.c]=(countries[r.c]||0)+1
    for(const url of e.summary_sources)assert.ok(r.ov.sources.includes(url)&&r.sx.some(s=>s.url===url))
    for(const f of e.observations)assert.deepEqual(r.mf.find(o=>o.key===f.key),f)
  }
  assert.deepEqual(countries,{Japan:54,Sweden:1,Austria:10,Spain:2,'United States':5,Slovenia:1,'Bosnia and Herzegovina':1,Serbia:1,Bulgaria:1,Greece:2,'South Korea':4,France:9,Liechtenstein:1,Switzerland:1,Finland:2,Croatia:1,Kazakhstan:2,Ukraine:1,Germany:1})
  const bristol=records.find(r=>r.id==='powderfiles:verified:bristol-mountain')
  assert.equal(records.filter(r=>r.v==='verified').length,1)
  assert.equal(bristol.ov.reviewed_at,'2026-08-30')
  assert.equal(bristol.f.vertical_drop_ft,1200);assert.equal(bristol.f.trails,39);assert.equal(bristol.f.skiable_acres,138)
})
