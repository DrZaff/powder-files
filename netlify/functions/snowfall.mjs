import {buildSnowfallLeaderboard} from '../lib/snowfall-leaderboard.mjs'

let cached=null,expiresAt=0
const TTL=45*60*1000
const json=(body,status,headers={})=>new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json; charset=utf-8','X-Content-Type-Options':'nosniff',...headers}})

export default async function handler(request){
  if(request.method!=='GET')return json({error:'Method not allowed'},405,{Allow:'GET'})
  const now=Date.now()
  if(cached&&expiresAt>now)return json({...cached,cache:'hit'},200,cacheHeaders())
  try{
    const origin=new URL(request.url).origin
    const directory=await fetch(`${origin}/data/resorts.compact.json`,{headers:{Accept:'application/json'},signal:AbortSignal.timeout(10000)})
    if(!directory.ok)throw new Error('Resort directory unavailable')
    const data=await directory.json()
    cached=await buildSnowfallLeaderboard({resorts:data.records||[]})
    expiresAt=now+TTL
    return json({...cached,cache:'miss'},200,cacheHeaders())
  }catch(error){
    if(cached)return json({...cached,cache:'stale',stale:true},200,cacheHeaders())
    return json({error:error.message||'Snowfall ranking unavailable'},error.status||502,{'Cache-Control':'no-store'})
  }
}
const cacheHeaders=()=>({'Cache-Control':'public, max-age=300','Netlify-CDN-Cache-Control':'public, s-maxage=2700, stale-while-revalidate=3600, durable'})
export const config={path:'/api/snowfall'}
