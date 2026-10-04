const checked='2026-10-04'
const fact=(key,label,value,unit,source,note='',extra={})=>({key,label,value,unit,source,note,retrieved_at:checked,source_published_at:null,status:'source_checked',confidence:'medium',...extra})

export const officialBatch=[
  {id:'wikidata:item:Q14685139',source:'https://www.vail.com/the-mountain/about-the-mountain/mountain-info.aspx',overview:'Vail is a large Colorado destination known for wide groomers, expansive Back Bowls and the wooded terrain of Blue Sky Basin. Its scale supports long exploratory days, while the official difficulty mix leans toward intermediate and advanced skiing.',observations:[
    fact('summit','Highest elevation',11570,'ft','https://www.vail.com/the-mountain/about-the-mountain/mountain-info.aspx'),
    fact('base','Base elevation',8120,'ft','https://www.vail.com/the-mountain/about-the-mountain/mountain-info.aspx'),
    fact('terrain_area','Skiable terrain',5317,'acres','https://www.vail.com/the-mountain/about-the-mountain/mountain-info.aspx'),
    fact('lifts','Lifts',32,'','https://www.vail.com/the-mountain/about-the-mountain/mountain-info.aspx'),
    fact('trails','Trails',278,'','https://www.vail.com/the-mountain/about-the-mountain/mountain-info.aspx'),
    fact('longest_run','Longest run',4,'mi','https://www.vail.com/the-mountain/about-the-mountain/mountain-info.aspx','Riva Ridge.'),
    fact('snowfall','Average snowfall',354,'in','https://www.vail.com/the-mountain/about-the-mountain/mountain-info.aspx'),
    fact('difficulty_mix','Published terrain mix','18% beginner · 29% intermediate · 53% advanced','','https://www.vail.com/the-mountain/about-the-mountain/mountain-info.aspx')
  ]},
  {id:'wikidata:item:Q12053500',source:'https://www.breckenridge.com/the-mountain/about-the-mountain/mountain-info.aspx',overview:'Breckenridge spreads its skiing across five distinct peaks, pairing approachable lower-mountain terrain with extensive high-alpine routes. The range of difficulty and three terrain parks makes it useful for mixed-ability groups as well as expert-focused trips.',observations:[
    fact('summit','Highest elevation',12998,'ft','https://www.breckenridge.com/the-mountain/about-the-mountain/mountain-info.aspx','Peak 8.'),
    fact('base','Base elevation',9600,'ft','https://www.breckenridge.com/the-mountain/about-the-mountain/mountain-info.aspx'),
    fact('terrain_area','Skiable terrain',2908,'acres','https://www.breckenridge.com/the-mountain/about-the-mountain/mountain-info.aspx'),
    fact('lifts','Lifts',35,'','https://www.breckenridge.com/the-mountain/about-the-mountain/mountain-info.aspx'),
    fact('trails','Trails',187,'','https://www.breckenridge.com/the-mountain/about-the-mountain/mountain-info.aspx'),
    fact('snowfall','Average snowfall',355,'in','https://www.breckenridge.com/the-mountain/about-the-mountain/mountain-info.aspx'),
    fact('terrain_parks','Terrain parks',3,'','https://www.breckenridge.com/the-mountain/about-the-mountain/mountain-info.aspx'),
    fact('difficulty_mix','Published terrain mix','11% beginner · 31% intermediate · 24% advanced · 34% expert','','https://www.breckenridge.com/the-mountain/about-the-mountain/mountain-info.aspx')
  ]},
]

export function applyOfficialBatch024(records){
  const byId=new Map(records.map(r=>[r.stable_id,r]));let observations=0
  for(const entry of officialBatch){
    const record=byId.get(entry.id);if(!record)throw new Error(`Official batch 024 missing ${entry.id}`)
    record.overview={text:entry.overview,sources:[entry.source],reviewed_at:checked,kind:'editorial_summary'}
    record.field_provenance.overview={value:entry.overview,source_record_ids:[entry.source],confidence:'medium',batch:'official-024'}
    record.mountain_observations||=[]
    for(const observation of entry.observations){if(record.mountain_observations.some(f=>f.key===observation.key))throw new Error(`Official batch 024 duplicate field ${entry.id}:${observation.key}`);record.mountain_observations.push(observation);record.field_provenance[`mountain.${observation.key}`]={...structuredClone(observation),batch:'official-024',source_record_ids:[observation.source]};observations++}
    if(!record.source_records.some(s=>s.record_id===entry.source))record.source_records.push({source:'official_resort',record_id:entry.source,url:entry.source,license:'factual-observations-only; page copyright retained by publisher',collected_at:checked})
  }
  return {reviewed_at:checked,profiles:officialBatch.length,observations}
}
