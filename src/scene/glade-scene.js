// "Glade run": first-person powder run through a snow-loaded tree glade. Raw WebGL2, no libraries.
// The terrain is generated, not a real run; the home hero caption says so.
// createGladeScene returns null when WebGL2 is unavailable so the caller keeps its CSS fallback.

function seededRandom(seed) {
  let a = seed
  return () => {
    a |= 0; a = a + 0x6D2B79F5 | 0
    let t = Math.imul(a ^ a >>> 15, 1 | a)
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t
    return ((t ^ t >>> 14) >>> 0) / 4294967296
  }
}
const lerp = (a, b, t) => a + (b - a) * t
const pathX = wz => Math.sin(wz * .045) * 6 + Math.sin(wz * .11 + 1.3) * 2
const hash = (x, y) => { const v = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return v - Math.floor(v) }
const valueNoise = (x, y) => {
  const ix = Math.floor(x), iy = Math.floor(y)
  let fx = x - ix, fy = y - iy
  fx = fx * fx * (3 - 2 * fx); fy = fy * fy * (3 - 2 * fy)
  return lerp(lerp(hash(ix, iy), hash(ix + 1, iy), fx), lerp(hash(ix, iy + 1), hash(ix + 1, iy + 1), fx), fy)
}
const groundHeight = (x, z, travel) => {
  const wz = z + travel, d = Math.abs(x - pathX(wz))
  return -z * .32 + valueNoise(x * .35, wz * .35) * .7 + valueNoise(x * .9, wz * .9) * .22 + Math.pow(Math.max(0, d - 7), 2) * .03
}

const LIB = `uniform float uTravel;uniform vec3 uSun,uCam;
float h2(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h2(i),h2(i+vec2(1,0)),f.x),mix(h2(i+vec2(0,1)),h2(i+1.),f.x),f.y);}
float pathX(float wz){return sin(wz*.045)*6.+sin(wz*.11+1.3)*2.;}
float H(float x,float z){float wz=z+uTravel;float d=abs(x-pathX(wz));return -z*.32+vn(vec2(x*.35,wz*.35))*.7+vn(vec2(x*.9,wz*.9))*.22+pow(max(0.,d-7.),2.)*.03;}
vec3 skyCol(vec3 d){vec3 zen=vec3(.04,.2,.62),hor=vec3(.62,.82,1.);vec3 c=mix(hor,zen,smoothstep(0.,.6,d.y));c=mix(vec3(.85,.92,1.),c,smoothstep(-.2,.02,d.y));
 float s=max(dot(d,uSun),0.);return c+vec3(1.,.95,.85)*pow(s,10.)*.45+vec3(1.)*pow(s,120.)*1.5+vec3(1.)*smoothstep(.9994,.9997,s)*3.;}
vec3 fogIt(vec3 col,vec3 p){float dist=length(uCam-p);vec3 vd=normalize(p-uCam);float f=smoothstep(24.,96.,dist)*.85;return mix(col,mix(skyCol(vec3(vd.x,max(vd.y,0.),vd.z)),vec3(.8,.88,1.),.3),f);}`

const SKY_VS = `#version 300 es
in vec2 aP;out vec2 vP;void main(){vP=aP;gl_Position=vec4(aP,.9999,1.);}`
const SKY_FS = `#version 300 es
precision highp float;in vec2 vP;out vec4 o;uniform vec3 uF,uR,uU;uniform vec2 uTan;${LIB}
void main(){vec3 d=normalize(uF+vP.x*uTan.x*uR+vP.y*uTan.y*uU);o=vec4(skyCol(d),1.);}`
const GROUND_VS = `#version 300 es
in vec2 aG;uniform mat4 uVP;uniform float uCamX;${LIB}out vec3 vPos;out vec3 vNor;out float vWz;
void main(){float x=aG.x+uCamX,z=aG.y,y=H(x,z),e=.15;vNor=normalize(vec3(H(x-e,z)-H(x+e,z),2.*e,H(x,z-e)-H(x,z+e)));vPos=vec3(x,y,z);vWz=z+uTravel;gl_Position=uVP*vec4(vPos,1.);}`
const GROUND_FS = `#version 300 es
precision highp float;in vec3 vPos;in vec3 vNor;in float vWz;out vec4 o;uniform float uTime;${LIB}
void main(){vec3 n=normalize(vNor);float dif=max(dot(n,uSun),0.);vec3 c=mix(vec3(.5,.66,.98),vec3(1.,.99,.97),smoothstep(0.,.5,dif));c*=.9+.25*dif;
 float dist=length(uCam-vPos);c+=step(.9955,h2(floor(vec2(vPos.x,vWz)*22.)+floor(uTime*6.)))*smoothstep(16.,1.5,dist)*(.3+dif)*1.4;
 o=vec4(fogIt(c,vPos),1.);}`
const TREE_VS = `#version 300 es
in vec3 aPos;in vec3 aNor;in vec4 aI;uniform mat4 uVP;${LIB}out vec3 vPos;out vec3 vNor;out float vY;
void main(){float z=mod(aI.y-uTravel,96.)-4.;float wz=z+uTravel;float x=pathX(wz)+aI.x;vec3 p=aPos*aI.z;vY=aPos.y;vPos=vec3(x,H(x,z)-.15,z)+p;vNor=aNor;gl_Position=uVP*vec4(vPos,1.);}`
const TREE_FS = `#version 300 es
precision highp float;in vec3 vPos;in vec3 vNor;in float vY;out vec4 o;${LIB}
void main(){vec3 n=normalize(vNor);float dif=max(dot(n,uSun),0.);
 float snow=smoothstep(.12,.5,n.y+(h2(floor(vPos.xz*5.+vY*7.))-.5)*.35);
 vec3 needle=mix(vec3(.01,.08,.05),vec3(.07,.24,.12),dif);vec3 c=mix(needle,mix(vec3(.62,.74,1.),vec3(1.,.99,.96),smoothstep(.0,.5,dif)),snow*.9);
 if(vY<.62)c=mix(vec3(.16,.1,.06),vec3(.32,.2,.12),dif);o=vec4(fogIt(c,vPos),1.);}`
const SPRAY_VS = `#version 300 es
in vec3 aS;uniform mat4 uVP;uniform float uTime,uDpr,uTurn;uniform vec3 uEye,uR,uF;out float vA;
void main(){float life=fract(uTime*1.6+aS.x);float dir=uTurn>0.?-1.:1.;
 vec3 o=uEye+uF*2.4-vec3(0.,1.55,0.)+uR*dir*.25;
 vec3 p=o+uR*dir*life*(1.2+aS.y*2.4)+vec3(0.,life*(1.4+aS.z*1.2)-life*life*1.9,0.)-uF*life*(1.5+aS.z*2.);
 vec4 c=uVP*vec4(p,1.);gl_Position=c;gl_PointSize=clamp(uDpr*(2.+aS.y*4.)*(1.+life*1.5)*5./c.w,1.,22.*uDpr);vA=(1.-life)*min(1.,abs(uTurn)*7.)*.55;}`
const SPRAY_FS = `#version 300 es
precision mediump float;in float vA;out vec4 o;void main(){float a=smoothstep(.5,.0,length(gl_PointCoord-.5))*vA;o=vec4(vec3(1.)*a,a);}`

export function createGladeScene(canvas) {
  const gl = canvas.getContext('webgl2', { antialias: true, alpha: false, powerPreference: 'high-performance' })
  if (!gl) return null
  const small = Math.min(window.innerWidth, window.innerHeight) < 760
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  const random = seededRandom(20261116)

  const compile = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s }
  const program = (vs, fs) => { const p = gl.createProgram(); gl.attachShader(p, compile(gl.VERTEX_SHADER, vs)); gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(p); if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p)); return p }
  let skyP, groundP, treeP, sprayP
  try { skyP = program(SKY_VS, SKY_FS); groundP = program(GROUND_VS, GROUND_FS); treeP = program(TREE_VS, TREE_FS); sprayP = program(SPRAY_VS, SPRAY_FS) }
  catch (error) { console.warn('Glade scene unavailable:', error); return null }

  const vao = setup => { const v = gl.createVertexArray(); gl.bindVertexArray(v); setup(); gl.bindVertexArray(null); return v }
  const attribute = (data, loc, size, instanced) => { const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0); if (instanced) gl.vertexAttribDivisor(loc, 1) }

  // Ground grid in camera-relative coordinates, denser near the camera.
  const GX = small ? 90 : 130, GZ = small ? 110 : 160, groundGrid = new Float32Array(GX * GZ * 2)
  for (let j = 0; j < GZ; j++) for (let i = 0; i < GX; i++) groundGrid.set([-34 + 68 * i / (GX - 1), -3 + 93 * Math.pow(j / (GZ - 1), 1.4)], (j * GX + i) * 2)
  const groundIndex = new Uint32Array((GX - 1) * (GZ - 1) * 6)
  let q = 0
  for (let j = 0; j < GZ - 1; j++) for (let i = 0; i < GX - 1; i++) { const a = j * GX + i, b = a + 1, c = a + GX, d = c + 1; groundIndex.set([a, c, b, b, c, d], q); q += 6 }
  const groundVao = vao(() => { attribute(groundGrid, gl.getAttribLocation(groundP, 'aG'), 2); const e = gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, e); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, groundIndex, gl.STATIC_DRAW) })

  // One low-poly snow-loaded pine: trunk plus three cone tiers, drawn instanced.
  const positions = [], normals = [], SEG = 9
  const cone = (y0, y1, r) => {
    const h = y1 - y0
    const slant = a => { const v = [Math.cos(a) * h, r, Math.sin(a) * h], l = Math.hypot(...v); return v.map(c => c / l) }
    for (let k = 0; k < SEG; k++) {
      const a0 = k / SEG * Math.PI * 2, a1 = (k + 1) / SEG * Math.PI * 2
      positions.push(Math.cos(a0) * r, y0, Math.sin(a0) * r, 0, y1, 0, Math.cos(a1) * r, y0, Math.sin(a1) * r)
      normals.push(...slant(a0), ...slant((a0 + a1) / 2), ...slant(a1))
      positions.push(Math.cos(a0) * r, y0, Math.sin(a0) * r, Math.cos(a1) * r, y0, Math.sin(a1) * r, 0, y0, 0)
      normals.push(0, -1, 0, 0, -1, 0, 0, -1, 0)
    }
  }
  const cylinder = (y0, y1, r) => {
    for (let k = 0; k < 6; k++) {
      const a0 = k / 6 * Math.PI * 2, a1 = (k + 1) / 6 * Math.PI * 2, c0 = [Math.cos(a0), 0, Math.sin(a0)], c1 = [Math.cos(a1), 0, Math.sin(a1)]
      positions.push(c0[0] * r, y0, c0[2] * r, c0[0] * r, y1, c0[2] * r, c1[0] * r, y0, c1[2] * r, c1[0] * r, y0, c1[2] * r, c0[0] * r, y1, c0[2] * r, c1[0] * r, y1, c1[2] * r)
      normals.push(...c0, ...c0, ...c1, ...c1, ...c0, ...c1)
    }
  }
  cylinder(0, .65, .13); cone(.6, 2.5, 1.45); cone(1.6, 3.5, 1.08); cone(2.6, 4.5, .72)
  const treeVertexCount = positions.length / 3, treeCount = small ? 170 : 300, instances = new Float32Array(treeCount * 4)
  for (let i = 0; i < treeCount; i++) { const side = random() < .5 ? -1 : 1; instances.set([side * (2.8 + Math.pow(random(), 1.25) * 27), random() * 96, .75 + random() * .85, random()], i * 4) }
  const treeVao = vao(() => {
    attribute(new Float32Array(positions), gl.getAttribLocation(treeP, 'aPos'), 3)
    attribute(new Float32Array(normals), gl.getAttribLocation(treeP, 'aNor'), 3)
    attribute(instances, gl.getAttribLocation(treeP, 'aI'), 4, true)
  })
  const sprayCount = small ? 90 : 160, spraySeeds = new Float32Array(sprayCount * 3)
  for (let i = 0; i < spraySeeds.length; i++) spraySeeds[i] = random()
  const sprayVao = vao(() => attribute(spraySeeds, gl.getAttribLocation(sprayP, 'aS'), 3))
  const skyVao = vao(() => attribute(new Float32Array([-1, -1, 3, -1, -1, 3]), gl.getAttribLocation(skyP, 'aP'), 2))

  const uniforms = new Map()
  const U = (p, name) => { const key = `${[skyP, groundP, treeP, sprayP].indexOf(p)}${name}`; if (!uniforms.has(key)) uniforms.set(key, gl.getUniformLocation(p, name)); return uniforms.get(key) }
  const sun = (() => { const v = [-.35, .55, .76], l = Math.hypot(...v); return v.map(c => c / l) })()
  const normalize = v => { const l = Math.hypot(...v); return v.map(c => c / l) }
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]

  const pointer = { x: 0, y: 0 }
  const onPointer = e => { if (!fine) return; pointer.x = e.clientX / window.innerWidth - .5; pointer.y = e.clientY / window.innerHeight - .5; kick() }
  window.addEventListener('pointermove', onPointer, { passive: true })

  let width = 1, height = 1, dpr = 1, travel = 40, clock = 0, last = performance.now(), raf = 0, active = false, visible = true, destroyed = false, camY = null
  const look = { x: 0, y: 0 }
  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, small ? 1.2 : 1.6)
    width = Math.max(1, Math.round(canvas.clientWidth * dpr)); height = Math.max(1, Math.round(canvas.clientHeight * dpr))
    canvas.width = width; canvas.height = height; gl.viewport(0, 0, width, height)
  }
  function frame(now) {
    raf = 0
    if (!active || destroyed) return
    const still = reduceQuery.matches, dt = Math.min(.05, (now - last) / 1000); last = now
    if (!still) { clock += dt; travel += dt * 7.5 }
    look.x += (pointer.x - look.x) * .05; look.y += (pointer.y - look.y) * .05
    const ex = pathX(travel), groundY = groundHeight(ex, 0, travel) + 1.75
    camY = camY === null ? groundY : camY + (groundY - camY) * .18
    const eye = [ex, camY, 0], tz = 11, tx = pathX(travel + tz) + look.x * 6, ty = groundHeight(pathX(travel + tz), tz, travel) + 1.1 - look.y * 5
    const f = normalize([tx - ex, ty - camY, tz])
    let r = normalize(cross(f, [0, 1, 0])), u = cross(r, f)
    const curvature = (pathX(travel + 4) - 2 * pathX(travel) + pathX(travel - 4)) / 16, roll = Math.max(-.22, Math.min(.22, curvature * -7))
    const cr = Math.cos(roll), sr = Math.sin(roll)
    const r2 = [r[0] * cr + u[0] * sr, r[1] * cr + u[1] * sr, r[2] * cr + u[2] * sr], u2 = [u[0] * cr - r[0] * sr, u[1] * cr - r[1] * sr, u[2] * cr - r[2] * sr]
    r = r2; u = u2
    const aspect = width / height, fov = small ? 1.25 : 1.1, tanY = Math.tan(fov / 2), tanX = tanY * aspect, near = .1, far = 160, A = 1 / tanY
    const proj = [A / aspect, 0, 0, 0, 0, A, 0, 0, 0, 0, (far + near) / (near - far), -1, 0, 0, 2 * far * near / (near - far), 0]
    const view = [r[0], u[0], -f[0], 0, r[1], u[1], -f[1], 0, r[2], u[2], -f[2], 0, -(r[0] * eye[0] + r[1] * eye[1] + r[2] * eye[2]), -(u[0] * eye[0] + u[1] * eye[1] + u[2] * eye[2]), (f[0] * eye[0] + f[1] * eye[1] + f[2] * eye[2]), 1]
    const vp = new Array(16)
    for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { let s = 0; for (let k = 0; k < 4; k++) s += proj[k * 4 + j] * view[i * 4 + k]; vp[i * 4 + j] = s }
    const bindProgram = p => { gl.useProgram(p); gl.uniform1f(U(p, 'uTravel'), travel); gl.uniform3fv(U(p, 'uSun'), sun); gl.uniform3fv(U(p, 'uCam'), eye) }

    gl.disable(gl.DEPTH_TEST); gl.disable(gl.BLEND)
    bindProgram(skyP); gl.uniform3fv(U(skyP, 'uF'), f); gl.uniform3fv(U(skyP, 'uR'), r); gl.uniform3fv(U(skyP, 'uU'), u); gl.uniform2f(U(skyP, 'uTan'), tanX, tanY)
    gl.bindVertexArray(skyVao); gl.drawArrays(gl.TRIANGLES, 0, 3)
    gl.enable(gl.DEPTH_TEST); gl.clear(gl.DEPTH_BUFFER_BIT)
    bindProgram(groundP); gl.uniformMatrix4fv(U(groundP, 'uVP'), false, vp); gl.uniform1f(U(groundP, 'uCamX'), ex); gl.uniform1f(U(groundP, 'uTime'), clock)
    gl.bindVertexArray(groundVao); gl.drawElements(gl.TRIANGLES, groundIndex.length, gl.UNSIGNED_INT, 0)
    bindProgram(treeP); gl.uniformMatrix4fv(U(treeP, 'uVP'), false, vp)
    gl.bindVertexArray(treeVao); gl.drawArraysInstanced(gl.TRIANGLES, 0, treeVertexCount, treeCount)
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); gl.depthMask(false)
    bindProgram(sprayP); gl.uniformMatrix4fv(U(sprayP, 'uVP'), false, vp); gl.uniform1f(U(sprayP, 'uTime'), clock); gl.uniform1f(U(sprayP, 'uDpr'), dpr)
    gl.uniform1f(U(sprayP, 'uTurn'), still ? 0 : curvature); gl.uniform3fv(U(sprayP, 'uEye'), eye); gl.uniform3fv(U(sprayP, 'uR'), r); gl.uniform3fv(U(sprayP, 'uF'), f)
    gl.bindVertexArray(sprayVao); gl.drawArrays(gl.POINTS, 0, sprayCount); gl.depthMask(true)

    const settling = Math.abs(pointer.x - look.x) > .002 || Math.abs(pointer.y - look.y) > .002
    if (visible && !document.hidden && (!still || settling)) raf = requestAnimationFrame(frame)
  }
  function kick() { if (!raf && active && visible && !destroyed && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(frame) } }
  const draw = () => { if (active && !raf && !destroyed) frame(performance.now()) }

  const resizeObserver = new ResizeObserver(() => { resize(); draw() })
  resizeObserver.observe(canvas)
  const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; kick() })
  intersection.observe(canvas)
  const onVisibility = () => kick()
  document.addEventListener('visibilitychange', onVisibility)
  resize()

  return {
    start() { active = true; draw(); kick() },
    stop() { active = false; if (raf) cancelAnimationFrame(raf); raf = 0 },
    destroy() {
      destroyed = true; active = false; if (raf) cancelAnimationFrame(raf)
      resizeObserver.disconnect(); intersection.disconnect()
      document.removeEventListener('visibilitychange', onVisibility); window.removeEventListener('pointermove', onPointer)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    },
  }
}
