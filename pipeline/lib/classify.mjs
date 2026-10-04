import { cleanText } from './normalize.mjs'

const closedTerms = /\b(closed|abandoned|disused|demolished|razed|historic)\b/i
const indoorTerms = /\b(indoor|snowdome|snow dome|ski tunnel)\b/i
const nordicTerms = /\b(nordic|cross[- ]country|langlauf|loipe)\b/i
const privateTerms = /\b(private|members? only|club exclusive)\b/i

export function classifyCandidate(record) {
  const tags=record.rawTags||{}, text=cleanText([record.name,...record.alternate_names,Object.values(tags)].join(' '))
  if (tags.disused==='yes'||tags.abandoned==='yes'||tags.demolished==='yes'||closedTerms.test(text)) return {included:false,reason:'closed_or_disused',operating_status:'closed',resort_type:'unknown'}
  if (tags.indoor==='yes'||indoorTerms.test(text)) return {included:false,reason:'indoor_slope',operating_status:'active',resort_type:'indoor'}
  if (tags.access==='private'||privateTerms.test(text)) return {included:false,reason:'private_club',operating_status:'unknown',resort_type:'private'}
  if(tags.temporary==='yes'||tags.temporary==='only') return {included:false,reason:'temporary_facility',operating_status:'temporary',resort_type:'unknown'}
  const wikidataResort=record.source_records.some(s=>s.source==='wikidata')
  const explicitDownhill=tags['piste:type']==='downhill'||tags.ski==='alpine'||tags.ski==='downhill'||wikidataResort
  const downhillEvidence = explicitDownhill||tags.site==='piste'||tags.landuse==='winter_sports'||tags.sport==='skiing'
  const nordicEvidence = tags['piste:type']==='nordic'||tags.ski==='nordic'||tags.sport==='cross_country'||nordicTerms.test(text)
  if (nordicEvidence&&!explicitDownhill) return {included:false,reason:'nordic_only',operating_status:'unknown',resort_type:'nordic'}
  if (!downhillEvidence) return {included:false,reason:'insufficient_downhill_evidence',operating_status:'unknown',resort_type:'unknown'}
  return {included:true,reason:null,operating_status:record.operating_status||'unknown',resort_type:nordicEvidence?'mixed':'downhill_or_mixed'}
}
