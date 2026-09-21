// Groply — design/icons.js
// Tracés des icônes, extraits du paquet officiel @tabler/icons 3.20.0 (MIT,
// © 2020-2024 Paweł Kuna) — uniquement celles que l'application utilise.
//
// ── Pourquoi ce fichier existe ────────────────────────────────────────────
// Toute l'iconographie passait par une webfont chargée depuis un CDN tiers
// (cdn.jsdelivr.net). Une icône absente n'est pas un défaut de style : c'est
// un bouton vide. Et c'est arrivé — boutons ronds sans pictogramme, pastilles
// muettes, barre de navigation illisible.
//
// Les causes possibles étaient nombreuses et toutes hors de notre contrôle :
// CDN injoignable, feuille de style bloquée par la politique de sécurité,
// cache du service worker, réseau d'entreprise filtrant, bloqueur de contenu.
// Plutôt que d'en diagnostiquer une, on supprime la dépendance.
//
// Coût : ~15 ko avant compression, ~5 ko après — bien moins que la webfont
// complète (plus de 100 ko pour 5 800 icônes dont on en utilise 79).
// Gain : les icônes sont disponibles au premier octet, fonctionnent
// hors-ligne, et aucun tiers ne reçoit l'adresse IP de l'utilisateur.
//
// Format : [plein, tracés]. `plein` à 1 signifie que la forme est remplie et
// non tracée au trait — le composant Ti applique alors fill au lieu de stroke.
//
// Pour ajouter une icône : reprendre le contenu de
// node_modules/@tabler/icons/icons/outline/<nom>.svg, sans la balise <svg>
// englobante ni le rectangle transparent de calage.

export const ICONS = {
  "tuning-fork": [0, "<path d=\"M9 3v7a3 3 0 0 0 6 0v-7\" /> <path d=\"M12 13v8\" /> <path d=\"M8 3h2\" /> <path d=\"M14 3h2\" />"],
  "alert-circle": [0, "<path d=\"M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0\" /> <path d=\"M12 8v4\" /> <path d=\"M12 16h.01\" />"],
  "alert-triangle": [0, "<path d=\"M12 9v4\" /> <path d=\"M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0z\" /> <path d=\"M12 16h.01\" />"],
  "arrow-left": [0, "<path d=\"M5 12l14 0\" /> <path d=\"M5 12l6 6\" /> <path d=\"M5 12l6 -6\" />"],
  "arrow-narrow-right": [0, "<path d=\"M5 12l14 0\" /> <path d=\"M15 16l4 -4\" /> <path d=\"M15 8l4 4\" />"],
  "arrow-right": [0, "<path d=\"M5 12l14 0\" /> <path d=\"M13 18l6 -6\" /> <path d=\"M13 6l6 6\" />"],
  "arrows-up-down": [0, "<path d=\"M7 3l0 18\" /> <path d=\"M10 6l-3 -3l-3 3\" /> <path d=\"M20 18l-3 3l-3 -3\" /> <path d=\"M17 21l0 -18\" />"],
  "baby-carriage": [0, "<path d=\"M8 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0\" /> <path d=\"M18 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0\" /> <path d=\"M2 5h2.5l1.632 4.897a6 6 0 0 0 5.693 4.103h2.675a5.5 5.5 0 0 0 0 -11h-.5v6\" /> <path d=\"M6 9h14\" /> <path d=\"M9 17l1 -3\" /> <path d=\"M16 14l1 3\" />"],
  "bolt": [0, "<path d=\"M13 3l0 7l6 0l-8 11l0 -7l-6 0l8 -11\" />"],
  "book-2": [0, "<path d=\"M19 4v16h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12z\" /> <path d=\"M19 16h-12a2 2 0 0 0 -2 2\" /> <path d=\"M9 8h6\" />"],
  "books": [0, "<path d=\"M5 4m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z\" /> <path d=\"M9 4m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z\" /> <path d=\"M5 8h4\" /> <path d=\"M9 16h4\" /> <path d=\"M13.803 4.56l2.184 -.53c.562 -.135 1.133 .19 1.282 .732l3.695 13.418a1.02 1.02 0 0 1 -.634 1.219l-.133 .041l-2.184 .53c-.562 .135 -1.133 -.19 -1.282 -.732l-3.695 -13.418a1.02 1.02 0 0 1 .634 -1.219l.133 -.041z\" /> <path d=\"M14 9l4 -1\" /> <path d=\"M16 16l3.923 -.98\" />"],
  "bulb": [0, "<path d=\"M3 12h1m8 -9v1m8 8h1m-15.4 -6.4l.7 .7m12.1 -.7l-.7 .7\" /> <path d=\"M9 16a5 5 0 1 1 6 0a3.5 3.5 0 0 0 -1 3a2 2 0 0 1 -4 0a3.5 3.5 0 0 0 -1 -3\" /> <path d=\"M9.7 17l4.6 0\" />"],
  "calendar-check": [0, "<path d=\"M11.5 21h-5.5a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v6\" /> <path d=\"M16 3v4\" /> <path d=\"M8 3v4\" /> <path d=\"M4 11h16\" /> <path d=\"M15 19l2 2l4 -4\" />"],
  "campfire": [0, "<path d=\"M4 21l16 -4\" /> <path d=\"M20 21l-16 -4\" /> <path d=\"M12 15a4 4 0 0 0 4 -4c0 -3 -2 -3 -2 -8c-4 2 -6 5 -6 8a4 4 0 0 0 4 4z\" />"],
  "chart-bar": [0, "<path d=\"M3 13a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z\" /> <path d=\"M15 9a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z\" /> <path d=\"M9 5a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z\" /> <path d=\"M4 20h14\" />"],
  "check": [0, "<path d=\"M5 12l5 5l10 -10\" />"],
  "chevron-down": [0, "<path d=\"M6 9l6 6l6 -6\" />"],
  "chevron-left": [0, "<path d=\"M15 6l-6 6l6 6\" />"],
  "chevron-right": [0, "<path d=\"M9 6l6 6l-6 6\" />"],
  "chevron-up": [0, "<path d=\"M6 15l6 -6l6 6\" />"],
  "circle-check": [0, "<path d=\"M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0\" /> <path d=\"M9 12l2 2l4 -4\" />"],
  "circle-check-filled": [1, "<path d=\"M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-1.293 5.953a1 1 0 0 0 -1.32 -.083l-.094 .083l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.403 1.403l.083 .094l2 2l.094 .083a1 1 0 0 0 1.226 0l.094 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z\" />"],
  "clipboard-check": [0, "<path d=\"M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2\" /> <path d=\"M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z\" /> <path d=\"M9 14l2 2l4 -4\" />"],
  "clock": [0, "<path d=\"M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0\" /> <path d=\"M12 7v5l3 3\" />"],
  "crown": [0, "<path d=\"M12 6l4 6l5 -4l-2 10h-14l-2 -10l5 4z\" />"],
  "device-desktop": [0, "<path d=\"M3 5a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1v-10z\" /> <path d=\"M7 20h10\" /> <path d=\"M9 16v4\" /> <path d=\"M15 16v4\" />"],
  "dice-5": [0, "<path d=\"M3 3m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z\" /> <circle cx=\"8.5\" cy=\"8.5\" r=\".5\" fill=\"currentColor\" /> <circle cx=\"15.5\" cy=\"8.5\" r=\".5\" fill=\"currentColor\" /> <circle cx=\"15.5\" cy=\"15.5\" r=\".5\" fill=\"currentColor\" /> <circle cx=\"8.5\" cy=\"15.5\" r=\".5\" fill=\"currentColor\" /> <circle cx=\"12\" cy=\"12\" r=\".5\" fill=\"currentColor\" />"],
  "download": [0, "<path d=\"M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2\" /> <path d=\"M7 11l5 5l5 -5\" /> <path d=\"M12 4l0 12\" />"],
  "ear": [0, "<path d=\"M6 10a7 7 0 1 1 13 3.6a10 10 0 0 1 -2 2a8 8 0 0 0 -2 3a4.5 4.5 0 0 1 -6.8 1.4\" /> <path d=\"M10 10a3 3 0 1 1 5 2.2\" />"],
  "eye": [0, "<path d=\"M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0\" /> <path d=\"M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6\" />"],
  "eye-off": [0, "<path d=\"M10.585 10.587a2 2 0 0 0 2.829 2.828\" /> <path d=\"M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 2.712 -3.678 4.32 -4.674m2.86 -1.146a9.055 9.055 0 0 1 1.82 -.18c3.6 0 6.6 2 9 6c-.666 1.11 -1.379 2.067 -2.138 2.87\" /> <path d=\"M3 3l18 18\" />"],
  "flag": [0, "<path d=\"M5 5a5 5 0 0 1 7 0a5 5 0 0 0 7 0v9a5 5 0 0 1 -7 0a5 5 0 0 0 -7 0v-9z\" /> <path d=\"M5 21v-7\" />"],
  "flame": [0, "<path d=\"M12 12c2 -2.96 0 -7 -1 -8c0 3.038 -1.773 4.741 -3 6c-1.226 1.26 -2 3.24 -2 5a6 6 0 1 0 12 0c0 -1.532 -1.056 -3.94 -2 -5c-1.786 3 -2.791 3 -4 2z\" />"],
  "guitar-pick": [0, "<path d=\"M16 18.5c2 -2.5 4 -6.5 4 -10.5c0 -2.946 -2.084 -4.157 -4.204 -4.654c-.864 -.23 -2.13 -.346 -3.796 -.346c-1.667 0 -2.932 .115 -3.796 .346c-2.12 .497 -4.204 1.708 -4.204 4.654c0 3.312 2 8 4 10.5c.297 .37 .618 .731 .963 1.081l.354 .347a3.9 3.9 0 0 0 5.364 0a14.05 14.05 0 0 0 1.319 -1.428z\" />"],
  "hand-finger-down": [0, "<path d=\"M8 12v8.5a1.5 1.5 0 0 0 3 0v-7.5\" /> <path d=\"M11 13.5v2a1.5 1.5 0 0 0 3 0v-2.5\" /> <path d=\"M14 14.5a1.5 1.5 0 0 0 3 0v-1.5\" /> <path d=\"M17 13.5a1.5 1.5 0 0 0 3 0v-4.5a6 6 0 0 0 -6 -6h-2h.208a6 6 0 0 0 -5.012 2.7l-.196 .3q -.468 .718 -3.286 5.728a1.5 1.5 0 0 0 .536 2.022c.734 .44 1.674 .325 2.28 -.28l1.47 -1.47\" />"],
  "headphones": [0, "<path d=\"M4 13m0 2a2 2 0 0 1 2 -2h1a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-1a2 2 0 0 1 -2 -2z\" /> <path d=\"M15 13m0 2a2 2 0 0 1 2 -2h1a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-1a2 2 0 0 1 -2 -2z\" /> <path d=\"M4 15v-3a8 8 0 0 1 16 0v3\" />"],
  "help-circle": [0, "<path d=\"M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0\" /> <path d=\"M12 16v.01\" /> <path d=\"M12 13a2 2 0 0 0 .914 -3.782a1.98 1.98 0 0 0 -2.414 .483\" />"],
  "history": [0, "<path d=\"M12 8l0 4l2 2\" /> <path d=\"M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5\" />"],
  "home": [0, "<path d=\"M5 12l-2 0l9 -9l9 9l-2 0\" /> <path d=\"M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7\" /> <path d=\"M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6\" />"],
  "info-circle": [0, "<path d=\"M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0\" /> <path d=\"M12 9h.01\" /> <path d=\"M11 12h1v4h1\" />"],
  "list-numbers": [0, "<path d=\"M11 6h9\" /> <path d=\"M11 12h9\" /> <path d=\"M12 18h8\" /> <path d=\"M4 16a2 2 0 1 1 4 0c0 .591 -.5 1 -1 1.5l-3 2.5h4\" /> <path d=\"M6 10v-6l-2 2\" />"],
  "loader": [0, "<path d=\"M12 6l0 -3\" /> <path d=\"M16.25 7.75l2.15 -2.15\" /> <path d=\"M18 12l3 0\" /> <path d=\"M16.25 16.25l2.15 2.15\" /> <path d=\"M12 18l0 3\" /> <path d=\"M7.75 16.25l-2.15 2.15\" /> <path d=\"M6 12l-3 0\" /> <path d=\"M7.75 7.75l-2.15 -2.15\" />"],
  "lock": [0, "<path d=\"M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6z\" /> <path d=\"M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0\" /> <path d=\"M8 11v-4a4 4 0 1 1 8 0v4\" />"],
  "logout": [0, "<path d=\"M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2\" /> <path d=\"M9 12h12l-3 -3\" /> <path d=\"M18 15l3 -3\" />"],
  "map-2": [0, "<path d=\"M12 18.5l-3 -1.5l-6 3v-13l6 -3l6 3l6 -3v7.5\" /> <path d=\"M9 4v13\" /> <path d=\"M15 7v5.5\" /> <path d=\"M21.121 20.121a3 3 0 1 0 -4.242 0c.418 .419 1.125 1.045 2.121 1.879c1.051 -.89 1.759 -1.516 2.121 -1.879z\" /> <path d=\"M19 18v.01\" />"],
  "medal": [0, "<path d=\"M12 4v3m-4 -3v6m8 -6v6\" /> <path d=\"M12 18.5l-3 1.5l.5 -3.5l-2 -2l3 -.5l1.5 -3l1.5 3l3 .5l-2 2l.5 3.5z\" />"],
  "metronome": [0, "<path d=\"M14.153 8.188l-.72 -3.236a2.493 2.493 0 0 0 -4.867 0l-3.025 13.614a2 2 0 0 0 1.952 2.434h7.014a2 2 0 0 0 1.952 -2.434l-.524 -2.357m-4.935 1.791l9 -13\" /> <path d=\"M20 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0\" />"],
  "microphone": [0, "<path d=\"M9 2m0 3a3 3 0 0 1 3 -3h0a3 3 0 0 1 3 3v5a3 3 0 0 1 -3 3h0a3 3 0 0 1 -3 -3z\" /> <path d=\"M5 10a7 7 0 0 0 14 0\" /> <path d=\"M8 21l8 0\" /> <path d=\"M12 17l0 4\" />"],
  "minus": [0, "<path d=\"M5 12l14 0\" />"],
  "moon": [0, "<path d=\"M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z\" />"],
  "mountain": [0, "<path d=\"M3 20h18l-6.921 -14.612a2.3 2.3 0 0 0 -4.158 0l-6.921 14.612z\" /> <path d=\"M7.5 11l2 2.5l2.5 -2.5l2 3l2.5 -2\" />"],
  "music": [0, "<path d=\"M3 17a3 3 0 1 0 6 0a3 3 0 0 0 -6 0\" /> <path d=\"M13 17a3 3 0 1 0 6 0a3 3 0 0 0 -6 0\" /> <path d=\"M9 17v-13h10v13\" /> <path d=\"M9 8h10\" />"],
  "music-plus": [0, "<path d=\"M3 17a3 3 0 1 0 6 0a3 3 0 0 0 -6 0\" /> <path d=\"M9 17v-13h10v8\" /> <path d=\"M9 8h10\" /> <path d=\"M16 19h6\" /> <path d=\"M19 16v6\" />"],
  "notebook": [0, "<path d=\"M6 4h11a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-11a1 1 0 0 1 -1 -1v-14a1 1 0 0 1 1 -1m3 0v18\" /> <path d=\"M13 8l2 0\" /> <path d=\"M13 12l2 0\" />"],
  "player-pause": [0, "<path d=\"M6 5m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z\" /> <path d=\"M14 5m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z\" />"],
  "player-pause-filled": [1, "<path d=\"M9 4h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h2a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2z\" /> <path d=\"M17 4h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h2a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2z\" />"],
  "player-play": [0, "<path d=\"M7 4v16l13 -8z\" />"],
  "player-play-filled": [1, "<path d=\"M6 4v16a1 1 0 0 0 1.524 .852l13 -8a1 1 0 0 0 0 -1.704l-13 -8a1 1 0 0 0 -1.524 .852z\" />"],
  "player-stop": [0, "<path d=\"M5 5m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z\" />"],
  "player-stop-filled": [1, "<path d=\"M17 4h-10a3 3 0 0 0 -3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3 -3v-10a3 3 0 0 0 -3 -3z\" />"],
  "plus": [0, "<path d=\"M12 5l0 14\" /> <path d=\"M5 12l14 0\" />"],
  "refresh": [0, "<path d=\"M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4\" /> <path d=\"M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4\" />"],
  "route": [0, "<path d=\"M3 19a2 2 0 1 0 4 0a2 2 0 0 0 -4 0\" /> <path d=\"M19 7a2 2 0 1 0 0 -4a2 2 0 0 0 0 4z\" /> <path d=\"M11 19h5.5a3.5 3.5 0 0 0 0 -7h-8a3.5 3.5 0 0 1 0 -7h4.5\" />"],
  "settings": [0, "<path d=\"M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z\" /> <path d=\"M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0\" />"],
  "sparkles": [0, "<path d=\"M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm0 -12a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm-7 12a6 6 0 0 1 6 -6a6 6 0 0 1 -6 -6a6 6 0 0 1 -6 6a6 6 0 0 1 6 6z\" />"],
  "stack-2": [0, "<path d=\"M12 4l-8 4l8 4l8 -4l-8 -4\" /> <path d=\"M4 12l8 4l8 -4\" /> <path d=\"M4 16l8 4l8 -4\" />"],
  "stairs": [0, "<path d=\"M22 5h-5v5h-5v5h-5v5h-5\" />"],
  "star": [0, "<path d=\"M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z\" />"],
  "star-filled": [1, "<path d=\"M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z\" />"],
  "sun": [0, "<path d=\"M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0\" /> <path d=\"M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7\" />"],
  "sword": [0, "<path d=\"M20 4v5l-9 7l-4 4l-3 -3l4 -4l7 -9z\" /> <path d=\"M6.5 11.5l6 6\" />"],
  "target": [0, "<path d=\"M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0\" /> <path d=\"M12 12m-5 0a5 5 0 1 0 10 0a5 5 0 1 0 -10 0\" /> <path d=\"M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0\" />"],
  "target-arrow": [0, "<path d=\"M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0\" /> <path d=\"M12 7a5 5 0 1 0 5 5\" /> <path d=\"M13 3.055a9 9 0 1 0 7.941 7.945\" /> <path d=\"M15 6v3h3l3 -3h-3v-3z\" /> <path d=\"M15 9l-3 3\" />"],
  "trash": [0, "<path d=\"M4 7l16 0\" /> <path d=\"M10 11l0 6\" /> <path d=\"M14 11l0 6\" /> <path d=\"M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12\" /> <path d=\"M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3\" />"],
  "trending-up": [0, "<path d=\"M3 17l6 -6l4 4l8 -8\" /> <path d=\"M14 7l7 0l0 7\" />"],
  "trophy": [0, "<path d=\"M8 21l8 0\" /> <path d=\"M12 17l0 4\" /> <path d=\"M7 4l10 0\" /> <path d=\"M17 4v8a5 5 0 0 1 -10 0v-8\" /> <path d=\"M5 9m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0\" /> <path d=\"M19 9m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0\" />"],
  "upload": [0, "<path d=\"M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2\" /> <path d=\"M7 9l5 -5l5 5\" /> <path d=\"M12 4l0 12\" />"],
  "volume": [0, "<path d=\"M15 8a5 5 0 0 1 0 8\" /> <path d=\"M17.7 5a9 9 0 0 1 0 14\" /> <path d=\"M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5\" />"],
  "wand": [0, "<path d=\"M6 21l15 -15l-3 -3l-15 15l3 3\" /> <path d=\"M15 6l3 3\" /> <path d=\"M9 3a2 2 0 0 0 2 2a2 2 0 0 0 -2 2a2 2 0 0 0 -2 -2a2 2 0 0 0 2 -2\" /> <path d=\"M19 13a2 2 0 0 0 2 2a2 2 0 0 0 -2 2a2 2 0 0 0 -2 -2a2 2 0 0 0 2 -2\" />"],
  "x": [0, "<path d=\"M18 6l-12 12\" /> <path d=\"M6 6l12 12\" />"],
};

/** Nombre d'icônes disponibles — utilisé par les tests. */
export const ICON_COUNT = Object.keys(ICONS).length;
