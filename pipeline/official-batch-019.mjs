import { applyOfficialBatch } from './official-batch-001.mjs'
import { normalizeName } from './lib/normalize.mjs'

export const checked='2026-10-03'
const source=id=>id.startsWith('openstreetmap:')?`https://www.openstreetmap.org/${id.split(':').slice(1).join('/')}`:`https://www.wikidata.org/wiki/${id.split(':').at(-1)}`
const entry=(id,name,summary)=>({id:id.includes(':')?id:`wikidata:item:${id}`,name,summary,summary_sources:[source(id.includes(':')?id:`wikidata:item:${id}`)],summary_reviewed_at:checked,notes:'Structured-source overview; official mountain dimensions and current operation remain unverified.',observations:[]})

export const officialBatch=[
  entry('Q105823074','Birkebeinerbakken Ski Centre','Birkebeinerbakken is a compact Norwegian ski centre near Lillehammer, focused on local training and accessible groomed slopes.'),
  entry('Q10703774','Trillevallen','Trillevallen is a Swedish mountain resort with a quieter family character and lift-served terrain near the Åre region.'),
  entry('Q109366617','Bodaira Ski Area','Bodaira is a compact Japanese ski area in the Zao highlands with regional terrain and a low-key mountain setting.'),
  entry('Q110082821','Les Rafforts','Les Rafforts is a small Val d’Arly village sector with lift access toward the broader Espace Diamant network.'),
  entry('Q113457486','Tignes le Lac','Tignes le Lac is a central high-altitude resort base with immediate access to the linked Tignes–Val d’Isère terrain.'),
  entry('Q113457498','Les Boisses','Les Boisses is a traditional Tignes village sector with slopeside access and links into the high mountain network.'),
  entry('Q120314388','La Blanche ski area','La Blanche is a small southern-Alps ski area in the Vallouise-Pelvoux setting, with scenic regional slopes.'),
  entry('Q125018983','La Mogorrita ski centre','La Mogorrita is a small Spanish mountain ski centre in Cuenca, offering modest regional snow terrain.'),
  entry('Q135659188','Le Cernix','Le Cernix is a village sector of the Espace Diamant area with local slope access in the Val d’Arly.'),
  entry('Q137033597','Servoz ski area','Servoz is a small Chamonix-valley winter area whose limited local slopes sit beneath a dramatic alpine backdrop.'),
  entry('Q137033754','Bourg-Saint-Maurice ski access','Bourg-Saint-Maurice is a valley gateway whose mountain transport connects town services with the Les Arcs network.'),
  entry('Q137039275','Baqueira Beret ski area','Baqueira Beret is a large Val d’Aran resort with several distinct mountain sectors and broad Pyrenean terrain.'),
  entry('Q137048778','La Plagne Vallée','La Plagne Vallée groups the lower valley communities and their access points into the wider La Plagne destination.'),
  entry('Q139546325','Nižepole Ski Centre','Nižepole is a North Macedonian ski centre on Baba Mountain with a regional sporting and training character.'),
  entry('Q16268675','Prato Spilla','Prato Spilla is a compact northern Apennine ski area with forested slopes and a quiet regional mountain base.'),
  entry('Q16426570','Böggvisstaðafjall Ski Area','Böggvisstaðafjall is an Icelandic community ski area above Dalvík with open slopes in a striking fjord setting.'),
  entry('Q17151380','Zadní Telnice','Zadní Telnice is a Czech Ore Mountains ski centre with several local slopes and a traditional regional character.'),
  entry('Q20553662','Vassfjellet Winter Park','Vassfjellet is a developed ski area near Trondheim, offering convenient regional access and varied groomed terrain.'),
  entry('Q2457966','Tschindirtschero','Tschindirtschero is a mountain ski resort identity in Dagestan with lift-served terrain in a remote Caucasus setting.'),
  entry('Q26253351','Soliabacken','Soliabacken is a small Swedish ski hill near Norsjö, serving community recreation and local training.'),
  entry('Q4009699','Ventasso Laghi','Ventasso Laghi is a northern Apennine mountain area with compact ski terrain in a scenic lake-and-forest setting.'),
  entry('Q4112594','Vitsi Ski Centre','Vitsi is a Greek mountain ski centre near Kastoria with open regional slopes and a quiet highland atmosphere.'),
  entry('Q55031346','Högfjället','Högfjället is a Sälen mountain sector with family terrain and direct access to a larger Swedish resort network.'),
  entry('Q5764625','Chapa Verde','Chapa Verde is a Chilean Andes ski centre above the central valley, offering regional lift-served mountain terrain.'),
  entry('Q5847609','Valle del Sol ski area','Valle del Sol is a small Spanish mountain ski area in the Sierra de la Demanda with local winter terrain.'),
  entry('Q5969371','Lagunillas','Lagunillas is a Chilean Andes ski centre near Santiago with a community-oriented base and open mountain slopes.'),
  entry('Q60969280','Byråsen','Byråsen is a small Swedish community ski hill designed for local lessons, training and short winter sessions.'),
  entry('Q62071735','Ivan-Gora','Ivan-Gora is a Russian regional ski base in Perm Krai with compact lift-served terrain and a local recreation focus.'),
  entry('Q87987454','Látky-Prašivá','Látky-Prašivá is a Slovak regional ski centre with forested local slopes and a quiet mountain setting.'),
  entry('openstreetmap:relation:3913810','Sarıkamış Cıbıltepe','Sarıkamış Cıbıltepe is a Turkish mountain resort known for forested slopes and a high inland snow climate.'),
  entry('Q2292227','Gaissau-Hintersee','Gaissau-Hintersee is a Salzburg-area mountain network with village access and varied forested regional terrain.'),
  entry('openstreetmap:way:1307012463','Skigebiet Mühlwiese','Mühlwiese is a compact German local ski slope near Osterode, focused on community winter recreation.'),
  entry('openstreetmap:way:1013523149','Sonnenlifte Röfleuten/Halden','Sonnenlifte Röfleuten/Halden is a small Allgäu ski area with family slopes and convenient village access.'),
  entry('Q14709259','Spout Springs Ski Area','Spout Springs is an Oregon mountain ski area with a compact, independent layout in the Blue Mountains.'),
]

export function applyOfficialBatch019(records){
  const byId=new Map(records.map(r=>[r.stable_id,r]))
  for(const e of officialBatch){const record=byId.get(e.id);if(record&&(/^Q\d+$/.test(record.name)||e.id.startsWith('openstreetmap:'))){record.name=e.name;record.normalized_name=normalizeName(e.name);record.field_provenance.name={value:e.name,source_record_ids:e.summary_sources,confidence:'medium',reviewed_at:checked,note:'Structured-source label repair; identity and stable ID are unchanged.'}}}
  const report=applyOfficialBatch(records,{entries:officialBatch,batch:'official-019',checkedAt:checked})
  report.summary_only_profiles=officialBatch.map(e=>e.id)
  report.profiles.forEach(p=>{p.sources=[...new Set([...p.sources,...officialBatch.find(e=>e.id===p.id).summary_sources])]})
  return report
}
