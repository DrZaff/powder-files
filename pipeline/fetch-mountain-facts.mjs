import {readFile} from 'node:fs/promises'
import {createHash} from 'node:crypto'
import {USER_AGENT,ENDPOINTS} from './config.mjs'
import {readFreshCache,writeJson} from './lib/http.mjs'

const records=JSON.parse(await readFile(new URL('./generated/canonical-resorts.json',import.meta.url),'utf8')).filter(r=>['medium','high'].includes(r.confidence))
const ids=[...new Set(records.flatMap(r=>r.source_records.filter(s=>s.source==='wikidata'&&/^Q\d+$/.test(s.record_id)).map(s=>s.record_id)))].sort()
const fingerprint=createHash('sha256').update(JSON.stringify(ids)).digest('hex')
const cache=new URL('./cache/mountain-wikidata.json',import.meta.url)
const old=await readFreshCache(cache,30)
if(old?.fingerprint===fingerprint){console.log(`Using cached mountain observations for ${ids.length} entities`);process.exit(0)}
// Exact source-ID joins only. Preserve statements, units, qualifiers and references.
const query=`SELECT DISTINCT ?item ?statement ?amount ?unit ?qualifier ?qualifierValue ?reference WHERE {
 VALUES ?item { ${ids.map(id=>`wd:${id}`).join(' ')} }
 ?item p:P2044 ?statement. ?statement psv:P2044 ?quantity; wikibase:rank ?rank.
 FILTER(?rank != wikibase:DeprecatedRank)
 ?quantity wikibase:quantityAmount ?amount; wikibase:quantityUnit ?unit.
 OPTIONAL { ?statement ?qualifier ?qualifierValue. FILTER(STRSTARTS(STR(?qualifier),"http://www.wikidata.org/prop/qualifier/")) }
 OPTIONAL { ?statement prov:wasDerivedFrom/pr:P854 ?reference }
}`
let result
for(let attempt=0;attempt<4;attempt++){
 const response=await fetch(ENDPOINTS.wikidata,{method:'POST',headers:{'User-Agent':USER_AGENT,'Content-Type':'application/x-www-form-urlencoded','Accept':'application/sparql-results+json'},body:new URLSearchParams({query,format:'json'}),signal:AbortSignal.timeout(60000)})
 if(response.ok){result=await response.json();break}
 if(![429,502,503,504].includes(response.status)||attempt===3)throw new Error(`Wikidata HTTP ${response.status}; previous cache preserved`)
 const retry=response.headers.get('retry-after'),seconds=Number(retry)
 if(retry&&(!Number.isFinite(seconds)||seconds>60))throw new Error(`Server requests a longer retry delay; stop and retry later`)
 await new Promise(resolve=>setTimeout(resolve,Math.max(seconds||0,2**attempt*3)*1000))
}
if(!Array.isArray(result?.results?.bindings))throw new Error('Unexpected source response; cache not replaced')
await writeJson(cache,{fingerprint,collected_at:new Date().toISOString(),queried_ids:ids,source:'wikidata',endpoint:ENDPOINTS.wikidata,query,records:result.results.bindings})
console.log(JSON.stringify({queried_entities:ids.length,rows:result.results.bindings.length}))
