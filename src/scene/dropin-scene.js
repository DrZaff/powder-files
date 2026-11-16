// "Drop in": a layered photo scene (generated images of a fictional mountain).
// Wide screens stack four layers (sky, far range, couloir, skis) that shift at different depths with the
// pointer, an idle drift and scroll. Tall screens use one portrait photo with a slow drift. Spindrift blows
// off the cornice, and a 'pf-dropin' window event plays a short zoom over the edge and back.
import skyUrl from '../assets/dropin/sky.webp'
import rangeUrl from '../assets/dropin/range.webp'
import couloirUrl from '../assets/dropin/couloir.webp'
import skisUrl from '../assets/dropin/skis.webp'
import phoneUrl from '../assets/dropin/phone.webp'

const LAYERS = [
  { url: skyUrl, depth: .08 },
  { url: rangeUrl, depth: .3 },
  { url: couloirUrl, depth: .65 },
  { url: skisUrl, depth: 1 },
]
const SHIFT = .022, DROP_MS = 2600
// Sun position in each source image (fractions), used for the glow and spindrift light.
const SUN = { wide: [.107, .227], tall: [.073, .305] }

const loadImage = url => new Promise((resolve, reject) => { const img = new Image(); img.decoding = 'async'; img.onload = () => resolve(img); img.onerror = reject; img.src = url })

export function createDropinScene(canvas) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  let W = 1, H = 1, dpr = 1, tall = false, images = null, raf = 0, active = false, visible = true, destroyed = false
  let dropStart = -1, last = performance.now()
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 }
  const flakes = []

  const onPointer = e => { if (!fine) return; pointer.tx = e.clientX / window.innerWidth - .5; pointer.ty = e.clientY / window.innerHeight - .5 }
  const onDrop = () => { if (reduceQuery.matches) return; dropStart = performance.now(); burst(); kick() }
  window.addEventListener('pointermove', onPointer, { passive: true })
  window.addEventListener('pf-dropin', onDrop)

  // Spindrift: soft, sunlit grains blowing off the cornice from the left, drifting up and across.
  const spawn = (x, y, fast) => ({ x, y, vx: (fast ? 90 : 26) + Math.random() * (fast ? 140 : 46), vy: -(4 + Math.random() * (fast ? 50 : 16)), r: .6 + Math.random() * 1.9, life: 0, max: 3 + Math.random() * 5, a: .25 + Math.random() * .55 })
  const seedFlakes = () => {
    flakes.length = 0
    const n = Math.round((tall ? 70 : 140) * Math.min(1, W / (1200 * dpr)) + 30)
    for (let i = 0; i < n; i++) { const f = spawn(Math.random() * W * .7, H * (.45 + Math.random() * .5), false); f.life = Math.random() * f.max; flakes.push(f) }
  }
  const burst = () => { for (let i = 0; i < 90; i++) flakes.push(spawn(Math.random() * W, boxH() * (.75 + Math.random() * .25), true)) }

  // The photo fills the rest of the first screen below the canvas top; the veil fades it into the page below.
  let pageTop = 0
  const boxH = () => Math.min(H, Math.max(320 * dpr, (window.innerHeight - pageTop) * dpr))

  function drawCover(img, depth, box, zoom, offX, offY) {
    // Anchored to the bottom so the ski tips stay in frame; any crop comes off the sky.
    const base = Math.max(W / img.width, box / img.height), scale = base * zoom
    const w = img.width * scale, h = img.height * scale
    ctx.drawImage(img, (W - w) / 2 + offX * depth, box - h + (h - img.height * base) / 2 + offY * depth, w, h)
  }

  function draw(now) {
    const box = boxH()
    let d = 0
    if (dropStart >= 0) { const t = (now - dropStart) / DROP_MS; if (t >= 1) dropStart = -1; else d = Math.sin(Math.PI * Math.min(1, t)) ** 1.4 }
    const drift = reduceQuery.matches ? 0 : now / 1000
    const px = (pointer.x + Math.sin(drift * .21) * .18) * W * SHIFT * 2
    const py = (pointer.y + Math.sin(drift * .17 + 1) * .12) * box * SHIFT * 2
    const scroll = Math.max(0, -canvas.getBoundingClientRect().top) * dpr
    ctx.fillStyle = '#0a1220'; ctx.fillRect(0, 0, W, H)
    if (!images || !(tall ? images.phone : images.layers)) return
    if (tall) {
      // One portrait photo: slow breathing zoom plus the drop-in plunge.
      drawCover(images.phone, 1, box, 1.06 + Math.sin(drift * .12) * .02 + d * .35, -px * .6, -py * .6 - d * box * .18 + scroll * .25)
    } else {
      // Over the edge: near layers zoom and sink fastest, far layers barely move.
      for (const [i, layer] of LAYERS.entries()) {
        const img = images.layers[i], dz = d * (.04 + layer.depth ** 2 * .9)
        drawCover(img, layer.depth, box, 1.06 + dz, -px, -py + scroll * (1 - layer.depth) * .35 - d * box * (layer.depth * .35 - .08) + (i === 3 ? d * box * .5 : 0))
      }
    }
    // Low sun glow.
    const [sx, sy] = SUN[tall ? 'tall' : 'wide'], gx = sx * W, gy = sy * box
    const glow = ctx.createRadialGradient(gx, gy, 0, gx, gy, W * .45)
    glow.addColorStop(0, `rgba(255,190,110,${.22 + Math.sin(drift * .8) * .04})`); glow.addColorStop(1, 'rgba(255,190,110,0)')
    ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = glow; ctx.fillRect(0, 0, W, box)
    for (const f of flakes) {
      const fade = Math.min(1, f.life / .6, (f.max - f.life) / 1.2)
      ctx.globalAlpha = Math.max(0, fade * f.a); ctx.fillStyle = '#ffe2b8'
      ctx.beginPath(); ctx.arc(f.x, f.y, f.r * dpr, 0, Math.PI * 2); ctx.fill()
    }
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'
    // White-out at the bottom of the drop.
    if (d > .8) { ctx.fillStyle = `rgba(245,248,255,${(d - .8) * 2.5})`; ctx.fillRect(0, 0, W, box) }
    if (box < H) { const fade = ctx.createLinearGradient(0, box - 160 * dpr, 0, box); fade.addColorStop(0, 'rgba(10,18,32,0)'); fade.addColorStop(1, '#0a1220'); ctx.fillStyle = fade; ctx.fillRect(0, box - 160 * dpr, W, 160 * dpr) }
  }

  function step(dt) {
    pointer.x += (pointer.tx - pointer.x) * Math.min(1, dt * 3)
    pointer.y += (pointer.ty - pointer.y) * Math.min(1, dt * 3)
    const box = boxH(), gust = 1 + Math.max(0, Math.sin(performance.now() / 2300)) * 1.6
    for (let i = flakes.length - 1; i >= 0; i--) {
      const f = flakes[i]
      f.life += dt; f.x += f.vx * gust * dt * dpr; f.y += (f.vy + Math.sin(f.life * 2 + f.r) * 8) * dt * dpr
      if (f.life > f.max || f.x > W + 20) {
        if (flakes.length > 260) { flakes.splice(i, 1); continue }
        Object.assign(f, spawn(-10 + Math.random() * W * .25, box * (.55 + Math.random() * .4), false))
      }
    }
  }

  function frame(now) {
    raf = 0
    if (!active || destroyed) return
    const dt = Math.min(.05, (now - last) / 1000); last = now
    step(dt); draw(now)
    if (!reduceQuery.matches && visible && !document.hidden) raf = requestAnimationFrame(frame)
  }
  const kick = () => { if (!raf && active && visible && !destroyed && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(frame) } }

  // Only fetch the set this screen shape needs; a resize that flips wide/tall fetches the other set.
  let loading = null
  const ensureImages = () => {
    const have = images && (tall ? images.phone : images.layers)
    if (have || destroyed) return loading || Promise.resolve()
    const want = tall
    loading = (want ? loadImage(phoneUrl).then(phone => ({ ...images, phone })) : Promise.all(LAYERS.map(l => loadImage(l.url))).then(layers => ({ ...images, layers })))
      .then(set => { images = set; loading = null; if (!destroyed) draw(performance.now()); if (want !== tall) return ensureImages() })
    return loading
  }
  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    W = Math.max(1, Math.round(canvas.clientWidth * dpr)); H = Math.max(1, Math.round(canvas.clientHeight * dpr))
    canvas.width = W; canvas.height = H
    pageTop = Math.max(0, canvas.getBoundingClientRect().top + window.scrollY)
    tall = canvas.clientWidth / Math.max(1, Math.min(canvas.clientHeight, window.innerHeight)) < .9
    seedFlakes(); draw(performance.now()); ensureImages()
  }
  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(canvas)
  const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; kick() })
  intersection.observe(canvas)
  const onVisibility = () => kick()
  document.addEventListener('visibilitychange', onVisibility)
  resize()

  return {
    // Resolves once the first photo can be drawn, so the page can fade the canvas in without a dark flash.
    ready: ensureImages(),
    start() { active = true; draw(performance.now()); kick() },
    stop() { active = false; if (raf) cancelAnimationFrame(raf); raf = 0 },
    destroy() {
      destroyed = true; active = false; if (raf) cancelAnimationFrame(raf)
      resizeObserver.disconnect(); intersection.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pointermove', onPointer); window.removeEventListener('pf-dropin', onDrop)
    },
  }
}
