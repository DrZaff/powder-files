// MET Norway Locationforecast 2.0 → the small "pf-weather/1" shape the site displays.
// Pure helpers plus a cached fetch, so the Netlify function stays a thin wrapper and the logic is testable.
//
// MET terms we follow (https://api.met.no/doc/TermsOfService):
// - identify ourselves with a User-Agent that names the site and a contact URL;
// - cache and honour the Expires header, revalidate with If-Modified-Since;
// - use at most 4 decimals for coordinates (we retain 4, about 11 m, so mountain points are not displaced);
// - credit MET Norway wherever the data is shown (data licence: CC BY 4.0 and NLOD 2.0).

export const MET_ENDPOINT = 'https://api.met.no/weatherapi/locationforecast/2.0/compact'
export const SOURCE = {
  name: 'MET Norway',
  product: 'Locationforecast 2.0',
  url: 'https://www.met.no/en',
  licence: 'CC BY 4.0',
  licence_url: 'https://creativecommons.org/licenses/by/4.0/',
  attribution: 'Weather forecast from MET Norway',
}
const HOUR = 36e5
const MIN_TTL_S = 600, MAX_TTL_S = 7200

// Validate and normalise the query. Returns {lat, lon, alt} or {error}.
export function parseQuery(params) {
  const lat = Number(params.get('lat')), lon = Number(params.get('lon'))
  const altRaw = params.get('alt')
  if (!params.has('lat') || !params.has('lon') || !Number.isFinite(lat) || !Number.isFinite(lon)) return { error: 'lat and lon are required numbers' }
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return { error: 'lat or lon out of range' }
  let alt = null
  if (altRaw !== null && altRaw !== '') {
    alt = Number(altRaw)
    if (!Number.isFinite(alt) || alt < -500 || alt > 9000) return { error: 'alt must be metres between -500 and 9000' }
    alt = Math.round(alt / 10) * 10
  }
  return { lat: Math.round(lat * 10000) / 10000, lon: Math.round(lon * 10000) / 10000, alt }
}

export const cacheKey = ({ lat, lon, alt }) => `${lat.toFixed(4)},${lon.toFixed(4)},${alt ?? ''}`

export function upstreamUrl({ lat, lon, alt }) {
  const url = new URL(MET_ENDPOINT)
  url.searchParams.set('lat', lat.toFixed(4)); url.searchParams.set('lon', lon.toFixed(4))
  if (alt !== null) url.searchParams.set('altitude', String(alt))
  return url.toString()
}

const round1 = v => (typeof v === 'number' ? Math.round(v * 10) / 10 : null)

// Turn MET's ~40 KB timeseries into what the widget needs (about 3 KB).
export function summarize(met, { lat, lon, alt }, now = new Date()) {
  const series = met?.properties?.timeseries
  if (!Array.isArray(series) || !series.length) throw new Error('Forecast has no timeseries')
  const at = entry => Date.parse(entry.time)
  // The first step that is not more than 30 minutes in the past.
  let start = series.findIndex(entry => at(entry) >= now.getTime() - HOUR / 2)
  if (start < 0) throw new Error('Forecast has expired')
  const steps = series.slice(start)
  const first = steps[0], d = first.data.instant.details
  const symbolOf = data => data.next_1_hours?.summary?.symbol_code || data.next_6_hours?.summary?.symbol_code || data.next_12_hours?.summary?.symbol_code || null
  const current = {
    time: first.time,
    air_temperature_c: round1(d.air_temperature),
    wind_speed_ms: round1(d.wind_speed),
    wind_from_deg: typeof d.wind_from_direction === 'number' ? Math.round(d.wind_from_direction) : null,
    cloud_area_pct: typeof d.cloud_area_fraction === 'number' ? Math.round(d.cloud_area_fraction) : null,
    relative_humidity_pct: typeof d.relative_humidity === 'number' ? Math.round(d.relative_humidity) : null,
    symbol: symbolOf(first.data),
    precipitation_next_1h_mm: round1(first.data.next_1_hours?.details?.precipitation_amount ?? null),
  }
  const hours = steps.filter(entry => entry.data.next_1_hours).slice(0, 24).map(entry => ({
    time: entry.time,
    air_temperature_c: round1(entry.data.instant.details.air_temperature),
    precipitation_mm: round1(entry.data.next_1_hours.details?.precipitation_amount ?? 0),
    symbol: entry.data.next_1_hours.summary?.symbol_code || null,
  }))

  // Precipitation periods without double counting: hourly while MET gives hourly steps, then 6-hourly.
  const periods = []
  let coveredUntil = -Infinity
  for (const entry of steps) {
    const t = at(entry), one = entry.data.next_1_hours, six = entry.data.next_6_hours
    if (t < coveredUntil) continue
    if (one?.details && typeof one.details.precipitation_amount === 'number') { periods.push({ start: t, hours: 1, mm: one.details.precipitation_amount }); coveredUntil = t + HOUR }
    else if (six?.details && typeof six.details.precipitation_amount === 'number') { periods.push({ start: t, hours: 6, mm: six.details.precipitation_amount }); coveredUntil = t + 6 * HOUR }
  }
  // Three rolling 24-hour windows from the current step. No timezone guessing: labels are "Next 24 h" etc.
  const origin = at(first)
  const windows = [0, 1, 2].map(n => {
    const from = origin + n * 24 * HOUR, to = from + 24 * HOUR
    const temps = steps.filter(entry => at(entry) >= from && at(entry) < to).map(entry => entry.data.instant.details.air_temperature).filter(v => typeof v === 'number')
    let mm = 0, covered = 0
    for (const p of periods) {
      const pFrom = p.start, pTo = p.start + p.hours * HOUR, overlap = Math.max(0, Math.min(to, pTo) - Math.max(from, pFrom))
      if (overlap) { mm += p.mm * overlap / (pTo - pFrom); covered += overlap }
    }
    // Symbol: the 12-hour summary nearest the middle of the window.
    const mid = from + 12 * HOUR
    const withSymbol = steps.filter(entry => entry.data.next_12_hours?.summary?.symbol_code || entry.data.next_6_hours?.summary?.symbol_code)
    const near = withSymbol.reduce((best, entry) => (!best || Math.abs(at(entry) - mid) < Math.abs(at(best) - mid) ? entry : best), null)
    const min = temps.length ? Math.min(...temps) : null, max = temps.length ? Math.max(...temps) : null
    const precipitation_mm = round1(mm)
    return {
      label: ['Next 24 h', '24–48 h', '48–72 h'][n],
      from: new Date(from).toISOString(), to: new Date(to).toISOString(),
      min_c: round1(min), max_c: round1(max),
      precipitation_mm,
      // An estimate from temperature at the mapped point only. Never an accumulation forecast.
      precipitation_type_estimate: precipitation_mm === null || precipitation_mm < 0.2 || min === null ? null : max <= 1 ? 'snow' : min <= 1 ? 'mixed' : 'rain',
      complete: covered >= 24 * HOUR - 1,
      symbol: near ? (near.data.next_12_hours?.summary?.symbol_code || near.data.next_6_hours?.summary?.symbol_code) : null,
    }
  }).filter(window => window.min_c !== null)

  return {
    version: 'pf-weather/1',
    kind: 'forecast',
    source: SOURCE,
    location: { lat, lon, altitude_m: alt, rounded_to_decimals: 4 },
    model_updated_at: met.properties.meta?.updated_at || null,
    current,
    hours,
    windows,
  }
}

const parseTtl = (expires, nowMs) => {
  const ms = Date.parse(expires || '')
  const seconds = Number.isFinite(ms) ? Math.round((ms - nowMs) / 1000) : MIN_TTL_S
  return Math.min(MAX_TTL_S, Math.max(MIN_TTL_S, seconds))
}

// In-memory cache per function instance. The CDN cache in front (see weather.mjs) does most of the work.
export function createForecastCache({ fetchImpl = fetch, userAgent, maxEntries = 500, now = () => Date.now() } = {}) {
  const entries = new Map()
  async function get(query) {
    const key = cacheKey(query), hit = entries.get(key), t = now()
    if (hit && hit.expiresAt > t) return { ...hit.payload, fetched_at: hit.fetchedAt, stale: false, cache: 'hit', ttl: Math.round((hit.expiresAt - t) / 1000) }
    const headers = { 'User-Agent': userAgent, Accept: 'application/json' }
    if (hit?.lastModified) headers['If-Modified-Since'] = hit.lastModified
    let response
    try {
      response = await fetchImpl(upstreamUrl(query), { headers, signal: AbortSignal.timeout(8000) })
    } catch (error) {
      if (hit) return stale(hit, `upstream unreachable: ${error.message}`)
      throw Object.assign(new Error('Forecast provider unreachable'), { status: 502 })
    }
    if (response.status === 304 && hit) {
      hit.expiresAt = t + parseTtl(response.headers.get('expires'), t) * 1000
      return { ...hit.payload, fetched_at: hit.fetchedAt, stale: false, cache: 'revalidated', ttl: Math.round((hit.expiresAt - t) / 1000) }
    }
    if (!response.ok) {
      if (hit) return stale(hit, `upstream status ${response.status}`)
      throw Object.assign(new Error(`Forecast provider returned ${response.status}`), { status: response.status === 429 ? 503 : 502 })
    }
    const payload = summarize(await response.json(), query, new Date(t))
    const ttl = parseTtl(response.headers.get('expires'), t)
    const entry = { payload, fetchedAt: new Date(t).toISOString(), expiresAt: t + ttl * 1000, lastModified: response.headers.get('last-modified') }
    entries.delete(key); entries.set(key, entry)
    while (entries.size > maxEntries) entries.delete(entries.keys().next().value)
    return { ...payload, fetched_at: entry.fetchedAt, stale: false, cache: 'miss', ttl }
  }
  const stale = (hit, reason) => ({ ...hit.payload, fetched_at: hit.fetchedAt, stale: true, stale_reason: reason, cache: 'stale', ttl: 60 })
  return { get, size: () => entries.size }
}
