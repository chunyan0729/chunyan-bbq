import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// GitHub project Pages: https://chunyan0729.github.io/chunyan-bbq/
// `vite` (dev) stays at / so the local server URL does not move.
// `vite build` and `vite preview` use the project path.
export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? '/chunyan-bbq/' : '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
}))
