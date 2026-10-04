export const COLLECTION_DATE = process.env.POWDERFILES_COLLECTION_DATE || new Date().toISOString()
export const USER_AGENT = 'PowderFiles-DataPipeline/0.2 (+https://github.com/DrZaff/powder-files; public-data research)'
export const ENDPOINTS = {
  wikidata: 'https://query.wikidata.org/sparql',
  openstreetmap: 'https://overpass-api.de/api/interpreter',
}
export const CACHE_MAX_AGE_DAYS = 30
export const NEAR_MATCH_KM = 8
export const STRONG_MATCH_KM = 2
