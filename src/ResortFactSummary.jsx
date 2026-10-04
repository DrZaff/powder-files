import {ArrowDownRight,MountainSnow,Route,Map,ExternalLink} from 'lucide-react'
import {formatMountainFact} from './mountain-fact-format.js'

const metrics=[{key:'vertical',label:'Vertical',Icon:ArrowDownRight},{key:'area',label:'Terrain',Icon:Map},{key:'trails',label:'Trails',Icon:Route}]
export default function ResortFactSummary({observations=[]}){
 const elevation=observations.find(f=>f.key==='mapped_elevation')
 return <div className="resort-fact-summary"><div className="resort-stat-tiles">{metrics.map(({key,label,Icon})=>{
  const fact=observations.find(f=>f.key===key)||(key==='area'?observations.find(f=>f.key==='piste_length'):null)
  const contents=<><span className="tile-label"><Icon aria-hidden="true"/>{fact?.label||label}</span><strong>{fact?formatMountainFact(fact):'—'}</strong>{fact?.source_period&&<span className="tile-period">{fact.source_period}</span>}<span className="tile-foot">{fact?<><ExternalLink aria-hidden="true"/> View source</>:'Not yet sourced'}</span></>
  return fact?<a key={key} className={`resort-stat-tile tone-${key}`} href={fact.source} target="_blank" rel="noreferrer" aria-label={`${fact.label}: ${formatMountainFact(fact)}. View source in a new tab.`}>{contents}</a>:<div key={key} className={`resort-stat-tile tone-${key} pending-stat`}>{contents}</div>
 })}</div>{elevation&&<a className="elevation-chip" href={elevation.source} target="_blank" rel="noreferrer"><MountainSnow aria-hidden="true"/><strong>{formatMountainFact(elevation)}</strong> mapped elevation <ExternalLink aria-hidden="true"/><span>Not a verified summit</span></a>}{observations.some(f=>['vertical','area','trails'].includes(f.key))&&<small className="fact-scope-hint">Resort definitions vary. See scope notes in the field guide.</small>}</div>
}
