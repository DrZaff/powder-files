import { applyOfficialBatch } from './official-batch-001.mjs'

export const checked='2026-08-31'
const entry=(id,name,source,summary,rows=[],notes='')=>({
  id:id.includes(':')?id:`wikidata:item:${id}`,name,summary,summary_sources:[source],summary_reviewed_at:checked,notes,
  observations:rows.map(([key,label,value,unit='',note='',extra={}])=>({key,label,value,unit,note,source,retrieved_at:checked,source_published_at:null,status:'source_checked',confidence:'medium',...extra})),
})
// Original summaries and limited factual observations; no copied descriptions or images.
export const officialBatch=[
  entry('Q6924907','Mountain Creek','https://mountaincreek.com/news-press/','Mountain Creek pairs a substantial New Jersey vertical with evening skiing and a strong freestyle offering. Its snowmaking covers the winter trail network; the much larger summer bike-trail count is a different activity, not extra ski runs.',[
    ['vertical','Vertical drop',1040,'ft'],['summit','Summit elevation',1480,'ft'],['trails','Winter trails',46],['snowmaking','Snowmaking coverage',100,'%'],
  ],'Lift headline and listed lift types disagree. Summer bike trails excluded.'),
  entry('Q6923283','Mount Rose Ski Tahoe','https://mtrose.com/the-mountain-web-cams/','Mt. Rose starts high: even its Main Lodge sits above eight thousand feet. The mountain spans the main-lodge side and Slide Bowl, with summit and mid-mountain viewpoints offering a useful look at the different parts of the resort.',[
    ['base','Main Lodge base elevation',8260,'ft'],['summit','Summit panoramic elevation',9700,'ft','Elevation identified by the summit webcam; not the summit of the geographic Mount Rose.'],
  ],'Camera location elevations only; no vertical calculated from them. Mountain High was deferred because official access was blocked.'),
  entry('Q6966881','Nashoba Valley','https://skinashoba.com/trail-map/','Nashoba Valley is a compact day-and-evening hill with an intermediate-heavy trail mix. Full lighting and snowmaking support short local sessions, while chairlifts, conveyors and rope tows serve different stages of progression.',[
    ['vertical','Vertical drop',240,'ft'],['trails','Trails',17],['snowmaking','Snowmaking coverage',100,'%'],['lit_terrain','Lit terrain',100,'%'],['chairlifts','Chairlifts',4,'','Three triples and one double.'],
  ],'Longest run withheld: page equates 1,400 feet with half a mile, which does not convert correctly.'),
  entry('Q7074722','Ober Mountain','https://www.obergatlinburg.com/slope-report','Ober combines a small Smoky Mountains ski footprint with learning slopes, intermediate runs and a freestyle park. Skiing is one part of a broader attraction complex; scenic rides and tubing should not be mistaken for additional ski terrain.',[
    ['area','Skiable terrain',38,'acres'],['trails','Advertised trails',10,'','Headline count; report lists terrain park separately.'],
  ],'2025–26 report. Advertised 500-foot vertical differs from the 556-foot Ober Chute entry; withheld. Planned new trail not counted.'),
  entry('Q85791365','Otis Ridge','https://otisridge.com/','Otis Ridge centers its winter experience on ski school, local racing and slopeside stays in the Berkshires. Weekend lessons and weeknight programs make it a place to build a regular skiing routine rather than just visit for a destination trip.',[], 'No dimensions inferred from the image-only trail map.'),
  entry('Q7136403','Mont-Comi','https://mont-comi.ca/la-station/','Mont-Comi spreads across three sides, mixing easier descents with steep terrain, glades and snow parks. Its Appalachian setting above the Bas-Saint-Laurent gives the hill a different character from the larger resort villages farther west.',[
    ['vertical','Vertical drop',306,'m'],['summit','Summit elevation',575,'m'],['lifts','Lifts',4,'','French source says mechanical lifts, not four chairlifts.'],['sectors','Mountain sides',3],['glades','Gladed runs',6],
  ],'French and older English trail totals differ; native metres retained instead of inconsistent summit feet conversion.'),
  entry('Q7235991','Powder Ridge, Connecticut','https://powderridgepark.com/','Powder Ridge in Middlefield blends a beginner-heavy trail mix with freestyle and evening skiing. Its skiable footprint is much smaller than the full adventure-park property, and its Connecticut identity is separate from the Minnesota resort of the same name.',[
    ['vertical','Vertical drop',417,'ft'],['area','Skiable terrain',80,'acres','Not the 255-acre property.'],['trails','Ski and snowboard trails',19],['snowmaking_area','Snowmaking terrain',68,'acres'],['night_area','Night-skiing terrain',40,'acres'],
  ],'Do not join to Powder Ridge Minnesota. Lift total withheld because tubing versus downhill scope is not explicit.'),
  entry('Q28407653','Quechee','https://quecheeclub.com/web/pages/skiquechee','Quechee offers a small, beginner-oriented Vermont hill built around a quad chair and a base lodge. Although operated by a club, its downhill tickets are available to the public, so club ownership does not mean members-only skiing.',[
    ['trails','Trails',13],
  ],'Official page explicitly confirms public daily tickets; other club amenities may have different access rules.'),
  entry('Q7370238','Rotarun','https://rotarun.org/','Rotarun is a community ski hill near Hailey with youth instruction and public skiing at its core. Its partnership with local ski educators links first turns with more advanced training, giving the small mountain a strong learn-and-progress identity.',[], 'Historical magazine dimensions not imported as current official measurements.'),
  entry('Q5712297','Sasquatch Mountain','https://sasquatchmountain.ca/','Sasquatch combines a relaxed mountain atmosphere with lessons that progress from first turns to bumps, jumps and freestyle. It suits a trip built around skiing and time on the mountain, with dining and a separate tubing activity alongside the slopes.',[], 'Animated headline counters rendered as zero and were not treated as facts; future master-plan dimensions excluded.'),
  entry('Q7516849','Silverton Mountain','https://silvertonmountain.com/mountain/stats/','Silverton is exclusively advanced and expert terrain, with a single chair leading into natural bowls and chutes rather than groomed runs. Avalanche equipment is required, and guided versus unguided access varies by season; hiking and helicopter terrain are separate from the lift-served drop.',[
    ['vertical','Lift-served vertical',1900,'ft'],['skiing_elevation','Top of chairlift',12300,'ft'],['base','Base elevation',10400,'ft'],['summit','Hike-to peak elevation',13487,'ft','Not lift served.'],['chairlifts','Double chairlifts',1],
  ],'1,819-acre hiking footprint and 26,819-acre combined headline not imported as lift-served acreage. Expert-only; check access requirements with operator.'),
  entry('Q111169545','Ski Ben Eoin','https://skibeneoin.com/','Ben Eoin grew out of a community effort to make skiing available to Cape Breton residents and visiting guests. Lessons, rentals and a dedicated alpine network form the downhill offering, while cross-country and snowshoe trails are separate ways to enjoy the hillside.',[], 'Public access supported by operator history; Nordic distances not reused for alpine skiing.'),
  entry('Q14715850','Ski Bradford','https://skibradford.com/hours/','Bradford offers a compact Massachusetts network with lit trails, glades and a terrain park. Its chairlifts and learning lifts make it useful for repeat local sessions, and snowmaking extends across the published winter terrain.',[
    ['trails','Trails and terrain areas',15,'','Operator groups trails, glades and park in its description.'],['area','Skiable terrain',60,'acres','Published as over 60 acres.',{qualifier:'+'}],['chairlifts','Triple chairlifts',3],['snowmaking','Snowmaking coverage',100,'%'],
  ],'Surface-lift count differs between hours and report; no full lift total selected.'),
  entry('Q3486255','Ski Montcalm','https://skimontcalm.com/les-cartes/pistes-de-ski/','Montcalm spreads its runs and glades over four sides, with terrain for developing skiers as well as more experienced riders. Freestyle areas add another option, while the summer bike network remains separate from the winter trail count.',[
    ['trails','Trails and glades',29,'','Glades included in headline; do not add six again.'],['lifts','Lifts',6],['sectors','Mountain sides',4],['glades','Gladed runs',6],
  ],'French and English pages disagree on park count.'),
  entry('Q24190259','Sommet Morin Heights','https://www.sommets.com/en/weather-and-winter-conditions/?tabBlockId=c76fdcf8-33e4-4769-b4d0-ba11de30e844&tabId=4','Morin Heights has a wooded Laurentian setting and a quieter, rustic identity within the Les Sommets group. Its winter offering includes downhill skiing and designated touring routes, but those activities should not be combined into one trail total.',[], 'Two official condition layouts show incompatible totals; neither is selected.'),
  entry('Q7534900','Snowstar','https://skisnowstar.com/about-snowstar.html','Snowstar pairs local ski and snowboard lanes with a substantial freestyle offering. Lessons, rentals and on-site dining make it a self-contained winter outing near the Quad Cities; tubing is a separate activity rather than part of the ski-run total.',[
    ['trails','Ski and snowboard lanes',15],['park_area','Terrain park area',28,'acres','Operator labels this park acreage; not total skiable terrain.'],
  ]),
  entry('Q7535168','Ski Land','https://skilandfairbanks.com/about-us/','Ski Land is a nonprofit, community-supported hill with an upside-down layout: the visitor starts high and skis down before riding back up. Its Silver Star Express provides a substantial local vertical without the scale or services of a large resort village.',[
    ['vertical','Silver Star Express vertical',1027,'ft','Chairlift rise, not lift travel length.'],
  ],'Current operator domain used; old skiland.org page references 2018 and is not current research.'),
  entry('Q6023980','Snowriver','https://www.snowriver.com/mountain-info/trail-map-mountain-stats','Snowriver combines Jackson Creek Summit and Black River Basin, linked by a shuttle rather than ski trails. Cruisers, mogul runs and wooded terrain give the two hills variety, while the main base at Jackson Creek carries the fuller range of visitor services.',[
    ['vertical','Vertical drop',538,'ft'],['base','Base elevation',1212,'ft'],['summit','Top elevation',1750,'ft'],['sectors','Separate mountains',2],
  ],'Combined resort scope includes Black River Basin (formerly Blackjack); no identity merge performed. Official acreage, trail and lift totals disagree.'),
  entry('Q7548314','Snow Summit','https://www.bigbearmountainresort.com/mountain-information/trail-maps','Snow Summit offers a broad mix of groomed skiing and freestyle terrain above Big Bear, with much of its rated terrain at beginner or intermediate level. These figures describe Snow Summit alone, not a combined total with Bear Mountain or Snow Valley.',[
    ['vertical','Vertical drop',1200,'ft'],['area','Skiable terrain',240,'acres','Published as over 240 acres.',{qualifier:'+'}],['trails','Trails and runs',33],['base','Base elevation',7000,'ft'],['summit','Peak elevation',8200,'ft'],['longest_run','Longest run',1.25,'mi'],
  ],'Same page lists 11 chairs in prose and 10 lifts in table; summer biking statistics excluded.'),
  entry('Q7548326','Snow Valley, California','https://www.bigbearmountainresort.com/mountain-information/trail-maps','Snow Valley in Southern California has an intermediate-and-advanced-heavy winter trail mix and terrain-park options. It is a separate mountain from Snow Summit, and the similarly named Edmonton hill has no connection to these measurements.',[
    ['vertical','Vertical drop',1041,'ft'],['trails','Winter trails and runs',32],['lifts','Winter lifts',9],['base','Base elevation',6800,'ft'],['summit','Peak elevation',7841,'ft'],
  ],'Native feet retained; page metric peak conversion differs. No summer MTB acreage imported.'),
  entry('Q7548330','Snow Valley, Edmonton','https://www.snowvalley.ca/ski-hill/the-hill/hours-current-conditions','Edmonton’s Snow Valley is a small urban ski hill suited to repeated practice and evening sessions. Its compact run network is complemented by beginner and main terrain parks; California’s Snow Valley statistics do not describe this hill.',[
    ['trails','Reported runs',8,'','Report denominator, not runs currently open.'],['lifts','Reported lifts',4,'','Report denominator.'],
  ]),
  entry('Q7548646','Snowhaven','https://grangeville.us/snowhaven-facebook2/about-snowhaven-ski-tube-hill/','Snowhaven is a city-owned local ski hill near Grangeville, oriented around weekends and selected holidays. The downhill offering includes a T-bar and a beginner rope tow; nearby cross-country trails and the tubing hill are separate activities.',[], 'Tubing vertical and lift length are not alpine mountain measurements.'),
  entry('Q5336770','Sommet Edelweiss','https://www.sommets.com/en/discover-les-sommets/sommet-edelweiss/','Edelweiss combines a local Outaouais ski outing with a strong learning focus. Two dedicated beginner areas and a covered carpet support first turns, while the wider mountain offers progression beyond the learning slopes.',[
    ['trails','Reported trails',23,'','Resort page denominator; not currently open trails.'],['learning_areas','Dedicated learning areas',2],
  ],'Five-lift headline may include tubing; full alpine-only total withheld.'),
  entry('openstreetmap:way:691521200','Song Mountain','https://www.skicny.com/song/','Song Mountain offers local skiing with a restaurant at the base and a shared pass relationship with Labrador. They remain two separate hills: a ticket partnership does not turn Labrador’s trails or vertical into Song Mountain statistics.',[], 'April report open-trail count not treated as whole network; exact OSM identity retained.'),
  entry('Q7577897','Spirit Mountain','https://spiritmt.com/winter/snow-report/','Spirit Mountain combines a substantial Midwest vertical with freestyle terrain and beginner facilities above Duluth. Its two chalet areas divide visitor services between the top and bottom, while Nordic skiing has its own separate trail network.',[
    ['vertical','Vertical drop',700,'ft'],['area','Skiable terrain',175,'acres'],['trails','Runs',22],['snowmaking_area','Snowmaking terrain',175,'acres'],['parks','Terrain parks',2,'','Published as 2+.',{qualifier:'+'}],
  ],'Winter statistics only; stale open-status banners and summer trail data not treated as current ski operations.'),
  entry('Q7615484','Stevens Pass','https://www.stevenspass.com/the-mountain/about-the-mountain/mountain-info.aspx','Stevens Pass balances a largely intermediate trail mix with demanding Cascade steeps and chutes. Evening skiing adds another way to use the mountain, while the separate Nordic center does not contribute to the alpine terrain total.',[
    ['area','Skiable terrain',1125,'acres'],['trails','Trails',52],['lifts','Lifts',13],['base','Main base elevation',4061,'ft'],['summit','Highest elevation',5845,'ft'],['parks','Terrain parks',3],
  ],'Main base is not Mill Valley base; no vertical derived by subtraction.'),
  entry('Q3497463','Stoneham','https://ski-stoneham.com/en/skiing-riding/mountain-stats/','Stoneham mixes challenging terrain with a sizeable evening-skiing network. Its three freestyle zones and half-pipe add to the trail offering, and the published ski area is kept separate from the much larger resort property.',[
    ['vertical','Vertical drop',345,'m'],['area','Ski area',135.8,'ha','Not 816.8 hectares of total property.'],['trails','Day trails',43],['lit_trails','Evening trails',19],['base','Base elevation',248,'m'],['summit','Summit elevation',593,'m'],['chairlifts','Quad chairlifts',4],['parks','Snow park zones',3],
  ]),
  entry('Q138779960','Stratton','https://www.stratton.com/the-mountain/mountain-statistics','Stratton combines a village-based Vermont resort experience with a long vertical and a substantial novice-and-intermediate trail mix. Glades and terrain parks broaden the offering beyond cruising, but glade acreage should not be added to the skiable headline without checking its scope.',[
    ['vertical','Vertical drop',2003,'ft'],['area','Skiable terrain',670,'acres','Published as 670+.',{qualifier:'+'}],['trails','Trails',99],['summit','Summit elevation',3875,'ft'],['snowmaking','Snowmaking coverage',95,'%'],['longest_run','Longest trail',3,'mi'],
  ],'Historical prose still says 11 lifts; current table says 14. Glade acreage not added to total.'),
  entry('Q14684041','Sugar Bowl','https://www.sugarbowl.com/trailmaps','Sugar Bowl links four Donner Summit peaks with open groomers and sheltered tree skiing. Its snowbound village gives it a distinctive base-area feel, while neighboring Royal Gorge is a separate Nordic destination and is not part of the downhill acreage.',[
    ['vertical','Vertical drop',1500,'ft'],['area','Skiable terrain',1650,'acres'],['peaks','Mountain peaks',4],
  ],'No figures imported from indexed TEST conditions page. Lift and trail totals withheld pending reconciliation with production reporting.'),
  entry('Q7634969','Sugarbush','https://www.sugarbush.com/mountain/terrain-and-maps','Sugarbush offers two distinct Vermont mountains: Lincoln Peak and Mt. Ellen. Trails and wooded areas provide varied skiing, with a connecting lift on selected operating days and a bus alternative; the broad landholding is not all maintained ski terrain.',[
    ['vertical','Mt. Ellen vertical',2600,'ft','Lincoln Peak has 2,400 feet.'],['area','On-trail terrain',484,'acres','97 wooded acres listed separately; not the 4,000+ total land figure.'],['glade_area','Wooded terrain',97,'acres'],['trails','Trails excluding wooded areas',111],['lifts','Lifts',16],['summit','Mt. Ellen summit',4083,'ft'],
  ]),
  entry('Q7635350','Saskadena Six (formerly Suicide Six)','https://www.saskadenasix.com/the-mountain/mountain-info','Now called Saskadena Six, this historic Vermont hill combines a small lift network with a long tradition of community skiing and racing. Family learning terrain sits alongside more challenging options; the old Suicide Six name remains only as an identity reference.',[
    ['trails','Trails',28],['lifts','Lifts',2],['snowmaking','Snowmaking coverage',60,'%'],
  ],'Existing stable identity/name retained; original summary explains current name. No historical lift fleet imported.'),
  entry('Q7637872','Summit Pass','https://timberlinelodge.com/things-to-do/skiing-snowboarding/','Summit Pass is Timberline’s lower, beginner-focused area in Government Camp, with gentle slopes, lessons and a lodge. Its own ticket is not equivalent to full Timberline access, and the upper resort’s headline vertical should not be assigned to this learning hill.',[], 'Timberline-wide acreage and lift totals not copied onto this separate lower-area record.'),
  entry('Q2027196','Sundance','https://www.sundanceresort.com/activities/skiing-snowboarding/','Sundance mixes mellow groomers, powder bowls and aspen terrain with a village shaped by arts and mountain recreation. Freestyle parks and selected night-skiing terrain add variety; conservation land surrounding the resort is not skiable acreage.',[
    ['summit','Summit elevation',8250,'ft'],['parks','Terrain parks',3],
  ],'Ski page says 540 acres while FAQ says about 615; terrain expansion scope unresolved.'),
  entry('Q7639538','Sunday River','https://www.sundayriver.com/the-mountain','Sunday River is a sprawling Maine ski network built around eight connected peaks. Cruisers, glades and a large snowmaking system favor exploring different sectors through the day rather than treating the resort as one uniform slope.',[
    ['area','Skiable terrain',884,'acres'],['trails','Trails and glades',139],['lifts','Lifts',19],['peaks','Connected peaks',8],
  ]),
  entry('Q7640495','Sunlight','https://sunlightmtn.com/','Sunlight ranges from open beginner runs and cruising terrain to steep lines and tree skiing above Glenwood Springs. The mountain keeps a local-resort feel, but some marked terrain requires hiking out and should not be assumed to return directly to a lift.',[
    ['vertical','Advertised vertical',2010,'ft'],['area','Published ski terrain',749,'acres','Trail report includes hike-out-only terrain; not wholly chair-to-chair access.'],['trails','Reported runs',77,'','Includes varied trail types; not all groomed.'],
  ]),
  entry('Q7641007','Sunridge','https://skisunridge.com/winter','Sunridge is an Edmonton hill with learning carpets, chair-served skiing, terrain parks and a skier-cross offering. Its emphasis on lessons and community events makes it a local progression spot, with tubing kept separate from the downhill experience.',[
    ['chairlifts','Chairlifts',2,'','One quad and one triple.'],['learning_lifts','Carpet lifts',3],
  ],'Full five-lift headline not used as an alpine-only total because tubing lift scope is not explicit.'),
  entry('Q14687338','Tamarack Resort','https://tamarackidaho.com/the-mountain','Tamarack offers a long Idaho vertical with an intermediate-heavy terrain mix, natural tree skiing and a two-mile continuous run. The winter ski network is distinct from its summer bike trails and the Nordic routes near Lake Cascade.',[
    ['vertical','Vertical drop',2800,'ft'],['area','Skiable terrain',1610,'acres'],['trails','Named runs',57],['lifts','Lifts',7],['base','Base elevation',4900,'ft'],['summit','Summit elevation',7700,'ft'],['parks','Terrain parks',3],['longest_run','Longest run',2,'mi'],
  ],'Annual snowfall withheld: HTML says 300 inches; March 2026 fact sheet reports 266 over 20 seasons.'),
  entry('Q7700283','Tenney Mountain','https://skitenney.com/about/mountain-information/','Tenney offers a substantial New Hampshire vertical within a relatively contained skiable footprint. Its renewed skiing and riding program includes glades and park laps, though the operator’s trail totals differ between the statistics page and current site header.',[
    ['vertical','Vertical drop',1500,'ft'],['area','Skiable terrain',130,'acres'],['summit','Published mountain elevation',2350,'ft'],
  ],'Native feet retained. Four-lift header may include tubing, so no alpine lift total selected.'),
  entry('Q14704782','Teton Pass, Montana','https://www.skitetonmt.com/mountain-info/trail-map-statistics','Teton Pass in Montana offers a small lift network and a clear distinction between chair-served skiing and higher backcountry terrain. The Big Bear chair provides the lift-served drop; the additional vertical above it requires hiking and is not part of an ordinary lift lap.',[
    ['vertical','Lift-served vertical',1000,'ft'],['area','Published skiable terrain',400,'acres','Source does not specify whether all acreage is lift-served.'],['skiing_elevation','Big Bear chair top',7200,'ft'],
  ],'Headline three lifts but only chair and carpet described; total withheld. Current report is undated, so no current-open claim.'),
  entry('Q7767293','Summit at Snoqualmie','https://www.summitatsnoqualmie.com/trail-maps','The Summit at Snoqualmie comprises several connected Summit areas plus the separate Alpental mountain. That combination supports varied skiing and extensive evening access, but a resort-wide number should not be mistaken for one continuous lift lap.',[
    ['area','Combined skiable terrain',2000,'acres','Published as nearly 2,000; includes Alpental.',{qualifier:'~'}],['lifts','Combined lifts',25,'','Across Summit areas and Alpental.'],
  ],'Alpental also has a separate directory identity; scope retained rather than merging identities or adding its backbowls again.'),
  entry('Q7799013','Thunder Ridge','https://thunderridgeski.com/','Thunder Ridge is a local New York hill with gentle learning slopes, more demanding trails and evening skiing. A sizeable carpet-lift provision complements the chairlifts, helping keep introductory sessions distinct from laps on the main runs.',[
    ['trails','Trails',22],['chairlifts','Chairlifts',3],['learning_lifts','Magic carpets',4],
  ]),
  entry('Q7799155','Thunderhill','https://skithunderhill.myshopify.com/','Thunderhill is a volunteer-supported Swan Valley ski area with upper and lower T-bar-served slopes. Groomed downhill runs and night skiing anchor the winter offering, while the small Nordic network is counted separately.',[
    ['vertical','Vertical drop',450,'ft'],['trails','Groomed downhill runs',24,'','Published as over 24.',{qualifier:'+'}],['surface_lifts','Listed T-bars',2,'','JB Construction and Brandson Express; not rope-tow history.'],
  ],'Official public homepage content; storefront availability can vary. Historical rope tow not counted.'),
  entry('Q7804661','Timber Ridge','https://www.timberridgeski.com/trail-map/','Timber Ridge in Michigan offers short lift laps across beginner hills, intermediate slopes and wooded terrain. More demanding runs and several freestyle parks extend the options beyond first turns, with tubing kept outside the ski-trail description.',[
    ['parks','Terrain parks',3],
  ]),
  entry('Q7804716','Timberline Lodge','https://timberlinelodge.com/things-to-do/skiing-snowboarding/','Timberline combines open upper-mountain skiing with forested runs and freestyle terrain on Mount Hood. Its longest advertised descent finishes at Summit Pass and requires shuttle logistics; Palmer access can be by chair or snowcat, depending on operations.',[
    ['area','Published resort skiable terrain',1685,'acres','Combined scope includes lower Summit Pass; not all chair-to-chair.'],['skiing_elevation','Highest operating point, Palmer',8540,'ft','Chairlift or snowcat access depends on operations.'],['lodge_elevation','Timberline Lodge elevation',6000,'ft','Not the lowest ski-area base.'],['chairlifts','Listed chairlifts',8,'','Six high-speed quads and two doubles; snowcats not lifts.'],
  ],'4,540-foot shuttle descent deliberately not shown as lift-served vertical; geographic Mount Hood summit excluded.'),
  entry('Q7809925','Titcomb Mountain','https://www.titcombmountain.com/the-mountain/trail-maps','Titcomb is a compact Maine community mountain with beginner instruction, a freestyle park and selected evening skiing. Its alpine slopes are separate from the longer Nordic trail network, so cross-country kilometers do not inflate the downhill offering.',[
    ['vertical','Vertical drop',350,'ft'],['trails','Advertised alpine trails',16,'','Headline count; live report also lists glades and named segments.'],['snowmaking','Alpine trail snowmaking',70,'%'],
  ],'750-foot slope length is not vertical. Nordic distance excluded.'),
  entry('Q14707489','Titus Mountain','https://www.titusmountain.com/slopeside-chalets','Titus spreads its Adirondack foothill skiing across three peaks with two lodges and slopeside cabins. Its headline count combines trails, glades and features, giving a sense of variety rather than fifty conventional groomed runs.',[
    ['trails','Trails, glades and features',50],['peaks','Mountain peaks',3],['lodges','Lodges',2],
  ]),
  entry('Q7845172','Troll Resort','https://www.trollresort.com/about','Troll pairs T-bar skiing with long groomers, wooded runs and a community-oriented base. The newer Pinegrove terrain adds mainly advanced descents, while the original mountain still includes a dedicated beginner hill.',[
    ['vertical','Approximate vertical',527,'m','Published as about 527 metres.',{qualifier:'~'}],['longest_run','Longest run',6,'km'],['surface_lifts','Named T-bars',4,'','Yellow, Red and Silver, plus Black opened in 2026; earlier paragraph still says three.'],
  ],'New Black T-bar is explicitly reported open in 2026, not merely a proposal.'),
  entry('Q7856828','Tussey Mountain','https://tusseymountain.com/snow-tubing','Tussey is a small local mountain focused on skiing progression near State College. The former tubing hill has been returned to ski and snowboard use to make more room for beginners and intermediates, so tubing is no longer part of the winter offering.',[], 'Current operator conversion notice takes precedence over old tubing descriptions.'),
  entry('Q18785813','Val Saint-Côme','https://www.valsaintcome.com/activites-en-montagne/','Val Saint-Côme mixes standard runs with an extensive glade offering, snow parks and ski-cross. Freestyle terrain is a visible part of its character, while the headline trail count combines several kinds of winter descent rather than groomers alone.',[
    ['trails','Winter trails and terrain areas',61],['lifts','Lifts including learning carpet',4,'','One triple, two quads and one carpet.'],['glades','Gladed runs',25],['parks','Snow parks',4],
  ],'Night count 12 in winter description versus 14 in site header withheld. No mixed-season distance imported.'),
  entry('Q7941810','Vorlage','https://centrevorlage.ca/winter/','Vorlage is a village-based ski outing in Wakefield with an emphasis on family visits and learning. Evening and weekday pass options support regular local skiing; a trail-only pass is separate and does not include the lifts.',[], 'Core measurements not established by current winter page; no commercial directory figures imported.'),
]

const find=id=>officialBatch.find(e=>e.id===`wikidata:item:${id}`)
for(const [id,url] of [
  ['Q24190259','https://www.sommets.com/en/what-to-do/ski-touring/'],
  ['Q7548330','https://www.snowvalley.ca/ski-hill/the-hill/terrain-park'],
  ['Q7548646','https://grangeville.us/snowhaven-facebook2/ski-tickets-and-hours-of-operation/'],
  ['Q7635350','https://www.saskadenasix.com/'],
  ['Q7640495','https://sunlightmtn.com/explore/mountain-status/'],
  ['Q7700283','https://skitenney.com/season-passes/'],
  ['Q7804716','https://timberlinelodge.com/things-to-do/4540-vertical/'],
  ['Q7845172','https://www.trollresort.com/'],
])find(id).summary_sources.push(url)
for(const id of ['Q7074722','Q7548330'])find(id).observations.forEach(o=>{o.source_period='2025–26'})

for(const [id,key,label,unit,values,other,note] of [
  ['Q6924907','lifts','Lifts','',[8,10],null,'Headline eight; listed types add to ten (including carpets). Calculated alternative; scope unresolved.'],
  ['Q7074722','vertical','Vertical drop','ft',[500,556],null,'Overview gives 500 feet; Ober Chute row gives 556. No single mountain drop selected.'],
  ['Q7136403','trails','Trails','',[30,29],'https://mont-comi.ca/en/','Current station description gives 30; older English homepage specification gives 29.'],
  ['Q14715850','lifts','Lifts','',[9,10],'https://skibradford.com/snow-report/','Hours page lists three chairs plus six surface lifts; report enumerates three chairs plus seven surface lifts. Calculated totals, not current-open counts.'],
  ['Q3486255','parks','Snow parks','',[3,4],'https://skimontcalm.com/en/maps/skiing/','French map page gives three; English page describes four.'],
  ['Q24190259','trails','Trails','',[38,15],'https://www.sommets.com/en/what-to-do/skiing-snowboarding/trail-conditions/','Official summary and detailed Morin Heights widgets disagree; no total chosen.'],
  ['Q24190259','lifts','Lifts','',[5,3],'https://www.sommets.com/en/what-to-do/skiing-snowboarding/trail-conditions/','Official summary and detailed Morin Heights widgets disagree.'],
  ['Q6023980','area','Skiable terrain','acres',[370,400],'https://www.snowriver.com/discover/winter-at-snowriver','Mountain statistics and winter overview disagree.'],
  ['Q6023980','trails','Trails and glades','',[73,56],'https://www.snowriver.com/discover/winter-at-snowriver','Statistics give 73 trails/glades; overview gives 56 runs. Scope differs and no comparable total selected.'],
  ['Q6023980','lifts','Lifts','',[7,11],'https://www.snowriver.com/discover/winter-at-snowriver','Statistics give seven; winter overview eleven (with ten in status widget). No total selected.'],
  ['Q7548314','lifts','Lifts','',[10,11],null,'Same page gives ten in winter table and eleven chairs in prose.'],
  ['Q138779960','lifts','Lifts','',[14,11],null,'Statistics table gives fourteen including carpets; historical prose gives eleven. Scope/date unresolved.'],
  ['Q2027196','area','Skiable terrain','acres',[540,615],'https://www.sundanceresort.com/faqs/','Ski page gives 540; FAQ says about 615. Expansion scope/date unresolved; alternative 615 is approximate.'],
  ['Q7700283','trails','Trails','',[50,53],'https://skitenney.com/','Statistics page lists fifty; site header reports a 53-trail network.'],
]){
  const e=find(id),source=e.summary_sources[0]
  e.observations.push({key,label,unit,value:null,source,alternatives:[{value:values[0],source},{value:values[1],source:other||source}],note,retrieved_at:checked,source_published_at:null,status:'conflict',confidence:'low'})
}

export function applyOfficialBatch007(records){
  const report=applyOfficialBatch(records,{entries:officialBatch,batch:'official-007',checkedAt:checked})
  report.summary_only_profiles=officialBatch.filter(e=>!e.observations.some(o=>o.status==='source_checked')).map(e=>e.id)
  report.profiles.forEach(p=>{p.sources=[...new Set([...p.sources,...officialBatch.find(e=>e.id===p.id).summary_sources])]})
  return report
}
