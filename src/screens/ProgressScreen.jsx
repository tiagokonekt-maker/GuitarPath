// Groply — screens/ProgressScreen.jsx (onglet Progrès)
import { useMemo } from "react";
import { MODULE, R, T } from "../design/tokens.js";
import { useC } from "../design/ThemeContext.jsx";
import { toneOf } from "../design/hooks.js";
import { Ti } from "../design/Ti.jsx";
import {
  AnimatedNumber, Button, Card, Eyebrow, IconTile, ListGroup, ListRow,
  ProgressBar, ScreenHero, SectionTitle, StatTile,
} from "../design/ui.jsx";
import { BADGES, buildBadgeTints, buildBadgeRarities, skillMastery } from "../store/badges.js";
import { levelProgress } from "../store/leveling.js";
import { masteryStats, prochainesAAncrer, MASTERY_LABELS } from "../store/mastery.js";
import { gradeForLevel } from "../store/grades.js";
import { buildUnits, debutFacultatif } from "../store/pathEngine.js";
import { GropiTip } from "../design/Gropi.jsx";
import { POSE_ROLE } from "../design/gropiPoses.js";

// Pastille translucide posée sur la photo du bandeau (statique, donc plate).
const PASTILLE_HERO = {
  display: "inline-flex", alignItems: "center", gap: 6,
  background: "rgba(255,255,255,.2)", border: "2px solid rgba(255,255,255,.35)",
  color: "#fff",
};

function ProgressScreen({ state, content, onOpenSettings }) {
  const C = useC();
  const BADGE_TINTS = buildBadgeTints(C);
  const BADGE_RARITIES = buildBadgeRarities(C);
  const { xpToNext, pct: lvlPct, totalForNext } = levelProgress(state.xp);
  const grade = gradeForLevel(state.level);

  // Recalculés seulement quand la progression bouge : masteryStats parcourt
  // les 108 leçons et toutes leurs questions.
  const maitrise = useMemo(
    () => masteryStats(content, state),
    [content, state]
  );
  const aAncrer = useMemo(
    () => prochainesAAncrer(content, state, 3),
    [content, state]
  );

  const skills = useMemo(() => [
    { label:"Premiers pas", id:"debut" },
    { label:"Manche",   id:"neck" },
    { label:"Gammes",   id:"scales" },
    { label:"Harmonie", id:"harmony" },
    { label:"Rythme",   id:"rhythm" },
    { label:"Impro",    id:"impro" },
  ].map(s => ({ ...s, pct: skillMastery(state, content, s.id) }))
    // « Premiers pas » : affiché au débutant (module obligatoire) ou dès qu'il
    // y a progressé ; un joueur confirmé n'y voit pas un 0 % qui ne le
    // concerne pas.
    .filter(s => s.id !== "debut" || s.pct > 0 || !debutFacultatif(state, buildUnits(content.courses, state))),
  [state, content]);

  const badgesByCategory = useMemo(() => {
    const map = {};
    BADGES.forEach(b => {
      if (!map[b.cat]) map[b.cat] = [];
      map[b.cat].push(b);
    });
    return map;
  }, []);

  return (
    <div>
      <ScreenHero
        image="/sunrise.jpg" color="#b7a0c8" overlay="rgba(120,50,10,.48)" position="center 40%"
        title="Progression"
        right={<Button size="sm" variant="secondary" icon="settings" onClick={onOpenSettings}>Réglages</Button>}
      >
        {/* Grade */}
        <div style={{ display:"flex", alignItems:"center", gap:7, marginTop:14, color:"#fff" }}>
          <Ti name={grade.icon} size={19} color="currentColor" />
          <span style={{ fontSize:T.lead, fontWeight:800, letterSpacing:"-.2px" }}>{grade.label}</span>
        </div>

        {/* Niveau + série */}
        <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:10, flexWrap:"wrap" }}>
          <div style={{ ...PASTILLE_HERO, gap:8, borderRadius:R.md, padding:"6px 14px" }}>
            <span style={{ fontSize:T.h2, fontWeight:800, letterSpacing:"-.5px", fontVariantNumeric:"tabular-nums" }}>
              <AnimatedNumber value={state.level} />
            </span>
            <span style={{ fontSize:T.small, fontWeight:600, color:"rgba(255,255,255,.85)" }}>Niveau</span>
          </div>
          <div style={{ ...PASTILLE_HERO, borderRadius:R.pill, padding:"7px 13px", fontSize:T.small, fontWeight:700 }}>
            <span aria-hidden="true" className="gr-flame" style={{ display:"inline-flex" }}>
              <Ti name="flame" size={16} color="currentColor" />
            </span>
            <span><AnimatedNumber value={state.streak} /> jours</span>
            {(state.streakFreezes||0) > 0 && (
              <span style={{ fontSize:T.micro, fontWeight:700, opacity:.85 }}>· {state.streakFreezes} gel{state.streakFreezes>1?"s":""}</span>
            )}
          </div>
        </div>

        {/* Barre d'XP */}
        <div style={{ marginTop:14 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", gap:8, marginBottom:6 }}>
            <span style={{ fontSize:T.small, fontWeight:700, color:"#fff", fontVariantNumeric:"tabular-nums" }}>
              <AnimatedNumber value={state.xp} /> XP total
            </span>
            <span style={{ fontSize:12, fontWeight:600, color:"rgba(255,255,255,.85)" }}>Niv. {state.level+1} → {totalForNext} XP</span>
          </div>
          <ProgressBar
            pct={lvlPct} color={C.primary} h={12} track="rgba(255,255,255,.28)"
            label={`Progression vers le niveau ${state.level + 1} : ${xpToNext} XP restants`}
          />
          <div style={{ fontSize:T.micro, color:"rgba(255,255,255,.8)", marginTop:5 }}>
            {xpToNext} XP pour le niveau {state.level + 1}
          </div>
        </div>
      </ScreenHero>

      <div className="gr-stagger" style={{ padding:"16px 16px 28px", display:"flex", flexDirection:"column", gap:16 }}>
        {/* ── STATS ────────────────────────────────────────────────────────── */}
        <div className="gr-stagger" style={{ display:"grid", gridTemplateColumns:"repeat(3, minmax(0, 1fr))", gap:8 }}>
          <StatTile icon="flame" tone="amber" value={state.streak} suffix="j" label="Série" />
          <StatTile icon="circle-check" tone="green" value={Object.keys(state.completedExercises).length} label="Exercices" />
          <StatTile icon="book-2" tone="primary" value={Object.keys(state.completedLessons).length} label="Leçons" />
        </div>

        {/* ── GROPI contextuel ─────────────────────────────────────────────── */}
        <div>
          <GropiTip
            pose={state.streak >= 3 ? POSE_ROLE.serie : state.streak === 0 ? POSE_ROLE.calme : POSE_ROLE.progression}
            tint={state.streak >= 7 ? "green" : state.streak === 0 ? "primary" : "primary"}
            eyebrow="Gropi te parle"
          >
            {state.streak >= 7
              ? `${state.streak} jours d'affilée. Tu tiens une vraie habitude, continue.`
              : state.streak >= 3
              ? `Série de ${state.streak} jours. La régularité, c'est 80 % du chemin.`
              : state.streak === 0
              ? "Ta série est retombée à zéro. Une seule session suffit pour en relancer une."
              : "Chaque session compte. Reviens demain pour continuer ta progression."}
          </GropiTip>
        </div>

        {/* ── MAÎTRISE ─────────────────────────────────────────────────────
            Ce bloc rend visible le travail de mémorisation, qui tournait
            jusqu'ici en arrière-plan sans que rien ne le montre. Une leçon
            n'est plus « faite ou pas faite » : elle est vue, comprise, puis
            ancrée — ce dernier palier ne s'obtenant qu'en revenant dessus
            plusieurs fois sur plusieurs semaines. */}
        <section style={{ display:"flex", flexDirection:"column", gap:8 }}>
          <SectionTitle>Maîtrise</SectionTitle>
          <Card style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <div>
              <div style={{ display:"flex", alignItems:"baseline", gap:8 }}>
                <span style={{ fontSize:T.h1, fontWeight:800, color:C.text, letterSpacing:"-.5px", lineHeight:1, fontVariantNumeric:"tabular-nums" }}>
                  <AnimatedNumber value={maitrise.atteints} />
                </span>
                <span style={{ fontSize:T.small, color:C.text2, fontWeight:600 }}>
                  / {maitrise.objectifs} objectifs
                </span>
              </div>
              <div style={{ fontSize:12, color:C.text2, marginTop:4, lineHeight:1.5 }}>
                Chaque leçon vaut trois paliers : la voir, la comprendre, l'ancrer.
              </div>
            </div>

            <ProgressBar
              pct={maitrise.objectifs ? Math.round(maitrise.atteints / maitrise.objectifs * 100) : 0}
              color={C.primary} label="Maîtrise globale"
            />

            <div style={{ display:"grid", gridTemplateColumns:"repeat(3, minmax(0, 1fr))", gap:8 }}>
              <StatTile tone="neutral" value={maitrise.vues} label={MASTERY_LABELS[1]} />
              <StatTile tone="blue" value={maitrise.comprises} label={MASTERY_LABELS[2]} />
              <StatTile tone="green" value={maitrise.ancrees} label={MASTERY_LABELS[3]} />
            </div>
          </Card>

          {/* Objectif concret plutôt qu'une invitation vague à « réviser ».
              « Il te manque une question sur celle-ci » se traite ; « révise »
              ne se traite pas. */}
          {aAncrer.length > 0 && (
            <>
              <Eyebrow tone="neutral" style={{ color:C.text2, margin:"6px 4px 0" }}>Bientôt ancrées</Eyebrow>
              <ListGroup>
                {aAncrer.map(({ lesson, reste }) => (
                  <ListRow key={lesson.id} title={lesson.title} style={{ minHeight:48 }}
                    right={(
                      <span style={{ fontSize:12, color:C.text2, whiteSpace:"nowrap", fontWeight:600 }}>
                        {reste} question{reste > 1 ? "s" : ""}
                      </span>
                    )} />
                ))}
              </ListGroup>
            </>
          )}
        </section>

        {/* ── COMPÉTENCES PAR MODULE ───────────────────────────────────────── */}
        <section style={{ display:"flex", flexDirection:"column", gap:8 }}>
          <SectionTitle>Compétences</SectionTitle>
          <div className="gr-stagger" style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {skills.map(sk => {
              const mod = MODULE[sk.id] || {};
              const k = toneOf(C, mod.color);
              return (
                <Card key={sk.label} pad="12px 14px">
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                    <IconTile icon={mod.icon || "music"} tone={mod.color} size={36} />
                    <span style={{ fontSize:14, fontWeight:700, color:C.text, flex:1, minWidth:0 }}>{sk.label}</span>
                    <span style={{ fontSize:T.small, fontWeight:800, color: sk.pct > 0 ? k.ink : C.text3, fontVariantNumeric:"tabular-nums" }}>
                      <AnimatedNumber value={sk.pct} />%
                    </span>
                  </div>
                  <ProgressBar pct={sk.pct} color={k.c} h={8} label={`${sk.label} : ${sk.pct} %`} />
                </Card>
              );
            })}
          </div>
        </section>

        {/* ── BADGES ───────────────────────────────────────────────────────── */}
        <section style={{ display:"flex", flexDirection:"column", gap:8 }}>
          <SectionTitle right={<><b style={{ color:C.text }}><AnimatedNumber value={state.unlockedBadges.length} /></b> / {BADGES.length}</>}>
            Badges
          </SectionTitle>

          {Object.entries(badgesByCategory).map(([cat, badges]) => (
            <div key={cat}>
              <h3 style={{ margin:"6px 4px 8px", fontSize:T.micro, fontWeight:700, textTransform:"uppercase", letterSpacing:".07em", color:C.text3 }}>
                {cat}
              </h3>
              <div className="gr-stagger" style={{ display:"grid", gridTemplateColumns:"repeat(3, minmax(0, 1fr))", gap:8 }}>
                {badges.map((b, i) => (
                  <Badge key={b.id} C={C} b={b} rang={i}
                    ok={state.unlockedBadges.includes(b.id)}
                    tint={BADGE_TINTS[b.tint]} rarity={BADGE_RARITIES[b.rarity]} />
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

/**
 * Tuile de badge. Débloqué : tuile teintée, médaillon plein qui arrive en
 * ressort. Verrouillé : à plat, en pointillés, atténué.
 */
function Badge({ C, b, ok, tint, rarity, rang }) {
  return (
    <div role="group"
      aria-label={`${b.label}, rareté ${rarity.label}, ${ok ? "débloqué" : "verrouillé"}`}
      style={{
        display:"flex", flexDirection:"column", alignItems:"center", gap:6,
        minWidth:0, padding:"12px 6px 10px", textAlign:"center", borderRadius:R.md,
        background: ok ? tint.bg : "transparent",
        border: ok ? `2px solid ${tint.border}` : `2px dashed ${C.border}`,
        opacity: ok ? 1 : 0.6,
      }}>
      <span aria-hidden="true" className={ok ? "gr-in-pop gr-delay" : undefined} style={{
        "--d": Math.min(rang, 8) + 3,
        width:42, height:42, flexShrink:0, borderRadius:R.pill,
        display:"flex", alignItems:"center", justifyContent:"center",
        background: ok ? tint.icon : C.surface2,
        color: ok ? C.onPrimaryBtn : C.text3,
      }}>
        <Ti name={b.icon} size={22} color="currentColor" />
      </span>
      <div style={{ fontSize:T.micro, fontWeight:700, lineHeight:1.25, color: ok ? tint.text : C.text2 }}>{b.label}</div>
      <span style={{
        marginTop:"auto", fontSize:T.micro, fontWeight:700, lineHeight:1.2,
        padding:"1px 6px", borderRadius:R.xs,
        letterSpacing:".04em", textTransform:"uppercase",
        background: ok ? rarity.bg : C.surface2, color: ok ? rarity.fg : C.text2,
      }}>{rarity.label}</span>
    </div>
  );
}

export { ProgressScreen };
