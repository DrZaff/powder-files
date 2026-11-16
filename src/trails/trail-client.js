// Trail-map data built by tools/trail-maps/build-trail-maps.mjs (© OpenStreetMap contributors, ODbL).
//   /data/trails/index.json        { version, data_date, resorts: { [resortId]: { key, runs, lifts, km, coverage, match, cropped } } }
//   /data/trails/<key>.json        pf-trails/1 runs and lifts for one resort
//   /data/trails/<key>.svg         plan-view thumbnail (snow background, coloured runs, dashed lifts)
let indexPromise = null
export function loadTrailIndex() {
  indexPromise ||= fetch('/data/trails/index.json').then(r => { if (!r.ok) throw new Error('Trail index unavailable'); return r.json() }).catch(error => { indexPromise = null; throw error })
  return indexPromise
}
export const trailKey = resortId => resortId.replace(/[^A-Za-z0-9]+/g, '_')
// For cards: the thumbnail URL when the index lists this resort, otherwise null (show the existing art).
export const trailThumbUrl = (index, resortId) => (index?.resorts?.[resortId] ? `/data/trails/${index.resorts[resortId].key}.svg` : null)
export async function loadTrails(resortId) {
  const index = await loadTrailIndex(), entry = index.resorts[resortId]
  if (!entry) return null
  const response = await fetch(`/data/trails/${entry.key}.json`)
  if (!response.ok) throw new Error('Trail map unavailable')
  return { entry, file: await response.json(), dataDate: index.data_date }
}
export const CONVENTION_LABEL = { europe: 'European grading', north_america: 'North American grading', japan: 'Japanese grading' }
export const LEGEND = {
  europe: [['novice', 'Green · beginner'], ['easy', 'Blue · easy'], ['intermediate', 'Red · intermediate'], ['advanced', 'Black · difficult'], ['freeride', 'Orange · freeride']],
  north_america: [['easy', 'Green · easiest'], ['intermediate', 'Blue · more difficult'], ['advanced', 'Black · most difficult'], ['freeride', 'Orange · freeride']],
  japan: [['easy', 'Green · beginner'], ['intermediate', 'Red · intermediate'], ['advanced', 'Black · advanced'], ['freeride', 'Orange · freeride']],
}
