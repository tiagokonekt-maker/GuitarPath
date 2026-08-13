import { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabaseClient';

// ── Ce qui change ─────────────────────────────────────────────────────────
// • `resetPassword` + `updatePassword` : un utilisateur qui perd son mot de
//   passe perdait son compte ET sa progression cloud, sans aucun recours
//   dans l'app (audit §1.2).
// • `resendConfirmation` : le cas d'erreur le plus fréquent après une
//   inscription était « Email not confirmed », sans moyen de s'en sortir.
// • Les erreurs Supabase sont traduites en français (audit §1.3).

/**
 * Traduction des messages d'erreur Supabase.
 * Avant, seuls deux cas étaient couverts et tout le reste s'affichait en
 * anglais brut dans une interface française.
 */
export function traduireErreurAuth(message = '') {
  const m = String(message);
  const table = [
    [/invalid login credentials|invalid email or password/i, 'Email ou mot de passe incorrect.'],
    [/email not confirmed|not confirmed/i,                   'Ton email n\'est pas encore confirmé. Vérifie ta boîte de réception (et les spams).'],
    [/already registered|already exists|user already/i,      'Un compte existe déjà avec cet email.'],
    [/password should be at least/i,                         'Mot de passe trop court : 8 caractères minimum.'],
    [/weak password|password is too weak/i,                  'Mot de passe trop faible. Ajoute des chiffres ou des majuscules.'],
    [/unable to validate email|invalid email/i,              'Cette adresse email n\'est pas valide.'],
    [/email rate limit exceeded|over_email_send_rate/i,      'Trop d\'emails envoyés. Réessaie dans quelques minutes.'],
    [/for security purposes.*after (\d+) seconds?/i,         'Trop de tentatives. Patiente quelques secondes avant de réessayer.'],
    [/too many requests|rate limit/i,                        'Trop de tentatives. Réessaie dans un instant.'],
    [/network|fetch failed|failed to fetch/i,                'Pas de connexion. Vérifie ton réseau et réessaie.'],
    [/captcha/i,                                             'Vérification anti-robot échouée. Recharge la page.'],
    [/same password/i,                                       'Le nouveau mot de passe doit être différent de l\'ancien.'],
    [/token has expired|invalid token|expired/i,             'Ce lien a expiré. Demande-en un nouveau.'],
  ];
  for (const [re, fr] of table) if (re.test(m)) return fr;
  return 'Une erreur est survenue. Réessaie dans un instant.';
}

export function useAuth() {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  // Vrai quand l'utilisateur arrive par un lien de réinitialisation : il faut
  // alors lui présenter le formulaire de nouveau mot de passe.
  const [recovery, setRecovery] = useState(false);

  useEffect(() => {
    let cancelled = false;

    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        if (cancelled) return;
        setUser(session?.user ?? null);
        setLoading(false);
      })
      .catch(() => {
        // Coupure réseau au démarrage : on ne bloque pas indéfiniment sur le
        // spinner, on renvoie vers l'écran de connexion.
        if (cancelled) return;
        setUser(null);
        setLoading(false);
      });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (event === 'PASSWORD_RECOVERY') setRecovery(true);
      if (event === 'SIGNED_OUT') setRecovery(false);
    });

    return () => { cancelled = true; subscription.unsubscribe(); };
  }, []);

  const signUp = useCallback(async (email, password) => {
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { emailRedirectTo: `${window.location.origin}/` },
    });
    if (error) throw new Error(traduireErreurAuth(error.message));
  }, []);

  const signIn = useCallback(async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) throw new Error(traduireErreurAuth(error.message));
  }, []);

  const signOut = useCallback(async () => {
    try { await supabase.auth.signOut(); } catch { /* on considère l'utilisateur déconnecté */ }
  }, []);

  /** Envoie le lien de réinitialisation. */
  const resetPassword = useCallback(async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/`,
    });
    if (error) throw new Error(traduireErreurAuth(error.message));
  }, []);

  /** Définit le nouveau mot de passe (après arrivée par le lien). */
  const updatePassword = useCallback(async (password) => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw new Error(traduireErreurAuth(error.message));
    setRecovery(false);
  }, []);

  /** Renvoie l'email de confirmation d'inscription. */
  const resendConfirmation = useCallback(async (email) => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/` },
    });
    if (error) throw new Error(traduireErreurAuth(error.message));
  }, []);

  return {
    user, loading, recovery,
    signUp, signIn, signOut,
    resetPassword, updatePassword, resendConfirmation,
  };
}
