// Groply — screens/SettingsScreen.jsx
//
// ── Ce qui change ─────────────────────────────────────────────────────────
// §5.6 Les deux `window.confirm` (réinitialiser la progression, supprimer le
//      contenu importé) sont remplacés par ConfirmDialog : dialogue système
//      hors design system, parfois en anglais selon l'appareil, pour les
//      actions les plus irréversibles de l'app.
// §8.1 SUPPRESSION DE COMPTE (RGPD art. 17). `RESET` réinitialisait l'état
//      applicatif mais ne supprimait ni la ligne `progress` ni le compte
//      `auth.users` : le droit à l'effacement n'était pas exerçable.
// §2.8 Option « rendre l'audio disponible hors-ligne » : les ~60 samples de
//      guitare n'étaient pas mis en cache, donc la fonction audio — cœur du
//      produit — ne marchait pas hors-ligne. On le propose au lieu de
//      télécharger plusieurs mégaoctets sans rien demander.
// §2.1 `todayStr` local, importé au lieu d'être redéfini en UTC ici.
import { useState } from "react";
import { FONTS, R, T } from "../design/tokens.js";
import { Ti } from "../design/Ti.jsx";
import { CONTENT_KEY, todayStr } from "../store/state.js";
import { BADGES } from "../store/badges.js";
import { gradeForLevel } from "../store/grades.js";
import { ConfirmDialog } from "../design/ui.jsx";
import { listSampleUrls, SAMPLE_COUNT } from "../audioEngine.js";

import { useC } from "../design/ThemeContext.jsx";

function SettingsSection({ title, children }) {
  const C = useC();
  return (
    <div style={{ background:C.surface, border:`1.5px solid ${C.border}`, borderRadius:R.lg, marginBottom:10, overflow:"hidden" }}>
      <div style={{ padding:"12px 16px 0", fontSize:11, fontWeight:700, letterSpacing:".07em", textTransform:"uppercase", color:C.text2 }}>
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
      <span style={{ fontSize:T.small, fontWeight:600, color:C.text }}>{label}</span>
      <span style={{ fontSize:T.small, fontWeight:600, color:C.text2 }}>{value}</span>
    </div>
  );
}

function SettingsScreen({ state, dispatch, content, onClose, onImported, user, onSignOut, onDeleteAccount }) {
  const C = useC();
  const [importStatus, setImportStatus] = useState(null);
  // `null` | "resetContent" | "resetProgress" | "deleteAccount"
  const [confirmation, setConfirmation] = useState(null);
  const [saisie, setSaisie] = useState("");
  const [audioOffline, setAudioOffline] = useState(null);

  const fermerConfirmation = () => { setConfirmation(null); setSaisie(""); };

  // Ne garde que les items qui ont un id exploitable — un import dont les
  // items n'ont pas d'id valide écraserait sinon tout dans une seule clé
  // `undefined` en silence (succès affiché, contenu réellement perdu).
  const sanitizeItems = (arr) => {
    if (!Array.isArray(arr)) return { valid: [], rejected: Array.isArray(arr) ? 0 : 1 };
    const valid = arr.filter(it => it && typeof it === "object" && typeof it.id === "string" && it.id.trim() !== "");
    return { valid, rejected: arr.length - valid.length };
  };

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
        const courses   = sanitizeItems(data.courses);
        const quiz      = sanitizeItems(data.quiz);
        const exercises = sanitizeItems(data.exercises);
        const totalRejected = courses.rejected + quiz.rejected + exercises.rejected;

        let existing = { courses:[], quiz:[], exercises:[] };
        try { const raw = localStorage.getItem(CONTENT_KEY); if (raw) existing = JSON.parse(raw); } catch {}
        const merged = {
          courses:   mergeCourses(existing.courses||[], courses.valid),
          quiz:      mergeById(existing.quiz||[], quiz.valid),
          exercises: mergeById(existing.exercises||[], exercises.valid),
        };
        localStorage.setItem(CONTENT_KEY, JSON.stringify(merged));
        const counts = { c:courses.valid.length, q:quiz.valid.length, e:exercises.valid.length };
        const base = `Import réussi : +${counts.c} module(s), +${counts.q} quiz, +${counts.e} exercice(s).`;
        setImportStatus({
          ok: true,
          msg: totalRejected > 0
            ? `${base} ${totalRejected} item(s) ignoré(s) car sans identifiant valide.`
            : base,
        });
        if (onImported) onImported();
      } catch { setImportStatus({ ok:false, msg:"Erreur de lecture : le fichier n'est pas un JSON valide." }); }
    };
    reader.readAsText(file);
  };

  const faireResetContent = () => {
    try { localStorage.removeItem(CONTENT_KEY); } catch { /* noop */ }
    if (onImported) onImported();
    setImportStatus({ ok:true, msg:"Contenu remis à l'état initial." });
    fermerConfirmation();
  };

  const faireResetProgress = () => {
    dispatch({ type:"RESET" });
    setImportStatus({ ok:true, msg:"Progression réinitialisée. Cette remise à zéro sera propagée à tes autres appareils." });
    fermerConfirmation();
  };

  const faireSuppressionCompte = async () => {
    fermerConfirmation();
    setImportStatus({ ok:true, msg:"Suppression en cours…" });
    const res = await onDeleteAccount?.();
    if (!res?.ok) {
      setImportStatus({ ok:false, msg:`La suppression a échoué : ${res?.error || "erreur inconnue"}. Réessaie ou écris-nous.` });
    }
    // En cas de succès, useProgress a déjà déconnecté : l'app repart sur
    // l'écran d'authentification, il n'y a rien à afficher ici.
  };

  /**
   * Demande au service worker de mettre les samples en cache. On passe par le
   * SW plutôt que par un fetch direct : c'est lui qui détient le cache
   * consulté ensuite par le moteur audio.
   */
  const activerAudioOffline = () => {
    if (!("serviceWorker" in navigator)) {
      setAudioOffline({ ok:false, msg:"Ton navigateur ne gère pas le mode hors-ligne." });
      return;
    }
    navigator.serviceWorker.getRegistration().then(reg => {
      if (!reg?.active) {
        setAudioOffline({ ok:false, msg:"Mode hors-ligne indisponible pour l'instant. Recharge l'app et réessaie." });
        return;
      }
      setAudioOffline({ ok:true, msg:`Téléchargement des ${SAMPLE_COUNT} sons…` });
      const auMessage = (e) => {
        if (e.data?.type !== "AUDIO_CACHED") return;
        navigator.serviceWorker.removeEventListener("message", auMessage);
        setAudioOffline(e.data.count === e.data.total
          ? { ok:true, msg:`Les ${e.data.count} sons sont disponibles hors-ligne.` }
          : { ok:false, msg:`${e.data.count} sons sur ${e.data.total} enregistrés. Réessaie avec une meilleure connexion.` });
      };
      navigator.serviceWorker.addEventListener("message", auMessage);
      reg.active.postMessage({ type:"PRECACHE_AUDIO", urls: listSampleUrls() });
    });
  };

  const exportProgress = () => {
    const payload = { exportedAt:new Date().toISOString(), app:"Groply", version:4, state };
    const blob = new Blob([JSON.stringify(payload,null,2)], { type:"application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = `groply-progression-${todayStr()}.json`;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
    setImportStatus({ ok:true, msg:"Progression exportée." });
  };

  const btn = (color, border) => ({
    width:"100%", padding:"14px 16px", borderRadius:R.md, fontSize:T.small, fontWeight:700, minHeight:48,
    cursor:"pointer", fontFamily:FONTS.ui, display:"flex", alignItems:"center",
    justifyContent:"center", gap:6, marginBottom:8,
    background:C.surface, color:color, border:`1.5px solid ${border||color}`,
  });

  return (
    <div>
      {/* En-tête */}
      <div style={{
        backgroundColor:"#4a4a4a", backgroundImage:"url('/atelier.jpg')",
        backgroundSize:"cover", backgroundPosition:"center 60%",
        padding:"22px 20px 18px", position:"relative", overflow:"hidden",
      }}>
        <div style={{ position:"absolute", inset:0, background:"rgba(20,18,16,.6)", pointerEvents:"none" }}/>
        <button onClick={onClose} style={{ position:"relative", zIndex:1, background:C.surface, border:`1.5px solid ${C.border}`, borderRadius:R.sm, width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", marginBottom:14 }}>
          <Ti name="arrow-left" size={17} color={C.text} />
        </button>
        <div style={{ position:"relative", zIndex:1, fontSize:26, fontWeight:800, color:"#fff", letterSpacing:"-.4px" }}>Réglages</div>
      </div>

      <div style={{ padding:"14px 20px 0" }}>

        {/* Apparence */}
        <SettingsSection title="Apparence">
          <div style={{ padding:"12px 16px 14px" }}>
            <div style={{ fontSize:12, color:C.text2, marginBottom:10 }}>Thème de l'application</div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {[
                { val:"auto",  label:"Auto",   icon:"device-desktop",   desc:"Suit le système" },
                { val:"light", label:"Clair",  icon:"sun",              desc:"Toujours clair" },
                { val:"dark",  label:"Sombre", icon:"moon",             desc:"Toujours sombre" },
              ].map(opt => {
                const active = (state.theme || "auto") === opt.val;
                return (
                  <button key={opt.val} onClick={() => dispatch({ type:"SET_THEME", theme:opt.val })} className="gr-focus" aria-pressed={active}
                    style={{
                      width:"100%", padding:"13px 14px", borderRadius:R.md, cursor:"pointer",
                      fontFamily:FONTS.ui, textAlign:"left", minHeight:48,
                      border:`1.5px solid ${active ? C.primary : C.borderStrong}`,
                      background: active ? C.primaryL : C.surface,
                      display:"flex", alignItems:"center", gap:12,
                    }}>
                    <Ti name={opt.icon} size={20} color={active ? C.primaryInk : C.text2}/>
                    <span style={{ flex:1 }}>
                      <span style={{ display:"block", fontSize:T.small, fontWeight:700, color:active ? C.primaryD : C.text }}>{opt.label}</span>
                      <span style={{ display:"block", fontSize:T.micro, color:C.text2, lineHeight:1.4 }}>{opt.desc}</span>
                    </span>
                    {active && <Ti name="check" size={18} color={C.primaryInk}/>}
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
        <button onClick={onSignOut} className="gr-focus" style={btn(C.text2, C.borderStrong)}>
          <Ti name="logout" size={16} color={C.text2} /> Se déconnecter
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
        <button onClick={() => setConfirmation("resetContent")} className="gr-focus" style={btn(C.text2, C.borderStrong)}>
          <Ti name="trash" size={14} color={C.text2} /> Supprimer le contenu importé
        </button>

        {/* Progression */}
        <SettingsSection title="Ma progression">
          <SettingsRow label="XP total"          value={`${state.xp ?? 0} XP`} />
          <SettingsRow label="Grade"              value={gradeForLevel(state.level).label} />
          <SettingsRow label="Niveau actuel"      value={state.level} />
          <SettingsRow label="Badges débloqués"   value={`${state.unlockedBadges.length} / ${BADGES.length}`} last />
        </SettingsSection>
        <button onClick={exportProgress} className="gr-focus" style={btn(C.text2, C.borderStrong)}>
          <Ti name="download" size={14} color={C.text2} /> Exporter ma progression (JSON)
        </button>
        <button onClick={() => setConfirmation("resetProgress")} className="gr-focus" style={btn(C.danger)}>
          <Ti name="refresh" size={14} color={C.danger} /> Réinitialiser ma progression
        </button>

        {/* Audio hors-ligne */}
        <SettingsSection title="Audio">
          <div style={{ padding:"4px 16px 14px" }}>
            <p style={{ margin:"0 0 12px", fontSize:T.small, color:C.text2, lineHeight:1.6 }}>
              Les sons de guitare sont téléchargés à la première écoute. Tu peux
              les enregistrer maintenant pour qu'ils fonctionnent sans connexion
              — compte quelques mégaoctets, à faire de préférence en Wi-Fi.
            </p>
            <button onClick={activerAudioOffline} className="gr-focus" style={{ ...btn(C.text2, C.borderStrong), marginBottom:0 }}>
              <Ti name="download" size={16} color={C.text2} /> Rendre l'audio disponible hors-ligne
            </button>
            {audioOffline && (
              <p role="status" style={{
                margin:"10px 0 0", fontSize:T.micro, lineHeight:1.5,
                color: audioOffline.ok ? C.greenD : C.dangerInk,
              }}>{audioOffline.msg}</p>
            )}
          </div>
        </SettingsSection>

        {/* Zone de danger — séparée visuellement du reste : ces actions ne
            doivent pas se trouver à côté d'un réglage anodin. */}
        <div style={{
          border:`1.5px solid ${C.danger}`, borderRadius:R.lg,
          padding:"14px 16px", marginTop:18, marginBottom:10, background:C.surface,
        }}>
          <div style={{ fontSize:T.micro, fontWeight:700, letterSpacing:".07em", textTransform:"uppercase", color:C.dangerInk, marginBottom:10 }}>
            Zone irréversible
          </div>
          <p style={{ margin:"0 0 12px", fontSize:T.small, color:C.text2, lineHeight:1.6 }}>
            La suppression de compte efface définitivement ton email, ta
            progression et ton historique de nos serveurs. Aucune sauvegarde
            n'est conservée. Pense à exporter ta progression avant, si tu veux
            en garder une copie.
          </p>
          <button onClick={() => setConfirmation("deleteAccount")} className="gr-focus"
            style={{ ...btn(C.dangerInk, C.danger), marginBottom:0 }}>
            <Ti name="trash" size={16} color={C.dangerInk} /> Supprimer mon compte et mes données
          </button>
        </div>

        {/* Mentions légales */}
        <div style={{ display:"flex", gap:14, justifyContent:"center", marginTop:6, flexWrap:"wrap" }}>
          <a href="/cgu.html" style={{ fontSize:T.micro, color:C.text2 }}>Conditions d'utilisation</a>
          <a href="/confidentialite.html" style={{ fontSize:T.micro, color:C.text2 }}>Confidentialité</a>
        </div>

        {/* Feedback import */}
        {importStatus && (
          <div style={{
            background: importStatus.ok ? C.greenL : C.dangerL,
            border:`1.5px solid ${importStatus.ok ? C.greenBorder : C.dangerBorder}`,
            borderRadius:R.md, padding:"11px 14px", marginTop:12,
            display:"flex", gap:8, alignItems:"flex-start",
          }} role="status">
            <Ti name={importStatus.ok?"check":"alert-circle"} size={16} color={importStatus.ok?C.greenD:C.dangerInk} />
            <p style={{ margin:0, fontSize:T.small, color:importStatus.ok?C.greenD:C.text, lineHeight:1.5 }}>{importStatus.msg}</p>
          </div>
        )}

        <div style={{ height:28 }} />
      </div>

      {confirmation === "resetContent" && (
        <ConfirmDialog
          titre="Supprimer le contenu importé ?"
          message="Tu reviendras au contenu pédagogique de base. Ta progression n'est pas touchée."
          confirmLabel="Supprimer le contenu"
          onConfirm={faireResetContent} onCancel={fermerConfirmation}
        />
      )}

      {confirmation === "resetProgress" && (
        <ConfirmDialog
          danger
          titre="Réinitialiser ta progression ?"
          message="XP, niveau, badges, séries, historique de révision : tout repart de zéro, sur cet appareil comme sur les autres. Ton objectif et ton temps disponible sont conservés. Cette action est définitive."
          confirmLabel="Tout réinitialiser"
          motDeConfirmation="EFFACER"
          saisie={saisie} onSaisie={setSaisie}
          onConfirm={faireResetProgress} onCancel={fermerConfirmation}
        />
      )}

      {confirmation === "deleteAccount" && (
        <ConfirmDialog
          danger
          titre="Supprimer ton compte ?"
          message={`Le compte ${user?.email || ""} et toutes ses données seront effacés de nos serveurs, sans possibilité de récupération. Tu seras déconnecté immédiatement.`}
          confirmLabel="Supprimer définitivement"
          motDeConfirmation="SUPPRIMER"
          saisie={saisie} onSaisie={setSaisie}
          onConfirm={faireSuppressionCompte} onCancel={fermerConfirmation}
        />
      )}
    </div>
  );
}

// Helpers merge (inchangés)
function mergeCourses(existing, incoming) {
  const map = Object.fromEntries((existing||[]).filter(c=>c?.id).map(c=>[c.id,c]));
  (incoming||[]).filter(c=>c?.id).forEach(c => {
    if (!map[c.id]) { map[c.id]=c; return; }
    const merged = { ...map[c.id], ...c };
    const lessonMap = Object.fromEntries((map[c.id].lessons||[]).filter(l=>l?.id).map(l=>[l.id,l]));
    (c.lessons||[]).filter(l=>l?.id).forEach(l=>{ lessonMap[l.id]=l; });
    merged.lessons = Object.values(lessonMap);
    map[c.id] = merged;
  });
  return Object.values(map);
}
function mergeById(existing, incoming) {
  const map = Object.fromEntries((existing||[]).filter(x=>x?.id).map(x=>[x.id,x]));
  (incoming||[]).filter(x=>x?.id).forEach(x=>{ map[x.id]=x; });
  return Object.values(map);
}

export { SettingsScreen };
