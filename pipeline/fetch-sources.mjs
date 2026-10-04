import { mkdir } from 'node:fs/promises'
import { CACHE_MAX_AGE_DAYS, COLLECTION_DATE, ENDPOINTS, USER_AGENT } from './config.mjs'
import { fetchJsonWithRetry, readFreshCache, writeJson } from './lib/http.mjs'

const cacheDir=new URL('./cache/',import.meta.url)
await mkdir(cacheDir,{recursive:true})

const wikidataQuery=`SELECT DISTINCT ?item ?itemLabel ?altLabel ?coord ?countryLabel ?adminLabel ?website WHERE {
  ?item wdt:P31/wdt:P279* wd:Q130003 .
  OPTIONAL { ?item wdt:P625 ?coord }
  OPTIONAL { ?item wdt:P17 ?country }
  OPTIONAL { ?item wdt:P131 ?admin }
  OPTIONAL { ?item wdt:P856 ?website }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en,mul". ?item rdfs:label ?itemLabel. ?item skos:altLabel ?altLabel. ?country rdfs:label ?countryLabel. ?admin rdfs:label ?adminLabel. }
}`
const overpassQuery=`[out:json][timeout:240];
(
  nwr["landuse"="winter_sports"]["name"];
  nwr["site"="piste"]["name"];
  nwr["type"="site"]["sport"~"^(skiing|ski)$"]["name"];
);
out center tags qt;`

async function collect(name,path,loader){
  const cached=await readFreshCache(path,CACHE_MAX_AGE_DAYS)
  if(cached){console.log(`${name}: using fresh cache`);return {source:name,status:'cached',records:Array.isArray(cached.records)?cached.records.length:0}}
  try{const data=await loader();await writeJson(path,{source:name,collected_at:COLLECTION_DATE,records:data});console.log(`${name}: collected ${data.length}`);return {source:name,status:'collected',records:data.length}}
  catch(error){await writeJson(new URL(`${name}.error.json`,cacheDir),{source:name,collected_at:COLLECTION_DATE,error:error.message});console.error(`${name}: ${error.message}`);return {source:name,status:'failed',records:0,error:error.message}}
}

const results=[]
results.push(await collect('wikidata',new URL('wikidata.json',cacheDir),async()=>{
  const body=new URLSearchParams({query:wikidataQuery,format:'json'}).toString()
  const json=await fetchJsonWithRetry({url:ENDPOINTS.wikidata,body,headers:{'User-Agent':USER_AGENT,'Accept':'application/sparql-results+json','Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'},attempts:4,timeoutMs:240000})
  return json.results?.bindings||[]
}))
await new Promise(resolve=>setTimeout(resolve,1500))
results.push(await collect('openstreetmap',new URL('openstreetmap.json',cacheDir),async()=>{
  const body=new URLSearchParams({data:overpassQuery}).toString()
  const json=await fetchJsonWithRetry({url:ENDPOINTS.openstreetmap,body,headers:{'User-Agent':USER_AGENT,'Accept':'application/json','Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'},attempts:4,timeoutMs:300000})
  return json.elements||[]
}))
await writeJson(new URL('fetch-summary.json',cacheDir),{collected_at:COLLECTION_DATE,endpoints:ENDPOINTS,results})
if(results.every(r=>r.status==='failed'))process.exitCode=1
