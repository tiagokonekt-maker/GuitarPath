// Groply — screens/SettingsScreen.jsx
//
// ── Ce qui change ─────────────────────────────────────────────────────────
// §5.6 Les `window.confirm` sont remplacés par ConfirmDialog : dialogue
//      système hors design system, parfois en anglais selon l'appareil,
//      pour les actions les plus irréversibles de l'app.
// §8.1 SUPPRESSION DE COMPTE (RGPD art. 17). `RESET` réinitialisait l'état
//      applicatif mais ne supprimait ni la ligne `progress` ni le compte
//      `auth.users` : le droit à l'effacement n'était pas exerçable.
// §2.8 Option « rendre l'audio disponible hors-ligne » : les ~60 samples de
//      guitare n'étaient pas mis en cache, donc la fonction audio — cœur du
//      produit — ne marchait pas hors-ligne. On le propose au lieu de
//      télécharger plusieurs mégaoctets sans rien demander.
// §2.1 `todayStr` local, importé au lieu d'être redéfini en UTC ici.
//
// ── Retiré ────────────────────────────────────────────────────────────────
// L'import de contenu JSON par l'utilisateur et la suppression du contenu
// importé. Ce mécanisme avait du sens dans l'hypothèse où d'autres
// créateurs de cours pourraient un jour apporter leurs propres packs ; ce
// n'est plus le modèle retenu — le contenu ne passe que par le dépôt. La
// clé `CONTENT_KEY` en localStorage et la logique de fusion dans state.js
// (mergeCourses/mergeById) restent en place, inertes, au cas où ce choix
// serait reconsidéré ; rien à y toucher pour ce retrait.
import { useState } from "react";
import { R, T } from "../design/tokens.js";
import { Ti } from "../design/Ti.jsx";
import { todayStr } from "../store/state.js";
import { BADGES } from "../store/badges.js";
import { gradeForLevel } from "../store/grades.js";
import {
  Button, Card, ConfirmDialog, Eyebrow, IconButton, ListGroup, ListRow,
  ScreenHero, SectionTitle, Segmented,
} from "../design/ui.jsx";
import { listSampleUrls, SAMPLE_COUNT } from "../audioEngine.js";
import { statistiquesActivees, definirStatistiquesActivees, signalNavigateurRefus } from "../analytics.js";

import { useC } from "../design/ThemeContext.jsx";

const THEMES = [
  { value:"auto",  label:"Auto",   icon:"device-desktop", desc:"Suit le système" },
  { value:"light", label:"Clair",  icon:"sun",            desc:"Toujours clair" },
  { value:"dark",  label:"Sombre", icon:"moon",           desc:"Toujours sombre" },
];

function SettingsSection({ title, children }) {
  return (
    <section style={{ display:"flex", flexDirection:"column", gap:8 }}>
      <SectionTitle>{title}</SectionTitle>
      {children}
    </section>
  );
}

function SettingsRow({ label, value }) {
  const C = useC();
  return (
    <ListRow title={label} style={{ minHeight:48 }}
      right={(
        <span style={{
          fontSize:T.small, fontWeight:600, color:C.text2, maxWidth:"64%",
          overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
        }}>{value}</span>
      )} />
  );
}

function SettingsScreen({ state, dispatch, content, onClose, user, onSignOut, onDeleteAccount }) {
  const C = useC();
  const [importStatus, setImportStatus] = useState(null);
  // `null` | "resetProgress" | "deleteAccount"
  const [confirmation, setConfirmation] = useState(null);
  const [saisie, setSaisie] = useState("");
  const [audioOffline, setAudioOffline] = useState(null);
  // Opposition à la mesure d'audience (RGPD art. 21) : préférence d'appareil.
  const [stats, setStats] = useState(statistiquesActivees);
  const refusNavigateur = signalNavigateurRefus();
  const basculerStats = () => {
    const actif = !stats;
    definirStatistiquesActivees(actif);
    setStats(actif);
  };

  const fermerConfirmation = () => { setConfirmation(null); setSaisie(""); };

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

  const theme = state.theme || "auto";
  const statsActives = stats && !refusNavigateur;

  return (
    <div className="gr-in-push">
      <ScreenHero
        image="/atelier.jpg" color="#4a4a4a" overlay="rgba(20,18,16,.6)" position="center 60%"
        title="Réglages"
        right={<IconButton icon="x" label="Fermer les réglages" onClick={onClose} />}
      />

      <div className="gr-stagger" style={{ padding:"16px 16px 0", display:"flex", flexDirection:"column", gap:16 }}>

        {/* Apparence */}
        <SettingsSection title="Apparence">
          <Card style={{ display:"flex", flexDirection:"column", gap:10 }}>
            <div style={{ fontSize:12, color:C.text2 }}>Thème de l'application</div>
            <Segmented label="Thème de l'application" options={THEMES} value={theme}
              onChange={(val) => dispatch({ type:"SET_THEME", theme:val })} />
            <div style={{ fontSize:T.micro, color:C.text2, lineHeight:1.4 }}>
              {THEMES.find(o => o.value === theme)?.desc}
            </div>
          </Card>
        </SettingsSection>

        {/* Compte */}
        <SettingsSection title="Compte">
          <ListGroup>
            <SettingsRow label="Email" value={user?.email || "—"} />
          </ListGroup>
          <Button variant="secondary" full icon="logout" onClick={onSignOut}>Se déconnecter</Button>
        </SettingsSection>

        {/* Confidentialité — interrupteur accessible (role="switch") : le
            libellé et l'explication sont reliés au contrôle, cible ≥ 44 px. */}
        <SettingsSection title="Confidentialité">
          <Card pad={0} style={{ overflow:"hidden" }}>
            <button
              type="button" role="switch" aria-checked={statsActives}
              aria-labelledby="reglage-stats-libelle" aria-describedby="reglage-stats-aide"
              disabled={refusNavigateur}
              onClick={basculerStats} className="gr-row gr-focus"
              style={{
                width:"100%", minHeight:52, padding:"8px 16px", background:"none", border:"none",
                display:"flex", alignItems:"center", gap:12, textAlign:"left",
                cursor: refusNavigateur ? "default" : undefined, fontFamily:"inherit",
              }}>
              <span id="reglage-stats-libelle" style={{ flex:1, fontSize:14, fontWeight:700, color:C.text }}>
                Statistiques d'utilisation
              </span>
              {/* Piste + curseur, purement décoratifs : l'état est porté par aria-checked. */}
              <span aria-hidden="true" style={{
                position:"relative", boxSizing:"border-box", width:48, height:28, flexShrink:0, borderRadius:R.pill,
                background: statsActives ? C.primaryBtn : C.surface,
                border:`2px solid ${statsActives ? C.primaryBtn : C.borderStrong}`,
                opacity: refusNavigateur ? .5 : 1,
                transition:"background-color var(--gr-dur-fast) ease, border-color var(--gr-dur-fast) ease",
              }}>
                <span style={{
                  position:"absolute", top:3, left: statsActives ? 23 : 3,
                  width:18, height:18, borderRadius:"50%",
                  background: statsActives ? C.onPrimaryBtn : C.borderStrong,
                  transition:"left var(--gr-dur-fast) var(--gr-ease-out), background-color var(--gr-dur-fast) ease",
                }}/>
              </span>
            </button>
            <p id="reglage-stats-aide" style={{ margin:0, padding:"0 16px 14px", fontSize:T.micro, color:C.text2, lineHeight:1.5 }}>
              {refusNavigateur
                ? "Ton navigateur envoie un signal « Do Not Track » ou GPC : aucune statistique n'est envoyée. "
                : "Mesure d'audience interne (écrans vus, sessions terminées), sans tes réponses ni publicité. "}
              <a href="/confidentialite.html" style={{ color:C.text2 }}>En savoir plus</a>
            </p>
          </Card>
        </SettingsSection>

        {/* Contenu */}
        <SettingsSection title="Contenu pédagogique">
          <ListGroup>
            <SettingsRow label="Modules"   value={content.courses.length} />
            <SettingsRow label="Quiz"      value={`${content.quiz.length} questions`} />
            <SettingsRow label="Exercices" value={content.exercises.length} />
          </ListGroup>
        </SettingsSection>

        {/* Progression */}
        <SettingsSection title="Ma progression">
          <ListGroup>
            <SettingsRow label="XP total"          value={`${state.xp ?? 0} XP`} />
            <SettingsRow label="Grade"              value={gradeForLevel(state.level).label} />
            <SettingsRow label="Niveau actuel"      value={state.level} />
            <SettingsRow label="Badges débloqués"   value={`${state.unlockedBadges.length} / ${BADGES.length}`} />
          </ListGroup>
          <Button variant="secondary" full icon="download" onClick={exportProgress}>
            Exporter ma progression (JSON)
          </Button>
          <Button variant="secondary" tone="danger" full icon="refresh" onClick={() => setConfirmation("resetProgress")}>
            Réinitialiser ma progression
          </Button>
        </SettingsSection>

        {/* Audio hors-ligne */}
        <SettingsSection title="Audio">
          <Card style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <p style={{ margin:0, fontSize:T.small, color:C.text2, lineHeight:1.6 }}>
              Les sons de guitare sont téléchargés à la première écoute. Tu peux
              les enregistrer maintenant pour qu'ils fonctionnent sans connexion
              — compte quelques mégaoctets, à faire de préférence en Wi-Fi.
            </p>
            <Button variant="secondary" full icon="download" onClick={activerAudioOffline}>
              Rendre l'audio disponible hors-ligne
            </Button>
            {audioOffline && (
              <p role="status" className="gr-in" style={{
                margin:0, fontSize:T.micro, lineHeight:1.5,
                color: audioOffline.ok ? C.greenD : C.dangerInk,
              }}>{audioOffline.msg}</p>
            )}
          </Card>
        </SettingsSection>

        {/* Zone de danger — séparée visuellement du reste : ces actions ne
            doivent pas se trouver à côté d'un réglage anodin. */}
        <Card style={{ border:`2px solid ${C.danger}`, display:"flex", flexDirection:"column", gap:10, marginTop:4 }}>
          <Eyebrow tone="danger" style={{ color:C.dangerInk }}>Zone irréversible</Eyebrow>
          <p style={{ margin:0, fontSize:T.small, color:C.text2, lineHeight:1.6 }}>
            La suppression de compte efface définitivement ton email, ta
            progression et ton historique de nos serveurs. Aucune sauvegarde
            n'est conservée. Pense à exporter ta progression avant, si tu veux
            en garder une copie.
          </p>
          <Button tone="danger" full icon="trash" onClick={() => setConfirmation("deleteAccount")}>
            Supprimer mon compte et mes données
          </Button>
        </Card>

        {/* Mentions légales */}
        <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
          <a href="/cgu.html" style={{ fontSize:T.micro, color:C.text2 }}>Conditions d'utilisation</a>
          <a href="/confidentialite.html" style={{ fontSize:T.micro, color:C.text2 }}>Confidentialité</a>
        </div>
      </div>

      {/* Retour d'une action (export, réinitialisation, suppression). Hors de
          la cascade : il apparaît après coup, en ressort. */}
      <div style={{ padding:"12px 16px 28px" }}>
        {importStatus && (
          <div className="gr-in-pop" style={{
            background: importStatus.ok ? C.greenL : C.dangerL,
            border:`2px solid ${importStatus.ok ? C.greenBorder : C.dangerBorder}`,
            borderRadius:R.md, padding:"11px 14px",
            display:"flex", gap:8, alignItems:"flex-start",
          }} role="status">
            <Ti name={importStatus.ok?"check":"alert-circle"} size={16} color={importStatus.ok?C.greenD:C.dangerInk} style={{ marginTop:2 }} />
            <p style={{ margin:0, fontSize:T.small, color:importStatus.ok?C.greenD:C.text, lineHeight:1.5 }}>{importStatus.msg}</p>
          </div>
        )}
      </div>

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

export { SettingsScreen };
