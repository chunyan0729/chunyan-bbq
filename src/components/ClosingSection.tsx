import { useRef } from 'react'
import { useApp } from '@/context'
import { useScrollProgress } from '@/hooks/useScrollProgress'

export default function ClosingSection() {
  const { t } = useApp()
  const ref = useRef<HTMLElement>(null)
  const { p } = useScrollProgress(ref)
  const reveal = Math.max(0, Math.min(1, (p - 0.1) / 0.4))

  return (
    <section ref={ref} className="relative min-h-screen bg-black flex flex-col justify-between overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: 'url(/assets/hero-bbq.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.35) saturate(1.2)',
          transform: `scale(${1.15 - reveal * 0.12})`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/70 to-black" />

      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[28vw] leading-none text-[#e62314]/20 select-none whitespace-nowrap"
        style={{
          transform: `translate(-50%, -50%) scale(${0.8 + reveal * 0.35})`,
          letterSpacing: `${reveal * 0.08}em`,
        }}
      >
        纯言
      </div>

      <div className="relative w-full px-6 md:px-12 lg:px-16 pt-16 md:pt-20 z-10">
        <div className="h-px bg-white/10 w-full origin-left" style={{ transform: `scaleX(${reveal})` }} />
      </div>

      <div
        className="relative z-10 flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-16 py-16"
        style={{ opacity: reveal, transform: `translateY(${(1 - reveal) * 40}px)` }}
      >
        <div className="text-[10px] tracking-[0.3em] uppercase text-white/30 mb-8 font-latin">{t.closingLabel}</div>
        <h2
          className="text-[8vw] sm:text-[7vw] md:text-[5vw] lg:text-[4vw] font-light leading-[1.15] tracking-[-0.02em] text-white/90 max-w-5xl font-body"
          style={{ fontFamily: "'Noto Sans SC', sans-serif" }}
        >
          {t.closingLead}{' '}
          <br className="hidden sm:block" />
          <span className="text-white/40">{t.closingMid}</span>
          <br className="hidden sm:block" />
          <span>{t.closingEnd}</span>
        </h2>
        <p
          className="mt-10 text-xs md:text-sm leading-[1.8] text-white/40 font-light max-w-md font-body"
          style={{ fontFamily: "'Noto Sans SC', sans-serif" }}
        >
          {t.closingBody}
        </p>
      </div>

      <div className="relative z-10 px-6 md:px-12 lg:px-16 pb-10">
        <div className="h-px bg-white/10 w-full mb-8" />
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            <div className="text-[10px] tracking-[0.3em] uppercase text-white/30 mb-2 font-latin">{t.atelier}</div>
            <div
              className="text-sm text-white/60 font-light leading-relaxed font-body whitespace-pre-line"
              style={{ fontFamily: "'Noto Sans SC', sans-serif" }}
            >
              {t.atelierValue}
            </div>
          </div>
          <div className="flex flex-col items-start md:items-end gap-3">
            <div className="text-[10px] tracking-[0.3em] uppercase text-white/30 font-latin">{t.startJourney}</div>
            <a href="#book" className="group inline-flex items-center gap-3 text-white/80 hover:text-white transition-colors duration-300">
              <span className="text-sm font-light tracking-wide font-body" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
                {t.schedule}
              </span>
              <span className="w-8 h-px bg-white/40 group-hover:w-12 group-hover:bg-[#ff4d1a] transition-all duration-300" />
            </a>
          </div>
          <div className="text-right mt-4 md:mt-0 text-[10px] tracking-[0.2em] uppercase text-white/20 font-latin">
            © {t.brand} MMXXVI
          </div>
        </div>
      </div>
    </section>
  )
}
