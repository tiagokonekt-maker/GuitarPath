// GuitarPath -- screens/jam/CarteContrainte.jsx
// Contrainte du moment : adaptée au style et au niveau, tenue 2 minutes de
// jeu réel. Le compte à rebours vit ici (abonné au chrono) : avant, il
// était dans JamSession et re-rendait tout l'écran chaque seconde.
import { useState, useEffect, useEffectEvent, useRef } from "react";
import { FONTS, R } from "../../design/tokens.js";
import { useC } from "../../design/ThemeContext.jsx";
import { Ti } from "../../design/Ti.jsx";
import { fmtDuree } from "./reglages.js";

// Contraintes : une limite claire, tenue 2 minutes. `contextes` restreint
// une contrainte aux styles où elle a un sens musical (absent = tous).
const CONSTRAINTS = [
  { text: "Joue UNIQUEMENT des notes longues. Zéro double-croche.", level: "Facile" },
  { text: "Chaque phrase doit finir sur une note de l'accord.", level: "Facile" },
  { text: "4 notes maximum par phrase, et un silence entre chaque phrase.", level: "Facile" },
  { text: "Joue une phrase de 2 mesures, puis 2 mesures de silence : question-réponse.", level: "Facile" },
  { text: "Fais entendre la sixte majeure au moins une fois par phrase : c'est elle qui signe le dorien.", level: "Facile", contextes: ["modal_dorian"] },
  { text: "Joue des riffs de 2 notes maximum, calés sur la caisse claire (2 et 4).", level: "Facile", contextes: ["rock"] },
  { text: "Une seule note par accord, tenue toute la mesure : fais-la chanter.", level: "Facile", contextes: ["ballade"] },
  { text: "Reste uniquement sur les 3 cordes aiguës.", level: "Moyen" },
  { text: "Joue en croches ternaires : « dou-ba dou-ba », accent sur la croche faible.", level: "Moyen", contextes: ["jazz_swing"] },
  { text: "Démarre tes phrases sur le « et » d'un temps, jamais sur le 1 : laisse la syncope parler.", level: "Moyen", contextes: ["bossa"] },
  { text: "Arpège chaque accord (1-3-5-7) au moment où il arrive.", level: "Difficile", contextes: ["jazz_swing", "bossa"] },
  { text: "Commence chaque phrase sur un temps fort (1 ou 3).", level: "Moyen" },
  { text: "Utilise le silence pendant au moins 50 % du temps.", level: "Moyen" },
  { text: "Monte progressivement en intensité pendant 2 minutes, puis redescends.", level: "Moyen" },
  { text: "Glisse la note bleue (quinte diminuée) dans chaque phrase, en note de passage.", level: "Moyen", contextes: ["blues_12"] },
  { text: "Termine tes phrases sur la septième mineure plutôt que sur la fondamentale.", level: "Moyen", contextes: ["modal_mixo"] },
  { text: "Sur l'accord IVm7, vise sa tierce mineure : elle sort de ta penta et fait entendre le changement.", level: "Difficile", contextes: ["blues_minor"] },
  { text: "Chaque phrase contient exactement une note chromatique (hors gamme).", level: "Difficile" },
  { text: "Cible uniquement les guide tones (3e et 7e) sur les temps 1 et 3.", level: "Difficile" },
  { text: "Relie les accords : la 7e de chaque accord descend d'un demi-ton vers la 3e du suivant.", level: "Difficile", contextes: ["jazz_251"] },
  { text: "Construis un solo en 3 actes : calme (1 min), montée (2 min), sommet (30 s).", level: "Difficile" },
  { text: "Joue les yeux fermés. Sens le manche, ne le regarde pas.", level: "Difficile" },
];
const NIVEAUX_CONTRAINTE = ["Facile", "Moyen", "Difficile"];
const DUREE_CONTRAINTE = 120;          // secondes de jeu réel

/** Niveau de départ des contraintes, d'après le niveau de l'app — modifiable ensuite. */
const niveauParDefaut = (niveauApp) => (niveauApp >= 16 ? "Difficile" : niveauApp >= 6 ? "Moyen" : "Facile");
const makeLevelColor = (C) => ({ "Facile": C.green, "Moyen": C.amber, "Difficile": C.coral });

export function CarteContrainte({ chrono, enLecture, contextId, niveauApp, dispatch }) {
  const C = useC();
  const LEVEL_COLOR = makeLevelColor(C);
  const [niveauContrainte, setNiveauContrainte] = useState(() => niveauParDefaut(niveauApp || 1));
  const [constraint, setConstraint] = useState(null);
  const [resteContrainte, setResteContrainte] = useState(DUREE_CONTRAINTE);
  const [contraintesTenues, setContraintesTenues] = useState(0);
  const tenue = constraint && resteContrainte === 0;

  // Chaque seconde jouée fait avancer le chrono de la contrainte. Arrivée à
  // zéro : comptée une fois (pas deux fois la même si elle est retirée).
  const contrainteTenueRef = useRef(null);
  const surSeconde = useEffectEvent(() => {
    if (!constraint || resteContrainte === 0) return;
    const reste = resteContrainte - 1;
    setResteContrainte(reste);
    if (reste === 0 && contrainteTenueRef.current !== constraint) {
      contrainteTenueRef.current = constraint;
      setContraintesTenues(n => n + 1);
      dispatch?.({ type: "JAM_PROGRES", contrainte: true });
    }
  });
  useEffect(() => chrono.abonner(() => surSeconde()), [chrono]);

  const randomConstraint = (niveau = niveauContrainte) => {
    const candidates = CONSTRAINTS.filter(c =>
      c.level === niveau && (!c.contextes || c.contextes.includes(contextId)) && c !== constraint);
    const pool = candidates.length ? candidates : CONSTRAINTS.filter(c => c.level === niveau);
    setConstraint(pool[Math.floor(Math.random() * pool.length)]);
    setResteContrainte(DUREE_CONTRAINTE);
  };

  return (
    <div style={{ background: constraint ? C.amberL : C.surface, border: `1px solid ${constraint ? C.amberBorder : C.border}`, borderRadius: R.lg, padding: "12px 14px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <div style={{ flex: 1, fontSize: 11, fontWeight: 700, color: constraint ? C.amberD : C.text3, fontFamily: FONTS.ui, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Contrainte du moment
        </div>
        {contraintesTenues > 0 && (
          <span style={{ fontSize: 11, fontWeight: 700, color: C.amberD, fontFamily: FONTS.ui }}>{contraintesTenues} tenue{contraintesTenues > 1 ? "s" : ""}</span>
        )}
      </div>
      <div role="group" aria-label="Difficulté des contraintes" style={{ display: "flex", gap: 4, marginBottom: 10, background: C.surface2, borderRadius: R.sm, padding: 3 }}>
        {NIVEAUX_CONTRAINTE.map(n => (
          <button key={n} onClick={() => { setNiveauContrainte(n); if (constraint) randomConstraint(n); }} aria-pressed={niveauContrainte === n} className="gr-focus" style={{
            flex: 1, minHeight: 34, borderRadius: R.sm - 2, border: "none", cursor: "pointer", fontFamily: FONTS.ui, fontSize: 12, fontWeight: 700,
            background: niveauContrainte === n ? C.surface : "transparent", color: niveauContrainte === n ? LEVEL_COLOR[n] : C.text3,
            boxShadow: niveauContrainte === n ? `0 0 0 1.5px ${C.border}` : "none",
          }}>{n}</button>
        ))}
      </div>
      {constraint ? (
        <>
          <div id="contrainte-texte" aria-live="polite" style={{ fontSize: 14, color: C.amberD, fontFamily: FONTS.title, lineHeight: 1.5, fontWeight: 600 }}>{constraint.text}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
            {tenue ? (
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700, color: C.greenD, fontFamily: FONTS.ui }}>
                <Ti name="check" size={15} color={C.greenD} /> Tenue 2 minutes, bravo.
              </div>
            ) : (
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: C.amberD, fontFamily: FONTS.ui }}>
                  {!enLecture ? "Lance le backing : le chrono tourne pendant que tu joues." : <>Tiens-la encore <b>{fmtDuree(resteContrainte)}</b></>}
                </div>
                <div aria-hidden="true" style={{ height: 4, borderRadius: 2, background: C.amberBorder, marginTop: 6, overflow: "hidden" }}>
                  <div style={{ width: `${((DUREE_CONTRAINTE - resteContrainte) / DUREE_CONTRAINTE) * 100}%`, height: "100%", background: C.amber, transition: "width 1s linear" }} />
                </div>
              </div>
            )}
            <button onClick={() => randomConstraint()} className="gr-focus" style={{ minHeight: 36, padding: "0 14px", borderRadius: R.pill, border: `1px solid ${C.amber}`, background: tenue ? C.amber : C.surface, color: tenue ? C.onPrimaryBtn : C.amberD, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: FONTS.ui }}>
              {tenue ? "Suivante" : "Changer"}
            </button>
          </div>
        </>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ flex: 1, fontSize: 12.5, color: C.text2, fontFamily: FONTS.ui, lineHeight: 1.45 }}>
            Une limite claire, tenue 2 minutes : c'est ce qui fait progresser en impro.
          </div>
          <button onClick={() => randomConstraint()} className="gr-focus" style={{ minHeight: 36, padding: "0 14px", borderRadius: R.pill, border: "none", background: C.amber, color: C.onPrimaryBtn, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: FONTS.ui }}>
            Tirer
          </button>
        </div>
      )}
    </div>
  );
}
