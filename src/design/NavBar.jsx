// Groply — design/NavBar.jsx
// Barre de navigation principale (onglets du bas).
//
// L'onglet actif est signalé par une pastille teintée qui GLISSE d'un onglet
// à l'autre, et son icône fait un petit saut à l'arrivée : on voit où l'on
// va, pas seulement où l'on est.
import { FONTS, T, TAP } from "./tokens.js";
import { TABS, NAV_HEIGHT } from "./nav.js";
import { useC } from "./ThemeContext.jsx";
import { Ti } from "./Ti.jsx";

export function NavBar({ screen, navigate, preload }) {
  const C = useC();
  const index = TABS.findIndex(t => t.id === screen);
  return (
    <nav aria-label="Navigation principale" style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      background: C.surface,
      borderTop: `2px solid ${C.border}`,
      zIndex: 100,
      paddingBottom: "env(safe-area-inset-bottom, 0px)",
    }}>
      <div style={{ maxWidth: 440, margin: "0 auto", display: "flex", height: NAV_HEIGHT, position: "relative" }}>
        {index >= 0 && (
          <span aria-hidden="true" className="gr-nav-pill" style={{
            "--i": index, "--n": TABS.length,
            background: C.primaryL, border: `2px solid ${C.primaryBorder}`,
          }} />
        )}
        {TABS.map(t => {
          const actif = screen === t.id;
          return (
            <button
              key={t.id}
              onClick={() => navigate(t.id)}
              onPointerEnter={() => preload?.[t.id]?.()}
              aria-current={actif ? "page" : undefined}
              aria-label={t.label}
              className="gr-nav-tab gr-focus"
              style={{
                flex: 1, background: "none", border: "none", cursor: "pointer",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "flex-start", gap: 4,
                padding: "11px 0 6px", fontFamily: FONTS.ui,
                minHeight: TAP.min,
              }}
            >
              <span className="gr-nav-ico" style={{ display: "block" }}>
                <Ti name={t.icon} size={24} color={actif ? C.primaryInk : C.text2} stroke={actif ? 2.25 : 2} />
              </span>
              <span style={{
                fontSize: T.micro,
                fontWeight: actif ? 800 : 600,
                color: actif ? C.primaryInk : C.text2,
                transition: "color var(--gr-dur-fast) ease",
              }}>{t.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default NavBar;
