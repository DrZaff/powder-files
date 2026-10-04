import { officialBatch as batch003 } from './official-batch-003.mjs'
import { officialBatch as batch004 } from './official-batch-004.mjs'
import { officialBatch as batch005 } from './official-batch-005.mjs'
import { officialBatch as batch006 } from './official-batch-006.mjs'
import { officialBatch as batch007 } from './official-batch-007.mjs'
import { officialBatch as batch008 } from './official-batch-008.mjs'
import { officialBatch as batch009 } from './official-batch-009.mjs'
import { officialBatch as batch010 } from './official-batch-010.mjs'
import { officialBatch as batch011 } from './official-batch-011.mjs'
import { officialBatch as batch012 } from './official-batch-012.mjs'
import { officialBatch as batch013 } from './official-batch-013.mjs'
import { officialBatch as batch014 } from './official-batch-014.mjs'

// Original editorial interpretations of checked facts, not resort marketing copy.
// Evidence keys pin each backfilled summary to the observations that support it.
const backfill = [
  ['powderfiles:verified:bristol-mountain','Bristol pairs a 1,200-foot vertical with 39 slopes and trails and extensive night lighting. Full snowmaking coverage and evening skiing are central parts of its mountain offering.',['vertical','trails','snowmaking','lighting']],
  ['Q7620695','A substantial trail network and more than 2,000 feet of advertised vertical give Stowe room for a varied mountain day. Its highest skiing point sits below the mountain summit.',['trails','vertical','skiing_elevation','summit']],
  ['Q5038784','Five basins, including Soho, give Cardrona a broad mountain footprint. Its groomable-run network sits within a much larger terrain area, so the trail count alone does not describe the whole mountain.',['area','trails']],
  ['Q17507859','With 90 trails and seven lifts, 49 Degrees North offers a sizable network to explore. Its advertised vertical approaches 1,900 feet, though the published elevation arithmetic needs clarification.',['trails','lifts','vertical']],
  ['Q4690826','Afton Alps spreads 50 trails across 300 acres with an extensive lift network. Full snowmaking coverage is part of the offering; acreage here describes the ski area, not long alpine descents.',['area','trails','lifts','snowmaking']],
  ['Q2840279','Alta combines a large terrain footprint with more than 2,500 feet of vertical. It is a skiing-only mountain: snowboarders should choose a different destination.',['area','vertical']],
  ['Q9147336','Alyeska brings together 76 trails, seven lifts and a 2,500-foot vertical. The combination offers substantial downhill scale without the enormous trail count of a multi-mountain complex.',['trails','lifts','vertical']],
  ['Q4762160','Angel Fire packs 96 trails into 627 skiable acres, with more than 2,000 feet of vertical. That gives the mountain a substantial trail network within a relatively contained footprint.',['area','trails','vertical']],
  ['Q4779435','Apex combines 2,000 feet of vertical with over a thousand skiable acres. Its reported run count includes four terrain parks, so freestyle areas are part of that headline total.',['area','trails','vertical']],
  ['Q4784196','Arapahoe Basin pairs a high mountain summit with 1,428 skiable acres and 2,530 feet of advertised vertical. Expect mountain-scale terrain; summit altitude is not a lift-access guarantee.',['area','vertical','summit']],
  ['Q4791400','Arizona Snowbowl offers 61 runs on 777 acres. Its headline vertical includes hike-accessed terrain, an important distinction when planning a day based entirely on the lifts.',['area','trails','vertical']],
  ['Q4840857','Badger Pass is a smaller-scale mountain with ten runs, five lifts and 800 feet of vertical. Its compact network offers a different kind of day from a sprawling destination resort.',['trails','lifts','vertical']],
  ['Q2366796','Sunshine spans three mountains and more than 3,500 acres. Its appeal is the breadth of the mountain terrain, rather than the scale of a single compact trail pod.',['area']],
  ['Q4906372','Big Sky offers a vast mountain footprint, with 5,850 acres and hundreds of runs. Its scale suits a trip built around exploring different parts of the resort rather than repeating one small area.',['area','trails']],
  ['Q4929534','Blue Mountain combines 40 trails with more than a thousand feet of vertical on 171 acres. It brings a substantial drop to a relatively compact trail footprint.',['area','trails','vertical']],
  ['Q4978877','Brundage has 70 named trails and nearly 2,000 feet of vertical. Its lift-accessed acreage includes unpatrolled backcountry without avalanche mitigation, which should not be treated like maintained resort trails.',['area','trails','vertical']],
  ['Q5003005','Buttermilk offers 44 trails and just over 2,000 feet of vertical. Official acreage figures disagree, so the guide describes its trail-and-vertical scale without choosing a disputed terrain total.',['trails','vertical']],
  ['Q2935212','Camp Fortune combines 24 trails with 14 lit for night skiing. Evening laps are a substantial part of its offering, with seven lifts including learning-area carpets.',['trails','lit_trails','lifts']],
  ['Q5184571','Crested Butte has a dense network of 165 trails across 1,547 skiable acres. Its high-elevation setting is part of the mountain experience, with the base already above 9,000 feet.',['trails','area','base']],
  ['Q1624333','Crystal Mountain in Washington offers 2,300 lift-serviced acres and eleven lifts. Its broad mountain footprint is distinct from the smaller Michigan resort with the same name.',['area','lifts']],
  ['Q5270890','Diamond Peak pairs 30 runs with 1,840 feet of vertical. Its 655-acre footprint provides a contained mountain network, with a separate child ski-school lift beyond the general-access lifts.',['trails','vertical','area','lifts']],
  ['Q5586122','Gore brings more than 2,500 feet of advertised vertical to a 453-acre ski area. Its multiple base elevations matter: subtracting the main base from the summit does not describe the full resort drop.',['vertical','area','base']],
  ['Q5595130','Grand Targhee spreads 2,602 acres of winter terrain across a six-lift network. The large terrain area and 2,270-foot vertical give it a broad mountain footprint rather than a compact learning-hill scale.',['area','lifts','vertical']],
  ['Q6402050','Kicking Horse combines a 1,315-metre vertical with more than 120 runs. Its large drop and 3,486-acre terrain footprint are defining features of the mountain’s scale.',['area','vertical','trails']],
  ['Q13231225','Lake Louise offers 170 named runs and 1,700 hectares of skiable terrain. A vertical approaching a kilometre gives this extensive network substantial mountain depth as well as breadth.',['trails','area','vertical']],
  ['Q3224379','Le Massif pairs 53 published trails with a 770-metre vertical. Those figures suggest a mountain with substantial descents, while the source date remains visible rather than implying a live trail report.',['trails','vertical']],
  ['Q5569328','Glenshee’s published offering includes more than 40 kilometres of pisted runs. That is trail length, not acreage or a run count; other mountain dimensions still need official-source research.',['piste_length']],
  ['Q1026835','Val Thorens connects with Orelle in a 150-kilometre piste network reaching high-alpine skiing elevations. The figures describe that linked area, not the whole Three Valleys or Val Thorens alone.',['piste_length','skiing_elevation']],
  ['Q3021172','Deer Valley’s published 2025–26 configuration offers a large skiing-only terrain network and more than 3,000 feet of vertical. Announced expansion figures are not treated as already-open terrain.',['area','vertical']],
  ['Q5445102','Fernie offers more than 2,500 acres and over a kilometre of vertical. That mountain-scale footprint is clear even though official pages disagree on the exact number of trails.',['area','vertical']],
  ['Q6415898','Kirkwood combines 2,300 skiable acres with 86 trails and a high base elevation. Its terrain footprint is substantial, while conflicting summit measurements remain outside the headline facts.',['area','trails','base']],
  ['Q3326011','Mount Bachelor’s published 4,323 acres and 3,365-foot vertical describe a large mountain offering. Trail and lift totals still need separate official-source verification.',['area','vertical']],
  ['Q7059771','Northstar offers 100 trails across a 3,170-acre skiable footprint. Its twenty-lift network supports a substantial resort area; separately listed gate-accessed terrain is not added to the acreage.',['trails','area','lifts']],
  ['Q2182804','Palisades Tahoe’s headline acreage spans both Palisades and Alpine. Together they form a 6,000-acre mountain offering, so these combined figures should not be read as one mountain alone.',['area']],
  ['Q7304643','RED advertises a broad resort footprint with eight lifts. Its terrain offering also includes pay-per-run cat skiing, so the full acreage should not be mistaken for lift-only terrain.',['area','lifts']],
  ['Q2665933','Snowbasin combines 115 trails, thirteen lifts and 3,000 skiable acres. That gives it a large terrain footprint with an extensive marked-trail network to explore.',['trails','lifts','area']],
  ['Q7548669','Snowmass brings a large terrain footprint and a substantial advertised vertical to the Aspen Snowmass collection. These figures describe Snowmass itself, not the combined four-mountain resort.',['area','vertical']],
  ['Q7605410','Steamboat combines 184 trails with more than 3,600 feet of vertical. Its broad permitted terrain area is a measure of resort extent, not a claim that every acre is groomed piste.',['trails','vertical','area']],
  ['Q749825','Sun Peaks’ published 2026–27 plan spreads 4,400 acres across three mountains. It offers a multi-mountain layout, with skiing elevations kept separate from the higher summit outside the ski-area boundary.',['area','skiing_elevation']],
  ['Q7697675','Telluride’s historical official fact sheet describes substantial lift-served vertical and high-elevation skiing. These dimensions are labeled as a 2020 publication, not presented as a freshly verified current-season configuration.',['vertical','skiing_elevation']],
  ['Q3639823','Whitefish combines 110 named trails with 3,000 acres and more than 2,300 feet of vertical. Its scale offers a large mountain network rather than a small cluster of short runs.',['trails','area','vertical']],
  ['Q127037','Avoriaz’s own piste network is approximately 75 kilometres long. This guide keeps that local offering separate from the much larger Portes du Soleil network it connects with.',['piste_length']],
  ['Q5509476','Furano’s published course count spans both ski zones, with 839 metres of vertical. The two-zone scope matters when comparing its mountain offering with a single compact base area.',['trails','vertical']],
  ['Q11222992','Hakuba 47’s historical 2023–24 figures describe a substantial vertical and a long combined trail network. They offer a sense of mountain scale, with the older source period kept explicit.',['vertical']],
  ['Q11580457','Hakuba Cortina offers sixteen courses and a 530-metre vertical. That makes for a relatively contained course network, rather than a vast linked-area trail total.',['trails','vertical']],
  ['Q11580462','Hakuba Goryu is described through a linked ski-area offering. Course totals differ between official sources, so this guide keeps the connection clear without presenting a disputed trail count as settled.',['trails']],
  ['Q11580473','Hakuba Iwatake’s official source highlights its 1,289-metre summit recreation setting. Downhill dimensions still need further research; a scenic summit elevation alone does not establish the extent of ski terrain.',['summit']],
  ['Q61451059','Hotham’s published 2025 statistics distinguish lift-served terrain from the larger resort area. That distinction gives a more useful picture of the mountain than treating all advertised acreage as lift-accessed skiing.',['area','vertical']],
  ['Q11324352','Niseko Annupuri offers a thirteen-course network served by six lifts. These are the local area’s figures, keeping its own mountain footprint distinct from broader Niseko comparisons.',['trails','lifts']],
  ['Q23772767','Hanazono’s published twelve-course offering includes park terrain. It describes this part of Niseko, not a count of every run across the wider linked ski area.',['trails']],
  ['Q11324358','Grand Hirafu pairs 22 courses with 940 metres of vertical. Its substantial drop gives the local course network mountain depth without relying on combined Niseko-wide statistics.',['trails','vertical']],
  ['Q7382688','Rusutsu spreads its ski offering across three mountains, with 37 courses and a network of chairs and gondolas. Its multi-mountain layout is a central part of the experience.',['trails','chairlifts','gondolas']],
  ['Q7067399','Nozawa’s published 2024–25 figures combine 43 courses with more than a kilometre of vertical. A long-route option adds to the mountain’s scale, while the source season remains explicit.',['trails','vertical']],
]

export function applyResortSummaries(records) {
  const byId = new Map(records.map(r=>[r.stable_id,r]))
  const drafts = backfill.map(([id,text,keys])=>({id:id.includes(':')?id:`wikidata:item:${id}`,text,keys,reviewed_at:'2026-08-30'}))
  drafts.push(...[...batch003,...batch004,...batch005,...batch006,...batch007,...batch008,...batch009,...batch010,...batch011,...batch012,...batch013,...batch014].map(e=>({id:e.id,text:e.summary,sources:e.summary_sources,keys:[],reviewed_at:e.summary_reviewed_at||'2026-08-30'})))
  for (const draft of drafts) {
    const record=byId.get(draft.id)
    if (!record || !['medium','high'].includes(record.confidence)) throw new Error(`Summary outside public scope: ${draft.id}`)
    const evidence=draft.keys.map(key=>{
      const fact=record.mountain_observations?.find(f=>f.key===key)
      if(!fact) throw new Error(`Summary evidence missing: ${draft.id}/${key}`)
      return fact
    })
    const sources=[...new Set(draft.sources||evidence.flatMap(f=>[f.source,...(f.alternatives||[]).map(a=>a.source)]))]
    if(!draft.text || !sources.length) throw new Error(`Summary text/sources missing: ${draft.id}`)
    record.overview={text:draft.text,sources,reviewed_at:draft.reviewed_at,kind:'editorial_summary'}
    record.field_provenance.overview={...structuredClone(record.overview),evidence_keys:draft.keys,source_record_ids:sources,confidence:'medium',note:'Original Powder Files editorial interpretation of cited facts; not a visitor review or independent resort verification.'}
    for(const url of sources) if(!record.source_records.some(s=>s.url===url)) record.source_records.push({source:'official_resort',record_id:url,url,license:'factual-observations-only; page copyright retained by publisher',collected_at:draft.reviewed_at})
  }
  // Every subsequent official-fact batch must include a researched summary too.
  for(const record of records) if(record.mountain_observations?.some(f=>f.status==='source_checked')&&!record.overview) throw new Error(`Researched profile needs a summary: ${record.stable_id}`)
  return {summarized_profiles:drafts.length,reviewed_at:drafts.map(d=>d.reviewed_at).sort().at(-1),profiles:drafts.map(d=>({id:d.id,...byId.get(d.id).overview}))}
}
