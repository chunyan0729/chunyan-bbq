import { useMemo, useRef } from 'react'
import { crafts } from '@/i18n'
import { useApp } from '@/context'
import { useScrollProgress } from '@/hooks/useScrollProgress'

export default function CraftSection() {
  const { lang, t } = useApp()
  const ref = useRef<HTMLElement>(null)
  const { p } = useScrollProgress(ref)

  const active = useMemo(() => {
    const local = Math.max(0, Math.min(1, (p - 0.18) / 0.55))
    return Math.min(crafts.length - 1, Math.floor(local * crafts.length))
  }, [p])

  const heat = Math.max(0, Math.min(1, (p - 0.12) / 0.6))

  return (
    <section id="craft" ref={ref} className="relative bg-[#120805]" style={{ height: '280vh' }}>
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center px-6 md:px-12 lg:px-16">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 50% 120%, rgba(230,35,20,${0.08 + heat * 0.35}) 0%, transparent 55%)`,
            transform: `scale(${1 + heat * 0.15})`,
          }}
        />
        <div
          className="pointer-events-none absolute -left-20 top-1/3 font-display text-[40vw] leading-none select-none"
          style={{
            color: 'rgba(230,35,20,0.08)',
            transform: `translateY(${(p - 0.5) * -80}px) rotate(${heat * -6}deg)`,
          }}
        >
          FIRE
        </div>

        <p className="relative text-[10px] tracking-[0.3em] uppercase text-[#ff4d1a] mb-3 font-latin z-10">CRAFT</p>
        <h2 className="relative z-10 font-display text-[12vw] md:text-[6vw] leading-[0.9] text-[#f5e6d3] mb-2">
          {t.craftTitle}
        </h2>
        <p className="relative z-10 text-sm text-[#f5e6d3]/55 font-body mb-10 max-w-lg">{t.craftSub}</p>

        <div className="relative z-10 mb-10 max-w-xl">
          <div className="flex justify-between text-[10px] tracking-[0.2em] uppercase text-white/35 font-latin mb-2">
            <span>COLD COAL</span>
            <span>WHITE ASH</span>
          </div>
          <div className="h-1.5 bg-white/10 overflow-hidden">
            <div
              className="h-full origin-left"
              style={{
                width: `${heat * 100}%`,
                background: 'linear-gradient(90deg,#5a1a0a,#e62314,#ffb347)',
                boxShadow: '0 0 20px rgba(255,77,26,0.55)',
              }}
            />
          </div>
        </div>

        <div className="relative z-10 grid md:grid-cols-4 gap-4 md:gap-5">
          {crafts.map((c, i) => {
            const on = i <= active
            const isActive = i === active
            return (
              <div
                key={i}
                className="relative min-h-[200px] md:min-h-[280px] p-5 md:p-6 transition-all duration-500"
                style={{
                  opacity: on ? 1 : 0.25,
                  transform: `translateY(${isActive ? 0 : on ? 12 : 36}px) scale(${isActive ? 1.03 : 0.96})`,
                  background: isActive
                    ? 'linear-gradient(160deg, rgba(230,35,20,0.22), rgba(11,6,4,0.2))'
                    : 'transparent',
                  borderLeft: `2px solid ${on ? '#ff4d1a' : 'rgba(255,255,255,0.12)'}`,
                }}
              >
                <div
                  className="font-latin text-5xl md:text-6xl leading-none mb-4"
                  style={{ color: isActive ? '#ff4d1a' : 'rgba(245,230,211,0.2)' }}
                >
                  0{i + 1}
                </div>
                <h3 className="font-display text-2xl md:text-3xl text-[#f5e6d3] mb-2">
                  {lang === 'zh' ? c.zh.t : c.en.t}
                </h3>
                <p
                  className="text-sm leading-[1.7] font-body"
                  style={{ color: isActive ? 'rgba(245,230,211,0.8)' : 'rgba(245,230,211,0.4)' }}
                >
                  {lang === 'zh' ? c.zh.d : c.en.d}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
