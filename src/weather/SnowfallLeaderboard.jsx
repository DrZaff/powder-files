import {useEffect,useState} from 'react'
import {Link} from 'react-router-dom'
import {ArrowRight,CloudSnow,RefreshCw,TriangleAlert} from 'lucide-react'

// Below this, a "top 10" would just rank noise; say plainly that little or no snow was modelled instead.
const MEANINGFUL_CM=0.5
const SLOW_MS=6000,STALE_MS=3*60*60*1000
const when=iso=>new Date(iso).toLocaleString(undefined,{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit',timeZoneName:'short'})
const ago=iso=>{const m=Math.max(0,Math.round((Date.now()-Date.parse(iso))/6e4));return m<60?`${m} min ago`:`${Math.round(m/60)} h ago`}

export default function SnowfallLeaderboard(){
  const [state,setState]=useState({kind:'loading'}),[attempt,setAttempt]=useState(0),[slow,setSlow]=useState(false)
  useEffect(()=>{
    let live=true
    const timer=window.setTimeout(()=>{if(live)setSlow(true)},SLOW_MS)
    fetch('/api/snowfall',{headers:{Accept:'application/json'}}).then(async r=>{const body=await r.json();if(!r.ok||body.version!=='pf-snowfall/1')throw new Error();if(live)setState({kind:'ready',data:body,stale:Boolean(body.stale)||Date.now()-Date.parse(body.generated_at)>STALE_MS})}).catch(()=>{if(live)setState({kind:'error'})}).finally(()=>window.clearTimeout(timer))
    return()=>{live=false;window.clearTimeout(timer)}
  },[attempt])
  const retry=()=>{setSlow(false);setState({kind:'loading'});setAttempt(n=>n+1)}
  const data=state.kind==='ready'?state.data:null
  const top=data?.top||[],max=Math.max(...top.map(row=>row.snowfall_cm),0)
  const stale=state.kind==='ready'&&state.stale
  return <article className="pf-snowfall" aria-labelledby="snowfall-title" aria-busy={state.kind==='loading'}>
    <header>
      <div>
        <span className="eyebrow"><CloudSnow aria-hidden="true"/>Fresh snow finder</span>
        <h2 id="snowfall-title">Most snow in the past 24 hours</h2>
        <p>Modeled snowfall at every mapped Powder Files resort, ranked worldwide.</p>
      </div>
      <span className="pf-snowfall-kind">Model estimate · not a snow report</span>
    </header>
    {state.kind==='loading'&&<div className="pf-snowfall-loading" role="status">
      <ol aria-hidden="true">{Array.from({length:5},(_,i)=><li key={i}/>)}</ol>
      <p>{slow?'Still checking — the model data is slow to respond right now.':'Checking 1,400+ mountain locations…'}</p>
    </div>}
    {state.kind==='error'&&<div className="pf-snowfall-error" role="status"><TriangleAlert aria-hidden="true"/><p>Snowfall estimates are unavailable right now.</p><button type="button" onClick={retry}><RefreshCw aria-hidden="true"/>Try again</button></div>}
    {data&&<>
      {stale&&<p className="pf-snowfall-stale" role="status"><TriangleAlert aria-hidden="true"/>Showing the last ranking we have, from {ago(data.generated_at)}. It may be out of date.</p>}
      {max<MEANINGFUL_CM
        ?<p className="pf-snowfall-quiet">No meaningful snowfall was modeled at any mapped resort in the past 24 hours.</p>
        :<ol className="pf-snowfall-list">{top.filter(row=>row.snowfall_cm>=MEANINGFUL_CM/5).map((row,index)=><li key={row.id} className={index===0?'is-first':undefined} style={{'--share':(row.snowfall_cm/max).toFixed(3)}}>
          <Link to={row.to}>
            <span className="pf-snow-rank">{index+1}</span>
            <span className="pf-snow-name"><strong>{row.name}</strong><small>{[row.region,row.country].filter(Boolean).join(', ')}</small></span>
            <span className="pf-snow-total"><strong>{row.snowfall_cm.toFixed(row.snowfall_cm<10?1:0)} cm</strong><small>{(row.snowfall_cm/2.54).toFixed(1)} in</small></span>
            <ArrowRight aria-hidden="true"/>
            <i className="pf-snow-bar" aria-hidden="true"/>
          </Link>
        </li>)}</ol>}
      <footer>
        <p><strong>Model estimate, not an official snow report.</strong> Snowfall is modeled at each resort’s mapped point and can differ from what the resort measures, especially with elevation and exposure.</p>
        <p>Updated {when(data.generated_at)} · Data by <a href={data.source.url} target="_blank" rel="noreferrer">Open-Meteo</a> (<a href={data.source.licence_url} target="_blank" rel="noreferrer">CC BY 4.0</a>)</p>
      </footer>
    </>}
  </article>
}
