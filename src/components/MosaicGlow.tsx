import { useEffect, useRef } from 'react'

const CELL = 24
const RADIUS = 120
const TRAIL = 12

type Spark = { x: number; y: number; life: number; hue: number }

export default function MosaicGlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    let w = 0
    let h = 0
    let cols = 0
    let rows = 0
    let raf = 0
    let running = true

    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 }
    const trail: { x: number; y: number }[] = []
    const sparks: Spark[] = []
    let phase: Float32Array = new Float32Array(0)
    let scrollFade = 1

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cols = Math.ceil(w / CELL) + 1
      rows = Math.ceil(h / CELL) + 1
      phase = new Float32Array(cols * rows)
      for (let i = 0; i < phase.length; i++) phase[i] = Math.random() * Math.PI * 2
    }

    const onMove = (e: PointerEvent) => {
      mouse.tx = e.clientX
      mouse.ty = e.clientY
      if (Math.random() > 0.55) {
        sparks.push({
          x: e.clientX + (Math.random() - 0.5) * 40,
          y: e.clientY + (Math.random() - 0.5) * 40,
          life: 1,
          hue: 18 + Math.random() * 28,
        })
        if (sparks.length > 80) sparks.shift()
      }
    }

    const onLeave = () => {
      mouse.tx = -9999
      mouse.ty = -9999
    }

    const onScroll = () => {
      // Strong only near top; fade so lower sections feel different
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      scrollFade = Math.max(0, 1 - (window.scrollY / max) * 2.4)
      canvas.style.opacity = String(scrollFade * 0.95)
    }

    const draw = (t: number) => {
      if (!running) return
      if (scrollFade < 0.04) {
        ctx.clearRect(0, 0, w, h)
        raf = requestAnimationFrame(draw)
        return
      }
      mouse.x += (mouse.tx - mouse.x) * 0.22
      mouse.y += (mouse.ty - mouse.y) * 0.22

      trail.push({ x: mouse.x, y: mouse.y })
      if (trail.length > TRAIL) trail.shift()

      ctx.clearRect(0, 0, w, h)

      const time = t * 0.001
      const r2 = RADIUS * RADIUS

      for (let gy = 0; gy < rows; gy++) {
        for (let gx = 0; gx < cols; gx++) {
          const cx = gx * CELL + CELL * 0.5
          const cy = gy * CELL + CELL * 0.5

          // distance to cursor + trail influence
          let best = Infinity
          for (let i = 0; i < trail.length; i++) {
            const p = trail[i]
            const dx = cx - p.x
            const dy = cy - p.y
            const d = dx * dx + dy * dy
            // older trail weaker / wider
            const boost = 1 + (1 - i / trail.length) * 0.35
            best = Math.min(best, d / boost)
          }
          if (best > r2 * 1.35) continue

          const dist = Math.sqrt(best)
          const falloff = Math.max(0, 1 - dist / (RADIUS * 1.15))
          if (falloff < 0.02) continue

          const ph = phase[gy * cols + gx]
          // flowing mosaic shimmer
          const flow =
            0.55 +
            0.45 *
              Math.sin(time * 4.2 + ph + cx * 0.035 - cy * 0.02 + mouse.x * 0.004)
          const pulse = falloff * falloff * flow
          const inset = 1.5 + (1 - pulse) * 3

          // mosaic tile fill — ember → gold stream
          const warmth = 0.35 + pulse * 0.65
          const r = Math.floor(180 + warmth * 75)
          const g = Math.floor(40 + warmth * 110 * flow)
          const b = Math.floor(18 + (1 - flow) * 30)
          const alpha = pulse * 0.34 * scrollFade

          ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`
          ctx.fillRect(gx * CELL + inset, gy * CELL + inset, CELL - inset * 2, CELL - inset * 2)

          // bright edge streak (流光)
          if (pulse > 0.45) {
            const streak = (Math.sin(time * 6 + ph * 2 + gx * 0.4) + 1) * 0.5
            ctx.fillStyle = `rgba(255,${200 + streak * 40},${140},${pulse * streak * 0.55})`
            const sw = Math.max(2, (CELL - inset * 2) * (0.15 + streak * 0.35))
            ctx.fillRect(gx * CELL + inset, gy * CELL + inset, sw, CELL - inset * 2)
          }
        }
      }

      // soft core glow under cursor
      if (mouse.x > -100) {
        const grd = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, RADIUS)
        grd.addColorStop(0, 'rgba(255,120,40,0.18)')
        grd.addColorStop(0.35, 'rgba(230,35,20,0.1)')
        grd.addColorStop(1, 'rgba(230,35,20,0)')
        ctx.fillStyle = grd
        ctx.beginPath()
        ctx.arc(mouse.x, mouse.y, RADIUS, 0, Math.PI * 2)
        ctx.fill()
      }

      // spark particles
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i]
        s.life -= 0.02
        s.y -= 0.6 + (1 - s.life) * 1.2
        s.x += Math.sin(time * 8 + s.hue) * 0.4
        if (s.life <= 0) {
          sparks.splice(i, 1)
          continue
        }
        ctx.fillStyle = `hsla(${s.hue},100%,62%,${s.life * 0.9})`
        const sz = 2 + s.life * 3
        ctx.fillRect(s.x, s.y, sz, sz)
      }

      raf = requestAnimationFrame(draw)
    }

    resize()
    onScroll()
    window.addEventListener('resize', resize)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerleave', onLeave)
    document.addEventListener('mouseleave', onLeave)
    raf = requestAnimationFrame(draw)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[45] mix-blend-screen"
      aria-hidden
    />
  )
}
