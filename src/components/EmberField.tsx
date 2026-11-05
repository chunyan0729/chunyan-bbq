import type { CSSProperties } from 'react'

export default function EmberField() {
  const sparks = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: `${(i * 17) % 100}%`,
    delay: `${(i % 7) * 0.35}s`,
    sx: `${((i * 13) % 80) - 40}px`,
    sy: `${-120 - ((i * 23) % 160)}px`,
    size: 2 + (i % 4),
  }))

  return (
    <div className="pointer-events-none fixed inset-0 z-[40] overflow-hidden mix-blend-screen opacity-70">
      {sparks.map((s) => (
          <span
          key={s.id}
          className="spark absolute bottom-[8%] rounded-full bg-[#ffb347]"
          style={
            {
              left: s.left,
              width: s.size,
              height: s.size,
              animationDelay: s.delay,
              ['--sx' as string]: s.sx,
              ['--sy' as string]: s.sy,
              boxShadow: '0 0 8px #ff4d1a',
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}
