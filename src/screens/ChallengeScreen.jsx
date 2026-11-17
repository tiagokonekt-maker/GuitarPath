// Groply — screens/ChallengeScreen.jsx
import { useState, useEffect, useRef } from "react";
import { T } from "../design/tokens.js";
import { useC } from "../design/ThemeContext.jsx";
import { Ti } from "../design/Ti.jsx";
import { Gropi } from "../design/Gropi.jsx";
import { POSE_ROLE } from "../design/gropiPoses.js";
import { Button, Card, Confetti, Eyebrow, SubHeader, XPPop } from "../design/ui.jsx";
import { vibrer } from "../design/hooks.js";
import { DAILY_CHALLENGES } from "../store/challenges.js";

function ChallengeScreen({ state, dispatch, navigate }) {
  const C = useC();
  const ch = DAILY_CHALLENGES[state.dailyChallengeIdx % DAILY_CHALLENGES.length];
  const done = state.dailyChallengeDone;
  const [pop, setPop] = useState(false);
  // Vrai seulement si le défi vient d'être relevé ici : la fête ne rejoue pas
  // quand on revient sur un défi déjà fait.
  const [fete, setFete] = useState(false);
  const timerRef = useRef(null);

  // Si on quitte l'écran avant la fin de l'animation, on annule le dispatch
  // en attente plutôt que de le laisser se déclencher hors écran.
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const finish = () => {
    setPop(true);
    setFete(true);
    vibrer([12, 40, 18]);
    dispatch({ type: "DAILY_CHALLENGE_DONE" });
    dispatch({ type: "MARK_STREAK" });
    timerRef.current = setTimeout(() => setPop(false), 1000);
  };

  const ton = done ? "green" : "amber";
  const encre = done ? C.greenD : C.amberD;

  return (
    <div>
      {pop && <XPPop amount={80} onDone={() => {}} />}
      {fete && <Confetti />}
      <SubHeader tone={ton} onBack={() => navigate("home")} title="Défi du jour" />

      <div className="gr-stagger" style={{ padding: "16px 16px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
        <Card tone={ton} soft pad={20}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
            <Ti name={done ? "trophy" : "bolt"} size={16} color={done ? C.green : C.amber} />
            <Eyebrow tone={ton}>{done ? "Défi complété" : "Aujourd'hui"}</Eyebrow>
          </div>
          <p style={{ margin: "0 0 12px", fontSize: T.lead, fontWeight: 600, color: encre, lineHeight: 1.55 }}>{ch}</p>
          <div style={{ fontSize: 12, fontWeight: 600, color: encre, opacity: 0.8 }}>Récompense : +80 XP</div>
        </Card>

        {!done ? (
          <Button size="lg" full tone="amber" iconRight="check" onClick={finish}>Défi relevé</Button>
        ) : (
          <Card tone="green" soft pad={18} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <Gropi pose={POSE_ROLE.reussite} size={96} anim={fete ? "cheer" : "bob"} />
            <div style={{ fontWeight: 800, color: C.greenD, fontSize: T.lead, marginTop: 8 }}>Défi complété !</div>
            <div style={{ fontSize: 12, color: C.greenD, marginTop: 4 }}>Reviens demain.</div>
          </Card>
        )}
      </div>
    </div>
  );
}

export { ChallengeScreen };
