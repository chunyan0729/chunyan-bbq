/** Public-folder URL that follows Vite's `base` (GitHub project Pages). */
export function asset(path: string): string {
  const clean = path.replace(/^\//, '')
  const base = import.meta.env.BASE_URL
  return `${base}${clean}`
}
