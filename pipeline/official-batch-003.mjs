import { applyOfficialBatch } from './official-batch-001.mjs'

export const checked = '2026-08-30'
// Original editorial summaries and independently transcribed facts; no copied descriptions.
const entry = (id,name,source,summary,rows=[],notes='') => ({
  id:id.includes(':')?id:`wikidata:item:${id}`,name,notes,summary,summary_sources:[source],
  observations:rows.map(([key,label,value,unit='',note='',extra={}])=>({key,label,value,unit,note,source,retrieved_at:checked,source_published_at:null,status:'source_checked',confidence:'medium',...extra})),
})
export const officialBatch = [
  entry('Q4734815','Arctic Valley','https://arcticvalley.org/winter/ski-lifts/','A nonprofit mountain with an old-school lift network: two chairs, a T-bar and a beginner rope tow. Its longest chairlift ride reaches terrain near Rendezvous Peak.',[
    ['chair_vertical','Chair 2 vertical rise',1214,'ft','Individual lift measurement, not resort-wide vertical.'],
  ],'Acreage withheld: winter page advertises 500+ acres while official history describes 320 acres plus separate surrounding terrain.'),
  entry('Q4734821','Alpental','https://www.summitatsnoqualmie.com/alpental','Steep terrain defines Alpental: the resort classifies three quarters of its terrain as expert. Its back bowls are a major draw for experienced riders, not beginner terrain.',[
    ['vertical','Vertical drop',2290,'ft'],['area','Published terrain',825,'acres','Back-bowl acreage is not added again.'],['expert','Expert terrain',75,'%'],
  ]),
  entry('Q4735527','Alpine Valley Resort (Wisconsin)','https://www.alpinevalleyresort.com/mountain-information/','A short-vertical Wisconsin hill with beginner-to-expert runs, three terrain parks and a dedicated learning-lift network. Think repeat laps and skill-building rather than long alpine descents.',[
    ['vertical','Vertical drop',388,'ft'],['area','Skiable terrain',100,'acres','Published as over 100 acres.',{qualifier:'>'}],['trails','Runs',20],['parks','Terrain parks',3],
  ]),
  entry('Q4780859','Appalachian Ski Mountain','https://appskimtn.com/mountain-stats','A compact mountain with four terrain parks and lighting on every slope. Short descents and a fully lit trail network make evening laps a defining part of the offering.',[
    ['vertical','Vertical drop',365,'ft'],['trails','Slopes',13],['summit','Peak elevation',4000,'ft'],['base','Base elevation',3635,'ft'],['lighting','Slope lighting',100,'%'],['parks','Terrain parks',4],
  ]),
  entry('Q4868693','Batawa','https://www.batawaskihill.com/terrain-park-safety','Park progression is part of Batawa’s appeal: smaller features in Little John, larger features in The Factory and an advanced snowcross-style track offer distinct challenges.',[
    ['parks','Terrain parks',3],
  ],'Core mountain dimensions were not established from accessible official HTML. Land-rental acreage is not skiable acreage.'),
  entry('Q4876414','Bear Creek','https://www.bcmountainresort.com/activities/ski-snowboarding/','A compact, fully lit mountain combining a dedicated beginner area, steeper black-diamond terrain and three progressive parks. The mix lends itself to learning sessions and evening laps.',[
    ['vertical','Vertical rise',510,'ft'],['area','Skiable terrain',86,'acres'],['trails','Slopes, trails and parks',23,'','Combined count includes parks.'],['summit','Top elevation',1100,'ft'],['lighting','Trail lighting',100,'%'],
  ]),
  entry('Q4876507','Bear Mountain','https://www.bigbearmountainresort.com/mountain-information/trail-maps','Freestyle and progression are central here, with terrain parks, halfpipes and dedicated learning terrain alongside longer mountain runs. These figures describe Bear Mountain alone, not all three Big Bear resorts.',[
    ['vertical','Vertical drop',1665,'ft'],['area','Developed terrain',198,'acres','Developed acreage, not the larger 748-acre permit area.'],['trails','Runs',26],['lifts','Lifts',7],['base','Base elevation',7140,'ft'],['summit','Peak elevation',8805,'ft'],
  ]),
  entry('Q4878141','Beaver Mountain','https://www.skithebeav.com/mountain/','A family-operated mountain with a spread of beginner, intermediate and advanced runs, plus two terrain parks. Night skiing is mostly private-event access, with only selected public nights.',[
    ['vertical','Vertical drop',1700,'ft'],['area','Skiable terrain',828,'acres'],['trails','Runs',48],['summit','Harry’s Dream summit',8860,'ft'],
  ]),
  entry('Q4804210','Asessippi','https://asessippi.com/faqs/','An independently run prairie-valley ski area offering beginner-through-expert runs and two terrain parks. Its scale and learning options give it a different character from a high-alpine destination.',[
    ['trails','Ski runs',26],['parks','Terrain parks',2],
  ]),
  entry('Q4944773','Boreal','https://www.rideboreal.com/passes-memberships/passes-memberships-overview/comparison/','Boreal puts progression and evening sessions at the heart of its offering, with options for first-timers and park riders. Its published 2026–27 pass lineup includes dedicated night access.',[], 'Summary researched; core numerical mountain facts remain unsourced. Pass hours are not a guarantee of daily operations.'),
  entry('Q105883515','Bousquet','https://bousquetmountain.com/statistics/','A compact Berkshires mountain pairing 750 feet of vertical with night skiing and a terrain park. Its 23-trail network offers a smaller-scale alternative to a sprawling destination resort.',[
    ['vertical','Vertical drop',750,'ft'],['area','Skiable terrain',200,'acres'],['trails','Trails',23],['lifts','Lifts',4,'','Two chairlifts and two carpets.'],['base','Base elevation',1068,'ft'],['summit','Peak elevation',1818,'ft'],
  ]),
  entry('Q4952560','Boyne Mountain','https://www.boynemountain.com/mountain-stats','A broad, short-vertical ski area with ten chairlifts and five terrain parks. Nearly half its published difficulty mix is beginner terrain, with steeper options elsewhere on the mountain.',[
    ['vertical','Vertical drop',500,'ft'],['area','Skiable terrain',415,'acres'],['lifts','Chairlifts',10],['parks','Terrain parks',5],
    ['trails','Trails / named runs',null,'','The same official page lists 64 named runs and 65 trails; no single total selected.',{status:'conflict',confidence:'low',alternatives:[{value:64,source:'https://www.boynemountain.com/mountain-stats'},{value:65,source:'https://www.boynemountain.com/mountain-stats'}]}],
  ]),
  entry('Q4982867','Buck Hill','https://buckhill.com/your-guide-to-holiday-break-at-buck-hill/','A lap-focused hill with learning terrain, steeper runs and a strong freestyle offering. The published holiday guide describes multiple progression parks; layouts and availability change through the season.',[], 'Summary based on the 2025–26 holiday guide, not a current opening report. No resort vertical inferred from summer hiking statistics.'),
  entry('Q4998954','Burke Mountain','https://www.skiburke.com/','A Vermont mountain with glade skiing and a substantial published winter vertical. The ski-area figures here are kept separate from Burke’s summer bike-park statistics.',[
    ['vertical','Published winter vertical',2011,'ft','Winter section of official homepage; summer bike vertical is a different figure.'],['lifts','Winter lifts',5],
  ],'Trail total withheld: homepage says 53, winter conditions page denominator says 56. Scope needs clarification.'),
  entry('Q16890068','Caberfae Peaks','https://caberfaepeaks.com/','A ski-and-stay option with lodging at the base of the slopes. Its resort setup makes an overnight mountain visit part of the offering, alongside day skiing.',[], 'Summary researched from official ski-and-stay offering. Core numerical mountain facts remain unsourced.'),
  entry('Q5018299','Calabogie Peaks','https://calabogie.com/','A mountain-and-lake resort with hotel rooms and condos close to the slopes. The setting combines lift-served winter days with an on-site overnight base rather than a day-area-only experience.',[], 'Official redesigned trail-map page exposes no numerical mountain facts in accessible HTML. No old or third-party dimensions imported.'),
  entry('Q5025811','Camden Snow Bowl','https://camdensnowbowl.com/about/','A town-owned mountain where ocean views set the scene. Ski trails, glades and terrain parks sit within a four-season community recreation area on Ragged Mountain.',[
    ['vertical','Advertised vertical',1000,'ft','Official trail-map prose says nearly 1,000 feet; treat as rounded.',{qualifier:'~'}],['trails','Ski trails',15,'','Glades listed separately; not added to trail count.'],['parks','Terrain parks',2],
  ],'Glade count withheld: official pages contain both 10 and 11.'),
  entry('Q5025879','Camelback','https://www.camelbackresort.com/poconos-ski-tube','A fully lit Pocono ski area with 39 trails and a substantial separate tubing operation. It offers an after-dark mountain experience as well as daytime skiing and riding.',[
    ['vertical','Vertical drop',800,'ft'],['area','Skiable terrain',166,'acres'],['trails','Trails',39],['lighting','Night-skiing coverage',100,'%'],
  ]),
  entry('Q5048151','Cascade Mountain','https://www.cascademountain.com/faqs/','A short-vertical mountain with 48 trails and long beginner cruisers, including Far Out. The published terrain mix leans toward beginner and intermediate skiing, with advanced runs also available.',[
    ['vertical','Vertical drop',460,'ft'],['trails','Trails',48],['base','Base elevation',820,'ft'],['summit','Peak elevation',1280,'ft'],['snowmaking','Snowmaking coverage',100,'%'],
  ],'176 acres is described only as property extent, so it is not imported as skiable area. Eleven-lift total includes TubeTown.'),
  entry('Q5051346','Cataloochee','https://cataloochee.com/the-mountain/cataloochee-ski-area-statistics-and-facts/','A compact, high-elevation ski area above Maggie Valley, with a mostly beginner-and-intermediate slope mix. All slopes have lighting and snowmaking coverage, supporting its day-and-evening offering.',[
    ['vertical','Vertical drop',740,'ft'],['area','Published acreage',50,'acres'],['trails','Slopes',18,'','Includes freestyle terrain.'],['summit','Peak elevation',5400,'ft'],['base','Base elevation',4660,'ft'],['lifts','Lifts',5,'','Three chairs and two conveyors.'],
  ]),
  entry('Q5182225','Cranmore','https://cranmore.com/trail-map','A 60-trail mountain with a broad intermediate offering and four terrain parks. Its 1,200-foot vertical gives the compact ski area room for more than short learning-hill laps.',[
    ['vertical','Vertical rise',1200,'ft'],['area','Ski area',170,'acres','Published as 170+ acres.',{qualifier:'+'}],['trails','Trails',60],['lifts','Lifts',7],['summit','Published elevation',2000,'ft','Page labels this simply elevation; highest lift-served point is not independently established.'],
  ]),
  entry('Q14705323','Crotched Mountain','https://www.crotchedmtn.com/the-mountain/about-the-mountain/mountain-info.aspx','Night skiing and the high-speed Rocket chair are central to Crotched’s character. Its compact footprint combines groomed trails, glades and steeper pitches, with two terrain parks.',[
    ['vertical','Advertised vertical',1000,'ft','Published as over 1,000 vertical feet.',{qualifier:'>'}],['area','Skiable terrain',100,'acres'],['trails','Trails',25],['lifts','Lifts',5],['summit','Highest elevation',2066,'ft'],['base','Base elevation',1050,'ft'],
  ]),
  entry('Q5191297','Crystal Mountain (Michigan)','https://www.crystalmountain.com/ski/our-mountain/mountain-facts','Short-vertical skiing spread across four named sectors, with glades, terrain features and 27 slopes lit at night. This is Michigan’s Crystal Mountain, not the Washington resort.',[
    ['vertical','Vertical drop',375,'ft'],['area','Skiable terrain',104,'acres'],['trails','Downhill slopes',59],['lifts','Lifts',8],['lit_trails','Lit slopes',27],
  ]),
  entry('Q5287887','Dodge Ridge','https://dodgeridge.com/lift-tickets/','A mountain with 862 published skiable acres and Granite Bowl alongside its trail network. The 1,600-foot vertical gives it a substantial downhill footprint beyond a small learning area.',[
    ['vertical','Vertical drop',1600,'ft'],['area','Skiable terrain',862,'acres'],['lifts','Lifts',10],
    ['trails','Trails',null,'','Day-ticket page lists 70 trails plus Granite Bowl; 2025–26 pass-pack page lists 67. Date/scope difference unresolved.',{status:'conflict',confidence:'low',alternatives:[{value:70,source:'https://dodgeridge.com/lift-tickets/'},{value:67,source:'https://dodgeridge.com/pass-sale/'}]}],
  ]),
  entry('openstreetmap:way:691521201','Greek Peak','https://www.greekpeak.net/ski-ride/','A mountain offering terrain-based learning alongside evening skiing and recurring adult programs. That combination gives newcomers and returning skiers ways to build mountain time beyond a single day trip.',[], 'Summary researched; core winter statistics remain unsourced. Current conditions page is displaying summer bike trails, which are not counted as ski trails.'),
]
for(const [id,key,label,unit,alternatives,note] of [
  ['Q4734815','area','Ski-area acreage','acres',[[320,'https://arcticvalley.org/anchorage-ski-club/aschistory/'],[500,'https://arcticvalley.org/winter/']],'History reports 320 acres; winter page advertises 500+ acres. Boundary and access scope unresolved; no acreage selected.'],
  ['Q4998954','trails','Winter trails','',[[53,'https://www.skiburke.com/'],[56,'https://skiburke.com/the-mountain/weather-conditions']],'Homepage winter section reports 53; winter conditions denominator reports 56. No single count selected.'],
  ['Q5025811','glades','Glades','',[[11,'https://camdensnowbowl.com/about/'],[10,'https://camdensnowbowl.com/ski-trail-map/']],'About page lists 11; trail-map page includes 10 and 11. No single count selected.'],
]) {
  officialBatch.find(e=>e.id===`wikidata:item:${id}`).observations.push({key,label,unit,value:null,source:alternatives[0][1],alternatives:alternatives.map(([value,source])=>({value,source})),note,retrieved_at:checked,source_published_at:null,status:'conflict',confidence:'low'})
}
export function applyOfficialBatch003(records) {
  const report=applyOfficialBatch(records,{entries:officialBatch,batch:'official-003',checkedAt:checked})
  report.summary_only_profiles=officialBatch.filter(e=>!e.observations.length).map(e=>e.id)
  report.profiles.forEach(p=>{p.sources=[...new Set([...p.sources,...officialBatch.find(e=>e.id===p.id).summary_sources])]})
  return report
}
