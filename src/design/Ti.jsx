// GuitarPath — design/Ti.jsx
// Composant icône Tabler Icons (chargé via CDN dans index.html)
export function Ti({ name, size = 16, color = "currentColor", style }) {
  return <i className={`ti ti-${name}`} style={{ fontSize: size, color, lineHeight: 1, ...style }} />;
}
