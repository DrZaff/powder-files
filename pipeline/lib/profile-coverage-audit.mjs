const FACT_GROUPS={
  vertical:['vertical'],
  terrain_area:['area'],
  trails:['trails'],
  lifts:['lifts'],
  summit_elevation:['summit'],
  base_elevation:['base'],
  skiing_elevation:['skiing_elevation'],
  longest_run:['longest_run'],
  snowfall:['snowfall'],
  snowmaking:['snowmaking','snowmaking_area','snowmaking_length'],
  difficulty_mix:['easy_pistes','intermediate_pistes','difficult_pistes','intermediate','expert'],
  operating_season:['season','operating_season'],
  night_skiing:['night_trails','night_length','night_area','lit_trails','lighting','lit_terrain','lit_piste_length'],
  terrain_parks:['parks','snowparks','park_area','park_lines'],
}

const CORE=['vertical','terrain_area','trails','lifts','summit_elevation','base_elevation']
const hasValue=f=>f.status!=='conflict'&&f.value!==null&&f.value!==undefined
const host=url=>{try{return new URL(url).hostname.replace(/^www\./,'')}catch{return null}}
const daysBetween=(a,b)=>Math.floor((new Date(a)-new Date(b))/86400000)

export function auditProfile(record,asOf){
  const observations=record.mountain_observations||[]
  const facts={}
  for(const [group,keys] of Object.entries(FACT_GROUPS)){
    const matches=observations.filter(f=>keys.includes(f.key))
    facts[group]={available:matches.some(hasValue),conflict:matches.some(f=>f.status==='conflict'),source_checked:matches.some(f=>f.status==='source_checked'&&hasValue(f)),structured_only:matches.some(hasValue)&&!matches.some(f=>f.status==='source_checked'&&hasValue(f))}
  }
  const officialFacts=observations.filter(f=>f.status==='source_checked'&&hasValue(f))
  const conflicts=observations.filter(f=>f.status==='conflict')
  const dated=observations.filter(f=>f.retrieved_at&&!Number.isNaN(new Date(f.retrieved_at).valueOf()))
  const stale=dated.filter(f=>daysBetween(asOf,f.retrieved_at)>365)
  const missingCore=CORE.filter(k=>!facts[k].source_checked)
  const sourceHosts=[...new Set(observations.flatMap(f=>[f.source,...(f.alternatives||[]).map(a=>a.source)]).map(host).filter(Boolean))]
  const hasWikidata=record.source_records?.some(s=>s.source==='wikidata')||false
  const hasOsm=record.source_records?.some(s=>s.source==='openstreetmap')||false
  let score=missingCore.length*8+conflicts.length*6+(officialFacts.length?0:24)+(record.official_website?0:16)+(record.overview?0:8)+(stale.length?8:0)
  score=Math.min(100,score)
  const priority=score>=70?'critical':score>=45?'high':score>=20?'medium':'low'
  const recommendedSources=[]
  if(record.official_website)recommendedSources.push({type:'official_resort',purpose:'Current mountain statistics, trail map, operations and published fact sheets',url:record.official_website})
  else recommendedSources.push({type:'official_site_discovery',purpose:'Locate and verify the resort’s current official website',url:null})
  if(hasOsm||record.coordinates)recommendedSources.push({type:'openstreetmap_topology',purpose:'Cross-check mapped lifts, pistes, difficulty tags and resort extent; never treat incomplete map counts as official totals',url:'https://www.openstreetmap.org/copyright'})
  if(hasWikidata)recommendedSources.push({type:'wikidata_statements',purpose:'Check structured identifiers, elevation statements, operator and official-site links',url:'https://www.wikidata.org/wiki/Wikidata:Data_access'})
  recommendedSources.push({type:'public_authority',purpose:'Check tourism, land-manager or municipal sources for access, status and operating scope',url:null})
  return {id:record.stable_id,name:record.name,country:record.country||null,verification_status:record.verification_status,confidence:record.confidence,official_website:record.official_website||null,overview:!!record.overview,coordinates:!!record.coordinates,facts,official_fact_count:officialFacts.length,observation_count:observations.length,conflicts:conflicts.map(f=>f.key),stale_fields:stale.map(f=>f.key),missing_core_fields:missingCore,source_hosts:sourceHosts,priority_score:score,priority,recommended_sources:recommendedSources}
}

export function buildProfileCoverageAudit(records,asOf){
  const profiles=records.filter(r=>['medium','high'].includes(r.confidence)).map(r=>auditProfile(r,asOf)).sort((a,b)=>b.priority_score-a.priority_score||a.name.localeCompare(b.name))
  const repeatedIdGroups=Object.values(Object.groupBy(profiles,p=>p.id)).filter(group=>group.length>1)
  const nameGroups=Object.values(Object.groupBy(profiles,p=>`${p.name.trim().toLocaleLowerCase()}|${p.country||''}`)).map(group=>[...new Map(group.map(p=>[p.id,p])).values()]).filter(group=>group.length>1)
  const duplicateIds=new Map(nameGroups.flatMap(group=>group.map(p=>[p.id,group.filter(x=>x.id!==p.id).map(x=>x.id)])))
  for(const profile of profiles)profile.possible_duplicate_ids=duplicateIds.get(profile.id)||[]
  const coverage={}
  for(const key of Object.keys(FACT_GROUPS))coverage[key]={available:profiles.filter(p=>p.facts[key].available).length,source_checked:profiles.filter(p=>p.facts[key].source_checked).length,conflict:profiles.filter(p=>p.facts[key].conflict).length}
  const priorities=Object.fromEntries(['critical','high','medium','low'].map(k=>[k,profiles.filter(p=>p.priority===k).length]))
  const summary={generated_at:asOf,profiles:profiles.length,unique_stable_ids:new Set(profiles.map(p=>p.id)).size,with_official_facts:profiles.filter(p=>p.official_fact_count).length,without_official_facts:profiles.filter(p=>!p.official_fact_count).length,with_official_website:profiles.filter(p=>p.official_website).length,without_official_website:profiles.filter(p=>!p.official_website).length,with_overview:profiles.filter(p=>p.overview).length,without_overview:profiles.filter(p=>!p.overview).length,conflict_profiles:profiles.filter(p=>p.conflicts.length).length,stale_profiles:profiles.filter(p=>p.stale_fields.length).length,complete_core_profiles:profiles.filter(p=>!p.missing_core_fields.length).length,repeated_stable_ids:repeatedIdGroups.length,repeated_rows:repeatedIdGroups.reduce((n,g)=>n+g.length-1,0),possible_duplicate_groups:nameGroups.length,possible_duplicate_profiles:duplicateIds.size,coverage,priorities}
  return {summary,profiles,repeated_id_groups:repeatedIdGroups.map(group=>({id:group[0].id,name:group[0].name,rows:group.length})),duplicate_name_groups:nameGroups.map(group=>({name:group[0].name,country:group[0].country,ids:group.map(p=>p.id)})),priority_queue:profiles.filter(p=>p.priority!=='low').map(({id,name,country,priority,priority_score,missing_core_fields,conflicts,stale_fields,possible_duplicate_ids,official_website,recommended_sources})=>({id,name,country,priority,priority_score,missing_core_fields,conflicts,stale_fields,possible_duplicate_ids,official_website,recommended_sources}))}
}

export function coverageAuditMarkdown(summary){
  const rows=Object.entries(summary.coverage).map(([field,v])=>`| ${field.replaceAll('_',' ')} | ${v.source_checked} | ${v.available} | ${v.conflict} | ${((v.source_checked/summary.profiles)*100).toFixed(1)}% |`).join('\n')
  return `# Resort profile coverage audit\n\nGenerated: ${summary.generated_at}\n\nThis audit measures the ${summary.profiles} medium- and high-confidence public profiles. A field counts as source-checked only when a usable value is tied to an official-source observation. Structured map or knowledge-graph data is reported separately and does not become an official resort claim.\n\n## Headline coverage\n\n- Profiles with at least one official fact: ${summary.with_official_facts}\n- Profiles without any official facts: ${summary.without_official_facts}\n- Profiles with an official website: ${summary.with_official_website}\n- Profiles without an official website: ${summary.without_official_website}\n- Profiles with an overview: ${summary.with_overview}\n- Profiles without an overview: ${summary.without_overview}\n- Profiles with unresolved conflicts: ${summary.conflict_profiles}\n- Profiles with facts older than 365 days: ${summary.stale_profiles}\n- Profiles with all six core fields: ${summary.complete_core_profiles}\n- Repeated stable IDs: ${summary.repeated_stable_ids} identifiers producing ${summary.repeated_rows} extra rows\n- Same-name identity review: ${summary.possible_duplicate_profiles} profiles across ${summary.possible_duplicate_groups} groups\n\n## Field coverage\n\n| Field | Official source | Any usable source | Conflicts | Official coverage |\n| --- | ---: | ---: | ---: | ---: |\n${rows}\n\n## Enrichment priority\n\n- Critical: ${summary.priorities.critical}\n- High: ${summary.priorities.high}\n- Medium: ${summary.priorities.medium}\n- Low: ${summary.priorities.low}\n\nPriority rises for missing core facts, no official-source facts, no official website, unresolved conflicts, missing overview copy and stale observations. It is a research-order tool, not a quality grade shown to visitors. Repeated IDs and same-name records are queued for identity review rather than merged automatically.\n\n## Source expansion strategy\n\n1. Resort-owned mountain-statistics pages, trail maps and fact sheets remain the authority for displayed operational totals.\n2. OpenStreetMap lift and piste topology is the next reusable structured source (ODbL). It can identify possible lifts, pistes, difficulty tags and boundaries, but incomplete mapping must never be presented as an official total.\n3. Wikidata CC0 statements can add identifiers, operators, official websites and carefully qualified elevation observations.\n4. Government tourism, municipal and public land-manager pages can verify access, operating status and scope.\n5. Conflicts stay withheld until scope, date or source authority resolves them. Copyrighted descriptions and imagery are not imported.\n`
}

export { FACT_GROUPS }
