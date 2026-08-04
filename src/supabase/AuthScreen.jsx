import { useState } from 'react';
import { useC } from '../design/ThemeContext.jsx';
import { Ti } from '../design/Ti.jsx';

const FONTS = '"Poppins", -apple-system, sans-serif';
const BRAND_FONT = '"Nunito", "Poppins", sans-serif';

// Style visuellement masqué mais toujours lu par les lecteurs d'écran —
// les placeholder seuls ne suffisent pas comme label (ils disparaissent
// dès la saisie, et certains lecteurs d'écran les ignorent).
const srOnly = {
  position: 'absolute', width: 1, height: 1, padding: 0, margin: -1,
  overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0,
};

export function AuthScreen({ onSignIn, onSignUp }) {
  const C = useC();
  const [mode, setMode]         = useState('login');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [success, setSuccess]   = useState(null);
  const [showPwd, setShowPwd]   = useState(false);

  const handle = async () => {
    setError(null); setSuccess(null);
    if (!email || !password) { setError('Remplis tous les champs.'); return; }
    if (password.length < 6) { setError('Mot de passe : 6 caractères minimum.'); return; }
    setLoading(true);
    try {
      if (mode === 'login') {
        await onSignIn(email, password);
      } else {
        await onSignUp(email, password);
        setSuccess('Compte créé ! Vérifie ton email pour confirmer, puis connecte-toi.');
        setMode('login');
      }
    } catch (e) {
      const msg = e.message || 'Erreur inconnue';
      if (msg.includes('Invalid login'))           setError('Email ou mot de passe incorrect.');
      else if (msg.includes('already registered')) setError('Cet email est déjà utilisé.');
      else setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@800&display=swap');`}</style>
    <div style={{
      minHeight: '100vh',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: C.bg, padding: '1.5rem',
      fontFamily: FONTS,
    }}>
      {/* Card */}
      <div style={{
        width: '100%', maxWidth: 380,
        background: C.surface, borderRadius: 24,
        padding: '2rem 1.75rem',
        boxShadow: '0 8px 40px rgba(232,93,26,0.10)',
        border: `1.5px solid ${C.border}`,
      }}>

        {/* Logo + nom */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          {/* Dégradé hero derrière le logo */}
          <div style={{
            width: 72, height: 72, borderRadius: 20,
            background: 'linear-gradient(135deg, #FF9155, #E85D1A)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 14px',
            boxShadow: '0 4px 20px rgba(232,93,26,0.30)',
          }}>
            <img src="/logo.svg" alt="Groply" style={{ width: 44, height: 44, filter: 'brightness(0) invert(1)' }} />
          </div>
          <h1 style={{
            margin: 0, fontSize: 28, fontWeight: 800,
            color: C.text, letterSpacing: '.5px', fontFamily: BRAND_FONT,
          }}>
            Groply
          </h1>
          <p style={{ margin: '5px 0 0', fontSize: 13, color: C.text3, fontWeight: 500 }}>
            {mode === 'login' ? 'Connecte-toi pour continuer' : 'Crée ton compte gratuit'}
          </p>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', background: C.surface2,
          borderRadius: 14, padding: 4, marginBottom: '1.25rem',
          border: `1.5px solid ${C.border}`,
        }}>
          {[['login', 'Connexion'], ['signup', 'Inscription']].map(([id, label]) => (
            <button key={id}
              onClick={() => { setMode(id); setError(null); setSuccess(null); }}
              style={{
                flex: 1, padding: '9px', borderRadius: 10, border: 'none',
                background: mode === id ? C.primary : 'transparent',
                color: mode === id ? '#fff' : C.text3,
                fontWeight: 700, fontSize: 13,
                cursor: 'pointer', fontFamily: FONTS,
                transition: 'all 0.18s',
              }}>
              {label}
            </button>
          ))}
        </div>

        {/* Champs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: '1rem' }}>
          <label htmlFor="auth-email" style={srOnly}>Adresse email</label>
          <input
            id="auth-email"
            type="email" placeholder="Email" value={email}
            autoComplete="email"
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handle()}
            style={{
              padding: '13px 14px', borderRadius: 12,
              border: `1.5px solid ${C.border}`,
              fontSize: 14, outline: 'none',
              background: C.surface, color: C.text,
              fontFamily: FONTS, fontWeight: 500,
            }}
          />
          {/* Mot de passe + bouton œil */}
          <div style={{ position: 'relative' }}>
            <label htmlFor="auth-password" style={srOnly}>Mot de passe (6 caractères minimum)</label>
            <input
              id="auth-password"
              type={showPwd ? 'text' : 'password'}
              placeholder="Mot de passe (6+ caractères)"
              value={password}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handle()}
              style={{
                width: '100%', boxSizing: 'border-box',
                padding: '13px 44px 13px 14px', borderRadius: 12,
                border: `1.5px solid ${C.border}`,
                fontSize: 14, outline: 'none',
                background: C.surface, color: C.text,
                fontFamily: FONTS, fontWeight: 500,
              }}
            />
            <button
              type="button"
              onClick={() => setShowPwd(v => !v)}
              aria-label={showPwd ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              style={{
                position: 'absolute', right: 12, top: '50%',
                transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer',
                padding: 4, color: C.text3, lineHeight: 0,
              }}
            >
              <Ti name={showPwd ? 'eye-off' : 'eye'} size={18} />
            </button>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div style={{
            background: C.coralL, border: `1.5px solid ${C.coralBorder}`,
            borderRadius: 12, padding: '10px 13px', marginBottom: '1rem',
            fontSize: 13, color: C.coralD, fontWeight: 500,
            display: 'flex', gap: 7, alignItems: 'flex-start',
          }}>
            <Ti name="alert-circle" size={15} color={C.coralD} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div style={{
            background: C.greenL, border: `1.5px solid ${C.greenBorder}`,
            borderRadius: 12, padding: '10px 13px', marginBottom: '1rem',
            fontSize: 13, color: C.greenD, fontWeight: 500,
            display: 'flex', gap: 7, alignItems: 'flex-start',
          }}>
            <Ti name="check" size={15} color={C.greenD} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>{success}</span>
          </div>
        )}

        {/* Bouton CTA */}
        <button onClick={handle} disabled={loading} style={{
          width: '100%', padding: '14px', borderRadius: 14, border: 'none',
          background: loading
            ? C.primaryL
            : 'linear-gradient(135deg, #FF9155, #E85D1A)',
          color: loading ? C.primaryD : '#fff',
          fontSize: 15, fontWeight: 700,
          cursor: loading ? 'default' : 'pointer',
          fontFamily: FONTS, letterSpacing: '-.1px',
          boxShadow: loading ? 'none' : '0 4px 16px rgba(232,93,26,0.30)',
          transition: 'all 0.18s',
        }}>
          {loading ? '…' : mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
        </button>

      </div>

      {/* Baseline discrète */}
      <p style={{ marginTop: 20, fontSize: 12, color: C.text3, fontFamily: FONTS }}>
        Groply · Apprends la guitare, vraiment.
      </p>
    </div>
    </>
  );
}
