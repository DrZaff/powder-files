import { applyOfficialBatch } from './official-batch-001.mjs'
import { normalizeName } from './lib/normalize.mjs'

export const checked='2026-09-05'
const entry=(id,name,source,character,rows=[],notes='')=>({
  id:id.includes(':')?id:`wikidata:item:${id}`,name,
  summary:`${name} ${character}`,
  summary_sources:[source],summary_reviewed_at:checked,notes,
  observations:rows.map(([key,label,value,unit='',note='',extra={}])=>({key,label,value,unit,note,source,retrieved_at:checked,source_published_at:null,status:'source_checked',confidence:'medium',...extra})),
})

export const officialBatch=[
  entry('Q2839398','Alpe du Grand Serre','https://www.matheysine-tourisme.com/en/alpe-du-grand-serre/activities/winter/ski-snowboard-alpe-du-grand-serre/snow-and-slopes-informations/','offers a village-based French Alps experience with lower learning terrain and higher, more open slopes beneath the Taillefer massif.',[['base','Published lower station elevation',1367,'m'],['skiing_elevation','Published upper station elevation',2184,'m']],'The official page confirms the completed 2025–26 public season; station elevations are not labeled surveyed piste endpoints.'),
  entry('Q1242281','Champagny-en-Vanoise','https://en.la-plagne.com/discover-the-resort/our-villages/champagny-en-vanoise','is a traditional village gateway into La Plagne, combining local gondola access and scenic Vanoise surroundings with the reach of a much larger linked domain.'),
  entry('Q4144510','Gornaya Karusel / Krasnaya Polyana','https://krasnayapolyanaresort.ru','climbs from a developed resort base into the Caucasus, mixing groomed cruising and higher mountain terrain under its current Krasnaya Polyana identity.'),
  entry('Q11924602','Ski Pallars','https://www.skipallars.cat','groups Pyrenean mountain areas under one regional offering, so its profile represents a shared destination rather than one single lift pod.'),
  entry('Q11579883','Ikenotaira Snow Park','https://www.shirakabaresort.jp/snowpark','is a compact family snow area at Shirakaba Resort, with approachable slopes and play-focused facilities taking priority over large-mountain scale.'),
  entry('Q11554699','Izumigatake Ski Field','http://www.izumigatake.net','serves Sendai as a convenient local hill, with straightforward groomed terrain and a community-mountain feel rather than destination-resort breadth.'),
  entry('Q2616429','La Pinilla','https://www.lapinilla.es','brings lift-served skiing to the Sierra de Ayllón, where a compact base and exposed upper slopes make weather and snow coverage especially important.'),
  entry('Q97774986','La Stèle','https://lastele.fr/hiver/ski','is a small Auvergne winter area where modest alpine slopes sit alongside a broader Nordic and family snow offering.'),
  entry('Q84055','La Tania','https://www.latania.com','is a wooded, pedestrian-oriented Courchevel base whose local runs provide an intimate starting point for exploring the wider Three Valleys.'),
  entry('Q3045057',"Le Désert d'Entremont",'https://www.chartreuse-tourisme.com/offres/station-de-ski-le-desert-dentremont-entremont-le-vieux-fr-2716892/','is a small Chartreuse station centered on family skiing and quiet local slopes rather than a large interconnected resort network.'),
  entry('openstreetmap:way:858835017','Lyžařský areál Kobyla','https://www.lazadov.cz','is a compact Czech area designed for accessible local laps, lessons and family outings on maintained downhill slopes.'),
  entry('Q845847','Morillon','https://www.grand-massif.com/en/morillon/','combines a traditional valley village with a higher ski-in, ski-out base and direct access into the varied Grand Massif network.'),
  entry('Q115376642','Le Barioz','https://www.barioz.fr','is a small Belledonne winter station whose limited downhill terrain shares the landscape with Nordic recreation and a low-key local atmosphere.'),
  entry('Q19407210',"Roc d'Enfer",'https://www.rocdenfer.com','favors long, scenic links through forested terrain, with a quieter village-mountain feel than a heavily built destination resort.'),
  entry('Q20045141','Shiratori Kogen','https://siratori-k.jp/swp','combines groomed runs with freeride-oriented snow terrain in a compact Gujo mountain setting.'),
  entry('Q20045318','St. Mary Ski Area','https://stmary-338.com','is a regional Tohoku hill with a practical mix of family slopes, progression terrain and straightforward lift access.'),
  entry('Q21775021','Middagsåsen','http://www.middagsasen.no','is a compact Norwegian local area suited to lessons, evening skiing and repeat laps rather than a multi-day mountain circuit.'),
  entry('Q22119124','Miyagi Zao Sumikawa Snow Park','http://www.zao-sumikawa.jp','combines lift-served slopes with a high-mountain Zao setting, while its separate snowcat excursions remain distinct from ordinary piste skiing.'),
  entry('Q2409088','Les Fourgs','https://station-lesfourgs.fr','is a village-scale Jura station whose gentle alpine slopes sit within a broader Nordic winter landscape.'),
  entry('Q24860363','Miyagi Zao Eboshi Resort','https://eboshi.co.jp','offers a gondola-accessed descent and varied Tohoku terrain, from long cruising to steeper upper sections.'),
  entry('Q2507885','Lenzerheide','https://arosalenzerheide.swiss/en/Ski-Area','forms one side of the Arosa Lenzerheide domain, balancing broad cruising, family facilities and linked high-mountain exploration.'),
  entry('Q2515208','KitzSki','https://www.kitzski.at/en/','links Kitzbühel and surrounding mountain sectors into a large Austrian network known for groomed variety, sporting descents and extensive lift connections.'),
  entry('Q30141219','Rouge Gazon','https://rouge-gazon.fr','is a Vosges mountain station where compact alpine runs, woodland scenery and other winter activities create a relaxed regional day.'),
  entry('Q30141734','Le Grand Domaine','https://www.legranddomaine.fr','connects Valmorel with Saint-François-Longchamp, creating a multi-valley experience with both wooded and open alpine skiing.'),
  entry('Q3037876','Valmorel','https://www.valmorel.com','pairs a pedestrian village with varied local slopes and onward links through Le Grand Domaine, making architecture and mountain access equally distinctive.'),
  entry('Q3104905','Ghisoni-Capanelle','https://www.ghisoni.corsica/station-ghisoni-capanelle','offers conditions-dependent lift skiing in Corsica, with a rugged island-mountain setting that differs sharply from mainland alpine resorts.'),
  entry('Q3211628','La Pierre Saint-Martin','https://www.lapierrestmartin.com','mixes Pyrenean views, family terrain and a compact resort village near the Spanish border.'),
  entry('Q3224822','Le Mourtis','https://www.mourtis.fr','is a forested Pyrenean station with approachable family slopes and steeper options woven into a relatively intimate mountain layout.'),
  entry('Q3226943','Sauze Super Sauze','https://www.sauze.com','rises above the Ubaye Valley with sunny alpine slopes and a village-resort character suited to mixed-ability groups.'),
  entry('Q3230435','Aillons-Margériaz','https://www.chamberymontagnes.com/aillonsmargeriaz','offers two Chartreuse/Bauges mountain settings, with family skiing, natural scenery and a regional rather than urban-resort feel.'),
  entry('Q3232967','Les Gentianes','http://www.station-lesgentianes.com','is a very small French local station where learning and short lift-served laps define the experience.'),
  entry('Q3234776','Plateau de Retord alpine area','https://www.plateauderetord.fr/fr/que-faire/activites/activites-hiver/ski-alpin','provides modest downhill slopes within a much broader Jura winter-sports plateau, keeping alpine and Nordic uses distinct.'),
  entry('Q4324002','Hochzillertal-Kaltenbach','https://www.hochzillertal.com','uses fast valley access to reach a broad high-mountain network, with long cruising, freeride zones and polished slope-side facilities.'),
  entry('Q46092206','Matthias-Schmidt-Berg','https://www.oberharz.de/winter/skigebiete-im-harz/matthias-schmidt-berg/','is a compact Harz ski hill with forested pistes and a practical regional character suited to day trips.'),
  entry('Q62071522','Gubakha','https://gubaha.com','is a Urals mountain center with varied natural terrain and a stronger downhill identity than a simple city learning slope.'),
  entry('Q62071591','Glushata','http://glushata.ru','is a small Russian regional hill built around short lift-served runs and accessible winter recreation.'),
  entry('Q62071672','Gebrei','http://www.gebrei.ru','offers a compact local downhill experience where straightforward slopes and snow conditions matter more than extensive resort infrastructure.'),
  entry('Q62071753','Polazna','http://polazna.ru','is a regional Russian ski center with a modest lift layout suited to lessons, practice and repeat laps.'),
  entry('Q63164706','Oyu Onsen Ski Area','http://www.oyu-uonuma.com/ski/index.html','pairs a community snow hill with the surrounding hot-spring area, creating a relaxed local winter outing.'),
  entry('Q63164924','Yakushi Ski Area','http://yakushi-ski.com','is a compact Niigata community mountain focused on approachable slopes and uncomplicated local skiing.'),
  entry('Q63165133','Suhara Ski Area','https://www.suhara-ski.com','offers a regional snow-country experience with groomed family terrain and a quieter pace than large destination resorts.'),
  entry('Q63165732','Ohara Ski Area','https://ohara-ski.com','is a small Uonuma-area mountain where reliable snow-country character and local access shape the day.'),
  entry('Q65238137','Onikoube Ski Resort','https://www.onikoube.com','combines volcanic Tohoku scenery with groomed cruising, family facilities and a traditional regional resort base.'),
  entry('Q65279048','Kyukamura Shonai-Haguro Ski Area','https://www.qkamura.or.jp/haguro/ski','is a compact forested slope within a national-recreation setting, emphasizing family outings and quiet practice.'),
  entry('Q76813743','Shintotsukawa Ski Area','https://www.town.shintotsukawa.lg.jp/kanko/detail/00003261.html','is a town-operated Hokkaido hill where accessible lift skiing and community use take priority over destination scale.'),
  entry('Q83872254','Onogawa Onsen Ski Area','https://npo-onogawa.org','pairs a small local slope with a hot-spring village, offering an intimate winter day rather than a broad trail network.'),
  entry('Q11392464','Rokko Snow Park','https://www.rokkosan.com/ski','is an outdoor, lift-served snow park near Kobe focused on learning, family play and convenient short sessions.'),
  entry('Q1335490','Rosa Khutor Alpine Resort','https://rosakhutor.com','spans a dramatic Caucasus elevation range with polished village facilities, groomed pistes and extensive high-mountain terrain.'),
  entry('Q120311909',"Saint-Jean-d'Arves",'https://www.sja73.com','is a traditional Maurienne village with local lift access into Les Sybelles, combining quiet lodging with a much wider ski network.'),
  entry('Q929287',"Saint-Jean-d'Aulps",'https://www.rocdenfer.com','provides a village gateway to the Roc d’Enfer circuit, where long forested routes and scenery outweigh dense resort development.'),
  entry('Q818418','Saint-Jean-de-Sixt','https://www.saint-jean-de-sixt.com','offers a very small village learning area between larger Aravis resorts, suited to first turns and short family sessions.'),
  entry('Q668034','Saint-Martin-de-Belleville','https://www.les3vallees.com/en/guide/ski-resort/saint-martin-de-belleville','is a historic village base whose gondola links open into the Three Valleys while preserving a quieter local atmosphere.'),
  entry('Q659996','St. Anton am Arlberg','https://www.stantonamarlberg.com/en/winter/the-ski-area','combines extensive connected pistes with demanding alpine terrain and a lively village, making it a full destination rather than a compact hill.'),
  entry('Q11521474','Sapporo Mt. Moiwa Ski Resort','https://www.rinyu.co.jp/moiwa','offers city-accessible skiing with night views over Sapporo, while retaining a traditional local-mountain feel.'),
  entry('Q11656126','Seki Onsen Ski Resort','http://sekionsen.jp','is a compact Myoko-area mountain known for natural snowfall, ungroomed character and a deliberately simple lift network.'),
  entry('Q1112934','Chabanon-Selonnet','https://www.chabanon-selonnet.com','pairs a southern-Alps village setting with family pistes and night-skiing opportunities on a manageable mountain.'),
  entry('Q980500','Silichy','https://silichy.by','is a polished Belarusian recreation center where compact downhill slopes sit alongside a wider year-round activity offering.'),
  entry('Q768759','Sixt-Fer-à-Cheval','https://www.grand-massif.com/en/sixt/','offers scenic village skiing beneath dramatic limestone walls, with local beginner terrain and links toward the Grand Massif.'),
  entry('Q873234','Ski amadé','https://www.skiamade.com/en/ski-areas','is a five-region pass network rather than one mountain, offering enormous variety across 25 separate resort communities.',[
    ['ski_areas','Resort communities',25],['piste_length','Maximum network piste length',760,'km'],['lifts','Network lift facilities',260],
  ],'Network-wide maximums; not additive to member-resort profiles.'),
  entry('Q9340452','Środula Ski Slope','http://stoksrodula.pl','is an outdoor urban ski hill in Sosnowiec, designed for convenient learning and short local laps.'),
  entry('Q110813686','Albstadt-Tailfingen Ski Lift','https://www.wsv-tailfingen.de','is a small Swabian Alb slope operated for local winter recreation when natural conditions allow.'),
  entry('Q135969887','Angertal Ski Center','https://www.angertal.at/skizentrum.html','is a learning-focused Gastein base with broad practice terrain and direct links into the surrounding mountain network.'),
  entry('Q109359857','Snow Park Dorogawa','http://www4.kcn.ne.jp/~zaisanku/spd.htm','is a compact Nara-area snow hill offering modest lift-served terrain in a quiet mountain-valley setting.'),
  entry('Q11312618','Snow Resort Nekoyama','http://nekoyama.net/win','is a regional Hiroshima mountain with groomed family runs and a relaxed day-trip character.'),
  entry('Q105062094','Sorochany','https://sorochany.ru','is a modern Moscow-region ski center with multiple compact slopes designed for frequent day and evening sessions.'),
  entry('Q104839265','Suishōzan Ski Area','https://www.ink.or.jp/~mineland/ski/newpage3.htm','is a small Akita community hill where uncomplicated groomed slopes support lessons and local recreation.'),
  entry('Q3504072','SuperDévoluy','https://www.ledevoluy.com/winter/skiing/ski-area/','combines a slopeside resort base with broad, sunny terrain and links across the wider Dévoluy ski area.'),
  entry('Q11443946','Taiheizan Ski Resort Opas','http://www.theboon.net/opas','is an Akita-area community mountain offering groomed slopes, learning facilities and convenient regional access.'),
  entry('Q60986690','Takamagahara Mammoth Ski Area','https://shigakogen.co.jp/highlight/takamahara','is a broad Shiga Kogen sector with open cruising, family terrain and direct connections toward neighboring areas.'),
  entry('Q11316000','Takanbō Ski Slopes','http://www.gokayama-kankou.com/contents2','is a small Gokayama hill whose snow-country setting and uncomplicated local slopes define the visit.'),
  entry('Q11621787','Tateshina Tokyu Ski Resort','https://www.tateshina-tokyu.com/ski','is a compact resort hill focused on family skiing, instruction and easy access from nearby accommodation.'),
  entry('Q60780554','Terre Ronde','https://www.plateau-hauteville.com/fr/sports-dhiver/ski-alpin.html','is a modest Plateau d’Hauteville alpine area suited to learning and regional snow days rather than long mountain journeys.'),
  entry('Q1388437','Vaujany','https://www.vaujany.com/en/winter/alpine-skiing/','is a traditional Oisans village with major cable-car access into high terrain shared with the Alpe d’Huez network.'),
  entry('Q17640406','Velouchi Ski Resort','https://velouchi4mount.com','offers open Greek mountain terrain above Karpenisi, with a sporting regional character and broad central-country views.'),
  entry('Q16694996','Voevodyno','https://voevodyno.com','is a Carpathian resort where a small downhill area forms one part of a broader outdoor and lodging experience.'),
  entry('Q17216179','Wakasa Hyounosen Ski Area','http://www.hyounosen.co.jp','combines western-Japan snow terrain with a regional mountain atmosphere and slopes for mixed abilities.'),
  entry('openstreetmap:way:893138900','Whitetail Resort','https://www.skiwhitetail.com/the-mountain/about-the-mountain/mountain-info.aspx','offers a substantial Mid-Atlantic drop with terrain parks and pistes spanning beginner through expert difficulty.',[
    ['vertical','Advertised vertical',1000,'ft','Operator describes the vertical as close to 1,000 feet.',{qualifier:'approximately'}],
  ]),
  entry('Q1734799','Wirzweli','https://www.wirzweli.ch','is a compact Swiss family mountain with gentle slopes, winter activities and a quiet plateau setting above the valley.'),
  entry('Q59948635','Wolzenalp','https://www.wolzen.ch','offers small-scale Toggenburg skiing with natural-snow character and an unhurried local atmosphere.'),
  entry('Q1005993','Yabuli Ski Resort','http://www.yabuliski.com','is a major Chinese winter-sports destination with multiple mountain sectors, training heritage and a developed resort base.'),
  entry('Q11470516','Yamada Onsen Kids Snow Park','https://www.yamaboku.jp/k-profile/k-profile.html','is a tiny family learning area where children, first turns and snow play are the entire focus.'),
  entry('Q22120711','Mogami Akakura Onsen Ski Resort','https://akakura-spa-ski.com','pairs a traditional hot-spring community with local lift-served slopes in a snowy Yamagata valley.'),
  entry('openstreetmap:way:252602840','Chokai Kogen Yashima Ski Area','http://www.ybnet.jp/~ski','is a regional Akita mountain with groomed runs and wide views toward Mount Chokai.'),
  entry('Q331508','Abriès-Ristolas ski area','https://www.queyras-montagne.com/abries-ristolas/ski-alpin/','serves a high Queyras valley with village-based lifts, tree-lined lower terrain and a quieter atmosphere than large purpose-built resorts.'),
  entry('Q534206','Saint-Gervais Mont-Blanc ski area','https://www.saintgervais.com/hiver/ski-snowboard/domaine-skiable-evasion-mont-blanc/','uses a historic spa town as a gateway to Evasion Mont-Blanc, combining wooded local runs with broad linked-area exploration.'),
  entry('Q14547435','Aletsch Arena','https://www.aletscharena.ch/en/activities/ski-snowboard','spreads car-free village access and sunny slopes above the Rhône Valley, with glacier views central to the mountain experience.'),
  entry('Q3612944','Alpe di Mera','https://www.alpedimera.it','is a compact Valsesia mountain with Monte Rosa views, tree-lined skiing and a relaxed village-scale atmosphere.'),
  entry('Q4736779','Alto Campoo','https://www.altocampoo.com','offers open Cantabrian mountain skiing where Atlantic weather and broad plateau terrain strongly shape conditions.'),
  entry('Q4774886','Antillanca','https://antillanca.cl','sits within Chilean lake-and-volcano country, combining forested slopes with a remote national-park setting.'),
  entry('Q3572141','Aramón Valdelinares','https://www.javalambre-valdelinares.com/valdelinares','is a compact Spanish mountain focused on groomed family pistes, snowmaking and accessible progression terrain.'),
  entry('Q2859835','Arc 1600','https://en.lesarcs.com/discover/arc-1600','is the original Les Arcs base, with forest-edge skiing and fast links into the larger Paradiski network.'),
  entry('Q2859833','Arc 1800','https://en.lesarcs.com/discover/arc-1800','is the liveliest Les Arcs base, pairing broad intermediate access with extensive lodging and direct network connections.'),
  entry('Q2859837','Arc 1950','https://en.lesarcs.com/discover/arc-1950','is a pedestrian ski-in, ski-out village whose convenient slope access makes it a polished base for wider Les Arcs exploration.'),
  entry('Q2859839','Arc 2000','https://en.lesarcs.com/discover/arc-2000','is a high-altitude bowl base oriented toward snow reliability, upper-mountain access and more sporting terrain.'),
  entry('Q2866428','Ascou-Pailhères','https://www.ascou.ski','is a small Ariège Pyrenees station with wooded slopes, family terrain and a quiet regional feel.'),
  entry('Q752368','Astún','https://astun.com','offers open Pyrenean bowl skiing near the French border, with terrain naturally divided among several upper valleys.'),
  entry('Q776585','Auron','https://hiver.auron.com','combines a traditional southern-Alps village with sunny high terrain and a full destination-resort range of pistes.'),
  entry('Q4906452','Big Moose Mountain','https://skibigmoose.com','is a community-driven Maine mountain whose lake views, classic trails and developing lift access give it a distinctive revival story.'),
  entry('Q18339186','Blanche Takayama','https://blanche-ski.com','is a skier-focused Nagano mountain with broad groomed pistes and an uncrowded, traditional atmosphere.'),
  entry('Q2909263','Phoenix Snow Park','https://phoenixhnr.co.kr/page/main/pyeongchang','is a developed Korean resort with night skiing, freestyle heritage and a broad base-area experience.'),
]

export function applyOfficialBatch013(records){
  const byId=new Map(records.map(r=>[r.stable_id,r]))
  for(const e of officialBatch){
    const record=byId.get(e.id)
    if(record&&(/^Q\d+$/.test(record.name)||record.name!==e.name&&e.id.startsWith('openstreetmap:'))){
      record.name=e.name
      record.normalized_name=normalizeName(e.name)
      record.field_provenance.name={value:e.name,source_record_ids:e.summary_sources,confidence:'medium',reviewed_at:checked,note:'Official-name repair; identity and stable ID are unchanged.'}
    }
  }
  const report=applyOfficialBatch(records,{entries:officialBatch,batch:'official-013',checkedAt:checked})
  report.summary_only_profiles=officialBatch.filter(e=>!e.observations.some(o=>o.status==='source_checked')).map(e=>e.id)
  report.profiles.forEach(p=>{p.sources=[...new Set([...p.sources,...officialBatch.find(e=>e.id===p.id).summary_sources])]})
  return report
}
