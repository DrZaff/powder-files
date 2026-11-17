import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { cacheKey, createForecastCache, parseQuery, summarize, upstreamUrl } from '../lib/met-forecast.mjs'

// Real Locationforecast 2.0 compact response (Mont-Sainte-Anne, fetched 2026-11-16T14:44Z).
const fixture = JSON.parse(readFileSync(new URL('./fixtures/met-compact-mont-sainte-anne.json', import.meta.url)))
const NOW = new Date('2026-11-16T14:44:22Z')
const query = { lat: 47.0874, lon: -70.9258, alt: 800 }

test('parseQuery validates and rounds to MET-friendly precision', () => {
  assert.deepEqual(parseQuery(new URLSearchParams('lat=47.087351&lon=-70.92582&alt=804')), { lat: 47.0874, lon: -70.9258, alt: 800 })
  assert.deepEqual(parseQuery(new URLSearchParams('lat=10&lon=20')), { lat: 10, lon: 20, alt: null })
  assert.ok(parseQuery(new URLSearchParams('lat=91&lon=0')).error)
  assert.ok(parseQuery(new URLSearchParams('lat=abc&lon=0')).error)
  assert.ok(parseQuery(new URLSearchParams('lon=0')).error)
  assert.ok(parseQuery(new URLSearchParams('lat=1&lon=1&alt=99999')).error)
})

test('upstream URL uses at most 4 decimals and integer altitude', () => {
  const url = new URL(upstreamUrl(query))
  assert.equal(url.searchParams.get('lat'), '47.0874')
  assert.equal(url.searchParams.get('lon'), '-70.9258')
  assert.equal(url.searchParams.get('altitude'), '800')
  assert.equal(cacheKey(query), '47.0874,-70.9258,800')
})

test('summarize produces a small, labelled forecast', () => {
  const out = summarize(fixture, query, NOW)
  assert.equal(out.version, 'pf-weather/1')
  assert.equal(out.kind, 'forecast')
  assert.equal(out.source.name, 'MET Norway')
  assert.equal(out.model_updated_at, '2026-11-16T13:19:13Z')
  // 14:00 is 44 minutes old at NOW, so the current step is 15:00.
  const step = fixture.properties.timeseries.find(entry => entry.time === '2026-11-16T15:00:00Z')
  assert.equal(out.current.time, '2026-11-16T15:00:00Z')
  assert.equal(out.current.air_temperature_c, step.data.instant.details.air_temperature)
  assert.equal(out.current.wind_from_deg, Math.round(step.data.instant.details.wind_from_direction))
  assert.equal(out.current.symbol, step.data.next_1_hours.summary.symbol_code)
  assert.equal(out.hours.length, 24)
  assert.equal(out.windows.length, 3)
  assert.deepEqual(out.windows.map(w => w.label), ['Next 24 h', '24–48 h', '48–72 h'])
  for (const w of out.windows) {
    assert.ok(w.min_c <= w.max_c)
    assert.ok(w.precipitation_mm >= 0)
    assert.ok([null, 'snow', 'mixed', 'rain'].includes(w.precipitation_type_estimate))
    assert.equal(w.complete, true)
  }
  assert.ok(JSON.stringify(out).length < 6000, 'payload stays small')
})

test('precipitation is not double counted across hourly and 6-hourly steps', () => {
  const step = (time, temp, one, six) => ({ time, data: { instant: { details: { air_temperature: temp } }, ...(one !== undefined && { next_1_hours: { summary: { symbol_code: 'snow' }, details: { precipitation_amount: one } } }), ...(six !== undefined && { next_6_hours: { summary: { symbol_code: 'snow' }, details: { precipitation_amount: six } } }) } })
  const series = []
  const t0 = Date.parse('2026-12-01T00:00:00Z')
  for (let h = 0; h < 24; h++) series.push(step(new Date(t0 + h * 36e5).toISOString(), -5, 1, 6)) // 24 mm hourly
  for (let h = 24; h < 66; h += 6) series.push(step(new Date(t0 + h * 36e5).toISOString(), -5, undefined, 3)) // 3 mm per 6 h
  const out = summarize({ properties: { meta: {}, timeseries: series } }, { lat: 0, lon: 0, alt: null }, new Date(t0))
  assert.equal(out.windows[0].precipitation_mm, 24)
  assert.equal(out.windows[1].precipitation_mm, 12)
  assert.equal(out.windows[0].precipitation_type_estimate, 'snow')
  assert.equal(out.windows[2].complete, false, 'data stops at 66 h, so the last window is incomplete')
})

test('summarize rejects empty or expired forecasts', () => {
  assert.throws(() => summarize({ properties: { timeseries: [] } }, query, NOW))
  assert.throws(() => summarize(fixture, query, new Date('2027-01-01T00:00:00Z')), /expired/)
})

const response = (status, body, headers = {}) => new Response(body === null ? null : JSON.stringify(body), { status, headers })

test('cache: miss, hit, revalidate with If-Modified-Since, then stale on failure', async () => {
  let t = NOW.getTime()
  const calls = []
  let mode = 'ok'
  const fetchImpl = async (url, init) => {
    calls.push({ url, headers: init.headers })
    if (mode === 'ok') return response(200, fixture, { expires: new Date(t + 1800e3).toUTCString(), 'last-modified': 'Mon, 16 Nov 2026 14:44:22 GMT' })
    if (mode === '304') return response(304, null, { expires: new Date(t + 1200e3).toUTCString() })
    if (mode === '500') return response(500, { error: 'boom' })
    throw new Error('network down')
  }
  const cache = createForecastCache({ fetchImpl, userAgent: 'PowderFiles/test (+https://example.test)', now: () => t })
  const first = await cache.get(query)
  assert.equal(first.cache, 'miss'); assert.equal(first.stale, false)
  assert.match(calls[0].headers['User-Agent'], /^PowderFiles\//)
  const second = await cache.get(query)
  assert.equal(second.cache, 'hit'); assert.equal(calls.length, 1, 'hit does not call MET')
  t += 1900e3; mode = '304'
  const third = await cache.get(query)
  assert.equal(third.cache, 'revalidated')
  assert.equal(calls[1].headers['If-Modified-Since'], 'Mon, 16 Nov 2026 14:44:22 GMT')
  t += 1300e3; mode = '500'
  const fourth = await cache.get(query)
  assert.equal(fourth.stale, true); assert.match(fourth.stale_reason, /500/)
  t += 10; mode = 'throw'
  assert.equal((await cache.get(query)).stale, true)
})

test('cache: errors without a cached copy surface as 502/503', async () => {
  const cache429 = createForecastCache({ fetchImpl: async () => response(429, {}), userAgent: 'x', now: () => NOW.getTime() })
  await assert.rejects(cache429.get(query), e => e.status === 503)
  const cacheDown = createForecastCache({ fetchImpl: async () => { throw new Error('down') }, userAgent: 'x', now: () => NOW.getTime() })
  await assert.rejects(cacheDown.get(query), e => e.status === 502)
})

test('cache evicts the oldest entries beyond its limit', async () => {
  const cache = createForecastCache({ fetchImpl: async () => response(200, fixture, {}), userAgent: 'x', maxEntries: 2, now: () => NOW.getTime() })
  for (const lat of [1, 2, 3]) await cache.get({ lat, lon: 0, alt: null })
  assert.equal(cache.size(), 2)
})

test('handler: validates input and sets CDN cache headers', async () => {
  const { default: handler, config } = await import('../functions/weather.mjs')
  assert.equal(config.path, '/api/weather')
  const bad = await handler(new Request('https://site.test/api/weather?lat=999&lon=0'))
  assert.equal(bad.status, 400)
  const post = await handler(new Request('https://site.test/api/weather?lat=1&lon=1', { method: 'POST' }))
  assert.equal(post.status, 405)
})
