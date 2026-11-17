import {useEffect,useState} from 'react'
import {Link} from 'react-router-dom'
import {ArrowRight,CloudSnow,RefreshCw,TriangleAlert} from 'lucide-react'

export default function SnowfallLeaderboard(){
  const [state,setState]=useState({kind:'loading'}),[attempt,setAttempt]=useState(0)
  useEffect(()=>{let live=true;fetch('/api/snowfall',{headers:{Accept:'application/json'}}).then(async r=>{const body=await r.json();if(!r.ok||body.version!=='pf-snowfall/1')throw new Error();if(live)setState({kind:'ready',data:body})}).catch(()=>{if(live)setState({kind:'error'})});return()=>{live=false}},[attempt])
  return <article className="pf-snowfall" aria-labelledby="snowfall-title" aria-busy={state.kind==='loading'}>
    <header><div><span className="eyebrow"><CloudSnow aria-hidden="true"/>Fresh snow finder</span><h2 id="snowfall-title">Best snowfall in the past 24 hours</h2><p>Top modeled snowfall among every mapped Powder Files resort worldwide.</p></div><span className="pf-snowfall-window">24 h</span></header>
    {state.kind==='loading'&&<div className="pf-snowfall-loading" role="status">Checking 1,400+ mountain locations…</div>}
    {state.kind==='error'&&<div className="pf-snowfall-error"><TriangleAlert aria-hidden="true"/><p>Snowfall estimates are unavailable right now.</p><button onClick={()=>setAttempt(n=>n+1)}><RefreshCw aria-hidden="true"/>Retry</button></div>}
    {state.kind==='ready'&&<><ol className="pf-snowfall-list">{state.data.top.map((row,index)=><li key={row.id}><Link to={row.to}><span className="pf-snow-rank">{String(index+1).padStart(2,'0')}</span><span className="pf-snow-name"><strong>{row.name}</strong><small>{[row.region,row.country].filter(Boolean).join(', ')}</small></span><span className="pf-snow-total"><strong>{row.snowfall_cm.toFixed(1)} cm</strong><small>≈ {(row.snowfall_cm/2.54).toFixed(1)} in</small></span><ArrowRight aria-hidden="true"/></Link></li>)}</ol><footer><p><strong>Model estimate, not an official snow report.</strong> Snowfall is modeled at each resort’s mapped point and can differ from resort measurements, especially across elevation and exposure.</p><p>Updated {new Date(state.data.generated_at).toLocaleString()} · Data by <a href={state.data.source.url} target="_blank" rel="noreferrer">Open-Meteo</a> (<a href={state.data.source.licence_url} target="_blank" rel="noreferrer">CC BY 4.0</a>).</p></footer></>}
  </article>
}
