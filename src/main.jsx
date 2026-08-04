// Groply — main.jsx
// Racine React + filet de sécurité global (Error Boundary).
// NOTE : le service worker est enregistré dans index.html (avec gestion des
// mises à jour). L'ancien double enregistrement ici a été supprimé.

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// ── Error Boundary ─────────────────────────────────────────────────────────
// Sans lui, la moindre erreur dans un écran = page blanche sans explication.
// Ici : message clair + recharger. La progression est intacte (localStorage).
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    console.error('Groply — erreur non interceptée :', error, info?.componentStack);
  }
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 14,
        background: '#FFF7F0', color: '#18130F', padding: 24, textAlign: 'center',
        fontFamily: '"Poppins", -apple-system, sans-serif',
      }}>
        <img src="/mascotte-think.svg" alt="" width="76" style={{ display: 'block', height: 'auto' }} />
        <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-.2px' }}>
          Oups, une fausse note.
        </div>
        <div style={{ fontSize: 13, color: '#7A736A', maxWidth: 300, lineHeight: 1.5 }}>
          Une erreur inattendue s'est produite. Ta progression est sauvegardée,
          recharge l'app pour reprendre.
        </div>
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: 6, background: '#E85D1A', color: '#fff', border: 'none',
            borderRadius: 12, padding: '12px 24px', fontSize: 14, fontWeight: 700,
            cursor: 'pointer', fontFamily: 'inherit',
          }}>
          Recharger Groply
        </button>
        <details style={{ marginTop: 10, fontSize: 11, color: '#A09890', maxWidth: 320 }}>
          <summary style={{ cursor: 'pointer' }}>Détails techniques</summary>
          <pre style={{ whiteSpace: 'pre-wrap', textAlign: 'left', fontSize: 10 }}>
            {String(this.state.error?.message || this.state.error)}
          </pre>
        </details>
      </div>
    );
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
