const checked='2026-11-06'
const fact=(key,label,value,unit,source,note='',extra={})=>({key,label,value,unit,source,note,retrieved_at:checked,source_published_at:null,status:'source_checked',confidence:'high',qualifier:'exact',scope:'local_resort',...extra})
const entry=(id,name,source,overview,rows,{statusSource=source,sourceInventory=[]}={})=>({id,name,source,overview,operating_status_evidence:{value:'seasonal',source:statusSource,reviewed_at:checked,note:'Current-season evidence supports seasonal operation; the displayed operating-status field remains unchanged pending a product decision.'},source_inventory:sourceInventory,observations:rows.map(([key,label,value,unit,note='',extra={}])=>fact(key,label,value,unit,source,note,extra))})

const heavenly='https://www.skiheavenly.com/the-mountain/about-the-mountain/mountain-info.aspx'
const heavenlyHours='https://www.skiheavenly.com/explore-the-resort/about-the-resort/hours-of-operation.aspx'
const happo='https://www.happo-one.jp/en/gelande/'
const happoSeason='https://www.happo-one.jp/en/news/39750/'
const taos='https://www.skitaos.com/mountain'
const sugarloaf='https://www.sugarloaf.com/mountain-info'
const hood='https://www.skihood.com/explore/trail-maps'
const hoodAbout='https://www.skihood.com/explore/About-Meadows'
const hoodFaq='https://www.skihood.com/explore/help/FAQ'

export const officialBatch=[
  entry('wikidata:item:Q1548153','Heavenly',heavenly,'Heavenly straddles the California–Nevada line above Lake Tahoe, with two base areas in each state and the highest published resort elevation in the Tahoe region. Its large footprint leans toward intermediate terrain, while a sizable advanced share and long mogul runs give stronger skiers plenty to explore.',[
    ['summit','Highest elevation',10067,'ft','Published as highest elevation, not as the top of a lift.',{scope:'local_resort'}],
    ['base','Base elevation',6657,'ft','The source publishes one base elevation although the resort has four bases; the specific base is not identified.'],
    ['terrain_area','Skiable terrain',4800,'acres'],['lifts','Lifts',28,'','The source does not break out carpets or surface lifts.'],['trails','Trails',111,''],['snowfall','Average annual snowfall',251,'in','The source also publishes 653 cm.'],['terrain_parks','Terrain parks',2,''],
    ['difficulty_mix','Published terrain mix','15% beginner · 53% intermediate · 32% advanced',''],
    ['season','Scheduled 2026–27 opening','2026-11-20','', 'Weather-dependent. Body text states November 20, 2026 while a banner states November 20, 2027; the banner appears to be a typo.',{source:heavenlyHours,confidence:'medium',qualifier:'seasonal',source_period:'2026–27',conflict:{alternatives:['Nov. 20, 2026 (body text)','Nov. 20, 2027 (banner)'],recommended_handling:'Use the body-text date and re-check after the scheduled opening.'}}],
  ],{statusSource:heavenlyHours,sourceInventory:[heavenly,heavenlyHours,'https://www.fs.usda.gov/r05/laketahoebasin/recreation/opportunities/winter-sports','https://www.wikidata.org/wiki/Q1548153']}),

  entry('wikidata:item:Q4251293','Hakuba Happo-one',happo,'Happo-one is the largest single ski area in the Hakuba Valley and hosted 1998 Olympic events. A gondola and long chair network climb from the village to above 1,800 metres, while the headline descent links several runs for roughly eight kilometres across an intermediate-heavy mountain.',[
    ['terrain_area','Course area',220,'ha'],['base','Base elevation',760,'m','Published as the lower value in the resort elevation range.'],['skiing_elevation','Highest lift elevation',1831,'m','The operator explicitly identifies this as the highest elevated lift.',{scope:'lift_served'}],['trails','Number of courses',16,'','Six new tree-run areas were announced for 2026–27, so course scope may change.'],['longest_run','Longest course',8000,'m','Linked route: Riesen Grat – Kurobishi – Skyline – Sakka.'],['lifts','Lifts',21,'','One gondola, five quad, three triple and twelve double chairs; carpets are not listed.'],['difficulty_mix','Published trail mix','30% beginner · 50% intermediate · 20% advanced',''],['max_slope','Maximum slope',37,'degrees','Nakiyama and Tenbo.'],
    ['season','2026–27 season announced','Season passes on sale from 2026-10-01; six new tree-run areas announced','', 'An official opening date was not found in the reviewed sources.',{source:happoSeason,confidence:'medium',qualifier:'seasonal',source_period:'2026–27',source_published_at:'2026-11-04'}],
  ],{statusSource:happoSeason,sourceInventory:[happo,happoSeason,'https://www.happo-one.jp/en/news/39420/','https://www.wikidata.org/wiki/Q4251293']}),

  entry('wikidata:item:Q109412412','Taos Ski Valley',taos,"Taos Ski Valley sits high in New Mexico's Sangre de Cristo range, with a base above 9,000 feet and a summit topping 12,000 feet. More than half its trails are rated expert, giving it a steep, technical reputation, while dedicated beginner terrain and broad snowmaking on easier runs support learners.",[
    ['terrain_area','Skiable terrain',1294,'acres'],['trails','Trails',110,''],['difficulty_mix','Published trail mix','24% beginner · 25% intermediate · 51% expert',''],['lifts','Lifts',13,'','One gondola, two high-speed quads, two fixed-grip quads, four triples, one double and three surface lifts.'],['base','Base elevation',9350,'ft','The source also publishes 2,849 m.'],['summit','Summit elevation',12481,'ft','Not labeled as lift-served; do not display as the highest lift-served point.'],
    ['vertical','Vertical drop',3131,'ft','The published value may include hike-to terrain above the top lift. The same page prints an incorrect 914 m conversion; 3,131 ft is approximately 954 m.',{scope:'other',confidence:'medium',conflict:{alternatives:['3,131 ft','914 m on the same official page'],recommended_handling:'Display only 3,131 ft with non-lift-served scope and retain the conversion warning.'}}],
    ['snowmaking_coverage','Snowmaking coverage','Nearly 100% of beginner and intermediate terrain','','',{qualifier:'approximately'}],
    ['season','2026–27 season announced','Winter 27 season passes on sale','', 'An official opening date was not found in the reviewed sources.',{source:'https://www.skitaos.com/',confidence:'medium',qualifier:'seasonal',source_period:'2026–27'}],
  ],{statusSource:'https://www.skitaos.com/',sourceInventory:[taos,'https://www.skitaos.com/','https://www.fs.usda.gov/r03/carson/recreation/taos-ski-valley-0','https://www.wikidata.org/wiki/Q109412412','https://www.openstreetmap.org/relation/13573224']}),

  entry('wikidata:item:Q1547750','Sugarloaf',sugarloaf,'Sugarloaf is a large western Maine resort known for lift-served snowfields above the treeline, rare in the eastern United States. More than 170 trails and glades spread across several zones, and snowmaking covers nearly all groomed terrain, supporting consistent operations through variable New England weather.',[
    ['summit','Summit elevation',4237,'ft','Not labeled as the top of a lift.'],['vertical','Vertical drop',2820,'ft'],
    ['terrain_area','Developed, skiable terrain',1360,'acres','The statistics block gives 1,360 acres while introductory prose says over 1,360.',{conflict:{alternatives:['1,360 acres (statistics block)','Over 1,360 acres (introductory prose)'],recommended_handling:'Use the exact statistics-block value and retain the wording conflict.'}}],
    ['trails','Trails and glades',176,''],['lifts','Lifts',15,'','Published as including high-speed quads; no complete lift-type breakdown is provided.'],['longest_run','Longest run',3.5,'mi','Tote Road.'],['snowfall','Average annual snowfall',200,'in','Published as an average.',{qualifier:'approximately'}],['snowmaking_coverage','Snowmaking coverage',95,'% of groomed trails'],
    ['season','2026–27 season announced','2026/27 season passes on sale','', 'An official opening date was not found in the reviewed sources.',{source:'https://www.sugarloaf.com/',confidence:'medium',qualifier:'seasonal',source_period:'2026–27'}],
  ],{statusSource:'https://www.sugarloaf.com/',sourceInventory:[sugarloaf,'https://www.sugarloaf.com/','https://www.wikidata.org/wiki/Q1547750']}),

  entry('openstreetmap:way:866496711','Mt. Hood Meadows',hood,'Mt. Hood Meadows spreads across the southeast flank of Mount Hood under a Forest Service permit. Its terrain runs from conveyor-served learning areas to steep bowls and Heather Canyon, with gated expert zones and hike-to terrain above the lifts. Night skiing on part of the mountain extends the operating day.',[
    ['terrain_area','Skiable terrain',2150,'acres'],['night_area','Night-skiing terrain',140,'acres'],['base','Main base elevation',5366,'ft','The separate HRM Lodge base is published at 4,528 ft.'],
    ['skiing_elevation','Highest lift elevation',7305,'ft','Top of Cascade Express. An operator overview rounds this to 7,300 ft.',{scope:'lift_served',conflict:{alternatives:['7,305 ft (statistics)','7,300 ft (rounded overview prose)'],recommended_handling:'Use the precise statistics value.'}}],
    ['snowfall','Average annual snowfall',430,'in'],['terrain_parks','Terrain parks',6,'','Published as up to six; layouts vary during the season.',{source:hoodAbout,confidence:'medium',qualifier:'seasonal'}],
    ['hike_to_vertical','Additional hike-to vertical',1700,'ft','Hiking to Superbowl adds this vertical for an almost 4,500-foot total descent. It is not lift-served and must not feed lift-served vertical.',{source:hoodAbout,confidence:'medium',scope:'hike_to'}],
    ['night_skiing','Night skiing','Mid-December to early March, Wednesday–Sunday 4–9 PM plus holiday extensions','', 'Seasonal schedule.',{source:hoodFaq,confidence:'medium',qualifier:'seasonal',source_period:'2026–27'}],
    ['season','2026–27 season announced','2026–27 restricted and peak dates published','', 'An official opening date was not published in the reviewed sources.',{source:hoodFaq,confidence:'medium',qualifier:'seasonal',source_period:'2026–27'}],
  ],{statusSource:hoodFaq,sourceInventory:[hood,hoodAbout,hoodFaq,'https://www.fs.usda.gov/r06/mthood/recreation/opportunities/winter-sports','https://www.openstreetmap.org/way/866496711']}),
]

export function applyOfficialBatch028(records){
  const byId=new Map(records.map(record=>[record.stable_id,record]));let observations=0,documentedConflicts=0
  for(const item of officialBatch){
    const record=byId.get(item.id);if(!record)throw new Error(`Official batch 028 missing ${item.id}`)
    if(!['medium','high'].includes(record.confidence))throw new Error(`Official batch 028 outside public confidence scope ${item.id}`)
    record.overview={text:item.overview,sources:[item.source],reviewed_at:checked,kind:'editorial_summary'}
    record.field_provenance.overview={value:item.overview,source_record_ids:[item.source],confidence:'medium',batch:'official-028'}
    record.field_provenance.operating_status_research={...item.operating_status_evidence,batch:'official-028',displayed_value_unchanged:record.operating_status}
    record.research_source_inventory=item.source_inventory.map(url=>({url,reviewed_at:checked,batch:'official-028'}))
    record.mountain_observations||=[]
    for(const observation of item.observations){
      if(record.mountain_observations.some(f=>f.key===observation.key))throw new Error(`Official batch 028 duplicate field ${item.id}:${observation.key}`)
      record.mountain_observations.push(observation);record.field_provenance[`mountain.${observation.key}`]={...structuredClone(observation),batch:'official-028',source_record_ids:[observation.source]};observations++;if(observation.conflict)documentedConflicts++
      if(!record.source_records.some(source=>source.url===observation.source))record.source_records.push({source:'official_resort',record_id:observation.source,url:observation.source,license:'factual-observations-only; page copyright retained by publisher',collected_at:checked})
    }
  }
  return {reviewed_at:checked,profiles:officialBatch.length,observations,documented_conflicts:documentedConflicts,operating_status_display_changes:0}
}
