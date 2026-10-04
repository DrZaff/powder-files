import { applyOfficialBatch } from './official-batch-001.mjs'

export const checked = '2026-08-30'
// Original summaries and limited factual observations from official sources.
const entry = (id,name,source,summary,rows=[],notes='') => ({
  id:`wikidata:item:${id}`,name,notes,summary,summary_sources:[source],
  observations:rows.map(([key,label,value,unit='',note='',extra={}])=>({key,label,value,unit,note,source,retrieved_at:checked,source_published_at:null,status:'source_checked',confidence:'medium',...extra})),
})
export const officialBatch = [
  entry('Q4883736','Belleayre','https://www.belleayre.com/mountain/trail-map-and-mountain-stats/','Belleayre separates lower-mountain learning terrain from a larger intermediate-and-advanced offering higher up. Its 62-trail total includes glades and parks, giving the mountain more variety than a list of groomed runs alone.',[
    ['vertical','Vertical drop',1404,'ft'],['trails','Trails, glades and parks',62,'','Combined published count.'],['summit','Summit elevation',3429,'ft'],['lifts','Aerial and surface lifts',8,'','Includes a children-only carpet.'],['snowmaking','Snowmaking coverage',96,'%'],
  ],'Area withheld: official HTML reports 171 acres, while indexed 2024–25 official map text reports 175. PDF layout was not visually validated; no PDF dimensions imported.'),
  entry('Q4921353','Black Mountain of Maine','https://skiblackmountain.org/about-us','A nonprofit Maine mountain with substantial vertical, trail-and-glade variety and top-to-bottom night skiing. Two chairs and a T-bar give this community hill a distinctly traditional lift setup.',[
    ['vertical','Vertical drop',1380,'ft'],['trails','Trails and glades',50,'','Published as over 50.',{qualifier:'>'}],['chairlifts','Chairlifts',2],['snowmaking','Snowmaking coverage',70,'%','Published as over 70%.',{qualifier:'>'}],
  ],'Exact Maine identity; not Black Mountain in New Hampshire. Nordic distances and boundary-to-boundary acreage were not treated as lift-served downhill terrain.'),
  entry('Q4923451','Blacktail','https://blacktailmountain.com/the-mountain/','Blacktail starts the day upside down: parking and the lodge sit at the top, so a descent can come before the first chair ride. Its published difficulty mix is predominantly intermediate.',[
    ['vertical','Vertical drop',1440,'ft'],['longest_run','Longest run',1.75,'mi'],['intermediate','Intermediate terrain',65,'%'],
  ],'Top elevation withheld: current HTML says 6,780 feet; indexed older official map text says 6,676. National Forest acreage is not imported as confirmed skiable acreage.'),
  entry('Q4929240','Blue Hills','https://bluehillsboston.com/seasonal-programs/','A short-vertical hill near Boston with recurring after-school and weekend programs. Its compact scale and structured lessons make learning and regular practice central to the mountain’s offering.',[
    ['vertical','Published vertical',309,'ft','309 Club program description; 2025–26 program page.',{source_period:'2025–26'}],
  ],'Other core mountain dimensions remain unsourced.'),
  entry('Q4947991','Boston Mills / Brandywine','https://www.bmbw.com/the-mountain/about-the-mountain/mountain-info.aspx','Two separate Ohio ski areas share a ticket, with a short drive between them. Compact descents, night skiing and terrain parks define the offering; the headline acreage and trail count combine both hills.',[
    ['vertical','Longest vertical',264,'ft'],['area','Combined skiable terrain',88,'acres','Boston Mills and Brandywine combined; not one connected mountain.'],['trails','Combined trails',18],['lifts','Combined lifts',15],['summit','Highest elevation',871,'ft'],['parks','Combined terrain parks',3],['snowmaking','Snowmaking coverage',100,'%'],
  ]),
  entry('Q4962480','Bretton Woods','https://www.brettonwoods.com/snow-trail-report/','Bretton Woods pairs a substantial marked-trail network with separately listed glades. Its end-of-season report gives a sense of the mountain’s breadth, without treating trails and wooded terrain as the same count.',[
    ['trails','Reported trail total',63,'','Total denominator, not the number open.',{source_period:'2025–26 end-of-season report'}],['lifts','Reported lift total',9,'','Total denominator, not operating lifts.',{source_period:'2025–26 end-of-season report'}],
  ],'Area and glades withheld: end-of-season HTML lists 470.1 acres / 40 glades, indexed 2025–26 map text 464 / 36. PDF layout not visually validated; scope unresolved.'),
  entry('Q4964002','Brian Head','https://www.brianhead.com/brian-head-difference/','Brian Head emphasizes learning and family mountain days, with two terrain parks and views toward southern Utah’s red-rock landscape. Its published family programs complement the ski terrain rather than defining its size.',[
    ['parks','Terrain parks',2],
  ],'Core dimensions withheld pending reconciliation: official web pages and 2025–26 press-kit text differ on base elevation, acreage and trail totals. No PDF-only dimensions imported.'),
  entry('Q4967720','Brighton','https://www.brightonresort.com/about','Brighton combines a broad skiable footprint with five terrain parks and an extensive night-skiing offering. Freestyle riding and after-dark laps are substantial parts of the mountain’s character, alongside its daytime trail network.',[
    ['vertical','Advertised lift-served vertical',1875,'ft','Published vertical does not equal the difference between the listed 8,755-foot base and 10,500-foot top; not independently reconciled.'],['area','Skiable terrain',1050,'acres'],['trails','Runs',66],['chairlifts','Chairlifts',6,'','Two surface lifts listed separately.'],['parks','Terrain parks',5],['summit','Top elevation',10500,'ft'],
  ]),
  entry('Q19865758','Bryce','https://bryceresort.com/winter/ski-and-snowboard','A smaller Allegheny-foothills resort offering ski-school sessions and a junior racing program. Although member-owned, Bryce also sells access to non-members; some dates and pass periods have restrictions.',[], 'Public ticket and non-member pass access established, not a members-only club. Core numerical dimensions not established from accessible official HTML.'),
  entry('Q55606086','Buena Vista','https://www.bvskiarea.com/facts.html','A compact Minnesota hill with sixteen downhill runs and four chairlifts. Its short vertical favors repeat laps, while a separate Nordic network should not be confused with the downhill trail offering.',[
    ['vertical','Vertical drop',230,'ft'],['trails','Downhill runs',16],['chairlifts','Chairlifts',4,'','Beginner rope tow and tubing lift listed separately.'],['longest_run','Longest run',2000,'ft'],['snowmaking','Snowmaking coverage',100,'%'],
  ]),
  entry('Q5028348','Campgaw','https://www.skicampgaw.com/the-mountain','A small northern New Jersey ski area built around beginner and intermediate terrain. Short descents, learning lifts and partial night lighting make practice sessions more central than long mountain runs.',[
    ['vertical','Vertical drop',270,'ft'],['area','Skiable terrain',18,'acres'],['trails','Beginner / intermediate trails',8],['lifts','Skiing lifts',5,'','Two double chairs and three surface lifts; separate tubing lift excluded.'],['lighting','Night-lighting capability',80,'%'],['snowmaking','Snowmaking capability',100,'%'],
  ]),
  entry('Q5050194','Castle Mountain','https://www.skicastle.ca/stats/','Castle Mountain spans two mountains and eight bowls, with a long published vertical and more than 115 trails. Its broad terrain footprint offers a different scale from a compact, single-slope ski area.',[
    ['vertical','Vertical drop',870,'m','Native metric figure retained; the page’s paired feet conversion differs.'],['area','Published terrain',1454,'ha'],['trails','Trails',115,'','Published as 115+.',{qualifier:'+'}],['base','Base elevation',1425,'m'],['summit','Summit elevation',2295,'m'],['bowls','Bowls',8],
  ]),
  entry('Q5051409','Catamount','https://catamountski.com/winter/tickets-passes/lift-tickets','Catamount offers both daytime and evening slope access, making after-work laps part of its winter offering. Night access follows a specific schedule rather than extending across every day or every ticket.',[], 'Summary supported by search-indexed official 2025–26 ticket page; direct retrieval returned HTTP 403. Core numerical facts remain unsourced; hours are not reproduced as a live schedule.'),
  entry('Q28450459','Cherry Peak','https://www.skicpr.com/ski-report','Cherry Peak’s published network totals 38 trails served by four lifts. Its report includes a range of easy trails, giving newcomers named terrain to explore alongside the rest of the mountain.',[
    ['trails','Reported trail total',38,'','Report denominator, not trails currently open.'],['lifts','Reported lift total',4,'','Report denominator, not lifts currently operating.'],
  ],'Conditions values may be stale; no live opening or snow-depth claims imported.'),
  entry('Q5225725','Dartmouth Skiway','https://dartmouthskiway.com/mountain-2/','Dartmouth Skiway combines roughly a thousand feet of advertised vertical with a predominantly intermediate trail mix. Two main lifts and two carpets give learners and returning skiers distinct ways onto the slopes.',[
    ['vertical','Advertised vertical',968,'ft','Page also lists base 968 feet and summit 1,943 feet; arithmetic does not reconcile.'],['area','Skiable terrain',104,'acres'],['summit','Summit elevation',1943,'ft'],['longest_run','Longest trail',1.25,'mi'],['intermediate','Intermediate runs',50,'%'],
  ],'Base elevation withheld because it duplicates vertical on the official page; not repaired from third-party directories.'),
  entry('Q5267162','Devil’s Head','https://www.devilsheadresort.com/ski-resort-mountain-sauk-merrimac-wi-wisconsin/mountain-stats/','Devil’s Head spreads thirty trails across a short-vertical Wisconsin mountain. Its beginner, intermediate and advanced mix, plus two terrain parks, provides variety without the scale of long alpine descents.',[
    ['vertical','Vertical drop',500,'ft'],['area','Skiable terrain',300,'acres'],['trails','Trails',30],['lifts','Lifts',8,'','Six quads and two carpets.'],['parks','Terrain parks',2],['snowmaking','Snowmaking coverage',100,'%'],
  ]),
  entry('Q5281969','Discovery','https://www.skidiscovery.com/the-mountain/','Three distinct faces give Discovery its character: gentler frontside terrain, steeper mogul runs around Granite, and expert terrain on the backside. Its patrolled acreage describes a broad mountain offering, not just groomed trails.',[
    ['vertical','Vertical drop',2388,'ft'],['area','Patrolled terrain',2200,'acres'],['trails','Trails',67],['summit','Summit elevation',8158,'ft'],['longest_run','Longest run',1.5,'mi'],
  ]),
  entry('Q5316220','Purgatory / Durango Mountain Resort','https://www.purgatory.ski/3-day-winter-itinerary-at-purgatory-resort/','Purgatory offers frontside green-and-blue runs and additional terrain on the backside, with slopeside lodging for longer stays. Its separately booked snowcat outings are not part of the resort’s lift-served acreage.',[
    ['area','Published skiable terrain',1635,'acres','2023 official itinerary says over 1,635 acres; historical source, not a current-season survey.',{qualifier:'>',source_published_at:'2023-11-12',source_period:'2023 publication'}],
  ],'Joined by exact Durango resort identity and coordinates, retaining the existing record name. No snowcat acreage added; PDF-only dimensions await visual/source-scope validation.'),
  entry('Q5325323','Eaglecrest','https://skieaglecrest.com/','A community-owned ski area on Douglas Island near Juneau, Eaglecrest combines substantial vertical with a broad terrain footprint. Surrounding backcountry access is a separate proposition, not extra maintained resort terrain.',[
    ['vertical','Vertical drop',1620,'ft'],['area','Published terrain',640,'acres','Published as 640+; surrounding backcountry not added.',{qualifier:'+'}],
  ],'JavaScript statistic counters extracted as zero on other official pages; those zeros were not imported. No older PDF-only lift or trail totals imported.'),
  entry('Q5364061','Elk Mountain Ski Area','https://www.elkskier.com/','Elk Mountain pairs 27 trails with a 180-acre skiable footprint in Pennsylvania’s Endless Mountains. That gives visitors a contained trail network rather than the sprawling totals of a multi-mountain complex.',[
    ['area','Skiable terrain',180,'acres'],['trails','Trails',27],
  ],'Exact Pennsylvania ski-area identity; not the separate Utah Elk Mountain record.'),
  entry('Q5444252','Ferguson Ridge','https://skifergi.com/the-mountain','Ferguson Ridge is a volunteer-run hill with a T-bar, rope tow and a mostly green-and-blue trail mix. Its modest vertical and simple facilities give it a local community-skiing character.',[
    ['vertical','Vertical drop',640,'ft'],['trails','Runs',8],['lifts','Surface lifts',2,'','T-bar and rope tow.'],['base','Base elevation',5200,'ft'],
  ]),
  entry('Q5506156','Frost Fire','https://www.frostfirepark.org/community','Frost Fire puts community access and learning at the center of its offering. Its nonprofit ski-school program introduces local students to skiing and snowboarding through organized days on the hill.',[], 'Winter mountain dimensions not established from accessible official HTML. Summer bike-trail lengths and counts are not skiing statistics.'),
  entry('Q19878257','Manning Park / Gibson Pass','https://manningpark.com/maps-stats/','Manning Park’s alpine area combines 35 runs with 432 metres of vertical. Its downhill footprint is a small, distinct part of a much larger park, so park-wide acreage is not a ski-terrain measure.',[
    ['vertical','Alpine vertical drop',432,'m'],['area','Alpine ski area',140,'ha'],['trails','Alpine runs',35],['base','Alpine base elevation',1357,'m'],['summit','Alpine summit elevation',1789,'m'],
  ],'Exact Gibson Pass ski-area identity retained. Park-wide 83,671-hectare extent excluded from skiable terrain.'),
  entry('Q5595863','Granite Gorge','https://granitegorge.com/winter-trail-map/','Granite Gorge combines learning terrain and parks with steeper runs and glades. A summit double chair, handle tow and beginner carpet create a small lift network with distinct progression areas.',[
    ['lifts','Skiing lifts',3,'','Summit double, handle tow and beginner carpet; tubing excluded.'],
  ],'Trail lists and conditions totals vary in naming/scope, so no inferred trail count. Summer bike trails excluded.'),
  entry('Q5595907','Granite Peak','https://www.skigranitepeak.com/mountain-info/trail-map-mountain-stats','Granite Peak separates learning terrain on the main mountain from steeper eastern runs and western moguls and glades. Its seven-lift network and 700-foot vertical give this Wisconsin hill several distinct areas to explore.',[
    ['vertical','Vertical drop',700,'ft'],['area','Combined terrain',400,'acres','Published as combined acres; not all groomed piste.'],['trails','Trails',68],['lifts','Lifts',7],['base','Base elevation',1242,'ft'],['summit','Top elevation',1942,'ft'],['parks','Terrain parks',3],
  ]),
]

// Conflicting indexed PDF evidence is retained for review, never selected as a fact.
for (const [id,key,label,unit,values,pdf,note] of [
  ['Q4883736','area','Skiable acreage','acres',[171,175],'https://www.belleayre.com/wp-content/uploads/sites/5/2024/12/BelleTrailMap-24-25-02-1-1-1.pdf','Official HTML and indexed 2024–25 map text disagree. PDF layout still needs visual validation; no acreage selected.'],
  ['Q4923451','summit','Top elevation','ft',[6780,6676],'https://www.blacktailmountain.com/wp-content/uploads/2018/12/BlacktailLargeMap.pdf','Current HTML and indexed older official map text disagree. Date/scope and PDF layout need review; no elevation selected.'],
  ['Q4962480','area','Skiable acreage','acres',[470.1,464],'https://www.brettonwoods.com/content/uploads/2026/01/BW_AlpineTrailMap_2025-26.pdf','End-of-season report and indexed 2025–26 map text disagree. Scope and PDF layout need review; no acreage selected.'],
  ['Q4962480','glades','Glades','',[40,36],'https://www.brettonwoods.com/content/uploads/2026/01/BW_AlpineTrailMap_2025-26.pdf','End-of-season report and indexed 2025–26 map text disagree. Scope and PDF layout need review; no total selected.'],
]) {
  const item=officialBatch.find(e=>e.id===`wikidata:item:${id}`),source=item.summary_sources[0]
  item.observations.push({key,label,unit,value:null,source,alternatives:[{value:values[0],source},{value:values[1],source:pdf}],note,retrieved_at:checked,source_published_at:null,status:'conflict',confidence:'low'})
}

export function applyOfficialBatch004(records) {
  const report=applyOfficialBatch(records,{entries:officialBatch,batch:'official-004',checkedAt:checked})
  report.summary_only_profiles=officialBatch.filter(e=>!e.observations.length).map(e=>e.id)
  report.profiles.forEach(p=>{p.sources=[...new Set([...p.sources,...officialBatch.find(e=>e.id===p.id).summary_sources])]})
  return report
}
