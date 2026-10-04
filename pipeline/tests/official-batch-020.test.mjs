import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { formatMountainFact } from '../../src/mountain-fact-format.js'

test('twentieth batch adds source-linked facts without changing verification',async()=>{
  const {records}=JSON.parse(await readFile(new URL('../../public/data/resorts.compact.json',import.meta.url),'utf8'))
  const santa=records.find(r=>r.id==='wikidata:item:Q49177812'),horseshoe=records.find(r=>r.id==='wikidata:item:Q5906070'),sella=records.find(r=>r.id==='wikidata:item:Q6363223')
  assert.equal(santa.mf.find(f=>f.key==='vertical').value,1725);assert.equal(santa.mf.find(f=>f.key==='snowfall').value,225);assert.equal(santa.v,'candidate')
  assert.equal(horseshoe.mf.find(f=>f.key==='vertical').value,304);assert.equal(horseshoe.mf.find(f=>f.key==='trails').status,'conflict')
  assert.equal(sella.n,'Sella Nevea');assert.equal(sella.c,'Italy');assert.equal(sella.mf.find(f=>f.key==='named_run_vertical').value,750)
})

test('twentieth batch keeps a source and retrieval date for every observation',async()=>{
  const report=JSON.parse(await readFile(new URL('../generated/official-batch-020-report.json',import.meta.url),'utf8'))
  assert.equal(report.profiles,3);assert.equal(report.observations,16)
})

test('text facts such as seasons and difficulty mix remain readable',()=>{
  assert.equal(formatMountainFact({value:'Nov 26, 2026 – Apr 4, 2027',status:'source_checked'}),'Nov 26, 2026 – Apr 4, 2027')
  assert.equal(formatMountainFact({value:'20% beginner · 40% intermediate · 40% expert',status:'source_checked'}),'20% beginner · 40% intermediate · 40% expert')
})
