import { useState } from 'react';
import { useC } from '../design/ThemeContext.jsx';
import { Ti } from '../design/Ti.jsx';

// ── Ce qui change (audit §1.2, §1.3, §1.5, §6.2, §8.2) ────────────────────
// • Parcours « mot de passe oublié » + définition du nouveau mot de passe,
//   + renvoi de l'email de confirmation. Sans ça, perdre son mot de passe
//   revenait à perdre son compte et sa progression.
// • Les erreurs Supabase sont traduites (fait dans useAuth).
// • `outline: none` sans remplacement est supprimé : le focus est visible
//   (classe .gr-focus définie dans index.css).
// • Longueur minimale portée à 8 caractères, avec un indicateur de robustesse.
// • Vrai <form> : les gestionnaires de mots de passe et le bouton « Aller »
//   du clavier mobile fonctionnent correctement.
// • Liens vers les CGU et la politique de confidentialité — un produit
//   européen qui collecte un email doit informer avant de collecter.

const FONTS = '"Poppins", -apple-system, sans-serif';
const BRAND_FONT = '"Nunito", "Poppins", sans-serif';

const MIN_PWD = 8;

const srOnly = {
  position: 'absolute', width: 1, height: 1, padding: 0, margin: -1,
  overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0,
};

/** Robustesse indicative — informe, ne bloque pas au-delà du minimum. */
function forcePwd(pwd) {
  let n = 0;
  if (pwd.length >= MIN_PWD) n++;
  if (pwd.length >= 12) n++;
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) n++;
  if (/\d/.test(pwd)) n++;
  if (/[^\w\s]/.test(pwd)) n++;
  return Math.min(4, n);
}

export function AuthScreen({
  onSignIn, onSignUp, onResetPassword, onUpdatePassword, onResendConfirmation,
  recovery = false,
}) {
  const C = useC();
  const [mode, setMode]         = useState(recovery ? 'newPassword' : 'login');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [success, setSuccess]   = useState(null);
  const [showPwd, setShowPwd]   = useState(false);

  const isRecovery = recovery || mode === 'newPassword';
  const needsPwd   = mode !== 'forgot';
  const force      = forcePwd(password);

  const clear = () => { setError(null); setSuccess(null); };

  const submit = async (e) => {
    e?.preventDefault?.();
    clear();

    if (needsPwd && !password)            return setError('Renseigne ton mot de passe.');
    if (!isRecovery && !email.trim())     return setError('Renseigne ton adresse email.');
    if (needsPwd && password.length < MIN_PWD)
      return setError(`Mot de passe : ${MIN_PWD} caractères minimum.`);

    setLoading(true);
    try {
      if (mode === 'login') {
        await onSignIn(email, password);
      } else if (mode === 'signup') {
        await onSignUp(email, password);
        setSuccess('Compte créé. Ouvre l\'email de confirmation, puis connecte-toi.');
        setMode('login');
        setPassword('');
      } else if (mode === 'forgot') {
        await onResetPassword?.(email);
        setSuccess('Si un compte existe pour cet email, tu vas recevoir un lien de réinitialisation.');
      } else if (mode === 'newPassword') {
        await onUpdatePassword?.(password);
        setSuccess('Mot de passe mis à jour. Te voilà connecté.');
      }
    } catch (err) {
      setError(err?.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    clear();
    if (!email.trim()) return setError('Renseigne d\'abord ton adresse email.');
    setLoading(true);
    try {
      await onResendConfirmation?.(email);
      setSuccess('Email de confirmation renvoyé.');
    } catch (err) {
      setError(err?.message || 'Une erreur est survenue.');
    } finally { setLoading(false); }
  };

  const champ = {
    padding: '13px 14px', borderRadius: 12,
    border: `1.5px solid ${C.border}`,
    fontSize: 16,                       // 16px : évite le zoom automatique iOS
    background: C.surface, color: C.text,
    fontFamily: FONTS, fontWeight: 500, width: '100%', boxSizing: 'border-box',
  };

  const titre =
    mode === 'forgot'      ? 'Mot de passe oublié' :
    mode === 'newPassword' ? 'Nouveau mot de passe' : null;

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: C.bg, padding: '1.5rem',
      fontFamily: FONTS,
    }}>
      <div style={{
        width: '100%', maxWidth: 380,
        background: C.surface, borderRadius: 22,
        border: `1.5px solid ${C.border}`,
        padding: '26px 22px',
        boxShadow: '0 10px 40px rgba(0,0,0,.06)',
      }}>
        <div style={{
          fontFamily: BRAND_FONT, fontSize: 30, fontWeight: 800,
          color: C.primary, letterSpacing: '-.5px', textAlign: 'center', marginBottom: 4,
        }}>Groply</div>
        <p style={{ textAlign: 'center', fontSize: 13, color: C.text2, margin: '0 0 20px' }}>
          {titre || 'Progresser à la guitare, vraiment.'}
        </p>

        {/* Bascule connexion / inscription — masquée dans les parcours de
            récupération, où il n'y a qu'une seule action possible. */}
        {!isRecovery && mode !== 'forgot' && (
          <div role="tablist" aria-label="Connexion ou inscription" style={{
            display: 'flex', gap: 6, padding: 4, marginBottom: 16,
            background: C.surface2, borderRadius: 14,
          }}>
            {[{ id: 'login', label: 'Connexion' }, { id: 'signup', label: 'Inscription' }].map(({ id, label }) => (
              <button
                key={id} type="button" role="tab"
                aria-selected={mode === id}
                onClick={() => { setMode(id); clear(); }}
                className="gr-focus"
                style={{
                  flex: 1, padding: '11px 9px', borderRadius: 10, border: 'none',
                  background: mode === id ? C.primary : 'transparent',
                  color: mode === id ? '#fff' : C.text2,
                  fontWeight: 700, fontSize: 13, minHeight: 44,
                  cursor: 'pointer', fontFamily: FONTS,
                }}>
                {label}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={submit} noValidate>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: '1rem' }}>
            {!isRecovery && (
              <>
                <label htmlFor="auth-email" style={srOnly}>Adresse email</label>
                <input
                  id="auth-email" name="email" type="email" inputMode="email"
                  placeholder="Email" value={email}
                  autoComplete="email" autoCapitalize="none" spellCheck="false"
                  onChange={e => setEmail(e.target.value)}
                  className="gr-focus" style={champ}
                />
              </>
            )}

            {needsPwd && (
              <div style={{ position: 'relative' }}>
                <label htmlFor="auth-password" style={srOnly}>
                  Mot de passe ({MIN_PWD} caractères minimum)
                </label>
                <input
                  id="auth-password" name="password"
                  type={showPwd ? 'text' : 'password'}
                  placeholder={`Mot de passe (${MIN_PWD}+ caractères)`}
                  value={password}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  onChange={e => setPassword(e.target.value)}
                  className="gr-focus"
                  style={{ ...champ, padding: '13px 48px 13px 14px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(v => !v)}
                  aria-label={showPwd ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  className="gr-focus"
                  style={{
                    position: 'absolute', right: 4, top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    width: 44, height: 44, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    color: C.text2, borderRadius: 10,
                  }}
                >
                  <Ti name={showPwd ? 'eye-off' : 'eye'} size={18} />
                </button>
              </div>
            )}

            {/* Robustesse : informe sans bloquer */}
            {needsPwd && mode !== 'login' && password.length > 0 && (
              <div aria-live="polite">
                <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                  {[0, 1, 2, 3].map(i => (
                    <div key={i} style={{
                      flex: 1, height: 4, borderRadius: 99,
                      background: i < force
                        ? (force <= 1 ? C.danger : force === 2 ? C.amber : C.green)
                        : C.border,
                    }} />
                  ))}
                </div>
                <div style={{ fontSize: 11, color: C.text2 }}>
                  {force <= 1 ? 'Mot de passe faible' : force === 2 ? 'Correct' : force === 3 ? 'Bon' : 'Excellent'}
                </div>
              </div>
            )}
          </div>

          {error && (
            <div role="alert" style={{
              background: C.dangerL, border: `1.5px solid ${C.danger}`,
              borderRadius: 12, padding: '10px 13px', marginBottom: '1rem',
              fontSize: 13, color: C.text, fontWeight: 500,
              display: 'flex', gap: 7, alignItems: 'flex-start',
            }}>
              <Ti name="alert-circle" size={15} color={C.danger} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div role="status" style={{
              background: C.greenL, border: `1.5px solid ${C.greenBorder}`,
              borderRadius: 12, padding: '10px 13px', marginBottom: '1rem',
              fontSize: 13, color: C.greenD, fontWeight: 500,
              display: 'flex', gap: 7, alignItems: 'flex-start',
            }}>
              <Ti name="check" size={15} color={C.greenD} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>{success}</span>
            </div>
          )}

          <button type="submit" disabled={loading} className="gr-focus" style={{
            width: '100%', padding: '15px', borderRadius: 14, border: 'none',
            background: loading ? C.surface2 : C.primary,
            color: loading ? C.text2 : '#fff',
            fontSize: 15, fontWeight: 700, minHeight: 48,
            cursor: loading ? 'default' : 'pointer',
            fontFamily: FONTS, letterSpacing: '-.1px',
          }}>
            {loading ? 'Un instant…'
              : mode === 'login'  ? 'Se connecter'
              : mode === 'signup' ? 'Créer mon compte'
              : mode === 'forgot' ? 'Envoyer le lien'
              : 'Enregistrer le mot de passe'}
          </button>
        </form>

        {/* Liens secondaires */}
        <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {mode === 'login' && (
            <>
              <button type="button" onClick={() => { setMode('forgot'); clear(); }}
                className="gr-focus" style={lien(C)}>
                Mot de passe oublié ?
              </button>
              <button type="button" onClick={resend} className="gr-focus" style={lien(C)}>
                Renvoyer l'email de confirmation
              </button>
            </>
          )}
          {(mode === 'forgot' || mode === 'newPassword') && (
            <button type="button" onClick={() => { setMode('login'); clear(); }}
              className="gr-focus" style={lien(C)}>
              Retour à la connexion
            </button>
          )}
        </div>
      </div>

      {/* Mentions légales — obligatoires avant toute collecte d'email (RGPD) */}
      <p style={{ marginTop: 18, fontSize: 11, color: C.text2, fontFamily: FONTS, textAlign: 'center', maxWidth: 340, lineHeight: 1.6 }}>
        En créant un compte, tu acceptes les{' '}
        <a href="/cgu.html" style={{ color: C.primary }}>conditions d'utilisation</a> et la{' '}
        <a href="/confidentialite.html" style={{ color: C.primary }}>politique de confidentialité</a>.
        <br />Groply conserve ton email et ta progression, rien d'autre.
      </p>
    </div>
  );
}

const lien = (C) => ({
  background: 'none', border: 'none', cursor: 'pointer',
  color: C.text2, fontSize: 12.5, fontFamily: FONTS,
  textDecoration: 'underline', padding: '11px 4px', minHeight: 44,
  textAlign: 'center', width: '100%',
});
