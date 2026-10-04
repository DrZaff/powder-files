import { applyOfficialBatch } from './official-batch-001.mjs'
import { normalizeName } from './lib/normalize.mjs'

export const checked='2026-08-31'
const entry=(id,name,source,summary,rows=[],notes='')=>({
  id:id.includes(':')?id:`wikidata:item:${id}`,name,summary,summary_sources:[source],summary_reviewed_at:checked,notes,
  observations:rows.map(([key,label,value,unit='',note='',extra={}])=>({key,label,value,unit,note,source,retrieved_at:checked,source_published_at:null,status:'source_checked',confidence:'medium',...extra})),
})

// This block deliberately favors restrained, source-linked character summaries.
// Measurements are included only where the primary page stated an unambiguous scope.
export const officialBatch=[
  entry('Q383744','Afri-Ski','https://afriski.net','Afri-Ski brings lift-served snow sports to Lesotho’s highlands, with a compact slope setting that feels very different from a large alpine resort.'),
  entry('Q17988268','Akasawa Ski Resort','https://akasawa.biz','Akasawa is a small local snow area whose straightforward layout is better suited to an easygoing day than a destination-scale mountain tour.'),
  entry('Q4829752','Awakino ski area','https://skiawakino.com','Awakino is a club-operated New Zealand field with a back-to-basics mountain atmosphere and terrain shaped more by conditions than resort polish.'),
  entry('Q1502252','Baqueira-Beret','https://www.baqueira.es','Baqueira Beret spreads skiing across several Pyrenean sectors, giving visitors room to move between open alpine terrain, groomed cruising and higher-mountain routes.'),
  entry('Q4892259','Berkshire East Ski Resort','https://berkshireeast.com','Berkshire East is a four-season New England mountain whose winter side balances groomed family skiing with moguls, glades and natural-snow terrain.'),
  entry('Q3320514','Bosques de Monterreal','https://www.monterreal.com','Bosques de Monterreal offers an unusual small-scale downhill experience in Mexico, centered on a mountain resort rather than an extensive interconnected ski domain.'),
  entry('Q16953614','Brezovica Ski Resort','https://www.skijalistasrbije.rs/sr/o-centru-brezovica','Brezovica occupies broad, high mountain terrain in the Šar Mountains, with an alpine character that is more rugged than a compact learning hill.'),
  entry('Q63182631','Budoh Ski Resort','https://www.city.murakami.niigata.jp/asahi/budoh','Budoh is a community-scale Japanese ski area designed for approachable winter outings rather than the range of a large destination resort.'),
  entry('Q11304375','ÇA ET LÀ SKI RESORT OZE','http://www.caetla.cc/winter','Ça et Là Oze presents a compact Japanese mountain day with groomed skiing and a relaxed base-area experience.'),
  entry('Q17626264','Centro de ski Pucón','https://puconchile.travel/atractivos-de-pucon-y-alrededores/centro-de-ski','Pucón’s ski center puts riders on the slopes of Villarrica, making its volcanic setting and wide views a defining part of the experience.'),
  entry('Q60617666','Champ du Feu','https://www.lechampdufeu.com','Champ du Feu is a modest Vosges winter area where downhill slopes sit alongside a wider family-oriented snow offering.'),
  entry('Q259613','Dizin Ski Resort','http://dizinskiresort.ir','Dizin is a high-elevation Iranian mountain resort with a broad alpine setting and enough variety to feel like a full mountain destination.'),
  entry('Q3058117',"Cambre d'Aze",'https://www.turisme-pirineusorientals.cat/cambra-dase',"Cambre d'Aze uses a dramatic Pyrenean cirque as its backdrop, with village access leading toward steeper upper-mountain terrain."),
  entry('Q5472723','Fortress Mountain Resort','https://www.skifortress.com','Fortress is defined by its high, open Canadian Rockies setting and a less-developed mountain feel than conventional village-based resorts.'),
  entry('Q20044116','Grandeco Snow Resort','https://resort.en-hotel.com/grandeco/wp-content/themes/snow/EN_RESORT_Grandeco_Snow_Resort_EN.pdf','Grandeco combines long cruising with tree, powder, freestyle and family zones, giving the mountain several distinct ways to spend a day.',[
    ['base','Base elevation',1010,'m'],['skiing_elevation','Summit ski elevation',1590,'m'],['vertical','Vertical rise',580,'m'],['trails','Published courses',10],['lifts','Gondola and quad chairs',5],['longest_run','Longest run',4000,'m'],
  ],'Primary operator course-guide PDF; park count is not added to the course total.'),
  entry('Q60747943','Grands Montets','https://www.montblancnaturalresort.com/fr/domaine-skiable-grands-montets','Grands Montets is a high-alpine Chamonix sector known for sustained descents and a serious mountain environment rather than gentle resort-village cruising.'),
  entry('Q3118616','Gréolières 1400','https://www.stations-greolieres-audibergue.com','Gréolières 1400 is a compact southern-Alps station where clear-day views toward the Mediterranean give the slopes a distinctive setting.'),
  entry('Q11395944','Hakodate Nanae Snowpark','https://hakodate-nanae.jp','Hakodate Nanae pairs gondola access and broad Hokkaido scenery with a mix of cruising terrain and snow-play options.'),
  entry('Q5746087','Hesperus Ski Area','https://www.ski-hesperus.com','Hesperus offers a compact southwest Colorado hill with a strong local character and scheduled night skiing.'),
  entry('Q11665927','Hida Takayama Ski Resort','https://www.hidatakayama.or.jp/plan/takayama-ski','Hida Takayama is a local mountain area where simple lift-served slopes support an unhurried day close to the historic city.'),
  entry('Q11276694','Hiruzen Bear Valley Ski Resort','https://bear-ski.amebaownd.com','Hiruzen Bear Valley is a small regional area with accessible groomed terrain and a casual, family-friendly pace.'),
  entry('Q60986814','Hoppo Bunadaira Ski Area','https://shigakogen.co.jp/highlight/buna','Hoppo Bunadaira is a quieter Shiga Kogen sector whose woodland setting and connections matter more than stand-alone resort scale.'),
  entry('Q11285945','IOX-AROSA','https://iox-arosa.jp','IOX-Arosa combines open cruising, mountain views and night operations in a regional Japanese resort setting.'),
  entry('Q105109705','Ipponsugi Ski Resort','https://www.ipponsugi.net/index.html','Ipponsugi is an exceptionally compact learning hill where a snow conveyor and gentle pitch make first turns the central experience.'),
  entry('Q11604871','Itoigawa Seaside Valley','https://seasidevalley.com/gelande-test/','Itoigawa Seaside Valley mixes Sea of Japan views and gentle woodland skiing with short, steep ungroomed challenges.',[
    ['trails','Named ski courses',9],['longest_run','Longest linked descent',3000,'m','Links upper and lower named course sections.'],
  ]),
  entry('Q11475057','Iwatekogen Snowpark','https://iwatekogen.jp/gelande/','Iwate Kogen combines a gondola-served long descent with family terrain, moguls, powder sections and park features.',[
    ['trails','Listed ski courses',10],['lifts','Listed gondola and chairlifts',7],['longest_run','Advertised linked route',2600,'m','Operator English page describes the route as approximately 2.6 km.'],
  ]),
  entry('Q11590728','Kandatsu Snow Resort','https://www.kandatsu.com/course-guide/','Kandatsu combines broad learning terrain with steeper courses and several freestyle zones, giving improving riders clear room to progress.',[
    ['area','Published resort area',130,'ha'],['named_run_length','Linked Procyon–Pollux–Castor route',2500,'m','Combined named-course route, not a single piste.'],
  ]),
  entry('Q17990251','Karuizawa Snow Park','https://www.presidentresort.jp/snowpark','Karuizawa Snow Park centers on approachable family skiing, with snow-play areas and compact pistes alongside the resort base.'),
  entry('Q134287598','Kolasin Valleys','https://www.kolasinvalleys.com','Kolašin Valleys connects modern lift access with open Montenegrin mountain terrain and a growing destination-resort feel.'),
  entry('Q6431059','Kope-Ribniško Pohorje Ski Resort','http://www.ribnisko-pohorje.si/ribnisko-pohorje-pozimi','Kope and Ribniško Pohorje offer forested Slovenian slopes whose regional character is distinct from a single compact piste pod.'),
  entry('Q105320204','Kumanoyu Ski Area','https://www.kumanoyu.co.jp/lift','Kumanoyu is a snow-focused Shiga Kogen sector with a compact lift network and terrain aimed beyond absolute beginners.'),
  entry('Q11618170','Kusatsu Onsen Ski Resort','https://www.932-onsen.com/winter','Kusatsu combines lift-served mountain skiing with one of Japan’s best-known hot-spring towns, making the off-slope setting part of the trip.'),
  entry('Q3207395','La Chèvrerie','http://www.espacerocdenfer.com','La Chèvrerie provides a village gateway into the forested Roc d’Enfer area, favoring scenic linked skiing over a large built-up base.'),
  entry('Q4566905','La Covatilla','http://www.sierradebejar-lacovatilla.com','La Covatilla brings open, high plateau skiing to the Sierra de Béjar, with weather exposure shaping the day as much as resort infrastructure.'),
  entry('Q3919405','Lahojsk','http://www.logoisk.by','Lahojsk is a compact Belarusian winter center where groomed downhill runs form part of a broader recreation complex.'),
  entry('Q11189531','Lotte Arai Resort','https://www.lottehotel.com/arai-resort/ja.html','Lotte Arai pairs polished base facilities with deep-snow, freeride and groomed zones, while controlled gates keep its off-piste character clearly managed.'),
  entry('Q133279704','Mamison','https://mamison-resort.ru','Mamison is a newly developed Caucasus mountain destination with open high-country terrain and a modern lift-served layout.'),
  entry('Q11353792','Manba Ski Resort','https://www.manba-ski.jp','Manba is a regional Japanese ski area with a straightforward mix of groomed slopes for learners and returning skiers.'),
  entry('Q11538256','Masumizu Snow Park','https://www.masumizu.net/ski','Masumizu places compact skiing on the flank of Mount Daisen, with broad views and a relaxed local-mountain atmosphere.'),
  entry('Q11405084','Matsudai Family Ski Resort','https://ski.matsudai.jp','Matsudai Family is a small community hill focused on easy access, learning and uncomplicated winter laps.'),
  entry('Q11529039','Matsunoyama Onsen Ski Area','http://www.matsunoyama-ski.com','Matsunoyama pairs a local snow-country ski hill with nearby hot springs, creating an easygoing rural winter outing.'),
  entry('Q63178877','Mikawa Onsen Skiing Ground','https://www.town.aga.niigata.jp/kanko_rekishi/mikawa_onsenski','Mikawa Onsen is a town-operated area built around accessible slopes and a low-key regional experience.'),
  entry('Q3321591','Mont-Avalanche','https://mont-avalanche.com','Mont Avalanche is a compact Laurentian hill with forested runs and a community-oriented atmosphere.'),
  entry('Q3322642','Monterosa Ski','https://www.visitmonterosa.com','Monterosa Ski links several valleys beneath the Monte Rosa massif, favoring long journeys and high-alpine variety over a single-base layout.'),
  entry('Q6919595','Mount Baldy Ski Lifts','https://www.mtbaldy.com','Mount Baldy offers steep, rugged terrain close to Los Angeles, with a raw mountain character that differs sharply from a manicured destination resort.'),
  entry('Q6921185','Mount Hermon ski resort','https://skihermon.co.il','Mount Hermon provides Israel’s lift-served snow experience, with a short and highly weather-dependent season in an unusual regional setting.'),
  entry('Q6924518','Mount Waterman','http://www.mtwaterman.org','Mount Waterman is a small, steep southern California area known for natural terrain and a deliberately simple mountain setup.'),
  entry('Q6924971','Mountain High','https://www.mthigh.com','Mountain High combines day and night skiing across distinct southern California sectors, making quick-access laps central to its appeal.'),
  entry('Q3326431','Mouthe','https://espacesourcedudoubs.com/la-station','Mouthe offers small Jura downhill slopes within a broader winter landscape better known for snow-country recreation.'),
  entry('Q106322497','Mratkino Alpine Resort','https://mratkino.ski-rb.ru','Mratkino is a compact Urals ski center with groomed local terrain and a practical, training-friendly character.'),
  entry('Q97435601','Nakasato Kiyotsu Ski Resort','https://www.tokamachishikankou.jp/en/spot/nakasatokiyotsu_skiarea_en','Nakasato Kiyotsu is a small snow-country slope where simple local access and uncrowded practice are the main draw.'),
  entry('Q11381288','Nango Ski Area','https://www.nango-ski.com','Nango is especially associated with freestyle and mogul terrain, while still providing conventional pistes for a mixed mountain day.'),
  entry('Q872240','Niederalpl','https://www.niederalpl.at','Niederalpl is a small Styrian pass resort with a traditional, family-scale layout rather than a sprawling lift network.'),
  entry('Q11235669','NINOX SNOW PARK','https://www.ninox.co.jp/course/','Ninox combines a broad beginner slope, a steeper progression run, playful snow features and scheduled night skiing.',[
    ['base','Lower ski elevation',317,'m'],['skiing_elevation','Upper ski elevation',533,'m'],['vertical','Elevation difference',216,'m','Calculated from the operator-published upper and lower ski elevations.',{derivation:'533 m - 317 m'}],['longest_run','Longest ski distance',1200,'m'],['trails','Named main courses',2,'','Excludes small learning features and the terrain park.'],['lifts','Chairlifts',2],
  ]),
  entry('Q11386108','Nomugitōge Ski Resort','http://gakutoresort.jp','Nomugitōge offers sustained groomed descents in a quieter mountain setting, appealing to skiers who value laps over resort-village activity.'),
  entry('Q11325790','Norn Minakami Ski Resort','https://www.norn.co.jp/winter/gerande/','Norn Minakami puts five clearly differentiated courses into a compact layout, from learning terrain to its harder A course and evening skiing.',[
    ['trails','Lettered courses',5],['longest_run','Linked C-to-D route',2000,'m','Combined course route, not a single piste.'],
  ]),
  entry('Q11274910','Nukabira Onsen Ski Area','http://ski.nukabirakan.com','Nukabira Onsen is a quiet Hokkaido slope where uncrowded skiing and the surrounding hot-spring area shape the experience.'),
  entry('Q1352200','Oddsskarð','https://www.oddsskard.is','Oddsskarð brings lift-served skiing to Iceland’s Eastfjords, with maritime weather and fjord scenery defining its compact mountain day.'),
  entry('Q11445638','Okutadami Maruyama Ski Resort','http://okutadami.co.jp/ski','Okutadami Maruyama is known for a later-running snow season and a remote mountain approach, giving spring skiing a central role.'),
  entry('Q11437984','Omachi Aki Area','http://omachi-ski.yumedia.jp','Omachi’s local ski area offers a modest, community-focused slope experience beneath the Northern Alps.'),
  entry('Q3090623','Oukaïmeden','https://oukaimeden.org','Oukaïmeden offers lift-served skiing in Morocco’s High Atlas, where altitude, stark mountain scenery and simple infrastructure create a singular experience.'),
  entry('Q12886106','Pelion Ski Center','http://www.pelionski.gr','Pelion combines forested Greek slopes with views influenced by its peninsula setting, producing a character unlike open high-alpine resorts.'),
  entry('Q11415366','Piyashiri Nayoro Snow Park','http://www.city.nayoro.lg.jp/section/sportscamp/vdh2d10000008h2b.html','Piyashiri serves northern Hokkaido with a community-scale mountain and a strong cold-snow setting.'),
  entry('Q60910475','Planche des Belles Filles','https://planchedesbellesfilles.fr','Planche des Belles Filles is a small Vosges winter station whose downhill slopes share the mountain with other seasonal recreation.'),
  entry('Q3112563','Popova Šapka','https://popovashapka.com.mk','Popova Šapka sits high in the Šar Mountains, combining open alpine terrain with a long-established Balkan ski-center character.'),
  entry('Q1651385','Prat Peyrot','http://www.pratpeyrot.fr','Prat Peyrot is a compact Cévennes ski area where exposed mountain weather and a mixed winter offering define the day.'),
  entry('Q1086218','Puy-Saint-Vincent','https://www.puysaintvincent.com','Puy-Saint-Vincent combines forested lower runs with higher open terrain, giving families and stronger skiers distinct parts of the mountain to explore.'),
  entry('Q10404626','Ålébacken','http://www.alebacken.nu','Ålébacken is a small Swedish community hill designed for short local sessions rather than destination-scale exploration.'),
  entry('Q10670117','Ski Sunne','https://skisunne.se','Ski Sunne offers a compact Swedish slope network with a practical family and progression focus.'),
  entry('Q110410864','Saint-Hilaire-du-Touvet','https://www.station-ski-saint-hilaire.fr','Saint-Hilaire is a small Chartreuse station where local slopes and broad valley views create an intimate mountain setting.'),
  entry('Q110914605','Lac Blanc','https://www.lac-blanc.com','Lac Blanc combines Vosges downhill pistes with a much wider winter-sports area, so its appeal extends beyond alpine runs alone.'),
  entry('Q11276913','Pippu Ski Area','https://www.town.pippu.hokkaido.jp/ski/top.html','Pippu is a regional Hokkaido mountain with a balanced local offering and a straightforward, uncrowded feel.'),
  entry('Q11280604','Yawata Highland 191 Resort','https://yawata191.com','Yawata Highland 191 is a compact western-Japan snow area with groomed cruising and a family-friendly regional atmosphere.'),
  entry('Q11281684','Wakabuna Kogen','http://wakabuna.com','Wakabuna Kogen offers a low-key Niigata mountain day with groomed slopes and an approachable local-resort pace.'),
  entry('Q11312027','Hida Nagareha','https://hida-nagareha.com','Hida Nagareha combines forested skiing and Northern Alps scenery in a quieter regional setting.'),
  entry('Q11363807','Ina Ski Resort','https://inaski.com','Ina is a compact Nagano ski area whose manageable layout suits practice and family outings.'),
  entry('Q11375166','Hirogawara Ski Area','http://www.hirogawara.com/gelande.html','Hirogawara is a small community slope where a simple lift-served layout keeps the focus on uncomplicated snow time.'),
  entry('Q11382598','Saku Ski Garden Parada','https://www.saku-parada.jp','Saku Parada is designed around convenient family access, sunny groomed slopes and learning-friendly facilities.'),
  entry('Q11397900','Ichiu Ski Area','http://www.ichiu.jp','Ichiu is a compact Shikoku snow area offering local lift-served skiing in a region with a short, conditions-dependent season.'),
  entry('Q11401369','Kita-Taisetsu','https://suzukishokai.jp/distinations/ski-kitataisetsu','Kita-Taisetsu offers a remote-feeling Hokkaido mountain setting where natural snow and quiet slopes are central to the appeal.'),
  entry('Q11449257','Unazuki Snow Park','https://www.unazuki-snowpark.com','Unazuki Snow Park is a small Toyama slope that pairs local skiing with access to the wider hot-spring destination.'),
  entry('Q114603149','Nasu Onsen Family Ski Resort','https://familyskiresort-nasu.com','Nasu Onsen Family centers on gentle, manageable slopes and a welcoming first-timer experience.'),
  entry('Q11554426','Jibuzaka Kogen','https://jibuzaka.co.jp','Jibuzaka Kogen is a quiet Nagano-area hill with forested runs and a traditional regional-skiing atmosphere.'),
  entry('Q115625471','Station du Granier','https://www.stationdugranier.com/home','Granier is a very small Chartreuse station where learning, sledding and a community snow day matter more than vertical scale.'),
  entry('Q11587268','Ishizuchi Ski Area','https://www.ishizuchi.com/ski','Ishizuchi provides lift-served skiing high on Shikoku’s most prominent mountain, with its setting and access journey central to the experience.'),
  entry('Q11621934','Zao Liza World','http://www.zaoliza.co.jp','Zao Liza World combines highland cruising and broad views with a quieter identity than the larger neighboring Zao Onsen network.'),
  entry('Q11641710','Dogo Yama Kogen','https://www.dogoyamakogen.com','Dogo Yama Kogen is a compact western-Japan mountain offering straightforward groomed skiing in a regional setting.'),
  entry('Q11652043','Shiei Ski Area','http://www.shiei-ski.com','Shiei is a small local ski hill whose modest lift-served layout is aimed at accessible winter recreation.'),
  entry('Q116957612','Tochio Family Ski Area','https://www.tochio.jp/ski/winter.html','Tochio Family is a community learning hill focused on gentle slopes, children and uncomplicated practice.'),
  entry('Q123335896','Ski Areál Alšovka','https://alsovka.cz','Alšovka is a compact Czech ski area built for local laps, lessons and short winter outings.'),
  entry('Q123411712','Kyukamura Iwate-Amihari','https://www.qkamura.or.jp/iwate/ski','Amihari combines wooded slopes and volcanic-mountain scenery with the relaxed character of a national-park resort.'),
  entry('Q123745553','Kanita Ski Area','https://www.town.sotogahama.lg.jp/bunka/sports/kanitaski.html','Kanita is a town-operated northern-Japan hill offering a simple, community-first ski experience.'),
  entry('Q135405058','Sommet Gabriel','https://www.sommets.com/en/discover-les-sommets/sommet-gabriel','Sommet Gabriel is a compact Laurentian mountain whose approachable runs and local atmosphere suit shorter ski days.'),
  entry('Q137052884','Chaillol 1600','https://www.mairie-chaillol.fr/a-decouvrir/la-station-village-chaillol-1600','Chaillol 1600 is a sunny southern-Alps village station with a family scale and open views across the Champsaur.'),
  entry('Q138937388','HEIpark Tošovice','https://www.heipark.cz','HEIpark is a compact Czech activity area whose winter slopes are built around accessible local recreation.'),
  entry('Q139681591','Okhta Park','https://www.ohtapark.ru','Okhta Park is a polished recreation complex near Saint Petersburg where short downhill slopes support convenient local sessions.'),
  entry('Q139998049','Centre de ski Saint-Georges','https://ski.saint-georges.ca','Saint-Georges is a municipal Quebec hill with a community-centered layout and accessible local skiing.'),
  entry('Q17218407','Megahira Ski Resort','http://www.megahira.co.jp/pc/ski.html','Megahira offers western Japan a compact resort day with groomed slopes, night operations and base facilities close at hand.'),
  entry('Q17767103','Drammen Skisenter','https://drammen.skimore.no','Drammen Skisenter is a city-adjacent Norwegian hill where evening laps and convenient access are a major part of the experience.'),
  entry('Q17989535','Ooana Ski Resort','http://ooana-ski.com','Ooana is a modest regional Japanese slope designed for relaxed local skiing rather than a multi-day resort circuit.'),
]

export function applyOfficialBatch012(records){
  const byId=new Map(records.map(r=>[r.stable_id,r]))
  for(const e of officialBatch){
    const record=byId.get(e.id)
    if(record&&/^Q\d+$/.test(record.name)){
      record.name=e.name
      record.normalized_name=normalizeName(e.name)
      record.field_provenance.name={value:e.name,source_record_ids:e.summary_sources,confidence:'medium',reviewed_at:checked,note:'Official-name replacement for an unresolved Wikidata identifier label; identity and stable ID are unchanged.'}
    }
  }
  const report=applyOfficialBatch(records,{entries:officialBatch,batch:'official-012',checkedAt:checked})
  report.summary_only_profiles=officialBatch.filter(e=>!e.observations.some(o=>o.status==='source_checked')).map(e=>e.id)
  report.profiles.forEach(p=>{p.sources=[...new Set([...p.sources,...officialBatch.find(e=>e.id===p.id).summary_sources])]})
  return report
}
