import { useEffect, useState, type RefObject } from 'react'

/** 0–1 progress of an element through the viewport (top enters → bottom leaves). */
export function useScrollProgress(ref: RefObject<HTMLElement | null>) {
  const [p, setP] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let raf = 0
    const measure = () => {
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight || 1
      const total = rect.height + vh
      const traveled = vh - rect.top
      const next = Math.max(0, Math.min(1, traveled / total))
      setP(next)
      setVisible(rect.bottom > 0 && rect.top < vh)
      raf = 0
    }
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(measure)
    }
    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [ref])

  return { p, visible }
}
