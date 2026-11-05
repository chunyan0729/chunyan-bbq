import { useRef } from 'react'
import { asset } from '@/asset'
import { posts } from '@/i18n'
import { useApp } from '@/context'
import { useScrollProgress } from '@/hooks/useScrollProgress'

export default function BlogSection() {
  const { lang, t } = useApp()
  const ref = useRef<HTMLElement>(null)
  const { p } = useScrollProgress(ref)

  return (
    <section
      id="blog"
      ref={ref}
      className="relative py-28 md:py-36 px-6 md:px-12 lg:px-16 bg-[#120805] overflow-hidden"
    >
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-1/2 opacity-30"
        style={{
          backgroundImage: `url(${asset('/assets/gallery-grill.jpg')})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          maskImage: 'linear-gradient(90deg, transparent, black)',
          WebkitMaskImage: 'linear-gradient(90deg, transparent, black)',
          transform: `scale(${1.1 - p * 0.12}) translateX(${(p - 0.5) * 40}px)`,
          filter: 'saturate(0.7) brightness(0.45)',
        }}
      />

      <p className="relative text-[10px] tracking-[0.3em] uppercase text-[#ff4d1a] mb-3 font-latin z-10">
        JOURNAL
      </p>
      <h2 className="relative z-10 font-display text-[12vw] md:text-[6vw] leading-[0.9] text-[#f5e6d3] mb-4">
        {t.blogTitle}
      </h2>
      <p className="relative z-10 text-sm text-[#f5e6d3]/55 font-body mb-14">{t.blogSub}</p>

      <div className="relative z-10 space-y-6 md:space-y-8 max-w-3xl">
        {posts.map((post, i) => {
          const local = Math.max(0, Math.min(1, (p - 0.22 - i * 0.12) / 0.2))
          const rot = (1 - local) * (i % 2 === 0 ? -12 : 12)
          return (
            <article
              key={post.date}
              className="origin-left border border-white/10 p-6 md:p-8 backdrop-blur-[2px]"
              style={{
                opacity: local,
                transform: `perspective(900px) rotateY(${rot}deg) translateY(${(1 - local) * 40}px)`,
                background: `rgba(11,6,4,${0.35 + local * 0.35})`,
                borderColor: `rgba(255,77,26,${0.1 + local * 0.35})`,
              }}
            >
              <div className="font-latin text-xs tracking-[0.25em] text-[#ff4d1a] mb-3">{post.date}</div>
              <h3 className="text-2xl md:text-4xl text-[#f5e6d3] font-display">
                {lang === 'zh' ? post.zh.t : post.en.t}
              </h3>
              <p className="mt-3 text-sm md:text-base leading-relaxed text-[#f5e6d3]/60 font-body">
                {lang === 'zh' ? post.zh.d : post.en.d}
              </p>
            </article>
          )
        })}
      </div>
    </section>
  )
}
