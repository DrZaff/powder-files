// GET /api/weather?lat=..&lon=..&alt=..  →  pf-weather/1 JSON (see netlify/lib/met-forecast.mjs).
// A small proxy and cache in front of MET Norway, so browsers never call the provider directly.
import { createForecastCache, parseQuery } from '../lib/met-forecast.mjs'

// MET asks for an identifying User-Agent with contact details. Netlify sets URL to the site's main address.
const site = process.env.URL || 'https://github.com/DrZaff/powder-files'
const cache = createForecastCache({ userAgent: `PowderFiles/0.2 (+${site})` })

const json = (body, status, extra = {}) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'X-Content-Type-Options': 'nosniff', ...extra },
})

export default async function handler(request) {
  if (request.method !== 'GET') return json({ error: 'Method not allowed' }, 405, { Allow: 'GET' })
  const query = parseQuery(new URL(request.url).searchParams)
  if (query.error) return json({ error: query.error }, 400, { 'Cache-Control': 'public, max-age=3600' })
  try {
    const body = await cache.get(query)
    const ttl = Math.max(60, body.ttl)
    delete body.ttl
    return json(body, 200, {
      // Browsers keep it briefly; Netlify's shared CDN cache keeps it until MET's Expires, keyed by the rounded query.
      'Cache-Control': 'public, max-age=300',
      'Netlify-CDN-Cache-Control': `public, s-maxage=${ttl}, stale-while-revalidate=1800, durable`,
      'Netlify-Vary': 'query=lat|lon|alt',
    })
  } catch (error) {
    return json({ error: error.message || 'Forecast unavailable' }, error.status || 502, { 'Cache-Control': 'no-store' })
  }
}

export const config = { path: '/api/weather' }
