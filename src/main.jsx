// Groply — main.jsx
// Racine React + filet de sécurité global.
//
// Le service worker n'est plus enregistré ici NI dans index.html : c'est
// App.jsx qui s'en charge, parce que lui seul peut afficher le bandeau
// « une nouvelle version est prête ». L'ancienne version l'activait de force
// et rechargeait la page — sous les doigts de quelqu'un au milieu d'un
// exercice, ce n'est pas acceptable.
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// ── Error Boundary ─────────────────────────────────────────────────────────
// Sans lui, la moindre erreur dans un écran donne une page blanche sans
// explication. Ici : message clair, et la progression reste intacte
// (localStorage est écrit à chaque action).
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
    // Écran de secours volontairement autonome : ni thème, ni webfont, ni
    // composant de l'app. Si le crash vient du design system, un écran
    // d'erreur qui en dépend crashe aussi.
    return (
      <div style={{
        minHeight: '100dvh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 14,
        background: '#FFE8CF', color: '#18130F', padding: 24, textAlign: 'center',
        fontFamily: '-apple-system, system-ui, sans-serif',
      }}>
        <img src="/mascotte-think.svg" alt="" width="76" height="88" style={{ display: 'block' }} />
        <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-.2px' }}>
          Oups, une fausse note.
        </div>
        <div style={{ fontSize: 14, color: '#6E6760', maxWidth: 300, lineHeight: 1.6 }}>
          Une erreur inattendue s'est produite. Ta progression est sauvegardée :
          recharge l'app pour reprendre où tu en étais.
        </div>
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: 6, background: '#C64E12', color: '#fff', border: 'none',
            borderRadius: 12, padding: '14px 24px', fontSize: 15, fontWeight: 700,
            cursor: 'pointer', fontFamily: 'inherit', minHeight: 48,
          }}>
          Recharger Groply
        </button>
        <details style={{ marginTop: 10, fontSize: 12, color: '#6B645B', maxWidth: 320 }}>
          <summary style={{ cursor: 'pointer', padding: 8 }}>Détails techniques</summary>
          <pre style={{ whiteSpace: 'pre-wrap', textAlign: 'left', fontSize: 11 }}>
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
