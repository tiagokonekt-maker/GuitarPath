import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        // Vite 8 utilise Rolldown en interne (réécriture en Rust de
        // Rollup), qui n'accepte plus la forme objet de manualChunks —
        // seulement une fonction. C'est un changement du bundler lui-même,
        // largement documenté depuis la sortie de Vite 8, sans rapport
        // avec le contenu de ce projet. Même découpage qu'avant, exprimé
        // comme une fonction plutôt qu'un objet.
        manualChunks(id) {
          if (/[\\/]node_modules[\\/](react|react-dom)[\\/]/.test(id)) return 'vendor-react';
          if (/[\\/]src[\\/]content\.js$/.test(id)) return 'content';
          if (/[\\/]src[\\/]supabase[\\/]/.test(id) || /[\\/]src[\\/]supabaseClient\.js$/.test(id)) return 'supabase';
        },
      },
    },
  },
})
