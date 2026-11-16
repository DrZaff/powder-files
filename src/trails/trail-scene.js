// Powder Files 3D trail map: OpenStreetMap runs and lifts (pf-trails/1) draped over open elevation data.
// Raw WebGL2, no libraries. Terrain comes from Mapzen Terrain Tiles (terrarium PNG) on AWS Open Data.
// Renders on demand; a gentle sway runs until the first interaction (never under reduced motion).

export const TERRAIN_TILE_URL = 'https://elevation-tiles-prod.s3.amazonaws.com/terrarium/{z}/{x}/{y}.png'
export const RUN_COLORS = {
  europe: { novice: '#22a35a', easy: '#2f6fe0', intermediate: '#e23b3b', advanced: '#111111', expert: '#111111', freeride: '#ef7d1a', extreme: '#ef7d1a' },
  north_america: { novice: '#22a35a', easy: '#22a35a', intermediate: '#2f6fe0', advanced: '#111111', expert: '#111111', freeride: '#ef7d1a', extreme: '#ef7d1a' },
  japan: { novice: '#22a35a', easy: '#22a35a', intermediate: '#e23b3b', advanced: '#111111', expert: '#111111', freeride: '#ef7d1a', extreme: '#ef7d1a' },
}
export const UNGRADED = '#7c8a96'
const EXAGGERATION = 1.25, GRID = 180, MAX_TILES_PER_AXIS = 3, MAX_TILES = 6, LIFT_HEIGHT = 14, PAD = .1
const rad = Math.PI / 180, EARTH = 6371000

// ---------- data decoding ----------
export function decodeTrails(file) {
  const [ox, oy] = file.origin, s = file.scale
  const decode = p => { const out = []; let x = 0, y = 0; for (let i = 0; i < p.length; i += 2) { x += p[i]; y += p[i + 1]; out.push([ox + x * s, oy + y * s]) } return out }
  return { runs: file.runs.map(r => ({ ...r, pts: decode(r.p) })), lifts: file.lifts.map(l => ({ ...l, pts: decode(l.p) })) }
}

// ---------- terrain tiles ----------
const tileX = (lon, z) => (lon + 180) / 360 * 2 ** z
const tileY = (lat, z) => (1 - Math.log(Math.tan(lat * rad) + 1 / Math.cos(lat * rad)) / Math.PI) / 2 * 2 ** z
// The map area is the trails' bounding box plus 10% on each side (shared by the elevation loader and the scene).
export const padBbox = ([w, s, e, n]) => { const dw = (e - w) * PAD, dn = (n - s) * PAD; return [w - dw, s - dn, e + dw, n + dn] }
// Highest zoom (max 13) that covers the area in at most 3×3 tiles and 6 tiles in total; the 180-point grid needs no more.
export function chooseTiles([w, s, e, n]) {
  let z = 13
  const span = z => [Math.floor(tileX(e, z)) - Math.floor(tileX(w, z)) + 1, Math.floor(tileY(s, z)) - Math.floor(tileY(n, z)) + 1]
  while (z > 9 && (Math.max(...span(z)) > MAX_TILES_PER_AXIS || span(z)[0] * span(z)[1] > MAX_TILES)) z--
  const x0 = Math.floor(tileX(w, z)), x1 = Math.floor(tileX(e, z)), y0 = Math.floor(tileY(n, z)), y1 = Math.floor(tileY(s, z))
  const tiles = []
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) tiles.push({ z, x, y })
  return { z, x0, y0, cols: x1 - x0 + 1, rows: y1 - y0 + 1, tiles }
}
export async function loadElevation(bbox, { signal } = {}) {
  const plan = chooseTiles(padBbox(bbox)), W = plan.cols * 256, H = plan.rows * 256
  const heights = new Float32Array(W * H)
  const canvas = typeof OffscreenCanvas !== 'undefined' ? new OffscreenCanvas(256, 256) : Object.assign(document.createElement('canvas'), { width: 256, height: 256 })
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  let loaded = 0
  await Promise.all(plan.tiles.map(async t => {
    try {
      const response = await fetch(TERRAIN_TILE_URL.replace('{z}', t.z).replace('{x}', t.x).replace('{y}', t.y), { signal, mode: 'cors' })
      if (!response.ok) throw new Error(`tile ${response.status}`)
      const bitmap = await createImageBitmap(await response.blob())
      // Decode immediately (the canvas is shared, and JS runs one callback at a time between awaits).
      ctx.drawImage(bitmap, 0, 0); const px = ctx.getImageData(0, 0, 256, 256).data; bitmap.close?.()
      const bx = (t.x - plan.x0) * 256, by = (t.y - plan.y0) * 256
      for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) { const i = (y * 256 + x) * 4; heights[(by + y) * W + bx + x] = px[i] * 256 + px[i + 1] + px[i + 2] / 256 - 32768 }
      loaded++
    } catch (error) { if (error.name === 'AbortError') throw error }
  }))
  if (!loaded) throw new Error('No terrain tiles could be loaded')
  const sample = (lon, lat) => {
    const fx = Math.min(W - 1.001, Math.max(0, (tileX(lon, plan.z) - plan.x0) * 256 - .5)), fy = Math.min(H - 1.001, Math.max(0, (tileY(lat, plan.z) - plan.y0) * 256 - .5))
    const x = Math.floor(fx), y = Math.floor(fy), dx = fx - x, dy = fy - y, i = y * W + x
    return (heights[i] * (1 - dx) + heights[i + 1] * dx) * (1 - dy) + (heights[i + W] * (1 - dx) + heights[i + W + 1] * dx) * dy
  }
  return { sample, zoom: plan.z, tiles: plan.tiles.length, missing: plan.tiles.length - loaded }
}

// ---------- small matrix helpers ----------
const perspective = (fovy, aspect, near, far) => { const f = 1 / Math.tan(fovy / 2), nf = 1 / (near - far); return [f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0] }
function lookAt(e, t, u) {
  let zx = e[0] - t[0], zy = e[1] - t[1], zz = e[2] - t[2]; let l = Math.hypot(zx, zy, zz); zx /= l; zy /= l; zz /= l
  let xx = u[1] * zz - u[2] * zy, xy = u[2] * zx - u[0] * zz, xz = u[0] * zy - u[1] * zx; l = Math.hypot(xx, xy, xz); xx /= l; xy /= l; xz /= l
  const yx = zy * xz - zz * xy, yy = zz * xx - zx * xz, yz = zx * xy - zy * xx
  return [xx, yx, zx, 0, xy, yy, zy, 0, xz, yz, zz, 0, -(xx * e[0] + xy * e[1] + xz * e[2]), -(yx * e[0] + yy * e[1] + yz * e[2]), -(zx * e[0] + zy * e[1] + zz * e[2]), 1]
}
const multiply = (a, b) => { const o = new Array(16); for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) o[c * 4 + r] = a[r] * b[c * 4] + a[4 + r] * b[c * 4 + 1] + a[8 + r] * b[c * 4 + 2] + a[12 + r] * b[c * 4 + 3]; return o }
const hex = c => [parseInt(c.slice(1, 3), 16) / 255, parseInt(c.slice(3, 5), 16) / 255, parseInt(c.slice(5, 7), 16) / 255]

const TERRAIN_VS = `#version 300 es
in vec3 a_pos; in vec3 a_nrm; uniform mat4 u_vp; uniform vec3 u_eye;
out vec3 v_n; out float v_h; out float v_d; out vec2 v_xz;
void main(){ v_n=a_nrm; v_h=a_pos.y; v_xz=a_pos.xz; v_d=distance(a_pos,u_eye); gl_Position=u_vp*vec4(a_pos,1.); }`
const TERRAIN_FS = `#version 300 es
precision highp float;
in vec3 v_n; in float v_h; in float v_d; in vec2 v_xz; uniform vec3 u_sun; uniform vec3 u_bg; uniform vec2 u_half; uniform float u_fog; uniform float u_ex;
out vec4 o;
void main(){
  vec3 n=normalize(v_n); float diff=max(dot(n,u_sun),0.); float slope=1.-n.y;
  vec3 col=mix(vec3(.47,.58,.78),vec3(.95,.97,1.),diff*.9+.1);
  col=mix(col,vec3(.47,.44,.43)*(.45+.65*diff),smoothstep(.42,.6,slope));
  float c=v_h/(50.*u_ex); float f=abs(fract(c-.5)-.5)/max(fwidth(c),1e-4); col*=1.-(1.-min(f,1.))*.13;
  vec2 e=abs(v_xz)/u_half; float edge=smoothstep(.82,1.,max(e.x,e.y));
  col=mix(col,u_bg,max(edge,smoothstep(u_fog*.55,u_fog,v_d)*.6));
  o=vec4(col,1.);
}`
// Screen-space ribbons: each segment is a quad extruded perpendicular to its on-screen direction.
const LINE_VS = `#version 300 es
in vec3 a_a; in vec3 a_b; in vec2 a_se; in vec3 a_col; uniform mat4 u_vp; uniform vec2 u_vpsize; uniform float u_width;
out vec3 v_col;
void main(){
  vec4 ca=u_vp*vec4(a_a,1.), cb=u_vp*vec4(a_b,1.); vec4 c=a_se.y<.5?ca:cb;
  vec2 sa=ca.xy/max(ca.w,1e-3)*u_vpsize, sb=cb.xy/max(cb.w,1e-3)*u_vpsize; vec2 d=sb-sa; d=length(d)<1e-4?vec2(1,0):normalize(d);
  c.xy+=vec2(-d.y,d.x)*a_se.x*u_width/u_vpsize*c.w; c.z-=.0006*c.w; v_col=a_col; gl_Position=c; }`
const POINT_VS = `#version 300 es
in vec3 a_a; in vec3 a_col; uniform mat4 u_vp; uniform float u_width; out vec3 v_col;
void main(){ vec4 c=u_vp*vec4(a_a,1.); c.z-=.0007*c.w; gl_Position=c; gl_PointSize=u_width; v_col=a_col; }`
const FLAT_FS = `#version 300 es
precision mediump float; in vec3 v_col; uniform vec4 u_override; uniform float u_round; out vec4 o;
void main(){ if(u_round>.5&&length(gl_PointCoord-.5)>.5)discard; o=vec4(u_override.a>0.?u_override.rgb:v_col,1.); }`

function program(gl, vs, fs) {
  const p = gl.createProgram()
  for (const [type, src] of [[gl.VERTEX_SHADER, vs], [gl.FRAGMENT_SHADER, fs]]) { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); gl.attachShader(p, s) }
  gl.linkProgram(p); if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p))
  const u = {}; for (let i = 0, n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS); i < n; i++) { const name = gl.getActiveUniform(p, i).name; u[name] = gl.getUniformLocation(p, name) }
  return { p, u, a: name => gl.getAttribLocation(p, name) }
}
function vao(gl, prog, layout, data) {
  const v = gl.createVertexArray(); gl.bindVertexArray(v)
  const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer); gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
  const stride = layout.reduce((n, [, size]) => n + size, 0) * 4; let offset = 0
  for (const [name, size] of layout) { const loc = prog.a(name); if (loc >= 0) { gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, size, gl.FLOAT, false, stride, offset) } offset += size * 4 }
  gl.bindVertexArray(null); return { v, buffer, count: data.length / (stride / 4) }
}

/**
 * createTrailScene(canvas, { trails, elevation, bbox, convention, background }) → { draw, reset, destroy } or null without WebGL2.
 */
export function createTrailScene(canvas, { trails, elevation, bbox, convention, background = '#071318' }) {
  const gl = canvas.getContext('webgl2', { antialias: true, alpha: false })
  if (!gl) return null
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const [W, S, E, N] = padBbox(bbox)
  const latC = (S + N) / 2, lonC = (W + E) / 2, kx = EARTH * rad * Math.cos(latC * rad), ky = EARTH * rad
  const halfX = (E - W) / 2 * kx, halfZ = (N - S) / 2 * ky
  const toX = lon => (lon - lonC) * kx, toZ = lat => -(lat - latC) * ky

  // Terrain grid (aspect-correct), heights in exaggerated metres relative to the lowest point.
  const nx = Math.max(24, Math.round(GRID * Math.min(1, halfX / halfZ))), nz = Math.max(24, Math.round(GRID * Math.min(1, halfZ / halfX)))
  const raw = new Float32Array(nx * nz)
  for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) raw[j * nx + i] = elevation.sample(W + (E - W) * i / (nx - 1), N - (N - S) * j / (nz - 1))
  let minH = Infinity, maxH = -Infinity; for (const h of raw) { if (h < minH) minH = h; if (h > maxH) maxH = h }
  const Y = h => (h - minH) * EXAGGERATION
  const gridY = (x, z) => { // bilinear on the mesh grid, so lines sit on the drawn surface
    const fi = Math.min(nx - 1.001, Math.max(0, (x + halfX) / (2 * halfX) * (nx - 1))), fj = Math.min(nz - 1.001, Math.max(0, (z + halfZ) / (2 * halfZ) * (nz - 1)))
    const i = Math.floor(fi), j = Math.floor(fj), a = fi - i, b = fj - j, k = j * nx + i
    return Y((raw[k] * (1 - a) + raw[k + 1] * a) * (1 - b) + (raw[k + nx] * (1 - a) + raw[k + nx + 1] * a) * b)
  }
  const verts = new Float32Array(nx * nz * 6), dx = 2 * halfX / (nx - 1), dz = 2 * halfZ / (nz - 1)
  for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) {
    const k = j * nx + i, h = l => Y(raw[Math.min(nz - 1, Math.max(0, j + l[1])) * nx + Math.min(nx - 1, Math.max(0, i + l[0]))])
    const gx = (h([1, 0]) - h([-1, 0])) / (2 * dx), gz = (h([0, 1]) - h([0, -1])) / (2 * dz), l = Math.hypot(gx, 1, gz)
    verts.set([-halfX + i * dx, Y(raw[k]), -halfZ + j * dz, -gx / l, 1 / l, -gz / l], k * 6)
  }
  const indices = new Uint32Array((nx - 1) * (nz - 1) * 6); let q = 0
  for (let j = 0; j < nz - 1; j++) for (let i = 0; i < nx - 1; i++) { const a = j * nx + i, b = a + 1, c = a + nx, d = c + 1; indices.set([a, c, b, b, c, d], q); q += 6 }

  // Lines: densify so runs follow the ground between sparse OSM nodes.
  const palette = RUN_COLORS[convention] || RUN_COLORS.europe
  const segs = [], pts = [], liftSegs = [], stations = []
  const lift = 7 * EXAGGERATION
  let topRun = null, bottomRun = null
  for (const run of trails.runs) {
    const col = hex(palette[run.d] || UNGRADED), path = []
    for (let i = 0; i < run.pts.length; i++) {
      const [lon, lat] = run.pts[i], x = toX(lon), z = toZ(lat)
      if (i) { const [px, pz] = path[path.length - 1], steps = Math.ceil(Math.hypot(x - px, z - pz) / 25); for (let s = 1; s < steps; s++) path.push([px + (x - px) * s / steps, pz + (z - pz) * s / steps]) }
      path.push([x, z])
    }
    const p3 = path.map(([x, z]) => [x, gridY(x, z) + lift, z])
    for (const p of p3) { if (!topRun || p[1] > topRun[1]) topRun = p; if (!bottomRun || p[1] < bottomRun[1]) bottomRun = p }
    for (let i = 1; i < p3.length; i++) segs.push([p3[i - 1], p3[i], col, run.a ? .55 : 1])
    if (!run.a) for (const p of p3) pts.push([p, col])
  }
  const cable = hex('#26303a')
  for (const l of trails.lifts) {
    const p3 = l.pts.map(([lon, lat]) => { const x = toX(lon), z = toZ(lat); return [x, gridY(x, z) + LIFT_HEIGHT * EXAGGERATION, z] })
    for (let i = 1; i < p3.length; i++) liftSegs.push([p3[i - 1], p3[i], cable, 1])
    if (p3.length) stations.push([p3[0], cable], [p3[p3.length - 1], cable])
  }
  const ribbon = list => { const out = new Float32Array(list.length * 6 * 11); let o = 0; for (const [a, b, col] of list) for (const [side, end] of [[-1, 0], [1, 0], [-1, 1], [-1, 1], [1, 0], [1, 1]]) { out.set([...a, ...b, side, end, ...col], o); o += 11 } return out }
  const pointData = list => new Float32Array(list.flatMap(([p, col]) => [...p, ...col]))

  const terrainP = program(gl, TERRAIN_VS, TERRAIN_FS), lineP = program(gl, LINE_VS, FLAT_FS), pointP = program(gl, POINT_VS, FLAT_FS)
  const terrain = vao(gl, terrainP, [['a_pos', 3], ['a_nrm', 3]], verts)
  gl.bindVertexArray(terrain.v); const ibo = gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW); gl.bindVertexArray(null)
  const runLayout = [['a_a', 3], ['a_b', 3], ['a_se', 2], ['a_col', 3]]
  const mainRuns = vao(gl, lineP, runLayout, ribbon(segs.filter(s => s[3] === 1))), areaRuns = vao(gl, lineP, runLayout, ribbon(segs.filter(s => s[3] !== 1)))
  const lifts = vao(gl, lineP, runLayout, ribbon(liftSegs))
  const joins = vao(gl, pointP, [['a_a', 3], ['a_col', 3]], pointData(pts)), stationPts = vao(gl, pointP, [['a_a', 3], ['a_col', 3]], pointData(stations))

  // Camera: start on the valley side looking up the runs.
  const bg = hex(background), radius = Math.hypot(halfX, halfZ), centerY = (Y(minH) + Y(maxH)) / 2
  const valley = topRun && bottomRun ? [bottomRun[0] - topRun[0], bottomRun[2] - topRun[2]] : [0, 1]
  const home = { yaw: Math.atan2(valley[0], valley[1]) || 0, pitch: 38 * rad, dist: radius * 1.55 }
  const cam = { ...home }
  let raf = 0, swayStart = performance.now(), interacted = reduceMotion, destroyed = false

  function draw(now = performance.now()) {
    raf = 0
    if (destroyed) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2), cw = Math.max(1, Math.round(canvas.clientWidth * dpr)), ch = Math.max(1, Math.round(canvas.clientHeight * dpr))
    if (canvas.width !== cw || canvas.height !== ch) { canvas.width = cw; canvas.height = ch }
    const yaw = cam.yaw + (interacted ? 0 : Math.sin((now - swayStart) / 5200) * .22)
    const eye = [Math.cos(cam.pitch) * Math.sin(yaw) * cam.dist, centerY + Math.sin(cam.pitch) * cam.dist, Math.cos(cam.pitch) * Math.cos(yaw) * cam.dist]
    const vp = multiply(perspective(40 * rad, cw / ch, cam.dist / 40, cam.dist * 5), lookAt(eye, [0, centerY * .8, 0], [0, 1, 0]))
    gl.viewport(0, 0, cw, ch); gl.clearColor(...bg, 1); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL)
    gl.useProgram(terrainP.p)
    gl.uniformMatrix4fv(terrainP.u.u_vp, false, vp); gl.uniform3fv(terrainP.u.u_eye, eye); gl.uniform3f(terrainP.u.u_sun, -.45, .7, .55); gl.uniform3fv(terrainP.u.u_bg, bg)
    gl.uniform2f(terrainP.u.u_half, halfX, halfZ); gl.uniform1f(terrainP.u.u_fog, cam.dist * 3.2); gl.uniform1f(terrainP.u.u_ex, EXAGGERATION)
    gl.bindVertexArray(terrain.v); gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_INT, 0)
    const lines = (geom, width, override) => { gl.useProgram(lineP.p); gl.uniformMatrix4fv(lineP.u.u_vp, false, vp); gl.uniform2f(lineP.u.u_vpsize, cw / 2, ch / 2); gl.uniform1f(lineP.u.u_width, width * dpr / 2); gl.uniform4fv(lineP.u.u_override, override || [0, 0, 0, 0]); gl.uniform1f(lineP.u.u_round, 0); gl.bindVertexArray(geom.v); gl.drawArrays(gl.TRIANGLES, 0, geom.count) }
    const dots = (geom, size, override) => { gl.useProgram(pointP.p); gl.uniformMatrix4fv(pointP.u.u_vp, false, vp); gl.uniform1f(pointP.u.u_width, size * dpr); gl.uniform4fv(pointP.u.u_override, override || [0, 0, 0, 0]); gl.uniform1f(pointP.u.u_round, 1); gl.bindVertexArray(geom.v); gl.drawArrays(gl.POINTS, 0, geom.count) }
    const scale = Math.min(1.4, Math.max(.75, radius * 1.55 / cam.dist))
    lines(areaRuns, 1.5 * scale)
    // White casings don't write depth, so the coloured line drawn at the same depth always lands on top.
    gl.depthMask(false); lines(mainRuns, 5.5 * scale, [1, 1, 1, 1]); dots(joins, 5.5 * scale, [1, 1, 1, 1]); gl.depthMask(true)
    lines(mainRuns, 3.2 * scale); dots(joins, 3.2 * scale)
    lines(lifts, 1.8 * scale)
    gl.depthMask(false); dots(stationPts, 7 * scale, [1, 1, 1, 1]); gl.depthMask(true); dots(stationPts, 4.5 * scale)
    gl.bindVertexArray(null)
    if (!interacted && !document.hidden) raf = requestAnimationFrame(draw)
  }
  const request = () => { if (!raf && !destroyed) raf = requestAnimationFrame(draw) }
  const stopSway = () => { if (!interacted) { cam.yaw += Math.sin((performance.now() - swayStart) / 5200) * .22; interacted = true } }

  // Pointer: drag to orbit, two fingers or wheel to zoom, double-click to reset.
  const pointers = new Map(); let pinch = 0
  const clampCam = () => { cam.pitch = Math.min(80 * rad, Math.max(12 * rad, cam.pitch)); cam.dist = Math.min(radius * 4, Math.max(radius * .35, cam.dist)) }
  const onDown = e => { stopSway(); canvas.setPointerCapture(e.pointerId); pointers.set(e.pointerId, [e.clientX, e.clientY]); if (pointers.size === 2) { const [a, b] = [...pointers.values()]; pinch = Math.hypot(a[0] - b[0], a[1] - b[1]) } }
  const onMove = e => {
    if (!pointers.has(e.pointerId)) return
    const [px, py] = pointers.get(e.pointerId); pointers.set(e.pointerId, [e.clientX, e.clientY])
    if (pointers.size === 1) { cam.yaw -= (e.clientX - px) * .006; cam.pitch += (e.clientY - py) * .005 }
    else if (pointers.size === 2) { const [a, b] = [...pointers.values()], d = Math.hypot(a[0] - b[0], a[1] - b[1]); if (pinch) cam.dist *= pinch / d; pinch = d }
    clampCam(); request()
  }
  const onUp = e => { pointers.delete(e.pointerId); pinch = 0 }
  const onWheel = e => { e.preventDefault(); stopSway(); cam.dist *= Math.exp(e.deltaY * .0012); clampCam(); request() }
  const reset = () => { Object.assign(cam, home); interacted = true; request() }
  const onKey = e => {
    const step = { ArrowLeft: () => (cam.yaw += .12), ArrowRight: () => (cam.yaw -= .12), ArrowUp: () => (cam.pitch += .06), ArrowDown: () => (cam.pitch -= .06), '+': () => (cam.dist *= .85), '=': () => (cam.dist *= .85), '-': () => (cam.dist /= .85), '0': reset }[e.key]
    if (!step) return
    e.preventDefault(); stopSway(); step(); clampCam(); request()
  }
  canvas.addEventListener('pointerdown', onDown); canvas.addEventListener('pointermove', onMove); canvas.addEventListener('pointerup', onUp); canvas.addEventListener('pointercancel', onUp)
  canvas.addEventListener('wheel', onWheel, { passive: false }); canvas.addEventListener('dblclick', reset); canvas.addEventListener('keydown', onKey)
  const resize = new ResizeObserver(() => request()); resize.observe(canvas)
  const onVisibility = () => { if (!document.hidden) request() }
  document.addEventListener('visibilitychange', onVisibility)
  request()

  return {
    draw: request,
    reset,
    zoom(factor) { stopSway(); cam.dist *= factor; clampCam(); request() },
    stats: { minElevation: Math.round(minH), maxElevation: Math.round(maxH) },
    destroy() {
      destroyed = true; if (raf) cancelAnimationFrame(raf); resize.disconnect()
      canvas.removeEventListener('pointerdown', onDown); canvas.removeEventListener('pointermove', onMove); canvas.removeEventListener('pointerup', onUp); canvas.removeEventListener('pointercancel', onUp)
      canvas.removeEventListener('wheel', onWheel); canvas.removeEventListener('dblclick', reset); canvas.removeEventListener('keydown', onKey)
      document.removeEventListener('visibilitychange', onVisibility)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    },
  }
}
