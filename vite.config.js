import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// VITE_BASE is where assets are served from; it defaults to "/".
//   staging        /staging/                          (Makefile)
//   GitHub Pages   /NYC-Headlights/                   (.github/workflows/deploy.yml)
//   WordPress      /wp-content/themes/nyc-headlights/ (build-wordpress-theme.cjs)
// The router's base is VITE_ROUTER_BASE, falling back to VITE_BASE (src/App.jsx).
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
})
