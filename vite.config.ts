import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/souda/',  // GitHub Pages base path
  server: {
    port: 3000,
    open: true,
  },
})
