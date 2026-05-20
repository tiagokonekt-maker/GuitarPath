// GuitarPath — screens/ProgressScreen.jsx
import { useState, useEffect, useCallback, useMemo } from "react";
import { C, FONTS, R } from "../design/tokens.js";
import { Ti } from "../design/Ti.jsx";
import { ProgressBar, XPPop, Toast } from "../design/ui.jsx";
import { MODULE_THEME } from "../store/moduleTheme.js";
import { BADGES, BADGE_RARITIES, skillMastery, BADGE_TINTS } from "../store/badges.js";

function ProgressScreen({ state, content, onOpenSettings }) {
  const xpInLevel = state.xp % 300;
  const xpToNext = 300 - xpInLevel;

  const skills = useMemo(() => [
    { label: "Manche",   pct: skillMastery(state, content, "neck"),    color: C.amber },
    { label: "Gammes",   pct: skillMastery(state, content, "scales"),  color: C.green },
    { label: "Harmonie", pct: skillMastery(state, content, "harmony"), color: C.primary },
    { label: "Rythme",   pct: skillMastery(state, content, "rhythm"),  color: C.coral },
    { label: "Impro",    pct: skillMastery(state, content, "impro"),   color: C.pink },
  ], [state, content]);

  // Grouper badges par catégorie
  const badgesByCategory = useMemo(() => {
    const map = {};
    BADGES.forEach(b => {
      if (!map[b.cat]) map[b.cat] = [];
      map[b.cat].push(b);
    });
    return map;
  }, []);

  return (
    <div style={{ padding: "18px 16px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, fontFamily: FONTS.title, letterSpacing: "-0.01em", color: C.text }}>Progression</h1>
        <button onClick={onOpenSettings} style={{
          background: C.surface, border: `1px solid ${C.border}`, borderRadius: R.sm,
          padding: "6px 11px", fontSize: 11, color: C.text, cursor: "pointer",
          fontFamily: FONTS.ui, fontWeight: 500, display: "flex", alignItems: "center", gap: 5,
        }}>
          <Ti name="settings" size={13} /> RÉGLAGES
        </button>
      </div>

      {/* XP hero */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: R.lg, padding: 14, marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 60, height: 60, borderRadius: "50%",
            background: C.primaryL, border: `2px solid ${C.primary}`,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <span style={{ fontSize: 9, color: C.text3, letterSpacing: "0.05em", fontFamily: FONTS.ui }}>NIV.</span>
            <span style={{ fontSize: 20, fontWeight: 700, color: C.primary, lineHeight: 1, fontFamily: FONTS.ui }}>{state.level}</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: C.text3, fontFamily: FONTS.ui, marginBottom: 3 }}>
              Expérience totale
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.01em", color: C.text, lineHeight: 1, fontFamily: FONTS.ui }}>
              {state.xp} XP
            </div>
            <div style={{ fontSize: 11, color: C.text3, marginTop: 4, fontFamily: FONTS.ui }}>
              {xpToNext} XP pour atteindre le niveau {state.level + 1}
            </div>
          </div>
        </div>
      </div>

      {/* Stats 3 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 10 }}>
        {[
          { ic: "flame",        v: `${state.streak}j`, l: "Streak",    c: C.amber, cd: C.amberD },
          { ic: "circle-check", v: Object.keys(state.completedExercises).length, l: "Exercices", c: C.green, cd: C.greenD },
          { ic: "book-2",       v: Object.keys(state.completedLessons).length,   l: "Leçons",    c: C.primary, cd: C.primaryD },
        ].map(s => (
          <div key={s.l} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: R.sm, padding: "10px 6px", textAlign: "center" }}>
            <Ti name={s.ic} size={16} color={s.c} />
            <div style={{ fontSize: 18, fontWeight: 700, color: s.cd, lineHeight: 1, marginTop: 3, fontFamily: FONTS.ui }}>{s.v}</div>
            <div style={{ fontSize: 11, color: C.text3, marginTop: 2, fontFamily: FONTS.ui }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Compétences */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: R.lg, padding: 14, marginBottom: 10 }}>
        <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 11, fontFamily: FONTS.title, color: C.text }}>Compétences</div>
        {skills.map(sk => (
          <div key={sk.label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 9 }}>
            <span style={{ fontSize: 12, color: C.text2, width: 90, flexShrink: 0, fontWeight: 500, fontFamily: FONTS.ui }}>{sk.label}</span>
            <div style={{ flex: 1 }}>
              <ProgressBar pct={sk.pct} color={sk.color} h={3} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 500, width: 32, textAlign: "right", flexShrink: 0, color: sk.pct > 0 ? sk.color : C.text3, fontFamily: FONTS.ui }}>{sk.pct}%</span>
          </div>
        ))}
      </div>

      {/* Badges */}
      <div style={{ padding: "0 0 6px", display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
        <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: C.text3, fontFamily: FONTS.ui }}>
          Badges
        </div>
        <div style={{ fontSize: 11, color: C.text3, fontFamily: FONTS.ui }}>
          {state.unlockedBadges.length} / {BADGES.length} débloqués
        </div>
      </div>

      {Object.entries(badgesByCategory).map(([cat, badges]) => (
        <div key={cat}>
          <div style={{ padding: "0 0 6px", fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.1em", color: C.text3, fontFamily: FONTS.ui, marginTop: 8 }}>
            — {cat}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 7, marginBottom: 8 }}>
            {badges.map(b => {
              const ok = state.unlockedBadges.includes(b.id);
              const tint = BADGE_TINTS[b.tint];
              const rarity = BADGE_RARITIES[b.rarity];
              return (
                <div key={b.id} style={{
                  borderRadius: 12, padding: "10px 6px", textAlign: "center",
                  border: `1px solid ${tint.border}`, background: tint.bg,
                  position: "relative", opacity: ok ? 1 : 0.32, filter: ok ? "none" : "grayscale(0.5)",
                }}>
                  <span style={{
                    position: "absolute", top: 4, right: 4,
                    fontSize: 7, fontWeight: 600, padding: "1px 4px", borderRadius: 3,
                    letterSpacing: "0.05em", textTransform: "uppercase",
                    background: rarity.bg, color: rarity.fg, fontFamily: FONTS.ui,
                  }}>{rarity.label}</span>
                  <Ti name={b.icon.replace("ti-", "")} size={22} color={tint.icon} />
                  <div style={{ fontSize: 9.5, fontWeight: 500, lineHeight: 1.25, marginTop: 5, color: tint.text, fontFamily: FONTS.ui }}>{b.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <div style={{ height: 20 }} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SETTINGS — propre, lisible, plein contraste
// ═══════════════════════════════════════════════════════════════════════════

export { ProgressScreen };
