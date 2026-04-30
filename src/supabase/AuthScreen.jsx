import { useState } from 'react';

const C = {
  primary: '#7F77DD', primaryL: '#EEEDFE', primaryD: '#3C3489',
  text: '#1F1B2E', muted: '#6B6880', bg: '#FFFFFF',
  bgSec: '#F5F4FA', border: '#E5E3F0',
  green: '#1D9E75', greenL: '#E1F5EE', greenD: '#085041',
  coral: '#D85A30', coralL: '#FAECE7', coralD: '#712B13',
};

export function AuthScreen({ onSignIn, onSignUp }) {
  const [mode, setMode]         = useState('login'); // 'login' | 'signup'
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [success, setSuccess]   = useState(null);

  const handle = async () => {
    setError(null);
    setSuccess(null);
    if (!email || !password) { setError('Remplis tous les champs.'); return; }
    if (password.length < 6)  { setError('Mot de passe : 6 caractères minimum.'); return; }

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
      if (msg.includes('Invalid login'))      setError('Email ou mot de passe incorrect.');
      else if (msg.includes('already registered')) setError('Cet email est déjà utilisé.');
      else setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: C.bgSec, padding: '1.5rem',
    }}>
      <div style={{
        width: '100%', maxWidth: 380, background: C.bg,
        borderRadius: 20, padding: '2rem 1.5rem',
        boxShadow: '0 4px 24px rgba(127,119,221,0.10)',
        border: `1px solid ${C.border}`,
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <img src="/logo.svg" alt="GuitarPath" style={{ width: 80, height: 80, marginBottom: 8 }} />
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: C.primaryD }}>GuitarPath</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: C.muted }}>
            {mode === 'login' ? 'Connecte-toi pour continuer' : 'Crée ton compte gratuit'}
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', background: C.bgSec, borderRadius: 12, padding: 4, marginBottom: '1.25rem' }}>
          {[['login', 'Connexion'], ['signup', 'Inscription']].map(([id, label]) => (
            <button key={id} onClick={() => { setMode(id); setError(null); setSuccess(null); }}
              style={{
                flex: 1, padding: '9px', borderRadius: 9, border: 'none',
                background: mode === id ? C.bg : 'transparent',
                color: mode === id ? C.primaryD : C.muted,
                fontWeight: mode === id ? 700 : 500, fontSize: 14, cursor: 'pointer',
                boxShadow: mode === id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.2s',
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
              padding: '13px 14px', borderRadius: 11, border: `1px solid ${C.border}`,
              fontSize: 15, outline: 'none', background: C.bg, color: C.text,
            }}
          />
          <input
            type="password" placeholder="Mot de passe (6+ caractères)" value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handle()}
            style={{
              padding: '13px 14px', borderRadius: 11, border: `1px solid ${C.border}`,
              fontSize: 15, outline: 'none', background: C.bg, color: C.text,
            }}
          />
        </div>

        {/* Messages */}
        {error && (
          <div style={{ background: C.coralL, borderRadius: 10, padding: '10px 13px', marginBottom: '1rem', fontSize: 13, color: C.coralD }}>
            ⚠ {error}
          </div>
        )}
        {success && (
          <div style={{ background: C.greenL, borderRadius: 10, padding: '10px 13px', marginBottom: '1rem', fontSize: 13, color: C.greenD }}>
            ✓ {success}
          </div>
        )}

        {/* Bouton */}
        <button onClick={handle} disabled={loading} style={{
          width: '100%', padding: '15px', borderRadius: 13, border: 'none',
          background: loading ? C.primaryL : C.primary, color: loading ? C.primaryD : '#fff',
          fontSize: 16, fontWeight: 700, cursor: loading ? 'default' : 'pointer',
          transition: 'all 0.2s',
        }}>
          {loading ? '...' : mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
        </button>
      </div>
    </div>
  );
}
