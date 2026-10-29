import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { execFileSync } from 'node:child_process'
import { resolve } from 'node:path'
import process from 'node:process'

// ── Index du contenu côté app (src/content/index-app.js, corps-lecons.js) ──
// Générés depuis src/content/index.js par scripts/generer-index-app.mjs.
// Régénérés au lancement de Vite (dev et build) puis, en dev, à chaque
// modification d'un fichier de contenu. Le script tourne dans un processus
// à part : Node garde en cache les modules déjà importés, un import dans ce
// processus-ci verrait d'anciennes versions des leçons.
function indexContenuApp() {
  let racine = process.cwd()
  let enBuild = false
  const generer = () => execFileSync(process.execPath, [resolve(racine, 'scripts/generer-index-app.mjs')], { cwd: racine, stdio: 'inherit' })
  return {
    name: 'groply-index-contenu-app',
    configResolved(config) { racine = config.root; enBuild = config.command === 'build' },
    buildStart() {
      try { generer() } catch (e) {
        // Au build, on ne livre jamais un index périmé ; en dev, on continue.
        if (enBuild) throw e
      }
    },
    configureServer(server) {
      let minuteur = null
      const genere = /[\\/]src[\\/]content[\\/](index-app|corps-lecons)\.js$/
      server.watcher.on('all', (_evt, fichier) => {
        if (!/[\\/]src[\\/]content[\\/].*\.js$/.test(fichier) || genere.test(fichier)) return
        clearTimeout(minuteur)
        minuteur = setTimeout(() => { try { generer() } catch { /* erreur déjà affichée */ } }, 150)
      })
    },
  }
}

export default defineConfig({
  plugins: [indexContenuApp(), react()],
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (/[\\/]node_modules[\\/](react|react-dom)[\\/]/.test(id)) return 'vendor-react'
          // Fichiers de leçons (corps chargés à la demande) : un morceau par
          // leçon, laissé au découpage automatique. corps-lecons.js (la table
          // des chargeurs) suit l'écran qui l'utilise.
          if (/[\\/]src[\\/]content[\\/]cours[\\/]/.test(id)) return
          if (/[\\/]src[\\/]content[\\/]corps-lecons\.js$/.test(id)) return
          if (/[\\/]src[\\/]content[\\/]/.test(id)) return 'content'
          if (/[\\/]src[\\/]supabase[\\/]/.test(id) || /[\\/]src[\\/]supabaseClient\.js$/.test(id)) return 'supabase'
        },
      },
    },
  },
})
