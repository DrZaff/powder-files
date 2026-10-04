import { normalizeName } from './lib/normalize.mjs'

const checked='2026-10-04'
const uniqueSources=rows=>[...new Map(rows.flatMap(r=>r.source_records||[]).map(s=>[`${s.source}|${s.record_id}`,s])).values()]

const merges=[
  {target:'wikidata:item:Q110914605',ids:['wikidata:item:Q110914605','wikidata:item:Q30141184'],name:'Lac Blanc',note:'Two Wikidata items describe the same Orbey ski area; the official-site-linked ski-area item is canonical.',evidence:'https://www.lac-blanc.com'},
  {target:'wikidata:item:Q3368414',ids:['wikidata:item:Q3368414','wikidata:item:Q137052565'],name:'Passy Plaine-Joux',note:'Near-identical location and locality records describe the same Passy Plaine-Joux ski area.',evidence:'https://www.passy-mont-blanc.com/activites/ski-et-glisse/ski-alpin/'},
  {target:'wikidata:item:Q60726558',ids:['wikidata:item:Q60726558','wikidata:item:Q116459866'],name:'St. Jakob im Defereggental',note:'Near-identical St. Jakob ski-area records are consolidated into the official-site-linked identity.',evidence:'https://www.stjakob-ski.at/winter/lifte-und-pisten'},
  {target:'wikidata:item:Q49177812',ids:['wikidata:item:Q49177812'],name:'Ski Santa Fe',coordinates:{latitude:35.796325,longitude:-105.801281},region:'Santa Fe County',note:'Repeated Wikidata rows contained two coordinates; the ski-area coordinate is retained and the city coordinate rejected.',evidence:'https://www.skisantafe.com/getting-here/directions'},
  {target:'wikidata:item:Q6363223',ids:['wikidata:item:Q6363223'],name:'Sella Nevea',country:'Italy',region:'Friuli Venezia Giulia',official_website:'https://www.turismofvg.it/en/mountain365/sella-nevea/sella-nevea-winter-opening-schedule',note:'The cross-border item produced duplicate country rows. The active Italian Sella Nevea operation is retained; the Slovenian Kanin side is not represented as currently active.',evidence:'https://www.turismofvg.it/en/mountain365/sella-nevea/sella-nevea-winter-opening-schedule'},
  {target:'wikidata:item:Q14685139',ids:['wikidata:item:Q14685139','openstreetmap:way:531009607'],name:'Vail Ski Resort',country:'United States',region:'Colorado',official_website:'https://www.vail.com',confidence:'high',verification_status:'candidate',note:'Wikidata and OpenStreetMap describe the same active Vail ski area. Their mapped centers differ because each source represents the large resort boundary differently; the shared official domain and compatible names resolve the identity.',evidence:'https://www.vail.com/the-mountain/about-the-mountain/mountain-info.aspx'},
  {target:'wikidata:item:Q12053500',ids:['wikidata:item:Q12053500','openstreetmap:way:531005985'],name:'Breckenridge Ski Resort',country:'United States',region:'Colorado',official_website:'https://www.breckenridge.com',confidence:'high',verification_status:'candidate',note:'Wikidata and OpenStreetMap describe the same active Breckenridge ski area. Their mapped centers differ because each source represents the resort footprint differently; the shared official domain and compatible names resolve the identity.',evidence:'https://www.breckenridge.com/the-mountain/about-the-mountain/mountain-info.aspx'},
]

const exclusions=[
  {id:'wikidata:item:Q592910',name:'Kitzbühel Alps',reason:'lift_free_or_non_resort',note:'The item represents the Kitzbühel Alps mountain range, not one lift-served resort.',evidence:'https://www.wikidata.org/wiki/Q592910'},
  {id:'wikidata:item:Q3311533',name:'Mischliffen',reason:'lift_free_or_non_resort',note:'The item has conflicting locations and does not provide sufficient evidence of a current lift-served resort identity.',evidence:'https://www.wikidata.org/wiki/Q3311533'},
]

function collapse(records,rule){
  const matches=records.filter(r=>rule.ids.includes(r.stable_id));if(!matches.length)throw new Error(`Identity resolution missing: ${rule.target}`)
  const richness=r=>(r.mountain_observations?.length||0)*10+(r.overview?5:0)+(r.official_website?2:0)+(r.source_records?.length||0)
  const ordered=[...matches].sort((a,b)=>(b.stable_id===rule.target)-(a.stable_id===rule.target)||richness(b)-richness(a)),preferred=ordered[0]
  const observations=[...new Map(ordered.flatMap(r=>r.mountain_observations||[]).map(f=>[f.key,f])).values()]
  const merged={...preferred,stable_id:rule.target,name:rule.name,normalized_name:normalizeName(rule.name),alternate_names:[...new Set(matches.flatMap(r=>[r.name,...(r.alternate_names||[])]))].filter(n=>normalizeName(n)!==normalizeName(rule.name)),source_records:uniqueSources(matches),field_provenance:Object.assign({},...ordered.toReversed().map(r=>r.field_provenance||{})),mountain_observations:observations,overview:ordered.find(r=>r.overview)?.overview,identity_resolution:{reviewed_at:checked,merged_ids:[...new Set(matches.map(r=>r.stable_id))],source_row_count:matches.length,note:rule.note,evidence_url:rule.evidence}}
  for(const key of ['coordinates','country','region','official_website','confidence','verification_status'])if(rule[key]!==undefined)merged[key]=rule[key]
  for(let i=records.length-1;i>=0;i--)if(rule.ids.includes(records[i].stable_id))records.splice(i,1)
  records.push(merged)
  return {target:rule.target,removed_rows:matches.length-1,merged_ids:merged.identity_resolution.merged_ids}
}

export function applyIdentityResolutions(records,excluded){
  const mergeReport=merges.map(rule=>collapse(records,rule))
  const exclusionReport=[]
  for(const rule of exclusions){const matches=records.filter(r=>r.stable_id===rule.id);if(!matches.length)throw new Error(`Identity exclusion missing: ${rule.id}`);for(let i=records.length-1;i>=0;i--)if(records[i].stable_id===rule.id)records.splice(i,1);excluded.push({stable_id:rule.id,name:rule.name,source_records:uniqueSources(matches),reason:rule.reason,curated:true,evidence_url:rule.evidence,note:rule.note,reviewed_at:checked});exclusionReport.push({id:rule.id,removed_rows:matches.length,reason:rule.reason})}
  const crystalNames=new Map([['wikidata:item:Q1624333','Crystal Mountain (Washington)'],['wikidata:item:Q5191297','Crystal Mountain (Michigan)']])
  for(const record of records){const name=crystalNames.get(record.stable_id);if(name){record.name=name;record.normalized_name=normalizeName(name);record.identity_resolution={reviewed_at:checked,note:'State qualifier distinguishes two separate active resorts with the same public name.',evidence_url:record.official_website}}}
  return {reviewed_at:checked,merges:mergeReport,exclusions:exclusionReport,disambiguated:[...crystalNames].map(([id,name])=>({id,name}))}
}

export { merges as identityMerges, exclusions as identityExclusions }
