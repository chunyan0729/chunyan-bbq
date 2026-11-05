import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { copy, type Lang } from './i18n'

type CartLine = { id: string; qty: number }

type AppCtx = {
  lang: Lang
  setLang: (l: Lang) => void
  t: (typeof copy)[Lang]
  cart: CartLine[]
  add: (id: string) => void
  clear: () => void
}

const Ctx = createContext<AppCtx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('zh')
  const [cart, setCart] = useState<CartLine[]>([])

  const value = useMemo<AppCtx>(
    () => ({
      lang,
      setLang,
      t: copy[lang],
      cart,
      add: (id) =>
        setCart((prev) => {
          const hit = prev.find((p) => p.id === id)
          if (hit) {
            return prev.map((p) =>
              p.id === id ? { ...p, qty: p.qty + 1 } : p,
            )
          }
          return [...prev, { id, qty: 1 }]
        }),
      clear: () => setCart([]),
    }),
    [lang, cart],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useApp() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useApp outside provider')
  return v
}
