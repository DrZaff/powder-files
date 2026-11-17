export const OPEN_METEO_ENDPOINT='https://api.open-meteo.com/v1/forecast'
export const SNOW_SOURCE={name:'Open-Meteo',url:'https://open-meteo.com/',licence:'CC BY 4.0',licence_url:'https://creativecommons.org/licenses/by/4.0/'}

export function snowfallUrl(points){
  const url=new URL(OPEN_METEO_ENDPOINT)
  url.searchParams.set('latitude',points.map(p=>p.lat.toFixed(4)).join(','))
  url.searchParams.set('longitude',points.map(p=>p.lon.toFixed(4)).join(','))
  url.searchParams.set('hourly','snowfall')
  url.searchParams.set('past_hours','24')
  url.searchParams.set('forecast_hours','1')
  url.searchParams.set('timezone','UTC')
  return url.toString()
}

export function summarizeSnowfall(resorts,responses,generatedAt=new Date().toISOString()){
  const rows=resorts.map((resort,index)=>{
    const response=responses[index],values=Array.isArray(response?.hourly?.snowfall)?response.hourly.snowfall.slice(0,24):[]
    if(!values.length)return null
    const cm=values.reduce((sum,value)=>sum+(Number.isFinite(value)?value:0),0)
    return {id:resort.id,name:resort.n,country:resort.c||null,region:resort.r||null,snowfall_cm:Math.round(cm*10)/10,model_elevation_m:Number.isFinite(response.elevation)?Math.round(response.elevation):null,to:`/resorts/guide/${encodeURIComponent(resort.id)}`}
  }).filter(Boolean).sort((a,b)=>b.snowfall_cm-a.snowfall_cm||a.name.localeCompare(b.name))
  return {version:'pf-snowfall/1',kind:'model_estimate',window_hours:24,generated_at:generatedAt,source:SNOW_SOURCE,resorts_considered:resorts.length,top:rows.slice(0,10)}
}

export async function buildSnowfallLeaderboard({resorts,fetchImpl=fetch,batchSize=75}){
  const usable=resorts.filter(r=>Array.isArray(r.p)&&Number.isFinite(r.p[0])&&Number.isFinite(r.p[1]))
  const batches=[]
  for(let start=0;start<usable.length;start+=batchSize)batches.push(usable.slice(start,start+batchSize))
  const grouped=await Promise.all(batches.map(async batch=>{
    const url=snowfallUrl(batch.map(r=>({lat:r.p[0],lon:r.p[1]})))
    const response=await fetchImpl(url,{headers:{Accept:'application/json'},signal:AbortSignal.timeout(12000)})
    if(!response.ok)throw Object.assign(new Error(`Snowfall provider returned ${response.status}`),{status:502})
    const body=await response.json()
    return Array.isArray(body)?body:[body]
  }))
  const responses=grouped.flat()
  return {...summarizeSnowfall(usable,responses),locations_with_coordinates:usable.length}
}
