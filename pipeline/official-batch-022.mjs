const checked='2026-10-04'
const fact=(key,label,value,unit,source,note='',extra={})=>({key,label,value,unit,source,note,retrieved_at:checked,source_published_at:null,status:'source_checked',confidence:'medium',...extra})

export const officialBatch=[
  {id:'wikidata:item:Q3230435',source:'https://www.chamberymontagnes.com/aillonsmargeriaz/que-faire/ski-glisse/ski-alpin/',observations:[
    fact('piste_length','Margériaz alpine pistes',25,'km','https://www.chamberymontagnes.com/aillonsmargeriaz/que-faire/ski-glisse/ski-alpin/','Local Margériaz downhill domain; excludes the separate Nordic trails.'),
    fact('difficulty_mix','Published local piste mix','5 green · 14 blue · 3 red · 2 black','','https://www.chamberymontagnes.com/aillonsmargeriaz/que-faire/ski-glisse/ski-alpin/','Difficulty counts are for the local Margériaz alpine domain.'),
    fact('base','Published lower ski-area elevation',1400,'m','https://reservation.chamberymontagnes.com/meteo-iframe.html','Current official conditions page labels the lower slopes at 1,400 m.'),
    fact('summit','Published upper ski-area elevation',1800,'m','https://reservation.chamberymontagnes.com/meteo-iframe.html','Current official conditions page labels the upper slopes at 1,800 m.'),
    fact('lifts','Lift installations',10,'','https://reservation.chamberymontagnes.com/meteo-iframe.html','Published total on the official live-status page; operational availability varies.')
  ]},
  {id:'wikidata:item:Q130260373',source:'https://www.semnoz.fr/presentation-du-domaine/',observations:[
    fact('piste_length','Alpine piste length',15,'km','https://www.semnoz.fr/presentation/','Downhill total; the separately published Nordic network is excluded.'),
    fact('summit','Published ski-area summit',1704,'m','https://www.semnoz.fr/presentation-du-domaine/','The official page says the two alpine sectors meet above 1,704 m.'),
    fact('chairlifts','Chairlifts',2,'','https://www.semnoz.fr/prix-forfaits-alpin/','The official pricing page refers to reduced pricing when the station’s two chairlifts are not operating.')
  ]},
  {id:'wikidata:item:Q207589',source:'https://www.valdisere.com/en/val-disere-in-winter/skiing-winter-fun/ski-area-french-alps/?version=jcdecaux',observations:[
    fact('vertical','Linked-area elevation range',1900,'m','https://www.valdisere.com/en/val-disere/','Published elevation range for the linked Tignes–Val d’Isère area, not a single lift-served descent.'),
    fact('piste_length','Linked-area marked runs',300,'km','https://www.valdisere.com/en/val-disere-in-winter/skiing-winter-fun/ski-area-french-alps/?version=jcdecaux','Combined Tignes–Val d’Isère domain.'),
    fact('trails','Linked-area marked runs',161,'','https://www.valdisere.com/en/val-disere-in-winter/skiing-winter-fun/ski-area-french-alps/?version=jcdecaux','Combined Tignes–Val d’Isère domain; the listed difficulty subtotals do not sum to this headline total.'),
    fact('lifts','Linked-area ski lifts',71,'','https://www.valdisere.com/en/val-disere-in-winter/skiing-winter-fun/ski-area-french-alps/?version=jcdecaux','Combined Tignes–Val d’Isère domain.'),
    fact('base','Linked-area minimum elevation',1550,'m','https://www.valdisere.com/en/val-disere-in-winter/skiing-winter-fun/ski-area-french-alps/?version=jcdecaux','Combined Tignes–Val d’Isère domain.'),
    fact('summit','Linked-area upper elevation',3400,'m','https://www.valdisere.com/en/val-disere-in-winter/skiing-winter-fun/ski-area-french-alps/?version=jcdecaux','The official page states skiing extends above 3,400 m; stored as the published threshold.',{qualifier:'more_than'}),
    fact('snowmaking','Snowmaking-covered pistes',65,'km','https://www.valdisere.com/en/val-disere-in-winter/skiing-winter-fun/ski-area-french-alps/?version=jcdecaux','Combined Tignes–Val d’Isère domain; official page states more than 65 km.',{qualifier:'more_than'}),
    fact('operating_season','Published 2026–27 season','Nov 28, 2026 – May 2, 2027','','https://www.valdisere.com/en/val-disere-in-winter/skiing-winter-fun/ski-area-french-alps/?version=jcdecaux','Scheduled dates remain subject to conditions.',{source_period:'2026–27'})
  ]},
  {id:'wikidata:item:Q46995824',source:'https://www.bergeralm.net/winterpreise/',observations:[
    fact('operating_season','Published 2026–27 season','Nov 28, 2026 – Apr 4, 2027','','https://www.bergeralm.net/winterpreise/','Scheduled dates remain subject to conditions.',{source_period:'2026–27'}),
    fact('night_skiing_schedule','Published night-ski schedule','Wed, Fri & Sat · Dec 18, 2026 – Mar 6, 2027','','https://www.bergeralm.net/winterpreise/','Published evening lift operation is 18:30–21:30.',{source_period:'2026–27'})
  ]},
]

export function applyOfficialBatch022(records){
  const byId=new Map(records.map(r=>[r.stable_id,r]));let observations=0
  for(const entry of officialBatch){const record=byId.get(entry.id);if(!record)throw new Error(`Official batch 022 missing ${entry.id}`);record.mountain_observations||=[];for(const observation of entry.observations){if(record.mountain_observations.some(f=>f.key===observation.key))throw new Error(`Official batch 022 duplicate field ${entry.id}:${observation.key}`);record.mountain_observations.push(observation);record.field_provenance[`mountain.${observation.key}`]={...structuredClone(observation),batch:'official-022',source_record_ids:[observation.source]};observations++}if(!record.source_records.some(s=>s.record_id===entry.source))record.source_records.push({source:'official_resort',record_id:entry.source,url:entry.source,license:'factual-observations-only; page copyright retained by publisher',collected_at:checked})}
  return {reviewed_at:checked,profiles:officialBatch.length,observations}
}
