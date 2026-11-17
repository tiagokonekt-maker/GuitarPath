import { useState } from 'react';
import { useC } from '../design/ThemeContext.jsx';
import { FONTS, R, T } from '../design/tokens.js';
import { Ti } from '../design/Ti.jsx';
import { Gropi } from '../design/Gropi.jsx';
import { Button, Card, Gauge, IconButton, Segmented } from '../design/ui.jsx';

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

const BRAND_FONT = '"Nunito", "Poppins", sans-serif';

const MIN_PWD = 8;

const MODES = [
  { value: 'login',  label: 'Connexion' },
  { value: 'signup', label: 'Inscription' },
];

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
  recovery = false, initialError = null,
}) {
  const C = useC();
  const [mode, setMode]         = useState(recovery ? 'newPassword' : 'login');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(initialError);
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
    padding: '13px 14px', borderRadius: R.md,
    border: `2px solid ${C.borderStrong}`,
    fontSize: 16,                       // 16px : évite le zoom automatique iOS
    background: C.surface, color: C.text,
    fontFamily: FONTS.ui, fontWeight: 500, width: '100%', boxSizing: 'border-box',
  };

  // Encart de retour (erreur ou succès) : même forme, teinte différente.
  const encart = (fond, bord, texte) => ({
    background: fond, border: `2px solid ${bord}`,
    borderRadius: R.md, padding: '10px 13px', marginBottom: 16,
    fontSize: T.small, color: texte, fontWeight: 600, lineHeight: 1.45,
    display: 'flex', gap: 8, alignItems: 'flex-start',
  });

  const titre =
    mode === 'forgot'      ? 'Mot de passe oublié' :
    mode === 'newPassword' ? 'Nouveau mot de passe' : null;

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: C.bg, padding: '24px 16px',
      fontFamily: FONTS.ui,
    }}>
      {/* Gropi salue, posé sur le bord de la carte. */}
      <Gropi pose="wave" anim="wiggle" size={104} style={{ marginBottom: -6, position: 'relative', zIndex: 1 }} />

      <Card className="gr-in-pop" pad="24px 20px" style={{ width: '100%', maxWidth: 380, boxSizing: 'border-box', borderRadius: R.xl }}>
        <div style={{
          fontFamily: BRAND_FONT, fontSize: 30, fontWeight: 800,
          color: C.primary, letterSpacing: '-.5px', textAlign: 'center', marginBottom: 4,
        }}>Groply</div>
        <p style={{ textAlign: 'center', fontSize: T.small, color: C.text2, margin: '0 0 20px' }}>
          {titre || 'Progresser à la guitare, vraiment.'}
        </p>

        {/* Bascule connexion / inscription — masquée dans les parcours de
            récupération, où il n'y a qu'une seule action possible. */}
        {!isRecovery && mode !== 'forgot' && (
          <Segmented
            label="Connexion ou inscription" options={MODES} value={mode}
            onChange={(id) => { setMode(id); clear(); }}
            style={{ marginBottom: 16 }}
          />
        )}

        <form onSubmit={submit} noValidate>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
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
                  style={{ ...champ, padding: '13px 52px 13px 14px' }}
                />
                <IconButton
                  variant="ghost" icon={showPwd ? 'eye-off' : 'eye'} iconSize={19}
                  label={showPwd ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  onClick={() => setShowPwd(v => !v)}
                  style={{ position: 'absolute', right: 5, top: 0, bottom: 0, margin: 'auto 0' }}
                />
              </div>
            )}

            {/* Robustesse : informe sans bloquer */}
            {needsPwd && mode !== 'login' && password.length > 0 && (
              <div aria-live="polite">
                <div aria-hidden="true" style={{ marginBottom: 5 }}>
                  <Gauge value={force} max={4}
                    color={force <= 1 ? C.danger : force === 2 ? C.amber : C.green} />
                </div>
                <div style={{ fontSize: T.micro, fontWeight: 600, color: C.text2 }}>
                  {force <= 1 ? 'Mot de passe faible' : force === 2 ? 'Correct' : force === 3 ? 'Bon' : 'Excellent'}
                </div>
              </div>
            )}
          </div>

          {error && (
            <div role="alert" className="gr-shake" style={encart(C.dangerL, C.dangerBorder, C.dangerD)}>
              <Ti name="alert-circle" size={17} color={C.danger} style={{ marginTop: 1 }} />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div role="status" className="gr-in-pop" style={encart(C.greenL, C.greenBorder, C.greenD)}>
              <Ti name="check" size={17} color={C.green} style={{ marginTop: 1 }} />
              <span>{success}</span>
            </div>
          )}

          <Button type="submit" size="lg" full loading={loading}>
            {loading ? 'Un instant…'
              : mode === 'login'  ? 'Se connecter'
              : mode === 'signup' ? 'Créer mon compte'
              : mode === 'forgot' ? 'Envoyer le lien'
              : 'Enregistrer le mot de passe'}
          </Button>
        </form>

        {/* Liens secondaires */}
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {mode === 'login' && (
            <>
              <Button variant="ghost" size="sm" full style={{ minHeight: 44 }}
                onClick={() => { setMode('forgot'); clear(); }}>
                Mot de passe oublié ?
              </Button>
              <Button variant="ghost" size="sm" full style={{ minHeight: 44 }} onClick={resend}>
                Renvoyer l'email de confirmation
              </Button>
            </>
          )}
          {(mode === 'forgot' || mode === 'newPassword') && (
            <Button variant="ghost" size="sm" full style={{ minHeight: 44 }}
              onClick={() => { setMode('login'); clear(); }}>
              Retour à la connexion
            </Button>
          )}
        </div>
      </Card>

      {/* Mentions légales — obligatoires avant toute collecte d'email (RGPD) */}
      <p className="gr-in-fade" style={{ marginTop: 18, marginBottom: 0, fontSize: T.micro, color: C.text2, textAlign: 'center', maxWidth: 340, lineHeight: 1.6 }}>
        En créant un compte, tu acceptes les{' '}
        <a href="/cgu.html" style={{ color: C.primaryInk }}>conditions d'utilisation</a> et la{' '}
        <a href="/confidentialite.html" style={{ color: C.primaryInk }}>politique de confidentialité</a>.
        <br />Groply conserve ton email et ta progression, rien d'autre.
      </p>
    </div>
  );
}
