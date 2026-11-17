// Groply — screens/PracticeScreen.jsx
import { useState, useEffect, useRef } from "react";
import { T } from "../design/tokens.js";
import { useC } from "../design/ThemeContext.jsx";
import { Button, Card, Eyebrow, IconTile, Segmented, SubHeader, XPPop } from "../design/ui.jsx";
import { vibrer } from "../design/hooks.js";
import { KEYS, MODES, TEMPOS, CONSTRAINTS } from "../store/challenges.js";

const ONGLETS = [{ value: "impro", label: "Impro" }, { value: "neck", label: "Manche" }, { value: "rhythm", label: "Rythme" }];

function PracticeScreen({ dispatch }) {
  const C = useC();
  const [tab, setTab] = useState("impro");
  const [current, setCurrent] = useState(null);
  const [pop, setPop] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const generateImpro = () => {
    const key = KEYS[Math.floor(Math.random() * KEYS.length)];
    const mode = MODES[Math.floor(Math.random() * MODES.length)];
    const tempo = TEMPOS[Math.floor(Math.random() * TEMPOS.length)];
    const constraint = CONSTRAINTS[Math.floor(Math.random() * CONSTRAINTS.length)];
    setCurrent({ type: "impro", title: `${key} ${mode} · ${tempo} BPM`, sub: constraint, time: 10 });
  };
  const generateNeck = () => {
    const challenges = [
      "trouve toutes les notes Do sur le manche en 30 secondes",
      "joue la pentatonique Am en 5 positions enchaînées",
      "trouve la triade de Fa majeur sur cordes 1-2-3 dans 3 positions",
      "joue Cmaj7 dans les 5 formes CAGED",
    ];
    setCurrent({ type: "neck", title: "Défi manche", sub: challenges[Math.floor(Math.random() * challenges.length)], time: 5 });
  };
  const generateRhythm = () => {
    const t = TEMPOS[Math.floor(Math.random() * TEMPOS.length)];
    const subs = ["noires", "croches", "doubles-croches", "triolets"][Math.floor(Math.random() * 4)];
    setCurrent({ type: "rhythm", title: `Métronome ${t} BPM`, sub: `Joue uniquement en ${subs} pendant 5 minutes`, time: 5 });
  };

  const finish = () => {
    setPop(true);
    vibrer();
    dispatch({ type: "PRACTICE_DONE", minutes: current?.time || 5 });
    dispatch({ type: "MARK_STREAK" });
    dispatch({ type: "UPDATE_WEEKLY", field: "sessions" });
    timerRef.current = setTimeout(() => {
      setPop(false);
      setCurrent(null);
    }, 1000);
  };

  return (
    <div>
      {pop && <XPPop amount={50} onDone={() => {}} />}
      <SubHeader title="Practice libre" subtitle="Défis générés à l'infini. Jamais 2 fois pareil." />

      <div style={{ padding: "16px 16px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
        <Segmented label="Type de défi" options={ONGLETS} value={tab}
          onChange={(id) => { setTab(id); setCurrent(null); }} />

        {!current ? (
          <Card tone="coral" soft pad={20} className="gr-in"
            style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <IconTile icon="dice-5" tone="coral" size={56} style={{ background: C.surface }} />
            <div style={{ fontSize: T.lead, fontWeight: 800, color: C.coralD, marginTop: 10, marginBottom: 6 }}>Génère ton défi</div>
            <div style={{ fontSize: T.small, color: C.coralD, marginBottom: 14, lineHeight: 1.55 }}>
              {tab === "impro" && "Tonalité, mode, tempo et contrainte tirés au sort."}
              {tab === "neck" && "Un défi de visualisation du manche."}
              {tab === "rhythm" && "Un défi de métronome à un tempo donné."}
            </div>
            <Button size="lg" full tone="coral" iconRight="dice-5"
              onClick={tab === "impro" ? generateImpro : tab === "neck" ? generateNeck : generateRhythm}>
              Générer un défi
            </Button>
          </Card>
        ) : (
          <div className="gr-in-pop" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Card tone="primary" soft pad={20}>
              <Eyebrow style={{ marginBottom: 8 }}>Défi en cours</Eyebrow>
              <div style={{ fontSize: T.h2, fontWeight: 800, color: C.primaryD, marginBottom: 8, letterSpacing: "-.3px", lineHeight: 1.2 }}>{current.title}</div>
              <div style={{ fontSize: 14, color: C.primaryD, lineHeight: 1.55 }}>{current.sub}</div>
              <div style={{ fontSize: T.micro, fontWeight: 600, color: C.primaryD, marginTop: 12, opacity: 0.8 }}>Durée : {current.time} min</div>
            </Card>
            <Button tone="green" size="lg" full icon="check" onClick={finish}>Terminé · +50 XP</Button>
            <Button variant="secondary" size="lg" full iconRight="dice-5" onClick={() => setCurrent(null)}>Autre défi</Button>
          </div>
        )}
      </div>
    </div>
  );
}

export { PracticeScreen };
