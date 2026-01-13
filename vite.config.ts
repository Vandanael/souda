import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/souda/', // GitHub Pages subpath (change to '/' if using custom domain)
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
