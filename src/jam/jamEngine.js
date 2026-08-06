// Groply — jam/jamEngine.js
// Orchestrateur : relie l'horloge, le plan, les décisions, les générateurs
// et le rendu audio. C'est le seul point d'entrée utilisé par l'interface.

import { createClock } from "./engine/clock.js";
import { createSampleBank } from "./engine/sampleBank.js";
import { createGraph, CHANNEL_PRESETS } from "./engine/graph.js";
import { createPlanner, createDirector } from "./arrangement/arranger.js";
import { generateDrumBar } from "./generators/drums.js";

export function createJamEngine() {
  let ctx = null, graph = null, bank = null, clock = null;
  let planner = null, director = null;
  let pack = null, packName = null;
  let channels = {};
  let energy = 3;
  let muted = new Set();
  let running = false;
  let onBarRendered = null;
  const active = new Set();   // sources en cours, pour un arrêt propre

  /** Traduit un évènement musical en son. */
  function renderEvent(ev) {
    if (muted.has("drums")) return;
    const pick = bank.pick(packName, ev.instrument, ev.velocity);
    if (!pick) return;   // échantillon absent : on saute, sans planter

    const src = ctx.createBufferSource();
    src.buffer = pick.buffer;

    const g = ctx.createGain();
    // La couche de dynamique porte déjà le timbre ; le gain n'ajuste que
    // finement à l'intérieur de la couche.
    g.gain.value = pick.gain * (0.45 + ev.velocity * 0.55);

    // Chaque frappe passe par l'égalisation propre à son élément (grosse
    // caisse, caisse claire, cymbales...) avant de rejoindre la voie
    // batterie commune. Sans ce détour, tous les fûts recevaient exactement
    // le même traitement — l'une des causes du rendu "plat".
    const eq = graph.getDrumEq(ev.instrument);
    src.connect(g);
    if (eq) { g.connect(eq.input); eq.output.connect(channels.drums.input); }
    else    { g.connect(channels.drums.input); }

    const when = Math.max(ctx.currentTime, ev.time);
    if (pick.duration !== undefined) src.start(when, pick.offset, pick.duration);
    else src.start(when, pick.offset);

    active.add(src);
    src.onended = () => { active.delete(src); try { src.disconnect(); g.disconnect(); } catch {} };
  }

  return {
    get running() { return running; },
    get energy()  { return energy; },
    get missingSamples() { return bank?.missing ?? []; },

    /** Prépare le contexte audio et charge un pack. Doit suivre un geste utilisateur. */
    async init(stylePack, sampleManifest) {
      if (!ctx) {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
        graph = createGraph(ctx);
        bank = createSampleBank(ctx);
        for (const [name, preset] of Object.entries(CHANNEL_PRESETS)) {
          channels[name] = graph.createChannel(preset);
        }
      }
      if (ctx.state === "suspended") await ctx.resume();

      pack = stylePack;
      packName = stylePack.audioPack || "default";
      const result = await bank.load(packName, sampleManifest);
      return result;
    },

    /** Lance la session. */
    start({ bpm, startEnergy = 3 } = {}) {
      if (running || !pack) return;
      energy = startEnergy;
      planner  = createPlanner({ baseEnergy: energy });
      director = createDirector(pack);
      const tempo = bpm || pack.defaultTempo || 90;

      clock = createClock(ctx, {
        beatsPerBar: 4,
        onBar: (barIndex, barStartTime, info) => {
          planner.ensurePlannedUpTo(barIndex + 24);
          const section = planner.sectionAt(barIndex);
          const barEnergy = section.energy;
          const decision = director.decideBar(barIndex, section, barEnergy);

          const events = generateDrumBar(pack, decision, {
            barStartTime,
            secPerBeat: info.secPerBeat,
            beatsPerBar: info.beatsPerBar,
            bpm: clock.bpm,
            energy: barEnergy,
          });
          for (const ev of events) renderEvent(ev);

          // Retour à l'interface : uniquement de l'information, jamais de
          // pilotage audio depuis React.
          onBarRendered?.({
            bar: barIndex, time: barStartTime, section,
            energy: barEnergy, decision, eventCount: events.length,
          });
        },
      });

      clock.start(tempo);
      running = true;
    },

    stop() {
      running = false;
      clock?.stop();
      for (const s of active) { try { s.stop(); } catch {} }
      active.clear();
    },

    // ── Contrôles vivants ────────────────────────────────────────────────
    // On ne configure pas une session, on la dirige pendant qu'elle joue.

    nudgeEnergy(delta) {
      if (!running) { energy = Math.max(1, Math.min(5, energy + delta)); return energy; }
      const pos = clock.position();
      energy = planner.nudgeEnergy(delta, pos.bar);
      return energy;
    },

    nudgeTempo(delta) {
      if (!clock) return 0;
      const next = Math.max(40, Math.min(220, clock.bpm + delta));
      clock.setBpm(next);
      return next;
    },

    /** Bouton « Change » : renouvelle le vocabulaire immédiatement. */
    requestChange() { director?.requestChange(); },

    toggleMute(instrument) {
      if (muted.has(instrument)) muted.delete(instrument); else muted.add(instrument);
      return !muted.has(instrument);
    },

    setOnBar(fn) { onBarRendered = fn; },

    /** Position musicale — pour la synchronisation VISUELLE uniquement. */
    position() { return clock?.position() ?? { bar: 0, beat: 0, phase: 0 }; },

    dispose() {
      this.stop();
      graph?.dispose();
      if (ctx && ctx.state !== "closed") ctx.close();
      ctx = null; graph = null; bank = null; clock = null;
    },
  };
}
