import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

// Plugin pour corriger les types MIME sur GitHub Pages
const fixMimeTypePlugin = () => {
  return {
    name: 'fix-mime-type',
    writeBundle(options: any) {
      if (options.dir) {
        const indexPath = resolve(options.dir, 'index.html')
        try {
          let html = readFileSync(indexPath, 'utf-8')
          // S'assurer que tous les scripts ont type="module" et crossorigin
          html = html.replace(
            /<script([^>]*?)src="([^"]*\.js)"([^>]*?)>/g,
            (match, before, src, after) => {
              let newAttrs = before + after
              if (!newAttrs.includes('type=')) {
                newAttrs = ' type="module"' + newAttrs
              }
              if (!newAttrs.includes('crossorigin')) {
                newAttrs = newAttrs + ' crossorigin'
              }
              return `<script${newAttrs}src="${src}">`
            }
          )
          writeFileSync(indexPath, html)
        } catch (error) {
          console.warn('Erreur lors de la modification du HTML:', error)
        }
      }
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), fixMimeTypePlugin()],
  base: process.env.NETLIFY ? '/' : '/souda/', // '/' pour Netlify, '/souda/' pour GitHub Pages
  server: {
    fs: {
      strict: false,
    },
    middlewareMode: false,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // S'assurer que les fichiers sont servis avec le bon type MIME
    assetsInlineLimit: 4096,
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
