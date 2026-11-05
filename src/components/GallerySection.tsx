import { useRef } from 'react'
import { useApp } from '@/context'
import { useScrollProgress } from '@/hooks/useScrollProgress'

const shots = [
  { src: '/assets/gallery-stall.jpg', zh: '夜市炉火', en: 'Night stall' },
  { src: '/assets/gallery-grill.jpg', zh: '翻签瞬间', en: 'Flip the stick' },
  { src: '/assets/food-youbian.jpg', zh: '大油边', en: 'Fat edge' },
  { src: '/assets/gallery-friends.jpg', zh: '兄弟局', en: 'Brother night' },
  { src: '/assets/food-brisket.jpg', zh: '牛胸口', en: 'Brisket' },
  { src: '/assets/food-lamb.jpg', zh: '羊肉筋', en: 'Lamb tendon' },
  { src: '/assets/hero-bbq.jpg', zh: '炭火红', en: 'Ember red' },
  { src: '/assets/food-wuhua.jpg', zh: '猪五花', en: 'Pork belly' },
]

export default function GallerySection() {
  const { lang, t } = useApp()
  const ref = useRef<HTMLElement>(null)
  const { p } = useScrollProgress(ref)
  const x = -p * (shots.length - 1.2) * 42

  return (
    <section id="gallery" ref={ref} className="relative bg-[#0B0604]" style={{ height: '320vh' }}>
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
        <div className="px-6 md:px-12 lg:px-16 mb-8 md:mb-10">
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#ff4d1a] mb-3 font-latin">
            GALLERY · FILM STRIP
          </p>
          <h2 className="font-display text-[12vw] md:text-[6vw] leading-[0.9] text-[#f5e6d3]">
            {t.galleryTitle}
          </h2>
          <p className="mt-3 text-sm text-[#f5e6d3]/55 font-body">{t.gallerySub}</p>
          <p className="mt-2 text-[10px] tracking-[0.2em] uppercase text-white/30 font-latin">
            {lang === 'zh' ? '继续下滑 · 胶片横移' : 'Keep scrolling · strip drifts'}
          </p>
        </div>

        <div
          className="flex gap-4 md:gap-6 pl-6 md:pl-12 will-change-transform"
          style={{ transform: `translate3d(${x}vw, 0, 0)`, transition: 'transform 0.05s linear' }}
        >
          {shots.map((s, i) => {
            const center = Math.abs(i - p * (shots.length - 1))
            const focus = Math.max(0, 1 - center * 0.55)
            return (
              <figure
                key={s.src + i}
                className="relative shrink-0 w-[72vw] sm:w-[48vw] md:w-[38vw] lg:w-[30vw] aspect-[4/5] overflow-hidden"
                style={{
                  transform: `scale(${0.88 + focus * 0.14}) rotate(${(i % 2 === 0 ? -1 : 1) * (1 - focus) * 3}deg)`,
                  filter: `brightness(${0.55 + focus * 0.5}) saturate(${0.7 + focus * 0.4})`,
                  boxShadow: focus > 0.6 ? '0 20px 60px rgba(230,35,20,0.25)' : 'none',
                }}
              >
                <img src={s.src} alt="" className="absolute inset-0 h-full w-full object-cover" />
                <figcaption className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <span className="font-display text-xl text-[#f5e6d3]">
                    {lang === 'zh' ? s.zh : s.en}
                  </span>
                </figcaption>
              </figure>
            )
          })}
        </div>
      </div>
    </section>
  )
}
