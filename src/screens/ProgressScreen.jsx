// GuitarPath — screens/ProgressScreen.jsx
import { useState, useMemo } from "react";
import { C, FONTS, R } from "../design/tokens.js";
import { Ti } from "../design/Ti.jsx";
import { ProgressBar } from "../design/ui.jsx";
import { MODULE_THEME } from "../store/moduleTheme.js";
import { BADGES, BADGE_RARITIES, skillMastery, BADGE_TINTS } from "../store/badges.js";
import { Gropi, GropiTip } from "../design/Gropi.jsx";

function ProgressScreen({ state, content, onOpenSettings }) {
  const xpInLevel = state.xp % 300;
  const xpToNext  = 300 - xpInLevel;
  const lvlPct    = Math.round((xpInLevel / 300) * 100);

  const skills = useMemo(() => [
    { label:"Manche",   id:"neck",    color:C.amber,   colorD:C.amberD },
    { label:"Gammes",   id:"scales",  color:C.green,   colorD:C.greenD },
    { label:"Harmonie", id:"harmony", color:C.purple,  colorD:C.purpleD },
    { label:"Rythme",   id:"rhythm",  color:C.blue,    colorD:C.blueD },
    { label:"Impro",    id:"impro",   color:C.pink,    colorD:C.pinkD },
  ].map(s => ({ ...s, pct: skillMastery(state, content, s.id) })), [state, content]);

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
      {/* ── EN-TÊTE HERO ─────────────────────────────────────────────────── */}
      <div style={{
      backgroundImage:"url('/sunrise.jpg')",
      backgroundSize:"cover", backgroundPosition:"center 40%",
      padding:"24px 20px 20px", position:"relative", overflow:"hidden",
    }}>
      <div style={{ position:"absolute", inset:0, background:"rgba(120,50,10,.48)", pointerEvents:"none" }} />
      <div style={{ position:"relative", zIndex:1 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <div style={{ fontSize:26, fontWeight:800, color:"#fff", letterSpacing:"-.4px" }}>Progression</div>
          <button onClick={onOpenSettings} style={{
            background:"rgba(255,255,255,.18)", border:"1.5px solid rgba(255,255,255,.3)",
            borderRadius:R.sm, padding:"7px 12px",
            fontSize:12, fontWeight:600, color:"#fff",
            cursor:"pointer", fontFamily:FONTS.ui,
            display:"flex", alignItems:"center", gap:5,
            backdropFilter:"blur(4px)",
          }}>
            <Ti name="settings" size={13} color="#fff" /> Réglages
          </button>
        </div>

        {/* Niveau + streak */}
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14, flexWrap:"wrap" }}>
          <div style={{
            display:"inline-flex", alignItems:"center", gap:8,
            background:"rgba(255,255,255,.2)", border:"1.5px solid rgba(255,255,255,.35)",
            borderRadius:R.md, padding:"8px 16px", backdropFilter:"blur(4px)",
          }}>
            <span style={{ fontSize:22, fontWeight:800, color:"#fff", letterSpacing:"-.5px" }}>{state.level}</span>
            <span style={{ fontSize:13, fontWeight:600, color:"rgba(255,255,255,.8)" }}>Niveau</span>
          </div>
          <div style={{
            display:"inline-flex", alignItems:"center", gap:5,
            background:"rgba(255,255,255,.18)", border:"1.5px solid rgba(255,255,255,.3)",
            borderRadius:99, padding:"7px 13px",
            fontSize:13, fontWeight:700, color:"#fff",
            backdropFilter:"blur(4px)",
          }}>
            <Ti name="flame" size={14} color="#fff" />
            {state.streak} jours
          </div>
        </div>

        {/* XP bar */}
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
          <span style={{ fontSize:13, fontWeight:700, color:"#fff" }}>{state.xp} XP total</span>
          <span style={{ fontSize:12, fontWeight:600, color:"rgba(255,255,255,.8)" }}>Niv. {state.level+1} → {state.xp + xpToNext} XP</span>
        </div>
        <div style={{ height:8, background:"rgba(255,255,255,.25)", borderRadius:99, overflow:"hidden" }}>
          <div style={{ width:`${lvlPct}%`, height:"100%", background:`linear-gradient(90deg,#FF9155,${C.primary})`, borderRadius:99, transition:"width .4s ease" }} />
        </div>
        <div style={{ fontSize:11, color:"rgba(255,255,255,.65)", marginTop:4 }}>
          {xpToNext} XP pour le niveau {state.level + 1}
        </div>
      </div>
    </div>

    <div style={{ padding:"16px 20px 0" }}>
        {/* ── STATS 3 ──────────────────────────────────────────────────────── */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:16 }}>
          {[
            { ic:"flame",        v:`${state.streak}j`, l:"Série",     bg:C.amberL,   ic_c:C.amber,   v_c:C.amberD },
            { ic:"circle-check", v:Object.keys(state.completedExercises).length, l:"Exercices", bg:C.greenL, ic_c:C.green, v_c:C.greenD },
            { ic:"book-2",       v:Object.keys(state.completedLessons).length,   l:"Leçons",    bg:C.primaryL, ic_c:C.primary, v_c:C.primaryD },
          ].map(s => (
            <div key={s.l} style={{
              background:s.bg, borderRadius:R.lg, padding:"12px 8px", textAlign:"center",
              border:`1.5px solid ${s.bg === C.amberL ? C.amberBorder : s.bg === C.greenL ? C.greenBorder : C.primaryBorder}`,
            }}>
              <Ti name={s.ic} size={18} color={s.ic_c} />
              <div style={{ fontSize:20, fontWeight:800, color:s.v_c, letterSpacing:"-.5px", marginTop:4, lineHeight:1 }}>{s.v}</div>
              <div style={{ fontSize:10, color:s.v_c, fontWeight:600, textTransform:"uppercase", letterSpacing:".05em", marginTop:3, opacity:.7 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* ── GROPI contextuel ─────────────────────────────────────────────── */}
        <div style={{ marginBottom:20 }}>
          <GropiTip
            pose={state.streak >= 7 ? "rocker" : state.streak >= 3 ? "happy" : state.streak === 0 ? "pride" : "wave"}
            tint={state.streak >= 7 ? "green" : state.streak === 0 ? "primary" : "primary"}
            eyebrow="Gropi te parle"
          >
            {state.streak >= 7
              ? `${state.streak} jours d'affilée — tu construis une vraie habitude. Continue ! 🔥`
              : state.streak >= 3
              ? `Série de ${state.streak} jours. La régularité, c'est 80 % du chemin.`
              : state.streak === 0
              ? "Ta flamme s'est éteinte — mais une seule session suffit pour la rallumer. 🎸"
              : "Chaque session compte. Reviens demain pour continuer ta progression."}
          </GropiTip>
        </div>

        {/* ── COMPÉTENCES PAR MODULE ───────────────────────────────────────── */}
        <div style={{ fontSize:16, fontWeight:800, color:C.text, marginBottom:12, letterSpacing:"-.2px" }}>Compétences</div>
        {skills.map(sk => {
          const th = MODULE_THEME[sk.id] || {};
          return (
            <div key={sk.label} style={{
              background:C.surface, border:`1.5px solid ${C.border}`,
              borderRadius:R.lg, padding:"13px 16px", marginBottom:8,
            }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:9 }}>
                <div style={{
                  width:34, height:34, borderRadius:R.sm,
                  background: th.colorL || C.primaryL,
                  display:"flex", alignItems:"center", justifyContent:"center",
                }}>
                  <Ti name={(th.icon||"music").replace("ti-","")} size={15} color={sk.color} />
                </div>
                <span style={{ fontSize:13.5, fontWeight:700, color:C.text, flex:1 }}>{sk.label}</span>
                <span style={{ fontSize:13, fontWeight:800, color: sk.pct > 0 ? sk.color : C.text3 }}>{sk.pct}%</span>
              </div>
              <ProgressBar pct={sk.pct} color={sk.color} h={5} />
            </div>
          );
        })}

        {/* ── BADGES ───────────────────────────────────────────────────────── */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", margin:"20px 0 10px" }}>
          <div style={{ fontSize:16, fontWeight:800, color:C.text, letterSpacing:"-.2px" }}>Badges</div>
          <div style={{ fontSize:12, fontWeight:600, color:C.text3 }}>
            {state.unlockedBadges.length} / {BADGES.length}
          </div>
        </div>

        {Object.entries(badgesByCategory).map(([cat, badges]) => (
          <div key={cat}>
            <div style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:".07em", color:C.text3, margin:"8px 0 8px" }}>
              {cat}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:8 }}>
              {badges.map(b => {
                const ok     = state.unlockedBadges.includes(b.id);
                const tint   = BADGE_TINTS[b.tint];
                const rarity = BADGE_RARITIES[b.rarity];
                return (
                  <div key={b.id} style={{
                    borderRadius:R.md, padding:"10px 6px", textAlign:"center",
                    border:`1.5px solid ${tint.border}`, background:tint.bg,
                    position:"relative",
                    opacity: ok ? 1 : 0.3,
                    filter: ok ? "none" : "grayscale(.5)",
                  }}>
                    <span style={{
                      position:"absolute", top:4, right:4,
                      fontSize:7, fontWeight:700, padding:"1px 4px", borderRadius:3,
                      letterSpacing:".05em", textTransform:"uppercase",
                      background:rarity.bg, color:rarity.fg,
                    }}>{rarity.label}</span>
                    <Ti name={b.icon.replace("ti-","")} size={22} color={tint.icon} />
                    <div style={{ fontSize:9.5, fontWeight:600, lineHeight:1.25, marginTop:5, color:tint.text }}>{b.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div style={{ height:28 }} />
      </div>
    </div>
  );
}

export { ProgressScreen };
