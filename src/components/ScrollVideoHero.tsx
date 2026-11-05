import { useEffect, useRef } from 'react'
import { useApp } from '@/context'

const FRAMES = [
  '/assets/hero-bbq.jpg',
  '/assets/gallery-grill.jpg',
  '/assets/food-youbian.jpg',
  '/assets/food-brisket.jpg',
  '/assets/gallery-stall.jpg',
  '/assets/food-lamb.jpg',
  '/assets/food-wuhua.jpg',
  '/assets/gallery-friends.jpg',
  '/assets/food-beef.jpg',
]

const Z_GAP = 1100
const TRAVEL = Z_GAP * (FRAMES.length - 0.35)
const LAYOUT = FRAMES.map((_, i) => ({
  x: Math.sin(i * 1.7) * 3.5,
  y: Math.cos(i * 1.3) * 2.2,
  rotY: Math.sin(i * 0.9) * 4,
  rotX: Math.cos(i * 1.1) * 2,
}))

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n))
}

export default function ScrollVideoHero() {
  const { t, lang } = useApp()
  const sectionRef = useRef<HTMLElement>(null)
  const worldRef = useRef<HTMLDivElement>(null)
  const planeRefs = useRef<(HTMLDivElement | null)[]>([])
  const overlayRef = useRef<HTMLDivElement>(null)
  const heroContentRef = useRef<HTMLDivElement>(null)
  const s2 = useRef<HTMLDivElement>(null)
  const s3 = useRef<HTMLDivElement>(null)
  const s4 = useRef<HTMLDivElement>(null)
  const s5 = useRef<HTMLDivElement>(null)
  const mouse = useRef({ x: 0, y: 0 })
  const mouseSmooth = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    let start = 0
    let end = 1
    let target = 0
    let current = 0
    let last = performance.now()
    let raf = 0
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const measure = () => {
      start = window.scrollY + section.getBoundingClientRect().top
      end = start + section.offsetHeight - window.innerHeight
    }

    const applyDepth = (p: number) => {
      const camZ = p * TRAVEL
      const mx = mouseSmooth.current.x
      const my = mouseSmooth.current.y

      if (worldRef.current) {
        worldRef.current.style.transform = `
          translate3d(${mx * -12}px, ${my * -8}px, ${camZ}px)
          rotateX(${my * 2.5}deg)
          rotateY(${mx * -3.5}deg)
        `
      }

      planeRefs.current.forEach((plane, i) => {
        if (!plane) return
        const baseZ = -i * Z_GAP
        const rel = baseZ + camZ
        const layout = LAYOUT[i]
        const near = clamp(1 - Math.abs(rel) / (Z_GAP * 1.15), 0, 1)
        const past = rel > 80
        const far = rel < -Z_GAP * 1.6

        let opacity = near
        if (past) opacity = clamp(1 - (rel - 80) / 420, 0, 1)
        if (far) opacity = 0
        if (p < 0.02 && i === 0) opacity = Math.max(opacity, 0.95)

        const blur = past
          ? clamp((rel - 80) / 90, 0, 8)
          : clamp((-rel - Z_GAP * 0.35) / 500, 0, 10)
        const brightness = 0.35 + near * 0.75
        const scalePunch = past ? 1 + (rel - 80) / 900 : 1

        plane.style.opacity = String(opacity)
        plane.style.filter = `blur(${blur}px) brightness(${brightness}) saturate(${0.85 + near * 0.35})`
        plane.style.transform = `
          translate3d(${layout.x}%, ${layout.y}%, ${baseZ}px)
          rotateY(${layout.rotY + mx * 3}deg)
          rotateX(${layout.rotX + my * 2}deg)
          scale(${scalePunch})
        `
        plane.style.zIndex = String(1000 - i)
      })
    }

    const applyPositions = (progress: number, scrollPx: number) => {
      const heroScroll = Math.max(0, 1 - progress * 8)
      if (heroContentRef.current) {
        const zPush = (1 - heroScroll) * 420
        heroContentRef.current.style.opacity = String(heroScroll)
        heroContentRef.current.style.transform = `
          translate3d(0, ${(1 - heroScroll) * -18}%, ${zPush}px)
          scale(${1 + (1 - heroScroll) * 0.35})
        `
      }
      if (overlayRef.current) {
        const op = Math.max(0, 1 - Math.max(0, scrollPx - 150) / 30)
        overlayRef.current.style.opacity = String(op * 0.55)
      }
    }

    const applyPanels = (progress: number) => {
      const panels = [s2.current, s3.current, s4.current, s5.current]
      const flavors = [
        (tt: number) =>
          `translate3d(${tt * -10}%, ${tt * 70}%, ${Math.abs(tt) * -240}px) rotateY(${tt * -12}deg) rotateZ(${tt * -3}deg) scale(${1 - Math.abs(tt) * 0.1})`,
        (tt: number) =>
          `translate3d(${tt * 16}%, ${tt * 60}%, ${Math.abs(tt) * -200}px) rotateY(${tt * 14}deg) scale(${1 - Math.abs(tt) * 0.08})`,
        (tt: number) =>
          `translate3d(0, ${tt * 75}%, ${Math.abs(tt) * -280}px) rotateX(${tt * 8}deg) scale(${1 + Math.abs(tt) * 0.12})`,
        (tt: number) =>
          `translate3d(${tt * -6}%, ${tt * 90}%, ${Math.abs(tt) * -320}px) rotateY(${tt * 6}deg) scale(${1 - Math.abs(tt) * 0.18})`,
      ]
      panels.forEach((el, idx) => {
        if (!el) return
        const i = idx + 1
        const local = (progress - i / 5) / (1 / 5)
        let tt: number
        if (local < 0) tt = 1
        else if (local > 1) tt = -1
        else tt = 1 - 2 * local
        const visible = Math.abs(tt) < 1
        el.style.transform = flavors[idx](tt)
        el.style.opacity = visible ? String(1 - Math.abs(tt) * 0.12) : '0'
        el.style.filter = visible ? `blur(${Math.abs(tt) * 2}px)` : 'blur(4px)'
        el.style.pointerEvents = visible ? 'auto' : 'none'
      })
    }

    const onScroll = () => {
      const progress = clamp((window.scrollY - start) / (end - start || 1), 0, 1)
      target = progress
      applyPositions(progress, Math.max(0, window.scrollY - start))
    }

    const onPointer = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }

    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000)
      last = now
      if (reduced) {
        current = 0
        mouseSmooth.current.x = 0
        mouseSmooth.current.y = 0
      } else {
        const smoothing = 1 - Math.exp(-dt * 9)
        current += (target - current) * smoothing
        if (Math.abs(target - current) < 0.0015) current = target
        mouseSmooth.current.x += (mouse.current.x - mouseSmooth.current.x) * (1 - Math.exp(-dt * 6))
        mouseSmooth.current.y += (mouse.current.y - mouseSmooth.current.y) * (1 - Math.exp(-dt * 6))
      }
      applyDepth(current)
      applyPanels(current)
      raf = requestAnimationFrame(tick)
    }

    measure()
    onScroll()
    applyDepth(0)
    raf = requestAnimationFrame(tick)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', measure)
    window.addEventListener('pointermove', onPointer, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', measure)
      window.removeEventListener('pointermove', onPointer)
    }
  }, [])

  const titleStyle = {
    fontFamily: "'ZCOOL QingKe HuangYou', 'Bebas Neue', sans-serif",
  } as const
  const bodyStyle = {
    fontFamily: "'Noto Sans SC', sans-serif",
  } as const

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: '500vh' }}
      id="story"
    >
      <div className="sticky top-0 w-full h-screen overflow-hidden bg-[#0B0604]">
        <div
          className="absolute inset-0 z-0 depth-stage"
          style={{ perspective: '1400px', perspectiveOrigin: '50% 48%' }}
        >
          <div
            ref={worldRef}
            className="absolute inset-0 depth-world"
            style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
          >
            {FRAMES.map((src, i) => (
              <div
                key={src + i}
                ref={(el) => {
                  planeRefs.current[i] = el
                }}
                className="absolute left-1/2 top-1/2 depth-plane"
                style={{
                  width: '100vw',
                  height: '100vh',
                  marginLeft: '-50vw',
                  marginTop: '-50vh',
                  transformStyle: 'preserve-3d',
                  transform: `translate3d(${LAYOUT[i].x * 0.35}%, ${LAYOUT[i].y * 0.35}%, ${-i * Z_GAP}px)`,
                  opacity: i === 0 ? 1 : 0,
                  willChange: 'transform, opacity, filter',
                  backfaceVisibility: 'hidden',
                }}
              >
                <img src={src} alt="" draggable={false} className="h-full w-full object-cover" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B0604]/35 via-transparent to-transparent" />
              </div>
            ))}
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 z-[4]">
          <div className="ember-orb absolute -bottom-24 left-1/4 h-[36vh] w-[50vw] rounded-full bg-[#e62314]/28 blur-3xl" />
          <div
            className="ember-orb absolute -bottom-10 right-1/5 h-[26vh] w-[36vw] rounded-full bg-[#ff4d1a]/2 blur-3xl"
            style={{ animationDelay: '0.8s' }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(11,6,4,0.55)_100%)]" />
          <div className="depth-grid absolute inset-0 opacity-[0.06]" />
        </div>

        <div ref={overlayRef} className="pointer-events-none absolute inset-0 z-30">
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0B0604] to-transparent" />
        </div>

        <div
          ref={heroContentRef}
          className="absolute inset-0 z-10 flex flex-col"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="mt-16 flex justify-center md:mt-20">
            <h1
              className="heat-wave select-none text-center text-[18vw] font-black uppercase leading-[0.78] tracking-[-0.04em] text-[#f5e6d3] drop-shadow-[0_0_40px_rgba(230,35,20,0.35)] md:text-[16vw]"
              style={titleStyle}
            >
              {lang === 'zh' ? '纯言' : 'CHUNYAN'}
            </h1>
          </div>
          <div className="absolute bottom-6 left-6 md:bottom-8 md:left-10">
            <p
              className="font-body text-[9px] uppercase leading-[1.8] tracking-[0.15em] text-[#f5e6d3]/80 md:text-[10px]"
              style={bodyStyle}
            >
              {t.heroCaption[0]}
              <br />
              {t.heroCaption[1]}
              <br />
              {t.heroCaption[2]}
            </p>
          </div>
          <div className="absolute bottom-6 right-6 text-right md:bottom-8 md:right-10">
            <img
              src="/assets/logo-chunyan.jpg"
              alt="纯言精选"
              className="h-14 w-14 rounded-sm border border-[#ff4d1a]/40 object-cover shadow-[0_0_30px_rgba(230,35,20,0.45)] md:h-16 md:w-16"
            />
          </div>
        </div>

        <div
          ref={s2}
          className="absolute inset-0 z-20 flex flex-col justify-start p-6 will-change-transform md:p-12 lg:p-16"
          style={{ opacity: 0, pointerEvents: 'none', transform: 'translateY(100%)', transformStyle: 'preserve-3d' }}
        >
          <div className="story-float mt-14 max-w-3xl md:mt-24">
            <div className="story-shimmer mb-7 font-display text-[16vw] leading-[0.9] tracking-wide md:text-[8vw]">
              {t.originLabel}
            </div>
            <p className="story-body font-body text-2xl font-light leading-[1.5] md:text-4xl lg:text-[2.75rem]" style={bodyStyle}>
              {t.originBody}
            </p>
          </div>
        </div>

        <div
          ref={s3}
          className="absolute inset-0 z-20 flex items-start justify-end p-6 pt-20 will-change-transform md:p-12 md:pt-28 lg:p-16"
          style={{ opacity: 0, pointerEvents: 'none', transform: 'translateY(100%)', transformStyle: 'preserve-3d' }}
        >
          <div className="story-float max-w-2xl text-right" style={{ animationDelay: '0.6s' }}>
            <div className="story-shimmer mb-6 font-display text-[16vw] leading-[0.9] tracking-wide md:text-[8vw]">
              {t.premiseLabel}
            </div>
            <p className="story-body font-body text-2xl font-light leading-[1.5] md:text-4xl" style={bodyStyle}>
              {t.premiseBody}
            </p>
          </div>
        </div>

        <div
          ref={s4}
          className="absolute inset-0 z-20 will-change-transform"
          style={{ opacity: 0, pointerEvents: 'none', transform: 'translateY(100%)', transformStyle: 'preserve-3d' }}
        >
          <div
            className="story-float absolute right-6 top-14 max-w-xl text-right md:right-12 md:top-20 lg:right-16"
            style={{ ...bodyStyle, animationDelay: '0.3s' }}
          >
            <p className="story-body font-body text-xl font-light leading-[1.5] md:text-3xl lg:text-4xl">
              {lang === 'zh'
                ? '瑾凡掌炉。纯言精选五条花焦香大串——把东北夜市的痛快，递到阿里总部的深夜。'
                : 'Jinfan at the fire. Five signature ember skewers—Northeast night-market heat, delivered to Alibaba HQ after dark.'}
            </p>
          </div>
          <div
            className="story-float absolute bottom-14 left-6 max-w-2xl md:bottom-20 md:left-12 lg:left-16"
            style={{ animationDelay: '0.9s' }}
          >
            <div className="story-shimmer mb-6 font-display text-[16vw] leading-[0.9] tracking-wide md:text-[8vw]">
              {t.processLabel}
            </div>
            <p className="story-body font-body text-2xl font-light leading-[1.5] md:text-4xl" style={bodyStyle}>
              {t.processBody}
            </p>
          </div>
        </div>

        <div
          ref={s5}
          className="absolute inset-0 z-20 flex items-center will-change-transform"
          style={{ opacity: 0, pointerEvents: 'none', transform: 'translateY(100%)', transformStyle: 'preserve-3d' }}
        >
          <div className="pl-6 md:pl-12 lg:pl-16">
            <h2
              className="select-none text-[18vw] font-black uppercase leading-[0.82] tracking-[-0.03em] text-[#f5e6d3] drop-shadow-[0_8px_40px_rgba(0,0,0,0.8)] md:text-[12vw]"
              style={titleStyle}
            >
              {t.findTitle[0]}
              <br />
              {t.findTitle[1]}
              <br />
              <span className="text-[#e62314]">{t.findTitle[2]}</span>
            </h2>
          </div>
        </div>
      </div>
    </section>
  )
}
