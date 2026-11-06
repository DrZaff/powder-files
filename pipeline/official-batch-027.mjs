import { applyOfficialBatch } from './official-batch-001.mjs'
import { normalizeName } from './lib/normalize.mjs'

export const checked = '2026-11-05'
const source = qid => `https://www.wikidata.org/wiki/${qid}`
const entry = (qid, name, summary) => ({
  id: `wikidata:item:${qid}`,
  name,
  summary,
  summary_sources: [source(qid)],
  summary_reviewed_at: checked,
  notes: 'CC0 identity and location review only. Current operation, lift service and mountain dimensions remain unverified; no numerical mountain fact is inferred.',
  observations: [],
  research_sources: [source(qid)],
})

export const officialBatch = [
  entry('Q2982069', 'Coll de Jou', 'Coll de Jou is a former winter-sports site near Mosset in the French Pyrenees; this profile is retained as a candidate identity while its downhill infrastructure and present status are reviewed.'),
  entry('Q16960629', 'Diamond Hill', 'Diamond Hill is a historic Rhode Island ski-site identity in Cumberland; current public lift service and operating status have not been established from an official operator source.'),
  entry('Q18336608', 'Echo Valley Ski Resort', 'Echo Valley is a Japanese mountain ski-area identity in Nagawa, with its recorded location placing it in the central highlands; current operations and published mountain statistics still need official confirmation.'),
  entry('Q3411128', 'Puigbalador', 'Puigbalador is a ski-station identity at Puyvalador in the French Pyrenees; its current operating status and the scope of any lift-served downhill terrain remain unresolved.'),
  entry('Q3086722', 'Frauenalpe', 'Frauenalpe is a mountain and ski-area identity above Murau in Styria, Austria; the profile currently describes the mapped place rather than a verified operating lift network.'),
  entry('Q3257491', 'Llanos del Hospital', 'Llanos del Hospital is a winter-sports site in the Benasque area of the Spanish Pyrenees; lift-served downhill scope has not yet been confirmed from a current official source.'),
  entry('Q1664062', 'Innerkrems', 'Innerkrems is an Austrian mountain village and ski-area identity in Carinthia; the directory record awaits current operator evidence for active lifts and official mountain dimensions.'),
  entry('Q11364149', 'Nakayama Toge Ski Resort', 'Nakayama Toge is a Hokkaido ski-area identity near Kimobetsu, positioned around a high mountain pass; current operating details and official terrain figures remain unverified.'),
  entry('Q5751991', 'National Winter Activity Center', 'The National Winter Activity Center is a winter-sports facility in Vernon, New Jersey, historically associated with Hidden Valley; public access and current downhill lift service require confirmation.'),
  entry('Q11626773', 'Nekoma Ski Resort', 'Nekoma is a Fukushima mountain ski-area identity near Kitashiobara; this candidate profile does not yet claim current lift counts, terrain totals or standalone operating scope.'),
  entry('Q108688120', '安南平スキー場', '安南平スキー場 is a Japanese ski-area record in the northern Nagano mountain region; its English name, operating status and official mountain facts remain incomplete.'),
  entry('Q109359494', '信濃平スキー場', '信濃平スキー場 is a ski-area identity near Iiyama in Nagano Prefecture; the record is location-supported but still lacks current operator and lift-service verification.'),
  entry('Q109595290', '木戸池スキー場', '木戸池スキー場 is a ski-area identity near Yamanouchi in Nagano Prefecture; current access, lifts and mountain dimensions have not been confirmed from an official source.'),
  entry('Q11267247', 'ごりん高原スキー場', 'ごりん高原スキー場 is a Japanese highland ski-area record in northern Nagano; it remains a candidate until active lift service and operating scope can be verified.'),
  entry('Q11305445', 'サンアルピナ青木湖スキー場', 'サンアルピナ青木湖スキー場 is a ski-area identity near Ōmachi and Lake Aoki in Nagano; current operations and official terrain statistics remain unresolved.'),
  entry('Q11312600', 'スノーバレー利賀', 'スノーバレー利賀 is a Japanese mountain ski-area identity in Toyama Prefecture; the directory currently has location evidence but no verified current lift or terrain totals.'),
  entry('Q11312603', 'スノーパーク面白山', 'スノーパーク面白山 is a Yamagata mountain ski-area identity; present operating status and the extent of lift-served downhill terrain require official confirmation.'),
  entry('Q11318082', 'チャオ御岳スノーリゾート', 'チャオ御岳スノーリゾート is a ski-resort identity on the Mount Ontake side of Takayama; its recorded website and historical identity do not by themselves establish current operation.'),
  entry('Q11339886', 'マウントジーンズ那須', 'マウントジーンズ那須 is a Tochigi mountain ski-area identity in the Nasu highlands; current public operation and official mountain figures remain to be verified.'),
  entry('Q11345075', 'ヤナバスキー場', 'ヤナバスキー場 is a ski-area identity near Ōmachi in Nagano Prefecture; the record retains its mapped location while current lift service and status remain uncertain.'),
  entry('Q11350045', 'レーシングキャンプ野辺山', 'レーシングキャンプ野辺山 is a winter-training and ski-site identity near Minamimaki in Nagano; ordinary public downhill access and active lift service are not yet established.'),
  entry('Q11371622', '二本松塩沢スキー場', '二本松塩沢スキー場 is a ski-area identity near Nihonmatsu in Fukushima Prefecture; current operating status and official trail, lift and elevation figures remain incomplete.'),
  entry('Q11379225', '伊吹山スキー場', '伊吹山スキー場 is a historic ski-area identity on Mount Ibuki near Maibara; present operations and public lift service have not been confirmed.'),
  entry('Q11415540', '名色スキー場', '名色スキー場 is a ski-area identity near Toyooka in Hyōgo Prefecture; its current operating status and mountain statistics remain unverified.'),
  entry('Q11488936', '御岳ロープウェイスキー場', '御岳ロープウェイスキー場 is a Mount Ontake ropeway and ski-area identity in central Japan; the profile does not assume that ropeway access equals current downhill operation.'),
  entry('Q11500724', '斑尾高原豊田スキー場', '斑尾高原豊田スキー場 is a ski-area identity near Nakano in Nagano Prefecture; its recorded legacy website is not treated as proof of current operation.'),
  entry('Q11518594', '木曽駒高原スキー場', '木曽駒高原スキー場 is a mountain ski-area identity in the Kiso region of Nagano; current lifts, trails and public operating status remain unverified.'),
  entry('Q11545924', '武尊オリンピアスキー場', '武尊オリンピアスキー場 is a ski-area identity near Katashina in Gunma Prefecture; official evidence is still needed for current operation and mountain dimensions.'),
  entry('Q11547401', '比叡山人工スキー場', '比叡山人工スキー場 is a historic artificial-snow ski-site identity on Mount Hiei near Kyoto; it is not presented as a currently operating resort without further evidence.'),
  entry('Q11547492', '比良山スキー場', '比良山スキー場 is a ski-area identity in the Hira Mountains near Ōtsu; current lift service and operating status remain unresolved.'),
  entry('Q11579552', '白山中宮温泉スキー場', '白山中宮温泉スキー場 is a ski-area identity in the Hakusan region of Ishikawa Prefecture; the profile still needs a current operator source and verified mountain facts.'),
  entry('Q11615894', '芸北高原大佐スキー場', '芸北高原大佐スキー場 is a ski-area identity in the Geihoku highlands of Hiroshima Prefecture; current operations and official terrain measurements remain incomplete.'),
  entry('Q11618162', '草津シズカ山スキー場', '草津シズカ山スキー場 is a ski-area identity near Kusatsu in Gunma Prefecture; active lift service and present-day access have not been confirmed.'),
  entry('Q11635458', '赤城山スキー場', '赤城山スキー場 is a ski-area identity on Mount Akagi near Maebashi; the record remains cautious because current operation and lift details are unverified.'),
  entry('Q11655346', '閑乗寺スキー場', '閑乗寺スキー場 is a Toyama-area ski-site identity; its mapped location is retained while current downhill operation and official mountain statistics remain uncertain.'),
  entry('Q11660920', '霧降高原スキー場', '霧降高原スキー場 is a ski-area identity in the Kirifuri Highlands near Nikkō; current public lift service and operating status require an official source.'),
  entry('Q137039214', 'Le Désert d’Entremont', 'Le Désert d’Entremont is a village ski-station identity near Entremont-le-Vieux in the French Alps; current lift service and official mountain totals remain unverified.'),
  entry('Q137050877', 'Courchevel La Tania', 'Courchevel La Tania is a resort-sector identity within the Courchevel area; this profile does not treat linked-domain statistics as if they described a separate standalone mountain.'),
  entry('Q137052865', 'Ventron', 'Ventron is a Vosges ski-station identity in northeastern France; the directory retains the place record while current operations and lift-served scope are reviewed.'),
  entry('Q137052980', 'Le Grand Puy', 'Le Grand Puy is a ski-station identity near Seyne in the southern French Alps; current operating status and official mountain measurements remain incomplete.'),
  entry('Q18339275', '武尊牧場スキー場', '武尊牧場スキー場 is a ski-area identity near Katashina in Gunma Prefecture; its current public operation and lift-served footprint have not been confirmed.'),
  entry('Q22120428', 'ミカタスノーパーク', 'ミカタスノーパーク is a ski-area identity in the mountains of Hyōgo Prefecture; current lift service, trails and operating status remain unverified.'),
  entry('Q22120951', '六呂師高原スキーパーク', '六呂師高原スキーパーク is a highland ski-area identity in Fukui Prefecture; official evidence is still needed for current operations and mountain facts.'),
  entry('Q2292224', 'Dachstein Glacier ski area', 'The Dachstein Glacier ski-area record identifies a high-alpine site in Styria, Austria; sightseeing lift access is not treated as proof of active downhill ski terrain.'),
  entry('Q23784196', 'Campra', 'Campra is a winter-sports site in Ticino, Switzerland; the record remains a candidate because lift-served downhill scope has not been confirmed.'),
  entry('Q28683444', '揖斐高原スキー場', '揖斐高原スキー場 is a ski-area identity near Ibigawa in Gifu Prefecture; its legacy website and mapped location do not establish current operation.'),
  entry('Q3075146', 'Foncine-le-Haut', 'Foncine-le-Haut is a winter-sports community in the French Jura; this profile still needs confirmation that its recorded identity represents active public lift-served downhill terrain.'),
  entry('Q3089365', 'Frère-Joseph', 'Frère-Joseph is a winter-sports station associated with Ventron in the Vosges; current operating status and any distinct lift-served terrain remain unverified.'),
  entry('Q11405758', 'Senjōjiki Ski Area', 'Senjōjiki is a high-elevation ski-area identity above Komagane in the Japanese Central Alps; ropeway access and backcountry use are not counted as ordinary lift-served resort terrain without further evidence.'),
  entry('Q116279780', 'Smokey Mountain Ski Club', 'Smokey Mountain Ski Club is a ski-area identity in Labrador, Canada; current public access, lift service and official mountain figures still need confirmation.'),
]

export function applyOfficialBatch027(records) {
  const byId = new Map(records.map(record => [record.stable_id, record]))
  let nameRepairs = 0
  for (const item of officialBatch) {
    const record = byId.get(item.id)
    if (!record) throw new Error(`Official batch 027 missing ${item.id}`)
    if (record.name !== item.name) {
      nameRepairs += 1
      record.name = item.name
      record.normalized_name = normalizeName(item.name)
      record.field_provenance.name = {
        value: item.name,
        source_record_ids: item.summary_sources,
        confidence: 'medium',
        reviewed_at: checked,
        note: 'Wikidata label repair; identity and stable ID are unchanged.',
      }
    }
    record.overview = { text: item.summary, sources: item.summary_sources, reviewed_at: checked, kind: 'editorial_summary' }
    record.field_provenance.overview = { value: item.summary, source_record_ids: item.summary_sources, confidence: 'medium', batch: 'official-027' }
  }
  const report = applyOfficialBatch(records, { entries: officialBatch, batch: 'official-027', checkedAt: checked })
  report.summary_only_profiles = officialBatch.map(item => item.id)
  report.name_repairs = nameRepairs
  return report
}
