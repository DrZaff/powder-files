import { writeJson } from './lib/http.mjs'
import { officialBatch } from './official-batch-027.mjs'

const pipeline = new URL('./', import.meta.url)
const ids = officialBatch.map(record => record.id.split(':').at(-1))
const entities = {}
const sleep = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds))

for (let offset = 0; offset < ids.length; offset += 10) {
  const chunk = ids.slice(offset, offset + 10)
  const endpoint = new URL('https://www.wikidata.org/w/api.php')
  endpoint.search = new URLSearchParams({
    action: 'wbgetentities',
    format: 'json',
    props: 'labels|descriptions|aliases|claims|sitelinks',
    languages: 'en|ja|fr|de|es|ru|cs',
    languagefallback: '1',
    ids: chunk.join('|'),
  })
  let response
  for (let attempt = 0; attempt < 4; attempt += 1) {
    response = await fetch(endpoint, {
      headers: { 'User-Agent': 'PowderFilesDataPipeline/0.2 (resort data audit; github.com/DrZaff/powder-files)' },
    })
    if (response.ok) break
    if (![429, 500, 502, 503, 504].includes(response.status)) throw new Error(`Wikidata returned ${response.status}`)
    await sleep(1000 * 2 ** attempt)
  }
  if (!response?.ok) throw new Error(`Wikidata retry limit reached for ${chunk.join(', ')}`)
  Object.assign(entities, (await response.json()).entities)
  if (offset + 10 < ids.length) await sleep(1000)
}

await writeJson(new URL('cache/wikidata-batch-027.json', pipeline), {
  collected_at: new Date().toISOString(),
  source: 'Wikidata wbgetentities API',
  license: 'CC0-1.0',
  profile_ids: officialBatch.map(record => record.id),
  entities,
})
console.log(JSON.stringify({ profiles: officialBatch.length, entities: Object.keys(entities).length, output: new URL('cache/wikidata-batch-027.json', pipeline).pathname }, null, 2))
