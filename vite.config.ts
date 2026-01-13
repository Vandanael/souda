import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/souda/', // GitHub Pages subpath (change to '/' if using custom domain)
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Séparer uniquement les vendors principaux (pas de dépendances circulaires)
          if (id.includes('node_modules')) {
            // React et React DOM ensemble
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react'
            }
            // Framer Motion (animations lourdes)
            if (id.includes('framer-motion')) {
              return 'vendor-motion'
            }
            // Zustand (petit mais séparé pour clarté)
            if (id.includes('zustand')) {
              return 'vendor-zustand'
            }
            // Autres vendors
            return 'vendor-other'
          }
          
          // Ne pas séparer les features qui ont des dépendances circulaires avec le store
          // Le lazy loading des écrans suffit pour réduire la taille du chunk initial
        },
      },
    },
  },
})
