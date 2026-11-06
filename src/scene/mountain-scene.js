// Live procedural mountain scene for the home hero. Raw WebGL2, no libraries.
// The terrain is generated, not a real mountain; the hero says so in its caption.
// createMountainScene returns null when WebGL2 is unavailable so the caller can keep its CSS fallback.

const LOOKS = {
  aurora: { uSkyTop: '#030a14', uSkyHor: '#0f3b44', uFog: '#061a20', uLow: '#04161a', uMid: '#0f3337', uLine: '#5ff0d6', uSweep: '#f2c66f', uAur: '#3dffb0', uWire: 0 },
  alpenglow: { uSkyTop: '#0b0d26', uSkyHor: '#c2653e', uFog: '#2a1a24', uLow: '#120f1a', uMid: '#3a2c3c', uLine: '#ffb07a', uSweep: '#ffe0a3', uAur: '#ff7aa8', uWire: 0 },
  hologram: { uSkyTop: '#01040c', uSkyHor: '#062a3a', uFog: '#020c14', uLow: '#020a10', uMid: '#06202a', uLine: '#4fe6ff', uSweep: '#ff6ad5', uAur: '#4f7bff', uWire: 1 },
}

function seededRandom(seed) {
  let a = seed
  return () => {
    a |= 0; a = a + 0x6D2B79F5 | 0
    let t = Math.imul(a ^ a >>> 15, 1 | a)
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t
    return ((t ^ t >>> 14) >>> 0) / 4294967296
  }
}

function buildTerrain(gridSize, random) {
  const order = [...Array(256).keys()]
  for (let i = 255; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [order[i], order[j]] = [order[j], order[i]] }
  const perm = new Uint8Array(512)
  for (let i = 0; i < 512; i++) perm[i] = order[i & 255]
  const grads = [[1, 1], [-1, 1], [1, -1], [-1, -1], [1, 0], [-1, 0], [0, 1], [0, -1]]
  const fade = t => t * t * t * (t * (t * 6 - 15) + 10)
  const lerp = (a, b, t) => a + (b - a) * t
  const noise = (x, y) => {
    const X = Math.floor(x), Y = Math.floor(y), xf = x - X, yf = y - Y, xi = X & 255, yi = Y & 255
    const g = (h, dx, dy) => { const v = grads[h & 7]; return v[0] * dx + v[1] * dy }
    const aa = perm[perm[xi] + yi], ab = perm[perm[xi] + yi + 1], ba = perm[perm[xi + 1] + yi], bb = perm[perm[xi + 1] + yi + 1], u = fade(xf), v = fade(yf)
    return lerp(lerp(g(aa, xf, yf), g(ba, xf - 1, yf), u), lerp(g(ab, xf, yf - 1), g(bb, xf - 1, yf - 1), u), v)
  }
  const ridged = (x, y) => {
    let sum = 0, amp = .5, freq = 1, weight = 1
    for (let i = 0; i < 6; i++) { let n = 1 - Math.abs(noise(x * freq, y * freq)); n *= n; n *= weight; weight = Math.min(1, n * 1.8); sum += n * amp; freq *= 2.07; amp *= .5 }
    return sum
  }
  const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t) }
  const height = (x, z) => {
    const d = Math.hypot(x, z)
    const ridgeLine = Math.exp(-Math.pow((z + 1.5 - x * .35) / 3.2, 2))
    const peaks = Math.exp(-Math.pow(Math.hypot(x - 1, z + 1.4) / 2.6, 2)) * 1.6 + Math.exp(-Math.pow(Math.hypot(x + 3.8, z - .2) / 2.2, 2)) * 1.1
      + Math.exp(-Math.pow(Math.hypot(x + 7.5, z + 2.6) / 2.4, 2)) * .9 + Math.exp(-Math.pow(Math.hypot(x + .5, z - 6) / 3, 2)) * .8
    const ring = Math.exp(-Math.pow((d - 16.5) / 3.6, 2)) * (1.4 + noise(x * .09 + 5, z * .09 + 1) * .9)
    const r = ridged(x * .12 + 11.3, z * .12 + 4.1), detail = ridged(x * .32 + 3, z * .32 + 8)
    const lift = ridgeLine * 1.3 + peaks + ring
    let h = Math.pow(r, 1.35) * (1.2 + lift * 1.9) + lift * 1.15 + detail * .35 * (.3 + lift) + noise(x * .05 + 2, z * .05 + 9) * .35
    h *= smooth(23, 20.5, d)
    return Math.max(0, h)
  }
  const span = 22, cells = gridSize - 1, step = 2 * span / cells
  const positions = new Float32Array(gridSize * gridSize * 3), normals = new Float32Array(gridSize * gridSize * 3), heights = new Float32Array(gridSize * gridSize)
  let maxHeight = 0
  for (let j = 0; j < gridSize; j++) for (let i = 0; i < gridSize; i++) {
    const x = (i / cells - .5) * 2 * span, z = (j / cells - .5) * 2 * span, h = height(x, z), k = j * gridSize + i
    heights[k] = h; maxHeight = Math.max(maxHeight, h); positions.set([x, h, z], k * 3)
  }
  for (let j = 0; j < gridSize; j++) for (let i = 0; i < gridSize; i++) {
    const k = j * gridSize + i
    const hl = heights[j * gridSize + Math.max(i - 1, 0)], hr = heights[j * gridSize + Math.min(i + 1, cells)]
    const hd = heights[Math.max(j - 1, 0) * gridSize + i], hu = heights[Math.min(j + 1, cells) * gridSize + i]
    const nx = hl - hr, ny = 2 * step, nz = hd - hu, l = Math.hypot(nx, ny, nz)
    normals.set([nx / l, ny / l, nz / l], k * 3)
  }
  const indices = new Uint32Array(cells * cells * 6)
  let q = 0
  for (let j = 0; j < cells; j++) for (let i = 0; i < cells; i++) { const a = j * gridSize + i, b = a + 1, c = a + gridSize, d = c + 1; indices.set([a, c, b, b, c, d], q); q += 6 }
  return { positions, normals, indices, maxHeight }
}

const PALETTE_UNIFORMS = 'uniform vec3 uSkyTop,uSkyHor,uFog,uLow,uMid,uLine,uSweep,uAur;uniform float uWire;'

const SKY_VS = `#version 300 es
in vec2 aP;out vec2 vUv;void main(){vUv=aP*.5+.5;gl_Position=vec4(aP,.9999,1.);}`
const SKY_FS = `#version 300 es
precision highp float;in vec2 vUv;out vec4 o;uniform float uTime,uAspect,uYaw;${PALETTE_UNIFORMS}
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+1.),f.x),f.y);}
void main(){vec2 uv=vUv;float y=uv.y;vec3 c=mix(uSkyHor,uSkyTop,smoothstep(.25,1.,y));
 vec2 sp=vec2(uv.x*uAspect+uYaw*.35,uv.y)*170.;float st=hash(floor(sp));float tw=.6+.4*sin(uTime*2.+st*40.);
 c+=vec3(.85,.95,1.)*step(.9965,st)*tw*smoothstep(.35,.8,y)*.9;
 float x=uv.x*uAspect*1.6+uYaw*.6;float band=.62+.07*sin(x*2.1+uTime*.13)+.04*sin(x*5.3-uTime*.21);
 float a=exp(-pow((y-band)*9.,2.))*(.55+.45*vn(vec2(x*3.,uTime*.25)));
 float curtain=smoothstep(band-.02,band+.28,y)*(1.-smoothstep(band+.05,band+.4,y))*vn(vec2(x*9.,uTime*.4))*.6;
 c+=uAur*(a+curtain)*.55;c+=uSkyHor*.35*exp(-pow((y-.33)*7.,2.));o=vec4(c,1.);}`

const TERRAIN_VS = `#version 300 es
in vec3 aPos;in vec3 aNor;uniform mat4 uVP;out vec3 vPos;out vec3 vNor;void main(){vPos=aPos;vNor=aNor;gl_Position=uVP*vec4(aPos,1.);}`
const TERRAIN_FS = `#version 300 es
precision highp float;in vec3 vPos;in vec3 vNor;out vec4 o;uniform float uTime,uMaxH;uniform vec3 uCam;${PALETTE_UNIFORMS}
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
void main(){vec3 n=normalize(vNor);float h=vPos.y/uMaxH;float slope=1.-n.y;
 vec3 sun=normalize(vec3(-.55,.38,-.75));float diff=max(dot(n,sun),0.);vec3 v=normalize(uCam-vPos);float rim=pow(1.-max(dot(n,v),0.),3.);
 vec3 col=mix(uLow,uMid,smoothstep(.0,.5,h));col=mix(col,uMid*1.5+vec3(.04),smoothstep(.3,.7,slope)*.6);
 float sl=.5+(hash(floor(vPos.xz*4.))-.5)*.05;float snow=smoothstep(sl,sl+.09,h)*(1.-smoothstep(.42,.78,slope));
 col=mix(col,vec3(.80,.90,1.),snow*(1.-uWire*.85));col*=.28+1.05*diff;col*=1.-uWire*.75;
 float ch=vPos.y*4.;float f=fract(ch);float dl=min(f,1.-f);float line=(1.-smoothstep(0.,fwidth(ch)*1.1,dl))*(1.-smoothstep(.5,.85,slope)*(1.-uWire*.6));
 col+=uLine*line*(.16+.7*h)*(1.-snow*.6*(1.-uWire))*(1.+uWire*1.6);
 vec2 gq=vPos.xz*.75;vec2 gg=abs(fract(gq)-.5)/fwidth(gq);float grid=1.-min(min(gg.x,gg.y),1.);col+=uLine*grid*(.05+uWire*.32);
 float r=length(vPos.xz);float wave=mod(uTime*2.4,30.)-2.;float band=exp(-pow((r-wave)*1.4,2.));
 col+=uSweep*band*(.18+line*.9+snow*.25);col+=uLine*rim*(.22+uWire*.3);
 float dist=length(uCam-vPos);float fog=smoothstep(11.,40.,dist)*.92;col=mix(col,mix(uFog,uSkyHor,.45),fog);
 col=mix(col,uFog,smoothstep(.06,0.,vPos.y)*.5);o=vec4(col,1.);}`

const SNOW_VS = `#version 300 es
in vec3 aS;uniform mat4 uVP;uniform float uTime,uDpr;out float vA;
void main(){vec3 p=vec3((aS.x-.5)*26.,0.,(aS.z-.5)*26.);p.y=mod(aS.y*9.-uTime*(.25+aS.x*.3),9.)-.5;p.x+=sin(uTime*.4+aS.z*20.)*.4;p.z+=cos(uTime*.3+aS.x*17.)*.3;
 vec4 c=uVP*vec4(p,1.);gl_Position=c;gl_PointSize=clamp(uDpr*(.8+aS.y*1.8)*11./c.w,1.,6.*uDpr);vA=(.25+aS.y*.6)*smoothstep(30.,8.,c.w);}`
const SNOW_FS = `#version 300 es
precision mediump float;in float vA;out vec4 o;uniform vec3 uLine;void main(){vec2 d=gl_PointCoord-.5;float a=smoothstep(.5,.1,length(d))*vA;o=vec4(mix(vec3(1.),uLine,.35)*a,a);}`

function perspective(fov, aspect, near, far, shift) {
  const t = 1 / Math.tan(fov / 2), nf = 1 / (near - far)
  return [t / aspect, 0, 0, 0, 0, t, 0, 0, -shift, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0]
}
function lookAt(eye, target) {
  let zx = eye[0] - target[0], zy = eye[1] - target[1], zz = eye[2] - target[2], l = Math.hypot(zx, zy, zz)
  zx /= l; zy /= l; zz /= l
  let xx = zz, xz = -zx
  l = Math.hypot(xx, xz); xx /= l; xz /= l
  const yx = zy * xz, yy = zz * xx - zx * xz, yz = -zy * xx
  return [xx, yx, zx, 0, 0, yy, zy, 0, xz, yz, zz, 0, -(xx * eye[0] + xz * eye[2]), -(yx * eye[0] + yy * eye[1] + yz * eye[2]), -(zx * eye[0] + zy * eye[1] + zz * eye[2]), 1]
}
function multiply(a, b) {
  const o = new Array(16)
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { let s = 0; for (let k = 0; k < 4; k++) s += a[k * 4 + j] * b[i * 4 + k]; o[i * 4 + j] = s }
  return o
}
const hexToRgb = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255)

export function createMountainScene(canvas, { look = 'aurora', interactionTarget = window } = {}) {
  const gl = canvas.getContext('webgl2', { antialias: true, alpha: false, powerPreference: 'high-performance' })
  if (!gl) return null
  const small = Math.min(window.innerWidth, window.innerHeight) < 760
  const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  const random = seededRandom(20261106)
  const terrain = buildTerrain(small ? 160 : 240, random)

  const compile = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s }
  const program = (vs, fs) => { const p = gl.createProgram(); gl.attachShader(p, compile(gl.VERTEX_SHADER, vs)); gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(p); if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p)); return p }
  let skyProgram, terrainProgram, snowProgram
  try {
    skyProgram = program(SKY_VS, SKY_FS); terrainProgram = program(TERRAIN_VS, TERRAIN_FS); snowProgram = program(SNOW_VS, SNOW_FS)
  } catch (error) {
    console.warn('Mountain scene unavailable:', error)
    return null
  }
  const vao = setup => { const v = gl.createVertexArray(); gl.bindVertexArray(v); setup(); gl.bindVertexArray(null); return v }
  const attribute = (data, loc, size) => { const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0) }
  const skyVao = vao(() => attribute(new Float32Array([-1, -1, 3, -1, -1, 3]), gl.getAttribLocation(skyProgram, 'aP'), 2))
  const terrainVao = vao(() => {
    attribute(terrain.positions, gl.getAttribLocation(terrainProgram, 'aPos'), 3)
    attribute(terrain.normals, gl.getAttribLocation(terrainProgram, 'aNor'), 3)
    const e = gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, e); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, terrain.indices, gl.STATIC_DRAW)
  })
  const snowCount = small ? 380 : 900, seeds = new Float32Array(snowCount * 3)
  for (let i = 0; i < seeds.length; i++) seeds[i] = random()
  const snowVao = vao(() => attribute(seeds, gl.getAttribLocation(snowProgram, 'aS'), 3))
  const uniforms = new Map()
  const u = (p, name) => { const key = p === skyProgram ? `s${name}` : p === terrainProgram ? `t${name}` : `n${name}`; if (!uniforms.has(key)) uniforms.set(key, gl.getUniformLocation(p, name)); return uniforms.get(key) }

  let palette = LOOKS[look] || LOOKS.aurora
  const applyPalette = p => {
    for (const [name, value] of Object.entries(palette)) {
      const loc = u(p, name)
      if (loc === null) continue
      if (name === 'uWire') gl.uniform1f(loc, value)
      else gl.uniform3fv(loc, hexToRgb(value))
    }
  }

  // Interaction: pointer steers on fine pointers; drag orbits everywhere (with momentum).
  let yaw = 0, pitch = 0, targetYaw = 0, targetPitch = 0, velocity = 0, drag = null
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  const onHover = e => { if (drag || e.pointerType === 'touch' || !finePointer) return; targetYaw = (e.clientX / window.innerWidth - .5) * .9; targetPitch = (e.clientY / window.innerHeight - .5) * .35; kick() }
  const onDown = e => { drag = { x: e.clientX, y: e.clientY, yaw: targetYaw, pitch: targetPitch }; canvas.setPointerCapture?.(e.pointerId); kick() }
  const onDrag = e => {
    if (!drag) return
    const next = drag.yaw - (e.clientX - drag.x) / window.innerWidth * 2.4
    velocity = (next - targetYaw) * .6; targetYaw = next
    targetPitch = Math.max(-.35, Math.min(.4, drag.pitch + (e.clientY - drag.y) / window.innerHeight * .9))
  }
  const onUp = () => { drag = null }
  interactionTarget.addEventListener('pointermove', onHover, { passive: true })
  canvas.addEventListener('pointerdown', onDown)
  canvas.addEventListener('pointermove', onDrag)
  canvas.addEventListener('pointerup', onUp)
  canvas.addEventListener('pointercancel', onUp)

  let width = 0, height = 0, dpr = 1, raf = 0, visible = true, still = reduceQuery.matches, clock = 0, last = performance.now(), destroyed = false
  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, small ? 1.25 : 1.75)
    width = Math.max(1, Math.round(canvas.clientWidth * dpr)); height = Math.max(1, Math.round(canvas.clientHeight * dpr))
    canvas.width = width; canvas.height = height; gl.viewport(0, 0, width, height)
  }
  const frame = now => {
    raf = 0
    if (destroyed) return
    const dt = Math.min(.05, (now - last) / 1000); last = now
    if (!still) clock += dt
    if (!drag) { targetYaw += velocity; velocity *= .94 }
    yaw += (targetYaw - yaw) * .06; pitch += (targetPitch - pitch) * .06
    const t = still ? 24 : clock, aspect = width / height, wide = aspect > 1.15
    const angle = .55 + t * .045 + yaw, radius = 11.6 + Math.sin(t * .09) * 1.3, elevation = 3.6 + Math.sin(t * .07) * .6 + pitch * 6
    const eye = [Math.sin(angle) * radius, elevation, Math.cos(angle) * radius]
    const viewProjection = multiply(perspective(wide ? .78 : .95, aspect, .1, 90, wide ? -.3 : 0), lookAt(eye, [0, 2.4 + pitch * 1.5, 0]))

    gl.disable(gl.DEPTH_TEST); gl.disable(gl.BLEND)
    gl.useProgram(skyProgram); applyPalette(skyProgram)
    gl.uniform1f(u(skyProgram, 'uTime'), t); gl.uniform1f(u(skyProgram, 'uAspect'), aspect); gl.uniform1f(u(skyProgram, 'uYaw'), angle)
    gl.bindVertexArray(skyVao); gl.drawArrays(gl.TRIANGLES, 0, 3)

    gl.enable(gl.DEPTH_TEST); gl.clear(gl.DEPTH_BUFFER_BIT)
    gl.useProgram(terrainProgram); applyPalette(terrainProgram)
    gl.uniformMatrix4fv(u(terrainProgram, 'uVP'), false, viewProjection)
    gl.uniform1f(u(terrainProgram, 'uTime'), t); gl.uniform1f(u(terrainProgram, 'uMaxH'), terrain.maxHeight); gl.uniform3fv(u(terrainProgram, 'uCam'), eye)
    gl.bindVertexArray(terrainVao); gl.drawElements(gl.TRIANGLES, terrain.indices.length, gl.UNSIGNED_INT, 0)

    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); gl.depthMask(false)
    gl.useProgram(snowProgram); applyPalette(snowProgram)
    gl.uniformMatrix4fv(u(snowProgram, 'uVP'), false, viewProjection); gl.uniform1f(u(snowProgram, 'uTime'), t); gl.uniform1f(u(snowProgram, 'uDpr'), dpr)
    gl.bindVertexArray(snowVao); gl.drawArrays(gl.POINTS, 0, snowCount); gl.depthMask(true)

    const settling = drag || Math.abs(targetYaw - yaw) > .001 || Math.abs(targetPitch - pitch) > .001 || Math.abs(velocity) > .0005
    if (visible && !document.hidden && (!still || settling)) raf = requestAnimationFrame(frame)
  }
  function kick() { if (!raf && !destroyed && visible && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(frame) } }
  const draw = () => { if (!raf && !destroyed) frame(performance.now()) }

  const resizeObserver = new ResizeObserver(() => { resize(); draw() })
  resizeObserver.observe(canvas)
  const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; kick() })
  intersection.observe(canvas)
  const onVisibility = () => kick()
  const onMotion = e => { still = e.matches; kick() }
  document.addEventListener('visibilitychange', onVisibility)
  reduceQuery.addEventListener?.('change', onMotion)
  resize(); draw(); kick()

  return {
    setLook(name) { palette = LOOKS[name] || palette; draw() },
    destroy() {
      destroyed = true; if (raf) cancelAnimationFrame(raf)
      resizeObserver.disconnect(); intersection.disconnect()
      document.removeEventListener('visibilitychange', onVisibility); reduceQuery.removeEventListener?.('change', onMotion)
      interactionTarget.removeEventListener('pointermove', onHover)
      canvas.removeEventListener('pointerdown', onDown); canvas.removeEventListener('pointermove', onDrag)
      canvas.removeEventListener('pointerup', onUp); canvas.removeEventListener('pointercancel', onUp)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    },
  }
}
