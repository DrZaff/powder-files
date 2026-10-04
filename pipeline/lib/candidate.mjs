import { cleanText, normalizeCoordinates, normalizeCountry, normalizeName, normalizeUrl, pointFromWkt, sourceId } from './normalize.mjs'
import { field } from './provenance.mjs'

function namesFromTags(tags={}) { return [...new Set([tags.alt_name,tags.old_name,tags.short_name,tags['name:en']].flatMap(v=>String(v||'').split(';')).map(cleanText).filter(Boolean))] }
function elevationFromTags(tags={}) { const value=Number.parseFloat(String(tags.ele||'').replace(',','.')); return Number.isFinite(value)?Math.round(value):null }
export function fromOsm(element,collected_at) {
  const tags=element.tags||{}, name=cleanText(tags.name||tags['name:en']); if(!name)return null
  const id=sourceId('openstreetmap',element.type,element.id),coordinates=normalizeCoordinates(element.lat??element.center?.lat,element.lon??element.center?.lon)
  const country=normalizeCountry(tags['addr:country']||tags['is_in:country']||tags.country), locality=cleanText(tags['addr:city']||tags['addr:town']||tags['addr:village']||tags.place), region=cleanText(tags['addr:state']||tags['is_in:state']||tags.region)
  const elevation_m=elevationFromTags(tags)
  return { stable_id:id,name,normalized_name:normalizeName(name),alternate_names:namesFromTags(tags),locality:locality||null,region:region||null,country:country||null,coordinates,official_website:normalizeUrl(tags.website||tags['contact:website']),operating_status:'unknown',resort_type:'unknown',mountain_facts:{elevation_m},source_records:[{source:'openstreetmap',record_id:`${element.type}/${element.id}`,url:`https://www.openstreetmap.org/${element.type}/${element.id}`,license:'ODbL-1.0',collected_at}],collection_date:collected_at,verification_status:'candidate',confidence:coordinates?'medium':'low',field_provenance:{name:field(name,id,'high'),coordinates:field(coordinates,id,coordinates?'high':'low'),country:field(country||null,id,country?'medium':'low'),elevation_m:field(elevation_m,id,elevation_m!==null?'medium':'low')},rawTags:tags}
}
export function fromWikidata(binding,collected_at) {
  const qid=String(binding.item?.value||'').split('/').pop(),name=cleanText(binding.itemLabel?.value); if(!qid||!name)return null
  const id=sourceId('wikidata','item',qid),coordinates=pointFromWkt(binding.coord?.value),country=normalizeCountry(binding.countryLabel?.value),region=cleanText(binding.adminLabel?.value),alts=String(binding.altLabel?.value||'').split(',').map(cleanText).filter(Boolean)
  return {stable_id:id,name,normalized_name:normalizeName(name),alternate_names:[...new Set(alts)],locality:null,region:region||null,country:country||null,coordinates,official_website:normalizeUrl(binding.website?.value),operating_status:'unknown',resort_type:'downhill_or_mixed',source_records:[{source:'wikidata',record_id:qid,url:`https://www.wikidata.org/wiki/${qid}`,license:'CC0-1.0',collected_at}],collection_date:collected_at,verification_status:'candidate',confidence:coordinates?'medium':'low',field_provenance:{name:field(name,id,'high'),coordinates:field(coordinates,id,coordinates?'high':'low'),country:field(country||null,id,country?'high':'low')},rawTags:{}}
}
