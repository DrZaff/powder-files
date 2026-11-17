import {useEffect,useRef,useState} from 'react'
import {Box,ExternalLink,Minus,Plus,RotateCcw,TriangleAlert} from 'lucide-react'
import {CONVENTION_LABEL,LEGEND,loadTrails} from './trail-client.js'
import '../styles/87-trail-map.css'

const TERRAIN_SOURCES='https://github.com/tilezen/joerd/blob/master/docs/attribution.md'
const hasWebGL2=()=>{try{return !!document.createElement('canvas').getContext('webgl2')}catch{return false}}

/**
 * Community trail map for one resort. Display hook:
 *   <TrailMap resortId={resort.id} name={resort.n} website={resort.w}/>
 * Shows the plan-view map first, then loads 3D terrain only when requested. Never presented as the official map.
 */
export default function TrailMap({resortId,name,website}){
  const box=useRef(null),canvas=useRef(null),scene=useRef(null)
  const [data,setData]=useState({state:'loading'}),[want3d,setWant3d]=useState(false),[mode,setMode]=useState('poster'),[near,setNear]=useState(false)
  useEffect(()=>{let live=true;loadTrails(resortId).then(result=>{if(live)setData(result?{state:'ready',...result}:{state:'none'})},()=>{if(live)setData({state:'error'})});return()=>{live=false}},[resortId])
  useEffect(()=>{
    if(!box.current||near)return
    const io=new IntersectionObserver(([entry])=>{if(entry.isIntersecting){setNear(true);io.disconnect()}},{rootMargin:'200px'})
    io.observe(box.current);return()=>io.disconnect()
  },[near])
  const ready=data.state==='ready'
  // The fast 2D plan is always first. 3D terrain loads only after an explicit visitor action.
  // Build the scene once per resort when 3D is wanted; status changes don't re-run this.
  useEffect(()=>{
    if(!want3d||!ready)return
    const controller=new AbortController();let live=true
    const start=window.setTimeout(()=>{if(live)setMode(hasWebGL2()?'loading3d':'failed3d')},0)
    if(!hasWebGL2())return()=>{live=false;window.clearTimeout(start)}
    import('./trail-scene.js').then(async({createTrailScene,decodeTrails,loadElevation})=>{
      const elevation=await loadElevation(data.file.bbox,{signal:controller.signal})
      if(!live||!canvas.current)return
      scene.current=createTrailScene(canvas.current,{trails:decodeTrails(data.file),elevation,bbox:data.file.bbox,convention:data.file.convention})
      setMode(scene.current?'3d':'failed3d')
    }).catch(error=>{if(live&&error.name!=='AbortError'){console.warn('Trail map 3D failed:',error);setMode('failed3d')}})
    return()=>{live=false;window.clearTimeout(start);controller.abort();scene.current?.destroy();scene.current=null}
  },[want3d,ready,data])

  if(data.state==='none')return <section ref={box} className="pf-trails is-none" aria-labelledby="pf-trails-title">
    <Header/>
    <p className="pf-trails-note">No community trail map yet: runs and lifts for {name||'this resort'} aren’t mapped in OpenStreetMap, or we couldn’t match them confidently.</p>
    <Links website={website}/>
  </section>
  if(data.state==='error')return <section ref={box} className="pf-trails is-error" aria-labelledby="pf-trails-title"><Header/><p className="pf-trails-note"><TriangleAlert aria-hidden="true"/>The trail map couldn’t be loaded right now.</p><Links website={website}/></section>
  if(!ready)return <section ref={box} className="pf-trails is-loading" aria-labelledby="pf-trails-title" aria-busy="true"><Header/><div className="pf-trails-stage"><div className="pf-trails-skeleton"/></div></section>

  const {entry,file,dataDate}=data,legend=LEGEND[file.convention]||LEGEND.europe,show3d=mode==='3d'
  return <section ref={box} className="pf-trails is-ready" aria-labelledby="pf-trails-title">
    <Header/>
    <p className="pf-trails-summary"><strong>{entry.runs} runs</strong> · {entry.lifts} lifts · {entry.km} km of mapped runs{file.osm_ski_area.name?<> in OSM ski area “{file.osm_ski_area.name}”</>:null}</p>
    {(entry.coverage!=='good'||entry.cropped||entry.match==='distance')&&<ul className="pf-trails-cautions">
      {entry.coverage!=='good'&&<li>OpenStreetMap coverage here looks incomplete; some runs or lifts are probably missing.</li>}
      {entry.cropped&&<li>Showing runs within {file.stats.crop_radius_km} km of the resort; the mapped ski area is larger.</li>}
      {entry.match==='distance'&&<li>Matched to the nearest mapped ski area by location, so it may include neighbouring terrain.</li>}
    </ul>}
    <div className={`pf-trails-stage${show3d?' is-3d':''}`}>
      <img className="pf-trails-poster" src={`/data/trails/${entry.key}.svg`} alt={`Plan view of ${name||'the resort'}’s mapped runs and lifts`} loading="lazy" decoding="async"/>
      <canvas ref={canvas} tabIndex={show3d?0:-1} aria-label={`3D trail map of ${name||'the resort'}. Drag to rotate (swipe sideways on touch screens), scroll or pinch to zoom, arrow keys to orbit, 0 to reset.`} role="img"/>
      {mode==='poster'&&<button type="button" className="pf-trails-load" onClick={()=>setWant3d(true)}><Box aria-hidden="true"/>View in 3D</button>}
      {mode==='loading3d'&&<p className="pf-trails-status" role="status">Loading terrain…</p>}
      {mode==='failed3d'&&<p className="pf-trails-status" role="status">3D view unavailable on this device. Showing the plan view.</p>}
      {show3d&&<div className="pf-trails-controls">
        <button type="button" aria-label="Zoom in" onClick={()=>scene.current?.zoom(.8)}><Plus aria-hidden="true"/></button>
        <button type="button" aria-label="Zoom out" onClick={()=>scene.current?.zoom(1.25)}><Minus aria-hidden="true"/></button>
        <button type="button" aria-label="Reset view" onClick={()=>scene.current?.reset()}><RotateCcw aria-hidden="true"/></button>
      </div>}
    </div>
    <ul className="pf-trails-legend" aria-label={CONVENTION_LABEL[file.convention]||'Run grading'}>
      {legend.map(([d,label])=><li key={d} className={`d-${file.convention}-${d}`}><i aria-hidden="true"/>{label}</li>)}
      <li className="d-ungraded"><i aria-hidden="true"/>Grey · not graded in OSM</li>
      <li className="d-lift"><i aria-hidden="true"/>Lift</li>
    </ul>
    <Links website={website}/>
    <footer className="pf-trails-foot">
      <p>Community-mapped, not the resort’s official trail map. Don’t use it for navigation or avalanche decisions; runs may be closed, renamed or missing.</p>
      <p>Runs and lifts © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a> (ODbL), via <a href="https://openskimap.org" target="_blank" rel="noreferrer">OpenSkiMap</a>, data of {dataDate}. Terrain: Mapzen Terrain Tiles on AWS Open Data (<a href={TERRAIN_SOURCES} target="_blank" rel="noreferrer">sources</a>), height exaggerated ×1.25.</p>
    </footer>
  </section>
}
function Header(){return <header className="pf-trails-head"><h2 id="pf-trails-title">Trail map</h2><span className="pf-trails-kind">Community-mapped · OpenStreetMap</span></header>}
function Links({website}){return <p className="pf-trails-links">{website?<a href={website} target="_blank" rel="noreferrer">Find the official trail map on the resort’s website<ExternalLink aria-hidden="true"/></a>:<span>No official website on file.</span>}<a href="https://wiki.openstreetmap.org/wiki/Piste_Maps" target="_blank" rel="noreferrer">Improve this map on OpenStreetMap<ExternalLink aria-hidden="true"/></a></p>}
