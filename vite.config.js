import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Base path defaults to "/" for production hosting (Hostinger).
// The GitHub Pages preview workflow sets VITE_BASE=/NYC-Headlights/.
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
})
