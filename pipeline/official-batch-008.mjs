import { applyOfficialBatch } from './official-batch-001.mjs'

export const checked='2026-08-31'
const entry=(id,name,source,summary,rows=[],notes='')=>({
  id:id.includes(':')?id:`wikidata:item:${id}`,name,summary,summary_sources:[source],summary_reviewed_at:checked,notes,
  observations:rows.map(([key,label,value,unit='',note='',extra={}])=>({key,label,value,unit,note,source,retrieved_at:checked,source_published_at:null,status:'source_checked',confidence:'medium',...extra})),
})
// Original editorial summaries; limited factual observations with native units and scope.
export const officialBatch=[
  entry('Q7974551','Waterville Valley','https://www.waterville.com/mountain-stats','Waterville Valley has an intermediate-heavy trail mix, with freestyle zones, learning programs and steeper options for progressing skiers. Its published ski acreage is distinct from the larger mountain property, keeping the scale of the downhill offering clear.',[
    ['vertical','Vertical drop',2020,'ft'],['area','Skiable terrain',265,'acres'],['trails','Trails',62],['summit','Published summit elevation',4004,'ft'],['longest_run','Longest run',1.9,'mi'],['snowmaking','Snowmaking coverage',100,'%'],
  ],'Glade headline five versus six named glades withheld; 500 total acres are not skiable acreage.'),
  entry('Q51766765','Whiteface','https://whiteface.com/mountain/mountain-stats/','Whiteface offers a long lift-served descent, an intermediate-heavy trail network and substantial expert terrain. The Slides add a separate, condition-dependent challenge above the lifts; their extra vertical and acreage are not folded into the lift-served headline.',[
    ['vertical','Lift-served vertical',3166,'ft'],['area','Skiable terrain excluding Slides',299,'acres'],['trails','Trails',94],['base','Base elevation',1220,'ft'],['skiing_elevation','Highest lift terminus',4386,'ft'],['longest_run','Wilmington Trail',2.1,'mi'],
  ],'3,430-foot advertised maximum includes the Slides; 4,867-foot mountain peak is not a lift terminus. Snowmaking 99% here versus 98% mountain page withheld.'),
  entry('Q7996356','Whitewater','https://skiwhitewater.com/faq/','Whitewater leans strongly toward advanced skiing, with bowls, glades and expert runs defining much of its trail mix. Beginner and intermediate routes are also listed, but its in-bounds footprint is smaller than the broader total terrain promoted by the resort.',[
    ['vertical','Published vertical drop',614,'m','Advertised vertical; do not derive it from Main Lodge and highest chair elevations, which have different scope.'],['area','In-bounds terrain',553,'ha','Not 1,314 hectares of broader total terrain.'],['trails','Runs',107],['base','Published base elevation',1630,'m'],['skiing_elevation','Raven chair elevation',2063,'m'],['longest_run','Longest run',4.4,'km'],
  ],'Ymir Peak and individual chair elevations remain distinct. No snowfall average imported without a defined averaging period.'),
  entry('Q8026466','Wintergreen','https://www.wintergreenresort.com/winter/','Wintergreen pairs Blue Ridge skiing with evening sessions and a freestyle park designed for progression. Snowmaking supports the ski terrain, while tubing is a separate activity rather than additional ski runs.',[
    ['snowmaking','Snowmaking coverage',100,'%'],['high_speed_sixes','High-speed six-seat chairs',2,'','A lift subtype, not the whole lift system.'],
  ]),
  entry('Q8026497','Winterplace','https://owa.winterplace.com/mountain/mountain-facts','Winterplace emphasizes learning and easy access near Interstate 77, with beginner and intermediate slopes making up most of its terrain. Night skiing and terrain parks extend the options, while its separate tubing park serves non-skiers.',[
    ['vertical','Vertical drop',603,'ft'],['area','Skiable terrain',90,'acres','Published as 90+ acres.',{qualifier:'+'}],['trails','Slopes excluding two parks',28],['base','Base elevation',2997,'ft'],['summit','Top elevation',3600,'ft'],['lifts','Ski lifts',9,'','Separate tubing carpets not added.'],['longest_run','Panorama run',1.25,'mi'],['snowmaking','Snowmaking coverage',100,'%'],
  ]),
  entry('Q8027682','Wisp','https://www.wispresort.com/safety_stats/','Wisp is a Western Maryland outing with a balanced mix of beginner, intermediate and advanced runs. Lighting and snowmaking cover much of the reported ski terrain, but the operator publishes incompatible acreage totals that still need clarification.',[
    ['trails','Runs',33],['lifts','Lifts',11,'','Seven chairs and four surface lifts.'],['summit','Summit elevation',3115,'ft'],['night_area','Snowmaking and night-skiing area',118,'acres'],
  ]),
  entry('Q8029831','Wolf Creek','https://wolfcreekski.com/the-mountain/','Wolf Creek combines gentle learning slopes and intermediate groomers with extensive trees, bowls, chutes and ridgelines. Its family-run character and varied terrain give mixed-ability groups options, while expert sections retain a more natural, off-piste feel.',[
    ['vertical','Vertical drop',1604,'ft'],['area','Published skiable terrain',1600,'acres','Not represented as entirely groomed or directly lift-accessed.'],['trails','Named trails',133],['base','Base elevation',10300,'ft'],['summit','Summit elevation',11904,'ft'],['lifts','Lifts including conveyors',11],['longest_run','Navajo Trail',2,'mi'],
  ],'Nordic trails excluded; snowfall average lacks a stated period and is not imported.'),
  entry('Q8022836','Wilmot','https://www.wilmotmountain.com/the-mountain/about-the-mountain/mountain-info.aspx','Wilmot is a compact day-and-night ski area on the Wisconsin state line. A fairly even split of beginner, intermediate and advanced trails supports progression, with snowmaking across the terrain and a long-established ski school.',[
    ['area','Skiable terrain',120,'acres'],['trails','Trails',25],['base','Base elevation',770,'ft'],['summit','Highest elevation',960,'ft'],['lifts','Lifts',10],['snowmaking','Snowmaking coverage',100,'%'],
  ],'Park count withheld: three in statistics, three plus a progression park in prose. No vertical manufactured from elevation subtraction.'),
  entry('Q7996297','Whitetail','https://www.skiwhitetail.com/the-mountain/about-the-mountain/mountain-info.aspx','Whitetail arranges beginner terrain on one side and expert runs on the other, making its progression-oriented layout easy to understand. Fully lit trails and extensive snowmaking support evening skiing as well as day trips.',[
    ['area','Skiable terrain',120,'acres'],['trails','Trails',23],['base','Base elevation',865,'ft'],['summit','Highest elevation',1800,'ft'],['lifts','Lifts',9],['snowmaking','Snowmaking coverage',100,'%'],['lit_terrain','Trails lit for night skiing',100,'%'],['parks','Terrain parks',2],
  ],'Existing OSM Whitetail profile is a potential duplicate; no merge or second research credit. Approximate prose vertical not converted to an exact value.'),
  entry('Q7980565','Welch Village','https://www.welchvillage.com/trailMap.cfm','Welch Village offers a broad trail selection on a modest Minnesota vertical, with extensive snowmaking and a chairlift-heavy network. It suits repeat local laps from the Twin Cities or Rochester area without presenting itself as a high-alpine destination.',[
    ['vertical','Vertical rise',360,'ft'],['area','Skiable terrain',140,'acres'],['trails','Trails',50],['base','Valley floor elevation',700,'ft'],['summit','Summit elevation',1060,'ft'],['quad_chairs','Quad chairlifts',7],['snowmaking','Trail snowmaking',100,'%'],
  ]),
  entry('Q3567781','White Pass','https://skiwhitepass.com/the-mountain','White Pass combines steeper runs off Great White Express with the broader exploration of Paradise Basin. Views toward Mount Rainier, a mid-mountain meeting lodge and slopeside lodging give it a relaxed mountain-trip character alongside its learning facilities.',[], 'Current mountain overview supports character but provides no numerical mountain dimensions.'),
  entry('Q8000723','Wild Mountain','https://wildmountain.com/','Wild Mountain puts learning and regular local participation at the center of its winter offering, with youth lessons, adult programs, racing and freestyle coaching. Its Taylors Falls site also has summer attractions, which are separate from the ski experience.',[], 'Winter trail map is image-only in inspected page; no counts copied from third-party widgets.'),
  entry('Q4950384','Bousquet','https://bousquetmountain.com/lift-trail-status/','Bousquet offers a dedicated beginner area, a terrain park and named expert chutes, allowing a local ski day to span several ability levels. Two ski chairs and a learning carpet serve the slopes; the tubing carpet is a separate facility.',[
    ['chairlifts','Named ski chairlifts',2,'','Blue and Yellow chairs.'],['learning_lifts','Beginner ski carpet',1,'','Tube Town carpet excluded.'],
  ],'Trail segments are not counted as a headline trail network; report marks winter season ended.'),
  entry('Q4850340','Bald Mountain, Idaho','https://skibaldmountain.com/','Bald Mountain is a small, volunteer-run hill in the Clearwater Mountains of north-central Idaho. Its public, family-oriented skiing and range of ability levels offer a community alternative to a large destination resort.',[], 'Not Sun Valley or other Bald Mountain resorts. Homepage confirms public weekend operation; numerical dimensions not established.'),
  entry('Q28233470','Duck Mountain','https://skitheduck.com/','Duck Mountain offers tree-lined runs ranging from beginner to expert in Saskatchewan. T-bars serve the main skiing, while a carpet supports the learning hill and tubing; the small-team atmosphere and valley setting are part of its appeal.',[
    ['trails','Runs',22],['main_tbars','Named main T-bars',2,'','Green and Black; shared learning/tubing carpet excluded from this subtype.'],
  ]),
  entry('Q6730786','Magic Mountain, Idaho','https://magicmountainresort.com/','Magic Mountain is a small southern Idaho ski outing near Kimberly, with lessons, rentals and a short menu of trails for different abilities. Its family-focused approach includes tubing, which should not be confused with extra downhill ski terrain.',[
    ['trails','Advertised ski trails',11],
  ],'120 acres described jointly for skiing, sledding and tubing; not imported as confirmed ski-only acreage. 7,240-foot elevation is not explicitly base or summit.'),
  entry('Q7994804','White Hills','https://www.whitehillsresort.com/','White Hills brings downhill skiing to the Clarenville area with a community-oriented mix of trails, lessons and rental equipment. Nordic skiing, snowshoeing and other winter activities sit alongside the downhill offer rather than increasing its trail count.',[
    ['trails','Downhill trails',27],
  ]),
  entry('Q6921262','Mount Hood Skibowl','https://skibowl.com/about-winter/stats/','Skibowl has a substantial night-skiing network and long descents, making evening laps a defining part of its mountain experience. Its published terrain includes far more runs than those lit at night, so daytime and evening access should be planned separately.',[
    ['vertical','Published vertical drop',1500,'ft','Published base and summit differ by 1,377 feet; scope of headline vertical needs confirmation.'],['area','Published terrain',960,'acres'],['trails','Runs',69],['night_trails','Night-lit runs',36],['chairlifts','Chairlifts',4],['longest_run','Skyline Trail',3,'mi'],['base','Published base elevation',3650,'ft'],['summit','Published summit elevation',5027,'ft'],
  ],'Surface/conveyor totals not combined because ski versus tubing scope is unclear; vertical/elevation arithmetic caveat retained.'),
  entry('Q7231694','Porters','https://portersalpineresort.com/winter/lifts-trails-parks/','Porters combines gentle learning terrain, longer intermediate cruising and demanding upper-mountain skiing. A main park and a smaller park add freestyle progression, while scenic chairlift rides are not offered separately from skiing and snowboarding.',[
    ['vertical','Published vertical',678,'m','Published base 1,310 m and peak 1,980 m differ by 670 m; headline scope unresolved.'],['area','Skiable terrain',285,'ha'],['base','Base elevation',1310,'m'],['summit','Peak elevation',1980,'m'],
  ],'Sundance lift type differs between official widgets; no lift-type total inferred.'),
  entry('Q7371252','Roundhill','https://www.roundhill.co.nz/','Roundhill offers a surface-lift ski day near Tekapo, with learning lifts, T-bars and the Heritage Express rope tow serving different parts of the mountain. A ski school, terrain park and mountain cafes round out the visit; wind can interrupt lift access.',[
    ['tbars','Named T-bars',2],
  ],'Numerical dimensions not established from accessible operator page; daily weather closure not treated as permanent closure.'),
  entry('Q7856127','Tūroa','https://www.pureturoa.nz/','Tūroa spreads across a volcanic landscape on Mount Ruapehu, with open runs, natural half-pipes and off-trail options. Intermediate terrain forms the largest share of its published mix, alongside learning facilities and more demanding descents.',[
    ['vertical','Vertical descent',722,'m'],['area','Published terrain',500,'ha'],['skiing_elevation','Highest lift point',2230,'m'],['chairlifts','Chairlifts',4],['pomas','Poma lifts',2],['learning_lifts','Magic carpet',1],
  ],'Promotional claim of largest Australasian vertical not repeated; no glacier or geographic peak elevation imported.'),
  entry('Q7080625','Ōhau','https://www.ohau.co.nz/ohau-snow-fields/snow','Ōhau pairs broad intermediate cruising from its double chair with a smaller learning area and freestyle parks. Hiking above the lifts offers additional terrain, but that larger mountain footprint is kept separate from the chair-accessed ski area.',[
    ['vertical','Lift-served vertical',400,'m'],['area','Terrain from top of chairlift',125,'ha','Not 600 hectares from the top of Mt Sutton.'],['skiing_elevation','Highest lift',1825,'m'],['base','Lift base',1425,'m'],['lifts','Ski lifts',3,'','Double chair, platter and snow mat.'],['parks','Terrain parks',2],
  ],'Inspected information page carries 2025 season dates; base facilities at 1,500 m differ from lift base.'),
  entry('Q7284711','Rainbow','https://skirainbow.co.nz/ski-area-info/','Rainbow is a public, club-run field near Nelson Lakes with broad groomed slopes for beginners and intermediates. Higher powder runs, chutes and a terrain park add challenge; membership is not required to ski here.',[
    ['vertical','Lift-accessed vertical',218,'m'],['skiing_elevation','Top lift elevation',1760,'m'],['carpark_elevation','Mountain carpark elevation',1540,'m','Carpark is not an asserted lift base.'],['lifts','Listed ski lifts',5,'','Main T-bar, intermediate platter and three tows.'],
  ],'1,820 m in-bounds terrain elevation is above the top lift. Daily operations must be checked separately.'),
  entry('Q4973460','Broken River','https://www.brokenriver.co.nz/about-br/mountain/trail-map-and-mountain-stats/','Broken River offers rope-tow skiing with a small beginner component and a much larger intermediate and advanced offering. On-mountain stays, natural snow and scheduled night skiing create a distinctive club-field experience that also welcomes visitors.',[
    ['vertical','Published vertical',500,'m'],['area','Published ski area',175,'ha','Operator notes hiking and touring; not asserted entirely lift-accessed.'],['lifts','Rope tows',5,'','Three main and two learner tows.'],
  ],'Public visitor access confirmed on operator homepage; natural snowfall slogan is not snowmaking coverage.'),
  entry('Q5181703','Craigieburn Valley','https://www.craigieburn.co.nz/','Craigieburn focuses on natural, ungroomed skiing: steeps, chutes and powder bowls reached by rope tows. Visitors are welcome, but the operator recommends confidence on intermediate runs before a first visit; this is not a conventional first-timer learning resort.',[], 'Official overview confirms public visitor access and rope tows; mountain dimensions remain unsourced.'),
  entry('Q6922586','Mount Olympus','https://www.mtolympus.co.nz/the-mountain','Mount Olympus is a public-access club field built around rope tows and natural freeride terrain rather than groomed pistes. Mellow bowls sit alongside steeper chutes, with on-mountain lodge stays and a separate, much larger hike-accessed vertical.',[
    ['vertical','Lift-accessed drop',450,'m'],['area','Rope-tow-accessed terrain',80,'ha'],['lifts','Rope tows',4],['base','Bottom tow elevation',1430,'m'],['skiing_elevation','Top tow elevation',1880,'m'],
  ],'1,050 m hike-accessed drop and 2,096 m mountain peak excluded from lift-served headline. Non-member tickets listed.'),
  entry('Q988298','Charlotte Pass','https://charlottepass.com.au/who-we-are/','Charlotte Pass offers a snowbound, car-free winter village in Kosciuszko National Park. Hotels and lodges cluster around the ski experience, making it a different sort of stay from a drive-up day area; proposed lift changes are not treated as installed facilities.',[], 'No dimensions established on inspected overview; future Guthries replacement not counted.'),
  entry('Q39057299','Corin Forest','https://www.corin.com.au/ski-and-snowboard/','Corin Forest is designed around first turns, with gentle terrain and a simple carpet lift. Lessons and equipment packages support beginners; its ski slope is a distinct activity from snowplay and the alpine slide.',[
    ['learning_lifts','Ski-area magic carpet',1],
  ],'Permanent outdoor learning slope, not an indoor slope or temporary snowplay park. No ski dimensions inferred from session duration.'),
  entry('Q14713688','Hurricane Ridge','https://www.hurricaneridge.com/ski-area-info/','Hurricane Ridge offers a compact ski outing inside Olympic National Park, with rope tows and a Poma rather than a large chairlift network. Mountain weather and road access are important parts of planning a visit.',[
    ['trails','Trails',10],['rope_tows','Rope tows',2],['pomas','Poma lift',1],['base','Published lowest base',4800,'ft'],['summit','Published highest point',5500,'ft'],
  ],'800-foot advertised vertical withheld because published endpoints differ by 700 feet; no replacement vertical calculated.'),
  entry('Q14680584','Mount Lemmon Ski Valley','https://www.skithelemmon.com/new-page-1','Mount Lemmon offers a winter ski day near Tucson with equipment rentals and both group and private instruction. First-timer packages make learning part of the offering; year-round scenic-chair operations should not be mistaken for year-round snow skiing.',[], 'Numerical mountain dimensions not established on inspected operator pages.'),
  entry('Q5568271','Glencoe','https://www.glencoemountain.co.uk/winter/','Glencoe combines gentle plateau skiing for first-timers with more demanding upper-mountain terrain. Its Scottish mountain setting and variety of runs give developing skiers and experienced riders different ways to spend the day.',[
    ['trails','Runs',20],
  ],'Lift headline and available-uplift denominator disagree; no lift total selected.'),
  entry('Q10726608','Åre','https://www.skistar.com/en/ski-destinations/are/winter-in-are/','Åre spans distinct ski areas: the main village pairs longer, challenging runs with dining and nightlife, Björnen emphasizes families, and Duved and Tegefjäll offer wider cruising. A shared pass does not mean every sector is connected by ski runs.',[
    ['lifts','Lifts across Åre ski areas',47],
  ],'Unitless 890 vertical on overview withheld. Conflicting slope totals retained.'),
  entry('Q879508','Björkliden','https://bjorkliden.com/en/experiences/skiing-trails/','Björkliden pairs family pistes with more adventurous skiing among mountain birches in an Arctic setting. Its own slopes are distinct from the broader Arctic Ski Pass network, and off-piste exploration requires separate mountain judgment.',[
    ['trails','Björkliden slopes',23,'','Not the 44 runs across three Arctic Ski Pass destinations.'],
  ]),
  entry('Q3368232','Branäs','https://www.branas.se/en/','Branäs is built around family ski holidays, with playful children’s areas and slopeside places to stay. Green, blue and red runs give progressing skiers options beyond the learning areas without losing the family-oriented feel.',[
    ['vertical','Vertical drop',415,'m'],['trails','Slopes',34],['lifts','Lifts',32],
  ],'Report denominators describe inventory, not currently open slopes or lifts. Nordic distances excluded.'),
  entry('Q10534105','Idre Fjäll','https://www.idrefjall.se/en/skiing/','Idre Fjäll offers skiing on different sides of the mountain, with terrain parks, instruction and steeper northern slopes. Mostly ski-in, ski-out lodging and nearby shops and restaurants support a stay where the car can take a back seat.',[], 'No numerical dimensions imported from map search snippets; reviewed HTML supports summary only.'),
  entry('Q1943086','Kittelfjäll','https://kittelfjall.com/en/skiing-kittelfjall','Kittelfjäll is shaped by natural ravines, birch forests and off-piste skiing, with groomed runs and children’s areas alongside that adventurous terrain. Its lift-served vertical is separate from the larger descents reached by hiking or helicopter.',[
    ['vertical','Lift-served vertical',420,'m'],['groomed_runs','Published groomed slopes',9],['off_piste_runs','Published off-piste slopes',25],['children_areas','Children’s areas',2],
  ],'40-slope prose differs from category counts; no whole-resort trail total. Lift list sums to five while headline says four.'),
  entry('Q3815892','Kläppen','https://www.klappen.se/en/skiing/','Kläppen combines skiing on multiple sides of the mountain with a substantial freestyle focus. A dedicated children’s area, ski school and parks make it suited to family progression as well as riders who want to spend time on features.',[
    ['trails','Slopes',41],['lifts','Lifts',22],
  ],'37 km of Nordic tracks excluded. Planned Kläppen Syd expansion not added.'),
  entry('Q10649543','Ramundberget','https://www.ramundberget.se/en/at-the-resort/piste-map/','Ramundberget mixes groomed slopes with natural-snow skiing through sparse birch woodland. Parks, warming huts and grill spots add variety to the day, while its trail network includes both gentle and demanding runs.',[
    ['vertical','Highest drop',300,'m'],['skiing_elevation','Highest run elevation',1000,'m'],['lifts','Lifts including carpet',10],['parks','Parks',5],['longest_run','Longest run',1650,'m'],
  ],'Headline 42 slopes versus difficulty categories summing to 43; total withheld.'),
  entry('Q728230','Geilo','https://www.skigeilo.no/en/webcam-and-weather','Geilo’s downhill network has a large selection of easy and intermediate runs, with a smaller set of difficult slopes. Multiple learning lifts and sectors give mixed-ability groups options; these figures describe the SkiGeilo network, not the surrounding town.',[
    ['trails','SkiGeilo slopes',46],['lifts','SkiGeilo lifts including carpets',20],
  ],'Operator displays a Fnugg-fed inventory. Denominators, not current open counts; no town-wide terrain claim.'),
  entry('Q256064','Kvitfjell','https://www.alpinco.com/en/kvitfjell','Kvitfjell spreads its skiing across three mountainsides, combining demanding race terrain with dedicated family areas. Slopeside hotels, apartments and cabins make it possible to build a mountain stay around different terrain preferences.',[
    ['trails','Slopes',36],['lifts','Lifts',14],['piste_length','Alpine piste length',34,'km'],['family_areas','Family areas',2],
  ],'600 km of cross-country tracks not counted as downhill terrain.'),
  entry('Q12010113','Myrkdalen','https://www.norwaysbest.com/en/inspiration/winter','Myrkdalen combines wide family pistes with faster red and black runs, ski-cross and terrain parks. Its western Norwegian valley setting also offers off-piste options, giving the resort a broader character than a purely groomed-trail ski day.',[
    ['trails','Runs',22],['lifts','Lifts',9],
  ],'Promotional snow-reliability claims not turned into a snowfall average or guarantee.'),
  entry('Q12010112','Voss Resort','https://www.vossresort.no/en/voss-ski-resort/','Voss links its train station to the mountain by gondola, making town-based ski trips practical. Family runs, race courses, parks and a night-lit network provide variety, with longer descents adding scale beyond the children’s areas.',[
    ['trails','Slopes',24],['lifts','Published ski lifts',10],['piste_length','Groomed alpine pistes',40,'km'],['night_length','Floodlit pistes',11,'km'],['family_run_length','Family piste length',4200,'m'],
  ],'Almost 900 m drop is not an exact measurement. 1,410 m touring peak and 18 km Nordic trails excluded; gondola not added again to lift headline.'),
  entry('Q4993402','Skimore Oslo','https://book.visitoslo.com/en/adventure/2300-ski-pass-at-skimore-oslo-tryvann','Skimore Oslo offers a city-accessible ski day with learning areas, terrain parks and floodlit slopes. Visitors can buy a day pass rather than a membership, making it an option for occasional outings as well as regular local skiing.',[
    ['lifts','Published ski lifts',11,'','Operator-authored offer on VisitOSLO; summer lift-status widgets not treated as winter inventory.'],
  ],'Operator-authored indexed offer says 18 slopes; operator network widget says 21. No total selected; dynamic offer body is not always visible in rendered HTML.'),
  entry('Q6429237','Skimore Kongsberg','https://kongsberg-vinter.skimore.no/','Skimore Kongsberg combines a terrain park with family skiing and instruction for children and adults. Rentals and an equipment workshop support local ski days, and guest passes allow visits without committing to an annual membership.',[], 'Summer-season status widgets and cross-resort English template text are not reliable winter mountain dimensions; Norwegian Kongsberg-specific overview used.'),
  entry('Q2268802','Selwyn','https://selwynsnow.com.au/','Selwyn centers its winter offer on family snow outings, lessons and first experiences on skis or a snowboard, with tobogganing sold separately. The operator ended the 2026 ski season early after rain and limited snowmaking conditions; it plans to return in 2027.',[], 'Seasonal closure, not permanent closure. Toboggan conveyor length and planned snowmaking improvements are not existing downhill dimensions.'),
  entry('Q15244599','Manganui','https://www.skitaranaki.co.nz/the-mountain/our-mountain/','Manganui combines a smaller learning and intermediate area with much steeper natural terrain above. This public club field requires a walk in with equipment and offers no on-mountain rentals or lessons, so a visit takes more preparation than a drive-up resort.',[
    ['lifts','Listed ski tows',4,'','T-bar, learner rope, access tow and top rope; goods lift excluded.'],['lower_vertical','T-bar vertical',140,'m','Sector vertical, not the entire ski area.'],
  ],'Difficulty percentages sum to 105 and are withheld. Approximately 300 m top-tow fall-line skiing is not treated as measured vertical. Lodge restrictions do not make public day skiing private.'),
  entry('Q7698449','Temple Basin','https://templebasin.co.nz/','Temple Basin welcomes public visitors to ungroomed skiing across ridges and basins served by rope tows. Lodge stays and technical terrain give it a club-field adventure feel; hiking reaches additional lines beyond the lift-served slopes.',[
    ['lifts','Rope tows',3],
  ],'No hike-accessed terrain dimensions imported; membership optional for day skiing.'),
  entry('Q5430870','Fairview Ski Hill','https://skifairview.com/trail-map','Fairview’s trail map offers a compact set of named runs, with Bluesky marked as a terrain park. The park is part of the published run list rather than extra terrain added on top, keeping expectations of this small ski outing clear.',[
    ['trails','Listed runs including terrain park',15,'','Count of the operator’s numbered run list; Bluesky is the terrain park.'],
  ],'No unsupported acreage or vertical copied from third-party listings.'),
  entry('Q61925981','Storklinten','https://www.storklinten.se/','Storklinten emphasizes prepared pistes for beginners, recreational skiers and more committed riders, with places to stay on the mountain. Its snow-storage program supports early-season preparation; cross-country skiing and other outdoor activities are separate offerings.',[], 'Operator day passes confirm public lift access. Numerical ski dimensions not established in inspected HTML.'),
  entry('Q10856520','Stryn Sommerski','https://strynsommerski.com/home-2/','Stryn offers summer skiing on Tystigbreen with a chairlift, piste skiing and a terrain park. The former glacier tow is no longer offered; occasional snowcat access reaches higher terrain but is separate from the lift-served experience.',[
    ['vertical','Chairlift-served drop',290,'m'],['skiing_elevation','Chairlift upper elevation',1300,'m'],
  ],'1,800 m snowcat access excluded from highest lift. Seasonal road and snow access; operator plans next ski season for late May 2027.'),
]

const find=id=>officialBatch.find(e=>e.id===`wikidata:item:${id}`)
find('Q4973460').summary_sources.push('https://www.brokenriver.co.nz/')
find('Q7080625').observations.forEach(o=>{o.source_period='2025'})
find('Q879508').summary_sources.push('https://bjorkliden.com/en/experiences/skiing-trails/skiing-in-bjorkliden/')
find('Q61925981').summary_sources.push('https://www.storklinten.se/skipass/')
find('Q10856520').summary_sources.push('https://strynsommerski.com/')
find('Q14680584').summary_sources.push('https://www.skithelemmon.com/')
for(const [id,key,label,unit,values,other,note] of [
  ['Q8026466','trails','Slopes and trails','',[26,27],'https://www.wintergreenresort.com/mountain-report-cams/','Winter page says 26; report denominator says 27 and divides some trails into segments. No total selected.'],
  ['Q8027682','area','Skiable terrain','acres',[172,132],null,'Same safety/statistics page gives 172 acres in prose and 132 in table; no figure selected.'],
  ['Q5568271','lifts','Lifts','',[8,10],null,'Winter overview says eight; report says ten available uplifts. Scope unresolved.'],
  ['Q10726608','trails','Slopes','',[89,91],null,'Same page prose says 89 and facts panel says 91; no total selected.'],
  ['Q1943086','lifts','Lifts','',[4,5],null,'Headline four; listed types sum to five including rope tow. Second alternative is an arithmetic sum, not a separate published headline.'],
  ['Q10649543','trails','Slopes','',[42,43],null,'Headline 42; difficulty categories sum to 43. Second alternative calculated from categories, not an independently published total.'],
  ['Q4993402','trails','Slopes','',[18,21],'https://kongsberg-vinter.skimore.no/','Operator-authored VisitOSLO offer says 18; Skimore Oslo network widget says 21. Scope/date reconciliation required.'],
]){
  const e=find(id),source=e.summary_sources[0]
  e.observations.push({key,label,unit,value:null,source,alternatives:[{value:values[0],source},{value:values[1],source:other||source}],note,retrieved_at:checked,source_published_at:null,status:'conflict',confidence:'low'})
}

export function applyOfficialBatch008(records){
  const report=applyOfficialBatch(records,{entries:officialBatch,batch:'official-008',checkedAt:checked})
  report.summary_only_profiles=officialBatch.filter(e=>!e.observations.some(o=>o.status==='source_checked')).map(e=>e.id)
  report.profiles.forEach(p=>{p.sources=[...new Set([...p.sources,...officialBatch.find(e=>e.id===p.id).summary_sources])]})
  return report
}
