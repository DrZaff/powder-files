import { applyOfficialBatch } from './official-batch-001.mjs'

// Independently transcribed factual measurements, not copied prose or images.
export const checked = '2026-08-30'
const fact = (key,label,value,unit,source,note='',extra={}) => ({key,label,value,unit,source,note,retrieved_at:checked,source_published_at:null,status:'source_checked',confidence:'medium',...extra})
const resort = (qid,name,source,rows,notes='',extra={}) => ({id:`wikidata:item:${qid}`,name,notes,observations:rows.map(([key,label,value,unit,note='',options={}])=>fact(key,label,value,unit,source,note,{...extra,...options}))})
const conflict = (key,label,unit,alternatives,note,extra={}) => fact(key,label,null,unit,alternatives[0].source,note,{status:'conflict',confidence:'low',alternatives,...extra})

export const officialBatch = [
  resort('Q3021172','Deer Valley','https://www.deervalley.com/explore-the-mountain',[
    ['vertical','Published vertical drop',3040,'ft','2025–26 configuration. Announced 2026–27 expansion is not represented as already open.'],
    ['area','Published skiable terrain',4300,'acres','2025–26 configuration. Deer Valley is skiing-only; snowboarding is not permitted.'],
    ['base','Published base elevation',6530,'ft'],['summit','Summit elevation',9570,'ft'],
    ['lifts','Aerial lifts',31,'','Excludes eight separately listed conveyor/surface lifts.'],
  ],'Retains the 2025–26 configuration. The expansion site advertises 4,500 acres, 209 runs and 32 aerial lifts for 2026–27; these planned figures are not live availability.',{source_period:'2025–26'}),
  resort('Q5445102','Fernie Alpine Resort','https://skifernie.com/discover-fernie/mountain-stats/',[
    ['vertical','Vertical rise',1082,'m'],['area','Skiable terrain',2500,'acres','Published as 2,500+ acres.',{qualifier:'+'}],['base','Base elevation',1052,'m'],['summit','Summit elevation',2134,'m'],['lifts','Lifts',10,'','Includes three surface lifts.'],
  ]),
  resort('Q6415898','Kirkwood Mountain Resort','https://www.kirkwood.com/the-mountain/about-the-mountain/mountain-info.aspx',[
    ['vertical','Advertised vertical',2000,'ft'],['area','Skiable terrain',2300,'acres','Statistics table value; introductory text says over 2,300 acres.'],['base','Base elevation',7800,'ft'],['trails','Trails',86,''],['lifts','Lifts',15,''],
  ],'Summit withheld: page lists highest elevation 9,800 ft, Thimble Peak 9,805 ft and an inconsistent metric conversion. Older maps are not treated as current statistics.'),
  resort('Q3326011','Mount Bachelor ski area','https://www.mtbachelor.com/tickets-passes/ikon-pass/?page=2556',[
    ['vertical','Vertical drop',3365,'ft'],['area','Skiable terrain',4323,'acres'],
  ],'Other core fields were not established from the reviewed official HTML source.'),
  resort('Q7059771','Northstar California','https://www.northstarcalifornia.com/the-mountain/about-the-mountain/mountain-info.aspx',[
    ['area','Skiable terrain',3170,'acres','Page also lists 347 acres of gate-accessed terrain separately; not added to this figure.'],['trails','Trails',100,''],['lifts','Lifts',20,''],['base','Base elevation',6330,'ft'],['summit','Highest elevation',8610,'ft'],
  ]),
  resort('Q2182804','Palisades Tahoe','https://www.palisadestahoe.com/footer/mountain-statistics',[
    ['area','Palisades + Alpine terrain',6000,'acres','Combined skiable area, not Palisades mountain alone.'],['vertical','Advertised vertical rise',2850,'ft','Resort-wide table; Alpine alone has a different vertical.'],['base','Lowest base elevation',6200,'ft'],['summit','Published peak elevation',9050,'ft'],
  ]),
  resort('Q7304643','Red Mountain Resort','https://www.redresort.com/maps-stats/',[
    ['area','Advertised resort terrain',3850,'acres','Resort-wide figure; the resort also offers pay-per-run in-bounds cat skiing. Lift-only acreage is not established here.'],['base','Base elevation',1185,'m'],['summit','Summit elevation',2075,'m'],['lifts','Lifts',8,''],
  ],'Animated trail-count and vertical counters extracted as zero, so those counters are not used. Differing promotional vertical claims remain unresolved.'),
  resort('Q2665933','Snowbasin','https://www.snowbasin.com/discover/your-guide-to-snowbasin/',[
    ['area','Skiable terrain',3000,'acres','Statistics heading says 3,000 acres; surrounding copy says over 3,000.'],['trails','Trails',115,''],['lifts','Lifts',13,''],['base','Base elevation',6450,'ft'],['summit','Top elevation',9465,'ft'],
  ],'No resort-wide vertical is inferred from elevations or individual Olympic courses.'),
  resort('Q7548669','Snowmass','https://www.aspensnowmass.com/discover/experiences/guides/how-to-ski-snowmass-on-a-powder-day',[
    ['area','Skiable terrain',3332,'acres'],['vertical','Advertised vertical',4406,'ft','Published resort vertical, not a claim that every foot is lift-served.'],['trails','Ski trails',98,''],
  ],'Snowmass mountain only, not all four Aspen Snowmass mountains. Article publication date is unknown.'),
  resort('Q7605410','Steamboat Ski Resort','https://www.steamboat.com/the-mountain/mountain-stats',[
    ['area','Permitted terrain',3741,'acres','Permit-area figure, not a measured groomed-piste area.'],['vertical','Vertical rise',3668,'ft'],['trails','Trails',184,'','Current text headline; old image alternative text lists 165 trails and is not used.'],['lifts','Lifts',23,'','Includes six surface lifts; five are for snow school.'],['base','Base elevation',6900,'ft'],['summit','Mount Werner summit',10568,'ft'],
  ],'Current text statistics take precedence over stale image alternative text and the explicitly older 2024–25 press kit.'),
  resort('Q749825','Sun Peaks Resort','https://www.sunpeaksresort.com/ski-ride/the-mountain/trail-maps-stats',[
    ['area','Ski area',4400,'acres','Across three mountains.'],['skiing_elevation','Burfield chairlift summit',2080,'m','Mt. Tod summit (2,152 m) is outside the ski-area boundary and is not used as the skiing elevation.'],['base','Village base elevation',1255,'m'],['lifts','Lifts',13,'','Includes five surface lifts.'],
  ],'Published winter table is labeled 2026–27. This is planning information, not evidence all lifts are currently operating.',{source_period:'2026–27 published plan'}),
  resort('Q7697675','Telluride Ski Resort','https://tellurideskiresort.com/?spb-section=mountain-facts',[
    ['vertical','Lift-served vertical',3790,'ft','Historical published measurement; 4,425 ft total vertical includes non-lift-served terrain. Needs a newer official fact-sheet check.'],['area','Published skiable terrain',2000,'acres','Historical published 2,000+ acreage; current-season extent not independently established.',{qualifier:'+'}],['base','Published base elevation',8725,'ft'],['skiing_elevation','Published lift-served top',12515,'ft'],
  ],'Official HTML fact block is dated 2020-09-30. Historical measurements are labeled; old lift/trail totals and maximum hike-to elevation are not imported as current.',{source_period:'2020 publication',source_published_at:'2020-09-30'}),
  resort('Q3639823','Whitefish Mountain Resort','https://skiwhitefish.com/mountain-stats/',[
    ['vertical','Vertical drop',2353,'ft'],['area','Resort terrain',3000,'acres'],['trails','Named trails',110,''],['base','Base elevation',4464,'ft'],['summit','Summit elevation',6817,'ft'],['lifts','Reported operating lifts',14,'','FAQ total: 11 chairlifts, one T-bar and two carpets. The equipment table lists additional lifts; operating scope needs confirmation.'],
  ]),
  resort('Q127037','Avoriaz','https://www.avoriaz.com/activites-hiver/ski-et-snow/avoriaz-ou-portes-du-soleil---tout-comprendre/',[
    ['piste_length','Avoriaz piste length',75,'km','Approximate Avoriaz-only length; not the 600 km Portes du Soleil network.',{qualifier:'~'}],['base','Village elevation',1800,'m','Village elevation, not lowest ski-area point.'],
  ]),
  resort('Q5509476','Furano Ski Resort','https://www.princehotels.com/en/ski/furano/index.html',[
    ['vertical','Vertical descent',839,'m'],['base','Base elevation',235,'m'],['skiing_elevation','Ski-area peak',1074,'m'],
  ],'Furano and Kitanomine zones combined. Ski-lift capacities and line lengths are not mistaken for lift counts or elevation.'),
  resort('Q11222992','Hakuba 47 Winter Sports Park','https://www.hakuba47.co.jp/winter/en/mountain/mountain_info/',[
    ['vertical','Published vertical rise',794,'m'],['base','Published base elevation',820,'m'],['skiing_elevation','Published upper elevation',1614,'m'],['piste_length','Published total trail length',13570,'m','Hakuba47 table; not the combined Goryu–47 network.'],
  ],'Official statistics table is still explicitly labeled 2023–24. Preserved as dated observations; current-season recheck required. Split route sections are not counted as additional runs.',{source_period:'2023–24'}),
  resort('Q11580457','Hakuba Cortina Snow Resort','https://www.hgp.co.jp/cortina/ski/gelande/',[
    ['vertical','Vertical difference',530,'m'],['skiing_elevation','Upper skiing elevation',1402,'m'],['base','Lower skiing elevation',872,'m'],['trails','Cortina courses',16,'','Cortina only, excludes the separately tabulated Hakuba Norikura area.'],['longest_run','Longest ski route',3.5,'km'],
  ],'Japanese official table. Four pair and two quad lifts are listed; no aggregate lift count is inferred.'),
  resort('Q11580462','Hakuba Goryu Snow Resort','https://www.hakubaescal.com/winter-en/gelande/',[
    ['gondola_elevation','Telecabin top station',1515,'m','Specific gondola station, not the highest skiing elevation.'],
  ],'Linked Goryu–Hakuba47 course totals differ between overview and course guide. Standalone Goryu acreage and course total remain unestablished.'),
  resort('Q11580473','Hakuba Iwatake Snow Field','https://iwatake-mountain-resort.com/winter/whitepark',[
    ['summit','Summit recreation area',1289,'m','Published winter summit-area elevation, not a claim about total skiing vertical.'],
  ],'Course-status page mixes downhill and cross-country routes; no total is calculated from its rows.'),
  resort('Q61451059','Mt Hotham Alpine Resort','https://www.mthotham.com.au/resort/explore/mountain-info',[
    ['vertical','Published vertical drop',395,'m'],['area','Lifted terrain',245,'ha','Lifted terrain, not the 320 ha broader ski-area figure.'],['skiing_elevation','Highest lifted point',1845,'m'],['base','Base height',1450,'m'],['summit','Mountain elevation',1861,'m'],['lifts','Lifts incl. Dinner Plain',14,'','Broader scope than Hotham-only lift totals.'],
  ],'Statistics table retains 2025 season dates despite current site navigation. The 2026 school page lists 13 Hotham lifts, a narrower scope than the 14 including Dinner Plain.',{source_period:'2025 table'}),
  resort('Q11324352','Niseko Annupuri International Ski Area','https://annupuri.info/concept/',[
    ['trails','Annupuri courses',13,'','Annupuri only, not all Niseko United areas.'],['lifts','Lifts',6,'','Published total includes gondola and quad lifts.'],
  ]),
  resort('Q23772767','Niseko Hanazono Resort','https://hanazononiseko.com/en/winter/resort/courses',[
    ['trails','Hanazono courses',12,'','Includes the terrain park listed among the 12 courses; excludes other Niseko United resorts.'],
  ],'Area and upper skiing elevation remain unestablished; summer gondola top is not substituted for the winter ski-area top.'),
  resort('Q11324358','Niseko Tokyu Grand HIRAFU','https://www.grand-hirafu.jp/snow/',[
    ['vertical','Vertical difference',940,'m'],['area','Reported slope area',135,'ha','Grand Hirafu only, not all Niseko United.'],['trails','Courses',22,''],['base','Lower elevation',260,'m'],['skiing_elevation','Upper elevation',1200,'m'],['chairlifts','Lifts excluding gondolas',7,'','Two gondolas are listed separately.'],['gondolas','Gondolas',2,''],
  ]),
  resort('Q7382688','Rusutsu Resort','https://rusutsu.com/rusutsu-in-winter/',[
    ['trails','Courses',37,'','Across West Mountain, East Mountain and Mt. Isola.'],['chairlifts','Lifts excluding gondolas',14,'','Four gondolas are separately reported.'],['gondolas','Gondolas',4,''],
  ],'Resort-wide trail length is retained from the dated official article separately, not inferred by summing trail-map sections.'),
  resort('Q7067399','Nozawa Onsen Snow Resort','https://nozawaski.com/winter/general/',[
    ['vertical','Published vertical difference',1085,'m'],['area','Published course area',297,'ha','Course area, not the 785 ha overall ski-resort footprint.'],['trails','Courses & slopes',43,''],['base','Published base elevation',565,'m'],['skiing_elevation','Published top elevation',1650,'m'],['longest_run','Longest ski route',10000,'m'],
  ],'Japanese company statistics still show the 2024–25 operating season. The English site timed out, so the Japanese operator page was used.',{source_period:'2024–25'}),
]

const entry = qid => officialBatch.find(r=>r.id===`wikidata:item:${qid}`)
const source = qid => entry(qid).observations[0].source
const deerExpansion='https://expandedexcellence.deervalley.com/major-terrain-expansion/'
entry('Q3021172').research_sources=[deerExpansion,'https://www.deervalley.com/about-us/faqs']
entry('Q3021172').observations.push(conflict('trails','Published trail count','',[{value:202,source:source('Q3021172')},{value:204,source:'https://guides.deervalley.com/meeting-planner-guide/20-21'}],'Mountain page reports 202; meeting guide reports 204. Neither is replaced by the announced 209-run 2026–27 plan.',{source_period:'2025–26 / undated guide'}))
entry('Q5445102').observations.push(conflict('trails','Named runs','',[{value:145,source:source('Q5445102')},{value:146,source:source('Q5445102')},{value:142,source:'https://skifernie.com/discover-fernie/why-fernie/'}],'Official statistics contain 145 and 146; another official page gives 142. No single count selected.'))
entry('Q2182804').observations.push(conflict('lifts','Combined lifts','',[{value:39,source:source('Q2182804')},{value:40,source:'https://www.palisadestahoe.com/explore/first-timers-guide'}],'Combined statistics table says 39 lifts; official first-timer guide says 40. Scope or update date needs clarification.'))
entry('Q2182804').observations.push(conflict('trails','Combined trails','',[{value:288,source:source('Q2182804')},{value:296,source:source('Q2182804'),derivation:'Sum of published mountain subtotals: 187 + 109; not a separately published combined count.'}],'Published total is 288; separate mountain subtotals sum to 296 (187 + 109). The second number is calculated only to document the inconsistency. Overlap and scope are unresolved; neither count is selected.'))
const avoriazGuide='https://www.avoriaz.com/en/discover/the-resort/first-time-in-avoriaz-in-winter-/'
entry('Q127037').observations.push(fact('lifts','Avoriaz lifts',35,'',avoriazGuide,'Avoriaz only, not the entire Portes du Soleil network.'),conflict('trails','Avoriaz slopes','',[{value:54,source:source('Q127037')},{value:53,source:avoriazGuide}],'French and English official guides report 54 and 53 slopes. Difficulty subtotals also differ; count withheld.'))
entry('Q5509476').observations.push(fact('trails','Courses across both zones',28,'','https://www.princehotels.com/en/ski/furano/inc/readset_furano.html','Furano plus Kitanomine.'))
entry('Q11580462').observations.push(conflict('trails','Goryu–47 linked courses','',[{value:23,source:source('Q11580462')},{value:24,source:'https://www.hakubaescal.com/winter-en/gelande/course/'}],'These are linked-area counts, not standalone Goryu. Official overview and course guide disagree.'))
entry('Q7382688').observations.push(fact('piste_length','Total trail length',42,'km','https://rusutsu.com/blog/032/','Across all three resort mountains; dated official article, not a current measurement.',{source_published_at:'2021-03-14',source_period:'2021 publication'}))
entry('Q7304643').research_sources=['https://www.redresort.com/kirkupcat/','https://www.redresort.com/thegoodlife/']
entry('Q61451059').research_sources=['https://www.mthotham.com.au/resort/access/groups/school-groups']

export function applyOfficialBatch002(records) {
  return applyOfficialBatch(records,{entries:officialBatch,batch:'official-002',checkedAt:checked})
}
