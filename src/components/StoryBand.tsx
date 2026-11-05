import { useApp } from '@/context'

/** Short calm story strip after hero — one idea only. */
export default function StoryBand() {
  const { t } = useApp()

  return (
    <section className="relative bg-[#f3ebe1] text-[#1a0c06] px-6 md:px-16 lg:px-24 py-24 md:py-32">
      <p className="font-latin text-[11px] tracking-[0.28em] uppercase text-[#c2410c] mb-8">
        {t.originLabel}
      </p>
      <p className="max-w-4xl font-body text-2xl md:text-4xl leading-[1.45] font-light">
        {t.originBody}
      </p>
      <div className="mt-12 flex flex-wrap gap-8 text-[11px] tracking-[0.2em] uppercase font-latin text-[#1a0c06]/45">
        <span>{t.premiseLabel}</span>
        <span>{t.processLabel}</span>
        <span>{t.hours}</span>
      </div>
    </section>
  )
}
