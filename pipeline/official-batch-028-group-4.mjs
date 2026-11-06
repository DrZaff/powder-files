const checked='2026-11-06'
const fact=(key,label,value,unit,source,note='',extra={})=>({key,label,value,unit,source,note,retrieved_at:checked,source_published_at:null,status:'source_checked',confidence:'high',qualifier:'exact',scope:'local_resort',...extra})
const entry=(id,overview,observations,{operator=null,statusSource,inventory=[]})=>({id,overview,observations,operator,statusSource,inventory})

const alpe='https://www.alpedhuez.com/fr/blog/espace-alpe-dhuez-une-montagne-cinq-visages-mille-descentes/'
const alpePark='https://www.alpedhuez.com/fr/blog/10-raisons-de-skier-a-lalpe/'
const alpeHome='https://www.alpedhuez.com/fr/'
const deux='https://www.les2alpes.com/hiver/skier-aux-2-alpes/domaine-skiable/'
const deuxSeason='https://www.les2alpes.com/hiver/skier-aux-2-alpes/'
const clusaz='https://www.laclusaz.com/ski/ski-alpin/'
const laax='https://www.laax.com/en/ski-snowboard'
const laaxHome='https://www.laax.com/en'
const crans='https://www.crans-montana.ch/fr/activites/ski'
const cransGlacier='https://www.crans-montana.ch/fr/activites/glacier_plaine_morte'
const cma='https://www.mycma.ch/'

export const officialBatch028Group4=[
  entry('wikidata:item:Q214364',"Alpe d'Huez anchors a large linked domain in the Oisans that reaches Vaujany, Oz-en-Oisans, Auris-en-Oisans and Villard-Reculas. Gentle resort-front terrain gives way to long, steep descents from the Pic Blanc cable car, including the 16-kilometre Sarenne black run.",[
    fact('piste_length','Pistes (whole domain)',250,'km',alpe,'Covers the full linked Grand Domaine and its villages.',{scope:'linked_domain'}),
    fact('skiing_elevation','Pic Blanc (top of cable car)',3330,'m',alpe,'The source explicitly identifies cable-car access.',{scope:'lift_served'}),
    fact('named_run_length','Sarenne black run length',16,'km',alpe,'Starts at the Pic Blanc summit station.'),
    fact('named_run_vertical','Tunnel run vertical descent',1350,'m',alpe,'Published from the Tunnel exit at 3,000 m to Montfrais at 1,650 m; this is not resort vertical.'),
    fact('terrain_parks','Snowpark area',20,'ha',alpePark,'Published as more than 20 hectares.',{qualifier:'more_than',confidence:'medium'}),
    fact('season','2026–27 season sales','Season ski-pass promotion live; tourist-office pre-season hours published to 2026-12-04','',alpeHome,'Opening date was not available from the lift-operator site.',{scope:'linked_domain',qualifier:'seasonal',confidence:'low',source_period:'2026–27'}),
  ],{statusSource:alpeHome,inventory:[{url:alpe,type:'tourism_authority'},{url:alpePark,type:'tourism_authority'},{url:alpeHome,type:'tourism_authority'},{url:'https://www.wikidata.org/wiki/Q214364',type:'structured_cc0'}]}),

  entry('wikidata:item:Q974478','Les 2 Alpes climbs from its village to a glacier at 3,600 metres in the Écrins massif, keeping most terrain above 2,000 metres and extending skiing into spring. One continuous, operator-published descent runs from the glacier to Mont-de-Lans, while beginner zones sit high at 2,100 and 2,600 metres.',[
    fact('skiing_elevation','Highest point of the ski area',3600,'m',deux,'Lift service to the exact point is not explicitly stated.',{confidence:'medium'}),
    fact('vertical','Maximum vertical descent',2300,'m',deux,'Operator-published descent from the glacier to Mont-de-Lans; not calculated.'),
    fact('base','Lowest point of descent (Mont-de-Lans)',1300,'m',deux,'End of the top-to-bottom descent, not the main resort base.',{confidence:'medium'}),
    fact('piste_length','Pistes',220,'km',deux),
    fact('night_skiing','Night skiing','Vallée Blanche: one red run (400 m vertical) plus one green run','',deux,'Seasonal offering.',{qualifier:'seasonal',confidence:'medium'}),
    fact('season','2026–27 season','Winter 2026-11-28 to 2027-05-02; glacier skiing to 2027-05-30; partial training opening to 2027-07-04','',deuxSeason,'Trail totals, difficulty mix and terrain area are withheld because official pages conflict.',{qualifier:'seasonal',source_period:'2026–27'}),
  ],{statusSource:deuxSeason,inventory:[{url:deux,type:'official_resort',note:'Conflicting trail and area values withheld'},{url:'https://www.les2alpes.com/hiver/skier-aux-2-alpes/domaine-skiable/secteurs-et-pistes/',type:'official_resort',note:'Conflicting trail total'},{url:deuxSeason,type:'official_resort'},{url:'https://www.skipass-2alpes.com/fr',type:'official_lift_operator'},{url:'https://www.wikidata.org/wiki/Q974478',type:'structured_cc0'}]}),

  entry('wikidata:item:Q530721',"La Clusaz spreads across five massifs in the Aravis, allowing skiers to follow the sun from L'Étale to Balme. Red and blue pistes dominate the network, and the resort publishes a descent of more than 1,500 metres from its 2,600-metre upper point.",[
    fact('base','Lowest altitude',1100,'m',clusaz),fact('skiing_elevation','Top of ski area',2600,'m',clusaz,'Lift service to the exact point is not explicitly stated.',{confidence:'medium'}),
    fact('vertical','Descent',1500,'m',clusaz,'Published as more than 1,500 metres.',{qualifier:'more_than'}),fact('trails','Pistes',85,'',clusaz),
    fact('difficulty_mix','Published piste counts','8 black · 30 red · 31 blue · 16 green','',clusaz),fact('lifts','Lifts',47,'',clusaz,'No breakdown published.'),
    fact('piste_length','Pistes',125,'km',clusaz,'Measured along the middle of each piste, including turns, according to the operator method.'),fact('massifs','Massifs',5,'',clusaz),
    fact('season','2026–27 opening','Balme opens 5–6 Dec then 12 Dec–25 Apr; other massifs open from 12 or 19 Dec to April','',clusaz,'Weather-dependent; sector dates vary.',{qualifier:'seasonal',source_period:'2026–27'}),
  ],{statusSource:clusaz,inventory:[{url:clusaz,type:'tourism_authority'},{url:'https://www.skipass-laclusaz.com/',type:'official_lift_operator',status:'unavailable during review'}]}),

  entry('openstreetmap:way:599441663','LAAX is one connected ski area above Flims, Laax and Falera, rising to the Vorab Glacier. It is especially known for freestyle, with five snowparks and a large halfpipe, while most of its slopes offer a broad mix of blue and red terrain, much of it above 2,000 metres.',[
    fact('piste_length','Slopes',216,'km',laax),fact('lifts','Lift facilities',30,'',laax),fact('terrain_parks','Snowparks',5,'',laax,'A separate natural off-slope park is not counted.'),
    fact('base','Lowest elevation',1100,'m',laax),fact('skiing_elevation','Highest elevation (Vorab Glacier)',3018,'m',laax,'Not explicitly identified as a lift top.',{confidence:'medium'}),
    fact('season','2026/27 season opening','Season start 2026-11-28; daily operations from 2026-12-05','',laaxHome,'',{qualifier:'seasonal',source_period:'2026–27'}),
  ],{operator:'Weisse Arena Gruppe',statusSource:laaxHome,inventory:[{url:laax,type:'official_operator'},{url:laaxHome,type:'official_operator'}]}),

  entry('wikidata:item:Q138779655','Crans-Montana offers sunny pistes from the resort to the Plaine Morte glacier, with broad Alpine views at the top. The historic Kandahar descent runs eight kilometres from the glacier funitel, and the resort hosts the 2027 FIS Alpine World Championships.',[
    fact('piste_length','Pistes',140,'km',crans),fact('base','Lower altitude of ski area',1500,'m',crans,'Published as a rounded range.',{qualifier:'approximately',confidence:'medium'}),
    fact('skiing_elevation','Upper altitude of ski area',3000,'m',crans,'Rounded upper value; exact lift-top elevation is not published.',{qualifier:'approximately',confidence:'medium'}),
    fact('named_run_length','Kandahar run length',8,'km',cransGlacier,'Starts at the top of the Plaine Morte funitel.'),
    fact('season','2026–27 season','Partial opening from 2026-11-28, snow permitting; FIS Alpine World Championships 2027-02-01 to 2027-02-14','',cma,'',{qualifier:'seasonal',source_period:'2026–27'}),
  ],{operator:'Remontées mécaniques de Crans Montana Aminona (CMA) SA',statusSource:cma,inventory:[{url:crans,type:'tourism_authority'},{url:cransGlacier,type:'tourism_authority'},{url:cma,type:'official_lift_operator'},{url:'https://public-assets.spotliodata.com/CMTC_PlanPistes_2025.pdf',type:'official_trail_map',status:'not reviewed'}]}),
]

export function applyOfficialBatch028Group4(records){
  const byId=new Map(records.map(record=>[record.stable_id,record]));let observations=0
  for(const item of officialBatch028Group4){
    const record=byId.get(item.id);if(!record)throw new Error(`Official batch 028 group 4 missing ${item.id}`)
    if(!['medium','high'].includes(record.confidence))throw new Error(`Official batch 028 group 4 outside public confidence scope ${item.id}`)
    record.overview={text:item.overview,sources:[item.observations[0].source],reviewed_at:checked,kind:'editorial_summary'}
    record.field_provenance.overview={value:item.overview,source_record_ids:[item.observations[0].source],confidence:'medium',batch:'official-028-group-4'}
    if(item.operator){record.operator=item.operator;record.field_provenance.operator={value:item.operator,source_record_ids:[item.inventory.find(source=>source.type==='official_operator')?.url||item.observations[0].source],confidence:'high',batch:'official-028-group-4'}}
    record.field_provenance.operating_status_research={value:'seasonal',source:item.statusSource,reviewed_at:checked,note:'Current season evidence supports seasonal operation; displayed status remains unchanged pending a product decision.',batch:'official-028-group-4',displayed_value_unchanged:record.operating_status}
    record.research_source_inventory=item.inventory.map(source=>({...source,reviewed_at:checked,batch:'official-028-group-4'}));record.mountain_observations||=[]
    for(const observation of item.observations){
      if(record.mountain_observations.some(existing=>existing.key===observation.key))throw new Error(`Official batch 028 group 4 duplicate field ${item.id}:${observation.key}`)
      record.mountain_observations.push(observation);record.field_provenance[`mountain.${observation.key}`]={...structuredClone(observation),batch:'official-028-group-4',source_record_ids:[observation.source]};observations++
      if(!record.source_records.some(source=>source.url===observation.source))record.source_records.push({source:item.inventory.find(source=>source.url===observation.source)?.type||'official_resort',record_id:observation.source,url:observation.source,license:'factual-observations-only; page copyright retained by publisher',collected_at:checked})
    }
  }
  return {reviewed_at:checked,group:4,profiles:officialBatch028Group4.length,observations,operating_status_display_changes:0}
}
