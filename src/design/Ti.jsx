// Groply — design/Ti.jsx
// Composant icône Tabler Icons.
//
// La feuille de style est chargée par un <link> dans index.html (et non plus
// par un @import dans un <style> injecté par React, qui partait après le
// montage). Elle est aussi mise en cache par le service worker, pour que les
// icônes survivent au mode hors-ligne.
//
// À terme : remplacer cette webfont par des SVG inline pour les ~30 icônes
// réellement utilisées (voir CHANGELOG §3.2). Aujourd'hui, toute
// l'iconographie de l'app dépend d'un CDN tiers — une icône absente n'est pas
// un défaut de style, c'est un bouton vide.
export function Ti({ name, size = 16, color = "currentColor", style, label }) {
  return (
    <i
      className={`ti ti-${name}`}
      // Une icône décorative doit être ignorée par les lecteurs d'écran ;
      // une icône porteuse de sens (seule dans un bouton) doit être nommée.
      aria-hidden={label ? undefined : "true"}
      role={label ? "img" : undefined}
      aria-label={label || undefined}
      style={{ fontSize: size, color, lineHeight: 1, flexShrink: 0, ...style }}
    />
  );
}
