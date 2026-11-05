import { useCallback, useEffect, useRef, useState } from 'react'
import { menuItems } from '@/i18n'
import { useApp } from '@/context'

type Dir = 'next' | 'prev' | 'none'

export default function MenuSection() {
  const { lang, t, add, cart, clear } = useApp()
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState<Dir>('none')
  const [animKey, setAnimKey] = useState(0)
  const [btnPulse, setBtnPulse] = useState<'left' | 'right' | null>(null)
  const lock = useRef(false)
  const indexRef = useRef(0)

  const total = cart.reduce((sum, line) => {
    const item = menuItems.find((m) => m.id === line.id)
    return sum + (item?.price ?? 0) * line.qty
  }, 0)

  const item = menuItems[index]

  const jumpTo = useCallback((next: number, d: 'next' | 'prev') => {
    if (lock.current || next === indexRef.current) return
    lock.current = true
    indexRef.current = next
    setDir(d)
    setBtnPulse(d === 'next' ? 'right' : 'left')
    setIndex(next)
    setAnimKey((k) => k + 1)
    window.setTimeout(() => {
      lock.current = false
      setBtnPulse(null)
    }, 620)
  }, [])

  const go = useCallback(
    (d: 'next' | 'prev') => {
      const i = indexRef.current
      const next =
        d === 'next'
          ? (i + 1) % menuItems.length
          : (i - 1 + menuItems.length) % menuItems.length
      jumpTo(next, d)
    },
    [jumpTo],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const section = document.getElementById('menu')
      if (!section) return
      const rect = section.getBoundingClientRect()
      if (rect.bottom < 0 || rect.top > window.innerHeight) return
      if (e.key === 'ArrowRight') go('next')
      if (e.key === 'ArrowLeft') go('prev')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])

  const name = lang === 'zh' ? item.zh.name : item.en.name
  const desc = lang === 'zh' ? item.zh.desc : item.en.desc

  return (
    <section id="menu" className="relative bg-[#0B0604] grain overflow-hidden">
      <div className="overflow-hidden border-y border-[#ff4d1a]/25 py-3 px-2">
        <div className="marquee-track flex whitespace-nowrap gap-10 font-latin text-[12vw] md:text-[6vw] text-[#e62314]/25 tracking-tight">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i}>CHUNYAN SELECT · 纯言精选 · 五条花焦香大串 · </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-6 md:px-12 lg:px-16 pt-16 md:pt-24 pb-8">
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#ff4d1a] mb-3 font-latin">MENU</p>
          <h2 className="font-display text-[12vw] md:text-[6vw] leading-[0.9] text-[#f5e6d3]">{t.menuTitle}</h2>
          <p className="mt-4 text-sm text-[#f5e6d3]/55 font-body max-w-md">{t.menuSub}</p>
        </div>
        <div className="min-w-[200px]">
          <div className="text-[10px] tracking-[0.25em] uppercase text-white/35 mb-2 font-latin">{t.order}</div>
          {cart.length === 0 ? (
            <p className="text-xs text-white/40 font-body">—</p>
          ) : (
            <ul className="space-y-1 mb-3">
              {cart.map((c) => {
                const it = menuItems.find((m) => m.id === c.id)!
                const n = lang === 'zh' ? it.zh.name : it.en.name
                return (
                  <li key={c.id} className="text-xs text-[#f5e6d3]/80 font-body flex justify-between gap-4">
                    <span>{n} ×{c.qty}</span>
                    <span>¥{it.price * c.qty}</span>
                  </li>
                )
              })}
            </ul>
          )}
          <div className="flex items-center justify-between text-sm text-[#ff4d1a] font-body">
            <span>{t.total}</span>
            <span>¥{total}</span>
          </div>
          {cart.length > 0 && (
            <button type="button" onClick={clear} className="mt-3 text-[10px] tracking-[0.2em] uppercase text-white/40 hover:text-white">
              {t.clear}
            </button>
          )}
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-3 sm:px-4 md:px-6 pb-20">
        <div className="flex items-center gap-3 sm:gap-5 md:gap-8">
          <button
            type="button"
            onClick={() => go('prev')}
            className={`menu-nav-btn menu-nav-outside shrink-0 ${btnPulse === 'left' ? 'menu-nav-pulse' : ''}`}
            aria-label={lang === 'zh' ? '上一道' : 'Previous'}
          >
            <span className="menu-nav-arrow">←</span>
            <span className="hidden md:inline font-latin text-[10px] uppercase tracking-[0.25em]">
              {lang === 'zh' ? '上一串' : 'Prev'}
            </span>
          </button>

          <div className="relative min-w-0 flex-1 aspect-[16/10] md:aspect-[16/9] overflow-hidden">
            <div
              key={animKey}
              className={`menu-slide absolute inset-0 ${
                dir === 'next'
                  ? 'menu-slide-from-right'
                  : dir === 'prev'
                    ? 'menu-slide-from-left'
                    : 'menu-slide-idle'
              }`}
            >
              <img src={item.img} alt={name} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex flex-col justify-between gap-4 p-5 sm:p-6 md:flex-row md:items-end md:p-10">
                <div className="menu-slide-copy">
                  <span className="font-latin text-[10px] uppercase tracking-[0.25em] text-[#ff4d1a]">
                    {String(index + 1).padStart(2, '0')} / {String(menuItems.length).padStart(2, '0')} · {item.tag}
                  </span>
                  <h3 className="mt-2 font-display text-3xl leading-none text-[#f5e6d3] sm:text-4xl md:text-6xl">{name}</h3>
                  <p className="mt-3 max-w-xl font-body text-sm leading-relaxed text-[#f5e6d3]/70 md:text-lg">{desc}</p>
                </div>
                <div className="menu-slide-copy shrink-0 text-left md:text-right">
                  <div className="font-latin text-3xl text-[#ff4d1a] md:text-5xl">¥{item.price}</div>
                  <button
                    type="button"
                    onClick={() => add(item.id)}
                    className="group mt-3 inline-flex items-center gap-3 text-[#f5e6d3]/85 transition-colors hover:text-[#ff4d1a]"
                  >
                    <span className="font-latin text-xs uppercase tracking-[0.2em]">{t.addCart}</span>
                    <span className="h-px w-8 bg-[#ff4d1a]/60 transition-all duration-300 group-hover:w-12" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => go('next')}
            className={`menu-nav-btn menu-nav-outside shrink-0 ${btnPulse === 'right' ? 'menu-nav-pulse' : ''}`}
            aria-label={lang === 'zh' ? '下一道' : 'Next'}
          >
            <span className="hidden md:inline font-latin text-[10px] uppercase tracking-[0.25em]">
              {lang === 'zh' ? '下一串' : 'Next'}
            </span>
            <span className="menu-nav-arrow">→</span>
          </button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2">
          {menuItems.map((m, i) => (
            <button
              key={m.id}
              type="button"
              aria-label={m.zh.name}
              onClick={() => jumpTo(i, i > indexRef.current ? 'next' : 'prev')}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === index
                  ? 'w-8 bg-[#ff4d1a] shadow-[0_0_16px_rgba(255,77,26,0.7)]'
                  : 'w-1.5 bg-white/25 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
