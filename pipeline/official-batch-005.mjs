import { applyOfficialBatch } from './official-batch-001.mjs'

export const checked = '2026-08-31'
// Original editorial summaries and limited factual observations, not copied descriptions.
// A research batch is 50 profiles; unavailable dimensions are not invented to fill a quota.
const entry = (id,name,source,summary,rows=[],notes='') => ({
  id:id.includes(':')?id:`wikidata:item:${id}`,name,notes,summary,summary_sources:[source],summary_reviewed_at:checked,
  observations:rows.map(([key,label,value,unit='',note='',extra={}])=>({key,label,value,unit,note,source,retrieved_at:checked,source_published_at:null,status:'source_checked',confidence:'medium',...extra})),
})
export const officialBatch = [
  entry('Q5595978','Granlibakken','https://www.granlibakken.com/experiences/ski-and-snowboard-hill','Granlibakken is a learning-scale ski hill rather than a sprawling mountain network. A beginner rope tow and an intermediate Poma offer two stages of progression, with the option to exit partway up the Poma slope.',[
    ['lifts','Surface lifts',2,'','Beginner rope tow and intermediate Poma.'],
  ]),
  entry('Q5598742','Great Bear','https://www.greatbearpark.com/about/','Great Bear brings a compact downhill offering to Sioux Falls, with fourteen trails and a terrain park. Its short vertical makes repeated local laps a different proposition from a destination mountain with long descents.',[
    ['vertical','Vertical drop',182,'ft'],['trails','Downhill trails',14],
  ],'The 220-acre park is not established as skiable terrain; park acreage withheld.'),
  entry('Q5599069','Great Divide','https://www.skigd.com/mountain-stats','Great Divide pairs a 1,500-foot lift-served drop with a broad acreage footprint and more than a hundred named trails. Groomed runs and powder terrain both feature in the mountain’s published offering.',[
    ['vertical','Lift-served vertical',1500,'ft'],['area','Skiable terrain',1500,'acres'],['trails','Named trails',100,'','Published as 100+.',{qualifier:'+'}],['base','Base elevation',5830,'ft'],['summit','Top elevation',7330,'ft'],
  ]),
  entry('Q61236168','Grouse Mountain','https://www.grousemountain.com/ski-board-tickets','Grouse combines a Vancouver-area mountain outing with a substantial night-skiing and freestyle offering. Fifteen of its thirty-three runs are listed for night skiing, and six terrain parks add variety beyond the main runs.',[
    ['trails','Runs',33],['lit_trails','Night-skiing runs',15],['chairlifts','Chairlifts',4],['parks','Terrain parks',6],
  ],'Ticket page references the ended 2025–26 season. Not a live operations report; no Grouse Grind hiking vertical imported.'),
  entry('Q5619412','Gunstock','https://www.gunstock.com/about-us/resort-stats/','Gunstock combines a substantial New Hampshire vertical with marked trails, separately counted glades and evening skiing. Its published acreage includes the glades, so the wooded terrain is part of the mountain footprint rather than an extra area to add on.',[
    ['vertical','Vertical drop',1340,'ft'],['area','Skiable terrain including glades',227,'acres'],['trails','Trails, excluding five glades',44],['glades','Glades',5],['summit','Summit elevation',2300,'ft'],['lifts','Lifts',8],['snowmaking','Snowmaking coverage',98,'%'],
  ],'Night-trail totals differ between official pages (25 versus 22); no night count selected. Homepage 49 includes the five glades.'),
  entry('Q14874611','Harper Mountain','https://harpermountain.com/','Harper Mountain combines a 1,400-foot drop with more than four hundred acres of terrain. A terrain park, evening skiing and a timber lodge give the mountain a local ski-day offering alongside its downhill dimensions.',[
    ['vertical','Vertical drop',1400,'ft'],['area','Published terrain',400,'acres','Published as over 400 acres.',{qualifier:'>'}],
  ]),
  entry('Q19868228','Hidden Valley, Pennsylvania','https://www.hiddenvalleyresort.com/the-mountain/about-the-mountain/mountain-info.aspx','Hidden Valley’s Pennsylvania ski area packs twenty-six trails and two terrain parks into a relatively contained footprint. Its published terrain mix spans beginner through advanced skiing, rather than focusing on just one difficulty level.',[
    ['area','Skiable terrain',110,'acres'],['trails','Trails',26],['lifts','Lifts',8],['parks','Terrain parks',2],['summit','Summit elevation',2875,'ft'],['base','Base elevation',2405,'ft'],
  ],'Exact Pennsylvania identity, not another Hidden Valley. No vertical derived by subtracting elevations.'),
  entry('Q14680019','Hilltop','https://www.hilltopskiarea.org/webcam-1','Hilltop’s short vertical and twelve-trail network give this Anchorage ski area a compact mountain footprint. A chairlift and two surface lifts support repeat laps, with snowmaking listed across the full trail offering.',[
    ['vertical','Vertical drop',294,'ft'],['trails','Trails',12],['base','Base elevation',492,'ft'],['summit','Top elevation',786,'ft'],['snowmaking','Snowmaking coverage',100,'%'],
  ],'Facts from the Winter Stats section, not the webcam image or a live snow measurement.'),
  entry('Q5877029','Hogadon Basin','https://www.casperwy.gov/explore/hogadon_basin_ski_area/index.php','Hogadon is a city-run Casper ski area with a community focus, a snowsports school and scheduled evening skiing. Its current offering is described here without borrowing mountain dimensions from commercial directories.',[], 'Official city page establishes public winter access. Core numerical dimensions were not established from accessible official HTML.'),
  entry('Q14706383','Holiday Valley','https://www.holidayvalley.com/first-time-visitors/','Holiday Valley organizes the ski day around three base areas. The main lodge serves a broad ability range, Yodeler emphasizes intermediate and advanced terrain, and Tannenbaum offers easier and intermediate options with a picnic setting.',[
    ['base_areas','Base areas',3],
  ],'Core vertical, acreage and trail totals remain unsourced in this batch; base-area count is not a trail or lift count.'),
  entry('Q5906070','Horseshoe','https://horseshoeresort.com/activities/winter-activities/','Horseshoe combines downhill skiing, lessons and an overnight resort offering, with most runs described as available for night skiing. Official pages disagree on the downhill run total, so the guide leaves that number unsettled.',[], 'Official winter activities page lists 29 downhill runs, homepage 28; no total selected. Nordic distances are excluded.'),
  entry('Q606131','Howelsen Hill','https://steamboatsprings.net/1268/Mountain-Stats','Howelsen’s seventeen alpine trails form a compact offering separate from its Nordic network. This city-owned Steamboat hill also has a ski-jumping and training heritage, giving it a different character from a large destination resort.',[
    ['trails','Alpine trails',17,'','Nine Nordic trails are listed separately.'],['base','Base elevation',6696,'ft'],['summit','Summit elevation',7136,'ft'],['snowmaking','Snowmaking coverage',50,'%'],
  ]),
  entry('Q5944484','Hunter Mountain','https://www.huntermtn.com/the-mountain/about-the-mountain/mountain-info.aspx','Hunter divides its terrain among distinct mountain faces, from a learning area to steeper runs and bumps on Hunter West. A 1,600-foot drop and sixty-seven trails give that variety a substantial Catskills footprint.',[
    ['vertical','Vertical drop',1600,'ft'],['area','Skiable terrain',320,'acres'],['trails','Trails',67],['lifts','Lifts',13],['summit','Summit elevation',3200,'ft'],['base','Base elevation',1600,'ft'],['parks','Terrain parks',4],
  ]),
  entry('Q14692656','Hyland Hills','https://www.threeriversparks.org/page/hyland-hills-ski-runs-terrain-park','Hyland Hills pairs learning slopes with more challenging runs and dedicated North and South terrain parks. Its published trail descriptions make progression and freestyle riding central to the offering, without treating every named trail segment as a separate resort-wide total.',[], 'No explicit resort-wide numerical dimensions imported; named upper/lower trail segments are not counted as an established trail total.'),
  entry('Q15229111','Jack Frost','https://www.jfbb.com/the-mountain/about-the-mountain/mountain-info.aspx?id=5996','Jack Frost offers twenty trails across beginner, intermediate and advanced terrain in the Poconos. These figures describe Jack Frost itself; neighboring partner Big Boulder has its own trail network and should not be folded into the same mountain total.',[
    ['trails','Jack Frost trails',20],['lifts','Jack Frost lifts',9],['parks','Terrain parks',1],['summit','Summit elevation',2000,'ft'],['base','Base elevation',1400,'ft'],
  ],'Big Boulder trails, lifts and night skiing are excluded from Jack Frost facts.'),
  entry('Q14711914','Jay Peak','https://jaypeakresort.com/things-to-do/activities/skiing-snowboarding','Jay Peak’s combined trail, slope and glade count reflects a mountain where wooded terrain is part of the headline offering. A beginner zone sits alongside cruisers, tree runs and more demanding terrain, giving the network a broad ability range.',[
    ['trails','Trails, slopes and glades',81,'','Combined count, not 81 groomed runs.'],
  ],'No PDF-only vertical, acreage or elevation figures imported.'),
  entry('Q14711916','Killington','https://killington.com/mountain-stats','Killington offers a large multi-mountain trail network, with more than fifteen hundred skiable acres and 155 trails. These totals cover Killington alone, keeping neighboring Pico’s separately published terrain out of the comparison.',[
    ['area','Killington skiable terrain',1509,'acres'],['trails','Killington trails',155],['lifts','Killington lifts',19],['piste_length','Trail length',73,'mi'],
  ],'Pico totals excluded. Advertised vertical and listed summit/base arithmetic differ; vertical withheld pending clarification.'),
  entry('Q6409816','Kimberley','https://skikimberley.com/discover-kimberley/mountain-stats/','Kimberley combines a long mountain drop with roughly eighteen hundred acres of terrain. The official statistics distinguish marked trails from glades, an important difference when comparing its offering with resorts that combine both in one headline count.',[
    ['vertical','Advertised vertical',751,'m','Listed summit/base elevations differ by 752 m; published vertical retained without recalculation.'],['area','Published terrain',1800,'acres','Header describes 1,800+ acres.',{qualifier:'+'}],['summit','Summit elevation',1982,'m'],['base','Base elevation',1230,'m'],['lifts','Lifts',5],
  ],'Trail total withheld: stats list 68 trails plus 12 glades, while homepage totals vary between 79 and 80. Lift-type changes are not treated as confirmed completed construction.'),
  entry('Q6411954','King Pine','https://conditions.kingpine.com/conditions/snow-report/','King Pine’s end-of-season report describes a seventeen-trail network with easy terrain as well as more challenging runs. The guide uses the total trail denominator to describe its scale, not the number operating on a particular day.',[
    ['trails','Reported trail total',17,'','Total denominator in the April 22, 2026 report, not open trails.',{source_period:'2025–26 end-of-season report'}],
  ],'Lift denominator includes a tubing tow, so it is not imported as a downhill ski-lift count.'),
  entry('openstreetmap:way:691521199','Labrador Mountain','https://www.skicny.com/labrador/','Labrador Mountain offers more than twenty trails with an extensive evening-skiing offering. It shares a pass relationship with Song Mountain, but the guide keeps Labrador’s own terrain distinct from the two-mountain ticket.',[
    ['trails','Trails',20,'','Published as over 20 trails.',{qualifier:'>'}],
  ],'Stable OSM way identity retained. No commercial-directory vertical or combined Song/Labrador dimensions imported.'),
  entry('Q6492638','Lee Canyon','https://www.leecanyonlv.com/mountain-statistics/','Lee Canyon separates its lift-served ski area from a larger hike-to offering. The 195-acre lift footprint and 860-foot lift-served drop describe a mountain day using the lifts, without adding terrain that requires hiking.',[
    ['area','Lift-served terrain',195,'acres','Additional 250 hike-to acres excluded.'],['vertical','Lift-served vertical',860,'ft'],
  ],'Existing Las Vegas Ski and Snowboard Resort identity retained; Lee Canyon is the current official presentation. Lodge altitude is not a confirmed lowest base and the mountain summit is not a lift-served elevation.'),
  entry('Q6499924','Laurel Mountain','https://www.laurelmountainski.com/the-mountain/about-the-mountain/mountain-info.aspx','Laurel Mountain offers a compact, single-lift network with a notably steep feature in Lower Wildcat. Nineteen trails share a seventy-acre footprint, so its character is better conveyed by the terrain mix than by resort size alone.',[
    ['area','Skiable terrain',70,'acres'],['trails','Trails',19],['lifts','Lifts',1],['summit','Summit elevation',2766,'ft'],['base','Base elevation',2005,'ft'],
  ],'Published difficulty percentages sum to more than 100%; not imported.'),
  entry('Q764229','Le Relais','https://www.skirelais.com/hiver/pistes-conditions-de-neige/','Le Relais combines a substantial night-skiing network with separately listed glades and terrain parks. Its end-of-season report provides trail and lift totals, while keeping wooded areas distinct from the main trail count.',[
    ['trails','Reported trail total',33],['glades','Reported glades',5],['parks','Reported terrain parks',3],['lifts','Reported lift total',7],['lit_trails','Reported night trails',27],
  ],'April 13, 2026 report denominators, not current open counts. Individual run verticals were not treated as resort vertical.'),
  entry('Q3228008','Le Valinouet','https://valinouet.qc.ca/activites/ski-snow/','Le Valinouet emphasizes natural snow rather than snowmaking, with terrain spanning novice through expert difficulty. Its published skiable acreage is smaller than the overall site, and the guide keeps those two footprints separate.',[
    ['vertical','Vertical drop',350,'m'],['area','Skiable terrain',138,'acres','212-acre overall site is not the skiable acreage.'],['trails','Trails',36],['summit','Summit elevation',810,'m'],['base','Base elevation',460,'m'],['longest_run','Longest run',1950,'m'],
  ],'Difficulty subtotals do not reconcile with the headline 36 trails; no difficulty percentages imported.'),
  entry('Q6541882','Liberty Mountain','https://www.libertymountainresort.com/the-mountain/about-the-mountain/mountain-info.aspx','Liberty’s sixteen trails and two terrain parks occupy a hundred-acre ski area. Full published night-lighting and snowmaking coverage make evening sessions a substantial part of the offering alongside the daytime terrain mix.',[
    ['area','Skiable terrain',100,'acres'],['trails','Trails',16],['lifts','Lifts',8],['parks','Terrain parks',2],['snowmaking','Snowmaking coverage',100,'%'],['lighting','Night-lighting coverage',100,'%'],['summit','Summit elevation',1190,'ft'],['base','Base elevation',570,'ft'],
  ]),
  entry('Q6651957','Little Ski Hill','https://payettelakesskiclub.org/pages/little-ski-hill','Little Ski Hill combines a youth-program tradition with a rail garden and the Outback terrain park. A rustic lodge anchors the experience, but visitors need to plan equipment separately because on-site rentals are not offered.',[
    ['park_area','Terrain-park area',8,'acres','Published as over eight park acres, not total skiable acreage.',{qualifier:'>'}],
  ],'Park acreage must not populate the overall skiable-area field.'),
  entry('Q6671744','Lonesome Pine','https://www.lonesomepines.org/','Lonesome Pine is a Fort Kent community hill with twelve trails ranging from beginner to expert. Three are listed for night skiing, giving the compact network an after-dark offering without implying that every trail is lit.',[
    ['trails','Trails',12],['lit_trails','Night trails',3],
  ],'T-bar replacement fundraising is not treated as an already completed lift upgrade.'),
  entry('Q6675649','Loon Mountain','https://www.loonmtn.com/mountain-stats','Loon spreads its trail network across three peaks, with more than two thousand feet of vertical and thirteen lifts. Its combination of mountain breadth and modern lift facilities supports exploring several terrain areas in one outing.',[
    ['vertical','Vertical drop',2190,'ft'],['area','Skiable terrain',403,'acres'],['trails','Trails',73],['lifts','Lifts',13],['peaks','Peaks',3],['base','Base elevation',860,'ft'],['summit','North Peak summit',3050,'ft'],
  ]),
  entry('Q6684296','Lost Valley','https://www.lostvalleyski.com/trails-conditions/','Lost Valley’s Auburn trail listing ranges from beginner runs to advanced terrain, with glades and Bear Park adding variety. The guide keeps that downhill offering separate from the Nordic network rather than combining unlike trails into a headline total.',[], 'Official report is closed for the 2025–26 season. No explicit resort-wide core dimensions established; no live operation claim.'),
  entry('Q6692179','Loveland','https://skiloveland.com/the-mountain/trail-map-mountain-stats/','Loveland separates the learning-focused Valley from the Basin’s wider mountain terrain. Its 1,800 lift-served acres exclude additional hike-accessed acreage, keeping the guide’s main footprint focused on the area reached by lifts.',[
    ['area','Lift-served terrain',1800,'acres','Additional 100 hike-to acres excluded.'],['trails','Published trails',94],['skiing_elevation','Highest lift-served elevation',12700,'ft','Published mountain summit is higher and is not the top lift elevation.'],
  ],'Advertised vertical includes terrain above the highest lift; not imported as lift-served vertical. Main base and lowest lift base differ; base elevation withheld.'),
  entry('Q6705940','Lutsen Mountains','https://www.lutsen.com/mountain-info/trail-map-mountain-stats','Lutsen spreads its ski offering across four mountains overlooking Lake Superior. The guide uses the published lift-served drop rather than the larger total vertical, and flags inconsistent lift counts instead of choosing a settled network size.',[
    ['vertical','Lift-served vertical',825,'ft','Advertised 1,088-foot total vertical is not the lift-served drop.'],
  ],'1,000-acre extent includes sidecountry and is not imported as confirmed lift-served acreage. Trail totals use different primary/sidecountry groupings between pages; withheld pending scope reconciliation.'),
  entry('Q6726042','Mad River Glen','https://www.madriverglen.com/quick-facts/','Mad River Glen is a cooperative ski area with a long vertical and a traditional Single Chair. Its marked trail acreage is separate from extensive wooded terrain. This is a skiing-only mountain; snowboards are not permitted.',[
    ['vertical','Vertical drop',2037,'ft'],['area','Marked trail terrain',115,'acres','Wooded terrain is listed separately and is not added.'],['trails','Trails',60],['lifts','Lifts',5],['summit','Summit elevation',3637,'ft'],['snowmaking','Snowmaking coverage',15,'%'],
  ],'Cooperative ownership does not make downhill ticket access members-only. Snowboard access restriction retained in the summary.'),
  entry('Q14716653','Mad River Mountain, Ohio','https://www.skimadriver.com/the-mountain/about-the-mountain/mountain-info.aspx','Ohio’s Mad River Mountain combines sixteen trails with three terrain parks and night skiing. Its 300-foot vertical and full published snowmaking coverage describe a different scale and offering from Vermont’s similarly named Mad River Glen.',[
    ['vertical','Vertical drop',300,'ft','Native feet retained; paired 80-metre conversion on the page is inconsistent.'],['area','Skiable terrain',144,'acres'],['trails','Trails',16],['lifts','Lifts',9],['parks','Terrain parks',3],['summit','Summit elevation',1460,'ft'],['snowmaking','Snowmaking coverage',100,'%'],
  ]),
  entry('Q6730788','Magic Mountain, Vermont','https://www.magicmtn.com/about-magic','Magic Mountain contrasts groomed eastern terrain with steeper western runs and narrower, twisting trails. Its marked trails and glades share a substantial Vermont vertical, while additional off-map woods are kept out of the guide’s main acreage.',[
    ['vertical','Vertical drop',1500,'ft'],['area','On-map terrain',205,'acres','Additional 200 off-map wooded acres excluded.'],['trails','Trails, excluding glades',39],['glades','Glades',11],['lifts','Lifts',5],['base','Base elevation',1350,'ft'],['summit','Summit elevation',2850,'ft'],['snowmaking','Snowmaking coverage',50,'%'],
  ],'Exact Vermont identity; not Magic Mountain in Idaho.'),
  entry('Q6772183','Marmot Basin','https://www.skimarmot.com/mountain/mountain-stats/','Marmot Basin spreads ninety-one runs across five mountain faces, with a vertical approaching a kilometre. Its broad skiable area and high-elevation setting give the network mountain scale beyond the two terrain parks.',[
    ['vertical','Vertical drop',914,'m'],['area','Skiable terrain',696,'ha'],['trails','Runs',91],['lifts','Lifts',7],['base','Base elevation',1698,'m'],['summit','Summit elevation',2612,'m'],['parks','Terrain parks',2],['longest_run','Longest run',5.6,'km'],
  ]),
  entry('Q6772607','Marquette Mountain','https://www.marquettemountain.com/the-mountain/trail-map/','Marquette Mountain combines Lake Superior views with a mix of steeper runs and cruisers. Its 170 winter ski acres and 540-foot vertical describe the downhill footprint, rather than the larger summer recreation area.',[
    ['vertical','Vertical drop',540,'ft'],['area','Winter skiable terrain',170,'acres'],['trails','Runs',29],['chairlifts','Chairlifts',3,'','One surface lift listed separately.'],['summit','Summit elevation',1275,'ft'],['longest_run','Longest run',1.25,'mi'],
  ],'Summer acreage and separately listed backcountry glades are not added to downhill totals.'),
  entry('Q6784644','Massif du Sud','https://massifdusud.net/fr/page/a-propos','Massif du Sud emphasizes wooded terrain and natural mountain features, while describing skiing and snowboarding for a range of abilities. Its separate cat-skiing and off-piste offerings should not be mistaken for the lift-served trail network.',[], 'Exact Massif du Sud identity, not Le Massif. Summer bike-trail counts are excluded; no supported winter core dimensions imported.'),
  entry('Q14708301','Bottineau Winter Park','https://skibwp.com/contact/','Bottineau Winter Park pairs its public ski offering with a ski-and-snowboard school and Annie’s House adaptive program. Instruction and adaptive access are central parts of the experience described here; mountain dimensions still need further sourcing.',[], 'Official contact page supports school and adaptive program. Unrelated template-like services-page content and commercial-directory dimensions were not used.'),
  entry('Q6801655','McIntyre','https://www.mcintyreskiarea.com/trail-map/','McIntyre’s eleven-trail listing includes easier runs, glades and dedicated freestyle areas. Main lifts and learning carpets are listed separately from the tubing operation, helping distinguish the ski network from other winter activities.',[
    ['trails','Trails',11],['main_lifts','Main lifts',2,'','Two learning carpets listed separately; tubing excluded.'],
  ]),
  entry('Q6841756','Middlebury Snowbowl','https://middleburysnowbowl.com/mountain-info/','Middlebury Snowbowl pairs a thousand-foot-plus vertical with marked trails and separately counted glades. Scheduled night skiing adds an evening option, while the guide keeps trail acreage distinct from the larger wooded footprint.',[
    ['vertical','Vertical drop',1020,'ft'],['area','Marked trail terrain',110,'acres','Additional wooded acreage is not included.'],['trails','Trails',28],['glades','Glades',11],['lifts','Lifts',4],['summit','Summit elevation',2720,'ft'],
  ],'Zero-valued animated counters ignored; numbers come from populated mountain statistics.'),
  entry('Q16895225','Mission Ridge Winter Park, Saskatchewan','https://missionridge.ca/','Mission Ridge Winter Park brings skiing and snowboarding to the Fort Qu’Appelle valley, with lessons and freestyle programming alongside the slopes. This Saskatchewan area is distinct from the larger Washington resort with the same name.',[], 'Exact Saskatchewan identity. No numerical core dimensions established from accessible official HTML; tubing terrain excluded.'),
  entry('Q6893795','Mohawk Mountain','https://www.mohawkmtn.com/mountains-stats/','Mohawk combines twenty-seven trails with extensive night skiing and full published snowmaking coverage. Its compact acreage and substantial local vertical describe the terrain, while an inconsistent lift total remains flagged for clarification.',[
    ['vertical','Advertised vertical',650,'ft','Published 1,600-foot summit and 960-foot base differ by 640 feet; advertised vertical retained, not recalculated.'],['area','Skiable terrain',112,'acres'],['trails','Trails',27],['lit_trails','Night trails',16],['snowmaking','Snowmaking coverage',100,'%'],['summit','Summit elevation',1600,'ft'],['base','Base elevation',960,'ft'],
  ]),
  entry('Q6898025','Monarch','https://skimonarch.com/hours-stats/','Monarch’s lift-served terrain now spans more than a thousand acres. The guide separates that network from Mirkwood hike-accessed terrain and the additional cat-skiing operation, so the headline area does not imply lift access everywhere.',[
    ['area','Lift-served terrain',1017,'acres','129 hike-to acres and separate cat-skiing terrain excluded.'],['trails','Lift-served trails',72,'','Eight hike-accessed trails excluded from the published total of 80.'],['vertical','Advertised vertical',1225,'ft','Published resort vertical, not independently established as entirely lift-served.'],['base','Base elevation',10727,'ft'],['summit','Summit elevation',11952,'ft'],
  ],'Published nine-lift total includes tubing and lesson-only access, so it is not imported as public downhill lifts.'),
  entry('Q3321704','Mont Blanc, Quebec','https://skimontblanc.com/info-montagne/','Quebec’s Mont Blanc combines forty-three trails with two terrain parks in a 118-acre ski area. Its 210-metre drop gives this relatively contained footprint a substantial trail network without borrowing dimensions from the European mountain of the same name.',[
    ['vertical','Vertical drop',210,'m'],['area','Skiable terrain',118,'acres'],['trails','Trails',43],['lifts','Lifts',7],['summit','Published altitude',543,'m'],['parks','Terrain parks',2],
  ]),
  entry('Q61234454','Mont Farlagne','https://republiknature.com/ski/','Mont Farlagne’s skiing and snowboarding offering combines groomed runs with wooded options and a ski school. Evening access is part of the published ticket offering, while the guide leaves unsourced mountain dimensions open for further research.',[], 'Official Mont Farlagne site now directs to Republik Nature. No unverified trail, acreage or elevation figures imported.'),
  entry('Q6903087','Mont Orignal','https://www.montorignal.com/','Mont Orignal offers twenty-five trails, with eleven listed for night skiing. A six-person chair and a Poma are the main named lifts, while terrain-park features add freestyle variety to the downhill offering.',[
    ['trails','Trails',25],['lit_trails','Night trails',11],
  ],'No PDF-only vertical imported. Named lift types are described, not promoted into an unsupported total-lift statistic.'),
  entry('openstreetmap:way:278930064','Alpine Valley, Michigan','https://skialpinevalley.com/snow-report/','Michigan’s Alpine Valley combines a 300-foot vertical with lesson and evening-club programs. Its short-drop scale suits repeated practice sessions; this profile is separate from the Wisconsin resort that shares the Alpine Valley name.',[
    ['vertical','Vertical drop',300,'ft'],['summit','Peak elevation',1210,'ft'],
  ],'Exact Michigan OSM way retained. Dynamic snow-depth and open-run counts are not mountain dimensions.'),
  entry('Q4735998','Alta Sierra','https://altasierra.com/v2/','Alta Sierra offers skiing and snowboarding near Wofford Heights, with lessons, rentals and terrain-park features. Tubing is a separate activity, and the official site makes seasonal opening dependent on natural snow rather than a guaranteed calendar.',[], 'Official page describes season closure pending natural snow. No live operation guarantee or unsupported core dimensions.'),
  entry('Q4796182','Arrowhead, New Hampshire','https://arrowheadnh.com/','Arrowhead is a volunteer-run nonprofit hill with a limited skiing and riding operation. Its current offering should not be assumed to cover the former full ski area; check the hill’s latest announcement before planning a visit.',[], 'Official 2025–26 notices describe limited skiing/riding and less than full operation. Former full-footprint dimensions withheld.'),
  entry('Q4804085','Ascutney Outdoors','https://www.ascutneyoutdoors.org/skiing/','Ascutney Outdoors revives a smaller part of the former resort as a volunteer-supported community ski area. The current T-bar footprint offers eight trails and 450 feet of vertical on natural snow, without on-site lessons or rentals.',[
    ['vertical','Current T-bar-served vertical',450,'ft'],['area','Current T-bar-served terrain',26,'acres'],['trails','Current T-bar-served trails',8],['longest_run','Longest current run',3100,'ft'],
  ],'Existing Ascutney resort identity retained. Current partial footprint only, not former resort totals. T-bar operation depends on conditions; rope-tow-only operation can be smaller.'),
]

const find = id => officialBatch.find(e=>e.id===`wikidata:item:${id}`)
for (const [id,url] of [
  ['Q606131','https://steamboatsprings.net/131/Howelsen-Hill-Ski-Area'],
  ['Q6726042','https://www.madriverglen.com/equipment-policy/'],
  ['Q4796182','https://arrowheadnh.com/winter/'],
]) find(id).summary_sources.push(url)
officialBatch.find(e=>e.id==='openstreetmap:way:278930064').summary_sources.push('https://skialpinevalley.com/lessons/')
for(const id of ['Q61236168','Q764229']) find(id).observations.forEach(o=>{o.source_period='2025–26'})

for (const [id,key,label,values,other,note] of [
  ['Q5906070','trails','Downhill runs',[29,28],'https://horseshoeresort.com/','Official winter-activities page reports 29 downhill runs; homepage reports 28. No single count selected.'],
  ['Q6492638','trails','Trails',[31,27],'https://www.leecanyonlv.com/hours/','Official mountain statistics report 31 trails; Winter Stats on the hours page report 27. Dates/scope unresolved.'],
  ['Q6705940','lifts','Lifts',[7,9],'https://www.lutsen.com/mountain-info/mountain-report','Official mountain stats list seven lifts; mountain report lists nine. Scope/date unresolved; no total selected.'],
  ['Q6893795','lifts','Lifts',[8,9],'https://www.mohawkmtn.com/mountains-stats/','The official page says eight lifts but lists five triples and four carpets (nine by addition). Internal inconsistency, not two independent totals.'],
]) {
  const item=find(id),source=item.summary_sources[0]
  item.observations.push({key,label,unit:'',value:null,source,alternatives:[{value:values[0],source},{value:values[1],source:other}],note,retrieved_at:checked,source_published_at:null,status:'conflict',confidence:'low'})
}

export function applyOfficialBatch005(records) {
  const report=applyOfficialBatch(records,{entries:officialBatch,batch:'official-005',checkedAt:checked})
  report.summary_only_profiles=officialBatch.filter(e=>!e.observations.some(o=>o.status==='source_checked')).map(e=>e.id)
  report.profiles.forEach(p=>{p.sources=[...new Set([...p.sources,...officialBatch.find(e=>e.id===p.id).summary_sources])]})
  return report
}
