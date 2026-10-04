import { applyOfficialBatch } from './official-batch-001.mjs'

export const checked='2026-08-31'
const entry=(id,name,source,summary,rows=[],notes='')=>({
  id:`wikidata:item:${id}`,name,summary,summary_sources:[source],summary_reviewed_at:checked,notes,
  observations:rows.map(([key,label,value,unit='',note='',extra={}])=>({key,label,value,unit,note,source,retrieved_at:checked,source_published_at:null,status:'source_checked',confidence:'medium',...extra})),
})
const sector=(top,base,vertical,trails,lifts)=>[
  ['skiing_elevation','Local upper ski elevation',top,'m'],['base','Local lower ski elevation',base,'m'],['vertical','Published local vertical',vertical,'m'],['trails','Local courses',trails],['lifts','Operator-listed local lifts',lifts,'','May include a shared access gondola; not additive across Shiga Kogen sectors.'],
]
const shiga=slug=>`https://shigakogen.co.jp/winter/snow-slope/${slug}-ski/`

export const officialBatch=[
  entry('Q60986831','Giant',shiga('giant'),'Giant is a compact, sporting sector built around a steep race-oriented slope. Its broad, continuous pitch offers a different experience from Shiga Kogen’s gentler cruising areas, with resort-gondola access linking it to the wider mountain network.',sector(1590,1330,260,1,2),'Published skiing vertical is distinct from the chairlift’s 263-m rise.'),
  entry('Q60986846','Hasuike',shiga('hasuike'),'Hasuike offers gentle terrain among birch trees, with a clear beginner and family focus. Connecting runs provide a route toward Giant and neighboring sectors, making it a quieter-paced part of the larger Shiga Kogen journey.',sector(1590,1505,85,4,2)),
  entry('Q60986764','Higashitateyama',shiga('higashitateyama'),'Higashitateyama pairs a gondola-served Olympic course with a much gentler forest descent. Skiers can choose sporting pitches or a slower woodland journey, with onward connections extending the day into other Shiga Kogen sectors.',[...sector(1970,1540,430,2,1),['named_run_length','Forest course length',4000,'m']],'The gondola’s 442-m rise is not substituted for the published skiing vertical.'),
  entry('Q60986470','Ichinose Diamond',shiga('ichinose-diamond'),'Ichinose Diamond offers broad slopes with open sightlines and beginner and intermediate options. A base restaurant provides a meeting point between laps, while a connecting lift makes it practical to continue into Ichinose Family.',sector(1700,1595,105,2,2)),
  entry('Q60986647','Ichinose Family',shiga('ichinose-family'),'Ichinose Family combines wide main slopes, long woodland cruising and steeper mogul terrain beside a lively hotel area. Scheduled night skiing adds another dimension, so its family name should not be mistaken for an exclusively beginner mountain.',[...sector(1940,1620,320,4,4),['named_run_length','Tengu course length',3200,'m']]),
  entry('Q60986468','Ichinose Yamanokami',shiga('ichinose-yamanokami'),'Ichinose Yamanokami is a connecting sector between Ichinose Diamond and the Yakebitaiyama direction. Its relatively gentle but narrow routes suit careful cruising and onward exploration rather than the scale of a stand-alone destination mountain.',sector(1700,1595,105,2,1)),
  entry('Q60986845','Maruike',shiga('maruike'),'Maruike packs contrasting terrain into a small sector, from family snow play to the demanding A course. Lift connections toward Hasuike and Sunvalley make it a useful base for exploring neighboring slopes without losing its compact character.',sector(1565,1465,100,4,3),'Local published skiing vertical differs from individual lift rises; shared gondola included in operator inventory.'),
  entry('Q60986847','Sunvalley',shiga('sunvalley'),'Sunvalley forms an entrance to Shiga Kogen, with lodging nearby and intermediate and steeper slopes alongside a short beginner option. Connections with Maruike and Hasuike make it suitable for moving between several smaller sectors in one day.',sector(1585,1415,170,3,2)),
  entry('Q60986738','Terakoya',shiga('terakoya'),'Terakoya offers a high-mountain panorama and a compact network of upper slopes. Its onward forest connection leads through other sectors toward Giant, but that longer shared journey should not be confused with Terakoya’s own local dimensions.',sector(2060,1905,155,4,2),'The approximately 6000-m descent crosses neighboring sectors and is not a local longest-run figure.'),
  entry('Q11491193','Shiga Kogen','https://shigakogen-ski.or.jp/english/about/','Shiga Kogen is a collection of ski areas rather than one uniform mountain. Linked lifts and shuttle services connect contrasting sectors, allowing trips that mix compact learning slopes, woodland cruising and higher mountain terrain.',[
    ['ski_areas','Component ski areas',18],['skiing_elevation','Network upper elevation',2307,'m'],['base','Network lower elevation',1325,'m'],['lifts','Published network lifts',48,'','Includes gondolas; network-wide total, not a local sector inventory.'],
  ]),
  entry('Q640215','Tandådalen','https://www.skistar.com/en/ski-destinations/salen/winter-in-salen/ski-areas/tandadalen/','Tandådalen contrasts wide eastern carving slopes with more demanding terrain around Tandådalstorget. A substantial snowpark, playful banked features and children’s areas give it several personalities, with transport lifts linking to Hundfjället.'),
  entry('Q107930454','Snow Space Salzburg','https://www.snow-space.com/en/winter/ski-resort-salzburg','Snow Space Salzburg links Flachau, Wagrain and Alpendorf into a large piste network. Its connected layout supports exploring between resort bases; the additional connection to neighboring ski areas is a wider offering, not part of these local network totals.',[
    ['piste_length','Snow Space piste length',120,'km'],['lifts','Snow Space lifts',45],
  ],'Excludes the wider 210-km / 70-lift connection. Announced 2026–27 Grafenbergbahn replacement is not an extra already-open lift.'),
  entry('Q17191220','Asahi Shizenkan','https://www.shizenkan.jp/winter-slope/','Asahi Shizenkan pairs a gentle, convenient learning slope with the more varied Fantasy area. Natural snow, nearby family snow play and slope-side rest houses give this two-area mountain a relaxed setting with room to progress.',[
    ['lifts','Pair lifts',2],['ski_areas','Slope areas',2],['base','Published lower elevation',440,'m'],['skiing_elevation','Published upper elevation',644,'m'],
  ],'2025–26 configuration. Slope areas are not a total of named courses.'),
  entry('Q11604599','Awasuno','https://awasuno.com/winter/gelande/','Awasuno combines a gentle family slope with intermediate practice terrain and a steeper deep-snow course. Its compact downhill network offers contrasting pitches, while the separately advertised Nordic route is not included in the downhill dimensions.',[
    ['area','Published slope area',22,'ha'],['base','Lower ski elevation',600,'m'],['skiing_elevation','Upper ski elevation',825,'m'],['vertical','Vertical drop',225,'m'],['named_run_length','Dynamic course length',1000,'m'],
  ]),
  entry('Q11551421','Ikenotaira Alpen Blick','https://alpenblick-resort.com/ski','Ikenotaira Alpen Blick combines broad slopes below Mount Myoko with long cruising and views toward Lake Nojiri. Snowparks, natural terrain features and designated tree runs add variety beyond the gentler pistes and family learning areas.',[
    ['named_run_length','Advertised cruising route',4,'km'],['lifts','Listed chairlifts',5],
  ]),
  entry('Q11655281','Kaida Kogen MIA','https://miaski-resort.com/','MIA combines long cruising with designated ungroomed portions of its upper courses. A children’s park, instruction and base facilities support learning days, while its longer runs give more experienced riders space to explore.',[
    ['longest_run','Longest route',3200,'m'],['lifts','Listed chairlifts',2],
  ],'2025–26 status inventory. Upper/lower segments and duplicated page blocks are not separate courses.'),
  entry('Q11360149','Joetsu Kokusai','https://jkokusai.co.jp/ski/gelande_course/','Joetsu Kokusai divides skiing among family-oriented, panoramic, active and forest zones. Wide hotel-side runs and evening skiing contrast with more varied terrain farther out, giving mixed groups several ways to shape a mountain day.',[
    ['ski_areas','Named skiing zones',4],['named_run_length','Mina No. 1 course length',1000,'m'],
  ]),
  entry('Q11677134','Kashimayari','https://www.kashimayari.net/snow/fields/','Kashimayari offers a mixture of gentler slopes, long forest routes and short, steep upper runs. Its linked Long Downhill route ties several named sections together, giving a longer journey without counting those same sections twice.',[
    ['named_run_length','Long Downhill linked route',4100,'m','Combination of 1C, 9 and 11.'],['lifts','Listed chairlifts',5,'','Separate family attraction excluded.'],
  ],'2025–26 inventory. Combined routes are not additional independent pistes.'),
  entry('Q82764063','Mizuho Highland','https://www.mizuhohighland.com/course/','Mizuho combines gentle practice slopes and intermediate cruising with a steeper Rabbit course. When snow allows the Chestnut descent to open, linked skiing becomes much longer, so the mountain’s available scale depends on which areas are operating.',[
    ['trails','Listed courses',5],['longest_run','Conditional longest linked route',3700,'m','Requires the snow-dependent Chestnut course to be open.'],
  ]),
  entry('Q11324364','Niseko Village','https://www.niseko-village.com/white-season/','Niseko Village combines groomed runs and multilingual instruction with specially controlled steep terrain. Its link to Niseko United broadens the options, but backcountry tours and snowcat trips are separate experiences, and controlled zones can close for avalanche conditions.',[], 'Geographic summit and Niseko United totals are not assigned as local lift-served statistics. Mizuno-no-Sawa closed from February 24 through the end of 2025–26.'),
  entry('Q11579880','Shirakaba 2in1','https://whitebirch.co.jp/shirakaba2in1/','Shirakaba 2in1 mixes short learning runs, intermediate cruising and a steeper ungroomed Canyon course. Park features and a timed practice slope add variety, while the separate sledding area is kept apart from the downhill course inventory.',[
    ['trails','Numbered ski courses',13],['lifts','Listed chairlifts',5],['named_run_length','Picnic course length',1800,'m'],
  ]),
  entry('Q11579894','Shirakaba Kogen Kokusai','https://whitebirch.co.jp/kokusai/','Shirakaba Kogen Kokusai combines gentle learning terrain with longer main and Thoroughbred runs. Designated tree features and a speed-measurement area add variety, while its mixed cross-country and challenge route is not treated as ordinary downhill mileage.',[
    ['lifts','Gondola and chairlifts',3],['named_run_length','Main course length',1300,'m'],
  ],'The 5000-m cross-country/challenge route is excluded from downhill longest-run statistics.'),
  entry('Q11311262','Sky Valley','https://skyvalley.jp/area','Sky Valley combines gentle woodland practice with intermediate cruising, freestyle features and demanding upper moguls. A longer descent reaches the ski center, but beginners are advised to return on the access lift instead of skiing that route.',[
    ['named_run_length','Linked summit-to-center route',3200,'m'],['lifts','Listed lift installations',5,'','Includes parallel A/B access lifts; excludes neighboring Hyperbowl Higashihachi.'],
  ]),
  entry('Q11312589','Snow Cruise Onze','https://onze.jp/course/','Onze combines coastal views over Ishikari Bay with short forest, family and sporting runs. Evening skiing adds views of city lights, while steeper pitches and a mogul course provide a different challenge from the gentler Panorama and Family slopes.',[
    ['named_run_length','Downhill course length',700,'m'],
  ]),
  entry('Q11619275','Sugadaira','https://sugadaira-snowresort.com/','Sugadaira spreads a broad selection of courses across three areas, with learning terrain, training slopes and views toward the Northern Alps. Some transfers use a shuttle, so its published size should not be read as one continuously linked mountain.',[
    ['trails','Published courses',60],['area','Published ski area',175,'ha'],['ski_areas','Named areas',3],
  ]),
  entry('Q11421369','Tainai','https://tainairesort.jp/skislope.html','Tainai mixes long, gentle woodland skiing with a much steeper Challenge course. Forest and sea views, a learning conveyor and scheduled night skiing give it a varied character beyond its beginner-friendly lower slopes.',[
    ['trails','Courses',13],['lifts','Lifts excluding snow escalator',7],['named_run_length','Forest course length',2350,'m'],
  ]),
  entry('Q11283830','Up Kannabe','https://www.kannabe.co.jp/gelande','Up Kannabe puts broad learning slopes and family practice at the center of the experience. The steeper North Wall offers a contrast, while a long beginner conveyor and scheduled evening skiing help groups build a day around their confidence and pace.',[
    ['learning_conveyor_length','Learning conveyor length',150,'m','Not a ski-run length.'],
  ]),
  entry('Q18339309','White Valley','https://www.whitevalley.jp/free/skislopemap','White Valley combines family practice and a forest descent with natural terrain on its upper slopes. Special Premium Powder Days change how much upper terrain is groomed, so the powder-focused offering depends on the operating program and conditions.',[
    ['trails','Named courses',5],['lifts','Listed lifts',2],
  ],'2025–26 guide. Special-day grooming percentages are not treated as year-round whole-area measurements.'),
  entry('Q17224267','Yamaboku','https://yamaboku.co.jp/course/','Yamaboku uses rolling pasture and woodland terrain for a mix of gentle practice, groomed cruising and demanding ungroomed lines. Natural features give the slopes variety, but separately accessed touring routes are not counted as ordinary lift-served runs.',[
    ['lifts','Listed lifts',3],
  ],'Lettered map features include an entrance to a separate route; they are not summed as independent pistes.'),
  entry('Q11281198','Yomase Onsen','https://x-jam.jp/','Yomase combines learning slopes, longer main runs and dedicated pole-practice terrain. Its connection with X-JAM broadens the day’s choices, but the neighboring area’s park features and courses are kept separate from Yomase’s local inventory.',[
    ['trails','Listed local courses',11],['lifts','Local lifts',4],
  ],'Combined-area headline course count is not assigned to Yomase alone.'),
  entry('Q11312595','Yeti','https://www.yeti-resort.com/guide/?id=a01','Yeti starts at the top: visitors enter above the slopes and ski down toward the lifts. Its Mount Fuji setting combines a long learning-oriented route with shorter, harder courses and park features, giving beginners and improving riders different options.',[
    ['base','Lower ski elevation',1300,'m'],['skiing_elevation','Upper ski elevation',1450,'m'],['trails','Courses',4],['lifts','Lifts excluding conveyors',3],
  ]),
  entry('Q11445605','Okuibuki','https://www.okuibuki.co.jp/gelande/course/','Okuibuki combines covered-conveyor learning terrain with steeper ungroomed and mogul options. The Champion and Heavenly courses offer a sporting contrast to the easier slopes, while the published map also includes a separate children’s play area.',[
    ['named_run_length','Mont Blanc course length',500,'m'],['named_run_vertical','Mont Blanc course vertical',115,'m','Named-course vertical, not whole-resort vertical.'],
  ],'Headline map count includes a children’s park and is not imported as a downhill trail total.'),
]

officialBatch.push(
  entry('Q137641133','Filzmoos','https://www.skiamade.com/en/ski-areas/12-peaks-ski-region/filzmoos','Filzmoos spreads its skiing over Rossbrand and Grossberg, with a village-scale layout and an emphasis on relaxed family days. The mountain backdrop and space for cruising distinguish it from the much larger connected networks elsewhere in Ski amadé.',[
    ['piste_length','Approximate local piste length',20,'km','Operator says around 20 km.',{qualifier:'approximately'}],
  ]),
  entry('Q3572035','Javalambre','https://turismo.gudarjavalambre.es/index.php?Itemid=148&id=20&option=com_content&view=article','Javalambre leans toward green and blue pistes, with a smaller red-run offering and freestyle options. Extensive snowmaking supports its compact mountain layout, while the local inventory is separate from neighboring Valdelinares.',[
    ['trails','Pistes excluding additional itineraries',13],['piste_length','Piste distance',15,'km'],['vertical','Vertical drop',350,'m'],['skiing_elevation','Upper ski elevation',2000,'m'],['base','Lower ski elevation',1650,'m'],['lifts','Lifts including two conveyors',9],
  ]),
  entry('Q10298014','Homewood','https://skihomewood.com/trailmap/','Homewood combines Lake Tahoe views with groomed cruising and more natural snow terrain beneath Ellis Peak. Its lakeside setting is central to the experience; separately offered snowcat acreage is not part of the lift-served mountain figures.',[
    ['area','Lift-served terrain',1260,'acres'],['base','Base elevation',6230,'ft'],['skiing_elevation','Summit ski elevation',7880,'ft'],['vertical','Vertical drop',1650,'ft'],['trails','Published runs',66],['longest_run','Rainbow Ridge longest run',2,'miles'],
  ],'Operator homepage confirms a 2025–26 season ending March 17 and public 2026–27 passes. Seven-lift historical inventory withheld because a new gondola replaces Madden in 2026; https://skihomewood.com/'),
  entry('Q7939379','Vogel','https://vogel.si/en/winter/','Vogel offers natural-snow skiing above Bohinj in Triglav National Park, with mountain views, varied pistes and a snowpark. The full piste network depends on snow coverage, so the advertised maximum should not be mistaken for terrain available every day.',[
    ['piste_length','Maximum snow-dependent piste length',22,'km','Operator says up to 22 km depending on natural snow.'],
  ]),
  entry('Q31182739','Jahorina','https://www.oc-jahorina.com/en/pocetna-zima/','Jahorina combines a substantial groomed alpine network with an extensive night-skiing offering. A snowboard park, ski schools and mountain dining add options around the main pistes, while sledding is a separate activity rather than extra ski mileage.',[
    ['piste_length','Alpine piste length',54,'km'],['lifts','Vertical transport installations',18],['night_trails','Homologated night-ski pistes',10],
  ]),
  entry('Q60776290','Stara Planina','https://www.skijalistasrbije.rs/en/about-resort-1','Stara Planina combines gondola-accessed skiing at Jabucko Raviste with the Babin Zub sectors. Learning facilities and varied pistes sit in a striking rocky mountain setting; the surrounding peaks are not treated as lift-served ski elevations.',[], 'Older operator overview discusses development as future work; historical total and geographic endpoints withheld.'),
  entry('Q2048727','Pamporovo','https://srv.pamporovo.me/slope/slope/details/31/lang/1','Pamporovo’s Tourist route offers a long beginner-oriented descent with snowmaking. It provides a gentler way to experience the mountain, while the resort’s wider piste inventory includes substantially harder alternatives that should be checked separately.',[
    ['named_run_length','Tourist route No. 6 length',3943,'m'],
  ]),
  entry('Q12886104','Seli','https://seli-ski.gr/about-us/','Seli brings recreational skiing and sporting pistes together in an open mountain setting. Learning areas offer a starting point for newcomers, while its separate Nordic routes and hiking trails broaden the winter offering without adding to downhill terrain totals.'),
  entry('Q111212130','Vigla Pisoderi','https://vigla-ski.com/','Vigla Pisoderi sits among beech woods at the meeting of the Varnountas and Verno ranges. Alpine pistes share the wider winter center with Nordic and snowmobile routes, so its overall route count is larger than the downhill ski inventory.',[
    ['trails','Downhill pistes',9,'','Excludes two Nordic routes and one snowmobile route.'],
  ]),
  entry('Q651684','Mölltal Glacier','https://www.moelltaler-gletscher.at/en/gletscher/winter','Mölltal Glacier combines high mountain pistes with an underground access railway and panoramic dining. Blue through black runs, instruction and park features give it more variety than a training-only glacier, although weather can interrupt access.',[
    ['piste_length','Piste distance',17.4,'km'],['lifts','Lifts including access railway',9],['skiing_elevation','Published upper ski elevation',3122,'m'],
  ],'Winter 2025–26 guide; summer training arrangements are not extrapolated to public winter access.'),
  entry('Q248801','Zürs','https://www.lechzuers.com/en/winter/skiing','Zürs offers open alpine surroundings within the linked Arlberg network, with gentle groomed options as well as a strong off-piste tradition. Guided backcountry and heliskiing are separate undertakings, not extra ordinary piste mileage.',[], 'Shared Arlberg statistics are not assigned to Zürs alone.'),
  entry('Q873702','Stuben','https://www.stuben-arlberg.at/en/ski-vacation-arlberg','Stuben centers its skiing on the Albona, with sporting descents and a strong natural-snow and freeride identity. Connections open the wider Arlberg network, but its regional piste and deep-snow totals do not describe Stuben’s local slopes alone.'),
  entry('Q8029888','Hatley Pointe / former Wolf Ridge','https://hatleypointe.com/the-mountain/','Now operating as Hatley Pointe, the former Wolf Ridge pairs a compact mountain with challenging runs, night skiing and slopeside dining. Public access uses online reservations and limited capacity, giving the experience a deliberately small-scale feel.',[
    ['area','Skiable terrain',54,'acres'],['vertical','Vertical drop',700,'ft'],['trails','Published trails',21],['snowmaking','Terrain with snowmaking capability',100,'%'],
  ],'Lift categories and the extent of night lighting are not inferred from overlapping homepage wording. Canonical historical name is retained.'),
)

officialBatch.push(
  entry('Q11294775','Kamui Ski Links','https://www.kamui-skilinks.com/today/','Kamui combines wide lower learning slopes with a long woodland descent from the top. Race-oriented groomers, steep moguls and controlled deep-snow areas offer a much more demanding side, with access dependent on lift hours and conditions.',[
    ['named_run_length','Next Step course length',4000,'m'],['lifts','Listed gondola and chairs',6],
  ]),
  entry('Q85973438','Konjiam','https://m.konjiamresort.co.kr/ski/skiLift.dev','Konjiam offers broad pistes with a strong beginner and intermediate emphasis, alongside shorter advanced sections. Several courses are divided into named segments, so the route table is better understood as a connected layout than a set of independent long descents.',[
    ['piste_length','Piste distance',6.4,'km'],['longest_run','Longest course',1.6,'km'],['base','Base elevation',176,'m'],['skiing_elevation','Upper ski elevation',495,'m'],['vertical','Vertical drop',319,'m'],
  ],'Published 22,581 square metres refers to the base area, not skiable terrain; withheld.'),
  entry('Q5332755','Echo Valley','https://www.skiechovalley.com/overview','Echo Valley is a learning-oriented community hill near Lake Chelan, with rope tows, a Poma lift and instruction for different ages. A lodge fireplace offers a place to regroup; the neighboring tubing lanes remain a separate activity.',[
    ['lifts','Rope tows and Poma lift',4,'','Three rope tows and one Poma; tubing excluded.'],
  ]),
  entry('Q11297530','Cupid Valley','https://www.yukidaruma-kogen.com/winter/course.html','Cupid Valley combines long intermediate cruising with gentle lower runs and steeper courses mixing groomed and natural snow. The longest descent links Soleil and Terre, giving a sustained journey without counting those sections as extra trails.',[
    ['trails','Courses',12],['base','Lower ski elevation',430,'m'],['skiing_elevation','Upper ski elevation',920,'m'],['vertical','Vertical drop',490,'m'],['longest_run','Longest linked descent',4000,'m'],['lifts','Chairlifts',3],
  ],'2025–26 guide. Individual Center-course table contains a length/vertical inconsistency; that row is not imported.'),
  entry('Q11549543','Hyounosen Kokusai','https://www.hyounosen.jp/gelande/','Hyounosen Kokusai mixes broad beginner and intermediate slopes with sporting Romance runs used for technique tests and pole training. A woodland return route and a separate children’s play area give families alternatives to the training pitches.',[
    ['named_run_length','Panorama course length',900,'m'],
  ],'Headline three-course grouping differs from separately named subcourses; total withheld.'),
  entry('Q11373506','Ikawa Kainayama','https://www.ikawaski.jp/','Ikawa Kainayama offers a local ski and snowboard outing in Tokushima, with equipment rental and instruction from first turns through skill improvement. Its services focus on making a mountain day approachable; detailed slope measurements still need checking.'),
  entry('Q11378709','Inosawa','https://www.asahikawa-dpc.co.jp/4ski/skiindex.html','Inosawa is a longstanding community practice hill in Asahikawa, served by a rope tow rather than chairlifts. Ski lessons, skills tests and rentals suit first turns and repeated practice; there is no night-skiing installation.',[], 'Rope-tow downhill skiing is lift-served. 2025–26 operator guide; not a Nordic-only center.'),
  entry('Q11404621','Iozen','https://www.kanazawa-sports.jp/use/search/546/','Iozen currently has a reduced, beginner-focused offering: its gentle Family slope remains the core ski area. Flood damage and equipment problems have closed the more demanding and forest courses, so older whole-mountain descriptions overstate what is available.',[], 'Municipal 2025–26 notice: Family slope operated January 24–February 22; upper courses closed indefinitely. Historical totals withheld.'),
  entry('Q11648145','Kamafuseyama','https://kamafuse-ski.mutsu-taikyo.jp/','Kamafuseyama offers skiing with views across Mutsu Bay, giving the mountain a distinctly coastal outlook. Two lift installations and a separate children’s area support a local winter outing; steep access roads warrant checking before arrival.',[
    ['lifts','Listed ski lifts',2],
  ],'2025–26 operator inventory; seasonal closure March 15 is not permanent closure.'),
  entry('Q11677209','Kazawa','https://www.kazawa.com/snow/eigyou.html','Kazawa combines wide, gentle Relief slopes with steeper Center terrain, moguls and short practice pitches. Dedicated training arrangements add a sporting character, while the longer beginner route gives less experienced riders room to settle into their turns.',[
    ['named_run_length','Relief A course length',1000,'m'],
  ]),
  entry('Q11401127','Kijimadaira / Romance no Kamisama','https://kijimadaira-ski.com/gelande/','Now presented as Romance no Kamisama, Kijimadaira pairs accessible learning slopes with much steeper upper terrain and woodland skiing. The contrast is pronounced: families can stay near the base facilities while advanced riders seek out the harder courses.',[
    ['named_run_length','Pioneer course length',870,'m'],
  ],'Separate sledding distance excluded; canonical name retained.'),
  entry('Q11459081','Koide','https://www.sp-koide.org/ski/trail_map','Koide focuses on skiing and snowboarding within its designated courses, with a base-side area for first snow outings and sledding. It is not an off-piste destination: the operator explicitly prohibits skiing ungroomed areas beyond the marked courses.'),
  entry('Q109357716','Kyowa','https://kyowasnow.net/ski/gelaende.html','Kyowa combines lift-served slopes with a condition-dependent jib-park offering. Its operator guide highlights the Semi-Alpine course and a chairlift with an intermediate exit, while park features are installed only when the snow surface is ready.'),
  entry('Q11554457','Numajiri','https://www.numajiri-ski.jp/gelande.html','Numajiri emphasizes progression, from a short child-priority Pony slope to family cruising and longer intermediate runs. A child-priority forest course adds a woodland journey, while a separate snow-play park keeps non-ski activities distinct.',[
    ['named_run_length','Shirakaba course length',1300,'m'],['trails','Named courses excluding parks',7],
  ]),
  entry('Q109357718','Ohdai','https://ohdai.omagari-sc.com/gerendemap.html','Ohdai combines views over the Senboku Plain with a broad family slope, a forest bypass and much more demanding mogul terrain. The Expert and Champion runs add variety in pitch, while park features vary by season.',[
    ['trails','Lettered courses',6,'','A–F; separate summit slope and park features not added.'],
  ]),
  entry('Q18700915','Ojiro','https://www.ojiro.or.jp/gelande/','Ojiro uses a gondola to reach a varied mountainside above the parking area. Broad central cruising, family practice and ungroomed slopes with developing moguls give different abilities options, with a separate children’s area alongside the ski network.',[
    ['trails','Published courses',7],
  ]),
  entry('Q11446084','Okukannabe','https://okukan.com/gelande','Okukannabe combines family slopes with intermediate cruising and the more technical Tochinoki descent. Moguls on the Super slope offer a further challenge; closed areas and terrain beneath access infrastructure are not part of the permitted skiing.',[
    ['lifts','Listed chairlifts',5],['named_run_length','Tochinoki course length',1200,'m'],
  ],'Kids conveyor has conflicting status text and is not included in lift count.'),
  entry('Q11445589','Okunakayama','https://www.okunakayamakogen.jp/winter-season/course-guide/','Okunakayama combines dedicated beginner slopes with longer mixed-pitch runs and designated tree terrain. Night skiing adds an evening option, while woodland outside the authorized tree area remains off limits.',[
    ['trails','Courses',11],['piste_length','Total course length',10000,'m'],['base','Lower ski elevation',650,'m'],['skiing_elevation','Upper ski elevation',1018,'m'],['vertical','Vertical drop',368,'m'],['longest_run','Longest run',2000,'m'],
  ],'Maximum four operating lifts and five listed installations have different scopes; no whole-resort lift total selected.'),
  entry('Q109357708','Omagari Family','https://familyski.omagari-sc.com/','Omagari Family is a small, single-slope hill with a slightly steeper upper section easing into a broad lower learning area. A slope-facing heated lodge makes it practical for families to regroup and watch, with sledding kept on its own slope.',[
    ['named_run_length','Approximate main slope length',550,'m','Operator describes approximately 550 m.',{qualifier:'approximately'}],
  ],'No night skiing in the 2025–26 operating guide.'),
  entry('Q11262698','Ontake','https://ontakeskijo.com/area-map/','Ontake combines mountain panoramas and broad cruising with narrow, gentle woodland routes. The Expert course offers steep moguls, while the Panorama journey links several sections and is not a separate full-length run in each section.',[
    ['skiing_elevation','Upper ski elevation',2240,'m'],['named_run_length','Panorama A–C linked route',7000,'m','Published cumulative route; not 7000 m for each section.'],
  ]),
  entry('Q11462148','Otaru Tenguyama','https://tenguyama.ckk.chuo-bus.co.jp/winter/','Otaru Tenguyama pairs city views with a gentle, open Family slope high on the mountain. The longer intermediate Long Line route descends toward the base using natural terrain, offering a different pace from repeated learning-area laps.',[
    ['longest_run','Long Line longest course',1247,'m'],
  ]),
  entry('Q47968092','Owani Onsen','https://www.owani-ski.com/slope/','Owani Onsen combines gentle family slopes and a long Panorama course with steeper sporting runs and a deep-snow option. The contrast between easy cruising and advanced terrain gives it a broader character than a purely introductory hill.',[
    ['named_run_length','Amaike Panorama course length',4200,'m','Course entry last updated in 2020.',{source_published_at:'2020-01-01',source_period:'2020 course guide'}],
  ],'Page carries a 2025–26 operating footer, but individual course descriptions are dated 2020; historical measurement explicitly labeled.'),
  entry('Q11329430','Palcall Tsumagoi','https://tsumagoiskiresort.life/course-guide/','Palcall Tsumagoi emphasizes wide, generally gentle pistes with views of Mount Asama and Lake Baragi. Scheduled sunrise gondola sessions add a distinctive early start, while the broad layout suits families and riders building confidence.',[
    ['trails','Published courses',22],['skiing_elevation','Gondola-served upper elevation',2100,'m'],
  ],'Gondola length is not a ski-run length; winter guide describes 2025–26.'),
)

officialBatch.push(
  entry('Q11270746','Taira','https://gokayama-taira.com/ski','Taira combines a compact set of sporting slopes with a gentle Enjoy course for newcomers. A dedicated mogul course and competition activity add a technical side, while the children’s park has its own conveyor.',[
    ['lifts','Listed chairlifts excluding kids conveyor',3],
  ]),
  entry('Q11476107','Rewild Ninja Snow Highland','https://rewild-ninja-snow-highland.com/info/','Rewild Ninja mixes gentle larch-forest cruising with open carving slopes and a playful valley-shaped run. Views toward Nagano and the Northern Alps accompany the easier routes, while park features give the mountain a freestyle emphasis.',[
    ['named_run_length','Gomaruko forest course length',1800,'m'],['trails','Listed courses',10],
  ],'Arekoko description disagrees with its length heading; that measurement is withheld.'),
  entry('Q11632877','Mt.T / Tanigawadake Tenjindaira','https://hoshinoresorts.com/jp/cards/t_3jjl4wl9g/','Rebranded as Mt.T, Tanigawadake Tenjindaira emphasizes natural snow and dynamic mountain terrain beneath Tanigawadake’s twin peaks. Its dramatic setting is central to the experience; the surrounding high summits are not the same as lift-served ski elevations.'),
  entry('Q645628','Hautacam','https://hautacam.com/fr/station-de-ski','Hautacam’s current alpine offering focuses on first turns and family skiing on natural snow. The Cardouet learning sector uses a conveyor and surface lifts, with instruction available for both skiing and snowboarding.',[
    ['piste_length','Currently advertised alpine piste length',4,'km'],['trails','Currently advertised pistes',4],['lifts','Lifts including conveyor',3],
  ],'Current reduced offering, not historical whole-mountain totals.'),
  entry('Q30158143','Les Portes du Mont-Blanc','https://www.lesportesdumontblanc.fr/hiver/decouverte-domaine-ski-evasion-mont-blanc/','Les Portes du Mont-Blanc combines forest skiing, alpine chalets and views toward Mont Blanc, the Aravis and the Fiz. Combloux, Le Jaillet and La Giettaz form the linked core; Cordon and the wider Evasion areas need separate travel.',[
    ['piste_length','Linked core piste length',89,'km','Combloux–Le Jaillet–La Giettaz only; excludes 11 km at unlinked Cordon and the wider Evasion pass.'],
  ]),
  entry('Q3401482','Praz de Lys–Sommand','https://www.prazdelys-sommand.com/activites/ski-alpin/','Praz de Lys–Sommand combines beginner sectors and varied pistes with views toward Mont Blanc. A snowpark and boardercross routes add playful alternatives, while the alpine inventory remains separate from the area’s Nordic skiing.',[
    ['piste_length','Alpine piste length',72,'km'],['lifts','Lifts including two covered conveyors',23],['trails','Color-classified alpine pistes',52,'','Sum of 7 green, 27 blue, 12 red and 6 black pistes.'],
  ]),
  entry('Q2251899','Malbun','https://en.tourismus.li/map/poi/skigebiet-malbun-5b0ae59a-8366-45bc-a46c-98b44840f988.html','Malbun is a compact, traffic-free mountain village with slope-side hotels and skiing from beginner areas to harder pistes. The learning park and manageable layout suit family groups, while the Täli slopes give progressing riders room to move on.',[
    ['piste_length','Piste length',23,'km'],['lifts','Ski lifts',4],['base','Published lower ski elevation',1600,'m'],['skiing_elevation','Published upper ski elevation',2100,'m'],
  ]),
  entry('Q123854999','Bödele','https://www.boedele.info/','Bödele emphasizes natural snow, family learning and mountain huts, with runs for different abilities. A playful Snowman course adds variety; the long descent to Schwarzenberg depends on sufficiently good snow coverage.',[
    ['lifts','Lift installations',10],['longest_run','Snow-dependent Schwarzenberg descent',4.5,'km','Only with good snow coverage.'],
  ]),
  entry('Q3420066','Rathvel','https://www.rathvel.ch/hiver/','Rathvel offers a compact outing in the Fribourg Prealps, with installations suited to different learning stages, from rope tow to surface lift. A scheduled Friday evening option adds night skiing without turning it into a large interconnected destination.',[
    ['lifts','Installations including learning rope tow',4],['base','Lower ski-area elevation',1200,'m'],['skiing_elevation','Upper ski-area elevation',1500,'m'],
  ]),
  entry('Q56401426','FreeSki','https://www.freeski.fi/rinteet','FreeSki is a compact Salosaari hill with several distinct groomed, illuminated slopes. Two surface lifts support repeated laps, while street and snowpark areas give freestyle riders something different from the main runs.',[
    ['trails','Illuminated slopes',6],['lifts','T-bar lifts',2],['vertical','Approximate vertical',70,'m','Operator says approximately 70 m.',{qualifier:'approximately'}],['longest_run','Approximate longest slope',500,'m','Operator says approximately 500 m.',{qualifier:'approximately'}],
  ]),
  entry('Q11901276','Vihti Ski Center','https://www.vihtiski.fi/rinteet?lang=fi%2F','Vihti mixes easy family slopes with race-oriented and harder runs, plus several park areas. Its position near Helsinki suits shorter outings and evening sessions; the gentle back slope offers a quieter-paced option for learning.',[
    ['named_run_length','Back slope length',350,'m'],['named_run_vertical','Back slope vertical',45,'m','Named slope only, not whole-resort vertical.'],
  ],'Headline ten lifts and category list including an additional rope tow do not agree; total withheld.'),
  entry('Q3391795','Platak','https://platak.hr/en/','Platak brings named main slopes, a Tourist descent and a baby ski slope into one recreation area. Chair and surface lifts are supplemented by learning conveyors, giving newcomers an alternative to starting on the larger runs.',[
    ['lifts','Listed chair and drag lifts',4,'','Three moving carpets are listed separately and excluded.'],
  ]),
  entry('Q6159000','Valgrande-Pajares','https://www.valgrande-pajares.com/mapa-de-pistas.php','Valgrande-Pajares combines alpine pistes with beginner zones, competition stadiums and a snowpark. Nordic and touring routes are part of the wider winter center, but are kept separate from its downhill piste distance.',[
    ['piste_length','Alpine piste length',22.5,'km','Excludes 6 km Nordic and 2.4 km touring.'],['lifts','Lifts including two conveyors',7],
  ]),
  entry('Q3207973','La Croix de Bauzon','https://map.croixdebauzon.com/fr/hebergements/chalet-de-groupe-station-de-la-croix-de-bauzon','La Croix de Bauzon offers alpine skiing in the forested Tanargue setting, with on-site accommodation, equipment rental and a separate sledding area. Its outdoor recreation extends well beyond winter, but summer activities are not counted as ski terrain.',[
    ['trails','Alpine pistes',11],
  ]),
  entry('Q16511275','Sainte-Anne La Condamine','https://www.ubaye.com/ski/sainte-anne/','Sainte-Anne La Condamine combines broad family pistes with harder runs in an open Southern Alps setting. Its modest scale and mountain accommodation favor a quieter stay, while freerando excursions remain separate from the ordinary piste network.',[
    ['piste_length','Published piste length',35,'km'],['trails','Color-classified pistes',13,'','Sum of 6 green, 4 blue, 2 red and 1 black.'],
  ]),
  entry('Q124257373','Mount Holiday','https://mt-holiday.com/home/','Mount Holiday is a nonprofit community hill with a family-oriented approach to outdoor recreation. Its mission emphasizes accessible activities and support for disadvantaged young people, making the social side of a local ski day part of its character.'),
  entry('Q2507894','Valberg','https://www.valberg.com/decouvrir/station-4-saisons/hiver/','Valberg combines alpine skiing with a lively village winter program near the Mercantour. The tourism office emphasizes terrain for different abilities and family outings, while Nordic skiing at Beuil-Les Launes is a separate part of the destination.'),
  entry('Q5755786','Hochkönig','https://hochkoenig.skiamade.com/de/wintertickets/tageskarten/bis-13-uhr-hochkoenig_ticket_100066140','Hochkönig links skiing between Maria Alm, Dienten and Mühlbach, combining broad pistes with mountain-hut stops and panoramic touring circuits. Additional areas included on the pass should not be confused with the continuously linked core.',[
    ['named_run_length','Königstour multi-run circuit',35,'km','Ski circuit, not one continuous downhill run.'],
  ],'Pass-wide 120-km headline includes scope ambiguity with Hochkeil and Hinterreit; not imported as a local total.'),
  entry('Q1516208','Alpine Meadows','https://blog.palisadestahoe.com/experiences/first-timer-guide-for-ikon-passholders/','Alpine Meadows pairs a relaxed, mountain-focused base with open bowls, steeper chutes and Lake Tahoe views. The simple main-lodge atmosphere does not mean easy terrain: the operator highlights demanding skiing alongside the more laid-back feel.',[], 'Older operator article predates access changes; lift and trail totals withheld rather than repeated as current.'),
  entry('Q2963663','Shymbulak','https://shymbulak.com/','Shymbulak pairs skiing above Almaty with slope-side lodging, mountain restaurants and views back toward the city. Rental, instruction and children’s services support a resort-style visit; detailed lift-served terrain measurements still need source checks.'),
  entry('Q498303','Alpensia','https://www.alpensia.com/ski/slope-now.do','Alpensia’s Ski700 area offers a clear progression from the beginner Alpha slope through intermediate Bravo to several advanced runs. Day and evening sessions provide different ways to visit, although competition use can temporarily restrict individual courses.',[
    ['trails','Named ski slopes excluding sledding',6],
  ]),
  entry('Q485409','Yongpyong','https://yongpyong.co.kr/eng/skiNboard/overview.do','Yongpyong combines short learning slopes with longer intermediate cruising and a broad lift network. Rainbow Paradise offers a sustained mountain journey, while the separate sledding slope and resort property area are not treated as downhill ski terrain.',[
    ['lifts','Cable lifts including gondola',14,'','Two conveyors listed separately.'],['area','Published slope area',1103449,'m²'],['named_run_length','Rainbow Paradise course length',5600,'m'],['named_run_vertical','Rainbow Paradise course vertical',702,'m'],
  ],'Headline 28 slopes appears alongside a table containing sledding; course count and aggregate slope distance withheld pending scope confirmation.'),
  entry('Q1003394','Bukovel','https://bukovel.com/en/sustainability/zvit-zi-stalogo-rozvitku-bukovel-2024','Bukovel combines a broad selection of ski slopes with a snowpark, lodging and extensive resort services. Restaurants and other winter activities give groups options beyond skiing, while its published mountain figures are tied to the operator’s sustainability report.',[
    ['piste_length','Reported piste length',75,'km','2024 sustainability report.',{source_period:'2024 sustainability report'}],['lifts','Reported ski lifts',19,'','2024 sustainability report.',{source_period:'2024 sustainability report'}],
  ]),
  entry('Q3209295','La Féclaz','https://pistes.savoiegrandrevard.com/pistes-iframe.html','La Féclaz has a distinct alpine offering alongside the wider area’s Nordic reputation. Its local downhill inventory spans green through black pistes, with a boardercross and a separate learning space rather than an exclusively cross-country experience.',[
    ['trails','Named alpine pistes excluding activity zones',13],['lifts','Local lifts including learning conveyor',4],
  ]),
  entry('Q30158101','Oz Station','https://www.oz-en-oisans.com/hiver/','Oz offers a family-scale base of wood- and stone-clad accommodation among fir trees, connected to the larger Alpe d’Huez ski domain. Its village atmosphere is distinct from the scale of the shared mountain network above it.',[], 'Village elevation and Alpe d’Huez-wide totals are not assigned as local ski endpoints or terrain.'),
  entry('Q101807431','Plagne Aime 2000','https://www.la-plagne.com/plagne-aime-2000','Plagne Aime 2000 is an integrated, ski-in/ski-out base known for its distinctive liner-shaped building facing Mont Blanc. Shops and services sit together beneath the apartments, with a pedestrian cable-car connection to Plagne Centre.',[
    ['village_elevation','Village elevation',2100,'m','Accommodation-base elevation, not whole-domain lower ski elevation.'],
  ],'Village-level identity retained; no La Plagne or Paradiski totals assigned locally.'),
  entry('Q137641369','Dorfgastein','https://www.skigastein.com/en/experiences-mountains/winter/family-world/','Dorfgastein is a family-oriented entry to the connected Dorfgastein–Grossarltal area, with gentle slopes suited to first turns. Its local profile should be read separately from the larger Gastein pass network and its other learning parks.'),
  entry('Q137641295','Grossarl','https://www.grossarltal.info/en/winter/ski-holidays/ski-panorama.html','Grossarl opens onto the connected Grossarltal–Dorfgastein slopes, combining groomed skiing with mountain-hut stops and playful ski attractions. The shared two-valley network is larger than Grossarl’s local sector, so its totals are not assigned here alone.'),
  entry('Q2292349','Skiliftkarussell Winterberg','https://www.skiliftkarussell.de/skigebiet/die-abfahrten/','Winterberg’s Skiliftkarussell combines a dense selection of easy and intermediate pistes with a smaller challenging component. Nearby Postwiese and Altastenberg broaden the regional offering but require separate transfers rather than forming one continuous local slope network.',[
    ['piste_length','Local piste length',27.5,'km','Local Skiliftkarussell only; excludes neighboring bus-linked areas.'],['trails','Operator-listed local descents',34],
  ]),
  entry('Q113566511','Aq Bulaq','https://ak-bulak.kz/p/about-us','Aq Bulaq combines groomed ski and snowboard slopes with conifer forest and mountain views in the Trans-Ili Alatau. On-site accommodation and family winter activities make it a resort-style outing, with the surrounding landscape part of the appeal.',[
    ['lifts','Published cableways',5],
  ],'General resort altitude is not clearly identified as a ski endpoint and is withheld.'),
  entry('Q562341','Muju Deogyusan','https://www.mdysresort.com/ski/slope.asp','Muju Deogyusan combines the long Silk Road descent from Seolcheonbong with much steeper sporting terrain and broad lower slopes. Connections between its bases create different mountain journeys, rather than a single uniform style of skiing.',[
    ['named_run_length','Silk Road course length',6.1,'km'],['named_run_vertical','Silk Road course vertical',810,'m'],
  ],'Named-course vertical retained; no resort-wide vertical calculated from endpoints.'),
  entry('Q819380','St. Johann in Tirol','https://www.kitzbueheler-alpen.com/en/stjo/wi/ski/st-johann-in-tirol-ski-area.html','St. Johann in Tirol combines wide, varied pistes beneath the Kitzbüheler Horn with numerous mountain-hut stops. Access from St. Johann, Oberndorf and Eichenhof gives families and cruising skiers several entry points to the same local ski area.',[
    ['piste_length','Local piste length',40,'km'],['lifts','Ski lifts',10],['skiing_elevation','Highest ski-area point',1604,'m'],
  ],'Uphill touring route lengths and verticals are not substituted for downhill specifications.'),
)

// Supplemental primary sources support the editorial operating/scope notes.
officialBatch.find(e=>e.id==='wikidata:item:Q10298014').summary_sources.push('https://skihomewood.com/')
officialBatch.find(e=>e.id==='wikidata:item:Q2048727').summary_sources.push('https://pamporovo.me/bg/winter/show/slopes')
for(const e of officialBatch){
  for(const o of e.observations){
    if(o.qualifier==='approximately')o.qualifier='~'
  }
}
for(const id of ['Q17191220','Q11655281','Q11677134','Q18339309','Q651684','Q11297530','Q11648145','Q109357708','Q11329430']){
  officialBatch.find(e=>e.id===`wikidata:item:${id}`).observations.forEach(o=>{o.source_period='2025–26'})
}

export function applyOfficialBatch011(records){
  const report=applyOfficialBatch(records,{entries:officialBatch,batch:'official-011',checkedAt:checked})
  report.summary_only_profiles=officialBatch.filter(e=>!e.observations.some(o=>o.status==='source_checked')).map(e=>e.id)
  report.profiles.forEach(p=>{p.sources=[...new Set([...p.sources,...officialBatch.find(e=>e.id===p.id).summary_sources])]})
  return report
}
