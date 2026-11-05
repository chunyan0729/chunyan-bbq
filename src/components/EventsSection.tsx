import { useRef } from 'react'
import { events } from '@/i18n'
import { useApp } from '@/context'
import { useScrollProgress } from '@/hooks/useScrollProgress'

export default function EventsSection() {
  const { lang, t } = useApp()
  const ref = useRef<HTMLElement>(null)
  const { p } = useScrollProgress(ref)

  return (
    <section
      id="events"
      ref={ref}
      className="relative py-28 md:py-36 px-6 md:px-12 lg:px-16 bg-[#120805] overflow-hidden"
    >
      <div
        className="pointer-events-none absolute -right-24 top-10 font-latin text-[28vw] leading-none text-[#e62314]/10 select-none"
        style={{ transform: `rotate(${p * 40}deg) translateY(${(p - 0.5) * 60}px)` }}
      >
        24H
      </div>

      <p className="text-[10px] tracking-[0.3em] uppercase text-[#ff4d1a] mb-3 font-latin">EVENTS</p>
      <h2
        className="font-display text-[12vw] md:text-[6vw] leading-[0.9] text-[#f5e6d3] mb-4"
        style={{
          clipPath: `inset(0 ${Math.max(0, 100 - p * 160)}% 0 0)`,
          transition: 'clip-path 0.05s linear',
        }}
      >
        {t.eventsTitle}
      </h2>
      <p className="text-sm text-[#f5e6d3]/55 font-body mb-14">{t.eventsSub}</p>

      <div className="space-y-3 md:space-y-4">
        {events.map((e, i) => {
          const appear = Math.max(0, Math.min(1, (p - 0.2 - i * 0.08) / 0.18))
          return (
            <a
              key={e.date}
              href="#book"
              className="group relative flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-10 py-6 md:py-8 px-3 md:px-5 overflow-hidden"
              style={{
                opacity: appear,
                transform: `translateX(${(1 - appear) * (i % 2 === 0 ? -80 : 80)}px)`,
                background: `linear-gradient(90deg, rgba(230,35,20,${appear * 0.12}), transparent 55%)`,
              }}
            >
              <div
                className="absolute left-0 top-0 bottom-0 w-1 bg-[#ff4d1a] origin-top"
                style={{ transform: `scaleY(${appear})` }}
              />
              <div className="font-latin text-5xl md:text-6xl text-[#ff4d1a] tracking-tight min-w-[140px]">
                {e.date}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl md:text-3xl text-[#f5e6d3] font-display group-hover:tracking-wide transition-all duration-500">
                  {lang === 'zh' ? e.zh.t : e.en.t}
                </h3>
                <p className="mt-1 text-sm text-[#f5e6d3]/50 font-body">
                  {lang === 'zh' ? e.zh.d : e.en.d}
                </p>
              </div>
              <span className="text-[10px] tracking-[0.25em] uppercase text-white/30 group-hover:text-[#ff4d1a] font-latin">
                BOOK →
              </span>
            </a>
          )
        })}
      </div>
    </section>
  )
}
