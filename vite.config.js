import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (/[\\/]node_modules[\\/](react|react-dom)[\\/]/.test(id)) return 'vendor-react'
          if (/[\\/]src[\\/]content\.js$/.test(id)) return 'content'
          if (/[\\/]src[\\/]supabase[\\/]/.test(id) || /[\\/]src[\\/]supabaseClient\.js$/.test(id)) return 'supabase'
        },
      },
    },
  },
})
