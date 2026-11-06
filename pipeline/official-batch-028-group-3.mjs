const checked='2026-11-06'
const fact=(key,label,value,unit,source,note='',extra={})=>({key,label,value,unit,source,note,retrieved_at:checked,source_published_at:null,status:'source_checked',confidence:'high',qualifier:'exact',scope:'local_resort',...extra})
const entry=(id,overview,observations,{operator,statusSource,sourceType='official_resort',inventory=[]})=>({id,overview,observations,operator,statusSource,sourceType,inventory})

const treble='https://cardrona-treblecone.com/treblecone'
const portillo='https://skiportillo.com/en/our-mountain/ski-slopes-skiable-terrain/'
const portilloSeason='https://skiportillo.com/'
const valle='https://www.vallenevado.com/en/about-valle-nevado/'
const valleSeason='https://www.vallenevado.com/es/extension-temporada-2/'

export const officialBatch028Group3=[
  entry('wikidata:item:Q7837389',"Treble Cone rises above Lake Wānaka in the Southern Alps, reached by a seven-kilometre access road from the valley. The operator highlights its long groomed descent and challenging terrain, with powder faces and off-piste drops for stronger skiers.",[
    fact('skiing_elevation','Highest lifted point',1960,'m',treble,'The page card is titled “Longest vertical rise,” but its text explicitly describes this value as the highest lifted point. It is an elevation, not vertical.',{scope:'lift_served'}),
    fact('longest_run','Longest groomed run',4,'km',treble,"Described by the operator as the South Island's longest run."),
    fact('season','Current pass sales','Treble Cone lift and season passes on sale; season year not stated','',treble,"A related legacy page references a Winter '26 pass.",{confidence:'low',qualifier:'seasonal'}),
  ],{operator:'Cardrona Alpine Resort & Treble Cone',statusSource:treble,sourceType:'official_operator',inventory:[{url:treble,type:'official_operator'},{url:'https://www.treblecone.com/',type:'official_resort_legacy',status:'redirects to current operator site'},{url:'https://www.wikidata.org/wiki/Q7837389',type:'structured_cc0'}]}),

  entry('wikidata:item:Q167843','Portillo is a hotel-centred Andean resort known for short lift lines and a strong advanced and expert share. Groomed beginner and intermediate runs sit near the hotel, while bowls and chutes such as Roca Jack provide its renowned steep terrain. Heli-skiing operates separately from these lift-served figures.',[
    fact('terrain_area','Skiable terrain',500,'ha',portillo,'The same page publishes the consistent conversion of 1,235 acres.'),fact('trails','Slopes',35,'',portillo),
    fact('summit','Highest point',3310,'m',portillo,'Published as highest point, not explicitly as a lift top.'),
    fact('base_area_elevation','Hotel altitude',2800,'m',portillo,'This is the hotel altitude, not a labeled lift base.'),
    fact('longest_run','Longest ski run',2.5,'km',portillo),fact('snowfall','Annual average snowfall',5.1,'m',portillo),fact('difficulty_mix','Published slope mix','15% beginner · 30% intermediate · 30% advanced · 25% expert','',portillo),
    fact('season','2026 season completed; 2027 announced','Thank you for a great 2026 season; 2027 early booking open','',portilloSeason,'',{confidence:'medium',qualifier:'seasonal',source_period:'2026 / 2027'}),
  ],{operator:'Ski Portillo',statusSource:portilloSeason,inventory:[{url:portillo,type:'official_resort'},{url:portilloSeason,type:'official_resort'},{url:'https://skiportillo.com/wp-content/uploads/2024/09/Mapa-de-Pistas-Ski-Portillo-Terreno-Esquiable.pdf',type:'official_trail_map',status:'image-only; no facts extracted'},{url:'https://www.wikidata.org/wiki/Q167843',type:'structured_cc0'}]}),

  entry('wikidata:item:Q3051592','Valle Nevado was developed in a south-facing Andean valley selected for its snow quality and opened in 1988. It combines lift-served slopes with hotels and dining, while heli-skiing remains separate. Its 2026 operating season was extended unusually late into December.',[
    fact('development_elevation','Development elevation when founded',9924,'ft',valle,'Not labeled as a base, summit or lift top; it must not be displayed as any of those.',{confidence:'low',scope:'other'}),
    fact('season','2026 season extension','Open on scheduled days to 2026-12-01, 8:30–14:00','',valleSeason,'Five named lifts are only the partial operating set for the extension and are not a resort lift total.',{qualifier:'seasonal',source_period:'2026'}),
    fact('opening_year','Opened','1988','',valle,'Inaugurated in June 1988 after the planned 1987 opening was delayed by snow.'),
  ],{operator:'Valle Nevado SpA',statusSource:valleSeason,inventory:[{url:valle,type:'official_resort'},{url:valleSeason,type:'official_resort'},{url:'https://www.vallenevado.com/es/pistas/',type:'official_resort',status:'live status only; no total extracted'},{url:'https://www.wikidata.org/wiki/Q3051592',type:'structured_cc0'}]}),
]

export function applyOfficialBatch028Group3(records){
  const byId=new Map(records.map(record=>[record.stable_id,record]));let observations=0
  for(const item of officialBatch028Group3){
    const record=byId.get(item.id);if(!record)throw new Error(`Official batch 028 group 3 missing ${item.id}`)
    if(!['medium','high'].includes(record.confidence))throw new Error(`Official batch 028 group 3 outside public confidence scope ${item.id}`)
    record.overview={text:item.overview,sources:[item.observations[0].source],reviewed_at:checked,kind:'editorial_summary'}
    record.field_provenance.overview={value:item.overview,source_record_ids:[item.observations[0].source],confidence:'medium',batch:'official-028-group-3'}
    record.operator=item.operator
    record.field_provenance.operator={value:item.operator,source_record_ids:[item.observations[0].source],confidence:'medium',batch:'official-028-group-3'}
    record.field_provenance.operating_status_research={value:'seasonal',source:item.statusSource,reviewed_at:checked,note:'Current operating or pass evidence supports seasonal operation; displayed status remains unchanged pending a product decision.',batch:'official-028-group-3',displayed_value_unchanged:record.operating_status}
    record.research_source_inventory=item.inventory.map(source=>({...source,reviewed_at:checked,batch:'official-028-group-3'}))
    record.mountain_observations||=[]
    for(const observation of item.observations){
      if(record.mountain_observations.some(existing=>existing.key===observation.key))throw new Error(`Official batch 028 group 3 duplicate field ${item.id}:${observation.key}`)
      record.mountain_observations.push(observation);record.field_provenance[`mountain.${observation.key}`]={...structuredClone(observation),batch:'official-028-group-3',source_record_ids:[observation.source]};observations++
      if(!record.source_records.some(source=>source.url===observation.source))record.source_records.push({source:item.sourceType,record_id:observation.source,url:observation.source,license:'factual-observations-only; page copyright retained by publisher',collected_at:checked})
    }
  }
  return {reviewed_at:checked,group:3,profiles:officialBatch028Group3.length,observations,operating_status_display_changes:0}
}
