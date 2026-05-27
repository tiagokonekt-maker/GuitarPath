// GuitarPath — screens/HomeScreen.jsx
import { useState, useEffect, useCallback, useMemo } from "react";
import { C, FONTS, R } from "../design/tokens.js";
import { Ti } from "../design/Ti.jsx";
import { ProgressBar } from "../design/ui.jsx";
import { MODULE_THEME } from "../store/moduleTheme.js";
import { DAILY_CHALLENGES } from "../store/challenges.js";
import { getReviewStats } from "../store/reviewEngine.js";

// ── Sous-composants ──────────────────────────────────────────────────────────

function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 700, letterSpacing: ".07em",
      textTransform: "uppercase", color: C.text3,
      fontFamily: FONTS.ui, marginBottom: 10,
    }}>
      {children}
    </div>
  );
}

function QuickCard({ icon, iconBg, iconColor, label, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: C.surface, border: `1.5px solid ${C.border}`,
      borderRadius: R.lg, padding: 16, cursor: "pointer",
      textAlign: "left", fontFamily: FONTS.title,
      display: "flex", flexDirection: "column", gap: 8,
      transition: "background .12s",
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: R.md,
        background: iconBg, display: "flex",
        alignItems: "center", justifyContent: "center",
      }}>
        <Ti name={icon} size={18} color={iconColor} />
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: C.text, lineHeight: 1.3 }}>{label}</div>
    </button>
  );
}

// ── Écran principal ──────────────────────────────────────────────────────────

function HomeScreen({ state, dispatch, navigate, content }) {
  const xpInLevel = state.xp % 300;
  const lvlPct    = Math.round((xpInLevel / 300) * 100);
  const xpToNext  = 300 - xpInLevel;
  const todayChallenge = DAILY_CHALLENGES[state.dailyChallengeIdx % DAILY_CHALLENGES.length];

  const reviewStats = useMemo(() => {
    if (!content.quiz) return { toReview: 0, eligible: 0 };
    return getReviewStats(content.quiz, state.reviewHistory || {}, state.completedLessons);
  }, [content.quiz, state.reviewHistory, state.completedLessons]);

  const nextLesson = useMemo(() => {
    for (const course of content.courses) {
      for (const lesson of course.lessons) {
        if (!state.completedLessons[lesson.id]) return { course, lesson };
      }
    }
    return null;
  }, [content, state.completedLessons]);

  const dateStr = new Date().toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long",
  });

  return (
    <div>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <div style={{
        backgroundImage: "url('/sunset.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center 30%",
        padding: "28px 20px 22px", position: "relative", overflow: "hidden",
      }}>

        {/* Overlay sunset */}
        <div style={{ position:"absolute", inset:0, background:"rgba(160,55,0,.5)", pointerEvents:"none", zIndex:0 }} />
        {/* blobs décoratifs */}
        <div style={{ position:"absolute", top:-30, right:-35, width:130, height:130, background:"rgba(255,255,255,.08)", borderRadius:"50%", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:-45, left:-10, width:90, height:90, background:"rgba(255,200,120,.10)", borderRadius:"50%", pointerEvents:"none" }} />

        {/* Logo Groply — centré en haut entre texte et guitare */}
        <div style={{
          position:"absolute", top:28, left:"58%", transform:"translateX(-50%)",
          zIndex:4, display:"flex", alignItems:"center", gap:6,
        }}>
          <img src="/logo.svg" alt="Groply" style={{ height:46, width:"auto", filter:"brightness(0) invert(1)", opacity:.92 }} />
          <span style={{ fontSize:24, fontWeight:800, color:"#fff", letterSpacing:".5px", opacity:.92, fontFamily:"'Nunito', sans-serif" }}>Groply</span>
        </div>

        {/* Guitare — multiply sur sunset */}
        <img
          src="/guitar.webp"
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            right: 10,
            top: "50%",
            transform: "translateY(-50%) rotate(6deg)",
            height: 290,
            width: "auto",
            zIndex: 1,
            mixBlendMode: "multiply",
            filter: "brightness(1) saturate(1.1) contrast(1.1)",
            WebkitMaskImage: "radial-gradient(ellipse 90% 95% at 50% 55%, black 55%, transparent 100%)",
            maskImage: "radial-gradient(ellipse 90% 95% at 50% 55%, black 55%, transparent 100%)",
            pointerEvents: "none",
          }}
        />

        {/* Layout hero : texte gauche + guitare droite */}
        <div style={{ display:"flex", alignItems:"flex-end", gap:0, position:"relative", zIndex:2 }}>

          {/* Colonne texte — max 58% */}
          <div style={{ flex:"0 0 58%", maxWidth:"58%" }}>

            <div style={{ fontSize:13, fontWeight:500, color:"rgba(255,255,255,.75)", marginBottom:2 }}>
              {dateStr}
            </div>
            <div style={{ fontSize:22, fontWeight:800, color:"#fff", marginBottom:18, letterSpacing:"-.3px" }}>
              Bonjour 👋
            </div>

        {/* Session card glass */}
        {nextLesson ? (
          <button onClick={() => navigate("courses")} style={{
            width:"100%", background:"rgba(255,255,255,.18)",
            border:"1.5px solid rgba(255,255,255,.28)",
            borderRadius:R.lg, padding:"14px 16px",
            backdropFilter:"blur(6px)", cursor:"pointer",
            textAlign:"left", fontFamily:FONTS.title,
          }}>
            <div style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,.7)", letterSpacing:".08em", textTransform:"uppercase", marginBottom:3 }}>
              Prochain objectif
            </div>
            <div style={{ fontSize:15, fontWeight:800, color:"#fff", letterSpacing:"-.2px", marginBottom:4 }}>
              {nextLesson.lesson.title}
            </div>
            <div style={{ fontSize:11, fontWeight:500, color:"rgba(255,255,255,.7)", marginBottom:12 }}>
              {nextLesson.course.title} · {nextLesson.lesson.duration} min
            </div>
            <span style={{
              display:"inline-flex", alignItems:"center", gap:7,
              background:"#fff", color:C.primary,
              borderRadius:99, padding:"8px 16px",
              fontSize:13, fontWeight:700,
            }}>
              <Ti name="player-play" size={13} color={C.primary} />
              Continuer
            </span>
          </button>
        ) : (
          <div style={{
            background:"rgba(255,255,255,.18)", border:"1.5px solid rgba(255,255,255,.28)",
            borderRadius:R.lg, padding:"16px 18px", backdropFilter:"blur(6px)",
          }}>
            <div style={{ fontSize:16, fontWeight:800, color:"#fff" }}>Tout est complété !</div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,.7)", marginTop:3 }}>Reviens demain pour de nouveaux défis.</div>
          </div>
        )}
          </div>{/* fin colonne texte */}

        </div>{/* fin flex hero */}


      </div>

      <div style={{ padding:"16px 20px 0" }}>

        {/* ── STATS CHIPS ─────────────────────────────────────────────────── */}
        <div style={{ display:"flex", gap:8, marginBottom:18, overflowX:"auto" }}>
          {[
            { v: `Niv. ${state.level}`, l:"Niveau", color: C.primary },
            { v: Object.keys(state.completedLessons).length, l:"Leçons" },
            { v: Object.keys(state.quizResults || {}).length, l:"Quiz" },
            { v: Object.keys(state.completedExercises).length, l:"Exercices" },
            { v: `${state.streak}🔥`, l:"Série", color: C.primaryD },
          ].map((s,i) => (
            <div key={i} style={{
              flexShrink:0, background:C.surface, border:`1.5px solid ${C.border}`,
              borderRadius:R.md, padding:"10px 14px", minWidth:68, textAlign:"center",
            }}>
              <div style={{ fontSize:17, fontWeight:800, color: s.color || C.text, letterSpacing:"-.3px" }}>{s.v}</div>
              <div style={{ fontSize:9.5, fontWeight:600, color:C.text3, textTransform:"uppercase", letterSpacing:".05em", marginTop:1 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* ── XP BAR ──────────────────────────────────────────────────────── */}
        <div style={{ marginBottom:20 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
            <span style={{ fontSize:13, fontWeight:700, color:C.text }}>Niveau {state.level}</span>
            <span style={{ fontSize:12, fontWeight:600, color:C.primary }}>{xpInLevel} / 300 XP</span>
          </div>
          <div style={{ height:8, background:C.border, borderRadius:99, overflow:"hidden" }}>
            <div style={{ width:`${lvlPct}%`, height:"100%", background:`linear-gradient(90deg, #FF9155, ${C.primary})`, borderRadius:99, transition:"width .4s ease" }} />
          </div>
          <div style={{ fontSize:11, color:C.text3, marginTop:4 }}>
            {xpToNext} XP pour le niveau {state.level + 1}
          </div>
        </div>

        {/* ── ACCÈS RAPIDE ────────────────────────────────────────────────── */}
        <SectionLabel>Accès rapide</SectionLabel>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
          <QuickCard icon="guitar-pick" iconBg={C.amberL} iconColor={C.amber} label="Explorateur du manche" onClick={() => navigate("explorer")} />
          <QuickCard icon="music" iconBg={C.pinkL} iconColor={C.pink} label="Jam Session" onClick={() => navigate("jam")} />
          <QuickCard icon="ear" iconBg={C.greenL} iconColor={C.green} label="Ear Training" onClick={() => navigate("ear")} />
          <QuickCard
            icon={state.dailyChallengeDone ? "trophy" : "bolt"}
            iconBg={state.dailyChallengeDone ? C.greenL : C.amberL}
            iconColor={state.dailyChallengeDone ? C.green : C.amber}
            label={state.dailyChallengeDone ? "Défi terminé ✓" : "Défi du jour"}
            onClick={() => navigate("challenge")}
          />
        </div>

        {/* ── DÉFI DU JOUR (détail) ────────────────────────────────────────── */}
        <SectionLabel>Défi du jour</SectionLabel>
        <button onClick={() => navigate("challenge")} style={{
          width:"100%",
          background: state.dailyChallengeDone ? C.greenL : C.amberL,
          border: `1.5px solid ${state.dailyChallengeDone ? C.greenBorder : C.amberBorder}`,
          borderRadius:R.lg, padding:"14px 16px", marginBottom:20,
          cursor:"pointer", textAlign:"left", fontFamily:FONTS.title,
          display:"flex", alignItems:"flex-start", gap:12,
        }}>
          <div style={{
            width:40, height:40, borderRadius:R.md,
            background: C.surface,
            display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
          }}>
            <Ti name={state.dailyChallengeDone ? "trophy" : "bolt"} size={18}
              color={state.dailyChallengeDone ? C.green : C.amber} />
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:".08em", textTransform:"uppercase",
              color: state.dailyChallengeDone ? C.greenD : C.amberD, marginBottom:4 }}>
              {state.dailyChallengeDone ? "Défi terminé · +80 XP" : "Défi du jour · +80 XP"}
            </div>
            <div style={{ fontSize:13, fontWeight:600, lineHeight:1.5,
              color: state.dailyChallengeDone ? C.greenD : C.amberD }}>
              {todayChallenge}
            </div>
          </div>
          <Ti name="chevron-right" size={16} color={state.dailyChallengeDone ? C.green : C.amber} />
        </button>

        {/* ── RÉVISION INTELLIGENTE ────────────────────────────────────────── */}
        <SectionLabel>Révision du jour</SectionLabel>
        {reviewStats.eligible === 0 ? (
          <div style={{
            background:C.surface, border:`1.5px solid ${C.border}`,
            borderRadius:R.lg, padding:"14px 16px", marginBottom:20,
            display:"flex", alignItems:"center", gap:12,
          }}>
            <div style={{ width:40, height:40, borderRadius:R.md, background:C.primaryL, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <Ti name="lock" size={18} color={C.primary} />
            </div>
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:C.text }}>Révision intelligente</div>
              <div style={{ fontSize:11, color:C.text3, marginTop:1 }}>Complète des leçons pour débloquer</div>
            </div>
          </div>
        ) : reviewStats.toReview === 0 ? (
          <div style={{
            background:C.greenL, border:`1.5px solid ${C.greenBorder}`,
            borderRadius:R.lg, padding:"14px 16px", marginBottom:20,
            display:"flex", alignItems:"center", gap:12,
          }}>
            <div style={{ width:40, height:40, borderRadius:R.md, background:C.surface, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <Ti name="check" size={18} color={C.green} />
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:700, color:C.greenD }}>Tout est à jour !</div>
              <div style={{ fontSize:11, color:C.green, marginTop:1 }}>
                {reviewStats.mastered} questions maîtrisées · Reviens demain
              </div>
            </div>
          </div>
        ) : (
          <button onClick={() => navigate("review")} style={{
            width:"100%", background:C.surface,
            border:`1.5px solid ${C.primary}`,
            borderRadius:R.lg, padding:"14px 16px", marginBottom:20,
            cursor:"pointer", textAlign:"left", display:"flex", alignItems:"center", gap:12,
            fontFamily:FONTS.title,
          }}>
            <div style={{ width:40, height:40, borderRadius:R.md, background:C.primaryL, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <Ti name="refresh" size={18} color={C.primary} />
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:".08em", textTransform:"uppercase", color:C.primary, marginBottom:2 }}>
                Révision intelligente
              </div>
              <div style={{ fontSize:13, fontWeight:700, color:C.text }}>
                {reviewStats.toReview} question{reviewStats.toReview > 1 ? "s" : ""} à revoir
              </div>
              <div style={{ fontSize:11, color:C.text3, marginTop:1 }}>
                {reviewStats.pctMastered}% maîtrisé · ~{Math.min(reviewStats.toReview, 12)} questions · 5 min
              </div>
            </div>
            <Ti name="arrow-right" size={16} color={C.primary} />
          </button>
        )}

        {/* ── DERNIÈRES SESSIONS ───────────────────────────────────────────── */}
        {state.sessionHistory?.length > 0 && (
          <>
            <SectionLabel>Dernières sessions</SectionLabel>
            {state.sessionHistory.slice(0, 3).map((sess, i) => (
              <div key={i} style={{
                background:C.surface, border:`1.5px solid ${C.border}`,
                borderRadius:R.lg, padding:"12px 16px",
                display:"flex", alignItems:"center", gap:12, marginBottom:8,
              }}>
                <div style={{ width:38, height:38, borderRadius:R.md, background:C.greenL, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <Ti name="check" size={16} color={C.green} />
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:C.text }}>{sess.title}</div>
                  <div style={{ fontSize:11, color:C.text3, marginTop:1 }}>
                    {sess.score ? `${sess.score} · ` : ""}+{sess.xp} XP
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        <div style={{ height:24 }} />
      </div>
    </div>
  );
}

export { HomeScreen };
