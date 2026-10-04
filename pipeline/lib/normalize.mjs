const countryAliases = new Map([
  ['united states of america','United States'],['usa','United States'],['u.s.','United States'],
  ['russian federation','Russia'],['republic of korea','South Korea'],['korea, republic of','South Korea'],
  ['czech republic','Czechia'],['viet nam','Vietnam'],['bolivia, plurinational state of','Bolivia'],
])

export function cleanText(value) { return String(value || '').normalize('NFKC').replace(/\s+/g, ' ').trim() }
export function normalizeName(value) { return cleanText(value).toLocaleLowerCase('en').replace(/&/g,' and ').replace(/['’]/g,'').replace(/[^\p{L}\p{N}]+/gu,' ').trim() }
export function normalizeCountry(value) {
  const clean=cleanText(value); if(!clean)return ''
  const aliased=countryAliases.get(clean.toLowerCase()); if(aliased)return aliased
  if(/^[A-Za-z]{2}$/.test(clean)){try{return new Intl.DisplayNames(['en'],{type:'region'}).of(clean.toUpperCase())||clean.toUpperCase()}catch{return clean.toUpperCase()}}
  return clean
}
export function normalizeUrl(value) {
  const clean = cleanText(value); if (!clean) return null
  try { const url = new URL(/^https?:\/\//i.test(clean) ? clean : `https://${clean}`); url.hash=''; return url.toString().replace(/\/$/,'') } catch { return null }
}
export function normalizeCoordinates(lat, lon) {
  const latitude=Number(lat),longitude=Number(lon)
  if (!Number.isFinite(latitude)||!Number.isFinite(longitude)||Math.abs(latitude)>90||Math.abs(longitude)>180) return null
  return { latitude:Number(latitude.toFixed(6)), longitude:Number(longitude.toFixed(6)) }
}
export function pointFromWkt(value) { const match=String(value||'').match(/Point\(([-\d.]+)\s+([-\d.]+)\)/i); return match?normalizeCoordinates(match[2],match[1]):null }
export function sourceId(source,type,id) { return `${source}:${type}:${String(id).replace(/^Q/i,'Q')}` }
export function haversineKm(a,b) { if(!a||!b)return Infinity; const rad=n=>n*Math.PI/180,R=6371,dLat=rad(b.latitude-a.latitude),dLon=rad(b.longitude-a.longitude); const x=Math.sin(dLat/2)**2+Math.cos(rad(a.latitude))*Math.cos(rad(b.latitude))*Math.sin(dLon/2)**2; return 2*R*Math.asin(Math.sqrt(x)) }
