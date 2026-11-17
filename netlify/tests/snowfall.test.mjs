import test from 'node:test'
import assert from 'node:assert/strict'
import {buildSnowfallLeaderboard,snowfallUrl,summarizeSnowfall} from '../lib/snowfall-leaderboard.mjs'

const resorts=[
  {id:'a',n:'Alpine A',c:'France',r:'Alps',p:[45.123456,6.123456]},
  {id:'b',n:'Basin B',c:'United States',p:[40.5,-111.6]},
]
const response=(snowfall,elevation=2000)=>({elevation,hourly:{snowfall}})

test('Open-Meteo query asks for the completed past 24 hours at precise coordinates',()=>{
  const url=new URL(snowfallUrl(resorts.map(r=>({lat:r.p[0],lon:r.p[1]}))))
  assert.equal(url.searchParams.get('past_hours'),'24')
  assert.equal(url.searchParams.get('forecast_hours'),'1')
  assert.equal(url.searchParams.get('hourly'),'snowfall')
  assert.equal(url.searchParams.get('latitude'),'45.1235,40.5000')
})

test('leaderboard sums only 24 past values and ranks globally',()=>{
  const a=[...Array(24).fill(.3),99],b=[...Array(24).fill(.5),99]
  const out=summarizeSnowfall(resorts,[response(a),response(b)],'2026-11-16T12:00:00Z')
  assert.equal(out.top[0].id,'b')
  assert.equal(out.top[0].snowfall_cm,12)
  assert.equal(out.top[1].snowfall_cm,7.2)
  assert.equal(out.kind,'model_estimate')
})

test('builder omits resorts without coordinates and aligns batched responses',async()=>{
  const input=[...resorts,{id:'c',n:'No point'}]
  const fetchImpl=async()=>new Response(JSON.stringify([response(Array(25).fill(1)),response(Array(25).fill(2))]),{status:200})
  const out=await buildSnowfallLeaderboard({resorts:input,fetchImpl,batchSize:10})
  assert.equal(out.locations_with_coordinates,2)
  assert.equal(out.top[0].snowfall_cm,48)
})
