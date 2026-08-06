// Groply — jam/engine/clock.js
// Transport : ordonnanceur à anticipation + carte de tempo.
//
// RÈGLE ABSOLUE DE CE FICHIER : l'audio n'est JAMAIS piloté par
// requestAnimationFrame. On remplit une file d'évènements en avance sur
// l'horloge audio ; une fois source.start(when) appelé, l'évènement est
// verrouillé sur le thread audio. Même un blocage complet du fil principal
// (rendu React, ramasse-miettes) ne provoque alors aucun décalage sonore.

const LOOKAHEAD_S = 0.15;   // horizon d'ordonnancement
const TICK_MS     = 25;     // fréquence de remplissage de la file

/**
 * Carte de tempo : permet de convertir position <-> temps même après
 * plusieurs changements de tempo. On recalcule toujours depuis un point
 * d'ancrage, on n'accumule JAMAIS d'incréments — une accumulation dérive
 * inévitablement sur une session de 30 minutes.
 */
function createTempoMap(startTime, bpm) {
  const segments = [{ time: startTime, beat: 0, bpm }];

  return {
    segments,

    /** Ajoute un changement de tempo à partir d'un temps donné. */
    setBpmAt(time, newBpm) {
      const beat = this.beatAt(time);
      segments.push({ time, beat, bpm: newBpm });
    },

    /** Segment actif à un instant donné. */
    segmentAt(time) {
      let seg = segments[0];
      for (const s of segments) { if (s.time <= time) seg = s; else break; }
      return seg;
    },

    /** temps (s) -> position (temps musicaux, en noires). */
    beatAt(time) {
      const s = this.segmentAt(time);
      return s.beat + (time - s.time) * s.bpm / 60;
    },

    /** position (noires) -> temps (s). */
    timeAt(beat) {
      let seg = segments[0];
      for (const s of segments) { if (s.beat <= beat) seg = s; else break; }
      return seg.time + (beat - seg.beat) * 60 / seg.bpm;
    },

    bpmAt(time) { return this.segmentAt(time).bpm; },

    /** Purge les segments trop anciens (session longue = fuite mémoire sinon). */
    prune(before) {
      while (segments.length > 1 && segments[1].time < before) segments.shift();
    },
  };
}

/**
 * Crée le transport.
 *
 * @param {AudioContext} ctx
 * @param {object} opts
 *   beatsPerBar  — signature (4 par défaut)
 *   onBar(barIndex, barStartTime, ctxInfo) — appelé quand une mesure doit
 *                  être ordonnancée. C'est ici que l'appelant produit et
 *                  planifie ses évènements.
 */
export function createClock(ctx, { beatsPerBar = 4, onBar = null } = {}) {
  let running = false;
  let timer = null;
  let tempoMap = null;
  let nextBar = 0;          // prochaine mesure à ordonnancer
  let startTime = 0;
  let currentBpm = 100;
  let handler = onBar;

  function barStartBeat(barIndex) { return barIndex * beatsPerBar; }

  function fill() {
    if (!running) return;
    const horizon = ctx.currentTime + LOOKAHEAD_S;
    // On ordonnance mesure par mesure tant que le début de la prochaine
    // mesure tombe dans l'horizon.
    let guard = 0;
    while (guard++ < 16) {
      const t = tempoMap.timeAt(barStartBeat(nextBar));
      if (t > horizon) break;
      const secPerBeat = 60 / tempoMap.bpmAt(t);
      try {
        handler?.(nextBar, t, { secPerBeat, beatsPerBar, tempoMap });
      } catch (e) {
        console.warn("[clock] erreur dans onBar:", e);
      }
      nextBar++;
    }
    tempoMap.prune(ctx.currentTime - 5);
  }

  return {
    get running() { return running; },
    get bpm() { return currentBpm; },
    get beatsPerBar() { return beatsPerBar; },
    get startTime() { return startTime; },
    get tempoMap() { return tempoMap; },

    setOnBar(fn) { handler = fn; },

    start(bpm = 100, delay = 0.12) {
      if (running) return;
      currentBpm = bpm;
      // Petit délai avant la première mesure : laisse le temps de remplir la
      // file sans démarrer dans l'urgence.
      startTime = ctx.currentTime + delay;
      tempoMap = createTempoMap(startTime, bpm);
      nextBar = 0;
      running = true;
      fill();
      timer = setInterval(fill, TICK_MS);
    },

    stop() {
      running = false;
      if (timer) { clearInterval(timer); timer = null; }
    },

    /**
     * Changement de tempo progressif. Un saut instantané s'entend comme un
     * défaut ; on répartit donc la variation sur quelques paliers.
     */
    setBpm(target, rampSeconds = 1.5) {
      if (!running || !tempoMap) { currentBpm = target; return; }
      const from = currentBpm;
      const steps = 6;
      const now = ctx.currentTime;
      for (let i = 1; i <= steps; i++) {
        const t = now + (rampSeconds * i) / steps;
        const v = from + (target - from) * (i / steps);
        tempoMap.setBpmAt(t, v);
      }
      currentBpm = target;
    },

    /** Position musicale courante — pour la synchronisation VISUELLE. */
    position() {
      if (!running || !tempoMap) return { bar: 0, beat: 0, phase: 0 };
      const b = Math.max(0, tempoMap.beatAt(ctx.currentTime));
      const bar = Math.floor(b / beatsPerBar);
      const beatInBar = b - bar * beatsPerBar;
      return { bar, beat: Math.floor(beatInBar), phase: beatInBar / beatsPerBar };
    },
  };
}
