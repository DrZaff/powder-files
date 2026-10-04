// Factual observations manually checked against official resort/operator pages.
// No descriptions or images are copied. Units and scope follow each publisher.
export const checked = '2026-08-30'
const f = (key, label, value, unit, source, note = '', qualifier = '') => ({ key, label, value, unit, source, note, qualifier, retrieved_at: checked, source_published_at: null, status: 'source_checked', confidence: 'medium' })
const conflict = (key, label, unit, alternatives, note) => ({ ...f(key, label, null, unit, alternatives[0].source, note), status: 'conflict', confidence: 'low', alternatives })
const resort = (qid, name, source, rows, notes = '') => ({ id: `wikidata:item:${qid}`, name, notes, observations: rows.map(row => f(...row.slice(0, 4), source, ...row.slice(4))) })

export const officialBatch = [
  resort('Q17507859', '49 Degrees North', 'https://m.ski49n.com/mountain-info/trail-map-stats', [
    ['vertical', 'Advertised vertical drop', 1871, 'ft', 'Published vertical differs from the difference between published base and summit elevations (1,851 ft). Not independently verified.'],
    ['base', 'Base elevation', 3923, 'ft'], ['summit', 'Summit elevation', 5774, 'ft'], ['trails', 'Marked trails', 90, ''], ['lifts', 'Lifts', 7, '', 'Includes one conveyor.'],
  ], 'Patrolled area is not used as skiable acreage; the retrieved table did not specify its unit.'),
  resort('Q4690826', 'Afton Alps', 'https://www.aftonalps.com/the-mountain/about-the-mountain/mountain-info.aspx', [
    ['summit', 'Highest elevation', 700, 'ft'], ['base', 'Base elevation', 350, 'ft'], ['area', 'Skiable terrain', 300, 'acres'], ['lifts', 'Lifts', 17, ''], ['trails', 'Trails', 50, ''], ['snowmaking', 'Snowmaking coverage', 100, '%'],
  ]),
  resort('Q2840279', 'Alta', 'https://www.alta.com/about', [
    ['vertical', 'Vertical drop', 2538, 'ft'], ['area', 'Skiable terrain', 2614, 'acres', 'Alta permits skiing only; snowboarding is not permitted.'], ['trails', 'Runs', 118, ''], ['summit', 'Top elevation', 11068, 'ft'], ['base', 'Bottom elevation', 8530, 'ft'],
  ], 'Skiers only. Facts were read from the rendered official page; animated figures are absent from some text extractions.'),
  resort('Q9147336', 'Alyeska', 'https://www.alyeskaresort.com/about-the-mountain/', [
    ['vertical', 'Vertical rise', 2500, 'ft'], ['area', 'Skiable terrain', 1610, 'acres'], ['trails', 'Named trails', 76, ''], ['lifts', 'Lifts', 7, ''],
  ]),
  resort('Q4762160', 'Angel Fire', 'https://www.angelfireresort.com/mountain-stats/', [
    ['vertical', 'Vertical drop', 2077, 'ft'], ['area', 'Skiable terrain', 627, 'acres', 'Skiable acreage, not the larger 1,253-acre operational area.'], ['trails', 'Trails', 96, ''], ['base', 'Base elevation', 8600, 'ft'], ['summit', 'Summit elevation', 10677, 'ft'],
  ], 'Lift total withheld: current equipment breakdown and FAQ total differ; some equipment is restricted to lessons.'),
  resort('Q4779435', 'Apex', 'https://apexresort.com/', [
    ['vertical', 'Vertical drop', 2000, 'ft'], ['area', 'Skiable terrain', 1112, 'acres'], ['trails', 'Runs & terrain parks', 85, '', 'Published total includes four terrain parks.'], ['lifts', 'Lifts', 4, ''],
  ]),
  resort('Q4784196', 'Arapahoe Basin', 'https://www.arapahoebasin.com/field-guide/', [
    ['vertical', 'Advertised vertical', 2530, 'ft'], ['area', 'Skiable terrain', 1428, 'acres'], ['summit', 'Summit elevation', 13050, 'ft', 'Mountain summit; not a claim about the highest lift-served point.'],
  ]),
  resort('Q4791400', 'Arizona Snowbowl', 'https://www.snowbowl.ski/the-mountain/mountain-information/', [
    ['vertical', 'Vertical incl. hike-to terrain', 2800, 'ft', 'Includes hike-to terrain up to 12,000 ft; not all lift-served.'], ['area', 'Skiable terrain', 777, 'acres'], ['trails', 'Runs', 61, ''], ['lifts', 'Lifts', 8, '', 'Includes two conveyors.'], ['base', 'Base elevation', 9200, 'ft'], ['skiing_elevation', 'Lift-served elevation', 11500, 'ft'], ['hike_elevation', 'Hike-to elevation', 12000, 'ft'],
  ]),
  resort('Q4840857', 'Badger Pass', 'https://www.travelyosemite.com/winter/badger-pass-ski-area/downhill-skiing-snowboarding', [
    ['vertical', 'Vertical drop', 800, 'ft'], ['base', 'Base elevation', 7200, 'ft'], ['summit', 'Upper elevation', 8000, 'ft'], ['trails', 'Ski runs', 10, ''], ['lifts', 'Lifts', 5, '', 'Equipment list includes a handle tow, despite the page heading referring to chairlifts.'],
  ]),
  resort('Q2366796', 'Banff Sunshine', 'https://www.skibanff.com/explore/trail-maps/', [
    ['area', 'Skiable terrain', 3500, 'acres', 'Published as more than 3,500 acres across three mountains.', '>'],
  ], 'Other core statistics were not established from the reviewed official page.'),
  resort('Q4906372', 'Big Sky', 'https://www.bigskyresort.com/mountain-info', [
    ['vertical', 'Vertical drop', 4350, 'ft'], ['area', 'Skiable terrain', 5850, 'acres'], ['trails', 'Named runs', 320, ''], ['lifts', 'Lifts', 40, '', 'Includes surface and real-estate access lifts.'], ['summit', 'Lone Peak summit', 11166, 'ft'], ['base', 'Mountain Village base', 7500, 'ft', 'Village base, not the lowest point of the ski area. Madison base is 7,400 ft.'],
  ]),
  resort('Q4929534', 'Blue Mountain (Pennsylvania)', 'https://www.skibluemt.com/winter-sports/skiing-snowboarding/trail-map/', [
    ['vertical', 'Vertical drop', 1082, 'ft'], ['area', 'Skiable terrain', 171, 'acres'], ['trails', 'Trails', 40, '', 'Headline resort total; not calculated from difficulty-category subtotals.'], ['lifts', 'Lifts', 15, ''],
  ]),
  resort('Q4978877', 'Brundage', 'https://brundage.com/mountain-stats/', [
    ['vertical', 'Vertical drop', 1921, 'ft'], ['area', 'Lift-accessed terrain', 1920, 'acres', 'Includes 420 acres of unpatrolled backcountry without avalanche mitigation. Excludes snowcat terrain.'], ['trails', 'Named trails', 70, ''], ['lifts', 'Lifts', 6, '', 'Includes a magic carpet.'], ['base', 'Base elevation', 5882, 'ft'], ['summit', 'Summit elevation', 7803, 'ft'],
  ]),
  resort('Q5003005', 'Buttermilk', 'https://www.aspensnowmass.com/partner-passes/ikon-pass/ikon-pass-holders-guide-to-aspen-snowmass', [
    ['vertical', 'Vertical drop', 2030, 'ft'],
  ], 'Official HTML sources disagree on acreage. The PDF fact sheet was not used because its visual preview was unavailable.'),
  resort('Q2935212', 'Camp Fortune', 'https://campfortune.com/fr/', [
    ['trails', 'Trails', 24, ''], ['lifts', 'Lifts', 7, '', 'Includes two carpets, four quads and one triple.'], ['lit_trails', 'Lit trails', 14, ''],
  ], 'French-language official source. Vertical, skiable area and elevation remain unsourced.'),
  resort('Q5184571', 'Crested Butte', 'https://www.skicb.com/the-mountain/about-the-mountain/mountain-info.aspx', [
    ['area', 'Skiable terrain', 1547, 'acres'], ['trails', 'Trails', 165, ''], ['lifts', 'Lifts', 15, ''], ['summit', 'Highest elevation', 12162, 'ft', 'Not asserted to be the highest lift-served point.'], ['base', 'Base elevation', 9375, 'ft'],
  ]),
  resort('Q1624333', 'Crystal Mountain (Washington)', 'https://www.crystalmountainresort.com/media/mountain-stats-and-facts', [
    ['area', 'Lift-serviced terrain', 2300, 'acres', 'Lift-serviced area; resort total is 2,600 acres.'], ['lifts', 'Lifts', 11, ''], ['base', 'Base area elevation', 4400, 'ft', 'Lower Northway is below the base area, at 3,912 ft.'],
  ], 'Run counts differ by terminology; top-of-gondola elevations also differ on the same page. No summit value selected.'),
  resort('Q5270890', 'Diamond Peak', 'https://www.diamondpeak.com/about/', [
    ['vertical', 'Vertical drop', 1840, 'ft'], ['area', 'Skiable terrain', 655, 'acres'], ['trails', 'Runs', 30, '', 'Current About page; older 2025–26 press kit lists 28 named trails, a differently scoped count.'], ['lifts', 'General-access lifts', 6, '', 'One additional surface lift is exclusive to child ski school and is not included.'], ['base', 'Base elevation', 6700, 'ft'], ['skiing_elevation', 'Upper elevation', 8540, 'ft'],
  ]),
  resort('Q5586122', 'Gore', 'https://goremountain.com/the-mountain/trail-maps/', [
    ['vertical', 'Advertised vertical', 2537, 'ft'], ['area', 'Skiable terrain', 453, 'acres'], ['lifts', 'Lifts', 14, ''], ['summit', 'Summit elevation', 3600, 'ft'], ['base', 'Gore base area', 1500, 'ft', 'Ski Bowl base is 998 ft. Do not subtract base-area elevations to infer vertical.'],
  ]),
  resort('Q5595130', 'Grand Targhee', 'https://www.grandtarghee.com/the-mountain/mountain-information/mountain-stats', [
    ['vertical', 'Vertical drop', 2270, 'ft'], ['area', 'Winter terrain', 2602, 'acres'], ['lifts', 'Lifts', 6, '', 'Includes one magic carpet.'], ['base', 'Base area elevation', 7851, 'ft'], ['summit', 'Fred’s Mountain summit', 9862, 'ft', 'One named summit, not the highest hike-to point; Mary’s Nipple is higher.'],
  ]),
  resort('Q6402050', 'Kicking Horse', 'https://kickinghorseresort.com/discover-kickinghorse/mountain-stats/', [
    ['vertical', 'Vertical drop', 1315, 'm'], ['area', 'Skiable terrain', 3486, 'acres'], ['trails', 'Runs', 120, '', 'Published as 120+ runs, not an exact count.', '+'], ['summit', 'Top elevation', 2505, 'm'], ['base', 'Lowest chair bottom', 1190, 'm'],
  ]),
  resort('Q13231225', 'Lake Louise', 'https://www.skilouise.com/explore-winter/winter-ski-ride/mountain-stats/', [
    ['vertical', 'Vertical drop', 991, 'm'], ['area', 'Skiable terrain', 1700, 'ha'], ['trails', 'Named runs', 170, ''], ['lifts', 'Lifts', 13, '', 'Includes three carpets.'], ['summit', 'Top elevation', 2637, 'm'],
  ]),
  resort('Q3224379', 'Le Massif', 'https://www.lemassif.com/fr/family-vacations-canada', [
    ['vertical', 'Vertical drop', 770, 'm'], ['trails', 'Trails', 53, ''],
  ], 'Source article dated 2025-03-31; these are published figures, not a live trail-opening report.'),
  resort('Q5569328', 'Glenshee', 'https://www.ski-glenshee.co.uk/Skiing', [
    ['piste_length', 'Pisted runs', 40, 'km', 'Length, not area or number of trails. Published as over 40 km.', '>'],
  ], 'The 26 blue/red runs on this page are a subset, not the total trail count. Remaining core facts need research.'),
  resort('Q1026835', 'Val Thorens', 'https://www.valthorens.com/en/domaine-ski-vtt/val-thorens-orelle/', [
    ['piste_length', 'Linked-area pistes', 150, 'km', 'Val Thorens–Orelle combined area, not Val Thorens alone or the larger Three Valleys.'],
  ], 'Linked-area statistics must not be compared as if they described a single standalone resort.'),
]

const find = qid => officialBatch.find(r => r.id === `wikidata:item:${qid}`)
const buttermilk = find('Q5003005')
const powder = 'https://www.aspensnowmass.com/discover/experiences/guides/how-to-ski-buttermilk-on-a-powder-day'
buttermilk.observations.push(f('trails', 'Trails', 44, '', powder), conflict('area', 'Skiable terrain', 'acres', [{value:470, source:buttermilk.observations[0].source}, {value:435, source:powder}], 'Official HTML pages report 470 and 435 acres. Dates and scope are unclear; acreage withheld pending clarification.'))
for (const [qid, key, label, values, note] of [
  ['Q1624333', 'trails', 'Trails / named runs', [85,57], 'The same official page reports 85 named runs and 57 designated trails. Scope is unresolved; no single count selected.'],
  ['Q5586122', 'trails', 'Trails', [108,115,109], 'Official page contains 108, 115 and 109 alpine trails, alongside Nordic counts. No single downhill count selected.'],
]) {
  const entry = find(qid), source = entry.observations[0].source
  entry.observations.push(conflict(key, label, '', values.map(value => ({value,source})), note))
}
const val = find('Q1026835')
const guide = 'https://www.valthorens.com/en/premier-jour-a-val-thorens-guide-pratique/'
const operator = 'https://ski.valthorens.com/destinations/domaine-skiable/'
val.observations.push(
  f('base', 'Village elevation', 2300, 'm', guide, 'Village elevation, not the lowest skiing point in the linked area.'),
  f('skiing_elevation', 'Highest linked-area skiing', 3230, 'm', 'https://www.valthorens.com/en/sejour/guide-sejour/', 'Pointe du Bouchet in the Val Thorens–Orelle area.'),
  conflict('trails', 'Linked-area runs', '', [{value:83,source:guide},{value:88,source:operator}], 'Tourism and lift-operator pages report different totals; count withheld.'),
  conflict('lifts', 'Linked-area lifts', '', [{value:30,source:guide},{value:31,source:operator}], 'Tourism and lift-operator pages report different totals; count withheld.'),
)
find('Q3224379').observations.forEach(o => { o.source_published_at = '2025-03-31' })

export function applyOfficialBatch(records, { entries = officialBatch, batch = 'official-001', checkedAt = checked } = {}) {
  const byId = new Map(records.map(r => [r.stable_id, r]))
  for (const entry of entries) {
    const record = byId.get(entry.id)
    if (!record) throw new Error(`Official batch resort missing: ${entry.id}`)
    if (!['medium', 'high'].includes(record.confidence)) throw new Error(`Batch resort outside public confidence scope: ${entry.id}`)
    record.mountain_observations ||= []
    for (const observation of entry.observations) {
      if (record.mountain_observations.some(o => o.key === observation.key)) throw new Error(`Duplicate mountain field: ${entry.id}/${observation.key}`)
      record.mountain_observations.push(structuredClone(observation))
      record.field_provenance[`mountain.${observation.key}`] = { ...structuredClone(observation), batch, source_record_ids: [...new Set([observation.source, ...(observation.alternatives || []).map(a => a.source)])] }
    }
    for (const url of new Set(entry.observations.flatMap(o => [o.source, ...(o.alternatives || []).map(a => a.source)]))) {
      if (!record.source_records.some(s => s.url === url)) record.source_records.push({ source: 'official_resort', record_id: url, url, license: 'factual-observations-only; page copyright retained by publisher', collected_at: checkedAt })
    }
  }
  return {
    batch, checked_at: checkedAt, researched_profiles: entries.length,
    source_checked_observations: entries.flatMap(r => r.observations).filter(o => o.status === 'source_checked').length,
    conflict_fields: entries.flatMap(r => r.observations).filter(o => o.status === 'conflict').length,
    profiles: entries.map(entry => ({ id: entry.id, name: entry.name, notes: entry.notes, observations: entry.observations.length, missing_core_fields: ['vertical','area','trails','skiing_elevation','lifts'].filter(key => !entry.observations.some(o => o.key === key && o.status === 'source_checked')), conflicts: entry.observations.filter(o => o.status === 'conflict'), sources: [...new Set([...entry.observations.flatMap(o => [o.source, ...(o.alternatives || []).map(a => a.source)]), ...(entry.research_sources || [])])] })),
  }
}
