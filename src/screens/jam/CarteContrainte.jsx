// GuitarPath -- screens/jam/CarteContrainte.jsx
// Contrainte du moment : adaptée au style et au niveau, tenue 2 minutes de
// jeu réel. Le compte à rebours vit ici (abonné au chrono) : avant, il
// était dans JamSession et re-rendait tout l'écran chaque seconde.
import { useState, useEffect, useEffectEvent, useRef } from "react";
import { R, T } from "../../design/tokens.js";
import { useC } from "../../design/ThemeContext.jsx";
import { Button, Card, Eyebrow, IconTile, ProgressBar, Segmented, Tag } from "../../design/ui.jsx";
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
const TON_NIVEAU = { "Facile": "green", "Moyen": "amber", "Difficile": "coral" };

export function CarteContrainte({ chrono, enLecture, contextId, niveauApp, dispatch }) {
  const C = useC();
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
    <Card tone={constraint ? "amber" : undefined} soft={!!constraint} pad="12px 14px" className="gr-in-pop"
      style={{ display: "flex", flexDirection: "column", gap: 10, transition: "background-color var(--gr-dur-fast) ease, border-color var(--gr-dur-fast) ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, minHeight: 24 }}>
        <Eyebrow tone={constraint ? "amber" : "neutral"} style={{ flex: 1 }}>Contrainte du moment</Eyebrow>
        {contraintesTenues > 0 && (
          <span key={contraintesTenues} className="gr-tada" style={{ display: "inline-flex" }}>
            <Tag tone="green" icon="check">{contraintesTenues} tenue{contraintesTenues > 1 ? "s" : ""}</Tag>
          </span>
        )}
      </div>
      <Segmented label="Difficulté des contraintes" size="sm" value={niveauContrainte}
        onChange={(n) => { setNiveauContrainte(n); if (constraint) randomConstraint(n); }}
        options={NIVEAUX_CONTRAINTE.map(n => ({ value: n, label: n }))} />
      {constraint ? (
        <>
          <div id="contrainte-texte" aria-live="polite" style={{ fontSize: T.body, color: C.amberD, lineHeight: 1.5, fontWeight: 700 }}>
            {/* La clé rejoue l'entrée à chaque nouvelle contrainte, sans remonter la zone annoncée. */}
            <span key={constraint.text} className="gr-in-pop" style={{ display: "block" }}>{constraint.text}</span>
          </div>
          <div style={{ display: "flex" }}>
            <Tag tone={TON_NIVEAU[constraint.level]}>{constraint.level}</Tag>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {tenue ? (
              <div className="gr-in-pop" style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 8, fontSize: T.small, fontWeight: 700, color: C.greenD }}>
                <IconTile icon="check" tone="green" solid size={30} style={{ borderRadius: R.pill }} />
                Tenue 2 minutes, bravo.
              </div>
            ) : (
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, color: C.amberD, lineHeight: 1.45 }}>
                  {!enLecture ? "Lance le backing : le chrono tourne pendant que tu joues." : <>Tiens-la encore <b style={{ fontVariantNumeric: "tabular-nums" }}>{fmtDuree(resteContrainte)}</b></>}
                </div>
                <div aria-hidden="true" style={{ marginTop: 6 }}>
                  <ProgressBar pct={((DUREE_CONTRAINTE - resteContrainte) / DUREE_CONTRAINTE) * 100} color={C.amber} track={C.amberBorder} h={8} />
                </div>
              </div>
            )}
            {tenue
              ? <Button tone="amber" iconRight="arrow-right" onClick={() => randomConstraint()}>Suivante</Button>
              : <Button variant="secondary" tone="amber" onClick={() => randomConstraint()}>Changer</Button>}
          </div>
        </>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ flex: 1, minWidth: 0, fontSize: T.small, color: C.text2, lineHeight: 1.45 }}>
            Une limite claire, tenue 2 minutes : c'est ce qui fait progresser en impro.
          </div>
          <Button tone="amber" onClick={() => randomConstraint()}>Tirer</Button>
        </div>
      )}
    </Card>
  );
}
