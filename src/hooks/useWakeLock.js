// Groply — hooks/useWakeLock.js
//
// ── Le problème ───────────────────────────────────────────────────────────
// Par défaut, le téléphone éteint l'écran après un délai d'inactivité
// TACTILE — c'est un comportement de l'OS, entièrement indépendant de
// l'app. Faire défiler une leçon remet ce compteur à zéro, mais la lire
// sans toucher l'écran (la guitare dans les mains, exactement le cas
// d'usage visé) ne le fait pas : l'écran s'éteint pendant qu'on lit.
//
// ── La solution : Screen Wake Lock API ──────────────────────────────────
// Standardisée et supportée par Chrome, Safari (16.4+) et Firefox. L'exemple
// que les navigateurs donnent eux-mêmes pour la justifier est presque
// exactement notre cas : un site de recette qui garde l'écran allumé pour
// qu'on n'ait pas à s'inquiéter qu'il s'éteigne pendant qu'on a les mains
// pleines de pâte. Ici, les mains sont sur la guitare.
//
// ── Ce que ce hook gère, et pourquoi c'est nécessaire ───────────────────
// Le navigateur RELÂCHE le verrou tout seul dans plusieurs cas — onglet
// caché, batterie faible, règles d'économie d'énergie du système — et
// l'app n'a pas la main dessus. Sans réagir à ce relâchement, un simple
// changement d'onglet puis retour laisserait l'écran de nouveau libre de
// s'éteindre, silencieusement. Ce hook écoute l'événement `release` du
// verrou lui-même pour le redemander automatiquement dès que l'onglet
// redevient visible.
//
// Aucun blocage si l'API n'existe pas (navigateur trop ancien, contexte non
// sécurisé) : c'est une amélioration progressive, jamais un prérequis.
import { useEffect, useRef } from "react";

/**
 * Empêche l'écran de s'éteindre tant que `actif` est vrai.
 * @param {boolean} actif
 */
export function useWakeLock(actif) {
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (!actif) return;
    if (typeof navigator === "undefined" || !("wakeLock" in navigator)) return;

    let annule = false;

    const demander = async () => {
      try {
        const sentinel = await navigator.wakeLock.request("screen");
        // Le composant a pu être démonté (ou `actif` passer à false) pendant
        // que la promesse était en attente : dans ce cas, on relâche
        // immédiatement plutôt que de garder un verrou orphelin.
        if (annule) { sentinel.release().catch(() => {}); return; }

        sentinelRef.current = sentinel;

        // Le navigateur peut relâcher le verrou de lui-même à tout moment
        // (onglet caché, batterie faible...). Sans ce listener, la
        // référence resterait sur un objet "released" mais toujours
        // truthy — et le test `!sentinelRef.current` plus bas ne
        // détecterait jamais qu'il faut redemander.
        sentinel.addEventListener("release", () => {
          if (sentinelRef.current === sentinel) sentinelRef.current = null;
        });
      } catch {
        // Refus possible (préférence utilisateur, contrainte système...) —
        // on n'insiste pas : la lecture reste utilisable sans, exactement
        // comme avant ce hook.
      }
    };

    demander();

    // Au retour au premier plan, si on n'a plus de verrou actif (relâché
    // pendant la mise en arrière-plan), on le redemande.
    const surVisibilite = () => {
      if (document.visibilityState === "visible" && !sentinelRef.current) demander();
    };
    document.addEventListener("visibilitychange", surVisibilite);

    return () => {
      annule = true;
      document.removeEventListener("visibilitychange", surVisibilite);
      if (sentinelRef.current) {
        sentinelRef.current.release().catch(() => {});
        sentinelRef.current = null;
      }
    };
  }, [actif]);
}
