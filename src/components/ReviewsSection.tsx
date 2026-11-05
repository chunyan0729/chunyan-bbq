import { reviews } from '@/i18n'
import { useApp } from '@/context'

export default function ReviewsSection() {
  const { lang, t } = useApp()
  const rowA = [...reviews, ...reviews]
  const rowB = [...reviews].reverse().concat([...reviews].reverse())

  return (
    <section id="reviews" className="relative py-28 md:py-36 bg-[#0B0604] overflow-hidden">
      <div className="px-6 md:px-12 lg:px-16 mb-12">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#ff4d1a] mb-3 font-latin">
          REVIEWS · TICKER
        </p>
        <h2 className="font-display text-[12vw] md:text-[6vw] leading-[0.9] text-[#f5e6d3] mb-4">
          {t.reviewsTitle}
        </h2>
        <p className="text-sm text-[#f5e6d3]/55 font-body">{t.reviewsSub}</p>
      </div>

      <div className="space-y-5">
        <div className="overflow-hidden border-y border-[#ff4d1a]/20 py-1">
          <div className="review-marquee-left flex gap-5 w-max">
            {rowA.map((r, i) => (
              <blockquote
                key={`a-${i}`}
                className="w-[78vw] sm:w-[420px] shrink-0 p-6 md:p-8 bg-[#140c09]/80 border border-white/10"
              >
                <p className="text-base md:text-lg leading-[1.7] text-[#f5e6d3]/85 font-body">
                  “{lang === 'zh' ? r.zh.text : r.en.text}”
                </p>
                <footer className="mt-5 text-[10px] tracking-[0.25em] uppercase text-[#ff4d1a] font-latin">
                  — {lang === 'zh' ? r.zh.name : r.en.name}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>

        <div className="overflow-hidden border-y border-white/10 py-1">
          <div className="review-marquee-right flex gap-5 w-max">
            {rowB.map((r, i) => (
              <blockquote
                key={`b-${i}`}
                className="w-[78vw] sm:w-[420px] shrink-0 p-6 md:p-8 border border-[#ff4d1a]/25"
                style={{
                  background: 'linear-gradient(135deg, rgba(230,35,20,0.12), rgba(11,6,4,0.4))',
                }}
              >
                <p className="text-base md:text-lg leading-[1.7] text-[#f5e6d3]/85 font-body">
                  “{lang === 'zh' ? r.zh.text : r.en.text}”
                </p>
                <footer className="mt-5 text-[10px] tracking-[0.25em] uppercase text-[#ff4d1a] font-latin">
                  — {lang === 'zh' ? r.zh.name : r.en.name}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
