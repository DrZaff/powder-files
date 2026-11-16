import {useEffect,useRef,useState} from 'react'
import {Link,useNavigate} from 'react-router-dom'
import {ArrowRight,CalendarDays,MapPin,Route,ShieldCheck} from 'lucide-react'
import {formatHeroDate,heroDate,heroStatus,seasonCalendar} from '../data/home-content.js'

// Two looks for the live background. Each loads its own small module after first paint.
const LOOKS={
  glade:{label:'Glade run',caption:'Generated powder glade · not a real run',load:()=>import('../scene/glade-scene.js').then(m=>m.createGladeScene)},
  retro:{label:'Retro 90s',caption:'Original pixel art · move your pointer to steer',load:()=>import('../scene/retro-scene.js').then(m=>m.createRetroScene)},
}

function useStoredLook(){
  const [look,setLook]=useState(()=>{try{return localStorage.getItem('pf-look')==='retro'?'retro':'glade'}catch{return 'glade'}})
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
        <p className="pf-caption">{LOOKS[look].caption}</p>
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
      <div className="container pf-card-slot"><SeasonCard calendar={seasonCalendar}/></div>
    </section>

    <section className="container pf-features" aria-label="What Powder Files does">
      <div><ShieldCheck aria-hidden="true"/><h2>Source-checked facts</h2><p>Every figure links to the resort or authority that published it. Disputed numbers are shown as disputed.</p></div>
      <div><CalendarDays aria-hidden="true"/><h2>Live season status</h2><p>Opening dates come from official schedules, and each status says when it was last checked.</p></div>
      <div><Route aria-hidden="true"/><h2>Trip plans</h2><p>Save resorts and build trips around real seasons. Coming soon.</p></div>
    </section>

    <section className="container pf-cta">
      <Link className="pf-button" to="/resorts">{retro?'PRESS START':'Explore 1,448 resorts'}<ArrowRight aria-hidden="true"/></Link>
    </section>
  </div>
}

// The live background for the selected look. Without WebGL2/canvas, the CSS fallback stays.
function SceneBackdrop({look}){
  const canvas=useRef(null),[liveLook,setLiveLook]=useState(null)
  useEffect(()=>{
    let scene=null,cancelled=false
    const start=()=>LOOKS[look].load().then(create=>{
      if(cancelled||!canvas.current)return
      try{scene=create(canvas.current)}catch(error){console.warn('Background scene failed to start:',error)}
      if(scene){scene.start();setLiveLook(look)}
    })
    const idle=window.requestIdleCallback?window.requestIdleCallback(start,{timeout:600}):window.setTimeout(start,60)
    return()=>{cancelled=true;if(window.cancelIdleCallback)window.cancelIdleCallback(idle);else window.clearTimeout(idle);scene?.destroy()}
  },[look])
  return <div className={`pf-scene${liveLook===look?' is-live':''}`} aria-hidden="true">
    <div className="pf-scene-fallback"/>
    <canvas key={look} ref={canvas} className={look==='retro'?'is-pixel':undefined}/>
  </div>
}

// Raised card: a calendar of published 2026–27 opening dates, with a "today" marker.
function SeasonCard({calendar}){
  const card=useRef(null),now=new Date()
  if(now>heroDate(calendar.validUntil))return null
  const start=heroDate(calendar.window.start),end=heroDate(calendar.window.end),span=end-start
  const pct=value=>Math.min(100,Math.max(0,(heroDate(value)-start)/span*100))
  const today=(now-start)/span*100,showToday=today>=0&&today<=100
  const months=[['Nov','2026-11-01'],['Dec','2026-12-01'],['Jan','2027-01-01'],['Feb','2027-02-01'],['Mar','2027-03-01'],['Apr','2027-04-01'],['May','2027-05-01']].map(([label,date])=>({label,left:pct(date)}))
  const fine=typeof window!=='undefined'&&window.matchMedia('(hover: hover) and (pointer: fine)').matches&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const tilt=e=>{if(!fine||!card.current)return;const b=card.current.getBoundingClientRect();card.current.style.setProperty('--tilt-x',((e.clientX-b.left)/b.width-.5).toFixed(3));card.current.style.setProperty('--tilt-y',((e.clientY-b.top)/b.height-.5).toFixed(3))}
  const reset=()=>{card.current?.style.setProperty('--tilt-x','0');card.current?.style.setProperty('--tilt-y','0')}
  return <article className="pf-card" ref={card} onPointerMove={tilt} onPointerLeave={reset} aria-labelledby="season-card-title">
    <header className="pf-card-bar">
      <h2 id="season-card-title"><CalendarDays aria-hidden="true"/>{calendar.title}</h2>
      <p>Opening dates from each resort’s official site · checked 6 Nov 2026</p>
    </header>
    <div className="pf-cal" style={showToday?{'--today':today.toFixed(2)}:undefined}>
      <div className="pf-cal-months" aria-hidden="true">{months.map(m=><span key={m.label} style={{left:`${m.left}%`}}>{m.label}</span>)}{showToday&&<b className="pf-cal-now">Today</b>}</div>
      <ol className="pf-cal-rows">
        {showToday&&<li className="pf-cal-today" aria-hidden="true"/>}
        {calendar.resorts.map(resort=>{
          const status=heroStatus(resort.status,now)
          const summary=resort.segments.map(s=>s.to?`${formatHeroDate(s.from)} to ${formatHeroDate(s.to)}`:`from ${formatHeroDate(s.from)}`).join(', ')
          return <li key={resort.name}><Link className={`pf-cal-row tone-${resort.tone}`} to={resort.to}>
            <span className="pf-cal-name"><strong>{resort.name}</strong><small>{resort.place}</small></span>
            <span className={`pf-status ${status.state}`}>{status.label}</span>
            <span className="pf-cal-track" aria-hidden="true">
              {resort.segments.map(s=>{const left=pct(s.from),right=s.to?pct(s.to):100;return <i key={s.from} className={`${s.soft?'soft':''} ${s.to?'':'open-end'}`} style={{left:`${left}%`,width:`${Math.max(1,right-left)}%`}}/>})}
              {showToday&&<b className="pf-cal-tick"/>}
              {resort.note&&<em>{resort.note}</em>}
            </span>
            <span className="sr-only">Season {summary}.{resort.note?` ${resort.note}.`:''} Open the field guide.</span>
          </Link></li>
        })}
      </ol>
    </div>
  </article>
}
