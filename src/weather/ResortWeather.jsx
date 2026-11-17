import {useEffect,useRef,useState} from 'react'
import {Cloud,CloudFog,CloudHail,CloudLightning,CloudMoon,CloudRain,CloudSnow,CloudSun,Moon,Navigation,RefreshCw,Sun,TriangleAlert} from 'lucide-react'
import {compass,currentStep,describeSymbol,fetchWeather,isStale,symbolKind,toF} from './weather-client.js'
import '../styles/86-weather.css'

const ICONS={thunder:CloudLightning,snow:CloudSnow,sleet:CloudHail,rain:CloudRain,fog:CloudFog,cloud:Cloud,sun:Sun,night:Moon,'sun-cloud':CloudSun,'night-cloud':CloudMoon}
const Sky=({code,...props})=>{const Icon=ICONS[symbolKind(code)];return <Icon aria-hidden="true" {...props}/>}
const clock=iso=>new Date(iso).toLocaleTimeString(undefined,{hour:'2-digit',minute:'2-digit',timeZoneName:'short'})
const ago=iso=>{const m=Math.max(0,Math.round((Date.now()-Date.parse(iso))/6e4));return m<1?'just now':m<60?`${m} min ago`:m<48*60?`${Math.round(m/60)} h ago`:`${Math.round(m/1440)} days ago`}
const temp=c=>c===null||c===undefined?'–':`${Math.round(c)}°`
const ESTIMATE={snow:'likely snow',mixed:'rain or snow',rain:'likely rain'}

/**
 * Live forecast for one resort. Display hook:
 *   <ResortWeather lat={resort.p?.[0]} lon={resort.p?.[1]} name={resort.n}/>
 * Fetches only when scrolled near the viewport. Coordinates are the resort's mapped point, not its base or summit.
 */
export default function ResortWeather({lat,lon,name}){
  const box=useRef(null),hasPoint=Number.isFinite(lat)&&Number.isFinite(lon)
  const [near,setNear]=useState(()=>typeof window!=='undefined'&&!('IntersectionObserver' in window)),[attempt,setAttempt]=useState(0),[result,setResult]=useState(null)
  useEffect(()=>{
    if(!hasPoint||near||!box.current)return
    const io=new IntersectionObserver(([entry])=>{if(entry.isIntersecting){setNear(true);io.disconnect()}},{rootMargin:'300px'})
    io.observe(box.current);return()=>io.disconnect()
  },[hasPoint,near])
  useEffect(()=>{
    if(!hasPoint||!near)return
    const key=`${lat},${lon},${attempt}`
    let live=true
    fetchWeather({lat,lon}).then(data=>{if(live)setResult({key,data})},()=>{if(live)setResult({key,error:true})})
    return()=>{live=false}
  },[hasPoint,near,lat,lon,attempt])
  const key=`${lat},${lon},${attempt}`,state=!hasPoint?'none':result?.key!==key?'loading':result.error?'error':'ready'
  return <section ref={box} className={`pf-weather is-${state}`} aria-labelledby="pf-weather-title" aria-busy={state==='loading'}>
    <header className="pf-weather-head">
      <h2 id="pf-weather-title">Weather forecast</h2>
      <span className="pf-weather-kind">Model forecast · mapped point</span>
    </header>
    {state==='none'&&<p className="pf-weather-note">No forecast: {name||'this resort'} has no mapped coordinates yet, and we don’t guess a location.</p>}
    {state==='loading'&&<div className="pf-weather-skeleton" aria-label="Loading forecast"><i/><i/><i/></div>}
    {state==='error'&&<div className="pf-weather-note"><TriangleAlert aria-hidden="true"/><p>The forecast is unavailable right now.</p><button type="button" onClick={()=>setAttempt(n=>n+1)}><RefreshCw aria-hidden="true"/>Try again</button></div>}
    {state==='ready'&&<Forecast data={result.data}/>}
  </section>
}

function Forecast({data}){
  const now=currentStep(data),stale=isStale(data),{location:loc}=data
  const wind=Number.isFinite(now.wind_speed_ms)?Math.round(now.wind_speed_ms*3.6):null
  return <>
    {stale&&<p className="pf-weather-stale" role="status"><TriangleAlert aria-hidden="true"/>Showing the last forecast we have, from {ago(data.fetched_at)}. It may be out of date.</p>}
    <div className="pf-weather-now">
      <Sky code={now.symbol} className="pf-weather-sky"/>
      <div>
        <p className="pf-weather-temp">{temp(now.air_temperature_c)}<small>C</small><span>{now.air_temperature_c===null?'':`${toF(now.air_temperature_c)}°F`}</span></p>
        <p className="pf-weather-desc">{describeSymbol(now.symbol)} · forecast for {clock(now.time)}</p>
      </div>
      {wind!==null&&Number.isFinite(now.wind_from_deg)&&<div className="pf-weather-wind" title={`Wind from the ${compass(now.wind_from_deg)}`}>
        <span className="pf-wind-arrow" style={{'--wind':`${now.wind_from_deg+180}deg`}}><Navigation aria-hidden="true"/></span>
        <p><strong>{wind} km/h</strong><small>from {compass(now.wind_from_deg)} · {Math.round(wind/1.609)} mph</small></p>
      </div>}
    </div>
    <ol className="pf-weather-days">
      {data.windows.map(w=><li key={w.label}>
        <strong>{w.label}</strong>
        <Sky code={w.symbol}/>
        <span className="pf-weather-range"><b>{temp(w.max_c)}</b> / {temp(w.min_c)}</span>
        <span className="pf-weather-precip">{w.precipitation_mm>=0.2?<>{w.precipitation_mm.toFixed(w.precipitation_mm<10?1:0)} mm precip{w.precipitation_type_estimate&&<em>{ESTIMATE[w.precipitation_type_estimate]} (estimate)</em>}</>:'Little or no precip'}{!w.complete&&<em>partial forecast</em>}</span>
      </li>)}
    </ol>
    <footer className="pf-weather-foot">
      <p>For the mapped point {loc.lat.toFixed(4)}, {loc.lon.toFixed(4)}, using the forecast model’s ground elevation. Conditions elsewhere on the mountain vary with elevation and aspect; precipitation is water equivalent, not measured snowfall or snow depth.</p>
      <p>Model run {data.model_updated_at?clock(data.model_updated_at):'time unknown'} · fetched {ago(data.fetched_at)} · <a href={data.source.url} target="_blank" rel="noreferrer">{data.source.attribution}</a> (<a href={data.source.licence_url} target="_blank" rel="noreferrer">{data.source.licence}</a>)</p>
    </footer>
  </>
}
