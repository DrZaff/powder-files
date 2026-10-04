const units={Q11573:'m',Q3710:'ft',Q828224:'km'}
export function structuredElevation(rows,collectedAt){
 const statements=new Map()
 for(const row of rows){
  const id=row.statement?.value;if(!id)continue
  const entry=statements.get(id)||{id,amount:Number(row.amount?.value),unit:units[row.unit?.value?.split('/').pop()],qualifiers:[],references:[]}
  if(row.qualifier)entry.qualifiers.push({property:row.qualifier.value,value:row.qualifierValue?.value})
  if(row.reference)entry.references.push(row.reference.value)
  statements.set(id,entry)
 }
 const values=[...statements.values()]
 if(!values.length)return null
 const signatures=new Set(values.map(v=>`${v.amount}:${v.unit}`))
 const uncertain=signatures.size!==1||values.some(v=>!v.unit||!Number.isFinite(v.amount)||v.qualifiers.length)
 return {key:'mapped_elevation',label:'Mapped elevation',value:uncertain?null:values[0].amount,unit:values[0].unit||'',source:`https://www.wikidata.org/wiki/${values[0].id.split('/').pop().split('-')[0]}#P2044`,retrieved_at:collectedAt,source_published_at:null,status:uncertain?'conflict':'structured_source',confidence:uncertain?'low':'medium',note:uncertain?'Different values, qualifiers or unsupported units require review. No elevation selected.':'Wikidata elevation of the mapped place; not a confirmed summit, base or highest skiing point.',statements:values,license:'CC0-1.0'}
}
export function enrichMountains(records,cache){
 const rowsById=Object.groupBy(cache?.records||[],r=>r.item?.value?.split('/').pop())
 const queue=[]
 for(const r of records){
  if(!['medium','high'].includes(r.confidence))continue
  const rows=r.source_records.filter(s=>s.source==='wikidata').flatMap(s=>rowsById[s.record_id]||[])
  const observation=structuredElevation(rows,cache?.collected_at)
  r.mountain_observations||=[]
  if(observation){r.mountain_observations.push(observation);r.field_provenance['mountain.mapped_elevation']=structuredClone(observation)}
  const known=new Set(r.mountain_observations.filter(f=>f.status==='source_checked').map(f=>f.key))
  const missing=['vertical','area','trails','skiing_elevation','lifts'].filter(key=>!known.has(key))
  const wikidataIds=r.source_records.filter(s=>s.source==='wikidata').map(s=>s.record_id)
  queue.push({id:r.stable_id,name:r.name,country:r.country,official_website:r.official_website,missing_official_facts:missing,conflicts:r.mountain_observations.filter(f=>f.status==='conflict'),status:missing.length?'needs_official_research':'source_checked',structured_lookup:!wikidataIds.length?'no_wikidata_identifier':wikidataIds.every(id=>cache?.queried_ids?.includes(id))?'queried':'not_run'})
 }
 return queue
}
