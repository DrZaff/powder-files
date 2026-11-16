// "Retro 90s": original 16-colour pixel-art slope (trees, slalom gates, moguls and a skier who follows the pointer).
// Canvas 2D at a tiny internal resolution, scaled up with crisp pixels. All sprites are original.

function seededRandom(seed) {
  let a = seed
  return () => {
    a |= 0; a = a + 0x6D2B79F5 | 0
    let t = Math.imul(a ^ a >>> 15, 1 | a)
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t
    return ((t ^ t >>> 14) >>> 0) / 4294967296
  }
}

const PALETTE = { g: '#00aa00', G: '#005500', t: '#aa5500', w: '#d5e3ff', r: '#aaaaaa', R: '#555555', m: '#b9cff5', p: '#222244', F: '#aa0000', B: '#0000aa', y: '#ffd200', s: '#f0b48a', j: '#e00000', n: '#1a1aa8', k: '#111111', x: '#333333' }
const SPRITES = {
  tree: ['....g....', '...ggg...', '..gggGG..', '...ggg...', '..gggGG..', '.ggggggG.', '..ggggg..', '.ggggGGG.', 'gggggGGGG', '....t....', '...wtw...'],
  rock: ['.rrr.', 'rrrRR', 'RRRRR'],
  mogul: ['.mmm.', 'm...m'],
  red: ['pFFF', 'pFFF', 'p...', 'p...', 'p...'],
  blue: ['pBBB', 'pBBB', 'p...', 'p...', 'p...'],
  skier: ['.yyy.', '.sss.', 'xjjjx', 'jjjjj', 'xjjjx', '.n.n.', '.n.n.', 'k.k.k'],
}

export function createRetroScene(canvas) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  const random = seededRandom(1991)
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  let RW = 192, RH = 120, objects = [], tracks = [], skierX = 96, raf = 0, active = false, visible = true, destroyed = false, acc = 0, last = performance.now(), gate = 0, travelled = 0
  const pointer = { x: null }
  const onPointer = e => { if (fine) pointer.x = e.clientX / window.innerWidth }
  window.addEventListener('pointermove', onPointer, { passive: true })

  const add = (type, x, y) => objects.push({ type, x: Math.round(x), y: Math.round(y) })
  const populate = (y0, y1) => {
    for (let y = y0; y < y1; y += 6) {
      if (random() < .55) add('tree', random() * RW * .32, y)
      if (random() < .55) add('tree', RW - 10 - random() * RW * .32, y)
      if (random() < .08) add('rock', RW * .3 + random() * RW * .4, y)
      if (random() < .12) add('mogul', RW * .2 + random() * RW * .6, y)
    }
  }
  const addGate = y => { const c = RW / 2 + Math.sin(gate * 1.3) * RW * .12, colour = gate % 2 ? 'blue' : 'red'; add(colour, c - 12, y); add(colour, c + 9, y); gate++ }
  const seed = () => { objects = []; tracks = []; populate(0, RH + 30); for (let y = 20; y < RH + 30; y += 26) addGate(y); travelled = 0 }
  const blit = (name, x, y) => {
    const s = SPRITES[name]
    for (let r = 0; r < s.length; r++) for (let c = 0; c < s[r].length; c++) { const ch = s[r][c]; if (ch !== '.') { ctx.fillStyle = PALETTE[ch]; ctx.fillRect(x + c, y + r, 1, 1) } }
  }
  function draw() {
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, RW, RH)
    ctx.fillStyle = '#e4ecff'
    for (let i = 0; i < 40; i++) ctx.fillRect((i * 53) % RW, ((i * 29) + travelled) % RH, 1, 1)
    ctx.fillStyle = '#c9d6f2'
    for (const p of tracks) { ctx.fillRect(p.x, p.y, 1, 1); ctx.fillRect(p.x + 3, p.y, 1, 1) }
    const skierY = Math.round(RH * .36)
    let skierDrawn = false
    for (const o of objects.slice().sort((a, b) => a.y - b.y)) {
      if (!skierDrawn && o.y > skierY) { blit('skier', Math.round(skierX) - 2, skierY); skierDrawn = true }
      blit(o.type, o.x, o.y)
    }
    if (!skierDrawn) blit('skier', Math.round(skierX) - 2, skierY)
  }
  function step() {
    for (const o of objects) o.y -= 1
    for (const p of tracks) p.y -= 1
    travelled += 1
    objects = objects.filter(o => o.y > -14); tracks = tracks.filter(p => p.y > -2)
    const target = pointer.x !== null ? pointer.x * RW : RW / 2 + Math.sin(performance.now() / 1400) * RW * .14
    skierX += Math.max(-1.2, Math.min(1.2, (target - skierX) * .08))
    tracks.push({ x: Math.round(skierX) - 1, y: Math.round(RH * .36) + 7 })
    if (objects.length && Math.max(...objects.map(o => o.y)) < RH + 8) populate(RH + 8, RH + 14)
    if (travelled % 26 === 0) addGate(RH + 10)
  }
  function frame(now) {
    raf = 0
    if (!active || destroyed) return
    acc += Math.min(.25, (now - last) / 1000); last = now
    while (acc > 1 / 22) { step(); acc -= 1 / 22 }
    draw()
    if (!reduceQuery.matches && visible && !document.hidden) raf = requestAnimationFrame(frame)
  }
  const kick = () => { if (!raf && active && visible && !destroyed && !document.hidden && !reduceQuery.matches) { last = performance.now(); raf = requestAnimationFrame(frame) } }
  const resize = () => {
    const aspect = canvas.clientWidth / Math.max(1, canvas.clientHeight)
    RH = 120; RW = Math.max(96, Math.round(RH * aspect)); canvas.width = RW; canvas.height = RH
    ctx.imageSmoothingEnabled = false
    seed(); skierX = RW / 2; draw()
  }
  const resizeObserver = new ResizeObserver(resize)
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
    },
  }
}
