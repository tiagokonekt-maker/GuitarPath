import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  build: {
    // Augmenter légèrement le seuil d'avertissement (notre split va le résoudre)
    chunkSizeWarningLimit: 600,

    rollupOptions: {
      output: {
        manualChunks: {
          // React core — mis en cache longtemps, ne change jamais
          'vendor-react': ['react', 'react-dom'],

          // Contenu pédagogique — gros fichier, chargé en lazy dans App.jsx
          'content': ['./src/content.js'],

          // Visuels manche — chargés en lazy dans App.jsx
          'fretboard': [
            './src/Fretboard.jsx',
            './src/fretboardUtils.js',
            './src/fretboardValidator.js',
          ],

          // Diagrammes SVG — chargés en lazy dans App.jsx
          'diagrams': ['./src/diagrams.jsx'],

          // Supabase — auth + progress, chargés tôt mais séparément
          'supabase': [
            './src/supabase/useAuth.js',
            './src/supabase/useProgress.js',
            './src/supabase/AuthScreen.jsx',
            './src/supabaseClient.js',
          ],
        },
      },
    },
  },
})
