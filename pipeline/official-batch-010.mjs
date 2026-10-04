import { applyOfficialBatch } from './official-batch-001.mjs'

export const checked='2026-08-31'
const entry=(id,name,source,summary,rows=[],notes='')=>({
  id:`wikidata:item:${id}`,name,summary,summary_sources:[source],summary_reviewed_at:checked,notes,
  observations:rows.map(([key,label,value,unit='',note='',extra={}])=>({key,label,value,unit,note,source,retrieved_at:checked,source_published_at:null,status:'source_checked',confidence:'medium',...extra})),
})

// Original editorial summaries; numbers retain the operator's units and scope.
export const officialBatch=[
  entry('Q11323752','Aomori Spring','https://aomorispring.com/ski/mountain','Aomori Spring combines long cruising runs with steeper terrain and beech woodland on Mount Iwaki. Views over the Tsugaru Plain toward the Sea of Japan give the mountain a distinctive coastal outlook.',[
    ['vertical','Vertical drop',545,'m'],['skiing_elevation','Upper gondola elevation',921,'m'],['longest_run','Longest run',3.5,'km'],
  ],'English and Japanese course totals differ; neither is selected as the settled trail count.'),
  entry('Q11450901','Appi Kogen','https://www.appi.co.jp/snow-mountain-resort/offseason/','Appi combines a broad selection of pistes with instruction for different ages and abilities. Guided tree and natural-terrain experiences add a more adventurous side, separate from the everyday piste network and learning areas.',[
    ['trails','Courses',21],['piste_length','Published course distance',43.1,'km'],
  ],'CAT-skiing terrain is not added to lift-served statistics.'),
  entry('Q11635356','Akakura Onsen','https://akakura-ski.com/gelande/','Akakura Onsen offers long, gentle cruising alongside woodland runs and more demanding mogul terrain. The Kumado night-skiing option adds an evening dimension, while the local course network remains separate from combined-area lift-pass totals.',[
    ['trails','Listed ski courses',17,'','Numbered courses 1–17; the separately listed snow-play area is excluded.'],
  ]),
  entry('Q11517725','Asarigawa Onsen','https://www.asari-ski.com/slopes/','Asarigawa Onsen pairs wide groomed runs with ungroomed options and views toward the sea. Its setting near Otaru and the Asarigawa hot springs suits visitors who want a mountain day with a change of pace afterward.',[
    ['summit','Published mountain summit',660,'m','Mountain summit, not independently established as the highest skiable point.'],
  ],'Headline course count and difficulty-category sum disagree; total withheld.'),
  entry('Q11657203','Ani','https://www.aniski.jp/ski/','Ani combines gondola access, long gentle runs and views of snow-coated trees with ungroomed terrain on the Challenge course. It offers both relaxed mountain cruising and a more technical alternative when conditions permit.',[
    ['trails','Named courses',5],['lifts','Gondola and chairlifts',3],['named_run_length','Paradise course length',2800,'m'],
  ],'Gondola rise and the separate hiking summit are not treated as whole-resort skiing vertical or upper ski elevation.'),
  entry('Q11257595','Adatara','https://www.adatara-resort.com/ski/gelande.html','Adatara mixes the wide Gemini slope and gentle Pegasus learning run with steeper, variable-pitch terrain. Altair adds a combination of upper moguls and a gentler woodland section, giving developing skiers several different experiences on one small mountain.',[
    ['trails','Named ski courses',5,'','A–E courses; upper/lower and left/right status segments are not extra trails.'],['named_run_length','Gemini course length',800,'m'],
  ]),
  entry('Q11276859','Biwako Valley','https://www.biwako-valley.com/w_season/openclose','Biwako Valley combines Lake Biwa panoramas with beginner slopes, woodland cruising and tougher natural moguls. The longer Champion descent offers more terrain variation, but its snow-dependent opening should not be assumed for every visit.',[
    ['trails','Named courses',9],['longest_run','Longest run',1400,'m'],['named_run_vertical','Champion course vertical',224,'m','Specific descent, not a whole-resort vertical measurement.'],
  ]),
  entry('Q11297403','Canmore Ski Village','https://www.canmore-ski.jp/guide/','Canmore Ski Village combines a broad beginner slope and gentle woodland cruising with short, steeper ungroomed runs. Night-skiing facilities and a children’s practice space make this a flexible small-area outing, distinct from its separate Nordic offering.',[
    ['trails','Downhill courses',8],['longest_run','Rocky longest course',1570,'m'],
  ]),
  entry('Q11307793','Charmant Hiuchi','https://charmant-hiuchi.jp/','Charmant Hiuchi places groomed runs alongside ungroomed courses and designated powder areas. Its adventurous terrain is a strong part of the mountain’s identity, but visitors should check lift access carefully: the main quad was out of service during 2025–26.',[], 'Seven groomed status entries include a lower section; powder zones are not counted as separate pistes. Installed versus available lifts differ, so no operating total is promoted.'),
  entry('Q11441804','Daisetsuzan Kurodake','https://www.rinyu.co.jp/kurodake/ski_slope/','Kurodake offers a high-mountain setting above Sounkyo, with open skiing on the mountain’s northeast side and broad Daisetsuzan views. Ropeway access and the upper ski lift are distinct from routes requiring travel beyond the managed ski area.',[], 'The 1984-m geographic summit is not the lift-served ski summit; access-ropeway rise is not skiing vertical.'),
  entry('Q11333345','Fu’s','https://www.fujino-yagai-sports.jp/winter','Fu’s is a municipal snow area in Sapporo’s Fujino district, with family, gentle and more sporting runs served by a small lift network. On-site instruction and rentals support practice days without the scale of a large destination resort.',[
    ['trails','Listed ski courses',6],['lifts','Listed chairlifts',3],
  ],'Winter inventory, not the number operating during the summer review.'),
  entry('Q11456195','Fujimi Kogen','https://fujimikogen-ski.jp/skislope.html','Fujimi Kogen contrasts a broad, gentle learning slope with a steeper training run. Daytime skiing is ski-only; snowboards are permitted during designated night sessions, so mixed groups should check the current access rules before visiting.',[
    ['named_run_length','Center slope length',600,'m'],['learning_run_length','Romance slope length',500,'m'],
  ],'Night-session dates on source apply to 2025–26, not a confirmed 2026–27 schedule.'),
  entry('Q11456151','Fujimi Panorama','https://www.fujimipanorama.com/snow/','Fujimi Panorama centers its mountain experience on a long gondola-served descent, with separate family terrain near the base. It offers sustained downhill laps rather than only short learning runs, while daily course availability still depends on conditions.',[
    ['named_run_length','Signature long descent',3,'km','Operator’s 2025–26 long-course feature.',{source:'https://www.fujimipanorama.com/snow/%EF%BC%91%E6%9C%AC%E3%81%AE%E3%82%B4%E3%83%B3%E3%83%89%E3%83%A9%E3%81%8C%E7%94%9F%E3%81%BF%E5%87%BA%E3%81%99%E3%83%91%E3%83%8E%E3%83%A9%E3%83%9E%E5%90%8D%E7%89%A9%E3%80%8C3%E3%82%AD%E3%83%AD%E3%83%AD/',source_period:'2025–26'}],
  ],'Status counters are not used as a reconciled distinct-trail inventory.'),
  entry('Q17230084','Fujiten','https://www.fujiten.net/','Fujiten combines skiing beneath Mount Fuji with a snowpark and a dedicated children’s snow-play area. Its courses serve different ability levels, while lift-accessible viewpoints offer something for companions taking a break from skiing.',[], 'Numeric details in externally hosted operator releases not imported in this pass; current operator page supports the summary.'),
  entry('Q22120169','Fukui Izumi','https://fukuiizumi.com/','Fukui Izumi brings together downhill skiing, park features and instruction in a compact resort setting. A high-speed chair and the Romance lift support different sessions, but the operator may run a reduced lift service on quieter days.',[
    ['lifts','Listed main lifts',2,'','High-speed quad and Romance lift; not a promise both operate daily.',{source:'https://fukuiizumi.com/ryoukin/'}],
  ]),
  entry('Q11296546','Gala Yuzawa','https://gala.co.jp/winter/gelande/','Gala Yuzawa spreads skiing across central, northern and southern areas, with a separate descent toward the base. Wide groomed runs and gentle woodland options sit alongside steeper terrain, giving mixed-ability groups several ways to shape their day.',[
    ['skiing_elevation','Upper ski elevation',1181,'m'],['base','Base elevation',358,'m'],['vertical','Published vertical drop',823,'m'],['longest_run','Longest run',2500,'m'],['area','Piste area',70,'ha'],['lifts','Listed lifts',11],['trails','Courses',16],
  ],'Overview carries a 2024–25 season banner; figures retained as dated published inventory, not independently reconfirmed 2026–27 specifications.'),
  entry('Q11326405','Hachi Kogen','https://www.hachi-hachikita.co.jp/hachi/slope','Hachi emphasizes wide, gentle slopes and woodland cruising, with a central terrain park and a more sporting downhill course. The family area and slower learning lift offer an introduction before exploring the rest of the mountain.',[], 'Parallel official pages divide Sengokudaira differently and include special areas; no reconciled trail count. Hachikita totals excluded.'),
  entry('Q11326401','Hachikita','https://www.hachi-hachikita.co.jp/hachikita/','Hachikita combines long summit-to-base cruising with woodland links, moguls and steeper terrain. Gentle family slopes provide an alternative to the demanding North Wall, making this a different experience from simply repeating the adjacent Hachi area.',[
    ['longest_run','Summit-to-base route',4,'km'],
  ],'Headline says 14 courses while the detailed status list has 15 sections; no trail total selected.'),
  entry('Q11580460','Hakuba Norikura Onsen','https://www.hakunori.com/en/trailguide/?id=data','Hakuba Norikura contrasts its gentle Family Course with steeper Snake and Expert runs, plus woodland and mogul options. Its varied local slopes are part of a wider valley experience, but neighboring mountains are not included in these facts.',[
    ['named_run_length','Family Course length',750,'m'],['lifts','Listed chairlifts',9,'','Local lift inventory; shared Cortina pass is not a combined mountain total.',{source:'https://www.hakunori.com/en/'}],
  ]),
  entry('Q11579546','Hakusan Ichirino','https://sam-hakusan.com/white/ichirino/course/index.html','Hakusan Ichirino offers a broad family skiing setting with courses for progressing and experienced riders. A gondola and several shorter lifts distribute skiers around the mountain, while a dedicated children’s park provides a separate place to learn and play.',[
    ['lifts','Gondola and ski lifts',6],
  ]),
  entry('Q11305444','Hakuba Sanosaka','https://sanosaka.jp/course/','Sanosaka combines broad cruising slopes and views of Lake Aoki with a steeper mogul-oriented run. Its mid-mountain Shirayuki Daira area adds a café, snow play and sightseeing access for companions who are not skiing.',[
    ['named_run_length','Paradise / Paradise Downhill route',2100,'m','Combined named route, not the length of each component.'],
  ]),
  entry('Q11665875','Hida Honoki Daira','https://hounoki-daira.com/slopeinfo','Honoki Daira mixes woodland and gentle family runs with race-training slopes, bumps and a demanding Mount course. This is a mountain with a technical side as well as places to practice, with separate snow-taxi access not counted as another ski lift.',[
    ['trails','Listed courses and practice slope',15,'','Includes the operator-listed pole practice course.'],['lifts','Listed main lifts',4,'','Lifts 1, 3, 5 and 7; snow taxi excluded.'],
  ]),
  entry('Q11513061','Tomamu','https://www.snowtomamu.jp/winter/en/ski/ski-slope/','Tomamu spans two mountain areas, combining long beginner cruising with groomed ridgelines and steeper ungroomed options. Family forest routes and natural-terrain runs give visitors a choice between relaxed exploration and more demanding laps.',[
    ['named_run_length','Silver Bell course length',3300,'m'],
  ]),
  entry('Q11258950','Iizuna Resort','https://iizunaresort.com/gerende/','Iizuna Resort contrasts the wide, groomed Sunshine slope with the ungroomed Summit and Adventure courses. Its mix of practice terrain, bumps and natural snow options gives developing skiers room to progress without every run having the same character.',[
    ['named_run_length','Adventure course length',850,'m'],
  ]),
  entry('Q625867','Cerler','https://www.cerler.com/mapa-y-ficha-tecnica-cerler.html','Cerler offers a substantial Pyrenean piste network with easy linking runs and longer descents from the upper mountain. The Gallinero-to-base route is a defining option for skiers seeking sustained cruising, while learning facilities offer a shorter-scale alternative.',[
    ['trails','Pistes',74,'','One separately listed ski itinerary is excluded.'],['piste_length','Published skiable length',81,'km'],['skiing_elevation','Upper ski elevation',2630,'m'],['base','Lower ski elevation',1500,'m'],['lifts','Lifts including carpets',19],
  ]),
  entry('Q18180984','La Molina','https://pirineu365.cat/en/lamolina/resort/slope-map-technical-sheet/','La Molina brings together a broad spread of pistes, learning facilities and freestyle terrain. An adaptive sports center and an accessible slope add to its range of ways to get on snow; these figures describe La Molina itself, not a combined neighboring ski area.',[
    ['trails','Pistes',66],['piste_length','Piste length',71,'km'],['lifts','Lifts including carpets',16],['skiing_elevation','Upper ski elevation',2537,'m'],['base','Lower ski elevation',1667,'m'],
  ]),
  entry('Q534256','Sierra Nevada','https://sierranevada.es/es/invierno/la-estacion/','Sierra Nevada offers a large downhill network above Granada, with a substantial published vertical and terrain spread across many pistes. Its scale makes it a destination for exploring different runs rather than a single small learning slope.',[
    ['piste_length','Published skiable length',112.5,'km'],['trails','Pistes',134],['vertical','Published skiing vertical',1200,'m'],
  ]),
  entry('Q7400581','Manzaneda','https://www.manzaneda.com//manzaneda-estacion-esqui','Manzaneda offers alpine skiing in Galicia’s mountain landscape, with pistes for different abilities and on-site instruction. Its year-round mountain setting also provides non-ski activities, making it an option for groups who want more than continuous downhill laps.',[
    ['trails','Pistes',23],['piste_length','Alpine piste length',15,'km','Operator states more than 15 km.',{qualifier:'+'}],['base','Published base elevation',1500,'m'],
  ],'Nearly 1800 m is not stored as an exact ski summit.'),
  entry('Q104866877','Amirsoy','https://www.amirsoy.com/en/lifts-slopes','Amirsoy combines gondola-served mountain runs with dedicated learning slopes in Uzbekistan. Its longer Papa descent follows the former summit access road, while steeper routes and rocky, juniper-lined terrain add variety beyond the beginner area.',[
    ['piste_length','Published piste length',15,'km'],['vertical','Published elevation difference',660,'m'],['skiing_elevation','Upper gondola elevation',2290,'m'],['longest_run','Papa longest slope',3550,'m'],
  ],'Lift headline and table disagree and include tubing conveyors; no lift total selected. Published overview may predate expansion.'),
  entry('Q7461503','Shahdag','https://shahdag.az/en/about-shahdag','Shahdag offers a substantial Caucasus ski network with runs spanning beginner to advanced grades. Ski schools, children’s facilities and mountain hotels support a mixed-ability holiday, while non-ski activities remain separate from the downhill piste figures.',[
    ['piste_length','Published skiable length',45,'km'],['trails','Slopes',37],['lifts','Lifts including carpets',20],['base','Lower resort ski elevation',1435,'m'],['skiing_elevation','Upper resort ski elevation',2552,'m'],
  ]),
  entry('Q16708718','Tufandagh','https://www.tufandag.com/en/lifts-slopes','Tufandagh combines a beginner area with longer intermediate descents and steeper expert slopes above Gabala. Several ropeways connect different mountain levels, with sightseeing access extending below the ski terrain itself.',[
    ['named_run_length','W2 piste length',2705,'m'],['skiing_elevation','W2 upper piste elevation',1920,'m'],
  ],'P8 and beginner rows reverse upper/lower heights, so no base or whole-resort vertical inferred. Riverside access base 956 m is not a ski base. Ropeway table excludes some learning facilities.'),
  entry('Q5064508','Cerkno','https://www.visitcerkno.si/smucanje/','Cerkno combines relaxed cruising, more demanding slopes and a beginner practice area on the sunny side of the Julian Alps. Its family-oriented setup includes instruction and a mountain-top restaurant stop at Alpska Perla.',[
    ['piste_length','Groomed piste length',18,'km'],
  ],'Source is the official local destination organization.'),
  entry('Q61245618','Krvavec','https://www.rtc-krvavec.si/skiing','Krvavec offers open mountain skiing close to Ljubljana, on the edge of the Kamnik–Savinja Alps. Its groomed slopes cover a range of abilities, providing a mountain escape that can work for both learners and experienced piste skiers.',[
    ['piste_length','Groomed piste length',30,'km'],['base','Lower ski elevation',1450,'m'],['skiing_elevation','Upper ski elevation',1971,'m'],
  ]),
  entry('Q3497168','Stari Vrh','https://starivrh.si/o-smuciscu/','Stari Vrh offers varied skiing in the hills around Škofja Loka, with terrain for learners and stronger skiers. Night skiing and a separate snow park with a learning conveyor add options for shorter sessions and family outings.',[
    ['area','Piste area',55,'ha'],['base','Lower ski elevation',580,'m'],['skiing_elevation','Upper ski elevation',1217,'m'],
  ]),
  entry('Q17346965','3–5 Pigadia','https://35pigadia.com/en/slopes-lifts/','3–5 Pigadia mixes gentle base-area learning slopes with more demanding upper-mountain skiing. The Louki and Aristotelis runs give it a sporting side, while the separately described Nordic circuit is not part of its downhill figures.',[
    ['lifts','Listed lifts including carpets',7],['named_run_length','Louki piste length',1000,'m'],
  ],'Aristotelis and Paradeisos prose/table lengths differ; no settled total piste length or vertical selected. Filippos expert slope described as out of operation.'),
  entry('Q12886103','Kalavrita','https://kalavritaski.gr/en/lift-status/','Kalavrita offers a mix of gentle, difficult and very demanding pistes alongside a snowpark. The current lift inventory includes the Achilles gondola and Styx six-seat chair, giving its mountain access a different character from older lift descriptions.',[
    ['lifts','Current listed lifts',7,'','Current inventory replaces the older activity page’s eight-lift description.'],['trails','Named pistes',13,'','Snowpark excluded; distinct Irene and Phaedra entries share a displayed number.'],
  ],'Older activity overview describes a three-seat Achilles and a pending upgrade; its 25-km length is not promoted as newly confirmed.'),
  entry('Q7139293','Parnassos','https://www.visitgreece.gr/en/experiences/nature/mountains/parnassos-ski-resort','Parnassos links the Kelaria and Fterolakka ski areas, with easier warm-up pistes and a range of mountain runs. Connections toward Gerontovrachos broaden the setting, but the boundaries of each advertised network should be checked before comparing resort totals.',[], 'Official national-tourism overview supports the summary. Figures not selected because network boundaries and connected-area scope need confirmation.'),
  entry('Q11586538','Ishiuchi Maruyama','https://ishiuchi.or.jp/winter/ski/','Ishiuchi Maruyama offers a varied local mountain network with tree-run options and night skiing. Its mix of terrain serves developing and experienced riders, while evening views provide a different atmosphere from daytime laps.',[
    ['trails','Advertised courses',25],
  ],'Neighboring Gala and Yuzawa Kogen figures excluded.'),
  entry('Q11474238','Iwappara','https://iwa-ppara.com/gelande/','Iwappara is defined by broad, gently pitched runs that leave plenty of room for practicing turns. More challenging terrain adds variety higher up, while night skiing and a separate children’s area support different kinds of mountain days.',[
    ['trails','Courses',20],['named_run_length','Main slope length',1200,'m'],['main_slope_width','Main slope maximum width',200,'m'],
  ],'Operator states site information is for 2025–26; not a confirmed upcoming-season inventory.'),
  entry('Q11569479','Jigatake','https://jiigatake.com/school','Jigatake emphasizes first turns and family progression at the southern end of the Hakuba area. Broad, visible practice terrain and ski and snowboard instruction are central to its appeal, with further courses available as confidence grows.',[], 'Lesson-course counts are not mountain trail counts; no numeric inventory selected.'),
  entry('Q11548212','Hodaigi','https://en.hodaigi.jp/','Hodaigi offers family skiing and instruction in the Minakami mountain area, including private lessons in English. Its local ski experience can be paired with a wider Minakami stay, but visitors should check the operating report before relying on particular upper runs.',[], 'English site’s brief reports do not establish a current complete mountain inventory; dated promotional PDFs not substituted.'),
  entry('Q11263630','Kagura','https://www.princehotels.com/en/ski/kagura/','Kagura spans the Kagura, Tashiro and Mitsumata areas, combining on-piste cruising with ungroomed runs and tree terrain. Its link to Naeba offers a wider trip, while travel beyond the managed boundary needs separate preparation and authorization.',[
    ['skiing_elevation','Published ski peak',1845,'m'],['base','Published resort base',620,'m'],['vertical','Published resort vertical',1225,'m','Operator-wide figure across Kagura, Tashiro and Mitsumata; not a promise of one continuous open descent.'],
  ]),
  entry('Q3268287','Naeba','https://www.princehotels.com/en/ski/naeba/','Naeba places family slopes, harder runs and terrain parks in front of a large slopeside hotel. Night skiing adds an evening option, and the Dragondola connection opens a separate journey to Kagura without making its statistics part of Naeba’s local totals.',[
    ['skiing_elevation','Upper ski elevation',1789,'m'],['base','Base elevation',900,'m'],['vertical','Vertical drop',889,'m'],
  ]),
  entry('Q11353840','Manza Onsen','https://www.princehotels.com/en/ski/manza_onsen/index.html?updatelang=yes','Manza Onsen pairs high-mountain skiing with hot springs and slopeside lodging. Gentle forest and panorama runs form part of its appeal, but reduced operations and hike-up sections mean visitors should check exactly which terrain is accessible for their trip.',[], '2025–26 reduced operations and hike-up trail entries make the advertised historical endpoints unsuitable as confirmed current lift-served specifications.'),
  entry('Q11659969','Shizukuishi','https://www.princehotels.com/en/ski/shizukuishi/index.html','Shizukuishi combines long mountain runs and race-oriented terrain with views of Mount Iwate. Family pistes and nearby Takakura hot springs provide a gentler counterpoint to its sporting character; CAT-ski offerings are separate from the lift-served network.',[
    ['skiing_elevation','Upper ski elevation',1145,'m'],['base','Base elevation',428,'m'],['vertical','Published vertical',717,'m'],
  ],'Headline 20 trails differs from the shorter detailed inventory; 3400-m longest-run claim differs from 4500-m downhill entry. Trail count and longest run withheld.'),
  entry('Q11637560','Karuizawa Prince','https://www.princehotels.com/en/ski/karuizawa/','Karuizawa Prince focuses largely on beginner and intermediate skiing, supported by extensive snowmaking. Shopping, dining and hot springs nearby make it a resort-town experience as much as a place for shorter mountain laps.',[
    ['skiing_elevation','Upper ski elevation',1155,'m'],['base','Base elevation',940,'m'],['vertical','Vertical drop',215,'m'],['lifts','Listed chairlifts',9],
  ]),
  entry('Q11447091','Myoko Suginohara','https://www.princehotels.com/en/ski/myoko_kogen/','Myoko Suginohara combines a substantial vertical with long cruising sections, tougher mogul terrain and a terrain park. Views toward Lake Nojiri and the surrounding mountains accompany a local network that remains distinct from other Myoko resorts.',[
    ['skiing_elevation','Upper ski elevation',1855,'m'],['base','Base elevation',731,'m'],['vertical','Vertical drop',1124,'m'],['lifts','Listed lifts',5,'','Includes a pair lift with unscheduled closed days.'],
  ]),
  entry('Q11392366','Muikamachi Hakkaisan','https://www.princehotels.com/en/ski/hakkaisan/','Hakkaisan has a strong ungroomed, steeper-terrain identity, with upper runs accessed by a ropeway. A longer, gentler return route provides contrast, but skiing outside the resort’s managed area is prohibited rather than an advertised extension of its terrain.',[
    ['skiing_elevation','Upper ski elevation',1175,'m'],['base','Base elevation',355,'m'],['lifts','Ropeway and chairlifts',4],
  ],'Current detailed page differs from legacy Prince landing page in vertical and run length; those measurements withheld. Ropeway length 2217 m is not summit elevation.'),
  entry('Q60985314','Yakebitaiyama','https://www.princehotels.com/en/ski/shiga_kogen/','Yakebitaiyama combines gondola-served cruising with Olympic and steeper wall terrain within Shiga Kogen. It offers a substantial local day’s skiing while retaining links to the wider pass network; these measurements describe this mountain, not all Shiga Kogen.',[
    ['skiing_elevation','Local upper ski elevation',1995,'m'],['base','Local base elevation',1555,'m'],['vertical','Local vertical drop',440,'m'],['lifts','Local lifts',5],
  ],'20-course headline and 19-entry table not reconciled; network trail totals excluded.'),
  entry('Q11500723','Madarao','https://www.madarao.jp/en','Madarao’s bowl-shaped terrain combines groomed runs, ungroomed slopes and designated tree runs. Freestyle features and a children’s area add other ways to explore, giving it an adventurous character without making every part of the mountain expert-only.',[
    ['trails','Advertised courses',32],
  ],'Lift headline says ten while status list names nine; no single lift count chosen. Geographic summit not assumed to be highest lift-served skiing.'),
  entry('Q11297811','Kiroro','https://www.kiroro.co.jp/snowworld/','Kiroro combines family facilities and groomed mountain courses with designated ungroomed areas. Lodging, hot springs and English-language services support a longer resort stay, while individual powder-zone access depends on the operator’s current rules and conditions.',[], '2026 status denominator and 2023 embedded inventory differ; no numeric inventory selected from mixed-date widgets.'),
  entry('Q11478144','Kawaba','https://www.kawaba.co.jp/topics/7182/','Kawaba combines linked cruising runs with terrain-park skiing and a convenient base inside Kawaba City. More adventurous off-piste and CAT experiences are separate offerings, rather than extra distance automatically included in the ordinary piste network.',[
    ['named_run_length','Sakuragawa–Crystal linked route',3300,'m','Combined route reported for the December 2025 opening, not a confirmed resort-wide longest run.'],
  ]),
  entry('Q11264820','Kisofukushima','https://kisofukushima-ski.com/area-map/','Kisofukushima pairs family slopes with higher, more varied runs and broad mountain views. The Sky course offers changing pitches and an outlook toward the Central Alps and Mount Ontake, while gentler lower courses provide a different pace.',[
    ['named_run_length','Sky course length',760,'m'],
  ]),
  entry('Q11368854','Kuma Skiland','https://kumax.co.jp/page/course.html','Kuma Skiland offers a straightforward slope layout with changing pitches and a mogul option. Runs return toward the center house, making the base a natural meeting point between laps; visitors should check which slopes are open for their chosen date.'),
  entry('Q11678082','Kurohime Kogen','https://kurohime-kogen.co.jp/winter/area-guide/','Kurohime mixes family learning spaces with longer cruising slopes and steeper or mogul options. Designated dog-friendly areas give it an unusual extra dimension, but those rules apply to specific zones rather than every run on the mountain.',[
    ['named_run_length','Mouse course length',1000,'m','Approximately 1000 m in the operator’s guide.',{qualifier:'~'}],
  ]),
  entry('Q11637301','Kurumayama','https://winter.kurumayama-skypark.com/gelende','Kurumayama combines open mountain panoramas and a broad family slope with more sporting terrain. The linked Panorama and Family descent offers a longer cruise, while the steeper Sportsman slope provides a different challenge.',[
    ['named_run_length','Panorama–Family linked route',2000,'m','Length includes the Family course.'],['named_run_vertical','Panorama route vertical',350,'m','Published course-specific drop, not independently verified as the whole resort vertical.'],
  ]),
  entry('Q17230298','Maiko','https://www.maiko-resort.com/winter/gelande.html','Maiko spreads skiing across three areas, combining long cruising routes with family-friendly terrain near the hotel and more demanding options farther up the mountain. Its variety supports both relaxed base-area days and longer explorations.',[
    ['trails','Courses',26],['longest_run','Longest route',6000,'m','Approximately 6000 m.',{qualifier:'~',source_period:'2025–26'}],
  ]),
  entry('Q108129864','Marunuma Kogen','https://www.marunuma.jp/winter/course-guide/','Marunuma combines long groomed cruising with natural terrain features, moguls and powder options. The mountain offers room for straightforward downhill laps as well as more playful skiing, with access to individual features depending on snow and operations.',[
    ['longest_run','Longest route',4000,'m'],
  ]),
  entry('Q11548242','Minakami Kogen','https://www.minakami-ski.jp/gerande/','Minakami Kogen combines broad, gently changing family slopes with upper-mountain cruising. Steeper ungroomed runs and a larch-woodland route add variety beyond the learning terrain, so different abilities can find distinct experiences at the same resort.',[
    ['named_run_length','Suisui Family course',1400,'m'],
  ]),
  entry('Q11233807','Mt. Norikura','https://www.brnorikura.jp/about.php','Mt. Norikura offers gentle practice slopes, intermediate cruising and more demanding upper terrain. The mix of family-friendly runs and advanced Kamoshika options gives the mountain several different personalities rather than a single uniform pitch.',[
    ['trails','Published courses',20],['lifts','Published lift inventory',8,'','Installed inventory, not a promise that every lift operates daily.'],
  ]),
  entry('Q11234464','NASPA Ski Garden','https://www.naspa.co.jp/ski/?p=6945','NASPA is a ski-only, hotel-linked snow area with a strong learning and family focus. Instruction and a children’s garden support first mountain experiences, while separate snow activities offer options beyond ordinary downhill laps.'),
  entry('Q11324360','Niseko Moiwa','https://niseko-moiwa.jp/school/','Niseko Moiwa supports progression from spacious beginner terrain to groomed runs and powder-focused coaching. Its ski school offers several ways to develop skills, giving the mountain an approachable learning side alongside more adventurous skiing.'),
  entry('Q11445623','Okutone','https://okutone.jp/english/','Okutone combines skiing and snowboarding with instruction, rentals and practical base facilities. Night-skiing options extend the experience beyond daytime laps, though visitors should check the season’s operating schedule before planning an evening visit.'),
  entry('Q11598348','Ryuoo','https://ryuoo.com/winter/','Ryuoo combines a dedicated snowboard-learning area with ropeway-accessed mountain scenery and more playful terrain. Its Wavy Lines features use waves and banks to give riders a different rhythm from ordinary straight downhill laps.',[
    ['lifts','Listed lifts including ropeway',8,'','Inventory includes the seven named surface/chair installations and ropeway; check daily operations.'],
  ]),
  entry('Q11521175','Sapporo Kokusai','https://www.sapporo-kokusai.jp/slopes/','Sapporo Kokusai combines gentle forest cruising and broad slopes with a steeper downhill route. The linked Forest and Märchen descent offers a longer relaxed journey, while park features and more demanding pitches add variety.',[
    ['trails','Courses',7],['longest_run','Longest linked route',3.6,'km'],['lifts','Lifts including snow escalator',5,'','Four gondola/chair installations plus the snow escalator.'],
  ]),
  entry('Q7421109','Sapporo Teine','https://sapporo-teine.com/snow/lang/en/','Sapporo Teine links the Highland and Olympia areas, combining Olympic heritage, gentler forest cruising and steeper mountain terrain. A long connected descent gives the two zones a shared journey while retaining quite different skiing experiences.',[
    ['trails','Courses',15],['piste_length','Total course length',16430,'m'],['longest_run','Longest linked route',6000,'m'],['vertical','Vertical drop',683,'m'],['skiing_elevation','Upper ski elevation',1023,'m'],['base','Lower ski elevation',340,'m'],['area','Ski terrain',76,'ha'],
  ]),
  entry('Q11271460','Tambara','https://www.tambara.co.jp/winter/','Tambara emphasizes gradual progression, from gentle family terrain to longer cruising and more challenging pitches. Upper slopes add lake views to the day, making the mountain appealing for groups learning at different speeds.',[
    ['trails','Listed courses',8],['lifts','Listed lifts',6,'','Published status inventory; not all lifts necessarily operate together.'],
  ]),
  entry('Q11305052','Sahoro','https://sahoro-resort.com/winter/ski?lang=en','Sahoro pairs a gondola-base setup with rentals, instruction and resort lodging. A dedicated beginner park with a covered snow conveyor, introduced for 2025–26, adds a focused learning space alongside the wider mountain experience.'),
  entry('Q11311432','Ski Jam Katsuyama','https://jamresort.jp/','Ski Jam Katsuyama, now branded JAM Fukui Katsuyama, combines long downhill cruising with designated tree-run areas. Family snow play and resort facilities add options around the skiing, supporting both mountain-focused days and mixed-activity stays.',[
    ['longest_run','Longest route',5800,'m'],['tree_run_areas','Designated tree-run areas',4,'','Separate area count, not four extra groomed trails.'],
  ]),
  entry('Q11563406','Yunomaru','https://yunomaru.co.jp/gerende/','Yunomaru organizes its skiing around a network of chairlifts with several nearby rest houses and lodging options. Ski and snowboard instruction supports practice days, while on-site hot-spring facilities offer a different pace after the slopes.',[
    ['lifts','Listed chairlifts',6],
  ]),
  entry('Q11668296','Komagane Kogen','https://komaganeski.com/','Komagane Kogen has a clear family and learning focus, with the gentle Suzuran course and Shirakaba practice terrain. A separate children’s snow-play area gives families another way to enjoy the snow without counting play space as downhill trails.'),
  entry('Q110350692','Ski Valley','https://www.skivalley.ca/','Ski Valley offers skiing and snowboarding on beginner, intermediate and advanced routes, with rentals and certified instruction available. Its school-group programs make learning a clear part of the experience, alongside ordinary recreational laps.'),
  entry('Q11563628','Yuzawa Nakazato','https://www.yuzawa-nakazato.com/winter/gerende/course/','Yuzawa Nakazato combines gentle learning slopes and playful family features with markedly steeper mogul and ungroomed runs. Woodland connections and designated tree terrain add variety, while the beginner snow escalator offers an alternative to starting on a chairlift.',[
    ['lifts','Listed chairlifts',6,'','Excludes snow escalators; some chairs operate only on selected days.'],['named_run_length','Smile course length',1010,'m'],
  ]),
  entry('Q11263860','Katashina Kogen','https://katashinakogen.co.jp/facility/','Katashina Kogen combines broad practice slopes with scenic cruising and a longer forest route. Its mix of beginner, intermediate and steeper courses supports progression, with separate snow-play and rest facilities for families.',[
    ['named_run_length','Forest course length',2200,'m'],['trails','Listed courses',13,'','Eleven uppercase A–K courses plus Adventure and Forest; snow-play areas excluded.'],
  ]),
  entry('Q11496460','Togari Onsen','https://togari.jp/winter/en/course_map/','Togari’s Earth Dragon and Sky Dragon fields mix gentle woodland cruising with mogul practice, freestyle features and steeper ungroomed slopes. Its renamed course network gives different abilities distinct places to explore without treating every connecting run as a major descent.',[
    ['lifts','Listed lifts',4],['longest_run','Backbone longest course',1370,'m'],
  ],'2025–26 course guide; individual course length is not a combined top-to-bottom route.'),
  entry('Q11563653','Yuzawa Kogen','https://www.yuzawakogen.com/winter/','Yuzawa Kogen combines a lower learning area with ropeway-accessed highland skiing and mountain views. Snow play and sightseeing add options for mixed groups, while the shared Snow Link pass reaches other resorts whose statistics are not included here.'),
  entry('Q11419835','White World Oze Iwakura','https://www.oze-iwakura.co.jp/ski/language/kr/','Oze Iwakura combines gentle family runs and long intermediate cruising with steeper sporting terrain. Its race-oriented courses and ungroomed options provide a substantial contrast to the lower learning slopes, rather than a uniformly easy mountain.',[
    ['trails','Published course entries',16,'','Operator counts upper and lower sections separately.'],['named_run_length','Milky Way course length',2800,'m'],
  ],'2025–26 operator guide; Nordic routes and historical lift totals are not included.'),
  entry('Q11280431','Yabuhara Kogen','https://www.yabuhara-kogen.jp/','Yabuhara offers a varied course network in the natural setting of Oku-Kiso. Its ski school supports children and adults developing their skills, while the mountain’s mogul events add a more technical side to the experience.',[
    ['trails','Courses',13],
  ]),
  entry('Q11390666','Yachiho Kogen','https://yachiho-kogen.com/ski/course.html','Yachiho combines a short family learning slope and longer gentle cruising with broad carving terrain. A dedicated mogul run and short, steeper Trial course provide more demanding alternatives, while woodland and park features add playful variety.',[
    ['trails','Listed courses',8],['longest_run','Azalea longest course',1300,'m'],['named_run_vertical','Azalea course vertical',180,'m'],
  ]),
  entry('Q7677408','Takasu Snow Park','https://www.takasu.gr.jp/gelande/','Takasu combines long beginner-friendly connections with ridge cruising, steep mogul terrain and extensive freestyle features. Its terrain ranges from broad practice slopes to the demanding Champion descent; neighboring Dynaland is a separate part of the shared mountain offering.',[
    ['named_run_length','Bamboo–Beginners linked route',4900,'m'],['named_run_vertical','Dynamic course vertical',600,'m','Specific course measurement; not inferred from lift length.'],
  ]),
  entry('Q11535077','Tsugaike','https://www.tsugaike.gr.jp/snow/gelande','Tsugaike combines an exceptionally broad, gentle lower slope with longer routes higher on the mountain. Its varied pitches offer room to progress beyond first turns, making the mountain suitable for mixed-ability groups as well as family learning days.',[
    ['trails','Courses',10],['longest_run','Longest route',5000,'m'],['vertical','Vertical drop',904,'m'],['skiing_elevation','Upper ski elevation',1704,'m'],['base','Lower ski elevation',800,'m'],
  ]),
  entry('Q11306009','Sun Meadows Kiyosato','https://www.sunmeadows.co.jp/winter/parkguide/course/','Sun Meadows Kiyosato mixes Mount Fuji views and intermediate cruising with gentle practice slopes and short steeper runs. Child-friendly banks and waves add a playful learning option, while upper courses look back toward the Yatsugatake mountains.',[
    ['lifts','Chairlifts',3,'','Snow escalator excluded.'],['named_run_length','Main A course length',1200,'m'],
  ]),
  entry('Q11312602','Ogna Hotaka','https://k-hotaka.jp/ogna/slope-guide/','Ogna Hotaka combines the broad, gentle Romance course with steeper carving runs and designated ungroomed terrain. The contrast between relaxed group cruising and more technical snow gives different abilities distinct parts of the mountain to explore.',[
    ['lifts','Listed chairlifts',6],['named_run_length','Romance course length',1500,'m'],
  ],'2025–26 lift and course inventory. Off-course travel is not counted as ordinary managed skiing.'),
  entry('Q12054440','Klínovec','https://klinovec.cz/en/home-page/?seo=en','Klínovec combines an interconnected piste network with dedicated learning facilities and ski and snowboard instruction. Its chairlifts, surface lifts and children’s conveyors serve different needs; the wider cross-resort pass covers more terrain than this local mountain inventory.',[
    ['piste_length','Local piste length',31.5,'km'],['chairlifts','Chairlifts',5],['surface_lifts','Surface lifts',8],['learning_conveyors','Children’s conveyors',5],
  ],'47-km shared-pass figure excluded; lift categories retained separately instead of a potentially ambiguous total.'),
  entry('Q11801624','Szczyrk Mountain Resort','https://www.szczyrkowski.pl/resort/o-osrodku/','Szczyrk Mountain Resort spreads varied downhill runs across the Silesian Beskids, with illuminated terrain extending the day into evening skiing. Gondola and chairlift upgrades support its local network, which is smaller than the combined area available through the shared pass.',[
    ['piste_length','Local piste length',23,'km','Operator says more than 23 km.',{qualifier:'+'}],['lit_piste_length','Illuminated pistes',5,'km'],
  ],'Approximately 40-km common-pass network and geographic peak heights are not local ski measurements.'),
  entry('Q1921096','Merano 2000','https://www.meran2000.com/en/winter-1/ski-snowboard/','Merano 2000 combines broad pistes above Merano with mountain huts and a dedicated children’s learning area. A snowpark adds a freestyle option, while the mix of skiing and nearby resort-town experiences supports a varied mountain day.',[
    ['piste_length','Piste length',40,'km','Approximately 40 km in the operator’s description.',{qualifier:'~'}],
  ]),
  entry('Q257350','Hoch-Ybrig','https://www.hoch-ybrig.ch/winter/','Hoch-Ybrig pairs prepared pistes and mountain panoramas with a snowpark and skicross option. Its winter offering spans family skiing and more sporting outings, while separately promoted ski tours and Nordic activities are not part of the downhill inventory.'),
  entry('Q2554578','Speikboden','https://www.skiworldahrntal.it/de/winter/skifahren/die-gebiete-im-ueberblick/speikboden/','Speikboden combines broad pistes, high-mountain learning spaces and more sporting Sonnklar descents with views toward the Dolomites. Its local terrain offers a varied day without including neighboring Klausberg or the separate sledding routes in the skiing totals.',[
    ['piste_length','Local piste length',43.5,'km'],['base','Lower ski-area elevation',950,'m'],['skiing_elevation','Upper ski-area elevation',2400,'m'],['lifts','Local lifts',8],
  ],'Uses the dedicated Speikboden page, not combined Skiworld totals or older accommodation-page widgets.'),
  entry('Q11268009','Sapporo Bankei','https://www.bankei.co.jp/ski/','Bankei combines ordinary ski runs with dedicated mogul and halfpipe facilities close to Sapporo. Its separate snow-play area gives beginners and families another starting point, while more technical features support riders looking beyond straightforward piste laps.',[], 'Different operator-page widgets list four versus six lifts; no current total selected. Snow-play and freestyle features are not silently counted as conventional trails.'),
  entry('Q11496656','Togakushi','https://www.togakusi.com/ski/course/','Togakushi offers mountain views and a broad spread of difficulty, from first-turn terrain to courses aimed at experienced competitors. Its learning options and more demanding runs make it a mixed-ability mountain, with some sectors operating on limited schedules.',[
    ['trails','Courses',19],['skiing_elevation','Upper ski elevation',1748,'m'],['base','Base elevation',1220,'m'],['lifts','Listed lifts',7,'','Includes the two Chusha lifts with limited operating dates.'],
  ],'Japanese page records limited Chusha operation; English page says closed, so daily access must be checked.'),
  entry('Q17994531','Snow Park Oze Tokura','https://ozetokura.co.jp/pages/cource','Oze Tokura combines race-oriented runs with terrain-shaped freeriding and a long Romance descent. Steeper mogul terrain gives experienced riders another challenge, while a separately advertised hike-up area is not treated as ordinary lift-served skiing.',[
    ['named_run_length','Romance course length',2200,'m'],
  ]),
  entry('Q11316479','Tangram','https://www.tangram.jp/ski/ski/treerun.php','Tangram combines hotel-oriented skiing with designated ungroomed and tree-run terrain on Mount Madarao’s north-northwest side. Most courses return toward the main hotel, while a separate shared pass allows exploration of neighboring Madarao without merging the two inventories.',[
    ['named_run_length','Kings Slalom powder zone',970,'m'],
  ]),
  entry('Q11392362','Muica Snow Resort','https://www.muikamachi.com/ski/course.php','Muica combines a broad main slope and mountain-and-town views with gentle bypass cruising and playful learning features. Steeper upper terrain adds variety, but hike-up and out-of-bounds mountain routes require separate treatment from the normal lift-served pistes.',[
    ['named_run_length','Canaria course length',1633,'m'],['slope_width','Maximum main-slope width',200,'m'],
  ],'2025–26 guide. Hike-up zones, upper/lower repetitions and the kids park are not combined into a conventional trail total.'),
  entry('Q11445804','Okutadami Maruyama','https://www.okutadami.co.jp/Language/skiresort.html','Okutadami Maruyama has a distinctive spring-skiing identity, with woodland cruising, moguls and a seasonal snowpark. Heavy winter snow closes its access roads during part of the season, so visitors should check opening periods rather than assume continuous midwinter operation.'),
  entry('Q17226456','Pilatus Tateshina','https://www.pilatus.jp/gelande/','Pilatus Tateshina combines a ropeway-accessed long descent with views across the Japanese Alps and Yatsugatake. Gentler lower terrain and a separate children’s area offer a different pace from the longer mountain journey.',[
    ['longest_run','Advertised long route',4000,'m'],
  ]),
  entry('Q7374280','Shirakabako Royal Hill','https://royalhill.co.jp/gelande/','Royal Hill packs family practice, intermediate cruising and steeper mogul terrain into a compact layout. Evening skiing is part of its identity, with the Alpen course groomed again before night sessions when that program is operating.',[
    ['lifts','Chairlifts',3,'','Snow escalator excluded.'],['named_run_length','Alpen course length',800,'m'],
  ],'2025–26 source. Ten-course headline differs from seven named downhill rows plus park entries; total withheld.'),
  entry('Q11492197','Osorakan','https://osorakan.co.jp/winter/course/','Osorakan combines natural terrain and changing pitches with wide lower slopes for developing skiers. Its steeper upper runs and demanding Kayabata moguls provide a notably tougher side, with mountain views adding to the experience when visibility permits.',[
    ['vertical','Published vertical drop',420,'m','Approximately 420 m.',{qualifier:'~'}],['named_run_length','Bunazaka course length',1500,'m'],
  ],'1346-m geographic mountain summit is not assumed to be the highest lift-served point.'),
  entry('Q11597831','Tateyama Sanroku','https://tateyama36.co.jp/course/','Tateyama Sanroku combines Raicho Valley and Gokurakuzaka, offering gentle family terrain as well as more demanding natural pitches. Long descents and selected night-skiing terrain give the two-area mountain a varied character.',[
    ['longest_run','Published longest route',3000,'m','Both component areas advertise a 3000-m longest route; they are not added together.'],
  ]),
  entry('Q11570112','Ushidake Onsen','https://ushidake.com/ski/faq/','Ushidake combines a long downhill route with a snowpark on the upper West course. Night skiing adds an evening option, making the mountain suitable for a mix of regular laps and freestyle practice when the relevant areas are open.',[
    ['longest_run','Longest route',2000,'m'],
  ]),
  entry('Q139850600','Petit Chamonix','https://petitchamonix.com/2026/montagne/','Petit Chamonix offers a village-scale mountain with natural snow, mostly groomed terrain and a mix of easy, intermediate and difficult runs. Snowparks and small children’s features add playful options alongside its T-bar-served downhill skiing.',[
    ['trails','Trails including two snowparks',13],['vertical','Vertical drop',150,'m'],['lifts','T-bars',2],
  ]),
]

officialBatch.find(e=>e.id==='wikidata:item:Q11450901').summary_sources.push('https://www.appi.co.jp/en/experience/white-season/')
officialBatch.find(e=>e.id==='wikidata:item:Q11517725').summary_sources.push('https://asari-ski.com/')
officialBatch.find(e=>e.id==='wikidata:item:Q11326401').summary_sources.push('https://www.hachi-hachikita.co.jp/hachikita/slope.html')
officialBatch.find(e=>e.id==='wikidata:item:Q625867').summary_sources.push('https://www.cerler.com/en-ruta-cerler.html')
officialBatch.find(e=>e.id==='wikidata:item:Q11474238').summary_sources.push('https://iwa-ppara.com/')
officialBatch.find(e=>e.id==='wikidata:item:Q11478144').summary_sources.push('https://www.kawaba.co.jp/','https://www.kawaba.co.jp/topics/8327/')
officialBatch.find(e=>e.id==='wikidata:item:Q11598348').summary_sources.push('https://ryuoo.com/winter/wavylines/')
officialBatch.find(e=>e.id==='wikidata:item:Q11280431').summary_sources.push('https://www.yabuhara-kogen.jp/school/')
officialBatch.find(e=>e.id==='wikidata:item:Q11316479').summary_sources.push('https://www.tangram.jp/ski/ski/map.php')
for(const f of officialBatch.find(e=>e.id==='wikidata:item:Q11296546').observations)f.source_period='2024–25'
for(const f of officialBatch.find(e=>e.id==='wikidata:item:Q11474238').observations)f.source_period='2025–26'

for(const [id,values,other,note] of [
  ['Q11323752',[14,22],'https://aomorispring.com/ja/ski/mountain','English mountain overview says 14 trails; Japanese overview says 22. Scope and date need reconciliation.'],
  ['Q11517725',[9,10],null,'Headline says nine courses; five advanced, three intermediate and two beginner categories sum to ten. Second alternative is calculated, not a separate published total.'],
]){
  const e=officialBatch.find(e=>e.id===`wikidata:item:${id}`),source=e.summary_sources[0]
  e.observations.push({key:'trails',label:'Courses',unit:'',value:null,source,alternatives:[{value:values[0],source},{value:values[1],source:other||source}],note,retrieved_at:checked,source_published_at:null,status:'conflict',confidence:'low'})
}

export function applyOfficialBatch010(records){
  const report=applyOfficialBatch(records,{entries:officialBatch,batch:'official-010',checkedAt:checked})
  report.summary_only_profiles=officialBatch.filter(e=>!e.observations.some(o=>o.status==='source_checked')).map(e=>e.id)
  report.profiles.forEach(p=>{p.sources=[...new Set([...p.sources,...officialBatch.find(e=>e.id===p.id).summary_sources])]})
  return report
}
