const checked='2026-11-06'
const fact=(key,label,value,unit,source,note='',extra={})=>({key,label,value,unit,source,note,retrieved_at:checked,source_published_at:null,status:'source_checked',confidence:'high',qualifier:'exact',scope:'local_resort',...extra})
const entry=(id,name,overview,observations,{operator=null,statusValue='seasonal',statusSource,sourceType='official_resort',inventory=[]}={})=>({id,name,overview,operator,sourceType,observations,inventory,operating_status_evidence:{value:statusValue,source:statusSource,reviewed_at:checked,note:statusValue==='uncertain'?'No dated 2026–27 operating evidence was found; displayed status remains unchanged.':'Current-season evidence supports seasonal operation; displayed status remains unchanged pending a product decision.'}})

const msa='https://mont-sainte-anne.com/en/mont-sainte-anne-mountain-statistics/'
const schweitzer='https://www.schweitzer.com/discover-schweitzer/stats-and-info'
const thredboHistory='https://www.thredbo.com.au/about-thredbo/history/'
const thredboAbout='https://www.thredbo.com.au/about-thredbo/'
const thredboMountain='https://www.thredbo.com.au/the-mountain/'
const falls='https://www.fallscreek.com.au/winter-activities/skiing-snowboarding/'
const fallsSeason='https://www.fallscreek.com.au/?season=winter'
const buller='https://www.mtbuller.com.au/winter/resort-info/about-mt-buller'
const bullerSeason='https://www.mtbuller.com.au/winter/lift-passes/season-memberships'

export const officialBatch028Group2=[
  entry('wikidata:item:Q1231413','Mont-Sainte-Anne','Mont-Sainte-Anne overlooks the St. Lawrence River near Quebec City, with trails on three sides of the mountain served by a gondola and detachable quads. It pairs a long family cruiser with a substantial advanced and extreme share, and lights part of its trail network for night skiing.',[
    fact('summit','Altitude at the summit',800,'m',msa,'Mountain summit; the source does not separately identify the top lift.'),
    fact('vertical','Vertical drop',625,'m',msa),
    fact('terrain_area','Skiable terrain',221.5,'ha',msa,'The separately published 868 ha total acreage is not skiable terrain.'),
    fact('snowfall','Natural snowfall',530,'cm',msa,'Not labeled with an averaging period.'),
    fact('snowmaking_area','Snowmaking coverage',137.5,'ha',msa,'The source also prints 80%, but 137.5 ha is about 62% of the published skiable area; the percentage is withheld.',{confidence:'medium',conflict:{alternatives:['80% as published','137.5 ha, approximately 62% of 221.5 ha'],recommended_handling:'Display 137.5 ha only and withhold the inconsistent percentage.'}}),
    fact('trails','Trails',71,'',msa,'The trails cover 73 km on three sides.'),
    fact('piste_length','Trail length',73,'km',msa),
    fact('night_skiing','Night skiing','19 trails covering 15.5 km','',msa),
    fact('difficulty_mix','Published trail mix','21% easy · 46% intermediate · 20% advanced · 13% extreme','',msa),
    fact('longest_run','Longest trail',4.5,'km',msa,'La Familiale.'),
    fact('lifts','Lifts',9,'',msa,'One gondola, four quads and four surface lifts, including two carpets.'),
    fact('terrain_parks','Snowparks',3,'',msa,'Rails Park, Beginner Park and Boardercross.',{confidence:'medium'}),
    fact('season','Typical season','End of November to mid-April, weather permitting; 148 days on average','',msa,'Typical season only, not a confirmed 2026–27 schedule.',{confidence:'medium',qualifier:'seasonal'}),
  ],{statusValue:'uncertain',statusSource:msa,inventory:[{url:msa,type:'official_resort'},{url:'https://mont-sainte-anne.com/en/about/',type:'official_resort'},{url:'https://www.wikidata.org/wiki/Q1231413',type:'structured_cc0'}]}),

  entry('wikidata:item:Q2255843','Schweitzer',"Schweitzer sits in Idaho's Selkirk Mountains above Sandpoint and Lake Pend Oreille, with two large bowls and extensive tree skiing. Its terrain leans toward advanced and expert, and a high-speed six-pack anchors the lift network. A separate Nordic network is not included in the downhill figures.",[
    fact('terrain_area','Skiable terrain',2900,'acres',schweitzer,'Plus open-bowl skiing.'),fact('trails','Trails',92,'',schweitzer,'Open-bowl skiing is not counted as trails.'),fact('vertical','Vertical drop',2400,'ft',schweitzer),
    fact('skiing_elevation','Top elevation',6400,'ft',schweitzer,'Not explicitly identified as a lift top.',{confidence:'medium',scope:'local_resort'}),
    fact('snowfall','Average annual snowfall',300,'in',schweitzer),fact('difficulty_mix','Published terrain mix','10% beginner · 40% intermediate · 35% advanced · 15% expert','',schweitzer),fact('longest_run','Longest continuous groomed run',2.1,'mi',schweitzer,'Little Blue Ridge Run.'),fact('lifts','Lifts',10,'',schweitzer,'Includes one conveyor and one T-bar.'),fact('terrain_parks','Terrain parks',2,'',schweitzer,'Stomping Grounds and Terrain Garden.',{confidence:'medium'}),
    fact('night_skiing','Twilight skiing','Basin Express and Creekside Express, 3:00–7:00 pm on scheduled dates','',schweitzer,'',{confidence:'medium',qualifier:'seasonal'}),
    fact('season','Scheduled 2026–27 opening','2026-11-27','', 'https://www.schweitzer.com/','Weather-dependent.',{confidence:'medium',qualifier:'seasonal',source_period:'2026–27'}),
  ],{statusSource:'https://www.schweitzer.com/',inventory:[{url:schweitzer,type:'official_resort'},{url:'https://www.schweitzer.com/',type:'official_resort'},{url:'https://www.schweitzer.com/about-us/history',type:'official_resort'},{url:'https://www.wikidata.org/wiki/Q2255843',type:'structured_cc0'}]}),

  entry('wikidata:item:Q60777517','Thredbo',"Thredbo climbs from its village in Kosciuszko National Park toward Australia's highest peaks. Most terrain suits intermediates, with a dedicated beginner area at Friday Flat and steeper off-piste terrain for advanced riders.",[
    fact('skiing_elevation','Highest lifted point',2037,'m',thredboHistory,'Top of Karels T-Bar. This conflicts with the About page’s unlabeled 1,930 m upper range.',{confidence:'medium',scope:'lift_served',conflict:{alternatives:['2,037 m, top of Karels T-Bar','1,930 m upper bound on About page'],recommended_handling:'Display 2,037 m as the explicitly identified highest lifted point; retain the range separately.'}}),
    fact('elevation_range','Mountain elevation range','1365–1930','m',thredboAbout,'Describes mountains rather than labeled lift-served bounds; never display as base or top.',{confidence:'low',scope:'other'}),
    fact('difficulty_mix','Intermediate share','About 65% suited to intermediates','',thredboMountain,'',{confidence:'medium',qualifier:'approximately'}),
    fact('season','2026–27 cycle','Winter 2026 season completed; Winter 2027 season passes on sale','',thredboMountain,'',{confidence:'medium',qualifier:'seasonal',source_period:'Winter 2026 / Winter 2027'}),
  ],{operator:'Kosciuszko Thredbo',statusSource:thredboMountain,inventory:[{url:thredboHistory,type:'official_resort'},{url:thredboAbout,type:'official_resort'},{url:thredboMountain,type:'official_resort'},{url:'https://www.thredbo.com.au/weather/lifts-trails/',type:'official_resort'},{url:'https://www.wikidata.org/wiki/Q60777517',type:'structured_cc0'}]}),

  entry('wikidata:item:Q111983623','Falls Creek','Falls Creek has the largest published skiable area in Victoria, spread across village-side slopes and a steeper Summit region. Blue runs dominate, while the long Wombats Ramble gives beginners an extended first descent and side-country terrain serves stronger skiers.',[
    fact('terrain_area','Skiable area',450,'ha',falls),fact('trails','Runs',90,'',falls),fact('lifts','Lifts',15,'',falls,'No lift-type breakdown is published.'),fact('difficulty_mix','Intermediate share','60% of runs rated blue','',falls),fact('named_run_length','Wombats Ramble length',2.2,'km',falls,"Described as Australia's longest green run."),
    fact('season','2026 season operated','Winter season opening weekend reported','',fallsSeason,'',{confidence:'medium',qualifier:'seasonal',source_period:'Winter 2026'}),
  ],{statusSource:fallsSeason,sourceType:'public_authority',inventory:[{url:falls,type:'public_authority'},{url:fallsSeason,type:'public_authority'},{url:'https://www.fallscreek.com.au/listing/night-skiing-2/',type:'public_authority',status:'404; no fact retained'},{url:'https://www.wikidata.org/wiki/Q111983623',type:'structured_cc0'}]}),

  entry('wikidata:item:Q6919901','Mt Buller',"Mt Buller runs Victoria's largest published lift network, with its village close to the slopes. Gentle learning terrain sits alongside a mostly intermediate-to-advanced ski area, while terrain parks and scheduled twilight sessions broaden the program.",[
    fact('terrain_area','Skiable terrain',300,'ha',buller,'Published as over 300 hectares.',{qualifier:'more_than'}),fact('piste_length','Runs',80,'km',buller,'Published in promotional resort information.',{confidence:'medium'}),fact('lifts','Lifts',19,'',buller,'The source count includes carpets; it lists 13 chairlifts, two T-bars and two rope tows counted as one.'),fact('difficulty_mix','Terrain share','80% intermediate, advanced and some expert','',buller,'',{confidence:'medium'}),
    fact('night_skiing','Twilight sessions','Wednesday twilight sessions','',bullerSeason,'',{confidence:'medium',qualifier:'seasonal',source_period:'2027 snow season'}),fact('season','2027 season announced','2027 snow-season memberships on sale','',bullerSeason,'Ikon add-on covers 2026–2027.',{confidence:'medium',qualifier:'seasonal',source_period:'2027'}),
  ],{operator:'Buller Ski Lifts',statusSource:bullerSeason,inventory:[{url:buller,type:'official_resort'},{url:bullerSeason,type:'official_resort'},{url:'https://www.wikidata.org/wiki/Q6919901',type:'structured_cc0'}]}),
]

export function applyOfficialBatch028Group2(records){
  const byId=new Map(records.map(record=>[record.stable_id,record]));let observations=0,documentedConflicts=0
  for(const item of officialBatch028Group2){
    const record=byId.get(item.id);if(!record)throw new Error(`Official batch 028 group 2 missing ${item.id}`)
    if(!['medium','high'].includes(record.confidence))throw new Error(`Official batch 028 group 2 outside public confidence scope ${item.id}`)
    record.overview={text:item.overview,sources:[item.observations[0].source],reviewed_at:checked,kind:'editorial_summary'}
    record.field_provenance.overview={value:item.overview,source_record_ids:[item.observations[0].source],confidence:'medium',batch:'official-028-group-2'}
    record.operator=item.operator
    record.field_provenance.operator={value:item.operator,source_record_ids:item.operator?[item.observations[0].source]:[],confidence:item.operator?'medium':'low',batch:'official-028-group-2',note:item.operator?'Operator attribution retained from the reviewed packet.':'Operator intentionally left null pending current evidence.'}
    record.field_provenance.operating_status_research={...item.operating_status_evidence,batch:'official-028-group-2',displayed_value_unchanged:record.operating_status}
    record.research_source_inventory=item.inventory.map(source=>({...source,reviewed_at:checked,batch:'official-028-group-2'}))
    record.mountain_observations||=[]
    for(const observation of item.observations){
      if(record.mountain_observations.some(fact=>fact.key===observation.key))throw new Error(`Official batch 028 group 2 duplicate field ${item.id}:${observation.key}`)
      record.mountain_observations.push(observation);record.field_provenance[`mountain.${observation.key}`]={...structuredClone(observation),batch:'official-028-group-2',source_record_ids:[observation.source]};observations++;if(observation.conflict)documentedConflicts++
      if(!record.source_records.some(source=>source.url===observation.source))record.source_records.push({source:item.sourceType,record_id:observation.source,url:observation.source,license:'factual-observations-only; page copyright retained by publisher',collected_at:checked})
    }
  }
  return {reviewed_at:checked,group:2,profiles:officialBatch028Group2.length,observations,documented_conflicts:documentedConflicts,operating_status_display_changes:0}
}
