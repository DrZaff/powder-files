// Client for /api/weather (Netlify function in netlify/functions/weather.mjs).
// Response shape "pf-weather/1": { kind:'forecast', source, location, model_updated_at, fetched_at, stale,
//   current, hours[24], windows[3] }. See netlify/lib/met-forecast.mjs for field details.

const TTL_MS = 10 * 60 * 1000
const memory = new Map()

// Same rounding as the function, so equal points share one browser and CDN cache entry.
export function weatherQuery({ lat, lon, altitude }) {
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null
  const params = new URLSearchParams({ lat: lat.toFixed(2), lon: lon.toFixed(2) })
  if (Number.isFinite(altitude)) params.set('alt', String(Math.round(altitude / 10) * 10))
  return params.toString()
}

export function fetchWeather(point, { signal } = {}) {
  const query = weatherQuery(point)
  if (!query) return Promise.reject(Object.assign(new Error('No coordinates'), { code: 'no-coordinates' }))
  const hit = memory.get(query)
  if (hit && Date.now() - hit.at < TTL_MS) return hit.promise
  const promise = fetch(`/api/weather?${query}`, { signal, headers: { Accept: 'application/json' } }).then(async response => {
    const body = await response.json().catch(() => null)
    if (!response.ok || body?.version !== 'pf-weather/1') throw Object.assign(new Error(body?.error || `Weather request failed (${response.status})`), { code: 'error' })
    return body
  })
  memory.set(query, { at: Date.now(), promise })
  promise.catch(() => memory.delete(query))
  return promise
}

// Older than this, a forecast is shown with a clear "may be out of date" note.
export const STALE_AFTER_MS = 3 * 60 * 60 * 1000
export const isStale = (data, now = Date.now()) => Boolean(data?.stale) || now - Date.parse(data?.fetched_at || 0) > STALE_AFTER_MS

// The forecast step closest to now (the cached "current" can be up to two hours old).
// Wind and cloud come only with data.current, so a later hourly step shows temperature and sky only.
export function currentStep(data, now = Date.now()) {
  const fresh = step => Date.parse(step.time) >= now - 30 * 60 * 1000
  if (fresh(data.current)) return data.current
  const hour = (data.hours || []).find(fresh)
  if (!hour) return data.current
  return { time: hour.time, air_temperature_c: hour.air_temperature_c, symbol: hour.symbol, precipitation_next_1h_mm: hour.precipitation_mm, wind_speed_ms: null, wind_from_deg: null }
}

const WORDS = [['clearsky', 'Clear'], ['partlycloudy', 'Partly cloudy'], ['fair', 'Fair'], ['cloudy', 'Cloudy'], ['fog', 'Fog'], ['heavyrainandthunder', 'Heavy rain and thunder'], ['heavysleetandthunder', 'Heavy sleet and thunder'], ['heavysnowandthunder', 'Heavy snow and thunder'], ['lightrainandthunder', 'Light rain and thunder'], ['lightsleetandthunder', 'Light sleet and thunder'], ['lightsnowandthunder', 'Light snow and thunder'], ['rainandthunder', 'Rain and thunder'], ['sleetandthunder', 'Sleet and thunder'], ['snowandthunder', 'Snow and thunder'], ['heavyrain', 'Heavy rain'], ['heavysleet', 'Heavy sleet'], ['heavysnow', 'Heavy snow'], ['lightrain', 'Light rain'], ['lightsleet', 'Light sleet'], ['lightsnow', 'Light snow'], ['rain', 'Rain'], ['sleet', 'Sleet'], ['snow', 'Snow']]
export function describeSymbol(code) {
  if (!code) return 'No summary'
  const base = code.replace(/_(day|night|polartwilight)$/, '')
  const showers = base.includes('showers'), core = base.replace('showers', '')
  const word = WORDS.find(([key]) => key === core)?.[1] || core
  return showers ? `${word} showers` : word
}
export const symbolKind = code => {
  const c = code || ''
  if (c.includes('thunder')) return 'thunder'
  if (c.includes('snow')) return 'snow'
  if (c.includes('sleet')) return 'sleet'
  if (c.includes('rain')) return 'rain'
  if (c.startsWith('fog')) return 'fog'
  if (c.startsWith('cloudy')) return 'cloud'
  if (c.startsWith('clearsky')) return c.endsWith('_night') ? 'night' : 'sun'
  if (c) return c.endsWith('_night') ? 'night-cloud' : 'sun-cloud'
  return 'cloud'
}

const COMPASS = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
export const compass = deg => COMPASS[Math.round(((deg % 360) + 360) % 360 / 22.5) % 16]
export const toF = c => Math.round(c * 9 / 5 + 32)
