import { haversineKm, normalizeName } from './normalize.mjs'
import { mergeField } from './provenance.mjs'

function names(record){return new Set([record.name,...record.alternate_names].map(normalizeName).filter(Boolean))}
function sameCountry(a,b){return !a.country||!b.country||a.country===b.country}
function sharedName(a,b){const bNames=names(b);return [...names(a)].some(n=>bNames.has(n))}
function similarName(a,b){const x=normalizeName(a.name),y=normalizeName(b.name);return x.length>=5&&y.length>=5&&(x.includes(y)||y.includes(x))}

export function mergeCandidates(a,b){
  const preferred=a.verification_status==='verified'?a:b.verification_status==='verified'?b:a.source_records.some(s=>s.source==='wikidata')?a:b,other=preferred===a?b:a
  const merged={...preferred,alternate_names:[...new Set([...preferred.alternate_names,other.name,...other.alternate_names])].filter(n=>normalizeName(n)!==preferred.normalized_name),source_records:[...preferred.source_records,...other.source_records],confidence:'high'}
  for(const key of ['name','coordinates','country']) merged.field_provenance[key]=mergeField(preferred.field_provenance[key],other.field_provenance[key])
  for(const key of ['locality','region','country','coordinates','official_website']) if(!merged[key]&&other[key])merged[key]=other[key]
  merged.stable_id=preferred.stable_id
  return merged
}

export function deduplicate(records,{strongKm=2,nearKm=8}={}){
  const canonical=[],ambiguities=[],exactIndex=new Map(),prefixIndex=new Map()
  const addIndex=(map,key,index)=>{if(!key)return;const values=map.get(key)||new Set();values.add(index);map.set(key,values)}
  const indexRecord=(record,index)=>{for(const name of names(record)){addIndex(exactIndex,name,index);addIndex(prefixIndex,name.slice(0,Math.min(6,name.length)),index)}}
  for(const record of [...records].sort((a,b)=>(a.verification_status==='verified'?-1:b.verification_status==='verified'?1:a.stable_id.localeCompare(b.stable_id)))){
    const possible=new Set()
    for(const name of names(record)){for(const index of exactIndex.get(name)||[])possible.add(index);for(const index of prefixIndex.get(name.slice(0,Math.min(6,name.length)))||[])possible.add(index)}
    const scored=[...possible].map(index=>({candidate:canonical[index],index,distance:haversineKm(record.coordinates,canonical[index].coordinates),exact:sharedName(record,canonical[index]),similar:similarName(record,canonical[index])})).filter(x=>sameCountry(record,x.candidate)&&(x.exact||x.similar)&&x.distance<=nearKm).sort((a,b)=>a.distance-b.distance)
    const strong=scored.filter(x=>x.exact&&x.distance<=strongKm)
    if(strong.length===1){canonical[strong[0].index]=mergeCandidates(strong[0].candidate,record);indexRecord(canonical[strong[0].index],strong[0].index);continue}
    if(strong.length>1||scored.length){ambiguities.push({record_id:record.stable_id,candidate_matches:scored.map(x=>({record_id:x.candidate.stable_id,distance_km:Number(x.distance.toFixed(2)),name_match:x.exact?'exact':'similar'})),reason:strong.length>1?'multiple_strong_matches':'near_or_fuzzy_match_requires_review'})}
    const index=canonical.push(record)-1;indexRecord(record,index)
  }
  return {canonical,ambiguities}
}
