import { applyOfficialBatch } from './official-batch-001.mjs'

export const checked='2026-08-31'
const entry=(id,name,source,summary,rows=[],notes='')=>({
  id:`wikidata:item:${id}`,name,summary,summary_sources:[source],summary_reviewed_at:checked,notes,
  observations:rows.map(([key,label,value,unit='',note='',extra={}])=>({key,label,value,unit,note,source,retrieved_at:checked,source_published_at:null,status:'source_checked',confidence:'medium',...extra})),
})

// Original summaries and limited factual observations, with resort-specific scope.
export const officialBatch=[
  entry('Q56219314','Aflenzer Bürgeralm','https://www.aflenzer-buergeralm.at/winter/skifahren/','Aflenzer Bürgeralm pairs gentle learning terrain on the alpine meadow with a larger selection of intermediate pistes. Mountain huts and a family-oriented layout give it a small-area feel, while harder runs offer a step beyond the beginner slopes.',[
    ['easy_pistes','Easy pistes',2,'km'],['intermediate_pistes','Intermediate pistes',10,'km'],['difficult_pistes','Difficult pistes',2,'km'],
  ],'Difficulty-category distances retained separately; no inferred whole-resort total or avalanche-safety guarantee.'),
  entry('Q364061','Axamer Lizum','https://mobile.axamer-lizum.at/en/welcome-to-the-axamer-lizum-1-1.html','Axamer Lizum combines wide cruising pistes near Innsbruck with race slopes, a snowpark and freeride options. Most of its advertised pistes are easy or intermediate, so its sporting character does not exclude families or leisure skiers.',[
    ['piste_length','Advertised piste length',40,'km','Operator headline; ski routes and freeride hectares are separate offerings.',{source_period:'2025–26'}],
  ],'Official regional report has a different route-inclusive total; operator headline retained with scope, not represented as measured groomed-only mileage.'),
  entry('Q46995824','Bergeralm','https://www.bergeralm.net/en/ski-area/','Bergeralm offers skiing above Steinach am Brenner with a children’s area, ski school and night-skiing sessions. Mountain dining and separate tobogganing add options for mixed groups without turning those activities into additional ski terrain.',[], 'Current summer and older winter widgets differ; combination chair/gondola components not counted as separate lifts. Older brochure totals not promoted as current.'),
  entry('Q1019630','Bödele','https://www.boedele.info/','Bödele is a natural-snow family ski area with ski schools, mountain huts and runs of different difficulties. Its longer descent toward Schwarzenberg depends on sufficient snow, so a visit should not assume that valley run is always available.',[
    ['lifts','Lifts',10],['longest_run','Schwarzenberg descent',4.5,'km','Only with suitable snow cover.'],
  ],'Potential duplicate Ski area Boedele Q123854999 not separately enriched. Walking and Nordic distances excluded.'),
  entry('Q23689639','Brunnalm – Hohe Veitsch','https://www.brunnalm-hoheveitsch.at/winter/','Brunnalm–Hohe Veitsch offers a compact ski network above the Mürztal, with parallel lifts and ski-school facilities. Its modest mountain scale makes it a different proposition from a sprawling linked ski circuit.',[
    ['trails','Pistes',18],['skiing_elevation','Upper station elevation',1450,'m'],['base','Lower station elevation',1050,'m'],['surface_lifts','Drag lifts',3],['chairlifts','Chairlift',1],
  ],'Four main lifts do not establish a carpet-inclusive total. Stale 2023 weather banner not treated as current closure.'),
  entry('Q875914','Kreischberg','https://www.kreischberg.at/en/pistes/','Kreischberg combines beginner slopes with more challenging runs and a substantial lift network. Grooming, snowmaking and slopeside refreshment stops are central to the experience, with instruction and freestyle options also available.',[
    ['piste_length','Piste length',42,'km'],['lifts','Cable cars and lifts',13],
  ],'Kreischberg-only figures, not combined with Lachtal despite shared ticket options.'),
  entry('Q3215823','Lachtal','https://www.lachtal.at/en/pistes/','Lachtal has an open, high-alpine feel, with blue, red and black runs alongside ski routes. A dedicated children’s learning area and mountain chalets give families alternatives to the more demanding terrain.',[
    ['piste_length','Pistes and ski routes',36,'km','Includes ski routes; not groomed-piste-only length.'],['area','Published ski area',150,'ha'],
  ]),
  entry('Q1279288','Goldeck','https://www.sportberg-goldeck.com/en/','Goldeck combines a substantial children’s learning area with steeper skiing and freeride terrain. Mountain restaurants, lessons and rentals support family visits, while the more demanding descents need their own conditions check.',[
    ['learning_area','Kinderland area',30000,'m²','Children’s area, not whole-resort acreage.',{source_period:'2025–26'}],
  ],'19-item status denominator may include routes and activities; not imported as trail count. S1 vertical scope/current descent access not established; 50-ha freeride area not whole-resort acreage.'),
  entry('Q1239826','Golm','https://www.golm.at/en/skiing','Golm combines family practice slopes with a demanding World Cup run and a long descent toward Vandans. That range gives progressing skiers room to explore while leaving tougher tests for experienced riders.',[
    ['lifts','Ski lifts',9],['longest_run','Longest descent',9.2,'km'],['vertical','Longest descent elevation difference',1460,'m','Rätikonbahn upper station to Vandans valley station; availability depends on the route being open.'],
  ],'44-km headline not imported as groomed-only length: separate official report includes valley descents and ski routes. Animated zero counters ignored.'),
  entry('Q15110597','Fageralm','https://www.reiteralm.at/en/aktuell/reiteralm/geoeffnete-anlagen-reiteralm','Fageralm offers a smaller piste network than neighboring Reiteralm, with gentle, broad slopes emphasizing children and relaxed progression. Its own mountain identity remains separate from the much larger Ski amadé pass network.',[
    ['trails','Fageralm report pistes',14,'','Winter report denominator, not currently open count.',{source_period:'2025–26'}],
  ],'Lift inventory subject to new Fageralmbahn project; no stale lift total selected.'),
  entry('Q686055','Reiteralm','https://www.reiteralm.at/en/aktuell/reiteralm/geoeffnete-anlagen-reiteralm','Reiteralm provides a sizable local trail network within the Schladming four-mountain ski circuit. Its skiing includes a sporting race-and-training focus, while lessons and family facilities offer ways to build confidence.',[
    ['trails','Reiteralm report pistes',27,'','Reiteralm sector only; not 86 across four mountains.',{source_period:'2025–26'}],['lifts','Reiteralm report facilities',13,'','Winter inventory, not current open count.',{source_period:'2025–26'}],
  ],'Ski amadé 760-km total excluded from this individual mountain.'),
  entry('Q3470429','Salzstiegl','https://www.salzstiegl.at/ski-rodelgebiet','Salzstiegl is a small family mountain with learning slopes, varied downhill runs and mountain refreshment stops. Natural bumps and terrain features add interest for confident skiers; its separate toboggan run is not part of the ski-piste total.',[
    ['piste_length','Piste length',12,'km'],['area','Piste area',40,'ha'],
  ],'Operator figures used. Nearby lodge publishes different lift and elevation figures, so those measurements are withheld pending scope reconciliation.'),
  entry('Q1717842','Planneralm','https://www.planneralm.at/en/','Planneralm combines a compact mountain-village setting with family skiing and terrain for more adventurous riders. Mountain huts provide places to pause, while skiing beyond the groomed runs requires its own conditions and safety assessment.',[], 'Published village/landscape elevation range not assumed to be lift-served skiing endpoints.'),
  entry('Q2288194','Simonhöhe','https://www.simonhoehe.at/skigebiet/','Simonhöhe emphasizes broad family pistes, a dedicated children’s learning area and slopeside food stops. More confident riders can try the steeper terrain, with selected floodlit sessions adding an evening option on Hocheck.',[
    ['piste_length','Piste length',13,'km'],['skiing_elevation','Hocheck lift-served high point',1338,'m'],['learning_carpets','Learning carpets',2,'','Paulis Bärenland, introduced for 2025–26.'],
  ],'Difficulty categories include a learning area, so they are not summed as individual trails. Older lift page lists one carpet; newer winter page lists two.'),
  entry('Q1546875','Grossglockner Resort Kals–Matrei','https://www.gg-resort.at/winter/lifte-und-pisten','Kals–Matrei links skiing above two villages, with runs spanning several difficulty levels and mountain huts for breaks. Family learning areas sit alongside longer valley descents; the nearby Grossglockner summit is not the ski area’s lift-served summit.',[
    ['piste_length','Piste length',47.1,'km'],['lifts','Lifts',16],['snowmaking','Pistes with snowmaking',100,'%','Infrastructure coverage, not an operating or snow guarantee.'],
  ]),
  entry('Q60726558','St. Jakob im Defereggental','https://www.stjakob-ski.at/winter/lifte-und-pisten','St. Jakob combines open mountain skiing with family descents, a learning lift and a funpark. Timed and training runs give sporting skiers extra variety, while snowmaking supports the valley descents without guaranteeing daily availability.',[
    ['piste_length','Piste length',34.8,'km'],['lifts','Lifts',7],
  ],'Highest point withheld: operator headline says 2683 m while Leppleskofel lift table says 2680 m. Not confused with Brunnalm–Hohe Veitsch.'),
  entry('Q1721611','Kaiserau','https://stiftadmont.at/fr/paradis-des-familles-kaiserau/hiver/ski/','Kaiserau is a compact beginner-oriented mountain near Admont, suited to learning sessions and shorter ski outings. A children’s practice area supports first turns, while an approved slalom piste offers a more sporting alternative.',[
    ['piste_length','Piste length',3,'km'],['lifts','Main lifts',3,'','Children’s carpets described separately.'],
  ],'Nordic routes excluded from alpine length. Source is the owning abbey’s resort page.'),
  entry('Q26822192','Kühtai','https://www.kuehtai.info/en/sidenavigation/lifts-and-pistes.html','Kühtai offers a spread of easy, intermediate and difficult pistes, with dedicated learning carpets and night-skiing options. Its KPark adds freestyle, snowcross and a beginner park, giving riders alternatives to straightforward piste laps.',[], 'Local inventory retained as context only; Hochoetz shared-pass totals and lift lengths not treated as local skiing vertical.'),
  entry('Q61279053','Muttereralm','https://www.tirol.at/aktivitaeten/sport/skifahren/skigebiete/skigebiet-muttereralm','Muttereralm combines beginner practice slopes and family descents close to Innsbruck. The wooded Götzens descent gives it a different feel from open alpine terrain, while speed and slalom courses add a sporting option.',[
    ['piste_length','Published piste length',15.2,'km','Official Tirol tourism listing; federation overview rounds this to 15 km.'],
  ],'Source is official regional tourism, not an operator measurement survey.'),
  entry('Q1219251','Albiez-Montrond','https://www.station-albiez.com/fr/','Albiez spreads its skiing around the Chef-lieu and Mollard hamlets, combining rolling beginner pistes with more demanding sections. Its village setting and views toward the surrounding Alps favor a smaller-scale mountain holiday rather than a linked mega-resort.',[
    ['base','Lower piste elevation',1520,'m'],['skiing_elevation','Upper piste elevation',2100,'m'],
  ],'Operator 67-plus hectares includes other activities; municipality gives 70 hectares. No whole-resort ski acreage selected.'),
  entry('Q2871914','Auris-en-Oisans','https://skipass.auris-en-oisans.fr/','Auris combines dedicated beginner spaces and a woodland fun piste with the more demanding Maronne descent. It can serve as a family base for local skiing or a gateway to the larger Alpe d’Huez network, depending on the pass and open links.',[
    ['trails','Local pistes',19],['piste_length','Local piste length',45,'km'],['skiing_elevation','Signal de l’Homme piste high point',2176,'m'],
  ],'250-km Alpe d’Huez network excluded. Lower extent differs between operator (1450 m) and tourism overview (1600 m); withheld.'),
  entry('Q696634','Chamrousse','https://www.chamrousse.com/plan-pistes-alpin.html','Chamrousse has a broad alpine piste network with options from gentle green runs to demanding black pistes. That variety gives mixed-ability groups room to progress and explore without treating the separate Nordic domain as additional downhill terrain.',[
    ['piste_length','Alpine piste length',90,'km','Published as more than 90 km.',{qualifier:'+'}],['trails','Alpine pistes',41],['lifts','Alpine lifts',15],
  ]),
  entry('Q530324','Flaine','https://www.flaine.com/domaine-skiable/','Flaine combines broad, gentle pistes with more technical slopes and named freeride terrain. It is a base for exploring the Grand Massif, but local skiing and the full multi-resort network should not be mistaken for the same mountain inventory.',[], 'Grand Massif 265-km shared total withheld as a Flaine-only statistic.'),
  entry('Q829385','Combloux','https://www.combloux.com/profiter/ski/domaine-skiable/','Combloux offers family-oriented skiing among fir trees with views toward Mont Blanc. Its links open up the Portes du Mont-Blanc network, while lessons and slopeside facilities support local days; Cordon is a separate, non-ski-linked part of the pass.',[], '100-km Portes du Mont-Blanc and 400-plus-km Evasion totals are shared networks, not Combloux-only facts.'),
  entry('Q840817','Cordon','https://explore.cordon.fr/en/ski-resort/cordon','Cordon offers a small alpine network with pistes of different difficulties and a modest lift system. Its scale suits a contained day of skiing, rather than an attempt to cover the much larger networks advertised by neighboring resorts.',[
    ['trails','Pistes',9],['lifts','Lifts',5],['piste_length','Piste length',12,'km'],
  ],'Official tourist-office inventory; seasonal closed label not interpreted as permanent closure.'),
  entry('Q819065','Notre-Dame-de-Bellecombe','https://notredamebellecombe.labellemontagne.com/fr/hiver/ski-snowboard/domaine-skiable/','Notre-Dame-de-Bellecombe offers village-based skiing with beginner, intermediate and more demanding runs. It connects into the Val d’Arly and Espace Diamant networks, so wider ski exploration depends on which sectors and links are open.',[], '90-km Val d’Arly and 200-km Espace Diamant totals not assigned to this village alone; headline 159 pistes is network scope.'),
  entry('Q3107623','Formigal','https://www.formigal-panticosa.com/preguntas-frecuentes-formigal-panticosa.html','Formigal has beginner areas at Sextas and Anayet close to their parking areas, making first-day logistics comparatively straightforward. Its wider pass also covers Panticosa, but the connection between the two areas is by bus rather than a continuous ski run.',[], 'Combined 182-km, 147-route and 37-lift Formigal–Panticosa totals not assigned to Formigal alone.'),
  entry('Q2717381','Espot Esquí','https://pirineu365.cat/espotesqui/estacio/planol-de-pistes/','Espot combines a substantial elevation range with a compact lift network and pistes from beginner to advanced. Ski schools and a play area support families, while dedicated competition facilities give the mountain a sporting side.',[
    ['piste_length','Piste length',25,'km'],['trails','Pistes',22],['lifts','Lifts including carpets',5],['base','Minimum ski elevation',1500,'m'],['skiing_elevation','Maximum ski elevation',2500,'m'],['vertical','Published vertical',1000,'m'],
  ]),
  entry('Q762945','Ruka','https://www.ruka.fi/en/skiresort/slopes','Ruka mixes a sizable piste-and-lift network with family learning zones, junior freestyle terrain and tree-riding areas. Its village-to-valley gondola adds another way to move around the resort, beyond simply repeating downhill chairlift laps.',[
    ['trails','Slopes',41],['lifts','Lifts',22,'','Published inventory includes the scenic village-to-valley gondola.'],
  ],'Seasonal operating promises not imported as guaranteed skiing days.'),
  entry('Q60617874','Salla','https://ski.salla.fi/rinnekartta/','Salla combines family slopes with a snowpark, timed-speed facilities and a children’s activity area. Many runs are illuminated, offering a different winter experience from a resort dependent entirely on daylight, though sessions still follow the published schedule.',[
    ['trails','Slopes',15],['lifts','Lifts',7],['vertical','Maximum vertical',215,'m'],['longest_run','Longest run',1300,'m'],['lit_trails','Illuminated slopes',11],
  ]),
  entry('Q18681043','Sappee','https://www.sappee.fi/en/slope-introduction/','Sappee focuses on compact slope laps, with family learning runs and a snowpark offering jumps, boxes and rails. Its dedicated Family Park lets beginners build skills away from the main slopes, while several longer runs provide the next step.',[
    ['trails','Winter slopes',13,'','Winter denominator; 20 summer bike trails excluded.'],['lifts','Winter lifts',9],['vertical','Main-slope vertical',120,'m','Published for the main slope and several others; not calculated from map coordinates.'],
  ]),
  entry('Q60808746','Saariselkä','https://skisaariselka.com/slopes/','Saariselkä spreads its skiing across Kaunispää and Iisakkipää, with easy runs, expert pistes and freestyle areas. Ski-cross and technique slopes add variety; separate tobogganing and tubing facilities are not additional alpine ski runs.',[
    ['lifts','Lifts',6],['vertical','Published vertical',180,'m','Source labels this elevation within its slope facts, not absolute altitude.'],['snowparks','Freestyle snowparks',2],
  ],'Headline 24 slopes and 2000-m longest run include numbered toboggan/tubing routes; withheld as alpine-only facts.'),
  entry('Q18661776','Ruskotunturi','https://ruskotunturi.fi/rinnekartta/','Ruskotunturi offers a compact setup with learning terrain, park riding and a children’s activity area. Rope and carpet lifts serve the beginner space, while the separate sledding and tubing activities give non-skiing companions another option.',[
    ['trails','Slopes',6],['lifts','Lifts',4],['snowparks','Parks',2],
  ],'Report inventory denominators retained; summer zero-open counters ignored.'),
  entry('Q262837','Levi','https://www.levi.fi/en/ski/slopes-and-lifts/west-slopes/','Levi combines slopes for different abilities with a strong alpine-racing identity on its West Slopes. The Levi Black World Cup piste and training areas add sporting appeal, while mountain restaurants and huts offer frequent places to take a break.',[], 'Some pistes are reserved or seasonally closed for snow storage. No stale whole-resort totals inferred from a sector page.'),
  entry('Q3553510','Valdezcaray','https://www.valdezcaray.es/ficha-tecnica/','Valdezcaray offers terrain from beginner pistes to difficult runs and separately listed off-piste itineraries. Chairlifts and drag lifts serve the mountain, with ski schools, rentals and food stops supporting a self-contained ski day in La Rioja.',[
    ['trails','Pistes and itineraries',26,'','Includes two very difficult itineraries; not 26 groomed runs.'],['lifts','Lifts',10],['snowmaking_length','Pistes with snowmaking',8,'km','Not total piste length.'],
  ],'Listed elevation bands also serve snow reporting; no endpoint or vertical inferred.'),
  entry('Q3398641','Port del Comte','https://portdelcomte.net/pistes/','Port del Comte combines learning slopes with blue cruising runs and black-rated terrain. The long La Serp run offers a different pace from its shorter steep pistes, while multiple lift types serve the different slope areas.',[
    ['named_run_length','La Serp run length',3800,'m'],['named_run_vertical','La Serp vertical',325,'m','Named run only, not whole-resort maximum.'],
  ],'Zero currently open kilometres ignored. No resort-wide total derived from dynamic inventory.'),
  entry('Q3750961','Valdesquí','https://valdesqui.es/mapa-y-ficha-tecnica/','Valdesquí offers north-facing skiing in the Sierra de Guadarrama near Madrid and Segovia. Ski schools, a competition piste and a snowpark give it a mix of learning and sporting options within a relatively contained mountain setting.',[
    ['trails','Pistes',29],['lifts','Lifts',15],['piste_length','Technical-sheet piste length',22.3,'km','Header rounds to 22 km.'],['area','Published skiable domain',202,'ha','Broad domain, not the roughly 66.3 hectares of piste strips listed separately.'],
  ],'Top elevation headline 2278 m differs from lift endpoint 2265 m and piste endpoint 2260 m; withheld pending definition check. Piste-strip area arithmetic also differs slightly from published total.'),
  entry('Q3179913','Masella','https://www.masella.com/fr/paginas/fiche-technique','Masella offers a broad range of pistes from green learning runs to black-rated terrain, with a substantial local vertical. Its separate illuminated network provides evening skiing options; those night runs are a subset of the mountain, not extra daytime mileage.',[
    ['piste_length','Published piste length',74,'km'],['trails','Pistes',65],['lifts','Lifts',17],['vertical','Published vertical',935,'m'],['base','Pla de Masella base',1600,'m'],['skiing_elevation','Published maximum elevation',2535,'m'],['night_piste_length','Illuminated piste length',10,'km'],
  ],'Undated live technical page links a 2023–24 sheet; freshness limitation retained. Alp2500/La Molina combined totals excluded.'),
  entry('Q2717343','Vall de Núria','https://pirineu365.cat/valldenuria/estacio/planol-de-pistes/','Vall de Núria offers a small alpine network with green, blue, red and black pistes. Ski schools, a children’s piste and separate sledding activities support mixed family visits without requiring a large multi-mountain itinerary.',[
    ['trails','Ski pistes',11],['lifts','Lifts',5],['base','Minimum ski elevation',1964,'m'],['skiing_elevation','Maximum ski elevation',2252,'m'],
  ],'Same official page says 7.6 km in introduction and 7.7 km in technical sheet; piste length withheld and conflict retained.'),
  entry('Q2717359','Vallter','https://pirineu365.cat/vallter/estacio/planol-de-pistes/','Vallter offers high-elevation skiing with green, blue and red pistes in a compact lift network. Its mixture of easier and more demanding runs supports progression, with complementary activities and visitor services around the resort.',[
    ['piste_length','Published piste length',14.15,'km'],['trails','Pistes',14],['lifts','Lifts',10],['base','Minimum ski elevation',2000,'m'],['skiing_elevation','Technical-sheet maximum elevation',2535,'m','Technical-sheet scope; map service labels are not substituted.'],
  ]),
  entry('Q3122376','Guzet','https://www.guzet.ski/fr/la-station','Guzet contrasts the steeper Freychet slopes with gentler skiing at Prat Mataou. Wooden chalets and a compact mountain atmosphere frame a resort that also offers a snowpark, beginner space and slalom stadium.',[
    ['piste_length','Piste length',40,'km'],['ski_sectors','Ski sectors',3],
  ],'Multi-activity trail and touring routes excluded from alpine length.'),
  entry('Q3230567','Les Angles','https://lesangles.com/le-domaine/','Les Angles combines pine-forest pistes with more open mountain terrain. Pla del Mir supports learning, while the Bigorre plateau acts as a central meeting point and the snowpark offers a progression beyond ordinary piste skiing.',[
    ['vertical','Published vertical',800,'m'],['skiing_elevation','Published ski high point',2400,'m'],
  ],'Official overview says 41 pistes/50 km while ticketing and English slope page say 45/55. Conflicting counts are retained without selecting a winner.'),
  entry('Q1540224','Gourette','https://www.n-py.com/fr/gourette/plan-des-pistes','Gourette combines the beginner-focused Bézou area with more technical skiing around Cotch and Pène Blanque. Its layout offers a progression from first turns to more demanding terrain within a dramatic Pyrenean mountain setting.',[
    ['piste_length','Piste length',42,'km'],
  ],'Official overview contains inconsistent area totals (100/125 ha) and a questionable lift headline; those fields withheld.'),
  entry('Q3382234','Piau-Engaly','https://www.n-py.com/fr/piau-engaly/presentation','Piau-Engaly offers high-mountain skiing above the Haute Vallée d’Aure, with terrain for beginners and experienced riders. A snowpark adds freestyle options, while its car-free resort setting puts the emphasis on time among the surrounding peaks.',[
    ['trails','Pistes',40],['base','Published lower ski elevation',1800,'m'],['skiing_elevation','Published upper ski elevation',2600,'m'],['vertical','Published vertical',800,'m'],['area','Piste area',125,'ha'],
  ]),
  entry('Q2180837','Peyragudes','https://www.n-py.com/fr/peyragudes/presentation','Peyragudes spans the Peyresourde and Les Agudes sides of the mountain, with long descents in either direction. Beginner facilities and slopeside villages support family stays, while Loudenvielle provides a different base down in the valley.',[
    ['base','Published lower ski elevation',1600,'m'],['skiing_elevation','Published upper ski elevation',2400,'m'],
  ],'Loudenvielle transport access not treated as skiable valley vertical.'),
  entry('Q1450764','Luz-Ardiden','https://www.n-py.com/fr/luz-ardiden/presentation','Luz-Ardiden spreads skiing across Aulian, Béderet and Cloze, with red and black pistes for sporting skiers. A snowpark and a children’s learning area add options for different abilities, while Luz-Saint-Sauveur supplies the village base below.',[
    ['area','Piste area',110,'ha'],['trails','Pistes',29],['lifts','Lifts',9],['base','Published lower ski elevation',1680,'m'],['skiing_elevation','Published upper ski elevation',2500,'m'],
  ],'1250-m Bernazaou freeride descent not treated as groomed lift-served vertical.'),
  entry('Q356665','La Mongie','https://www.n-py.com/fr/grand-tourmalet/presentation','La Mongie is the slopeside base on one side of Grand Tourmalet, with accommodation, shops and restaurants close to skiing. It offers a more purpose-built mountain stay than Barèges, the valley village on the other side of the shared domain.',[], 'Grand Tourmalet 54-piste/300-plus-ha figures not assigned to La Mongie alone; Pic du Midi freeride not counted as local piste terrain.'),
  entry('Q1798981','La Norma','https://www.la-norma.ski/','La Norma combines wooded pistes and a substantial vertical with a pedestrian resort village. Its long green descent offers an unhurried alternative to steeper skiing, while the shared pass reaches Valfréjus by road rather than by ski link.',[
    ['piste_length','Local piste length',65,'km'],['trails','Pistes',27],['lifts','Lifts',13],['vertical','Published vertical',1400,'m'],
  ],'135-km shared-pass total excluded from local mountain facts.'),
  entry('Q2562838','Les Karellis','https://www.leskarellis.com/fr/DOMAINE','Les Karellis emphasizes family progression, with a dedicated learning area leading on to longer green runs. Groomed pistes, forest terrain and a children’s fun run offer variety as skills develop, while the Nordic network remains a separate activity.',[
    ['piste_length','Alpine piste length',60,'km'],['area','Published skiable domain',530,'ha','Broad skiable domain, not groomed-piste acreage.'],['base','Lower ski elevation',1600,'m'],['skiing_elevation','Upper ski elevation',2520,'m'],
  ],'Operator lists 17 lifts while tourist office lists 16; neither selected. 34 alpine-plus-Nordic trails not used as alpine count.'),
  entry('Q918282','Valfréjus','https://www.valfrejus.com/ski-et-glisse/le-domaine-skiable/','Valfréjus contrasts the easy pistes and play areas on Arrondaz with more demanding terrain around Punta Bagna. The long Jeu run provides another way back toward the village; nearby La Norma is reached by shuttle, not a connecting piste.',[
    ['piste_length','Local piste length',70,'km'],['base','Lower ski elevation',1550,'m'],['skiing_elevation','Punta Bagna upper elevation',2737,'m'],['lifts','Lifts',10],
  ],'23-piste headline differs from difficulty counts summing to 22; withheld. Bob Park sledding routes not ski mileage.'),
  entry('Q2920718','Val Cenis','https://www.valcenis.com/ski-et-glisse/le-domaine-alpin-de-val-cenis/','Val Cenis links three villages beneath a largely north-facing ski domain, with views toward the Mont Cenis lake. Long easy cruising, more demanding pistes and dedicated fun zones make it a broad option for mixed-ability groups.',[
    ['piste_length','Alpine piste length',125,'km'],['trails','Pistes',65],['lifts','Lifts',29],['base','Lower ski elevation',1300,'m'],['skiing_elevation','Upper ski elevation',2800,'m'],['vertical','Published vertical',1500,'m'],['named_run_length','Escargot green run',10,'km'],
  ]),
  entry('Q3077529','Formiguères','https://www.trio-pyrenees.com/formigueres/domaine-skiable/','Formiguères offers forest skiing with a mix weighted toward red pistes, alongside learning facilities for children. A separate freeride area and access toward the Camporells add a more adventurous side, without making touring terrain part of the groomed domain.',[
    ['trails','Pistes',19],['piste_length','Piste length',25,'km'],['area','Published piste domain',65,'ha'],['vertical','Published vertical',700,'m'],
  ],'Older lift description omits the télémix mentioned on current homepage; lift total withheld pending inventory update. 10-ha freeride terrain kept separate.'),
  entry('Q950651','Crévoux','https://www.crevoux.fr/en/notre-station/','Crévoux emphasizes pistes that follow the mountain’s natural rolls and changing gradients rather than heavily reshaped slopes. Larch-forest skiing and north-facing terrain give it a distinctive character, with beginner runs below and more technical options above.',[
    ['trails','Alpine pistes',16],['surface_lifts','Drag lifts',5],['vertical','Published vertical',1000,'m'],
  ],'La Chalp Nordic trails excluded. Natural-snow marketing not treated as a guarantee or absence of snowmaking.'),
  entry('Q746545','Isola 2000','https://isola2000.com/domaine-skiable/','Isola 2000 contrasts Pélevos learning and freestyle terrain with the more technical wooded slopes of Saint-Sauveur. The south-facing Lombarde sector adds another exposure, while Tony’s Snowland provides beginner and more advanced park features.',[
    ['trails','Alpine pistes',45],['lifts','Lifts',20],
  ]),
  entry('Q3206868','La Bresse-Hohneck','https://labresse.labellemontagne.com/fr/hiver/ski-snowboard/domaine-skiable/','La Bresse-Hohneck combines forested Vosges skiing with family runs, steeper pistes and a boardercross. Scheduled dawn and evening sessions on illuminated slopes give it a distinct appeal beyond a conventional daytime ski outing.',[
    ['trails','Alpine pistes',30],['lifts','Lifts',15],['vertical','Published vertical',450,'m'],['base','Lower ski elevation',900,'m'],['skiing_elevation','Upper ski elevation',1350,'m'],['lit_trails','Illuminated pistes',8],
  ],'220 hectares described as landscapes, not established skiable terrain acreage; withheld. Stale schedule heading not treated as current hours.'),
  entry('Q3077716','Forsteralm','https://www.forsteralm.com/','Forsteralm is a local family hill geared toward children, relaxed piste skiing and shorter outings. Lessons and selected floodlit sessions complement the downhill slopes; the separate touring area is a different activity with its own access arrangements.',[], '750-m touring accumulation not imported as lift-served vertical. Detailed numerical widget is third-party and was not copied.'),
  entry('Q28054228','Laterns–Gapfohl','https://www.laterns.net/winter','Laterns–Gapfohl offers a contained family ski area with pistes for beginners and more confident skiers. Tipiberg supports young learners, and the nearby Falba Stuba provides a mountain dining stop; the toboggan run is separate from ski terrain.',[
    ['piste_length','Piste length',27,'km'],['lifts','Lifts',5],
  ]),
  entry('Q2239632','Schlick 2000','https://www.tirol.at/aktivitaeten/sport/skifahren/skigebiete/skigebiet-schlick-2000','Schlick 2000 combines a largely easy-to-intermediate piste mix with harder runs beneath the Kalkkögel. A children’s area, ski school and snowpark make it an option for families and progressing riders as well as more sporting visitors.',[
    ['easy_pistes','Easy pistes',12,'km'],['intermediate_pistes','Intermediate pistes',6.8,'km'],['difficult_pistes','Difficult pistes',3.2,'km'],
  ],'Official regional tourism category figures; local headline lengths vary with route/connector scope, so whole-domain length is withheld.'),
  entry('Q3094866','Galsterberg','https://www.schladming-dachstein.at/de/schladming-dachstein-entdecken/winterberge/galsterberg','Galsterberg offers a small family network built around a blue valley descent, fun runs and the themed Galstiland children’s area. A ski school within the domain and mountain huts help keep a learning-focused day together.',[
    ['piste_length','Piste length',15,'km'],['lifts','Lifts',4],['fun_runs','Fun runs',3],
  ],'Official regional tourism source. Night tobogganing does not establish night downhill skiing.'),
  entry('Q2312484','Sportgastein','https://www.skigastein.com/erlebnisse-berge/winter/skigebiete-in-ski-gastein/sportgastein/','Sportgastein combines high-altitude piste skiing with a pronounced freeride identity. Marked ski routes and an information base support that adventurous side, but off-piste access still calls for appropriate equipment, judgment and a current conditions check.',[
    ['base','Lower ski elevation',1590,'m'],['skiing_elevation','Upper ski elevation',2650,'m'],['ski_routes','Official freeride ski routes',3],
  ],'2686-m Kreuzkogel summit requires separate access; not the skiing high point.'),
  entry('Q60727349','Obertauern','https://www.ski-obertauern.at/lifte-pisten/betriebsinformationen','Obertauern is organized around its linked Tauernrunde ski circuit, encouraging a day that moves around the mountain rather than staying on one lift. The circuit’s availability depends on snow and operations, and the operator separates downhill skiing from permitted touring routes.',[], 'Winter operator operating information supports circuit description, not a whole-domain numerical inventory. Summer three-lift counter excluded.'),
  entry('Q124610584','Kaprun – Kitzsteinhorn/Maiskogel','https://www.kitzsteinhorn.at/en/winter/kitzsteinhorn-ski-board','Kitzsteinhorn adds high glacier pistes, freestyle parks and marked freeride routes to the Kaprun mountain experience. Wide slopes suit varied styles of skiing, while the lift connection from Kaprun offers access without implying a continuous ski descent to town.',[
    ['skiing_elevation','Glacier-sector upper piste elevation',3029,'m'],['freeride_routes','Signposted freeride routes',5],
  ],'1976-m glacier lower limit is not combined Maiskogel base. 61-km/23-lift headline crosses sector scope and is withheld until reconciled; 408-km Alpin Card excluded.'),
  entry('Q688964','Hintertux Glacier','https://www.tirol.at/aktivitaeten/sport/skifahren/skigebiete/hintertuxer-gletscher','Hintertux combines glacier skiing with a piste mix dominated by intermediate runs. Longer descents, a snowpark and a funslope offer different ways to spend the day, while the wider Zillertal pass covers additional areas beyond this glacier.',[
    ['piste_length','Published piste length',48.8,'km','Official Tirol tourism; 8.2 km of ski routes listed separately.'],['lifts','Listed lifts',20,'','Six gondolas, six chairlifts and eight drag lifts.'],
  ],'Olperer summit and 15000-m circuit accumulation are not ski vertical. No year-round-skiing guarantee.'),
  entry('Q433534','Alta Badia','https://www.altabadia.org/en/ski-area-alta-badia-dolomites','Alta Badia combines extensive easy cruising and mountain-hut dining with demanding exceptions such as Gran Risa and Vallon–Boé. Direct access to the Sellaronda adds touring possibilities, but the wider Dolomiti Superski pass is much larger than the local domain.',[
    ['piste_length','Local piste length',130,'km'],['easy_pistes','Easy pistes',74,'km'],['intermediate_pistes','Intermediate pistes',47,'km'],['difficult_pistes','Difficult pistes',9,'km'],
  ],'Official overview lists 53 lifts while official status inventory lists 54; conflict retained. 500/1200-km network totals excluded.'),
  entry('Q3497434','Le Collet','https://www.lecollet.com/winter/the-resort/the-ski-area/','Le Collet spreads its skiing across three sectors in the Belledonne mountains. Malatrait provides a beginner gateway, Pré Rond offers quieter wooded slopes, and Super Collet brings family learning facilities higher up the mountain.',[
    ['trails','Pistes',27],['piste_length','Piste length',35,'km'],
  ]),
  entry('Q2603685','Le Markstein','https://www.lemarkstein.net/fr/bouger-lhiver/station-du-markstein/ski-alpin/','Le Markstein pairs a compact Vosges downhill area with a pronounced racing and freestyle side. Gentle learning pistes sit alongside a slalom stadium, snowpark and boardercross, with selected illuminated slopes adding an evening option.',[
    ['trails','Alpine pistes',13],['surface_lifts','Drag lifts',8],['lit_trails','Illuminated pistes',2],
  ],'Grand Ballon and Nordic facilities excluded.'),
  entry('Q3231156','Les Brasses','https://lesbrasses.com/ski-alpins-massif-des-brasses/','Les Brasses is a family-oriented mountain close to Geneva and Annemasse, with dedicated learning space and a mix of easy and more demanding pistes. Its relatively contained downhill network suits groups that want different difficulty levels without a vast inter-resort tour.',[
    ['piste_length','Alpine piste length',37,'km'],['lifts','Lifts including carpets',12],
  ]),
  entry('Q28041177','Schnepfenried','https://www.leschnepf.com/plan-piste','Schnepfenried combines a small Vosges downhill network with a snowpark and scheduled night skiing. Separate Nordic and sledding areas broaden the winter activities without being counted as alpine pistes.',[], 'Unlabelled live icon counters not promoted to a verified alpine inventory.'),
  entry('Q3323128','Les Monts d’Olmes','https://www.montsdolmes.ski/fr/la-station','Les Monts d’Olmes combines family learning facilities with a strong mogul-skiing identity. Its compact Pyrenean network accommodates different abilities, including an introductory area served by a free rope tow.',[
    ['trails','Pistes',21],['lifts','Lifts',11],['piste_length','Piste length',21,'km'],
  ]),
  entry('Q2935670','Camurac','https://www.station-camurac.com/','Camurac offers a small family ski setting among the forests and ridges of the Aude Pyrenees. It is a mountain for a contained downhill outing rather than a large linked circuit; current terrain measurements still need an operator inventory.',[], 'Landscape altitude range not treated as confirmed lift-served endpoints; historical lift totals withheld.'),
  entry('Q130260373','Semnoz','https://www.semnoz.fr/presentation-du-domaine/','Semnoz offers downhill skiing on two sides of the mountain, with a progression from gentle learning slopes to harder runs. Its approachable layout makes learning and improving central to the experience; the Nordic network is a separate domain.',[], 'Page states 18 pistes but difficulty categories sum to 19. Count withheld pending reconciliation.'),
  entry('Q3830853','Les Saisies','https://www.lessaisies.com/decouvrir/le-ski-alpin-pour-tous/le-domaine-des-saisies/','Les Saisies emphasizes family cruising and playful learning terrain with views toward Mont Blanc. Its local pistes provide a substantial day on their own, while the linked Espace Diamant allows longer journeys across neighboring village resorts.',[
    ['piste_length','Local piste length',77,'km'],
  ],'192-km Espace Diamant and Nordic network excluded from local totals.'),
  entry('Q2274046','Serre Chevalier','https://www.serre-chevalier.com/fr/domaine-skiable/domaine-skiable','Serre Chevalier links three villages and Briançon, moving from larch-forest runs to open high-mountain terrain. Protected learning zones and more adventurous sectors give mixed-ability groups several distinct ways to explore the valley.',[
    ['piste_length','Piste length',250,'km'],['area','Marked skiable terrain',410,'ha'],['lifts','Lifts',58],['trails','Pistes',82],
  ]),
  entry('Q933254','Montgenèvre','https://montgenevre.com/hiver','Montgenèvre combines a broad local piste mix with access to a much larger cross-border ski network. Gentle green and blue runs sit alongside numerous reds and some blacks, making it a base for both learning days and longer explorations.',[
    ['piste_length','Montgenèvre piste length',95,'km'],['trails','Montgenèvre pistes',78],['base','Lower ski elevation',1850,'m'],['skiing_elevation','Upper ski elevation',2648,'m'],
  ],'Local domain only; Monts de la Lune and Via Lattea totals excluded. Source table still carries 2025/26 season dates.'),
  entry('Q3079691','Les Carroz','https://www.lescarroz.com/ouverture/','Les Carroz offers two different ways into the mountain: a gondola departure from the village or chairlift access from Les Molliets. The higher access leads toward the local summit and Grand Massif junction, making the resort a gateway for wider exploration.',[], 'Grand Massif and four-village pass inventories are not Les Carroz-only totals.'),
  entry('Q844641','Manigod','https://manigod.labellemontagne.com/fr/hiver/ski-snowboard/domaine-skiable/','Manigod combines family-friendly Aravis skiing with a distinctive evening scene on illuminated pistes. Gentle slopes, steeper alternatives and playful terrain support progression, while the ski connection to La Clusaz expands the options for longer days.',[
    ['piste_length','Local piste length',25,'km'],['lit_trails','Illuminated pistes',8],
  ],'La Clusaz-Manigod combined totals excluded; evening hours must be checked separately.'),
  entry('Q1414722','Les Menuires','https://lesmenuires.com/fr/5-bonnes-raisons','Les Menuires is a base for exploring the connected Three Valleys, with skiing for varied abilities and family learning support. Spa time, sledding and other non-ski activities offer alternatives for groups whose days do not all revolve around the pistes.',[], 'Three Valleys-wide piste and lift totals excluded from local facts. Local historical brochure not used as a current inventory.'),
  entry('Q758345','Atzmännig','https://www.atzmaennig.ch/de/winter/winterangebote/skifahren/','Atzmännig separates broad, gentle learning terrain at Brustenegg from blue and red descents higher on the mountain. A chairlift, drag lift and summit restaurant make it a compact place to progress beyond first turns without tackling a large ski circuit.',[
    ['piste_length','Piste length',8,'km'],['skiing_elevation','Highest piste',1200,'m'],
  ],'Six descents refer to upper slope, not whole resort. Conflicting 24/25-m carpet lengths not imported.'),
  entry('Q2781452','Mörlialp','https://www.moerlialp.ch/aktivitaeten/skifahren/','Mörlialp offers a compact groomed network with a broader difficulty mix than its size might suggest. Blue and red pistes provide progression, while black runs give stronger skiers a challenge within the same small mountain outing.',[
    ['piste_length','Marked piste length',12,'km'],
  ]),
  entry('Q1265072','Lauchernalp','https://www.loetschental.ch/de/aktivitaeten/skigebiet-lauchernalp-loetschental-129','Lauchernalp combines high-mountain scenery with a notably sporting piste mix. Easy runs exist above and below, but the connecting descents are red or black; less confident skiers can use the chairlift to return between those sectors.',[
    ['piste_length','Piste length',40,'km'],['skiing_elevation','Published upper ski elevation',3100,'m'],['lifts','Lifts including two carpets',7],
  ],'Regional tourism inventory; no guaranteed snow claim or lift-to-valley vertical inferred.'),
  entry('Q1266451','Eggberge','https://www.eggberge.ch/region/die-eggberge','Eggberge is a small inhabited mountain terrace reached primarily by cable car from the valley. Skiing shares this setting with everyday mountain life and walking, giving a visit a different feel from a large purpose-built resort.',[], 'Terrace altitude is not established piste endpoint. Cable-car access does not imply a ski descent to the valley.'),
  entry('Q59945375','Jakobshorn','https://www.davosklostersmountains.ch/de/mountains/berge/jakobshorn','Jakobshorn blends Davos piste skiing with a strong freestyle and après-ski identity. JatzPark offers different feature lines, while the Bolgen base area supports beginners and families; marked freeride routes require equipment and an open-status check.',[
    ['piste_length','Local piste length',55,'km'],['park_lines','JatzPark lines',4],['named_run_vertical','Davos Vertical descent',1000,'m','Named descent, not a surveyed whole-resort vertical.'],
  ],'Davos Klosters multi-mountain totals and summer live counters excluded.'),
  entry('Q688517','Verbier','https://www.verbier.ch/decouvrir/explore-activites/activites-sportives/ski-et-snowboard/','Verbier combines open, sunny cruising with more technical descents around its main mountain sectors. Access onward to Mont Fort and the wider Four Valleys makes it a base for longer explorations, while neighboring Savoleyres offers gentler alternatives.',[
    ['base','Main Verbier sector lower elevation',1500,'m'],['skiing_elevation','Main Verbier sector upper elevation',2700,'m'],
  ],'Main sector range only. Mont Fort and Four Valleys endpoints/mileage not silently attributed to this local scope.'),
  entry('Q3212105','La Quillane','https://www.laquillane.fr/les-forfaits/','La Quillane is designed around easy family skiing rather than high-speed mileage. Its green-dominated layout and small lift system give beginners a contained place to practice, with one blue piste providing the next step.',[
    ['trails','Alpine pistes',5,'','Four green pistes and one blue.'],['lifts','Lifts',2],
  ]),
  entry('Q120311334','Saint-Sorlin-d’Arves','https://www.saintsorlindarves.com/ski-glisse/domaine-skiable','Saint-Sorlin-d’Arves offers a substantial local mix of green, blue, red and black pistes within the linked Sybelles. Learning gardens support young skiers, while the higher slopes extend the day well above the village.',[
    ['trails','Local pistes',41],['lifts','Published local lift total',18],['base','Lower ski elevation',1500,'m'],['skiing_elevation','Upper ski elevation',2620,'m'],
  ],'Headline local total used; detailed list also includes boundary connections. Sybelles network totals excluded.'),
  entry('Q207589','Val d’Isère','https://www.valdisere.com/val-disere-en-hiver/ski-et-glisse/acheter-mon-forfait/','Val d’Isère pairs demanding mountain skiing with designated quieter learning zones, Valkids and a freestyle park. Those options help families and mixed-ability groups find their own pace within a destination also known for its more challenging slopes.',[], 'Tignes–Val d’Isère network totals not imported as local facts.'),
  entry('Q14209658','Peisey-Vallandry','https://www.peisey-vallandry.com/ski-alpin-snowboard.html','Peisey-Vallandry is a gateway to Paradiski with broad learning slopes, more technical descents and freestyle options. Views toward Mont Blanc and the Tarentaise accompany a day that can stay focused on progression or expand into the wider network.',[], '425-km Paradiski and Les Arcs/Peisey combined totals excluded from local inventory.'),
  entry('Q3368414','Passy Plaine-Joux','https://www.passy-mont-blanc.com/activites/ski-et-glisse/ski-alpin/','Passy Plaine-Joux offers a small family mountain facing Mont Blanc, with a dedicated learning area at the base. Its piste mix extends from greens to a black, and the Barmus chairlift provides access to the upper slopes.',[
    ['piste_length','Piste length',12,'km'],['base','Lower ski elevation',1340,'m'],['skiing_elevation','Upper ski elevation',1740,'m'],
  ],'No whole-resort vertical inferred from rounded endpoints.'),
  entry('Q3224756','Le Mont-Dore','https://lemontdore.fr/ski/le-domaine-skiable','Le Mont-Dore sits on the north side of the Sancy, combining gentle pistes with steeper runs and a separate couloir-skiing area. A free beginner drag lift supports first turns, while the surrounding relief gives stronger skiers a more adventurous setting.',[
    ['lifts','Lifts including carpet',14],['base','Lower ski elevation',1200,'m'],['skiing_elevation','Upper ski elevation',1850,'m'],['snowmaking','Domain with snowmaking',60,'%'],
  ],'Detailed page has 35 pistes; ski landing page says 31. Count withheld. Couloirs not represented as groomed pistes.'),
  entry('Q61202398','Ballon d’Alsace','https://www.ballondalsace.fr/activites/ski-alpin/','Ballon d’Alsace ranges from an introductory area to the steep Grand Langenberg black run. A snowpark adds variety, while its separate Nordic and sledding activities give mixed groups alternatives without enlarging the downhill figures.',[
    ['surface_lifts','Drag lifts',9],['snowmaking','Alpine domain with snowmaking',80,'%'],
  ],'Difficulty categories total 11 pistes, winter dashboard says 15; count withheld. Rope lifts separate from nine drag lifts.'),
  entry('Q3497364','Les Rousses','https://www.lesrousses.com/station-des-rousses-hiver/ski-alpin-jura-sur-leman/','Les Rousses offers cross-border Jura skiing across Dôle/Tuffes and La Serra, moving through forests and open combes. Easy learning terrain and more technical black runs share views toward the Alps and Lake Geneva; the Nordic network remains separate.',[], 'Jura sur Léman dashboard and sector inventories differ in scope and count. Whole-domain measurements withheld; 1677-m mountain summit not asserted as piste endpoint.'),
  entry('Q3209895','La Joue du Loup','https://www.ledevoluy.com/hiver/jimagine-mon-sejour/questions-frequentes/','La Joue du Loup provides a family entry to the Dévoluy ski domain, with learning and play areas on the snow front. Dog-sled outings above the Fontettes lift and separate winter trails add options for time away from downhill skiing.',[], '100 km belongs to shared Dévoluy domain, not La Joue du Loup alone. Superdévoluy not separately enriched with duplicate network figures.'),
  entry('Q16964617','Chalmazel','https://www.loire.fr/jcms/lw_1381870/fr/-echappee-belle-en-piste-pour-chalmazel','Chalmazel brings downhill skiing to the fir-covered Monts du Forez, with a family-oriented layout that also offers runs for stronger skiers. A children’s learning area, snowpark and adaptive-ski offering broaden the ways to enjoy this smaller mountain.',[
    ['trails','Published piste total',16],
  ],'Departmental owner source has no publication date; current operating status must be checked separately.'),
  entry('Q19406907','Crest-Voland Cohennoz','https://www.crestvoland.com/','Crest-Voland Cohennoz emphasizes a relaxed village setting and approachable family skiing. Its connection to Espace Diamant gives confident skiers more room to explore, without losing the option of keeping a day close to the village.',[], '200-km promotional figure is Espace Diamant-wide. New Logère gondola means older local lift inventories need revision.'),
  entry('Q3227070','Le Seignus','https://www.valdallos.com/les-stations-de-ski-du-val-d-allos.html','Le Seignus is the more technical, independent ski area in Val d’Allos, with sustained descents weaving through larch forest. It suits skiers looking for flowing turns and a sporting mountain feel; La Foux and Pra Loup are a separate domain.',[
    ['vertical','Published vertical',900,'m'],
  ],'Connection to La Foux is by shuttle, not a continuous piste; Espace Lumière totals excluded.'),
  entry('Q1085709','Chaillol','https://www.champsaur-valgaudemar.com/decouvrir/les-stations/chaillol/','Chaillol occupies a sunny mountain shoulder overlooking the Champsaur valley beneath the much higher Vieux Chaillol. Its village-scale ski setting and snow-front terraces suit a relaxed outing, with separate winter routes offering alternatives to lift-served runs.',[], 'Regional tourism source used. Former chaillol.fr site contains unrelated gambling affiliate material and was not accepted. 3163-m mountain summit not a skiing elevation.'),
  entry('Q1085971','Saint-Léger-les-Mélèzes','https://www.champsaur-valgaudemar.com/decouvrir/les-stations/saint-leger-les-melezes/','Saint-Léger-les-Mélèzes is defined by its forested slopes and village setting. Higher up, the Cuchon opens views across the Champsaur and surrounding peaks, giving a compact ski day a contrast between woodland runs and an open mountain outlook.',[
    ['trails','Listed alpine pistes',16],['base','Lower ski elevation',1260,'m'],['skiing_elevation','Upper ski elevation',2001,'m'],
  ],'Dashboard lists nine lifts while 2025/26 brochure lists eight main lifts; learning-facility scope unresolved, so lift total withheld.'),
  entry('Q61232702','Mont Serein','https://www.stationdumontserein.com/contactez-nous','Mont Serein offers a small downhill network on Mont Ventoux, including a children’s learning area alongside its named pistes. It is distinct from the operator’s Ventoux Sud area, so those two inventories should not be combined when planning a ski visit.',[
    ['lifts','Listed Mont Serein lifts including carpet',8],
  ],'18-entry piste widget includes learning space and a repeated Vallon name; not promoted as distinct alpine trail count. Winter opening is snow-dependent; summer closure counter not permanent closure.'),
  entry('Q61159493','Monte Cimone','https://www.fisi.org/impianti/cimone/','Monte Cimone offers a connected ski circuit in the Tuscan-Emilian Apennines. Its pistes share one lift pass and link without needing to take skis off, making it an option for moving around several slopes during the same day.',[
    ['piste_length','Connected piste length',50,'km','National winter-sports federation states more than 50 km.',{qualifier:'+'}],
  ],'Primary federation partner listing; no dated full lift or elevation inventory available from this source.'),
  entry('Q689484','Sedrun','https://www.andermatt-sedrun-disentis.ch/disentis-sedrun/en/pages/skiing-snowboarding','Sedrun offers access to the broader Andermatt–Sedrun–Disentis mountain network alongside a smaller family setting at Valtgeva. Easy pistes close to a restaurant suit younger learners, while nearby lift access opens options for higher mountain days.',[], '180-plus-km figure spans three destinations and is excluded from Sedrun-only facts. Valtgeva not separately counted in this batch.'),
]

officialBatch.find(e=>e.id==='wikidata:item:Q15110597').summary_sources.push('https://www.reiteralm.at/')
officialBatch.find(e=>e.id==='wikidata:item:Q686055').summary_sources.push('https://www.reiteralm.at/de/aktivitaeten/skifahren')

// Preserve competing observations without silently choosing or averaging them.
for(const [id,key,label,unit,values,other,note] of [
  ['Q60726558','skiing_elevation','Upper ski elevation','m',[2683,2680],null,'Same operator page headline and table disagree; elevation withheld.'],
  ['Q2717343','piste_length','Piste length','km',[7.6,7.7],null,'Two totals on the same official piste page; no single length selected.'],
  ['Q3230567','trails','Pistes','',[41,45],'https://forfait-ski.lesangles.com/fr/domaine-skiable','Tourism overview and lift-pass domain page disagree; count withheld.'],
  ['Q3230567','piste_length','Piste length','km',[50,55],'https://forfait-ski.lesangles.com/fr/domaine-skiable','Tourism overview and lift-pass domain page disagree; length withheld.'],
  ['Q2562838','lifts','Lifts','',[17,16],'https://www.karellis.com/station-de-ski-en-maurienne/','Operator and tourist-office totals disagree; scope and date need reconciliation.'],
  ['Q433534','lifts','Lifts','',[53,54],'https://www.altabadia.org/en/open-lifts-snow-report-dolomites','Official overview and lift-status inventory disagree; total withheld.'],
  ['Q130260373','trails','Alpine pistes','',[18,19],null,'Headline states 18; listed difficulty categories sum to 19. Second alternative is calculated, not a separately published total.'],
  ['Q3224756','trails','Pistes','',[35,31],'https://lemontdore.fr/ski','Detailed domain page and ski landing page disagree; count withheld.'],
  ['Q61202398','trails','Alpine pistes','',[11,15],'https://www.ballondalsace.fr/hiver/','Difficulty categories sum to 11; winter dashboard says 15. First alternative is calculated, and inventory scope remains unresolved.'],
  ['Q918282','trails','Pistes','',[23,22],null,'Headline states 23; difficulty categories sum to 22. Second alternative is calculated; count withheld.'],
  ['Q1540224','area','Skiable terrain','ha',[125,100],null,'Same official page gives two area totals without a reconciled scope; acreage withheld.'],
]){
  const e=officialBatch.find(e=>e.id===`wikidata:item:${id}`),source=e.summary_sources[0]
  e.observations.push({key,label,unit,value:null,source,alternatives:[{value:values[0],source},{value:values[1],source:other||source}],note,retrieved_at:checked,source_published_at:null,status:'conflict',confidence:'low'})
}

export function applyOfficialBatch009(records){
  const report=applyOfficialBatch(records,{entries:officialBatch,batch:'official-009',checkedAt:checked})
  report.summary_only_profiles=officialBatch.filter(e=>!e.observations.some(o=>o.status==='source_checked')).map(e=>e.id)
  report.profiles.forEach(p=>{p.sources=[...new Set([...p.sources,...officialBatch.find(e=>e.id===p.id).summary_sources])]})
  return report
}
