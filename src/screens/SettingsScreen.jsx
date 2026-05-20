// GuitarPath — screens/SettingsScreen.jsx
import { useState, useEffect, useCallback, useMemo } from "react";
import { C, FONTS, R } from "../design/tokens.js";
import { Ti } from "../design/Ti.jsx";
import { ProgressBar, XPPop, Toast } from "../design/ui.jsx";
import { CONTENT_KEY } from "../store/state.js";
import { BADGES } from "../store/badges.js";

function SettingsScreen({ state, dispatch, content, onClose, onImported, user, onSignOut }) {
  const [importStatus, setImportStatus] = useState(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!data.courses && !data.quiz && !data.exercises) {
          setImportStatus({ ok: false, msg: "Fichier JSON invalide. Le fichier doit contenir au moins une clé 'courses', 'quiz' ou 'exercises'." });
          return;
        }
        let existing = { courses: [], quiz: [], exercises: [] };
        try {
          const raw = localStorage.getItem(CONTENT_KEY);
          if (raw) existing = JSON.parse(raw);
        } catch {}
        const merged = {
          courses: mergeCourses(existing.courses || [], data.courses || []),
          quiz: mergeById(existing.quiz || [], data.quiz || []),
          exercises: mergeById(existing.exercises || [], data.exercises || []),
        };
        localStorage.setItem(CONTENT_KEY, JSON.stringify(merged));
        const counts = {
          c: (data.courses || []).length,
          q: (data.quiz || []).length,
          e: (data.exercises || []).length,
        };
        setImportStatus({ ok: true, msg: `Import réussi : +${counts.c} module(s), +${counts.q} quiz, +${counts.e} exercice(s).` });
        if (onImported) onImported();
      } catch {
        setImportStatus({ ok: false, msg: "Erreur de lecture : le fichier n'est pas un JSON valide." });
      }
    };
    reader.readAsText(file);
  };

  const resetContent = () => {
    if (window.confirm("Supprimer tout le contenu importé et revenir au contenu de base ?")) {
      localStorage.removeItem(CONTENT_KEY);
      if (onImported) onImported();
      setImportStatus({ ok: true, msg: "Contenu remis à l'état initial." });
    }
  };

  const resetProgress = () => {
    if (window.confirm("Réinitialiser TOUTE ta progression (XP, badges, etc.) ? Action irréversible.")) {
      dispatch({ type: "RESET" });
      setImportStatus({ ok: true, msg: "Progression réinitialisée." });
    }
  };

  const exportProgress = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      app: "GuitarPath",
      version: 4,
      state,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `guitarpath-progression-${todayStr()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setImportStatus({ ok: true, msg: "Progression exportée." });
  };

  // Styles communs des boutons réglages
  const btnBase = {
    width: "100%", padding: 13, borderRadius: 11, fontSize: 13, fontWeight: 500,
    cursor: "pointer", fontFamily: FONTS.ui, display: "flex",
    alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 8,
  };
  const btnNeutral = { ...btnBase, background: C.surface, color: C.text, border: `1px solid ${C.text}` };
  const btnPrimary = { ...btnBase, background: C.surface, color: C.primary, border: `1px solid ${C.primary}` };
  const btnDanger  = { ...btnBase, background: C.surface, color: C.danger,  border: `1px solid ${C.danger}` };

  return (
    <div style={{ padding: "14px 16px 0" }}>
      <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.text2, fontSize: 13, padding: "0 0 8px", fontFamily: FONTS.ui, display: "flex", alignItems: "center", gap: 4 }}>
        <Ti name="chevron-left" size={16} /> RETOUR
      </button>
      <h1 style={{ margin: "0 0 14px", fontSize: 24, fontWeight: 700, fontFamily: FONTS.title, letterSpacing: "-0.01em", color: C.text }}>Réglages</h1>

      {/* Compte */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: R.lg, marginBottom: 10, overflow: "hidden" }}>
        <div style={{ padding: "12px 14px 0", fontSize: 10, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: C.text3, fontFamily: FONTS.ui }}>Compte</div>
        <div style={{ marginTop: 8 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", borderBottom: `1px solid ${C.borderSoft}` }}>
            <span style={{ fontSize: 13, color: C.text, fontFamily: FONTS.title }}>Email</span>
            <span style={{ fontSize: 12, color: C.text2, fontFamily: FONTS.ui }}>{user?.email || "—"}</span>
          </div>
        </div>
      </div>
      <button onClick={onSignOut} style={btnDanger}>
        <Ti name="logout" size={14} /> Se déconnecter
      </button>

      {/* Contenu */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: R.lg, marginTop: 14, marginBottom: 10, overflow: "hidden" }}>
        <div style={{ padding: "12px 14px 0", fontSize: 10, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: C.text3, fontFamily: FONTS.ui }}>Contenu</div>
        <div style={{ marginTop: 8 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", borderBottom: `1px solid ${C.borderSoft}` }}>
            <span style={{ fontSize: 13, color: C.text, fontFamily: FONTS.title }}>Modules</span>
            <span style={{ fontSize: 12, color: C.text, fontWeight: 500, fontFamily: FONTS.ui }}>{content.courses.length}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", borderBottom: `1px solid ${C.borderSoft}` }}>
            <span style={{ fontSize: 13, color: C.text, fontFamily: FONTS.title }}>Quiz</span>
            <span style={{ fontSize: 12, color: C.text, fontWeight: 500, fontFamily: FONTS.ui }}>{content.quiz.length} questions</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px" }}>
            <span style={{ fontSize: 13, color: C.text, fontFamily: FONTS.title }}>Exercices</span>
            <span style={{ fontSize: 12, color: C.text, fontWeight: 500, fontFamily: FONTS.ui }}>{content.exercises.length}</span>
          </div>
        </div>
      </div>
      <label style={{ ...btnPrimary, cursor: "pointer" }}>
        <Ti name="upload" size={14} /> Importer un fichier JSON
        <input type="file" accept=".json,application/json" onChange={handleFile} style={{ display: "none" }} />
      </label>
      <button onClick={resetContent} style={btnNeutral}>
        <Ti name="trash" size={14} /> Supprimer le contenu importé
      </button>

      {/* Progression */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: R.lg, marginTop: 14, marginBottom: 10, overflow: "hidden" }}>
        <div style={{ padding: "12px 14px 0", fontSize: 10, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: C.text3, fontFamily: FONTS.ui }}>Ma progression</div>
        <div style={{ marginTop: 8 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", borderBottom: `1px solid ${C.borderSoft}` }}>
            <span style={{ fontSize: 13, color: C.text, fontFamily: FONTS.title }}>XP total</span>
            <span style={{ fontSize: 12, color: C.primary, fontWeight: 500, fontFamily: FONTS.ui }}>{state.xp ?? 0} XP</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", borderBottom: `1px solid ${C.borderSoft}` }}>
            <span style={{ fontSize: 13, color: C.text, fontFamily: FONTS.title }}>Niveau actuel</span>
            <span style={{ fontSize: 12, color: C.text, fontWeight: 500, fontFamily: FONTS.ui }}>{state.level}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px" }}>
            <span style={{ fontSize: 13, color: C.text, fontFamily: FONTS.title }}>Badges débloqués</span>
            <span style={{ fontSize: 12, color: C.text, fontWeight: 500, fontFamily: FONTS.ui }}>{state.unlockedBadges.length} / {BADGES.length}</span>
          </div>
        </div>
      </div>
      <button onClick={exportProgress} style={btnNeutral}>
        <Ti name="download" size={14} /> Exporter ma progression (JSON)
      </button>
      <button onClick={resetProgress} style={btnDanger}>
        <Ti name="refresh" size={14} /> Réinitialiser ma progression
      </button>

      {importStatus && (
        <div style={{
          background: importStatus.ok ? C.greenL : C.coralL,
          border: `1px solid ${importStatus.ok ? C.greenBorder : C.coralBorder}`,
          borderRadius: 11, padding: "11px 13px", marginTop: 12, display: "flex", gap: 8, alignItems: "flex-start",
        }}>
          <Ti name={importStatus.ok ? "check" : "alert-circle"} size={15} color={importStatus.ok ? C.green : C.coral} style={{ marginTop: 1 }} />
          <p style={{ margin: 0, fontSize: 12, color: importStatus.ok ? C.greenD : C.coralD, fontFamily: FONTS.title, lineHeight: 1.5 }}>{importStatus.msg}</p>
        </div>
      )}

      <div style={{ height: 24 }} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ROOT APP
// ═══════════════════════════════════════════════════════════════════════════
const TABS = [
  { id: "home",      label: "ACCUEIL",   icon: "home" },
  { id: "courses",   label: "COURS",     icon: "book-2" },
  { id: "exercises", label: "EXERCICES", icon: "guitar-pick" },
  { id: "quiz",      label: "QUIZ",      icon: "help-circle" },
  { id: "progress",  label: "PROGRÈS",   icon: "chart-bar" },
];


export { SettingsScreen };
