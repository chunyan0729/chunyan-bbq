import { useEffect, useState } from 'react'
import { useApp } from '@/context'

const EASE = 'cubic-bezier(0.76,0,0.24,1)'

const links = [
  { href: '#story', zh: '关于', en: 'Story', delay: 80 },
  { href: '#menu', zh: '菜单', en: 'Menu', delay: 160 },
  { href: '#craft', zh: '烤法', en: 'Craft', delay: 240 },
  { href: '#gallery', zh: '相册', en: 'Gallery', delay: 320 },
  { href: '#events', zh: '约烤', en: 'Events', delay: 400 },
  { href: '#reviews', zh: '评价', en: 'Reviews', delay: 480 },
  { href: '#blog', zh: '动态', en: 'Journal', delay: 560 },
  { href: '#book', zh: '预约', en: 'Book', delay: 640 },
] as const

export default function Navbar() {
  const { lang, setLang, t } = useApp()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[60] flex items-start justify-between px-5 md:px-10 pt-4 md:pt-5 pb-4 mix-blend-difference pointer-events-none">
        <a
          href="#top"
          className="pointer-events-auto text-[10px] md:text-xs tracking-[0.15em] uppercase text-white leading-tight font-medium font-body"
        >
          {t.brand}
          <span className="opacity-50"> ©</span>
        </a>

        <div className="text-center hidden sm:block text-[10px] md:text-xs tracking-[0.15em] uppercase text-white leading-tight">
          <div className="font-latin">VOLUME 01</div>
          <div className="opacity-50">MMXXVI</div>
        </div>

        <div className="text-center hidden md:block text-[10px] md:text-xs tracking-[0.15em] uppercase text-white leading-tight">
          <div>{lang === 'zh' ? '炭火 · 东北大串' : 'CHARCOAL, SKEWERS'}</div>
          <div className="opacity-50">
            {lang === 'zh' ? '汉溪烧烤' : '& HANXI FIRE'}
          </div>
        </div>

        <div className="pointer-events-auto flex items-center gap-4">
          <button
            type="button"
            onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
            className="text-[10px] md:text-xs tracking-[0.2em] uppercase text-white font-latin"
            aria-label="Toggle language"
          >
            {lang === 'zh' ? 'EN' : '中'}
          </button>
          <button
            type="button"
            className="relative w-7 h-5 flex flex-col justify-between items-end focus:outline-none"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <span
              className="block h-[1.5px] bg-white origin-center transition-all duration-500"
              style={{
                width: '100%',
                transitionTimingFunction: EASE,
                transform: open ? 'translateY(7.5px) rotate(45deg)' : 'none',
              }}
            />
            <span
              className="block h-[1.5px] bg-white transition-all duration-500"
              style={{
                width: open ? '100%' : '60%',
                transitionTimingFunction: EASE,
                opacity: open ? 0 : 1,
                transform: open ? 'scaleX(0)' : 'none',
              }}
            />
            <span
              className="block h-[1.5px] bg-white origin-center transition-all duration-500"
              style={{
                width: open ? '100%' : '80%',
                transitionTimingFunction: EASE,
                transform: open ? 'translateY(-7.5px) rotate(-45deg)' : 'none',
              }}
            />
          </button>
        </div>
      </nav>

      <div
        className="fixed inset-0 z-[55] transition-all duration-700"
        style={{
          transitionTimingFunction: EASE,
          clipPath: open ? 'inset(0% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)',
          pointerEvents: open ? 'auto' : 'none',
        }}
      >
        <div className="absolute inset-0 bg-black/[0.97] backdrop-blur-md" />
        <div className="relative z-10 h-full flex flex-col justify-between px-6 md:px-12 lg:px-16 pt-24 pb-10">
          <nav className="flex flex-col gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="group block overflow-hidden py-1.5"
              >
                <span
                  className="block text-[9vw] sm:text-[7vw] md:text-[5vw] font-black uppercase text-white/90 leading-[1.1] tracking-[-0.03em] transition-all duration-700 group-hover:text-[#ff4d1a] group-hover:translate-x-3 font-display"
                  style={{
                    transitionTimingFunction: EASE,
                    transitionDelay: open ? `${l.delay}ms` : '0ms',
                    transform: open ? 'translateY(0)' : 'translateY(110%)',
                  }}
                >
                  {lang === 'zh' ? l.zh : l.en}
                </span>
              </a>
            ))}
          </nav>

          <div
            className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 transition-all duration-500"
            style={{
              transitionTimingFunction: EASE,
              transitionDelay: open ? '450ms' : '0ms',
              opacity: open ? 1 : 0,
              transform: open ? 'translateY(0)' : 'translateY(20px)',
            }}
          >
            <div>
              <div className="text-[10px] tracking-[0.25em] uppercase text-white/30 mb-1.5">
                Location
              </div>
              <div className="text-xs text-white/50 font-light leading-relaxed font-body">
                {t.location}
              </div>
            </div>
            <div>
              <div className="text-[10px] tracking-[0.25em] uppercase text-white/30 mb-1.5">
                Social
              </div>
              <div className="text-xs text-white/50 font-light font-body">
                {t.social}
              </div>
            </div>
            <div className="hidden sm:block text-[10px] tracking-[0.2em] uppercase text-white/20">
              © {t.brand} MMXXVI
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
