import {useEffect,useState} from 'react'
import {formatMountainFact} from './mountain-fact-format.js'
import ResortOverview from './ResortOverview.jsx'
export default function MountainFacts({observations}){
  if(!observations?.length)return null
return <div className="sourced-facts"><div className="facts-grid">{observations.map(fact=><div className={`fact sourced-fact tone-${fact.key}`} key={fact.key}><div><small>{fact.label}</small><strong>{formatMountainFact(fact)}</strong><small>{fact.status==='conflict'?'Needs source review':fact.status==='structured_source'?'Wikidata · community-maintained':'Official source checked'} · {fact.retrieved_at}</small>{fact.source_period&&<small className="fact-period">Published period: {fact.source_period}</small>}{fact.source_published_at&&<small>Source published: {fact.source_published_at}</small>}{fact.note&&<p>{fact.note}</p>}<a href={fact.source} target="_blank" rel="noreferrer">Source ↗</a>{fact.alternatives?.filter(a=>a.source!==fact.source).map(a=><a key={a.source} href={a.source} target="_blank" rel="noreferrer">Other source ↗</a>)}</div></div>)}</div><p className="updated">Source-checked facts are not a guarantee of current operations. Missing statistics remain unverified.</p></div>
}
export function BristolSourcedFacts({overviewOnly=false}){
  const [overview,setOverview]=useState(null)
  const [observations,setObservations]=useState(null)
  useEffect(()=>{let active=true;fetch('/data/resorts.compact.json').then(r=>{if(!r.ok)throw new Error();return r.json()}).then(d=>{if(active){const resort=d.records.find(r=>r.id==='powderfiles:verified:bristol-mountain');setObservations(resort?.mf||[]);setOverview(resort?.ov)}}).catch(()=>{if(active)setObservations([])});return()=>{active=false}},[])
  if(overviewOnly)return overview?<ResortOverview overview={overview}/>:<p>{observations?'Resort summary is unavailable.':'Loading resort summary…'}</p>
  return observations?.length?<MountainFacts observations={observations}/>:<p>{observations?'Source-checked mountain facts are unavailable.':'Loading source-checked mountain facts…'}</p>
}
