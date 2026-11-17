import {useEffect,useRef,useState} from 'react'
import {Link,useNavigate} from 'react-router-dom'
import {ArrowDown,ArrowRight,CloudSnow,MapPin,Route,ShieldCheck,Sparkles} from 'lucide-react'
import {featuredMountain} from '../data/home-content.js'
import SnowfallLeaderboard from '../weather/SnowfallLeaderboard.jsx'

// Three looks for the live background. Each loads its own small module after first paint.
const LOOKS={
  glade:{label:'Glade run',caption:'Generated powder glade · not a real run',load:()=>import('../scene/glade-scene.js').then(m=>m.createGladeScene)},
  dropin:{label:'Drop in',caption:'Generated image · fictional mountain',load:()=>import('../scene/dropin-scene.js').then(m=>m.createDropinScene)},
  retro:{label:'Retro 90s',caption:'Original pixel art · move your pointer to steer',load:()=>import('../scene/retro-scene.js').then(m=>m.createRetroScene)},
}

function useStoredLook(){
  const [look,setLook]=useState(()=>{try{const saved=localStorage.getItem('pf-look');return saved in LOOKS?saved:'glade'}catch{return 'glade'}})
  const update=value=>{setLook(value);try{localStorage.setItem('pf-look',value)}catch{/* storage unavailable: keep the choice for this visit only */}}
  return [look,update]
}

export default function Home(){
  const navigate=useNavigate(),[query,setQuery]=useState(''),[look,setLook]=useStoredLook()
  const submit=e=>{e.preventDefault();navigate(`/resorts?q=${encodeURIComponent(query)}`)}
  const retro=look==='retro'
  return <div className={`na-home look-${look}`}>
    <section className="pf-stage" aria-labelledby="home-title">
      <SceneBackdrop look={look}/>
      <div className="pf-veil" aria-hidden="true"/>
      <div className="container pf-stage-bar">
        <div className="pf-looks" role="group" aria-label="Background style">
          {Object.entries(LOOKS).map(([key,item])=><button key={key} type="button" aria-pressed={look===key} onClick={()=>setLook(key)}>{item.label}</button>)}
        </div>
        <div className="pf-stage-meta">
          {look==='dropin'&&<button type="button" className="pf-drop" onClick={()=>window.dispatchEvent(new Event('pf-dropin'))}>Drop in<ArrowDown aria-hidden="true"/></button>}
          <p className="pf-caption">{LOOKS[look].caption}</p>
        </div>
      </div>
      <div className="container pf-intro">
        <h1 id="home-title" className="pf-wordmark">{retro?'POWDER FILES':'Powder Files'}</h1>
        <p className="pf-tagline">The source-checked <span>ski field guide</span></p>
        <form className="pf-search" onSubmit={submit} role="search">
          <label className="sr-only" htmlFor="home-search">Search resorts and destinations</label>
          <MapPin aria-hidden="true"/>
          <input id="home-search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Where do you want to ski?"/>
          <button type="submit">Explore<ArrowRight aria-hidden="true"/></button>
        </form>
      </div>
      <div className="container pf-card-slot"><SnowfallLeaderboard/></div>
    </section>

    <FeaturedMountain mountain={featuredMountain}/>

    <section className="container pf-features" aria-label="What Powder Files does">
      <div><ShieldCheck aria-hidden="true"/><h2>Source-checked facts</h2><p>Every figure links to the resort or authority that published it. Disputed numbers are shown as disputed.</p></div>
      <div><CloudSnow aria-hidden="true"/><h2>Fresh-snow intelligence</h2><p>Global snowfall estimates are clearly separated from official resort reports and linked to their weather source.</p></div>
      <div><Route aria-hidden="true"/><h2>Trip plans</h2><p>Save resorts and build trips around real seasons. Coming soon.</p></div>
    </section>

    <section className="container pf-cta">
      <Link className="pf-button" to="/resorts">{retro?'PRESS START':'Explore 1,448 resorts'}<ArrowRight aria-hidden="true"/></Link>
    </section>
  </div>
}

function FeaturedMountain({mountain}){return <section className="container pf-featured" aria-labelledby="featured-title">
  <div className="pf-featured-map"><img src={mountain.trailImage} alt={`Community-mapped 2D trail map of ${mountain.name}`} loading="lazy"/><span>Community trail map · OpenStreetMap</span></div>
  <article><span className="eyebrow"><Sparkles aria-hidden="true"/>{mountain.eyebrow}</span><p className="pf-featured-place">{mountain.place}</p><h2 id="featured-title">{mountain.name}</h2><p className="pf-featured-copy">{mountain.summary}</p><ul>{mountain.facts.map(([label,value])=><li key={label}><strong>{value}</strong><span>{label}</span></li>)}</ul><div className="pf-featured-note"><ShieldCheck aria-hidden="true"/><p><strong>AI-assisted editorial summary</strong><span>Written from source-checked resort facts · reviewed {mountain.reviewed}</span></p></div><div className="pf-featured-actions"><Link className="pf-button" to={mountain.to}>Explore the mountain<ArrowRight aria-hidden="true"/></Link><a href={mountain.source} target="_blank" rel="noreferrer">Check the source ↗</a></div></article>
  </section>}

// The live background for the selected look. Without WebGL2/canvas, the CSS fallback stays.
function SceneBackdrop({look}){
  const canvas=useRef(null),[liveLook,setLiveLook]=useState(null)
  useEffect(()=>{
    let scene=null,cancelled=false
    const start=()=>LOOKS[look].load().then(create=>{
      if(cancelled||!canvas.current)return
      try{scene=create(canvas.current)}catch(error){console.warn('Background scene failed to start:',error)}
      if(!scene)return
      scene.start()
      // Photo looks report when their images are ready, so the canvas fades in without a dark flash.
      Promise.resolve(scene.ready).then(()=>{if(!cancelled)setLiveLook(look)},()=>{})
    })
    const idle=window.requestIdleCallback?window.requestIdleCallback(start,{timeout:600}):window.setTimeout(start,60)
    return()=>{cancelled=true;if(window.cancelIdleCallback)window.cancelIdleCallback(idle);else window.clearTimeout(idle);scene?.destroy()}
  },[look])
  return <div className={`pf-scene${liveLook===look?' is-live':''}`} aria-hidden="true">
    <div className="pf-scene-fallback"/>
    <canvas key={look} ref={canvas} className={look==='retro'?'is-pixel':undefined}/>
  </div>
}
