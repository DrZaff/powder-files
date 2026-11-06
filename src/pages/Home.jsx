import {useEffect,useRef,useState} from 'react'
import {Link,useNavigate} from 'react-router-dom'
import {ArrowRight,BookOpen,MapPin,MountainSnow,Search,ShieldCheck,Snowflake} from 'lucide-react'
import {featuredResorts,formatHeroDate,heroStatus,itineraries,reviews} from '../data/home-content.js'
import {ItineraryCard,ReviewCard,SectionHeading,Stat} from '../components/Common.jsx'

export default function Home(){
  const navigate=useNavigate(),[query,setQuery]=useState('')
  const submit=e=>{e.preventDefault();navigate(`/resorts?q=${encodeURIComponent(query)}`)}
  return <div className="na-home">
    <section className="na-hero" aria-labelledby="home-title">
      <MountainCanvas/>
      <div className="na-hero-veil" aria-hidden="true"/>
      <div className="container na-hero-inner">
        <div className="na-hero-copy">
          <span className="na-kicker">The global skier&apos;s field guide</span>
          <h1 id="home-title">Every mountain<br/>has a <em>story.</em></h1>
          <p className="na-lede">Explore 1,448 ski areas through source-checked facts, honest field notes, and trip plans built to be used.</p>
          <form className="na-search" onSubmit={submit} role="search">
            <label className="sr-only" htmlFor="home-search">Search resorts and destinations</label>
            <MapPin aria-hidden="true"/>
            <input id="home-search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Where do you want to ski?"/>
            <button type="submit">Explore<ArrowRight aria-hidden="true"/></button>
          </form>
          <div className="na-proof"><span><ShieldCheck aria-hidden="true"/> Sources on every fact</span><span><Snowflake aria-hidden="true"/> 52 countries mapped</span></div>
        </div>
        <FeaturedNow items={featuredResorts}/>
      </div>
      <p className="na-scene-caption">Live terrain · procedural, not a real peak</p>
    </section>

    <section className="na-stats" aria-label="Powder Files directory highlights">
      <div className="container na-stats-inner">
        <div><strong>1,448</strong><span>mountains mapped</span></div>
        <div><strong>569</strong><span>source-enriched profiles</span></div>
        <div><strong>52</strong><span>countries</span></div>
        <div><strong>0</strong><span>guessed verticals</span></div>
      </div>
    </section>

    <section id="featured" className="na-section">
      <div className="container">
        <SectionHeading eyebrow="Featured field guide" title="Start with a mountain worth knowing" link="View all resorts" to="/resorts"/>
        <article className="na-feature">
          <div className="na-feature-art" aria-hidden="true"><span className="na-feature-place"><MapPin/> Canandaigua, New York</span><MountainSnow className="na-feature-mark"/><span className="na-feature-word">BRISTOL</span></div>
          <div className="na-feature-copy">
            <span className="na-official"><ShieldCheck aria-hidden="true"/> Official resort profile</span>
            <h3>Bristol Mountain</h3>
            <p>A Finger Lakes favorite with 1,200 feet of vertical, dependable snowmaking, and memorable night skiing just outside Rochester.</p>
            <div className="stat-row"><Stat value="1,200 ft" label="Vertical"/><Stat value="39" label="Trails"/><Stat value="4.6" label="Example rating" star/></div>
            <div className="na-tags"><span>Night skiing</span><span>Snowmaking</span><span>Family friendly</span></div>
            <Link className="na-text-link" to="/resorts/bristol-mountain">Open the field guide <ArrowRight aria-hidden="true"/></Link>
          </div>
        </article>
      </div>
    </section>

    <section className="na-section na-section-raised">
      <div className="container">
        <SectionHeading eyebrow="Prototype examples" title="How shared itineraries will look" copy="These trip plans are illustrative. Authors and prices are examples, not real submissions." link="Explore itineraries" to="/itineraries"/>
        <div className="card-grid three">{itineraries.map(x=><ItineraryCard key={x.title} item={x}/>)}</div>
      </div>
    </section>

    <section className="na-section">
      <div className="container">
        <SectionHeading eyebrow="Prototype examples" title="How community field notes will look" copy="These reviews and ratings are illustrative examples, not real visitor submissions." link="Visit the community" to="/community"/>
        <div className="review-grid">{reviews.map(r=><ReviewCard key={r.name} review={r}/>)}</div>
      </div>
    </section>

    <section className="na-join">
      <div className="container na-join-inner">
        <span className="na-join-icon" aria-hidden="true"><BookOpen/></span>
        <div><span className="na-kicker">Keep your own field notes</span><h2>Save the good trips. Share what you learn.</h2><p>Create a free account when you’re ready to review a resort or shape an itinerary of your own.</p></div>
        <div className="na-join-actions"><Link className="na-button" to="/register">Create an account <ArrowRight aria-hidden="true"/></Link><Link className="na-button na-button-ghost" to="/resorts"><Search aria-hidden="true"/> Browse resorts</Link></div>
      </div>
    </section>
  </div>
}

// Live WebGL mountains. The scene module loads after first paint; without WebGL2 the CSS fallback stays.
function MountainCanvas(){
  const canvas=useRef(null),[live,setLive]=useState(false)
  useEffect(()=>{
    let scene=null,cancelled=false
    const start=()=>import('../scene/mountain-scene.js').then(({createMountainScene})=>{
      if(cancelled||!canvas.current)return
      try{scene=createMountainScene(canvas.current,{look:'aurora'})}catch(error){console.warn('Mountain scene failed to start:',error)}
      if(scene)setLive(true)
    })
    const idle=window.requestIdleCallback?window.requestIdleCallback(start,{timeout:600}):window.setTimeout(start,60)
    return()=>{cancelled=true;if(window.cancelIdleCallback)window.cancelIdleCallback(idle);else window.clearTimeout(idle);scene?.destroy()}
  },[])
  return <div className={`na-scene${live?' is-live':''}`}>
    <div className="na-scene-fallback" aria-hidden="true"/>
    <canvas ref={canvas} role="img" aria-label="Animated, procedurally generated mountain range. Move the pointer or drag to look around."/>
  </div>
}

function FeaturedNow({items}){
  const track=useRef(null),[active,setActive]=useState(0)
  const cardOffset=index=>{const el=track.current;if(!el?.children[index])return 0;return el.children[index].offsetLeft-el.children[0].offsetLeft}
  const select=index=>{const el=track.current;if(!el)return;setActive(index);el.scrollTo({left:cardOffset(index),behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})}
  const onScroll=()=>{const el=track.current;if(!el||el.children.length<2)return;const step=cardOffset(1)||1,atEnd=el.scrollLeft>=el.scrollWidth-el.clientWidth-2,index=atEnd?items.length-1:Math.min(items.length-1,Math.max(0,Math.round(el.scrollLeft/step)));if(index!==active)setActive(index)}
  return <section className="na-featured" aria-labelledby="featured-now-title">
    <div className="na-featured-bar"><h2 id="featured-now-title">Featured now</h2><span aria-hidden="true">{active+1} of {items.length}</span></div>
    <div className="na-chips" role="group" aria-label="Choose a featured resort">{items.map((item,index)=><button key={item.id} type="button" aria-controls={`featured-card-${index}`} aria-current={index===active?'true':undefined} onClick={()=>select(index)}>{item.short}</button>)}</div>
    <div className="na-track" ref={track} onScroll={onScroll}>{items.map((item,index)=>{const status=heroStatus(item.status);return <article key={item.id} id={`featured-card-${index}`} className="na-card" aria-label={`${item.name}, ${index+1} of ${items.length}`}>
      <div className="na-card-head"><div><h3>{item.name}</h3><p>{item.place}</p></div><span className={`na-status ${status.state}`}>{status.label}</span></div>
      <dl className="na-facts">{item.facts.map(fact=><div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}{fact.scope&&<small>{fact.scope}</small>}</dd></div>)}</dl>
      <p className="na-checked">Status checked {formatHeroDate(item.status.checked_at,{day:'numeric',month:'short',year:'numeric'})} from the official site</p>
      <Link className="na-card-link" to={item.to}>Open field guide<ArrowRight aria-hidden="true"/></Link>
    </article>})}</div>
  </section>
}
