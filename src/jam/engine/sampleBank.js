// Groply — jam/engine/sampleBank.js
// Chargement, décodage, cache et SÉLECTION des échantillons.
//
// C'est ici que se joue la différence entre "sonne comme une machine" et
// "sonne comme un musicien" :
//   - couches de dynamique : une frappe douce n'est pas une frappe forte
//     baissée en volume, c'est un timbre différent (moins d'attaque, moins
//     d'harmoniques) ;
//   - round-robin : deux frappes successives ne doivent JAMAIS utiliser le
//     même fichier, sinon l'oreille détecte immédiatement la répétition
//     mécanique. C'est le défaut principal du moteur actuel.

/**
 * Format de manifeste attendu :
 * {
 *   "baseUrl": "/audio/jam/drums-vcsl/",
 *   "sprite":  "kit.opus",        // optionnel — sinon fichiers individuels
 *   "samples": {
 *     "kick": [
 *       { "vel": [0.00, 0.45], "files": ["kick_vl1_rr1.wav", "kick_vl1_rr2.wav"] },
 *       { "vel": [0.45, 0.80], "files": ["kick_vl2_rr1.wav", "kick_vl2_rr2.wav"] },
 *       { "vel": [0.80, 1.01], "files": ["kick_vl3_rr1.wav", "kick_vl3_rr2.wav"] }
 *     ]
 *   }
 * }
 *
 * Avec un sprite, chaque entrée de "files" devient
 *   { "id": "kick_vl1_rr1", "start": 0.0, "duration": 0.41 }
 * -> une seule requête HTTP et un seul décodage pour tout le kit, ce qui
 *    change tout sur un réseau mobile (420 requêtes sinon).
 */
export function createSampleBank(ctx) {
  const buffers   = new Map();   // clé -> AudioBuffer
  const manifests = new Map();   // nom du pack -> manifeste
  const rrState   = new Map();   // clé de couche -> dernier index joué
  let spriteBuffer = null;

  async function fetchAndDecode(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${res.status} sur ${url}`);
    const raw = await res.arrayBuffer();
    return await ctx.decodeAudioData(raw);
  }

  return {
    /** Un pack est-il déjà chargé ? */
    isLoaded(packName) { return manifests.has(packName); },

    /** Liste des échantillons manquants — utile pour un diagnostic clair. */
    missing: [],

    /**
     * Charge un pack. Tolérant aux fichiers absents : on charge ce qui
     * existe et on remonte la liste des manquants plutôt que de tout faire
     * échouer — un pack incomplet doit rester jouable pendant la mise au
     * point du contenu audio.
     */
    async load(packName, manifest) {
      manifests.set(packName, manifest);
      const base = manifest.baseUrl || "";
      const missing = [];

      if (manifest.sprite) {
        // Mode sprite : une requête, un décodage.
        try {
          spriteBuffer = await fetchAndDecode(base + manifest.sprite);
        } catch (e) {
          missing.push(manifest.sprite);
          console.warn("[sampleBank] sprite introuvable:", e.message);
        }
        this.missing = missing;
        return { ok: missing.length === 0, missing };
      }

      // Mode fichiers individuels.
      const jobs = [];
      for (const [inst, layers] of Object.entries(manifest.samples || {})) {
        for (const layer of layers) {
          for (const f of layer.files) {
            const key = `${packName}:${f}`;
            if (buffers.has(key)) continue;
            jobs.push(
              fetchAndDecode(base + f)
                .then(buf => buffers.set(key, buf))
                .catch(() => missing.push(f))
            );
          }
        }
      }
      await Promise.all(jobs);
      this.missing = missing;
      return { ok: missing.length === 0, missing, loaded: buffers.size };
    },

    /**
     * Sélectionne un échantillon pour un instrument à une dynamique donnée.
     * Retourne { buffer, offset, duration, gain } ou null.
     *
     * @param velocity 0..1
     */
    pick(packName, instrument, velocity) {
      const manifest = manifests.get(packName);
      const layers = manifest?.samples?.[instrument];
      if (!layers?.length) return null;

      const v = Math.max(0, Math.min(1, velocity));

      // 1. Couche de dynamique correspondante.
      let layer = layers.find(l => v >= l.vel[0] && v < l.vel[1]) || layers[layers.length - 1];
      if (!layer?.files?.length) return null;

      // 2. Round-robin SANS répétition immédiate. Avec 2 variantes on
      //    alterne ; avec 3+ on tire au hasard en excluant la précédente.
      const rrKey = `${packName}:${instrument}:${layers.indexOf(layer)}`;
      const n = layer.files.length;
      const last = rrState.get(rrKey);
      let idx;
      if (n === 1)      idx = 0;
      else if (n === 2) idx = last === 0 ? 1 : 0;
      else {
        do { idx = Math.floor(Math.random() * n); } while (idx === last);
      }
      rrState.set(rrKey, idx);

      const entry = layer.files[idx];

      // 3. Gain résiduel : la couche porte déjà le bon timbre, on n'ajuste
      //    que finement à l'intérieur de la couche. Appliquer la vélocité
      //    entière en volume annulerait l'intérêt des couches.
      const span = layer.vel[1] - layer.vel[0];
      const within = span > 0 ? (v - layer.vel[0]) / span : 0.5;
      const gain = 0.82 + within * 0.18;

      if (spriteBuffer && typeof entry === "object") {
        return { buffer: spriteBuffer, offset: entry.start, duration: entry.duration, gain };
      }
      const buf = buffers.get(`${packName}:${entry}`);
      if (!buf) return null;
      return { buffer: buf, offset: 0, duration: undefined, gain };
    },

    /** Libère un pack (éviction mémoire sur mobile). */
    unload(packName) {
      for (const k of [...buffers.keys()]) {
        if (k.startsWith(packName + ":")) buffers.delete(k);
      }
      manifests.delete(packName);
    },

    stats() { return { buffers: buffers.size, packs: manifests.size }; },
  };
}
