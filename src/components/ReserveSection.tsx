import { useMemo, useRef, useState, type FormEvent } from 'react'
import { menuItems } from '@/i18n'
import { useApp } from '@/context'
import { useScrollProgress } from '@/hooks/useScrollProgress'

export default function ReserveSection() {
  const { lang, t, cart } = useApp()
  const [done, setDone] = useState(false)
  const ref = useRef<HTMLElement>(null)
  const { p } = useScrollProgress(ref)

  const suggested = useMemo(() => {
    if (!cart.length) return ''
    return cart
      .map((c) => {
        const item = menuItems.find((m) => m.id === c.id)!
        const name = lang === 'zh' ? item.zh.name : item.en.name
        return `${name}×${c.qty}`
      })
      .join('、')
  }, [cart, lang])

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setDone(true)
  }

  const wipe = Math.max(0, Math.min(1, (p - 0.15) / 0.35))

  return (
    <section
      id="book"
      ref={ref}
      className="relative py-28 md:py-36 px-6 md:px-12 lg:px-16 bg-[#0B0604] overflow-hidden"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `conic-gradient(from ${p * 220}deg at 80% 20%, rgba(230,35,20,0.18), transparent 40%, rgba(255,77,26,0.08))`,
        }}
      />

      <div className="relative grid lg:grid-cols-2 gap-14 items-start">
        <div style={{ opacity: wipe, transform: `translateY(${(1 - wipe) * 50}px)` }}>
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#ff4d1a] mb-3 font-latin">RESERVE</p>
          <h2 className="font-display text-[12vw] md:text-[6vw] leading-[0.9] text-[#f5e6d3] mb-4">
            {t.bookTitle}
          </h2>
          <p className="text-sm text-[#f5e6d3]/55 font-body mb-8">{t.bookSub}</p>
          <div className="space-y-4 text-sm text-[#f5e6d3]/70 font-body">
            <div>
              <div className="text-[10px] tracking-[0.25em] uppercase text-white/30 mb-1 font-latin">Location</div>
              {t.location}
            </div>
            <div>
              <div className="text-[10px] tracking-[0.25em] uppercase text-white/30 mb-1 font-latin">Hours</div>
              {t.hours}
            </div>
            <div>
              <div className="text-[10px] tracking-[0.25em] uppercase text-white/30 mb-1 font-latin">Social</div>
              <a className="text-[#ff4d1a] hover:underline" href="https://www.douyin.com/" target="_blank" rel="noreferrer">
                {t.social}
              </a>
            </div>
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="relative border border-[#ff4d1a]/30 p-6 md:p-8 space-y-5"
          style={{
            opacity: wipe,
            transform: `translateX(${(1 - wipe) * 60}px) rotateY(${(1 - wipe) * -8}deg)`,
            background: 'linear-gradient(160deg, rgba(230,35,20,0.12), rgba(11,6,4,0.85))',
            boxShadow: '0 0 80px rgba(230,35,20,0.15)',
          }}
        >
          {done ? (
            <p className="text-[#f5e6d3] font-body leading-relaxed py-10 text-center">{t.form.success}</p>
          ) : (
            <>
              {(
                [
                  ['name', 'text', t.form.name],
                  ['phone', 'tel', t.form.phone],
                  ['people', 'number', t.form.people],
                  ['datetime', 'datetime-local', t.form.datetime],
                ] as const
              ).map(([name, type, label]) => (
                <label key={name} className="block">
                  <span className="text-[10px] tracking-[0.25em] uppercase text-white/35 font-latin">{label}</span>
                  <input
                    required
                    name={name}
                    type={type}
                    min={name === 'people' ? 1 : undefined}
                    className="mt-2 w-full bg-transparent border-b border-white/20 focus:border-[#ff4d1a] outline-none py-2 text-[#f5e6d3] font-body"
                  />
                </label>
              ))}
              <label className="block">
                <span className="text-[10px] tracking-[0.25em] uppercase text-white/35 font-latin">{t.form.items}</span>
                <textarea
                  name="items"
                  rows={3}
                  defaultValue={suggested}
                  className="mt-2 w-full bg-transparent border border-white/15 focus:border-[#ff4d1a] outline-none p-3 text-[#f5e6d3] font-body resize-none"
                />
              </label>
              <label className="block">
                <span className="text-[10px] tracking-[0.25em] uppercase text-white/35 font-latin">{t.form.note}</span>
                <textarea
                  name="note"
                  rows={2}
                  className="mt-2 w-full bg-transparent border border-white/15 focus:border-[#ff4d1a] outline-none p-3 text-[#f5e6d3] font-body resize-none"
                />
              </label>
              <button type="submit" className="group inline-flex items-center gap-3 mt-2 text-[#f5e6d3] hover:text-white transition-colors">
                <span className="text-sm tracking-wide font-body">{t.form.submit}</span>
                <span className="w-8 h-px bg-[#ff4d1a] group-hover:w-14 transition-all duration-300" />
              </button>
            </>
          )}
        </form>
      </div>
    </section>
  )
}
