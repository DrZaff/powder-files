import { applyOfficialBatch } from './official-batch-001.mjs'
import { normalizeName } from './lib/normalize.mjs'

export const checked='2026-10-03'
const entry=(id,name,summary)=>({id:`wikidata:item:${id}`,name,summary,summary_sources:[`https://www.wikidata.org/wiki/${id}`],summary_reviewed_at:checked,notes:'Structured-source overview and label repair only; official mountain dimensions remain unverified.',observations:[]})

// Wikidata label repairs and conservative geographic/editorial summaries.
// No current-operation claim or numerical mountain fact is inferred here.
export const officialBatch=[
  entry('Q106211384','Göllerlifte','Göllerlifte is a small Lower Austrian ski area whose local slopes sit between the Traisen and Salza valleys.'),
  entry('Q107337059','Aprica–Corteno ski area','Aprica–Corteno is a developed Italian mountain network with several lift sectors extending across the pass and surrounding slopes.'),
  entry('Q109043479','Romme','Romme is a small French Alps village station above Nancy-sur-Cluses with family-scale slopes and an understated local atmosphere.'),
  entry('Q109568602','Lermoos–Grubigstein','Lermoos–Grubigstein is a Tyrolean Zugspitz Arena sector with broad mountain views and varied slopes above the village.'),
  entry('Q109594461','Nikkō Yumoto Onsen Ski Area','Nikkō Yumoto Onsen is a compact Japanese ski area pairing approachable slopes with a traditional hot-spring mountain setting.'),
  entry('Q110654002','Yokoteyama–Shibutoge Ski Area','Yokoteyama–Shibutoge is a high Japanese mountain area with exposed upper slopes and links across the Shiga Kogen region.'),
  entry('Q11257215','Asahi Prime Ski Area','Asahi Prime is a regional Nagano ski area with straightforward groomed terrain and a quiet day-hill character.'),
  entry('Q11264223','Kamoi-dake International Ski Area','Kamoi-dake is a Hokkaido ski area with a community-oriented base and terrain serving both recreation and training.'),
  entry('Q11276018','Banshū Tokura Snow Park','Banshū Tokura is a Hyōgo mountain snow park with a compact lift layout and an accessible regional-resort feel.'),
  entry('Q11283197','Takamine Mountain Park','Takamine Mountain Park is a high Nagano ski area, formerly known as Asama 2000, with open slopes and a mountain-focused atmosphere.'),
  entry('Q11288382','Winghills Shirotori Resort','Winghills Shirotori is a Gujo mountain resort with gondola access, developed groomed terrain and a broad regional appeal.'),
  entry('Q11294773','Kamui Misaka Ski Area','Kamui Misaka is a compact Yamanashi ski area oriented toward accessible day trips, instruction and groomed local laps.'),
  entry('Q11295184','Karurusu Onsen Sanlaiva Ski Area','Sanlaiva is a Hokkaido ski area near Karurusu Onsen, combining regional slopes with a traditional hot-spring setting.'),
  entry('Q11307698','Chateraise Ski Resort Yatsugatake','Chateraise Yatsugatake is a family-oriented Nagano ski area with groomed terrain and convenient regional access.'),
  entry('Q11312863','Spring Valley Sendai Izumi','Spring Valley Sendai Izumi is an urban-accessible Miyagi ski area serving day visitors, learners and evening sessions.'),
  entry('Q11316833','Dynasty Ski Resort','Dynasty is a compact Hokkaido ski area near Kitahiroshima with a practical local layout and easy city access.'),
  entry('Q11338116','White Pia Takasu','White Pia Takasu is a developed Gujo snow resort with broad groomed slopes and connections within a larger regional ski cluster.'),
  entry('Q11348002','Listel Ski Fantasia','Listel Ski Fantasia is a Fukushima resort hill pairing compact downhill terrain with a broader hotel-based winter destination.'),
  entry('Q11370462','Kuju Forest Park Skiing Ground','Kuju Forest Park is a rare Kyushu ski area with developed snow terrain in a scenic volcanic mountain region.'),
  entry('Q11371973','Gokase Highland Ski Area','Gokase Highland is a high Kyushu ski area whose southern location and expansive mountain views make it regionally distinctive.'),
  entry('Q11376977','Imajo 365 Ski Area','Imajo 365 is a Fukui mountain ski area with a developed base and a regional day-resort character.'),
  entry('Q11381286','Aizu Kogen Daikura Ski Area','Daikura is an Aizu Kogen ski area with varied groomed slopes and a quieter regional mountain atmosphere.'),
  entry('Q11381290','Aizu Kogen Takahata Ski Area','Takahata is an Aizu Kogen ski area known for a skier-focused mountain layout and a low-key local setting.'),
  entry('Q11431454','Yumenotaira Ski Area','Yumenotaira is a compact Japanese ski area with gentle regional terrain suited to family outings and repeat local laps.'),
  entry('Q11432420','Okuradake Kogen Ski Area','Okuradake Kogen is an Ishikawa ski area with forested regional slopes and a community mountain character.'),
  entry('Q11434604','Daisen Kokusai Ski Area','Daisen Kokusai is a mountain sector on Mount Daisen with scenic regional terrain and links within the broader snow area.'),
  entry('Q11443387','Tendō Kogen Ski Area','Tendō Kogen is a small Yamagata highland ski area focused on accessible family terrain and community winter use.'),
  entry('Q11488868','Gozaisho Ski Area','Gozaisho is a compact ropeway-accessed ski area with dramatic mountain views above the hot-spring town of Yunoyama.'),
  entry('Q11516048','Gassan Ski Area','Gassan is a high Yamagata ski area with an unusually late-season identity and an open, snow-heavy mountain setting.'),
  entry('Q115204155','Le Pleynet','Le Pleynet is a Belledonne mountain base within Les Sept Laux, offering direct access to a larger linked ski area.'),
  entry('Q115204177','Prapoutel','Prapoutel is a principal Les Sept Laux base with slopeside facilities and access across the Belledonne ski network.'),
  entry('Q115204199','Pipay','Pipay is a quieter access sector for Les Sept Laux, emphasizing direct mountain access over a large resort village.'),
  entry('Q11571937','Inawashiro Ski Area','Inawashiro is a substantial Fukushima ski area with broad slopes and views toward Lake Inawashiro.'),
  entry('Q11596318','Wakkanai City Park Ski Area','Wakkanai City Park is a small northern Hokkaido ski hill serving local recreation in an unusually coastal setting.'),
  entry('Q11603148','Minowa Ski Area','Minowa is a high Fukushima ski area with groomed mountain terrain and a developed slopeside resort base.'),
  entry('Q11603412','Hakodateyama Ski Area','Hakodateyama is a Shiga ski area above Lake Biwa, combining gondola access with broad lake and mountain views.'),
  entry('Q11611167','Hijiri Kogen Ski Area','Hijiri Kogen is a compact Nagano highland ski area with family terrain and a quiet local atmosphere.'),
  entry('Q11615892','Geihoku Kokusai Ski Area','Geihoku Kokusai is a Hiroshima mountain ski area with multiple slope pods and a developed regional-resort layout.'),
  entry('Q11618020','Chausuyama Kogen Ski Area','Chausuyama Kogen is Aichi’s principal ski area, offering modest highland slopes for regional day trips.'),
  entry('Q11676214','Washigatake Ski Area','Washigatake is a developed Gujo snow resort with broad groomed slopes and a lively regional destination feel.'),
  entry('Q11678011','Kurobushi Kogen Snow Park Jangle Jungle','Jangle Jungle is a Yamagata snow park with developed groomed terrain in the Kurobushi highlands.'),
  entry('Q11689619','Słotwiny Arena','Słotwiny Arena is a developed ski and bike area at Krynica-Zdrój with groomed regional slopes and modern visitor facilities.'),
  entry('Q116927086','Sveitsi Ski Centre','Sveitsi is a compact Finnish ski centre at Hyvinkää, designed for lessons, local laps and convenient southern access.'),
  entry('Q117026624','Tengu Kogen Ski Area','Tengu Kogen is a high Shikoku ski area with open plateau scenery and a distinctive southern-Japan setting.'),
  entry('Q117309106','Kokonniemi Ski Centre','Kokonniemi is a compact Finnish ski area at Porvoo, serving local families, instruction and evening recreation.'),
  entry('Q11741059','Baba Ski Area','Baba is a Polish Beskid ski area near Korbielów with modest regional slopes and a local mountain atmosphere.'),
  entry('Q11741958','Beskid Spytkowice','Beskid Spytkowice is a compact Polish ski complex with groomed family terrain and an accessible day-area format.'),
  entry('Q11741969','Kopa Ski Complex','Kopa is a Karpacz ski area on the slopes of Śnieżka, providing lift access into a larger mountain recreation setting.'),
  entry('Q11741970','Słotwiny Ski Complex','Słotwiny is one of Krynica-Zdrój’s ski sectors, with groomed local slopes and convenient resort-town access.'),
  entry('Q11741978','Zagroń Istebna','Zagroń is a family-oriented Beskid ski area at Istebna with a compact slope network and developed base facilities.'),
  entry('Q11801622','COS Szczyrk Ski Area','The COS ski area at Szczyrk is a major Polish training and recreation mountain with several lift-served sectors.'),
  entry('Q11801623','Czorsztyn-Ski','Czorsztyn-Ski is a compact Polish mountain area at Kluszkowce with groomed slopes and scenic lake-country views.'),
  entry('Q11801625','Kotelnica Białczańska','Kotelnica Białczańska is a large, developed Polish ski area with broad family terrain and extensive resort-town facilities.'),
  entry('Q11801626','Koziniec Ski Area','Koziniec is a compact ski area at Czarna Góra with approachable groomed terrain and a family-day focus.'),
  entry('Q11801628','Pilsko Ski Area','Pilsko is a prominent Beskid mountain ski area above Korbielów, with higher terrain and a traditional sporting character.'),
  entry('Q11801629','Stożek Ski Area','Stożek is a forested Beskid ski area above Wisła with a compact lift network and a more traditional mountain feel.'),
  entry('Q11801630','Złoty Groń','Złoty Groń is a developed Istebna ski area with groomed family slopes and convenient village access.'),
  entry('Q11801631','Harenda Ski and Recreation Centre','Harenda is a Zakopane ski area with town access, a sporting slope profile and broad views toward the Tatras.'),
  entry('Q11801632','Ryterski Raj','Ryterski Raj is a regional Polish ski area at Rytro with forested slopes and a compact resort base.'),
  entry('Q11801642','Góra Dzikowiec','Góra Dzikowiec is a Lower Silesian recreation area with lift-served skiing and a regional mountain setting.'),
  entry('Q11801660','Mosorny Groń','Mosorny Groń is a Beskid ski area above Zawoja with a substantial forested descent and views toward Babia Góra.'),
  entry('Q11836145','Dwie Doliny Muszyna–Wierchomla','Dwie Doliny is a Polish mountain area linking access from Wierchomla with a broader valley-resort identity.'),
  entry('Q11836147','Zwardoń Ski','Zwardoń Ski is a compact Beskid area near the Slovak border with local groomed slopes and village access.'),
  entry('Q11899386','Ukkohalla','Ukkohalla is a Finnish resort with compact fell skiing, a developed base and a broad year-round recreation identity.'),
  entry('Q11903330','Öjberget','Öjberget is a compact ski centre near Vaasa, supporting local downhill recreation in Finland’s low-relief coastal region.'),
  entry('Q120271895','Saint-Urcize ski station','Saint-Urcize is a small Cantal ski station with gentle volcanic-upland terrain and a community winter focus.'),
  entry('Q120300688','Col de Romeyère','Col de Romeyère is a small Vercors mountain station with local slopes around a forested pass setting.'),
  entry('Q120301313','Villard-de-Lans ski area','Villard-de-Lans is a major Vercors resort area combining village access, forested slopes and broad plateau scenery.'),
  entry('Q120307937','Aillons-Margériaz 1000','Aillons-Margériaz 1000 is the lower village-oriented sector of the Bauges ski area, with approachable local terrain.'),
  entry('Q120311055','Ancelle ski area','Ancelle is a sunny Champsaur ski area with family slopes, village access and a relaxed southern-Alps character.'),
  entry('Q120312263','Chabanon','Chabanon is a compact southern-Alps resort with a slopeside base, forested terrain and a regional destination feel.'),
  entry('Q120313858','Valloire ski area','Valloire is a traditional Maurienne village resort with varied alpine terrain and links toward neighboring Valmeinier.'),
  entry('Q120314315','Valmeinier ski area','Valmeinier is a Maurienne resort with village and slopeside bases connected into the wider Galibier-Thabor domain.'),
  entry('Q120315748','Praz-sur-Arly ski area','Praz-sur-Arly is a Val d’Arly village area with gentle local slopes and links into the broader Espace Diamant network.'),
  entry('Q120316574','Serre Chevalier Briançon','Serre Chevalier Briançon is the city-facing gateway to a large valley network of wooded and high-alpine slopes.'),
  entry('Q120317019','La Plagne Montalbert','Montalbert is a wooded village sector of La Plagne, offering a quieter base with links into the wider Paradiski network.'),
  entry('Q120317190','Vars ski area','Vars is a southern-Alps resort with high open bowls, village sectors and links across the Forêt Blanche domain.'),
  entry('Q120317746','Arvieux ski area','Arvieux is a small Queyras ski area with village-based lifts, forested terrain and an understated regional atmosphere.'),
  entry('Q120322081','La Colmiane','La Colmiane is a developed southern-Alps ski area above Valdeblore with family terrain and a compact resort base.'),
  entry('Q121028976','Les Estables','Les Estables is a small Mézenc plateau ski area where exposed volcanic uplands and natural conditions shape the experience.'),
  entry('Q1235777','Dollwiese','Dollwiese is a small urban ski slope in Vienna, suited to learning and local winter recreation rather than mountain touring.'),
  entry('Q125536760','Koralpe ski area','Koralpe is a Carinthian mountain ski area with open high slopes and wide views from the eastern Alps.'),
  entry('Q1257970','Dreiländereck','Dreiländereck is a Carinthian ski area near Austria’s borders with Italy and Slovenia, with forested regional terrain.'),
  entry('Q131225550','Le Fornet','Le Fornet is a traditional Val-d’Isère hamlet and lift base providing access toward the valley’s high eastern terrain.'),
  entry('Q132154380','Utopia Saioto','Utopia Saioto is a regional Hiroshima ski area with developed snow terrain and a practical day-resort character.'),
  entry('Q135735087','Bisanne 1500','Bisanne 1500 is a slopeside base within Les Saisies, offering direct access to Espace Diamant terrain and broad alpine views.'),
  entry('Q13575553','Ehrwalder Alm','Ehrwalder Alm is a Tyrolean Zugspitz Arena sector with a broad high plateau and family-oriented mountain terrain.'),
  entry('Q1369763','Battenhausen ski area','Battenhausen is a small Hessian ski area whose local slope and natural-snow character serve nearby winter recreation.'),
  entry('Q136996316','Corrençon-en-Vercors ski area','Corrençon is a village gateway into the Villard-de-Lans ski area, with forested local slopes and Vercors scenery.'),
  entry('Q137031272','Chamonix-Mont-Blanc ski area','Chamonix-Mont-Blanc is a valley destination made up of distinct mountain sectors rather than one continuously linked piste network.'),
  entry('Q137032227','Vallorcine ski area','Vallorcine is a quiet Chamonix-valley base linked into the Balme sector, with scenic terrain near the Swiss border.'),
  entry('Q137032555','Argentière ski area','Argentière is the village base for the Grands Montets sector, known for a more serious high-mountain character.'),
  entry('Q137033123','Les Houches ski area','Les Houches is a self-contained Chamonix-valley area with extensive forested slopes and a traditional village base.'),
  entry('Q137033817','Les Gets ski area','Les Gets is a traditional village resort with family terrain and broad connections into the Portes du Soleil network.'),
  entry('Q137033880','Morzine ski area','Morzine is a lively valley resort with wooded local slopes and connections toward the wider Portes du Soleil domain.'),
  entry('Q137033974','Gérardmer ski area','Gérardmer is a Vosges ski area above the lakeside town, with forested regional slopes and a developed local base.'),
  entry('Q137034331','Bonneval-sur-Arc ski area','Bonneval-sur-Arc is a high Maurienne village area with dramatic alpine scenery and a quieter traditional resort character.'),
  entry('Q137034444','Pralognan-la-Vanoise ski area','Pralognan-la-Vanoise is an intimate Vanoise village resort with scenic mountain terrain and a strong alpine identity.'),
  entry('Q137034696','Lans-en-Vercors ski area','Lans-en-Vercors is a family-oriented plateau ski area with local slopes spread across a scenic Vercors setting.'),
  entry('Q137035712','Autrans-Méaudre ski area','Autrans-Méaudre combines modest downhill sectors with a wider Vercors winter-sports destination and village atmosphere.'),
]

export function applyOfficialBatch016(records){
  const byId=new Map(records.map(r=>[r.stable_id,r]))
  for(const e of officialBatch){
    const record=byId.get(e.id)
    if(record&&/^Q\d+$/.test(record.name)){
      record.name=e.name
      record.normalized_name=normalizeName(e.name)
      record.field_provenance.name={value:e.name,source_record_ids:e.summary_sources,confidence:'medium',reviewed_at:checked,note:'Wikidata label repair; identity and stable ID are unchanged.'}
    }
  }
  const report=applyOfficialBatch(records,{entries:officialBatch,batch:'official-016',checkedAt:checked})
  report.summary_only_profiles=officialBatch.map(e=>e.id)
  report.profiles.forEach(p=>{p.sources=[...new Set([...p.sources,...officialBatch.find(e=>e.id===p.id).summary_sources])]})
  return report
}
