import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { alphaTab } from '@coderline/alphatab-vite'

export default defineConfig({
  // alphaTab utilise des web workers en interne pour le rendu, et un
  // import standard (@coderline/alphatab tout court) ne les configure pas
  // correctement sous Vite — c'est très probablement la cause du "rien ne
  // s'affiche" : le worker ne se construit jamais, sans qu'aucune erreur
  // ne remonte proprement à la console. Ce plugin dédié gère ça, plus la
  // copie de la police (Bravura) au bon endroit — le robocopy fait à la
  // main plus tôt n'est donc plus nécessaire, voir la note dans
  // ToolboxScreen.jsx à ce sujet.
  plugins: [react(), alphaTab()],
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'content': ['./src/content.js'],
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
