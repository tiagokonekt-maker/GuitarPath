// GuitarPath — screens/SettingsScreen.jsx
import { useState } from "react";
import { FONTS, R } from "../design/tokens.js";
import { Ti } from "../design/Ti.jsx";
import { CONTENT_KEY } from "../store/state.js";
import { BADGES } from "../store/badges.js";

import { useC } from "../design/ThemeContext.jsx";

const todayStr = () => new Date().toISOString().slice(0,10);

function SettingsSection({ title, children }) {
  const C = useC();
  return (
    <div style={{ background:C.surface, border:`1.5px solid ${C.border}`, borderRadius:R.lg, marginBottom:10, overflow:"hidden" }}>
      <div style={{ padding:"12px 16px 0", fontSize:10, fontWeight:700, letterSpacing:".07em", textTransform:"uppercase", color:C.text3 }}>
        {title}
      </div>
      <div style={{ marginTop:8 }}>{children}</div>
    </div>
  );
}

function SettingsRow({ label, value, last }) {
  const C = useC();
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"11px 16px", borderBottom: last ? "none" : `1px solid ${C.borderSoft}` }}>
      <span style={{ fontSize:13, fontWeight:600, color:C.text }}>{label}</span>
      <span style={{ fontSize:12, fontWeight:600, color:C.text2 }}>{value}</span>
    </div>
  );
}

function SettingsScreen({ state, dispatch, content, onClose, onImported, user, onSignOut }) {
  const C = useC();
  const [importStatus, setImportStatus] = useState(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!data.courses && !data.quiz && !data.exercises) {
          setImportStatus({ ok:false, msg:"Fichier JSON invalide. Le fichier doit contenir au moins une clé 'courses', 'quiz' ou 'exercises'." });
          return;
        }
        let existing = { courses:[], quiz:[], exercises:[] };
        try { const raw = localStorage.getItem(CONTENT_KEY); if (raw) existing = JSON.parse(raw); } catch {}
        const merged = {
          courses:   mergeCourses(existing.courses||[], data.courses||[]),
          quiz:      mergeById(existing.quiz||[], data.quiz||[]),
          exercises: mergeById(existing.exercises||[], data.exercises||[]),
        };
        localStorage.setItem(CONTENT_KEY, JSON.stringify(merged));
        const counts = { c:(data.courses||[]).length, q:(data.quiz||[]).length, e:(data.exercises||[]).length };
        setImportStatus({ ok:true, msg:`Import réussi : +${counts.c} module(s), +${counts.q} quiz, +${counts.e} exercice(s).` });
        if (onImported) onImported();
      } catch { setImportStatus({ ok:false, msg:"Erreur de lecture : le fichier n'est pas un JSON valide." }); }
    };
    reader.readAsText(file);
  };

  const resetContent = () => {
    if (window.confirm("Supprimer tout le contenu importé et revenir au contenu de base ?")) {
      localStorage.removeItem(CONTENT_KEY);
      if (onImported) onImported();
      setImportStatus({ ok:true, msg:"Contenu remis à l'état initial." });
    }
  };

  const resetProgress = () => {
    if (window.confirm("Réinitialiser TOUTE ta progression (XP, badges, etc.) ? Action irréversible.")) {
      dispatch({ type:"RESET" });
      setImportStatus({ ok:true, msg:"Progression réinitialisée." });
    }
  };

  const exportProgress = () => {
    const payload = { exportedAt:new Date().toISOString(), app:"GuitarPath", version:4, state };
    const blob = new Blob([JSON.stringify(payload,null,2)], { type:"application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = `guitarpath-progression-${todayStr()}.json`;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
    setImportStatus({ ok:true, msg:"Progression exportée." });
  };

  const btn = (color, border) => ({
    width:"100%", padding:"13px 16px", borderRadius:R.md, fontSize:13, fontWeight:700,
    cursor:"pointer", fontFamily:FONTS.ui, display:"flex", alignItems:"center",
    justifyContent:"center", gap:6, marginBottom:8,
    background:C.surface, color:color, border:`1.5px solid ${border||color}`,
  });

  return (
    <div>
      {/* En-tête */}
      <div style={{ background:C.surface2, padding:"22px 20px 18px" }}>
        <button onClick={onClose} style={{ background:C.surface, border:`1.5px solid ${C.border}`, borderRadius:R.sm, width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", marginBottom:14 }}>
          <Ti name="arrow-left" size={17} color={C.text} />
        </button>
        <div style={{ fontSize:26, fontWeight:800, color:C.text, letterSpacing:"-.4px" }}>Réglages</div>
      </div>

      <div style={{ padding:"14px 20px 0" }}>

        {/* Apparence */}
        <SettingsSection title="Apparence">
          <div style={{ padding:"12px 16px 14px" }}>
            <div style={{ fontSize:12, color:C.text2, marginBottom:10 }}>Thème de l'application</div>
            <div style={{ display:"flex", gap:8 }}>
              {[
                { val:"auto",  label:"Auto",   icon:"device-desktop",   desc:"Suit le système" },
                { val:"light", label:"Clair",  icon:"sun",              desc:"Toujours clair" },
                { val:"dark",  label:"Sombre", icon:"moon",             desc:"Toujours sombre" },
              ].map(opt => {
                const active = (state.theme || "auto") === opt.val;
                return (
                  <button key={opt.val} onClick={() => dispatch({ type:"SET_THEME", theme:opt.val })}
                    style={{
                      flex:1, padding:"10px 6px", borderRadius:R.md, cursor:"pointer",
                      fontFamily:FONTS.ui, textAlign:"center",
                      border:`1.5px solid ${active ? C.primary : C.border}`,
                      background: active ? C.primaryL : C.surface,
                      display:"flex", flexDirection:"column", alignItems:"center", gap:5,
                    }}>
                    <Ti name={opt.icon} size={18} color={active ? C.primary : C.text3}/>
                    <span style={{ fontSize:11, fontWeight:700, color:active ? C.primaryD : C.text2 }}>{opt.label}</span>
                    <span style={{ fontSize:9.5, color:C.text3, lineHeight:1.3 }}>{opt.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </SettingsSection>

        {/* Compte */}
        <SettingsSection title="Compte">
          <SettingsRow label="Email" value={user?.email || "—"} last />
        </SettingsSection>
        <button onClick={onSignOut} style={btn(C.danger)}>
          <Ti name="logout" size={14} color={C.danger} /> Se déconnecter
        </button>

        {/* Contenu */}
        <SettingsSection title="Contenu pédagogique">
          <SettingsRow label="Modules"   value={content.courses.length} />
          <SettingsRow label="Quiz"      value={`${content.quiz.length} questions`} />
          <SettingsRow label="Exercices" value={content.exercises.length} last />
        </SettingsSection>
        <label style={{ ...btn(C.primary), cursor:"pointer" }}>
          <Ti name="upload" size={14} color={C.primary} /> Importer un fichier JSON
          <input type="file" accept=".json,application/json" onChange={handleFile} style={{ display:"none" }} />
        </label>
        <button onClick={resetContent} style={btn(C.text2, C.border)}>
          <Ti name="trash" size={14} color={C.text2} /> Supprimer le contenu importé
        </button>

        {/* Progression */}
        <SettingsSection title="Ma progression">
          <SettingsRow label="XP total"          value={`${state.xp ?? 0} XP`} />
          <SettingsRow label="Niveau actuel"      value={state.level} />
          <SettingsRow label="Badges débloqués"   value={`${state.unlockedBadges.length} / ${BADGES.length}`} last />
        </SettingsSection>
        <button onClick={exportProgress} style={btn(C.text2, C.border)}>
          <Ti name="download" size={14} color={C.text2} /> Exporter ma progression (JSON)
        </button>
        <button onClick={resetProgress} style={btn(C.danger)}>
          <Ti name="refresh" size={14} color={C.danger} /> Réinitialiser ma progression
        </button>

        {/* Feedback import */}
        {importStatus && (
          <div style={{
            background: importStatus.ok ? C.greenL : C.coralL,
            border:`1.5px solid ${importStatus.ok ? C.greenBorder : C.coralBorder}`,
            borderRadius:R.md, padding:"11px 14px", marginTop:12,
            display:"flex", gap:8, alignItems:"flex-start",
          }}>
            <Ti name={importStatus.ok?"check":"alert-circle"} size={15} color={importStatus.ok?C.green:C.coral} />
            <p style={{ margin:0, fontSize:12, color:importStatus.ok?C.greenD:C.coralD, lineHeight:1.5 }}>{importStatus.msg}</p>
          </div>
        )}

        <div style={{ height:28 }} />
      </div>
    </div>
  );
}

// Helpers merge (inchangés)
function mergeCourses(existing, incoming) {
  const map = Object.fromEntries(existing.map(c=>[c.id,c]));
  incoming.forEach(c => {
    if (!map[c.id]) { map[c.id]=c; return; }
    const merged = { ...map[c.id], ...c };
    const lessonMap = Object.fromEntries((map[c.id].lessons||[]).map(l=>[l.id,l]));
    (c.lessons||[]).forEach(l=>{ lessonMap[l.id]=l; });
    merged.lessons = Object.values(lessonMap);
    map[c.id] = merged;
  });
  return Object.values(map);
}
function mergeById(existing, incoming) {
  const map = Object.fromEntries(existing.map(x=>[x.id,x]));
  incoming.forEach(x=>{ map[x.id]=x; });
  return Object.values(map);
}

export { SettingsScreen };
