// Groply — design/ui.jsx
// Bibliothèque de composants : TOUT ce qui se répète d'un écran à l'autre vit
// ici. Un écran n'écrit plus son propre bouton, sa propre carte ni sa propre
// animation — il compose ces briques.
//
// Trois règles tiennent la cohérence :
//   1. Le relief signale « ça s'appuie » (bouton, carte cliquable, chip). Un
//      conteneur statique est plat, avec une bordure de 2 px.
//   2. Les couleurs viennent d'une teinte (`tone`) de la palette, jamais d'un
//      code hexadécimal ; les rayons de R, les tailles de T.
//   3. Le mouvement vient des classes d'index.css (gr-in, gr-stagger…), jamais
//      d'une durée écrite en dur.
//
// Accessibilité : toasts et gains d'XP portent role="status", la barre de
// progression expose sa valeur, les dialogues se ferment à Échap.
import { useEffect, useEffectEvent, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { FONTS, R, T } from "./tokens.js";
import { useC } from "./ThemeContext.jsx";
import { toneOf, useCountUp, useReducedMotion, useEstMonte } from "./hooks.js";
import Ti from "./Ti.jsx";
import { Gropi } from "./Gropi.jsx";

const cx = (...c) => c.filter(Boolean).join(" ");

// ═══ Boutons ════════════════════════════════════════════════════════════════

const TAILLES = {
  lg: { minHeight: 52, padding: "0 22px", borderRadius: 16, fontSize: 16, icone: 19 },
  md: { minHeight: 46, padding: "0 18px", borderRadius: R.md, fontSize: T.body, icone: 18 },
  sm: { minHeight: 40, padding: "0 14px", borderRadius: 12, fontSize: T.small, icone: 16 },
};

/**
 * Bouton en relief.
 *   variant  "primary" (aplat plein) · "secondary" (surface bordée) ·
 *            "soft" (fond teinté) · "ghost" (texte seul, sans relief)
 *   tone     teinte de la palette (défaut : primary) ; "danger" pour détruire
 *   size     "lg" (action principale d'un écran) · "md" · "sm"
 *   icon / iconRight   nom d'icône Tabler
 *   full     occupe toute la largeur
 *   loading  remplace l'icône par un indicateur et bloque le clic
 */
export function Button({
  variant = "primary", tone = "primary", size = "md",
  icon, iconRight, full = false, loading = false, disabled = false,
  type = "button", className, style, children, ...rest
}) {
  const C = useC();
  const k = toneOf(C, tone);
  const t = TAILLES[size] || TAILLES.md;
  const inactif = disabled || loading;

  let bg, fg, bord = "transparent", tranche, prof = size === "sm" ? 3 : 4;
  if (variant === "primary") {
    bg = k.solid; fg = C.onPrimaryBtn; tranche = k.edge;
  } else if (variant === "soft") {
    bg = k.l; fg = k.d; bord = k.b; tranche = k.b; prof = 3;
  } else if (variant === "secondary") {
    bg = C.surface; fg = tone === "primary" ? C.text : k.d;
    bord = tone === "primary" ? C.border : k.b; tranche = bord; prof = 3;
  } else {
    bg = "transparent"; fg = k.ink; tranche = "transparent"; prof = 0;
  }
  if (disabled && variant !== "ghost") {
    bg = C.surface2; fg = C.text3; bord = "transparent"; tranche = C.surface2;
  }

  const relief = variant !== "ghost";
  return (
    <button
      type={type}
      disabled={inactif}
      className={cx("gr-btn", relief ? "gr-press" : "gr-squish", "gr-focus", loading && "is-loading", className)}
      style={{
        "--btn-bg": bg, "--btn-fg": fg, "--edge": tranche, "--depth": `${prof}px`,
        borderColor: bord,
        minHeight: t.minHeight, padding: t.padding, borderRadius: t.borderRadius, fontSize: t.fontSize,
        width: full ? "100%" : undefined,
        opacity: disabled && variant === "ghost" ? 0.5 : undefined,
        ...style,
      }}
      {...rest}
    >
      {loading ? <span className="gr-btn-spin" aria-hidden="true" /> : icon && <Ti name={icon} size={t.icone} color="currentColor" />}
      {children}
      {iconRight && !loading && <Ti name={iconRight} size={t.icone} color="currentColor" />}
    </button>
  );
}

/**
 * Bouton carré à icône seule. `label` est obligatoire : c'est son nom
 * accessible.
 *   variant  "secondary" (défaut) · "soft" · "primary" · "ghost"
 */
export function IconButton({
  icon, label, variant = "secondary", tone = "primary", size = 44, iconSize,
  tint, disabled = false, className, style, ...rest
}) {
  const C = useC();
  const k = toneOf(C, tone);
  let bg = C.surface, fg = tone === "primary" ? C.text : k.d, bord = tone === "primary" ? C.border : k.b, tranche = bord;
  if (variant === "primary") { bg = k.solid; fg = C.onPrimaryBtn; bord = "transparent"; tranche = k.edge; }
  if (variant === "soft") { bg = k.l; fg = k.d; bord = k.b; tranche = k.b; }
  // `tint` : compatibilité avec l'ancien BackButton ({ bg, border, icon }).
  if (tint) { bg = tint.bg ?? bg; bord = tint.border ?? bord; tranche = tint.border ?? tranche; fg = tint.icon ?? fg; }
  const fantome = variant === "ghost";
  if (fantome) { bg = "transparent"; bord = "transparent"; fg = tint?.icon ?? (tone === "primary" ? C.text2 : k.ink); }
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      className={cx(fantome ? "gr-squish" : "gr-press", "gr-focus", className)}
      style={{
        "--edge": tranche, "--depth": "3px",
        width: size, height: size, flexShrink: 0, padding: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        borderRadius: size >= 44 ? R.md : 12,
        background: bg, color: fg, border: `2px solid ${bord}`,
        ...style,
      }}
      {...rest}
    >
      <Ti name={icon} size={iconSize || Math.round(size * 0.43)} color="currentColor" />
    </button>
  );
}

/** Bouton retour commun (44 px, libellé lisible par les lecteurs d'écran). */
export function BackButton({ onClick, label = "Retour", tint, tone, style }) {
  return <IconButton icon="arrow-left" label={label} onClick={onClick} tint={tint} tone={tone} style={style} />;
}

// ═══ Surfaces ═══════════════════════════════════════════════════════════════

/**
 * Carte. Statique par défaut (plate, bordure 2 px) ; avec `onClick`, elle
 * devient un bouton en relief.
 *   tone     teinte de la bordure (et du fond si `soft`)
 *   soft     fond teinté plutôt que surface
 *   pad      marge intérieure (défaut 16)
 *   selected carte choisie : bordure et tranche à la couleur de la teinte
 *   as       balise du conteneur statique (défaut "div")
 */
export function Card({
  tone, soft = false, pad = 16, selected = false, onClick, as = "div",
  disabled = false, className, style, children, ...rest
}) {
  const C = useC();
  const Balise = as;
  const k = tone ? toneOf(C, tone) : null;
  const bord = selected ? (k?.c || C.primary) : (k?.b || C.border);
  const base = {
    background: soft && k ? k.l : C.surface,
    border: `2px solid ${bord}`,
    borderRadius: R.lg,
    padding: pad,
    color: C.text,
  };
  if (!onClick) {
    return <Balise className={className} style={{ ...base, ...style }} {...rest}>{children}</Balise>;
  }
  return (
    <button
      type="button" onClick={onClick} disabled={disabled}
      className={cx("gr-press", "gr-focus", className)}
      style={{
        ...base, "--edge": bord, "--depth": "4px",
        display: "block", width: "100%", textAlign: "left", fontFamily: "inherit",
        opacity: disabled ? 0.6 : 1,
        ...style,
      }}
      {...rest}
    >{children}</button>
  );
}

/**
 * Chip sélectionnable (filtre, choix parmi plusieurs).
 * Sans `onClick`, c'est une étiquette statique : préférer <Tag>.
 */
export function Chip({ selected = false, tone = "primary", icon, onClick, disabled = false, className, style, children, ...rest }) {
  const C = useC();
  const k = toneOf(C, tone);
  const bord = selected ? k.c : C.border;
  return (
    <button
      type="button" onClick={onClick} disabled={disabled} aria-pressed={selected}
      className={cx("gr-press", "gr-focus", className)}
      style={{
        "--edge": bord, "--depth": "2px",
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
        minHeight: 40, padding: "0 14px", borderRadius: 12, flexShrink: 0,
        background: selected ? k.l : C.surface,
        border: `2px solid ${bord}`,
        color: selected ? k.d : C.text2,
        fontFamily: "inherit", fontSize: T.small, fontWeight: 700, whiteSpace: "nowrap",
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
      {...rest}
    >
      {icon && <Ti name={icon} size={15} color="currentColor" />}
      {children}
    </button>
  );
}

/** Étiquette statique (statut, catégorie, niveau). */
export function Tag({ tone = "primary", icon, solid = false, style, children }) {
  const C = useC();
  const k = toneOf(C, tone);
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "3px 9px", borderRadius: R.pill,
      background: solid ? k.solid : k.l, color: solid ? C.onPrimaryBtn : k.d,
      border: solid ? "none" : `1.5px solid ${k.b}`,
      fontSize: T.micro, fontWeight: 700, letterSpacing: ".02em", whiteSpace: "nowrap",
      ...style,
    }}>
      {icon && <Ti name={icon} size={12} color="currentColor" />}
      {children}
    </span>
  );
}

/** Tuile d'icône : carré arrondi teinté. `solid` = aplat plein (état « fait »). */
export function IconTile({ icon, tone = "primary", size = 38, solid = false, style, children }) {
  const C = useC();
  const k = toneOf(C, tone);
  return (
    <div aria-hidden="true" style={{
      width: size, height: size, flexShrink: 0,
      borderRadius: size >= 44 ? R.md : size >= 36 ? 12 : R.sm,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: solid ? k.c : k.l,
      border: solid ? "none" : `1.5px solid ${k.b}`,
      color: solid ? C.onPrimaryBtn : (tone === "neutral" ? C.text2 : k.c),
      ...style,
    }}>
      {children ?? <Ti name={icon} size={Math.round(size * 0.5)} color="currentColor" />}
    </div>
  );
}

// ═══ Contrôles ══════════════════════════════════════════════════════════════

/**
 * Contrôle segmenté à pastille glissante.
 *   options  [{ value, label, icon? }]
 */
export function Segmented({ options, value, onChange, label, size = "md", style }) {
  const C = useC();
  const i = Math.max(0, options.findIndex(o => o.value === value));
  const h = size === "sm" ? 38 : 44;
  return (
    <div role="group" aria-label={label} className="gr-seg" style={{
      "--n": options.length, "--i": i,
      background: C.surface2, padding: 4, borderRadius: R.md, gap: 0,
      ...style,
    }}>
      <span aria-hidden="true" className="gr-seg-thumb" style={{
        background: C.surface, borderRadius: R.sm,
        boxShadow: `0 2px 0 ${C.border}`,
      }} />
      {options.map(o => {
        const actif = o.value === value;
        return (
          <button
            key={String(o.value)} type="button" aria-pressed={actif}
            onClick={() => onChange(o.value)}
            className="gr-squish gr-focus"
            style={{
              minHeight: h, border: "none", background: "none", borderRadius: R.sm,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              fontFamily: "inherit", fontSize: size === "sm" ? T.small : 14, fontWeight: 700,
              color: actif ? C.text : C.text2, padding: "0 6px",
            }}
          >
            {o.icon && <Ti name={o.icon} size={15} color="currentColor" />}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

// ═══ En-têtes et titres ═════════════════════════════════════════════════════

/**
 * Bandeau illustré en tête d'un onglet (photo + voile sombre + titre blanc).
 *   image     chemin de la photo (dossier public)
 *   color     couleur d'attente, affichée avant le chargement de la photo
 *   overlay   voile posé sur la photo, pour la lisibilité du texte
 *   position  background-position (défaut "center")
 *   right     élément à droite du titre (bouton, mascotte)
 */
export function ScreenHero({
  image, color = "#613878", overlay = "rgba(20,14,8,.5)", position = "center",
  title, subtitle, right, children, style,
}) {
  return (
    <header style={{
      position: "relative", overflow: "hidden",
      backgroundColor: color,
      backgroundImage: image ? `url('${image}')` : undefined,
      backgroundSize: "cover", backgroundPosition: position,
      padding: "24px 20px 20px",
      borderRadius: `0 0 ${R.xl}px ${R.xl}px`,
      ...style,
    }}>
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: overlay, pointerEvents: "none" }} />
      <div className="gr-stagger" style={{ position: "relative", zIndex: 1 }}>
        {(title || right) && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            {title && <h1 style={{ margin: 0, fontSize: T.h1, fontWeight: 800, color: "#fff", letterSpacing: "-.4px", lineHeight: 1.15 }}>{title}</h1>}
            {right}
          </div>
        )}
        {subtitle && <div style={{ fontSize: T.small, fontWeight: 500, color: "rgba(255,255,255,.88)", marginTop: 4, lineHeight: 1.45 }}>{subtitle}</div>}
        {children}
      </div>
    </header>
  );
}

/**
 * En-tête d'un sous-écran : fond teinté, bouton retour, grand titre.
 *   tone      teinte du sous-écran (celle du module ou du domaine)
 *   onBack    affiche le bouton retour
 *   compact   titre plus petit sur la même ligne que le retour (outils, lecteurs)
 */
export function SubHeader({ tone = "primary", onBack, backLabel = "Retour", title, subtitle, right, compact = false, children, style }) {
  const C = useC();
  const k = toneOf(C, tone);
  const retour = onBack && <IconButton icon="arrow-left" label={backLabel} onClick={onBack} tint={{ bg: C.surface, border: k.b, icon: k.d }} />;
  return (
    <header className="gr-in-fade" style={{
      background: k.l, borderBottom: `2px solid ${k.b}`,
      padding: compact ? "12px 16px" : "16px 16px 18px",
      display: "flex", flexDirection: "column", gap: compact ? 10 : 12,
      borderRadius: `0 0 ${R.xl}px ${R.xl}px`,
      ...style,
    }}>
      {compact ? (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {retour}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ margin: 0, fontSize: T.h3, fontWeight: 800, letterSpacing: "-.3px", color: k.d, lineHeight: 1.2 }}>{title}</h1>
            {subtitle && <div style={{ fontSize: T.small, color: k.d, opacity: .85 }}>{subtitle}</div>}
          </div>
          {right}
        </div>
      ) : (
        <>
          {(retour || right) && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              {retour || <span />}
              {right}
            </div>
          )}
          <div>
            <h1 style={{ margin: 0, fontSize: T.h1, fontWeight: 800, letterSpacing: "-.5px", color: k.d, lineHeight: 1.15 }}>{title}</h1>
            {subtitle && <div style={{ fontSize: T.small, color: k.d, lineHeight: 1.5, marginTop: 4 }}>{subtitle}</div>}
          </div>
        </>
      )}
      {children}
    </header>
  );
}

/** Titre de section (h2), avec un élément optionnel aligné à droite. */
export function SectionTitle({ id, right, as = "h2", style, children }) {
  const C = useC();
  const Balise = as;
  return (
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10, margin: "4px 4px 0", ...style }}>
      <Balise id={id} style={{ margin: 0, fontSize: T.lead, fontWeight: 800, color: C.text, letterSpacing: "-.2px" }}>{children}</Balise>
      {right && <div style={{ fontSize: T.small, color: C.text2, flexShrink: 0 }}>{right}</div>}
    </div>
  );
}

/** Sur-titre en petites capitales (« TA SÉANCE DU JOUR », « CONSEIL DE GROPI »). */
export function Eyebrow({ tone = "primary", style, children }) {
  const C = useC();
  const k = toneOf(C, tone);
  return (
    <div style={{ fontSize: T.micro, fontWeight: 700, color: k.d, textTransform: "uppercase", letterSpacing: ".07em", ...style }}>
      {children}
    </div>
  );
}

// ═══ Listes ═════════════════════════════════════════════════════════════════

/** Groupe de lignes dans une carte (une <ul>). Enfants : <ListRow>. */
export function ListGroup({ style, children, ...rest }) {
  const C = useC();
  return (
    <ul style={{
      listStyle: "none", margin: 0, padding: 0,
      background: C.surface, border: `2px solid ${C.border}`, borderRadius: R.lg, overflow: "hidden",
      ...style,
    }} {...rest}>
      {children}
    </ul>
  );
}

/**
 * Ligne d'un <ListGroup>.
 *   lead     élément de tête (souvent <IconTile>)
 *   title / detail
 *   right    élément de fin (jauge, durée, étiquette)
 *   locked   ligne verrouillée (cadenas, texte atténué)
 *   onClick  ligne pressable : chevron à droite
 */
export function ListRow({ lead, title, detail, right, locked = false, onClick, chevron = true, detailColor, ariaLabel, style }) {
  const C = useC();
  const contenu = (
    <>
      {lead}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: locked ? C.text2 : C.text, lineHeight: 1.35 }}>{title}</div>
        {detail && <div style={{ fontSize: 12, color: detailColor || C.text2, lineHeight: 1.4 }}>{detail}</div>}
      </div>
      {right}
      {locked && <Ti name="lock" size={17} color={C.text2} label="Verrouillée" />}
      {onClick && chevron && <Ti name="chevron-right" size={18} color={C.text2} />}
    </>
  );
  const base = {
    display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", minHeight: 56,
    boxSizing: "border-box", width: "100%", ...style,
  };
  return (
    <li style={{ borderTop: `1px solid ${C.surface2}`, marginTop: -1 }}>
      {onClick ? (
        <button type="button" onClick={onClick} aria-label={ariaLabel} className="gr-row gr-focus" style={{
          ...base, background: "none", border: "none", textAlign: "left", fontFamily: "inherit", color: "inherit",
        }}>{contenu}</button>
      ) : <div style={base}>{contenu}</div>}
    </li>
  );
}

// ═══ Progression ════════════════════════════════════════════════════════════

/** Barre de progression animée (remplissage au montage, reflet qui passe). */
export function ProgressBar({ pct, color, h = 10, label, track, style }) {
  const C = useC();
  const valeur = Math.max(0, Math.min(100, Math.round(Number(pct) || 0)));
  return (
    <div
      role="progressbar"
      aria-valuenow={valeur}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label || "Progression"}
      style={{ background: track || C.surface2, borderRadius: R.pill, overflow: "hidden", height: h, ...style }}
    >
      <div className="gr-bar-fill" style={{
        width: `${valeur}%`, height: "100%",
        background: color || C.primary, borderRadius: R.pill,
        minWidth: valeur > 0 ? h : 0,
      }} />
    </div>
  );
}

/** Jauge à crans (niveau 0 à `max`). */
export function Gauge({ value = 0, max = 3, tone = "primary", color, size = "md", label, style }) {
  const C = useC();
  const plein = color || toneOf(C, tone).c;
  const petit = size === "sm";
  return (
    <div role="img" aria-label={label || `niveau ${value} sur ${max}`} style={{ display: "flex", gap: petit ? 3 : 4, flexShrink: 0, ...style }}>
      {Array.from({ length: max }, (_, n) => (
        <div key={n} style={{
          flex: petit ? "none" : 1, width: petit ? 14 : undefined, height: 6, borderRadius: 3,
          background: n < value ? plein : C.border,
          transition: "background-color var(--gr-dur) ease",
        }} />
      ))}
    </div>
  );
}

/** Nombre qui défile jusqu'à sa valeur. */
export function AnimatedNumber({ value, duration, format }) {
  const n = useCountUp(value, { duration });
  return <>{format ? format(n) : n}</>;
}

/** Tuile de statistique : icône, grand chiffre animé, libellé. */
export function StatTile({ icon, tone = "primary", value, suffix, label, style }) {
  const C = useC();
  const k = toneOf(C, tone);
  const chiffre = typeof value === "number";
  return (
    <div style={{
      background: k.l, border: `2px solid ${k.b}`, borderRadius: R.lg,
      padding: "12px 10px", display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
      minWidth: 0, ...style,
    }}>
      {icon && <Ti name={icon} size={18} color={k.c} style={{ alignSelf: "flex-start" }} />}
      <div style={{ fontSize: T.h2, fontWeight: 800, color: k.d, lineHeight: 1.1, fontVariantNumeric: "tabular-nums" }}>
        {chiffre ? <AnimatedNumber value={value} /> : value}{suffix}
      </div>
      <div style={{ fontSize: T.micro, fontWeight: 700, color: k.d, textTransform: "uppercase", letterSpacing: ".06em", textAlign: "center" }}>{label}</div>
    </div>
  );
}

// ═══ Retours ════════════════════════════════════════════════════════════════

/** Pastille « +N XP » qui jaillit en bas d'écran. */
export function XPPop({ amount, onDone }) {
  const C = useC();
  // useEffectEvent : lit toujours la dernière callback sans en faire une
  // dépendance (les écrans passent une fonction anonyme à chaque rendu).
  const terminer = useEffectEvent(() => onDone?.());
  useEffect(() => {
    const t = setTimeout(terminer, 1600);
    return () => clearTimeout(t);
  }, []);

  if (!amount || amount <= 0) return null;

  return (
    <div role="status" aria-live="polite" style={{
      position: "fixed", bottom: 96, left: "50%", transform: "translateX(-50%)",
      display: "flex", alignItems: "center", gap: 6,
      background: C.primaryBtn, color: C.onPrimaryBtn, padding: "10px 20px", borderRadius: R.pill,
      fontSize: T.lead, fontWeight: 800, fontFamily: FONTS.ui, zIndex: 200,
      pointerEvents: "none", animation: "gr-xp 1.6s var(--gr-ease-out) forwards",
      boxShadow: `0 4px 0 ${C.primaryEdge}, 0 10px 24px rgba(0,0,0,.18)`,
    }}>
      <Ti name="bolt" size={18} color="currentColor" />
      +{amount} XP
    </div>
  );
}

/** Message temporaire en haut d'écran. `icon` et `tone` facultatifs. */
export function Toast({ msg, onClose, duration = 3500, icon, tone = "primary" }) {
  const C = useC();
  const k = toneOf(C, tone);
  const fermer = useEffectEvent(() => onClose?.());
  useEffect(() => {
    const t = setTimeout(fermer, duration);
    return () => clearTimeout(t);
  }, [duration]);
  const badge = /^Badge débloqué/.test(String(msg));

  return (
    <div
      role="status" aria-live="polite"
      onClick={() => onClose?.()}
      style={{
        position: "fixed",
        top: "calc(env(safe-area-inset-top, 0px) + 14px)",
        left: 12, right: 12, maxWidth: 380, margin: "0 auto",
        display: "flex", alignItems: "center", gap: 10,
        background: C.surface, border: `2px solid ${badge ? C.amberBorder : C.border}`,
        borderRadius: R.lg, padding: "10px 14px",
        fontSize: T.small, fontWeight: 600, color: C.text, fontFamily: FONTS.ui, lineHeight: 1.4,
        zIndex: 300, boxShadow: `0 4px 0 ${badge ? C.amberBorder : C.border}, 0 12px 28px rgba(0,0,0,.14)`,
        cursor: "pointer",
        animation: "gr-slide-in var(--gr-dur-slow) var(--gr-ease-spring) backwards",
      }}
    >
      {(icon || badge) && <IconTile icon={icon || "medal"} tone={badge ? "amber" : tone} size={34} style={{ border: `1.5px solid ${badge ? C.amberBorder : k.b}` }} />}
      <div style={{ flex: 1, minWidth: 0 }}>{msg}</div>
    </div>
  );
}

// Tirage déterministe (pur) : même graine, mêmes confettis.
const alea = (i, n) => { const x = Math.sin(i * 12.9898 + n * 78.233) * 43758.5453; return x - Math.floor(x); };
const COULEURS_CONFETTI = ["primary", "amber", "green", "purple", "pink", "blue", "teal", "coral"];

/**
 * Pluie de confettis, une fois, au montage. À monter au moment de la
 * réussite (leçon terminée, unité validée, badge) ; se retire tout seul.
 * Ne rend rien si la personne a demandé moins d'animations.
 */
export function Confetti({ count = 36, origin = { x: 50, y: 42 }, onDone }) {
  const C = useC();
  const reduit = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const monte = useEstMonte();
  const fini = useEffectEvent(() => onDone?.());
  useEffect(() => {
    const t = setTimeout(() => { setVisible(false); fini(); }, 2200);
    return () => clearTimeout(t);
  }, []);
  const pieces = useMemo(() => Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + alea(i, 1) * 0.5;
    const force = 90 + alea(i, 2) * 130;
    return {
      couleur: COULEURS_CONFETTI[i % COULEURS_CONFETTI.length],
      dx: Math.round(Math.cos(angle) * force),
      up: Math.round(-Math.abs(Math.sin(angle)) * force - 40),
      down: Math.round(220 + alea(i, 3) * 260),
      rot: Math.round((alea(i, 4) - 0.5) * 900),
      w: 6 + Math.round(alea(i, 5) * 5),
      h: 8 + Math.round(alea(i, 6) * 8),
      t: (1.2 + alea(i, 7) * 0.8).toFixed(2),
      dl: (alea(i, 8) * 0.12).toFixed(2),
      rond: i % 5 === 0,
    };
  }), [count]);

  if (!visible || !monte || reduit) return null;
  return createPortal(
    <div className="gr-confetti" aria-hidden="true">
      {pieces.map((p, i) => (
        <i key={i} style={{
          "--c": C[p.couleur], "--x0": `${origin.x}%`, "--y0": `${origin.y}%`,
          "--dx": `${p.dx}px`, "--up": `${p.up}px`, "--down": `${p.down}px`, "--rot": `${p.rot}deg`,
          "--w": `${p.w}px`, "--h": `${p.rond ? p.w : p.h}px`, "--t": `${p.t}s`, "--dl": `${p.dl}s`,
          borderRadius: p.rond ? "50%" : 2,
        }} />
      ))}
    </div>,
    document.body,
  );
}

// ═══ Fenêtres ═══════════════════════════════════════════════════════════════

/**
 * Fenêtre modale : voile, panneau qui apparaît en ressort, fermeture à Échap
 * ou au clic sur le voile. Rendue dans <body> (portail), donc insensible aux
 * animations de l'écran qui l'ouvre.
 *   position  "center" (défaut) · "bottom" (feuille qui monte du bas)
 *   pad       marge intérieure du panneau (0 pour un panneau à bandeau image)
 */
export function Modal({ label, onClose, position = "center", maxWidth = 360, pad = 22, zIndex = 500, panelStyle, children }) {
  const C = useC();
  const monte = useEstMonte();
  const fermer = useEffectEvent(() => onClose?.());
  useEffect(() => {
    const auClavier = (e) => { if (e.key === "Escape") fermer(); };
    document.addEventListener("keydown", auClavier);
    return () => document.removeEventListener("keydown", auClavier);
  }, []);
  if (!monte) return null;
  const bas = position === "bottom";
  return createPortal(
    <div
      role="dialog" aria-modal="true" aria-label={label}
      onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
      className="gr-in-fade"
      style={{
        position: "fixed", inset: 0, zIndex,
        background: "rgba(20,14,8,.58)",
        display: "flex", alignItems: bas ? "flex-end" : "center", justifyContent: "center",
        padding: bas ? 0 : 20, fontFamily: FONTS.ui,
      }}
    >
      <div className={bas ? "gr-in-sheet" : "gr-in-pop"} style={{
        background: C.surface, color: C.text,
        borderRadius: bas ? `${R.xl}px ${R.xl}px 0 0` : R.xl,
        padding: pad, maxWidth: bas ? 440 : maxWidth, width: "100%",
        maxHeight: "calc(100dvh - 40px)", overflowY: "auto",
        border: `2px solid ${C.border}`, borderBottom: bas ? "none" : undefined,
        boxShadow: bas ? "0 -10px 40px rgba(0,0,0,.25)" : `0 5px 0 ${C.border}, 0 24px 60px rgba(0,0,0,.3)`,
        paddingBottom: bas ? `calc(${pad}px + env(safe-area-inset-bottom, 0px))` : pad,
        ...panelStyle,
      }}>
        {children}
      </div>
    </div>,
    document.body,
  );
}

/**
 * Boîte de confirmation (remplace `window.confirm`).
 * `motDeConfirmation` exige une saisie active : à réserver aux destructions
 * réellement définitives.
 */
export function ConfirmDialog({
  titre, message, confirmLabel = "Confirmer", cancelLabel = "Annuler",
  danger = false, motDeConfirmation = null, onConfirm, onCancel, saisie, onSaisie,
}) {
  const C = useC();
  const pret = !motDeConfirmation || (saisie || "").trim().toUpperCase() === motDeConfirmation.toUpperCase();

  return (
    <Modal label={titre} onClose={onCancel} maxWidth={340}>
      <div style={{ fontSize: T.h3, fontWeight: 800, color: C.text, marginBottom: 8, letterSpacing: "-.2px" }}>{titre}</div>
      <p style={{ fontSize: T.small, color: C.text2, lineHeight: 1.6, margin: "0 0 16px" }}>{message}</p>

      {motDeConfirmation && (
        <>
          <label htmlFor="confirm-word" style={{ fontSize: 12, color: C.text2, display: "block", marginBottom: 6 }}>
            Tape <strong style={{ color: C.text }}>{motDeConfirmation}</strong> pour confirmer
          </label>
          <input
            id="confirm-word" value={saisie || ""} onChange={(e) => onSaisie?.(e.target.value)}
            autoComplete="off" autoCapitalize="characters" className="gr-focus"
            style={{
              width: "100%", boxSizing: "border-box", padding: "12px 14px",
              borderRadius: R.md, border: `2px solid ${C.borderStrong}`,
              fontSize: 16, background: C.surface2, color: C.text,
              fontFamily: FONTS.ui, marginBottom: 16,
            }}
          />
        </>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <Button full size="lg" tone={danger ? "danger" : "primary"} disabled={!pret} onClick={() => pret && onConfirm?.()}>
          {confirmLabel}
        </Button>
        <Button full size="lg" variant="secondary" onClick={() => onCancel?.()}>{cancelLabel}</Button>
      </div>
    </Modal>
  );
}

// ═══ Sessions (quiz, révision, leçon, vérification, exercice) ═══════════════
// Tout ce qui pose une question ou clôt une activité partage ces briques :
// même barre en haut, mêmes réponses, même retour, même écran de fin.

/**
 * Barre de session : bouton quitter, progression épaisse, compteur.
 *   current / total  position (1-based) → compteur « 3/8 » et remplissage
 *   pct              remplissage imposé (sinon calculé : questions terminées)
 *   right            remplace le compteur (série, chrono…)
 */
export function SessionBar({ onClose, closeLabel = "Quitter", current, total, pct, tone = "primary", right, style }) {
  const C = useC();
  const k = toneOf(C, tone);
  const rempli = pct ?? (total ? ((current - 1) / total) * 100 : 0);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, ...style }}>
      {onClose && <IconButton icon="x" label={closeLabel} variant="ghost" onClick={onClose} size={40} iconSize={20} />}
      <ProgressBar pct={rempli} color={tone === "primary" ? C.green : k.c} h={14} style={{ flex: 1 }}
        label={total ? `Question ${current} sur ${total}` : "Progression"} />
      {right ?? (total ? (
        <span style={{ fontSize: T.small, fontWeight: 800, color: C.text2, flexShrink: 0, fontVariantNumeric: "tabular-nums" }}>
          {current}/{total}
        </span>
      ) : null)}
    </div>
  );
}

/** Carte qui porte l'énoncé d'une question. `eyebrow` : module, niveau… */
export function QuestionCard({ eyebrow, children, style }) {
  const C = useC();
  return (
    <div className="gr-in" style={{ ...style }}>
      {eyebrow && <div style={{ fontSize: T.micro, color: C.text3, marginBottom: 8, textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 700 }}>{eyebrow}</div>}
      <div style={{ background: C.surface, border: `2px solid ${C.border}`, borderRadius: R.lg, padding: 16 }}>
        <div style={{ margin: 0, fontSize: T.lead, fontWeight: 700, lineHeight: 1.5, color: C.text }}>{children}</div>
      </div>
    </div>
  );
}

const ETATS_REPONSE = {
  idle:     (C) => ({ bg: C.surface,  bord: C.border,  fg: C.text }),
  selected: (C) => ({ bg: C.primaryL, bord: C.primary, fg: C.primaryD }),
  correct:  (C) => ({ bg: C.greenL,   bord: C.green,   fg: C.greenD }),
  wrong:    (C) => ({ bg: C.dangerL,  bord: C.danger,  fg: C.dangerD }),
  muted:    (C) => ({ bg: C.surface,  bord: C.border,  fg: C.text2 }),
};

/**
 * Réponse d'un QCM.
 *   etat    "idle" · "selected" · "correct" (saute, coche) · "wrong" (tremble,
 *           croix) · "muted" (les autres réponses une fois la question jouée)
 *   marker  repère à gauche : lettre ou chiffre (« A », « 1 »)
 *   locked  la question est jouée : la réponse garde son relief mais ne
 *           répond plus au clic
 */
export function AnswerOption({ etat = "idle", marker, locked = false, onClick, className, style, children, ...rest }) {
  const C = useC();
  const k = (ETATS_REPONSE[etat] || ETATS_REPONSE.idle)(C);
  const resultat = etat === "correct" || etat === "wrong";
  return (
    <button
      type="button"
      onClick={locked ? undefined : onClick}
      aria-disabled={locked || undefined}
      className={cx("gr-press", "gr-focus", locked && "is-locked", etat === "correct" && "gr-bump", etat === "wrong" && "gr-shake", className)}
      style={{
        "--edge": k.bord, "--depth": etat === "muted" ? "2px" : "4px",
        display: "flex", alignItems: "center", gap: 12, width: "100%", minHeight: 56,
        padding: "12px 14px", textAlign: "left",
        background: k.bg, border: `2px solid ${k.bord}`, borderRadius: R.md, color: k.fg,
        fontFamily: "inherit", fontSize: T.body, fontWeight: 600, lineHeight: 1.4,
        opacity: etat === "muted" ? 0.6 : 1,
        // aria-disabled sert aux lecteurs d'écran ; le relief reste visible.
        translate: locked ? "0 0" : undefined,
        boxShadow: locked ? `0 ${etat === "muted" ? 2 : 4}px 0 ${k.bord}` : undefined,
        ...style,
      }}
      {...rest}
    >
      {(marker != null || resultat) && (
        <span aria-hidden="true" style={{
          width: 28, height: 28, flexShrink: 0, borderRadius: R.xs,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: resultat ? k.bord : "transparent",
          border: resultat ? "none" : `2px solid ${k.bord}`,
          color: resultat ? C.onPrimaryBtn : etat === "selected" ? k.fg : C.text2,
          fontSize: T.small, fontWeight: 800,
        }}>
          {etat === "correct" ? <Ti name="check" size={16} color="currentColor" stroke={3} />
            : etat === "wrong" ? <Ti name="x" size={16} color="currentColor" stroke={3} />
            : marker}
        </span>
      )}
      <span style={{ flex: 1, minWidth: 0 }}>{children}</span>
    </button>
  );
}

/**
 * Retour après une réponse : bandeau vert ou rouge qui apparaît en ressort.
 *   correct   vrai / faux
 *   title     « Bien joué ! », « Pas tout à fait »
 *   children  explication
 *   action    bouton « Continuer »
 */
export function Feedback({ correct, title, children, action, style }) {
  const C = useC();
  const k = toneOf(C, correct ? "green" : "danger");
  return (
    <div role="status" aria-live="polite" className="gr-in-pop" style={{
      background: k.l, border: `2px solid ${k.b}`, borderRadius: R.lg, padding: 14,
      display: "flex", flexDirection: "column", gap: 10, ...style,
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        <IconTile icon={correct ? "check" : "x"} tone={correct ? "green" : "danger"} solid size={32} />
        <div style={{ flex: 1, minWidth: 0 }}>
          {title && <div style={{ fontSize: T.body, fontWeight: 800, color: k.d }}>{title}</div>}
          {children && <div style={{ fontSize: T.small, color: k.d, lineHeight: 1.55, marginTop: title ? 2 : 0 }}>{children}</div>}
        </div>
      </div>
      {action}
    </div>
  );
}

/**
 * Écran de fin d'activité : Gropi, titre, chiffres qui défilent, action.
 *   pose / anim   pose de Gropi et son animation ("cheer" pour une réussite)
 *   confetti      lance les confettis (réussite franche uniquement)
 *   stats         [{ value, label, tone, prefix? }] — trois au plus
 *   pct           barre de score facultative (0 à 100)
 *   actions       boutons, empilés
 */
export function ResultScreen({
  pose = "celebrate", anim = "cheer", gropiSize = 132, confetti = false,
  title, subtitle, stats = [], pct, pctTone = "primary", children, actions, style,
}) {
  const C = useC();
  return (
    <div style={{ padding: "28px 20px 32px", display: "flex", flexDirection: "column", alignItems: "center", ...style }}>
      {confetti && <Confetti />}
      <Gropi pose={pose} size={gropiSize} anim={anim} />
      <div className="gr-stagger" style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ fontSize: T.h1, fontWeight: 800, color: C.text, letterSpacing: "-.4px", marginTop: 8, textAlign: "center", lineHeight: 1.2 }}>
          {title}
        </div>
        {subtitle && (
          <div style={{ fontSize: T.small, fontWeight: 500, color: C.text2, marginTop: 6, textAlign: "center", lineHeight: 1.55, maxWidth: 290 }}>
            {subtitle}
          </div>
        )}
        {stats.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))`, gap: 8, width: "100%", marginTop: 18 }}>
            {stats.map((s, i) => (
              <StatTile key={i} tone={s.tone} label={s.label}
                value={s.prefix ? <>{s.prefix}<AnimatedNumber value={s.value} /></> : s.value} />
            ))}
          </div>
        )}
        {pct != null && (
          <div style={{ width: "100%", marginTop: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: T.micro, fontWeight: 600, color: C.text3 }}>Score</span>
              <span style={{ fontSize: T.micro, fontWeight: 800, color: C.text2 }}><AnimatedNumber value={pct} />%</span>
            </div>
            <ProgressBar pct={pct} color={toneOf(C, pctTone).c} label="Score" />
          </div>
        )}
        {children && <div style={{ width: "100%", marginTop: 16 }}>{children}</div>}
        {actions && <div style={{ width: "100%", marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>{actions}</div>}
      </div>
    </div>
  );
}

// ═══ États ══════════════════════════════════════════════════════════════════

/** État vide ou message d'ambiance : Gropi, un titre, une phrase, une action. */
export function EmptyState({ pose = "think", title, children, action, style }) {
  const C = useC();
  return (
    <div className="gr-in" style={{
      display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
      gap: 10, padding: "28px 20px", ...style,
    }}>
      <Gropi pose={pose} size={92} anim="bob" />
      {title && <div style={{ fontSize: T.h3, fontWeight: 800, color: C.text, letterSpacing: "-.2px" }}>{title}</div>}
      {children && <div style={{ fontSize: T.small, color: C.text2, lineHeight: 1.6, maxWidth: 300 }}>{children}</div>}
      {action}
    </div>
  );
}

/** Écran d'attente : Gropi qui flotte plutôt qu'un spinner anonyme. */
export function LoadingScreen({ texte, hauteur = "100dvh", pose = "zen" }) {
  const C = useC();
  return (
    <div role="status" aria-live="polite" className="gr-in-fade" style={{
      minHeight: hauteur, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 14,
      background: C.bg, fontFamily: FONTS.ui,
    }}>
      <Gropi pose={pose} size={84} anim="bob" />
      <div aria-hidden="true" style={{ display: "flex", gap: 6 }}>
        {[0, 1, 2].map(i => (
          <span key={i} className="gr-glow" style={{
            width: 8, height: 8, borderRadius: "50%", background: C.primary,
            animationDelay: `${i * 0.22}s`,
          }} />
        ))}
      </div>
      {texte && <div style={{ fontSize: T.small, fontWeight: 600, color: C.text2 }}>{texte}</div>}
    </div>
  );
}
