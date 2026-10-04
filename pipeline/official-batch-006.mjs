import { applyOfficialBatch } from './official-batch-001.mjs'

export const checked = '2026-08-31'
const entry=(id,name,source,summary,rows=[],notes='')=>({
  id:id.includes(':')?id:`wikidata:item:${id}`,name,summary,summary_sources:[source],summary_reviewed_at:checked,notes,
  observations:rows.map(([key,label,value,unit='',note='',extra={}])=>({key,label,value,unit,note,source,retrieved_at:checked,source_published_at:null,status:'source_checked',confidence:'medium',...extra})),
})
// Limited factual observations and original character summaries from official HTML.
// Explicit identifiers only; no current-open claims, copied descriptions or images.
export const officialBatch=[
  entry('Q130503760','Mont Grand-Fonds','https://montgrandfonds.com/fr/ski-alpin','Mont Grand-Fonds combines groomed runs, bumps and wooded terrain above Charlevoix. The steeper Versant du Lynx adds a distinct option for experienced skiers, while learning terrain keeps the offering broader than the expert sector alone.',[
    ['vertical','Vertical drop',335,'m'],['area','Skiable terrain',160,'acres'],['lifts','Lifts including learning lifts',4],['longest_run','Longest run',2.5,'km'],
  ],'Snowmaking acreage and percentage do not reconcile exactly; withheld. Trail total differs from the conditions page, which also lists the terrain park.'),
  entry('Q14704736','Montana Snowbowl','https://www.montanasnowbowl.com/trails-report/index.php','Montana Snowbowl divides its terrain among bowl runs, wooded mountain sectors and a smaller base-area offering. The lift network includes traditional double chairs and surface lifts, giving the area a different feel from a high-speed resort complex.',[
    ['chairlifts','Listed chairlifts',4,'','Three doubles and one triple enumerated in the official lift report; not the number open.'],
  ],'June 30, 2026 report. No numerical dimensions imported from the historical master plan or PDF maps.'),
  entry('Q6919591','Baldy Mountain Resort, British Columbia','https://baldyresort.com/mountain/','Baldy brings marked runs and extensive glades to the South Okanagan, with routes returning to the central day lodge. Its highest chairlift stops below the mountain summit, so summit height should not be mistaken for lift-accessed skiing.',[
    ['area','Marked trail terrain',360,'acres','240 acres of glades are listed separately.'],['glade_area','Gladed terrain',240,'acres'],['trails','Alpine runs',35],['skiing_elevation','Highest lift-served elevation',2123,'m'],['summit','Mountain summit',2310,'m','Not the highest lift-served point.'],
  ],'Exact BC identity, not Ontario or California. Total lift count withheld: mountain page names four lifts, homepage says three. No mismatched feet/metre conversions imported.'),
  entry('Q6919769','Mount Bohemia','https://www.mtbohemia.com/about/','Mount Bohemia emphasizes ungroomed runs, wooded sectors and demanding terrain rather than manicured cruising. Some descents finish at a bus pickup, and Little Boho requires a hike; the experience is not entirely chair-to-chair skiing.',[
    ['vertical','Advertised vertical',900,'ft'],['area','Published resort terrain',585,'acres','Includes sectors with bus returns and hike access; not all chair-to-chair terrain.'],['chairlifts','Chairlifts',2],
  ],'Separate Voodoo cat-skiing area is not added. No tourism-directory acreage imported.'),
  entry('Q14716235','Mount Brighton','https://www.mtbrighton.com/the-mountain/about-the-mountain/mountain-info.aspx','Mt Brighton is a compact southeastern Michigan ski area with two terrain parks and full published snowmaking coverage. Its beginner-to-advanced mix makes progression part of the offering, while the official trail total still needs clarification.',[
    ['area','Skiable terrain',130,'acres'],['chairlifts','Chairlifts',5,'','Seven surface lifts listed separately.'],['parks','Terrain parks',2],['snowmaking','Snowmaking coverage',100,'%'],['summit','Highest elevation',1330,'ft'],['base','Base elevation',1100,'ft'],
  ]),
  entry('Q6921255','Mount Hood Meadows','https://www.skihood.com/explore/trail-maps','Mount Hood Meadows offers a broad skiable footprint with a smaller area set aside for night skiing. The Hood River base sits below the main lodge, an important distinction when comparing elevations or planning where to start the day.',[
    ['area','Skiable terrain',2150,'acres'],['night_area','Night-skiing terrain',140,'acres'],['base','Hood River lodge elevation',4528,'ft','Main base lodge is at 5,366 feet.'],['skiing_elevation','Top of Cascade lift',7305,'ft'],
  ],'Nordic, snowshoe and summer maps excluded. No resort vertical derived from lodge altitudes.'),
  entry('Q1950718','Mount Seymour','https://mtseymour.ca/the-mountain/trail-map','Mount Seymour mixes learning terrain, intermediate runs and freestyle parks in a contained North Shore footprint. Night skiing covers part of the network, and the parking-lot elevation sits above the lowest skiing point.',[
    ['vertical','Vertical drop',330,'m'],['area','Downhill ski terrain',200,'acres'],['trails','Downhill runs',40,'','Additional off-piste terrain is not counted as named runs.'],['lit_trails','Night runs including parks',13],['parks','Terrain parks',3],['base','Bottom elevation',935,'m','Parking and day lodge are at 1,020 m.'],['summit','Top elevation',1265,'m'],
  ],'Current HTML statistics used; older PDF park counts and proposed development are not current infrastructure.'),
  entry('Q3326037','Mount Shasta Ski Park','https://www.skipark.com/winter/trail-map-stats','Mt Shasta Ski Park pairs more than two thousand feet of advertised vertical with a predominantly intermediate-and-advanced terrain mix. Twilight skiing covers a subset of trails, rather than extending across the whole winter network.',[
    ['vertical','Vertical drop',2036,'ft'],['area','Skiable terrain',635,'acres'],['trails','Trails',38],['lit_trails','Twilight trails',14],['base','Base-area elevation',5500,'ft'],['longest_run','Longest run',2,'mi','Published as 2+ miles.',{qualifier:'+'}],
  ],'Annual snowfall withheld: trail-map page says 157 inches, public-relations page 275. Separate backcountry acreage excluded.'),
  entry('Q6923783','Mount Spokane','https://www.mtspokane.com/trail-maps','Mt Spokane combines a large acreage footprint with a trail mix weighted toward intermediate skiing. Six chairlifts serve the mountain, while separate learning and park lifts and a night-skiing network add more focused options.',[
    ['area','Skiable terrain',1704,'acres'],['vertical','Advertised skiable vertical',2000,'ft','Summit minus base-lodge elevation is smaller; lodge is not established as the lowest skiing point.'],['trails','Designated runs',53],['lit_trails','Night runs',16],['summit','Summit elevation',5889,'ft'],['chairlifts','Chairlifts',6,'','One triple plus five doubles; park handle tow and learning surface lift are separate.'],
  ]),
  entry('Q6923794','Mount St. Louis Moonstone','https://www.mountstlouis.com/','Mount St. Louis Moonstone combines the Louis and Moonstone sides with beginner progression areas and evening skiing. The resort advertises a two-kilometre longest run, but its official pages disagree on overall acreage and slope totals.',[
    ['longest_run','Longest run',2,'km'],
  ],'Announced 2026–27 improvements are not treated as already operating. Combined Louis/Moonstone profile retained.'),
  entry('Q18707447','Mont Sutton','https://montsutton.com/en/the-mountain/technical-info-2/','Mont Sutton makes wooded skiing a major part of its character, with glades covering nearly half the skiable domain. Numerous trail junctions let visitors vary their descents; those junctions are not extra trails to add to the total.',[
    ['vertical','Published vertical',1500,'ft','English HTML figure retained in native units.'],['area','Skiable domain',230,'acres'],['trails','Trails',60],['glade_share','Gladed share of domain',45,'%'],['chairlifts','Chairlifts',9,'','Three quads and six doubles; one learning carpet is separate.'],
  ]),
  entry('Q6924501','Mount Washington Alpine Resort','https://www.mountwashington.ca/the-mountain/about','Mount Washington brings coastal views, glades and bowls to Vancouver Island skiing. A dedicated learning-carpet area complements its five chairlifts, and the alpine network is separate from the extensive Nordic trails around Raven Lodge.',[
    ['area','Alpine terrain',1700,'acres','In-bound resort terrain; includes terrain described as boot-pack accessible.'],['vertical','Advertised vertical rise',1657,'ft'],['trails','Published alpine runs',82],['chairlifts','Chairlifts',5,'','Learning carpets are separate.'],
  ],'Current About page used rather than older map totals or summer bike counts. No ambiguous summit altitude imported.'),
  entry('Q61233805','Mt Abram','https://www.mtabram.com/winter/hours-info/','Mt Abram separates its learning-focused Westside from the Mainside’s intermediate runs, steeper trails and glades. Traditional double chairs and a T-bar are part of the mountain’s character, with two base lodges supporting the distinct terrain areas.',[
    ['vertical','Vertical drop',1150,'ft'],['area','Published skiable terrain',450,'acres'],['lifts','Lifts',4],['base_areas','Base lodges',2],
  ],'Page includes 2025–26 holiday dates. Headline 42 trails differs from ability counts summing to 44; no trail total selected.'),
  entry('Q14874871','Mt Norquay','https://banffnorquay.com/trail-map/','Norquay combines four chairlifts with learning conveyors and a freestyle park that also operates under lights. Its published vertical describes ski descents, while the listed area elevations do not reconcile with that drop.',[
    ['vertical','Advertised vertical descent',503,'m','Page lists base 1,680 m and top 2,450 m; these do not describe a 503 m difference. Elevation scope unresolved.'],['chairlifts','Chairlifts',4,'','Mystic, Cascade, Spirit and North American; conveyors and tubing excluded.'],['snowmaking','Snowmaking on skiable terrain',85,'%'],
  ],'No PDF-only acreage or trail count imported. Unresolved base/top elevation scope withheld.'),
  entry('Q1588256','Nakiska','https://skinakiska.com/discover-nakiska/mountain-stats/','Nakiska’s terrain mix is predominantly intermediate, with a long vertical and extensive snowmaking coverage. The marked-run network is served by chairlifts and learning carpets, making the statistics distinct from nearby summer or hiking routes.',[
    ['vertical','Vertical drop',735,'m'],['area','Skiable terrain',1021,'acres'],['trails','Marked trails',71],['base','Base elevation',1525,'m'],['summit','Top elevation',2260,'m'],['snowmaking','Snowmaking coverage',95,'%'],['longest_run','Longest run',3.3,'km'],
  ],'Current HTML used rather than older PDF counts. Future summer expansion is not winter terrain.'),
  entry('Q7067815','Nub’s Nob','https://www.nubsnob.com/who-we-are/','Nub’s Nob spreads its skiing across three peaks, with glades, terrain parks and a separate free beginner area. Two lodges support the ski day, while the modest vertical makes this a network for repeated laps rather than long alpine descents.',[
    ['vertical','Vertical drop',427,'ft'],['area','Skiable terrain',248,'acres'],['trails','Ski runs',53],['chairlifts','Chairlifts',8],['snowmaking','Snowmaking coverage',97,'%','Gladed tree runs are excluded from snowmaking coverage.'],['peaks','Peaks',3],
  ]),
  entry('Q7081931','Okemo','https://www.okemo.com/the-mountain/about-the-mountain/mountain-info.aspx','Okemo combines a broad Vermont trail network with five terrain parks and extensive snowmaking coverage. Its published terrain mix is distributed across beginner, intermediate and advanced runs, rather than concentrating on a single ability level.',[
    ['area','Skiable terrain',667,'acres'],['trails','Trails',123],['lifts','Published lifts',20],['parks','Terrain parks',5],['snowmaking','Snowmaking coverage',98,'%'],['summit','Highest elevation',3344,'ft'],['base','Base elevation',1144,'ft'],
  ],'No vertical inferred from the two elevations; current HTML lift total retained without counting PDF map entries.'),
  entry('Q7132127','Paoli Peaks','https://www.paolipeaks.com/the-mountain/about-the-mountain/mountain-info.aspx','Paoli Peaks brings skiing and snowboarding to southern Indiana’s wooded ridges. Its terrain mix leans intermediate, with beginner access near the lodge, a terrain park and evening skiing extending the options beyond daytime laps.',[
    ['trails','Trails',15],['lifts','Published lifts',8],['parks','Terrain parks',1],['summit','Highest elevation',900,'ft'],['snowmaking','Snowmaking coverage',100,'%'],
  ],'Nearby forest acreage and tubing-lane length are not ski-area dimensions.'),
  entry('Q7148200','Pats Peak','https://www.patspeak.com/the-mountain/mountain-info/trail-map/','Pats Peak puts learning within reach through three beginner areas with their own lifts and an easy route from the summit. Glades, racing terrain and a substantial night-skiing offering add variety beyond those introductory slopes.',[
    ['vertical','Vertical drop',770,'ft'],['trails','Trails and slopes',28,'','Nine glade areas are listed separately.'],['glades','Glade areas',9],['lifts','Lifts',11],['base','Base elevation',690,'ft'],['summit','Summit elevation',1460,'ft'],['longest_run','Longest run',1.5,'mi'],
  ],'Cascade Basin expansion acreage is a subset, not total skiable area. No conditions guarantee copied from marketing.'),
  entry('Q7158509','Pebble Creek','https://pebblecreekskiarea.com/the-mountain/','Pebble Creek offers a substantial Idaho vertical and a terrain mix with plenty of advanced skiing alongside beginner runs. The top of Skyline lift sits below the mountain summit, so the two heights describe different things.',[
    ['vertical','Advertised vertical drop',2200,'ft'],['area','Published terrain',1100,'acres'],['trails','Named runs',51],['chairlifts','Triple chairlifts',3,'','One conveyor is listed separately.'],['skiing_elevation','Top of Skyline lift',8650,'ft'],['summit','Mountain summit',9271,'ft','Not the highest lift-served point.'],
  ]),
  entry('Q7168022','Perfect North Slopes','https://perfectnorth.com/snow-report/','Perfect North combines a compact vertical with several chair-served slope areas and a separately listed tubing operation. Its trail network provides a local winter outing without the scale or altitude of a large mountain destination.',[
    ['vertical','Vertical drop',400,'ft'],['summit','Peak elevation',800,'ft'],['chairlifts','Listed chairlifts',5,'','Five named chairs in the report; not current open count or a total including surface lifts.'],
  ],'End-of-2025–26 report. Snow depth and snowfall counters are not mountain dimensions.'),
  entry('Q7235982','Powder King','https://www.powderking.com/contact/about-us','Powder King combines gentle groomed runs with steeper options in northern British Columbia’s Pine Pass. A chair and surface lifts serve the marked network, while inconsistent published acreage and elevation conversions remain unresolved.',[
    ['trails','Marked runs',38],['lifts','Chair and surface lifts',3,'','One triple chair and two surface lifts.'],['vertical','Advertised vertical drop',640,'m','Published summit/base elevations and their feet conversions do not reconcile with this drop.'],
  ],'Area withheld: 405 hectares is not equivalent to the paired 925 acres. Summit 1,829 m / 5,500 ft is also inconsistent; no elevation selected.'),
  entry('Q7260955','Purden','https://www.purden.com/skiabout.html','Purden combines tree-lined runs with a traditional two-chair setup near Prince George. Its lodge includes a fireplace and slope-facing seating, making a straightforward ski day central to the offering rather than a large resort village.',[
    ['vertical','Advertised vertical',335,'m','Top chair minus lodge altitude is 336 m; native advertised vertical retained.'],['chairlifts','Double chairlifts',2],['skiing_elevation','Top of Yellow chair',1311,'m'],['lodge_elevation','Lodge altitude',975,'m','Not independently established as the lowest skiing point.'],
  ]),
  entry('Q7278590','Rabbit Hill','https://www.rabbithill.com/lift-tickets/','Rabbit Hill offers a separate beginner-area ticket covering rope tows and learning carpets, alongside full-hill access. That distinct learning setup is useful for first outings; the tubing park is a different activity with its own ticket.',[
    ['learning_lifts','Beginner-area lifts',4,'','Two rope tows and two conveyors; not the full resort lift total.'],
  ],'Core mountain dimensions remain unsourced; ticket prices and temporary promotions are not retained.'),
  entry('Q7282899','Ragged Mountain','https://www.raggedmountainresort.com/mountain-report-cams/','Ragged combines the Summit Six and Spear Mountain chair-served areas with smaller beginner lifts and carpets. Its reported run network includes terrain-park areas, so the headline count should not be read as entirely conventional groomed trails.',[
    ['trails','Reported run total',57,'','Report denominator, not trails currently open.'],['chairlifts','Listed chairlifts',3,'','Summit Six, Spear Mountain Express and Barnyard Triple; two carpets are separate.'],
  ],'Uphill route appears in the lift table but is not a lift. No live operation claim.'),
  entry('Q7397750','Saddleback','https://www.saddlebackmaine.com/the-stats/','Saddleback organizes its terrain into distinct areas that separate learning slopes from more demanding upper-mountain runs. Hand-cut glades and two terrain parks complement the marked network, giving visitors more than a collection of groomed cruisers.',[
    ['vertical','Advertised vertical drop',2000,'ft','Listed 4,120-foot summit and 2,460-foot base differ by 1,660 feet; base scope unresolved.'],['area','Skiable terrain',600,'acres','Published as 600+ acres.',{qualifier:'+'}],['trails','Named runs',68],['lifts','Lifts',6],['summit','Summit elevation',4120,'ft'],['parks','Terrain parks',2],
  ]),
  entry('Q7441742','Searchmont','https://searchmont.com/about/','Searchmont combines rolling terrain with runs long enough for sustained laps, plus glades and freestyle features. Its published difficulty mix leans intermediate, while learning belts complement the chairlift network.',[
    ['vertical','Vertical drop',214,'m'],['area','Published carvable area',100,'acres'],['trails','Runs',26],['long_runs','Runs at least one kilometre',10],['chairlifts','Chairlifts',4,'','Three triples and one quad; two belts are separate.'],['snowmaking','Snowmaking coverage',90,'%'],
  ]),
  entry('Q7457464','Seven Springs','https://www.7springs.com/the-mountain/about-the-mountain/mountain-info.aspx','Seven Springs pairs a substantial Pennsylvania trail network with seven terrain parks and night skiing. Slopeside lodging and other resort activities make it a stay-and-ski option, while nearby sister resorts remain separate mountains.',[
    ['area','Skiable terrain',285,'acres'],['trails','Trails',33],['lifts','Lifts',10],['parks','Terrain parks',7],['summit','Highest elevation',2994,'ft'],['base','Base elevation',2240,'ft'],
  ],'Hidden Valley and Laurel Mountain are not included in these totals. No vertical inferred from elevations.'),
  entry('Q3960702','SilverStar','https://www.skisilverstar.com/community/discover-silverstar/the-silverstar-difference/','SilverStar combines a large interior-BC terrain footprint with a colourful mid-mountain village. Beginner runs, playful terrain, backside glades and demanding chutes give the resort different kinds of mountain days within one ski area.',[
    ['vertical','Vertical drop',760,'m'],['area','Skiable terrain',3304,'acres'],['trails','Runs',133],
  ],'Nordic networks are not added to downhill trail totals.'),
  entry('Q2292122','Ski Apache','https://www.skiapache.com/mountain-info/','Ski Apache brings a broad high-elevation trail network to the Sierra Blanca range. The gondola reaches above the separately listed top elevation, while the mountain peak is higher still; those heights should not be treated interchangeably.',[
    ['vertical','Advertised vertical drop',1900,'ft'],['area','Skiable terrain',750,'acres','Published as over 750 acres.',{qualifier:'>'}],['trails','Runs and trails',55],['base','Base elevation',9600,'ft'],['skiing_elevation','Gondola top',11500,'ft'],
  ],'Lift-type scope and conflicting snowfall statistics require further review. No mountain-peak altitude imported as lift access.'),
  entry('Q7534854','Ski Butternut','https://skibutternut.com/the-mountain/mountain-info/mountain-stats','Butternut’s Berkshire terrain is predominantly intermediate, with a thousand-foot drop and a compact marked-trail footprint. Quad chairs and learning carpets support the downhill offering; the separate tubing carpet is not part of the skiing lift count.',[
    ['vertical','Vertical drop',1000,'ft'],['area','Skiable terrain',100,'acres'],['trails','Trails',22],['chairlifts','Quad chairlifts',5],['summit','Summit elevation',1800,'ft'],['snowmaking','Snowmaking coverage',100,'%'],
  ]),
  entry('Q14685092','Ski Cooper','https://www.skicooper.com/mountain-stats-map/','Cooper offers a high-base Colorado ski day on natural snow, with a rotating approach to grooming. Its 480 lift-served acres describe the regular ski area, rather than combining it with other terrain associated with Chicago Ridge.',[
    ['vertical','Vertical drop',1200,'ft'],['area','Lift-served terrain',480,'acres'],['trails','Trails',64],['lifts','Lifts',5],['base','Base elevation',10500,'ft'],['summit','Top elevation',11700,'ft'],
  ],'Annual snowfall withheld because the same page gives 250 and about 260 inches.'),
  entry('Q7534851','Ski Brule','https://skibrule.com/brule-mountain/trail-map-stats/','Ski Brule combines a compact trail network with several freestyle areas and a mid-mountain lodge. Night sessions use a smaller set of lower slopes served by surface tows, not the daytime chairlift network.',[
    ['area','Skiable terrain',150,'acres','Not the surrounding 3,000-acre property.'],['trails','Trails',17],['parks','Terrain parks',3,'','Two additional terrain trails listed separately.'],['chairlifts','Chairlifts',5],['snowmaking','Snowmaking coverage',100,'%'],['longest_run','Longest trails',1,'mi'],
  ],'Nordic distances and tubing lifts are not included in downhill dimensions.'),
  entry('Q4930619','Bluewood','https://bluewood.com/about-us','Bluewood combines marked trails and tree skiing high in southeastern Washington’s Blue Mountains. Its lift-served acreage is distinct from snowcat-accessed terrain, and community access programs are part of the mountain’s local focus.',[
    ['area','Lift-served terrain',400,'acres','Published as nearly 400 acres.',{qualifier:'~'}],['trails','Trails',24],['lifts','Published lifts',4],['base','Base elevation',4545,'ft'],
  ],'Separate snowcat terrain excluded. Conditions page reports summer road repairs; this is not a promise of current road access.'),
  entry('Q7534904','Ski Sundown','https://skisundown.com/plan-your-trip/trail-map-statistics/','Ski Sundown packs a broad difficulty range into a compact Connecticut ski area. More than half its trails are classed as easier, with a mile-long easy route and freestyle features on two trails adding progression options.',[
    ['vertical','Vertical drop',625,'ft'],['area','Skiable terrain',70,'acres'],['trails','Trails',17],['base','Base elevation',450,'ft'],['summit','Top elevation',1075,'ft'],['snowmaking','Snowmaking coverage',100,'%'],['longest_run','Longest trail',1,'mi'],
  ]),
  entry('Q7548711','Snowshoe','https://www.snowshoemtn.com/mountain-info/mountain-stats','Snowshoe offers three distinct winter areas: the varied Basin, night skiing at Silver Creek and longer, steeper descents in Western Territory. Their different verticals matter more than a single resort-wide number, and the overall property is not all ski terrain.',[
    ['vertical','Western Territory vertical',1500,'ft','Sector-specific; Snowshoe Basin has an 800-foot drop.'],['basin_vertical','Snowshoe Basin vertical',800,'ft'],['basin_trails','Snowshoe Basin trails',37,'','Not a resort-wide total.'],['western_trails','Western Territory trails',4],['lit_trails','Silver Creek night trails',12],
  ],'11,000-acre property is not skiable acreage. No combined trail total selected because Silver Creek official totals differ.'),
  entry('Q7558292','Solitude','https://www.solitudemountain.com/mountain-and-village/mountain-information/solitude-by-the-numbers','Solitude combines a long Wasatch vertical with a broad skiable footprint and substantial advanced terrain. Half of the published terrain mix is advanced or expert, making the off-piste offering a significant part of its character.',[
    ['vertical','Vertical drop',2494,'ft'],['area','Skiable terrain',1200,'acres'],['trails','Named runs',82],['base','Bottom elevation',7994,'ft'],['summit','Top elevation',10488,'ft'],
  ],'Lift-type table is stale relative to the announced six-person Eagle replacement; no lift-type count imported.'),
  entry('Q106178840','Ski Cloudcroft','https://skicloudcroft.net/','Ski Cloudcroft is a smaller high-elevation New Mexico area with a trail mix spanning beginner through expert. A double chair and surface tows support the ski terrain, while lessons and rentals make first visits part of the offering.',[
    ['vertical','Vertical drop',700,'ft'],['trails','Ski trails',25],['lifts','Ski lifts',3],['base','Base elevation',8400,'ft'],['summit','Top elevation',9100,'ft'],
  ],'March 7, 2026 closure is seasonal, not a permanent closure. Tubing vertical is separate.'),
  entry('Q7534909','Ski Ward','https://skiward.com/mountain-info/about-us/','Ski Ward’s short vertical and nine-trail network make it a compact Massachusetts option for learning and repeat laps. A substantial snow-school offering complements beginner, intermediate and expert trails, with tubing treated separately.',[
    ['vertical','Vertical drop',220,'ft'],['area','Skiable terrain',45,'acres'],['trails','Trails',9],['snowmaking','Snowmaking coverage',100,'%'],
  ],'Official About page says four lifts, conditions page five. No total selected.'),
  entry('Q7534850','Bromont','https://www.bromontmontagne.com/en/discover-the-mountain/discover-the-mountain-winter/','Bromont spreads skiing across seven mountainsides with an extensive night-lit network. Learning slopes, wooded terrain and different aspects give it a multi-area feel; the ski footprint is smaller than the entire recreation property.',[
    ['area','Skiable terrain',450,'acres'],['trails','Trails and glades',123,'','Current winter page; map identifies this as a combined trail/glade count.'],['lit_trails','Night-lit trails and glades',90],['mountainsides','Mountainsides',7],
  ],'Current HTML counts retained; older 2024–25 figures are not silently reused. Summer mountain-bike trail totals excluded.'),
  entry('Q7534857','Ski Chantecler','https://www.skichantecler.com/en/trail-map/','Ski Chantecler offers a contained twenty-five-trail network in Sainte-Adèle’s Laurentian setting. Its trail mix spans easier slopes through demanding runs, giving families and experienced skiers options without a sprawling destination-resort footprint.',[
    ['trails','Trails',25],
  ],'Acreage, vertical, lifts and elevations remain unsourced; report open count is not used.'),
  entry('Q14875770','Ski Martock','https://www.martock.com/mountain/trail-map/','Martock pairs separate ski and snowboard learning hills with intermediate runs, glades and freestyle terrain. A quad, T-bar and learning carpet support the network; tubing and the T-bar’s midway unload are not extra ski lifts.',[], 'No supported core numerical dimensions imported. Map labels include a midway unload, duplicate run numbering and tubing; simple enumeration would misstate totals.'),
  entry('Q7548208','Snow Creek','https://www.skisnowcreek.com/the-mountain/about-the-mountain/mountain-info.aspx','Snow Creek brings a compact ski area to the bluffs of the Missouri River. Its trail mix is mostly intermediate, with a terrain park and full published snowmaking coverage supporting the local winter offering.',[
    ['area','Skiable terrain',25,'acres'],['trails','Trails',14],['lifts','Published lifts',5],['summit','Highest elevation',1100,'ft'],['base','Base elevation',800,'ft'],['snowmaking','Snowmaking coverage',100,'%'],
  ],'No vertical inferred by subtracting elevations. Tubing dimensions excluded.'),
  entry('Q7548753','Snowy Range','https://snowyrangeski.com/','Snowy Range offers a contained high-elevation ski area in Wyoming’s Medicine Bow setting, with learning slopes and more challenging terrain. Its mountain scale is clearer from the skiable acreage than from the inconsistent published vertical and trail counts.',[
    ['area','Skiable terrain',250,'acres'],['base','Base elevation',8798,'ft'],['summit','Summit elevation',9663,'ft'],
  ],'Advertised vertical 990 feet differs from the 865-foot elevation difference; no vertical chosen. Homepage 30 trails differs from 33 listed report rows, whose segment scope needs review.'),
  entry('Q104864484','Skeetawk','https://skeetawk.com/lift2','Skeetawk’s current lift-served offering is a small learning-scale area in Hatcher Pass. Much larger acreage describes future lift expansion or snowcat-accessed terrain, so the guide keeps today’s chairlift footprint separate from those ambitions.',[
    ['area','Current chairlift-served terrain',30,'acres','Proposed 500-acre gondola access and 1,100-acre lease area are excluded.'],
  ],'Future gondola is not counted as built. Mid-mountain snowcat operations do not establish present lift access.'),
  entry('Q7534848','Ski Big Bear, Pennsylvania','https://ski-bigbear.com/','Ski Big Bear at Masthope offers eighteen trails and a substantial local vertical in northeastern Pennsylvania. Three learning carpets complement the chairlift network, making introductory sessions part of the offering alongside more challenging runs.',[
    ['vertical','Vertical drop',650,'ft'],['trails','Trails',18],['lifts','Lifts including carpets',7,'','Includes three learning carpets.'],
  ],'Exact Pennsylvania identity, not California Big Bear Mountain Resort.'),
  entry('openstreetmap:way:278923089','Mt Holly','https://skimtholly.com/snow-report/','Mt Holly’s modest vertical supports repeated Michigan laps, with chair-served runs and separate learning carpets and rope tows. The published network also includes dedicated park areas rather than only conventional ski trails.',[
    ['vertical','Vertical drop',350,'ft'],['summit','Peak elevation',1115,'ft'],
  ],'Stable OSM identity preserved. Cached condition report is not a live status check; no trail total inferred by counting segments.'),
  entry('openstreetmap:way:278929769','Pine Knob','https://skipineknob.com/snow-report/','Pine Knob combines a short Michigan vertical with learning carpets, rope tows and several terrain parks. The contained hill offers repeat-lap variety, while the park areas are listed separately from the main trail network.',[
    ['vertical','Vertical drop',302,'ft'],['summit','Peak elevation',1202,'ft'],
  ],'Stable OSM identity preserved. Stale open-season banner is not treated as current operation.'),
  entry('Q7195117','Pine Creek','https://www.pinecreekskiresort.com/mountain-stats','Pine Creek offers a sizeable Wyoming terrain footprint with a mix spanning beginner through advanced skiing. Public skiing is normally concentrated around weekends and holidays; private-hire days do not make it a members-only resort.',[
    ['area','Skiable terrain',640,'acres'],['trails','Ski runs',32,'','Published as 32+.',{qualifier:'+'}],['summit','Summit elevation',8225,'ft'],
  ],'Advertised 1,450-foot drop conflicts with the history page’s 1,425-foot lift descent; no vertical selected.'),
  entry('Q106041132','Sandia Peak Ski Area','https://www.sandia.ski/mountain-stats','Sandia Peak combines a substantial New Mexico vertical with a contained thirty-five-run network. Its ski-school surface lift is restricted to lessons, and the separately operated scenic tramway should not be counted as another downhill ski lift.',[
    ['vertical','Vertical drop',1700,'ft'],['area','Skiable terrain',300,'acres'],['trails','Runs',35],['base','Base elevation',8678,'ft'],['summit','Summit elevation',10378,'ft'],['main_lifts','General-area lifts',3,'','One additional ski-school-only surface lift; its type differs between official pages.'],
  ],'Ski area figures, not scenic tram rise. Surface lift type withheld because official pages disagree between tow and carpet.'),
]

const find=id=>officialBatch.find(e=>e.id===`wikidata:item:${id}`)
find('Q6919769').summary_sources.push('https://www.mtbohemia.com/')
find('Q7534850').summary_sources.push('https://www.bromontmontagne.com/en/maps-of-the-mountain/?act=1')
find('Q106041132').summary_sources.push('https://www.sandia.ski/press-release')
find('Q7260955').summary_sources.push('https://www.purden.com/skihome.html')
for(const id of ['Q14704736','Q61233805','Q7168022']) find(id).observations.forEach(o=>{o.source_period='2025–26'})

for(const [id,key,label,unit,values,other,note] of [
  ['Q130503760','trails','Trail total','',[23,24],'https://montgrandfonds.com/fr/live','Ski page lists 23 trails; conditions page advertises 24 and includes a park entry. Scope not resolved; no total chosen.'],
  ['Q14716235','trails','Trails','',[25,24],null,'Same official page gives 25 trails in prose and 24 in its statistics. No total selected.'],
  ['Q6923794','trails','Slopes','',[35,36],'https://www.mountstlouis.com/status/','Homepage gives 35 slopes; status denominator is 36. No count selected.'],
  ['Q6923794','area','Skiable terrain','acres',[170,180],'https://www.mountstlouis.com/mountain-facts/','Homepage advertises 170 acres; history page concludes with 180. Dates/scope unresolved.'],
  ['Q61233805','trails','Trails','',[42,44],null,'Same page headline gives 42 trails; listed ability counts 10 + 21 + 13 sum to 44. The latter is calculated from categories, not an independent headline.'],
  ['Q7534909','lifts','Lifts','',[4,5],'https://skiward.com/mountain-info/conditions/','About page lists four lifts; conditions statistics list five. No total selected.'],
  ['Q7195117','vertical','Vertical drop','ft',[1450,1425],'https://www.pinecreekskiresort.com/history-of-pine-creek','Mountain stats give 1,450 feet; history describes 1,425 feet from summit to parking. Scope/date unresolved.'],
  ['Q7548753','trails','Trails','',[30,33],'https://snowyrangeski.com/lifts-and-trails-report/','Homepage advertises 30 trails; the report enumerates 33 named rows including segments. Row count is calculated and may have a different scope.'],
  ['Q7548711','silver_creek_trails','Silver Creek sector trails','',[15,18],'https://www.snowshoemtn.com/things-to-do/silver-creek','Mountain stats list 15 Silver Creek trails; dedicated sector page lists 18. Combined resort total withheld too.'],
]) {
  const e=find(id),source=e.summary_sources[0]
  e.observations.push({key,label,unit,value:null,source,alternatives:[{value:values[0],source},{value:values[1],source:other||source}],note,retrieved_at:checked,source_published_at:null,status:'conflict',confidence:'low'})
}

export function applyOfficialBatch006(records){
  const report=applyOfficialBatch(records,{entries:officialBatch,batch:'official-006',checkedAt:checked})
  report.summary_only_profiles=officialBatch.filter(e=>!e.observations.some(o=>o.status==='source_checked')).map(e=>e.id)
  report.profiles.forEach(p=>{p.sources=[...new Set([...p.sources,...officialBatch.find(e=>e.id===p.id).summary_sources])]})
  return report
}
