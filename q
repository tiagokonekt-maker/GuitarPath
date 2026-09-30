import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
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
