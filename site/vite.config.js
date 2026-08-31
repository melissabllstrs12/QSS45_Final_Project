import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Relative asset URLs, so the same build works at the domain root or under
  // a GitHub Pages subpath (/QSS45_final_project/). Routing is HashRouter,
  // which needs no server rewrites either.
  base: './',
})
