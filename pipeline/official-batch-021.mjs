const checked='2026-10-04'
const fact=(key,label,value,unit,source,note='',extra={})=>({key,label,value,unit,source,note,retrieved_at:checked,source_published_at:null,status:'source_checked',confidence:'medium',...extra})

export const officialBatch=[
  {id:'wikidata:item:Q4892259',source:'https://www.berkshireeast.com/the-resort',observations:[
    fact('vertical','Vertical drop',1180,'ft','https://www.berkshireeast.com/the-resort'),fact('area','Skiable terrain',180,'acres','https://www.berkshireeast.com/the-resort'),fact('trails','Trails',45,'','https://www.berkshireeast.com/the-resort'),fact('night_trails','Night-skiing trails',18,'','https://www.berkshireeast.com/the-resort'),fact('summit','Summit elevation',1840,'ft','https://www.berkshireeast.com/the-resort'),fact('snowfall','Average annual snowfall',110,'in','https://www.berkshireeast.com/the-resort'),fact('snowmaking','Snowmaking coverage',100,'%','https://www.berkshireeast.com/the-resort'),fact('longest_run','Longest run',13200,'ft','https://www.berkshireeast.com/the-resort'),fact('difficulty_mix','Published terrain mix','30% beginner · 35% intermediate · 30% advanced · 5% expert','','https://www.berkshireeast.com/the-resort'),
    fact('lifts','Published lift count',null,'','https://www.berkshireeast.com/the-resort','The page headline says five lifts, while its lift-type list totals six. Powder Files preserves the disagreement rather than choosing a value.',{status:'conflict',confidence:'low',alternatives:[{value:5,source:'https://www.berkshireeast.com/the-resort'},{value:6,source:'https://www.berkshireeast.com/the-resort'}]})
  ]},
  {id:'wikidata:item:Q4944773',source:'https://www.rideboreal.com/explore/who-we-are/what-to-expect-br/',observations:[fact('lifts','Lifts',7,'','https://www.rideboreal.com/explore/who-we-are/what-to-expect-br/','The resort notes that individual lifts operate on different schedules.')]},
  {id:'wikidata:item:Q4982867',source:'https://buckhill.com/skiing-snowboarding/winter-trail-map/',observations:[
    fact('trails','Named runs',15,'','https://buckhill.com/skiing-snowboarding/winter-trail-map/','Counted from the official trail-map run list.'),fact('lifts','Ski-access lifts',9,'','https://buckhill.com/skiing-snowboarding/winter-trail-map/','Counted from the official map; excludes the separately listed snow-tubing carpet and includes chairlifts, rope tows and conveyors.'),fact('parks','Terrain-park areas',6,'','https://buckhill.com/skiing-snowboarding/winter-trail-map/','Counted from the official map’s terrain-park list.')
  ]},
  {id:'wikidata:item:Q16890068',source:'https://caberfaepeaks.com/snow-report/',observations:[fact('trails','Slopes',27,'','https://caberfaepeaks.com/snow-report/'),fact('lifts','Lifts',5,'','https://caberfaepeaks.com/snow-report/')]},
  {id:'wikidata:item:Q5018299',source:'https://calabogie.com/snow-school-faqs/',observations:[
    fact('trails','Trails',24,'','https://calabogie.com/snow-school-faqs/'),fact('chairlifts','Chairlifts',2,'','https://calabogie.com/snow-school-faqs/'),fact('beginner_conveyors','Beginner carpets',1,'','https://calabogie.com/snow-school-faqs/','The official FAQ describes one beginner carpet area in addition to two chairlifts.')
  ]},
  {id:'wikidata:item:Q257350',source:'https://www.hoch-ybrig.ch/winter/gebiet/betriebszeiten-anlagen/',observations:[
    fact('lifts','Listed lift installations',13,'','https://www.hoch-ybrig.ch/winter/gebiet/betriebszeiten-anlagen/','Counted from the official installations table, including two conveyor belts.'),fact('highest_lift_station','Highest listed lift station',1831,'m','https://www.hoch-ybrig.ch/winter/gebiet/betriebszeiten-anlagen/','Top station of the Hesisbol chairlift; this is not claimed as the resort summit.'),fact('longest_lift','Longest listed lift',2174,'m','https://www.hoch-ybrig.ch/winter/gebiet/betriebszeiten-anlagen/','Length of the Laucheren chairlift; this is an installation length, not a ski-run length.')
  ]},
]

export function applyOfficialBatch021(records){
  const byId=new Map(records.map(r=>[r.stable_id,r]));let observations=0
  for(const entry of officialBatch){const record=byId.get(entry.id);if(!record)throw new Error(`Official batch 021 missing ${entry.id}`);record.mountain_observations||=[];for(const observation of entry.observations){if(record.mountain_observations.some(f=>f.key===observation.key))throw new Error(`Official batch 021 duplicate field ${entry.id}:${observation.key}`);record.mountain_observations.push(observation);record.field_provenance[`mountain.${observation.key}`]={...structuredClone(observation),batch:'official-021',source_record_ids:[observation.source]};observations++}if(!record.source_records.some(s=>s.record_id===entry.source))record.source_records.push({source:'official_resort',record_id:entry.source,url:entry.source,license:'factual-observations-only; page copyright retained by publisher',collected_at:checked})}
  return {reviewed_at:checked,profiles:officialBatch.length,observations}
}
