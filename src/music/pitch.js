// Groply — src/music/pitch.js
// Détection de hauteur pour l'accordeur (NSDF normalisée, décimation par 2,
// affinage à la résolution complète). Fonction pure, sans dépendance au DOM.

// ─────────────────────────────────────────────────────────────────────────
// DÉTECTION DE HAUTEUR
// Plage utile réelle des accordages du catalogue : Ré2 (73 Hz) au plus grave,
// Si4 (494 Hz) au plus aigu (guitare portugaise). On garde de la marge de
// part et d'autre pour les cordes très désaccordées.
// ─────────────────────────────────────────────────────────────────────────
const PITCH_MIN_HZ = 60;
const PITCH_MAX_HZ = 700;

// NSDF normalisée sur un écart donné, à la résolution demandée.
function nsdfAt(x, N, lag) {
  let acf = 0, energy = 0;
  const n = N - lag;
  for (let i = 0; i < n; i++) {
    const a = x[i], b = x[i + lag];
    acf += a * b;
    energy += a * a + b * b;
  }
  return energy > 0 ? (2 * acf) / energy : 0;
}

export function detectPitch(buf, sampleRate) {
  // ── Décimation par 2 ──────────────────────────────────────────────────
  // Le graphe audio coupe déjà tout au-dessus de 1400 Hz, donc diviser par
  // deux la fréquence d'échantillonnage ne crée aucun repliement, et divise
  // par quatre le coût de la recherche (moitié moins d'écarts à tester, sur
  // moitié moins d'échantillons).
  const R = 2;
  const rate = sampleRate / R;
  const minLag = Math.max(2, Math.floor(rate / PITCH_MAX_HZ));
  const maxLag = Math.ceil(rate / PITCH_MIN_HZ);
  // Trois périodes de la note la plus grave suffisent pour une mesure stable :
  // inutile de balayer les 8192 échantillons de la fenêtre entière.
  const N = Math.min(Math.floor(buf.length / R), maxLag * 3);
  if (N < maxLag + 2) return -1;

  const x = new Float32Array(N);
  for (let i = 0; i < N; i++) x[i] = buf[i * R];

  // ── Seuil de niveau ───────────────────────────────────────────────────
  let e0 = 0;
  for (let i = 0; i < N; i++) e0 += x[i] * x[i];
  if (Math.sqrt(e0 / N) < 0.0012) return -1;

  // ── Recherche grossière sur le signal décimé ──────────────────────────
  // Version NORMALISÉE (entre -1 et 1) : contrairement à une autocorrélation
  // brute dont l'amplitude dépend du volume joué, un seuil de confiance
  // devient ici réellement comparable d'une note à l'autre.
  const nsdf = new Float32Array(maxLag + 2);
  let best = 0;
  for (let lag = minLag; lag <= maxLag; lag++) {
    const v = nsdfAt(x, N, lag);
    nsdf[lag] = v;
    if (v > best) best = v;
  }
  if (best < 0.35) return -1;   // non périodique : bruit, souffle, larsen

  // ── Premier pic franc, PAS le maximum global ──────────────────────────
  // Une corde de guitare est riche en harmoniques : le maximum global tombe
  // fréquemment une octave en dessous (ou au-dessus) du vrai fondamental.
  // Retenir le premier pic atteignant 85 % du meilleur évite ces erreurs
  // d'octave, qui sont le défaut classique d'un accordeur de ce type.
  const thresh = best * 0.85;
  let coarse = -1;
  for (let i = minLag + 1; i < maxLag; i++) {
    if (nsdf[i] >= thresh && nsdf[i] >= nsdf[i-1] && nsdf[i] >= nsdf[i+1]) { coarse = i; break; }
  }
  if (coarse < 0) return -1;

  // ── Affinage à la résolution complète ─────────────────────────────────
  // La recherche décimée ne donne l'écart qu'à 2 échantillons près. Sans cet
  // affinage la précision serait trop grossière sur les cordes aiguës : vers
  // 330 Hz, un seul échantillon d'écart représente déjà ~25 cents.
  const center = coarse * R;
  const lo = Math.max(2, center - R - 1);
  const hi = Math.min(Math.floor(buf.length / 3) - 1, center + R + 1);
  const NF = Math.min(buf.length, hi * 3);
  let bestLag = center, bestVal = -Infinity;
  const vals = {};
  for (let l = lo; l <= hi; l++) {
    const v = nsdfAt(buf, NF, l);
    vals[l] = v;
    if (v > bestVal) { bestVal = v; bestLag = l; }
  }

  // Interpolation parabolique pour descendre sous l'échantillon (~1 cent).
  let T0 = bestLag;
  const y1 = vals[bestLag - 1], y2 = vals[bestLag], y3 = vals[bestLag + 1];
  if (y1 !== undefined && y3 !== undefined) {
    const a = (y1 + y3 - 2 * y2) / 2, b = (y3 - y1) / 2;
    if (a !== 0) {
      const shift = -b / (2 * a);
      if (Math.abs(shift) <= 1) T0 = bestLag + shift;
    }
  }

  const freq = sampleRate / T0;
  if (freq < PITCH_MIN_HZ || freq > PITCH_MAX_HZ) return -1;
  return freq;
}
