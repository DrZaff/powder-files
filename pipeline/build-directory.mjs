import { applyPilotFacts } from './pilot-facts.mjs'
import { applyOfficialBatch } from './official-batch-001.mjs'
import { applyOfficialBatch002 } from './official-batch-002.mjs'
import { applyOfficialBatch003 } from './official-batch-003.mjs'
import { applyOfficialBatch004 } from './official-batch-004.mjs'
import { applyOfficialBatch005 } from './official-batch-005.mjs'
import { applyOfficialBatch006 } from './official-batch-006.mjs'
import { applyOfficialBatch007 } from './official-batch-007.mjs'
import { applyOfficialBatch008 } from './official-batch-008.mjs'
import { applyOfficialBatch009 } from './official-batch-009.mjs'
import { applyOfficialBatch010 } from './official-batch-010.mjs'
import { applyOfficialBatch011 } from './official-batch-011.mjs'
import { applyOfficialBatch012 } from './official-batch-012.mjs'
import { applyOfficialBatch013 } from './official-batch-013.mjs'
import { applyOfficialBatch014 } from './official-batch-014.mjs'
import { applyOfficialBatch015 } from './official-batch-015.mjs'
import { applyOfficialBatch016 } from './official-batch-016.mjs'
import { applyOfficialBatch017 } from './official-batch-017.mjs'
import { applyOfficialBatch018 } from './official-batch-018.mjs'
import { applyOfficialBatch019 } from './official-batch-019.mjs'
import { applyCuratedExclusions } from './curated-exclusions.mjs'
import { applyResortSummaries } from './resort-summaries.mjs'
import { enrichMountains } from './lib/mountain-enrichment.mjs'
import { buildProfileCoverageAudit, coverageAuditMarkdown } from './lib/profile-coverage-audit.mjs'
import { readFile } from 'node:fs/promises'
import { COLLECTION_DATE, NEAR_MATCH_KM, STRONG_MATCH_KM } from './config.mjs'
import { fromOsm, fromWikidata } from './lib/candidate.mjs'
import { classifyCandidate } from './lib/classify.mjs'
import { deduplicate } from './lib/dedupe.mjs'
import { field } from './lib/provenance.mjs'
import { normalizeName } from './lib/normalize.mjs'
import { writeJson } from './lib/http.mjs'

const root=new URL('../',import.meta.url),cache=new URL('./cache/',import.meta.url),generated=new URL('./generated/',import.meta.url)
async function cached(name){try{return JSON.parse(await readFile(new URL(`${name}.json`,cache),'utf8'))}catch{return {source:name,collected_at:COLLECTION_DATE,records:[]}}}
const wd=await cached('wikidata'),osm=await cached('openstreetmap')
const raw=[...wd.records.map(x=>fromWikidata(x,wd.collected_at)),...osm.records.map(x=>fromOsm(x,osm.collected_at))].filter(Boolean)
const included=[],exclusions=[]
for(const candidate of raw){const classification=classifyCandidate(candidate);candidate.operating_status=classification.operating_status;candidate.resort_type=classification.resort_type;if(classification.included)included.push(candidate);else exclusions.push({stable_id:candidate.stable_id,name:candidate.name,source_records:candidate.source_records,reason:classification.reason})}

const bristolId='powderfiles:verified:bristol-mountain'
included.unshift({stable_id:bristolId,name:'Bristol Mountain',normalized_name:normalizeName('Bristol Mountain'),alternate_names:['Bristol Mountain Ski Resort'],locality:'Canandaigua',region:'New York',country:'United States',coordinates:{latitude:42.7456,longitude:-77.4044},official_website:'https://www.bristolmountain.com',operating_status:'active',resort_type:'downhill_or_mixed',mountain_facts:{summit_elevation_ft:2200,base_elevation_ft:1000,vertical_drop_ft:1200,trails:39,skiable_acres:138},source_records:[{source:'powderfiles',record_id:'bristol-mountain',url:null,license:'site-owned',collected_at:COLLECTION_DATE}],collection_date:COLLECTION_DATE,verification_status:'verified',confidence:'high',field_provenance:{name:field('Bristol Mountain',bristolId,'high'),coordinates:field({latitude:42.7456,longitude:-77.4044},bristolId,'high'),country:field('United States',bristolId,'high'),mountain_facts:field({summit_elevation_ft:2200,base_elevation_ft:1000,vertical_drop_ft:1200,trails:39,skiable_acres:138},bristolId,'high')},rawTags:{}})
const {canonical,ambiguities}=deduplicate(included,{strongKm:STRONG_MATCH_KM,nearKm:NEAR_MATCH_KM})
const ambiguousIds=new Set(ambiguities.map(x=>x.record_id));for(const record of canonical){if(record.verification_status!=='verified'){record.verification_status=ambiguousIds.has(record.stable_id)?'uncertain':record.coordinates&&record.country?'candidate':'incomplete';record.confidence=record.verification_status==='candidate'?'medium':'low'}delete record.rawTags}
applyPilotFacts(canonical)
await writeJson(new URL('official-batch-001-report.json',generated),applyOfficialBatch(canonical))
await writeJson(new URL('official-batch-002-report.json',generated),applyOfficialBatch002(canonical))
await writeJson(new URL('official-batch-003-report.json',generated),applyOfficialBatch003(canonical))
await writeJson(new URL('official-batch-004-report.json',generated),applyOfficialBatch004(canonical))
await writeJson(new URL('official-batch-005-report.json',generated),applyOfficialBatch005(canonical))
await writeJson(new URL('official-batch-006-report.json',generated),applyOfficialBatch006(canonical))
await writeJson(new URL('official-batch-007-report.json',generated),applyOfficialBatch007(canonical))
await writeJson(new URL('official-batch-008-report.json',generated),applyOfficialBatch008(canonical))
await writeJson(new URL('official-batch-009-report.json',generated),applyOfficialBatch009(canonical))
await writeJson(new URL('official-batch-010-report.json',generated),applyOfficialBatch010(canonical))
await writeJson(new URL('official-batch-011-report.json',generated),applyOfficialBatch011(canonical))
await writeJson(new URL('official-batch-012-report.json',generated),applyOfficialBatch012(canonical))
await writeJson(new URL('official-batch-013-report.json',generated),applyOfficialBatch013(canonical))
await writeJson(new URL('official-batch-014-report.json',generated),applyOfficialBatch014(canonical))
await writeJson(new URL('official-batch-015-report.json',generated),applyOfficialBatch015(canonical))
await writeJson(new URL('official-batch-016-report.json',generated),applyOfficialBatch016(canonical))
await writeJson(new URL('official-batch-017-report.json',generated),applyOfficialBatch017(canonical))
await writeJson(new URL('official-batch-018-report.json',generated),applyOfficialBatch018(canonical))
await writeJson(new URL('official-batch-019-report.json',generated),applyOfficialBatch019(canonical))
await writeJson(new URL('curated-exclusions-report.json',generated),applyCuratedExclusions(canonical,exclusions))
await writeJson(new URL('resort-summaries-report.json',generated),applyResortSummaries(canonical))
const mountainCache=await cached('mountain-wikidata')
const enrichmentQueue=enrichMountains(canonical,mountainCache.queried_ids?mountainCache:null)
await writeJson(new URL('mountain-research-queue.json',generated),enrichmentQueue)
await writeJson(new URL('mountain-coverage.json',generated),{profiles:enrichmentQueue.length,with_official_facts:canonical.filter(r=>r.mountain_observations?.some(f=>f.status==='source_checked')).length,with_structured_elevation:canonical.filter(r=>r.mountain_observations?.some(f=>f.key==='mapped_elevation'&&f.status==='structured_source')).length,conflict_profiles:enrichmentQueue.filter(r=>r.conflicts.length).length,needs_official_research:enrichmentQueue.filter(r=>r.missing_official_facts.length).length,without_official_website:enrichmentQueue.filter(r=>!r.official_website).length})
const profileAudit=buildProfileCoverageAudit(canonical,COLLECTION_DATE)
await writeJson(new URL('profile-coverage-audit.json',generated),{summary:profileAudit.summary,repeated_id_groups:profileAudit.repeated_id_groups,duplicate_name_groups:profileAudit.duplicate_name_groups,profiles:profileAudit.profiles})
await writeJson(new URL('enrichment-priority-queue.json',generated),{generated_at:COLLECTION_DATE,profiles:profileAudit.priority_queue})
await import('node:fs/promises').then(fs=>fs.writeFile(new URL('PROFILE_COVERAGE_AUDIT.md',generated),coverageAuditMarkdown(profileAudit.summary)))
canonical.sort((a,b)=>a.name.localeCompare(b.name)||a.stable_id.localeCompare(b.stable_id))

const sources=Object.groupBy(canonical.flatMap(r=>r.source_records),r=>r.source)
const countries=Object.groupBy(canonical,r=>r.country||'Unknown')
const summary={generated_at:COLLECTION_DATE,total_raw:raw.length,canonical_count:canonical.length,verified_count:canonical.filter(r=>r.verification_status==='verified').length,candidate_count:canonical.filter(r=>r.verification_status==='candidate').length,uncertain_count:canonical.filter(r=>r.verification_status==='uncertain').length,incomplete_count:canonical.filter(r=>r.verification_status==='incomplete').length,ambiguity_count:ambiguities.length,exclusion_count:exclusions.length,country_count:Object.keys(countries).filter(x=>x!=='Unknown').length,unknown_country_count:(countries.Unknown||[]).length,source_coverage:Object.fromEntries(Object.entries(sources).map(([k,v])=>[k,new Set(v.map(x=>x.record_id)).size])),country_counts:Object.fromEntries(Object.entries(countries).map(([k,v])=>[k,v.length]).sort((a,b)=>b[1]-a[1])),exclusion_reasons:Object.fromEntries(Object.entries(Object.groupBy(exclusions,x=>x.reason)).map(([k,v])=>[k,v.length]))}
const quality={...summary,coordinate_coverage:Number((canonical.filter(r=>r.coordinates).length/canonical.length*100||0).toFixed(1)),country_coverage:Number((canonical.filter(r=>r.country).length/canonical.length*100||0).toFixed(1)),website_coverage:Number((canonical.filter(r=>r.official_website).length/canonical.length*100||0).toFixed(1)),limitations:['Candidate status does not independently prove current operation or lift service.','OSM coverage and tagging vary significantly by country.','Wikidata ski-resort classification is incomplete and may include stale entities.','Locality and region are not reverse-geocoded; missing values remain incomplete.','Deterministic deduplication intentionally favors false negatives over unsafe merges.']}
const publicRecords=canonical.filter(({confidence})=>confidence==='medium'||confidence==='high')
const compact=publicRecords.map(({stable_id,name,alternate_names,locality,region,country,coordinates,official_website,operating_status,resort_type,mountain_facts,mountain_observations,overview,verification_status,confidence,source_records})=>({id:stable_id,n:name,a:alternate_names,l:locality,r:region,c:country,p:coordinates?[coordinates.latitude,coordinates.longitude]:null,w:official_website,s:operating_status,t:resort_type,f:mountain_facts||{},mf:mountain_observations||[],...(overview?{ov:overview}:{}),v:verification_status,q:confidence,x:[...new Set(source_records.map(s=>s.source))],sx:source_records.filter(s=>s.url).map(s=>({name:s.source,url:s.url}))}))
const publicSummary={...summary,canonical_count:publicRecords.length,country_count:new Set(publicRecords.map(r=>r.country).filter(Boolean)).size,verified_count:publicRecords.filter(r=>r.verification_status==='verified').length}
await Promise.all([writeJson(new URL('canonical-resorts.json',generated),canonical),writeJson(new URL('ambiguities.json',generated),ambiguities),writeJson(new URL('exclusions.json',generated),exclusions),writeJson(new URL('summary.json',generated),summary),writeJson(new URL('quality-report.json',generated),quality),writeJson(new URL('public/data/resorts.compact.json',root),{generated_at:COLLECTION_DATE,summary:publicSummary,records:compact})])
const md=`# Global Resort Data Quality Report\n\nGenerated: ${COLLECTION_DATE}\n\n- Raw candidates: ${summary.total_raw}\n- Canonical records: ${summary.canonical_count}\n- Verified: ${summary.verified_count}\n- Candidates: ${summary.candidate_count}\n- Uncertain: ${summary.uncertain_count}\n- Incomplete: ${summary.incomplete_count}\n- Exclusions: ${summary.exclusion_count}\n- Ambiguities: ${summary.ambiguity_count}\n- Represented countries: ${summary.country_count}\n- Coordinate coverage: ${quality.coordinate_coverage}%\n- Country coverage: ${quality.country_coverage}%\n- Website coverage: ${quality.website_coverage}%\n\n## Limitations\n\n${quality.limitations.map(x=>`- ${x}`).join('\n')}\n`
await import('node:fs/promises').then(fs=>fs.writeFile(new URL('QUALITY_REPORT.md',generated),md))
console.log(JSON.stringify(summary,null,2))
