import { useState } from 'react';

const C = {
  primary:       '#E85D1A',
  primaryL:      '#FFF0E8',
  primaryD:      '#B84010',
  primaryBorder: '#F5C4A8',
  text:          '#18130F',
  text2:         '#7A736A',
  text3:         '#A09890',
  bg:            '#FFFFFF',
  bgSec:         '#FAF8F5',
  border:        '#EDE9E3',
  green:         '#1A8C52',
  greenL:        '#DCF5E8',
  greenBorder:   '#A8DEC0',
  greenD:        '#0C3D22',
  coral:         '#C4306A',
  coralL:        '#FCE8F0',
  coralBorder:   '#F0B0CC',
  coralD:        '#6B0830',
};

const FONTS = '"Poppins", -apple-system, sans-serif';
const BRAND_FONT = '"Nunito", "Poppins", sans-serif';

export function AuthScreen({ onSignIn, onSignUp }) {
  const [mode, setMode]         = useState('login');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [success, setSuccess]   = useState(null);

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
      background: C.bgSec, padding: '1.5rem',
      fontFamily: FONTS,
    }}>
      {/* Card */}
      <div style={{
        width: '100%', maxWidth: 380,
        background: C.bg, borderRadius: 24,
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
          display: 'flex', background: C.bgSec,
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
          <input
            type="email" placeholder="Email" value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handle()}
            style={{
              padding: '13px 14px', borderRadius: 12,
              border: `1.5px solid ${C.border}`,
              fontSize: 14, outline: 'none',
              background: C.bg, color: C.text,
              fontFamily: FONTS, fontWeight: 500,
            }}
          />
          <input
            type="password" placeholder="Mot de passe (6+ caractères)" value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handle()}
            style={{
              padding: '13px 14px', borderRadius: 12,
              border: `1.5px solid ${C.border}`,
              fontSize: 14, outline: 'none',
              background: C.bg, color: C.text,
              fontFamily: FONTS, fontWeight: 500,
            }}
          />
        </div>

        {/* Messages */}
        {error && (
          <div style={{
            background: C.coralL, border: `1.5px solid ${C.coralBorder}`,
            borderRadius: 12, padding: '10px 13px', marginBottom: '1rem',
            fontSize: 13, color: C.coralD, fontWeight: 500,
            display: 'flex', gap: 7, alignItems: 'flex-start',
          }}>
            <span>⚠</span> {error}
          </div>
        )}
        {success && (
          <div style={{
            background: C.greenL, border: `1.5px solid ${C.greenBorder}`,
            borderRadius: 12, padding: '10px 13px', marginBottom: '1rem',
            fontSize: 13, color: C.greenD, fontWeight: 500,
            display: 'flex', gap: 7, alignItems: 'flex-start',
          }}>
            <span>✓</span> {success}
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
