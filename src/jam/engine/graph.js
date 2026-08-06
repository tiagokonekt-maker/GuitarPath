// Groply — jam/engine/graph.js
// Chaîne de mixage.
//
// Le retour direct après premier essai : "ça fait très électronique bas de
// gamme". Ce fichier corrige quatre manques réels du premier jet — pas la
// qualité des échantillons, mais l'absence de tout traitement de
// production, qui à elle seule peut faire sonner "cheap" même de bons sons
// bruts. Un ingénieur du son ne branche jamais des micros directement au
// haut-parleur : il égalise, compresse, met en espace, sature. Rien de ça
// n'existait dans la première version.

// ─────────────────────────────────────────────────────────────────────────
// RÉVERBÉRATION — décroissance dépendante de la fréquence
// ─────────────────────────────────────────────────────────────────────────
// Une vraie pièce absorbe les aigus plus vite que les graves : la traîne
// s'assombrit avec le temps. Du bruit blanc pur qui décroît uniformément
// reste sifflant du début à la fin — c'est ce qui donne cette sensation de
// "reverb de pédale bon marché", et ça peut activement AJOUTER du côté
// artificiel plutôt que d'en retirer.
function makeImpulse(ctx, seconds = 1.6, decay = 2.2) {
  const rate = ctx.sampleRate;
  const len = Math.floor(rate * seconds);
  const impulse = ctx.createBuffer(2, len, rate);

  for (let ch = 0; ch < 2; ch++) {
    const data = impulse.getChannelData(ch);
    // Filtre passe-bas glissant appliqué au bruit généré : coupure large
    // au début (impact net des premières réflexions), de plus en plus
    // étroite vers la fin (traîne assourdie, comme une vraie pièce).
    let lp = 0;
    for (let i = 0; i < len; i++) {
      const t = i / len;
      const envelope = Math.pow(1 - t, decay) * Math.min(1, t * 60);
      const raw = (Math.random() * 2 - 1) * envelope;
      const cutoffCoeff = Math.max(0.04, 0.55 - t * 0.5);
      lp = lp + cutoffCoeff * (raw - lp);
      data[i] = lp * 1.8;   // compense l'atténuation du filtrage
    }
  }
  return impulse;
}

// ─────────────────────────────────────────────────────────────────────────
// SATURATION — chaleur discrète, pas de distorsion
// ─────────────────────────────────────────────────────────────────────────
// On mélange le signal identité avec une version saturée, plutôt que de
// piloter la courbure uniquement via le paramètre de saturation : cette
// dernière approche (tentée d'abord) s'est révélée bien plus appuyée que
// prévu à la vérification — +46% de niveau à mi-amplitude au lieu d'un
// effet discret. Le mélange donne un contrôle direct et fiable de
// l'intensité perçue.
function makeSaturationCurve(mix = 0.16) {
  const n = 1024;
  const curve = new Float32Array(n);
  const drive = 2.5;   // fixe — la variation vient du mélange, pas du drive
  const norm = Math.tanh(drive);
  for (let i = 0; i < n; i++) {
    const x = (i / (n - 1)) * 2 - 1;
    const saturated = Math.tanh(x * drive) / norm;
    curve[i] = x * (1 - mix) + saturated * mix;
  }
  return curve;
}

// ─────────────────────────────────────────────────────────────────────────
// ÉGALISATION PAR ÉLÉMENT DE BATTERIE
// ─────────────────────────────────────────────────────────────────────────
const DRUM_EQ = {
  kick:      [{ type: "lowshelf",  freq: 90,   gain: 4.5 }, { type: "peaking", freq: 400,  gain: -3, Q: 1.1 }, { type: "peaking", freq: 3000, gain: 2, Q: 0.8 }],
  snare:     [{ type: "peaking",   freq: 250,  gain: -2.5, Q: 1 }, { type: "peaking", freq: 3200, gain: 3.5, Q: 0.9 }, { type: "highshelf", freq: 8000, gain: 1.5 }],
  hihat:     [{ type: "highpass",  freq: 350 }, { type: "highshelf", freq: 9000, gain: -3 }],
  hihatOpen: [{ type: "highpass",  freq: 300 }, { type: "highshelf", freq: 9000, gain: -3 }],
  ride:      [{ type: "highpass",  freq: 250 }, { type: "highshelf", freq: 9000, gain: -2.5 }],
  crash:     [{ type: "highpass",  freq: 200 }, { type: "highshelf", freq: 9000, gain: -3.5 }],
  tomMid:    [{ type: "lowshelf",  freq: 150,  gain: 2.5 }, { type: "peaking", freq: 400, gain: -2, Q: 1 }],
  tomLow:    [{ type: "lowshelf",  freq: 100,  gain: 3.5 }, { type: "peaking", freq: 350, gain: -2, Q: 1 }],
};

function buildEqChain(ctx, instrument) {
  const bands = DRUM_EQ[instrument];
  if (!bands) return null;
  const nodes = bands.map(b => {
    const f = ctx.createBiquadFilter();
    f.type = b.type;
    f.frequency.value = b.freq;
    if (b.gain !== undefined) f.gain.value = b.gain;
    if (b.Q !== undefined) f.Q.value = b.Q;
    return f;
  });
  for (let i = 0; i < nodes.length - 1; i++) nodes[i].connect(nodes[i + 1]);
  return { input: nodes[0], output: nodes[nodes.length - 1] };
}

export function createGraph(ctx) {
  const master = ctx.createGain();
  master.gain.value = 0.9;

  const saturator = ctx.createWaveShaper();
  saturator.curve = makeSaturationCurve(0.16);
  saturator.oversample = "2x";

  const glue = ctx.createDynamicsCompressor();
  glue.threshold.value = -16;
  glue.knee.value      = 8;
  glue.ratio.value     = 2.8;
  glue.attack.value    = 0.008;
  glue.release.value   = 0.16;

  glue.connect(saturator);
  saturator.connect(master);
  master.connect(ctx.destination);

  // ── Bus de compression PARALLÈLE pour la batterie ────────────────────
  // Une copie du signal, très compressée, mélangée SOUS le signal propre.
  // Le signal propre garde son attaque nette ; la copie écrasée apporte le
  // corps et la puissance perçue. C'est le "punch" qui manquait.
  const drumParallelBus = ctx.createGain();
  const drumParallelComp = ctx.createDynamicsCompressor();
  drumParallelComp.threshold.value = -32;
  drumParallelComp.knee.value      = 4;
  drumParallelComp.ratio.value     = 10;
  drumParallelComp.attack.value    = 0.001;
  drumParallelComp.release.value   = 0.12;
  const drumParallelGain = ctx.createGain();
  drumParallelGain.gain.value = 0.35;

  drumParallelBus.connect(drumParallelComp);
  drumParallelComp.connect(drumParallelGain);
  drumParallelGain.connect(glue);

  const reverb = ctx.createConvolver();
  reverb.buffer = makeImpulse(ctx);
  const reverbReturn = ctx.createGain();
  reverbReturn.gain.value = 0.85;
  reverb.connect(reverbReturn);
  reverbReturn.connect(glue);

  function createChannel({ gain = 0.8, pan = 0, send = 0.1, highpass = 0, lowpass = 0, parallelSend = 0 } = {}) {
    const input  = ctx.createGain();
    const volume = ctx.createGain();
    const panner = ctx.createStereoPanner();
    const sendGain = ctx.createGain();
    const parallelSendGain = ctx.createGain();

    volume.gain.value  = gain;
    panner.pan.value   = pan;
    sendGain.gain.value = send;
    parallelSendGain.gain.value = parallelSend;

    let node = input;
    if (highpass > 0) {
      const hp = ctx.createBiquadFilter();
      hp.type = "highpass"; hp.frequency.value = highpass;
      node.connect(hp); node = hp;
    }
    if (lowpass > 0) {
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass"; lp.frequency.value = lowpass;
      node.connect(lp); node = lp;
    }
    node.connect(volume);
    volume.connect(panner);
    panner.connect(glue);
    volume.connect(sendGain);
    sendGain.connect(reverb);
    if (parallelSend > 0) { volume.connect(parallelSendGain); parallelSendGain.connect(drumParallelBus); }

    return {
      input,
      setGain(v, t = ctx.currentTime, ramp = 0.05) {
        volume.gain.cancelScheduledValues(t);
        volume.gain.setTargetAtTime(Math.max(0, v), t, ramp);
      },
      setSend(v) { sendGain.gain.value = Math.max(0, v); },
      setPan(v)  { panner.pan.value = Math.max(-1, Math.min(1, v)); },
    };
  }

  const eqCache = new Map();

  return {
    ctx,
    master,
    createChannel,
    setMasterGain(v) { master.gain.value = Math.max(0, Math.min(1.5, v)); },

    getDrumEq(instrument) {
      if (eqCache.has(instrument)) return eqCache.get(instrument);
      const chain = buildEqChain(ctx, instrument);
      eqCache.set(instrument, chain);
      return chain;
    },

    get drumParallelBus() { return drumParallelBus; },

    dispose() {
      try {
        master.disconnect(); glue.disconnect(); saturator.disconnect();
        reverb.disconnect(); reverbReturn.disconnect();
        drumParallelBus.disconnect(); drumParallelComp.disconnect(); drumParallelGain.disconnect();
        for (const chain of eqCache.values()) { chain?.input.disconnect(); chain?.output.disconnect(); }
      } catch {}
    },
  };
}

export const CHANNEL_PRESETS = {
  drums: { gain: 0.85, pan:  0.00, send: 0.11, highpass: 30, parallelSend: 0.55 },
  bass:  { gain: 0.90, pan:  0.00, send: 0.03, highpass: 35, lowpass: 2500 },
  comp:  { gain: 0.52, pan: -0.18, send: 0.16, highpass: 120, lowpass: 3200 },
};
