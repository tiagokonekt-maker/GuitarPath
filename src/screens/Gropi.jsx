// Groply — design/Gropi.jsx
// Composant mascotte Gropi — 6 poses, SVG inline, sans dépendance externe
// Usage : import { Gropi, GropiTip } from "../design/Gropi.jsx";
//   <Gropi pose="wave" size={80} />
//   <GropiTip pose="think" tint="amber">Entre cordes 3 et 2, c'est +4 cases.</GropiTip>
//
// Poses disponibles :
//   happy     → défaut, souriant
//   wave      → bras levé, salue (accueil, conseils)
//   celebrate → bras en l'air, bouche ouverte (victoires, quiz parfait)
//   think     → bras replié (astuces pédagogiques, score moyen)
//   listen    → casque sur les oreilles (ear training)
//   plead     → grands yeux, bras joints (rappel de série)

import { C, FONTS, R } from "../design/tokens.js";

// ── Dégradé du corps ──────────────────────────────────────────────────────────
// On utilise un id unique par instance via un compteur pour éviter les conflits SVG
let _uid = 0;

// ── Composant principal ───────────────────────────────────────────────────────
export function Gropi({ pose = "happy", size = 80, style }) {
  const id = `gb-${++_uid}`;

  const arms = {
    happy:     ["M56 120 L42 142", "M144 120 L158 142"],
    wave:      ["M56 120 L42 142", "M146 112 L166 84"],
    celebrate: ["M54 114 L34 86",  "M146 114 L166 86"],
    think:     ["M56 120 L42 142", "M148 118 L132 140 L114 124"],
    listen:    ["M56 122 L44 144", "M144 122 L156 144"],
    plead:     ["M60 124 L86 146", "M140 124 L114 146"],
  }[pose] || ["M56 120 L42 142", "M144 120 L158 142"];

  return (
    <svg
      viewBox="0 0 200 230"
      width={size}
      height={Math.round(size * 1.15)}
      style={{ display: "block", flexShrink: 0, ...style }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFA45E"/>
          <stop offset="1" stopColor="#E85D1A"/>
        </linearGradient>
      </defs>

      {/* Arceau casque (listen uniquement, derrière le corps) */}
      {pose === "listen" && (
        <path d="M50 84 C54 30 146 30 150 84"
          fill="none" stroke="#14655B" strokeWidth="9" strokeLinecap="round"/>
      )}

      {/* Pieds */}
      <ellipse cx="78" cy="207" rx="14" ry="9" fill="#C2490E"/>
      <ellipse cx="122" cy="207" rx="14" ry="9" fill="#C2490E"/>

      {/* Bras */}
      {arms.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="#E2560F" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round"/>
      ))}

      {/* Mécaniques */}
      {[13,22].map(y => [81,119].map(x => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="3.6" fill="#FFDDC0"/>
      )))}

      {/* Tête de manche */}
      <rect x="86" y="4" width="28" height="27" rx="9" fill="#B5430C"/>

      {/* Manche + frettes + cordes */}
      <rect x="91" y="24" width="18" height="36" fill="#C2490E"/>
      {[34,43,52].map(y => <line key={y} x1="91" y1={y} x2="109" y2={y} stroke="#E89055" strokeWidth="2"/>)}
      {[95.5,100,104.5].map(x => <line key={x} x1={x} y1="25" x2={x} y2="59" stroke="#FFE6CC" strokeWidth="1.4"/>)}

      {/* Corps */}
      <path d="M100 54 C76 54 60 66 56 88 C54 100 50 105 50 122 C50 168 70 200 100 200 C130 200 150 168 150 122 C150 105 146 100 144 88 C140 66 124 54 100 54 Z" fill={`url(#${id})`}/>

      {/* Ventre */}
      <path d="M100 116 C127 116 141 133 141 152 C141 178 122 195 100 195 C78 195 59 178 59 152 C59 133 73 116 100 116 Z" fill="#FFE9D8"/>

      {/* Rosace */}
      <circle cx="100" cy="131" r="17.5" fill="none" stroke="#F4B98F" strokeWidth="2.6"/>

      {/* Joues */}
      <ellipse cx="57" cy="104" rx="8.5" ry="5.5" fill="#FF9E6B" opacity=".7"/>
      <ellipse cx="143" cy="104" rx="8.5" ry="5.5" fill="#FF9E6B" opacity=".7"/>

      {/* Coques casque (listen, sur le corps) */}
      {pose === "listen" && (<>
        <rect x="36" y="74" width="17" height="30" rx="8" fill="#0F4A42"/>
        <rect x="147" y="74" width="17" height="30" rx="8" fill="#0F4A42"/>
      </>)}

      {/* ── VISAGES PAR POSE ── */}

      {/* Yeux ouverts (happy / wave / think / plead) */}
      {["happy","wave","think"].includes(pose) && (<>
        <ellipse cx="76" cy="88" rx="12.5" ry="14.5" fill="#fff"/>
        <ellipse cx="124" cy="88" rx="12.5" ry="14.5" fill="#fff"/>
        <circle cx="78" cy="90" r="6.2" fill="#2B1608"/>
        <circle cx="122" cy="90" r="6.2" fill="#2B1608"/>
        <circle cx="75.5" cy="85" r="2.1" fill="#fff"/>
        <circle cx="119.5" cy="85" r="2.1" fill="#fff"/>
      </>)}

      {/* Yeux listen (regardent de côté) */}
      {pose === "listen" && (<>
        <ellipse cx="76" cy="88" rx="12.5" ry="14.5" fill="#fff"/>
        <ellipse cx="124" cy="88" rx="12.5" ry="14.5" fill="#fff"/>
        <circle cx="71" cy="90" r="6.2" fill="#2B1608"/>
        <circle cx="119" cy="90" r="6.2" fill="#2B1608"/>
        <circle cx="69" cy="86" r="2" fill="#fff"/>
        <circle cx="117" cy="86" r="2" fill="#fff"/>
      </>)}

      {/* Grands yeux plead */}
      {pose === "plead" && (<>
        <ellipse cx="76" cy="87" rx="13.5" ry="15.5" fill="#fff"/>
        <ellipse cx="124" cy="87" rx="13.5" ry="15.5" fill="#fff"/>
        <circle cx="76" cy="84" r="8" fill="#2B1608"/>
        <circle cx="124" cy="84" r="8" fill="#2B1608"/>
        <circle cx="73" cy="80" r="2.6" fill="#fff"/>
        <circle cx="121" cy="80" r="2.6" fill="#fff"/>
        <circle cx="79" cy="87" r="1.5" fill="#fff"/>
        <circle cx="127" cy="87" r="1.5" fill="#fff"/>
      </>)}

      {/* Yeux celebrate (fermés en arc de joie) */}
      {pose === "celebrate" && (<>
        <path d="M64 86 Q76 96 88 86" fill="none" stroke="#7A2E08" strokeWidth="5" strokeLinecap="round"/>
        <path d="M112 86 Q124 96 136 86" fill="none" stroke="#7A2E08" strokeWidth="5" strokeLinecap="round"/>
      </>)}

      {/* Sourcils happy / wave / listen */}
      {["happy","wave","listen"].includes(pose) && (<>
        <path d="M62 68 Q76 61 90 67" fill="none" stroke="#7A2E08" strokeWidth="4" strokeLinecap="round"/>
        <path d="M110 67 Q124 61 138 68" fill="none" stroke="#7A2E08" strokeWidth="4" strokeLinecap="round"/>
      </>)}

      {/* Sourcils think (un levé) */}
      {pose === "think" && (<>
        <path d="M62 70 Q76 64 90 69" fill="none" stroke="#7A2E08" strokeWidth="4" strokeLinecap="round"/>
        <path d="M110 64 Q124 56 138 62" fill="none" stroke="#7A2E08" strokeWidth="4" strokeLinecap="round"/>
      </>)}

      {/* Sourcils celebrate */}
      {pose === "celebrate" && (<>
        <path d="M62 68 Q76 61 90 67" fill="none" stroke="#7A2E08" strokeWidth="4" strokeLinecap="round"/>
        <path d="M110 67 Q124 61 138 68" fill="none" stroke="#7A2E08" strokeWidth="4" strokeLinecap="round"/>
      </>)}

      {/* Sourcils plead (tristes) */}
      {pose === "plead" && (<>
        <path d="M62 72 Q74 68 86 62" fill="none" stroke="#7A2E08" strokeWidth="4" strokeLinecap="round"/>
        <path d="M114 62 Q126 68 138 72" fill="none" stroke="#7A2E08" strokeWidth="4" strokeLinecap="round"/>
      </>)}

      {/* Sourire standard */}
      {["happy","wave","think","listen"].includes(pose) && (
        <path d="M86 126 Q100 139 114 126" fill="none" stroke="#7A2E08" strokeWidth="5" strokeLinecap="round"/>
      )}

      {/* Bouche plead (légèrement triste) */}
      {pose === "plead" && (
        <path d="M89 133 Q100 126 111 133" fill="none" stroke="#7A2E08" strokeWidth="5" strokeLinecap="round"/>
      )}

      {/* Bouche-rosace celebrate (ouverte) */}
      {pose === "celebrate" && (<>
        <circle cx="100" cy="131" r="12.5" fill="#5C2206"/>
        <path d="M91 136 Q100 143 109 136 L109 139 Q100 146 91 139 Z" fill="#FF6B4A"/>
        {/* Notes de musique */}
        <path d="M163 52 l0 -16 l9 -3 l0 13" stroke="#B5430C" strokeWidth="3" fill="none" strokeLinecap="round"/>
        <circle cx="163" cy="53" r="4" fill="#B5430C"/>
        <circle cx="172" cy="47" r="4" fill="#B5430C"/>
        <path d="M36 60 l0 -13" stroke="#E2560F" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="36" cy="61" r="3.6" fill="#E2560F"/>
      </>)}
    </svg>
  );
}

// ── Bulle de conseil ──────────────────────────────────────────────────────────
export function GropiTip({ pose="wave", tint="primary", eyebrow="Conseil de Gropi", onClose, children }) {
  const light  = C[tint+"L"]      || C.primaryL;
  const border = C[tint+"Border"] || C[tint+"B"] || C.primaryBorder;
  const deep   = C[tint+"D"]      || C.primaryD;

  return (
    <div style={{
      display:"flex", gap:11, alignItems:"flex-start", position:"relative",
      background:C.surface, border:`1.5px solid ${border}`,
      borderRadius:R.xl, padding:12,
    }}>
      <Gropi pose={pose} size={56}/>
      <div style={{ position:"relative", flex:1, background:light, borderRadius:R.lg, padding:"9px 11px" }}>
        {/* Flèche de bulle */}
        <span style={{
          position:"absolute", left:-7, top:16, width:0, height:0,
          borderTop:"7px solid transparent", borderBottom:"7px solid transparent",
          borderRight:`7px solid ${light}`,
        }}/>
        <div style={{
          fontSize:9, fontWeight:700, letterSpacing:".09em",
          textTransform:"uppercase", color:deep, fontFamily:FONTS.ui,
        }}>{eyebrow}</div>
        <p style={{
          margin:"3px 0 0", fontSize:12.5, lineHeight:1.5,
          fontWeight:500, color:C.text, fontFamily:FONTS.body,
        }}>{children}</p>
      </div>
      {onClose && (
        <button onClick={onClose} aria-label="Fermer" style={{
          position:"absolute", top:8, right:11, background:"none", border:0,
          cursor:"pointer", fontSize:14, fontWeight:600, color:C.text3, padding:2,
        }}>✕</button>
      )}
    </div>
  );
}
