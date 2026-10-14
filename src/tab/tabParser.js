// Groply — tab/tabParser.js
// Logique pure : aucune dépendance audio, aucun import React. Transforme un
// texte de tablature ASCII (un ou plusieurs systèmes de 6 lignes, une par
// corde) en une séquence d'évènements chronologiques exploitable par
// tabPlayer.js.
//
// ── La contrainte de fond : l'ASCII n'encode pas vraiment le rythme ───────
// L'espacement des tirets, sur un vrai site de tabs, est une convention
// visuelle — jamais un repère temporel garanti d'un auteur à l'autre. Ce
// module choisit une convention EXPLICITE pour pouvoir jouer le résultat :
// chaque colonne de caractère vaut une durée fixe (une double-croche par
// défaut), à un tempo réglable. Une tab retapée depuis un site qui n'a pas
// été écrite avec un espacement rigoureux sonnera avec un rythme
// approximatif — c'est une limite du format d'entrée choisi, pas un bug de
// cet analyseur.
//
// ── Convention des cordes ──────────────────────────────────────────────────
// Ligne 0 = corde 1 (Mi aigu), ligne 5 = corde 6 (Mi grave) — l'ordre
// standard de lecture d'une tab (celui du haut est le plus aigu), qui
// correspond déjà à la convention corde 1 = Mi aigu déjà en place dans
// getToneNoteAtPosition() (audioEngine.js) et getNoteAtPosition()
// (fretboardUtils.js) : aucune conversion à faire côté lecture.
//
// ── Plusieurs systèmes ──────────────────────────────────────────────────
// Une vraie tab ASCII enchaîne des SYSTÈMES de 6 lignes, séparés par des
// lignes vides, des noms d'accords, des paroles ou des numéros de mesure.
// Chaque ligne est classée (ligne de corde ou non, voir estLigneDeTab) ; un
// bloc de lignes de corde CONSÉCUTIVES forme un système. Les systèmes de 6
// lignes sont mis bout à bout : le système n+1 commence là où finit le
// système n, +1 colonne si celui-ci se terminait par une barre de mesure
// (la même durée qu'une barre « | » au milieu d'un système). Les barres de
// début et de fin de système sont retirées : pas de colonne vide ni de
// double barre à la jonction.
// Un bloc d'un autre nombre de lignes (basse 4 cordes, 7 cordes, ligne
// perdue au collage) est ignoré, avec un message dans `avertissements`
// (un bloc de 1 ou 2 lignes — un soulignement « ------ » de titre, par
// exemple — est ignoré sans rien dire). Un bloc de 12, 18… lignes collées
// sans séparation est découpé par 6.
//
// ── Techniques reconnues ────────────────────────────────────────────────
//   3h5    hammer-on (de la case 3 vers la case 5)
//   5p3    pull-off (de la case 5 vers la case 3)
//   3/5    slide montant
//   5\3    slide descendant
//   7b9    bend, case 7 vers la hauteur de la case 9
//   7b     bend sans cible précisée — un ton entier par défaut (case+2)
//   7b9r7  bend puis relâché : monte à la hauteur de la case 9, redescend
//          à la case 7, sans nouvelle attaque. `releaseFret` = case
//          d'arrivée, `releaseCol` = colonne du « r » (le relâché commence
//          là). « 7b9r » sans cible relâche vers la case de départ.
//   5~     vibrato (un ou plusieurs ~ collés après la note, ou après un
//          bend / une liaison) : `vibrato: true` sur l'évènement, rendu
//          par tabSon.js en légère modulation périodique de la hauteur.
//   x      note étouffée / percussive
// Non géré, noté ici pour ne pas prétendre le contraire :
//   pré-bend (« 9pb7 », « (9)r7 ») — un « r » sans bend juste devant est
//   ignoré ; les cases autour sonnent comme des notes simples.
//   liaisons enchaînées (3h5h7) — donne 3h5 puis 7 simple.
//   tablatures à 4, 5 ou 7 cordes — systèmes ignorés (avertissement).

/** Symboles de technique reconnus entre deux numéros de case. */
const TECH_SYMBOLS = new Set(["h", "p", "/", "\\", "b"]);

const TECH_TYPE = {
  h: "hammer", p: "pull", "/": "slide_up", "\\": "slide_down", b: "bend",
};

/** Nombre de cordes attendu par système. */
const NB_CORDES = 6;

/**
 * Retire un éventuel préfixe "e|", "B :", "E-", etc. en tête de ligne — le
 * nom de corde que beaucoup de gens tapent par habitude, mais qui décale
 * l'alignement des colonnes s'il n'est pas retiré UNIFORMÉMENT sur les 6
 * lignes avant analyse.
 */
function stripLabel(line) {
  return line.replace(/^\s*[A-Ga-g](#|b)?\s*[|:]?\s?/, "");
}

/**
 * Retire une annotation après la dernière barre de mesure (« |  x2 »,
 * « | (bis) ») : du texte sans tiret n'est pas de la tablature.
 */
function couperAnnotation(line) {
  const i = line.lastIndexOf("|");
  if (i < 0) return line;
  const reste = line.slice(i + 1);
  return reste.trim() && !reste.includes("-") ? line.slice(0, i + 1) : line;
}

/** Caractères admis dans le corps d'une ligne de corde. */
const CARACTERES_TAB = /^[-0-9|xXhpbrtsSPHBR/\\~()<>.^*:=\s]+$/;

/**
 * Cette ligne est-elle une ligne de corde ? Corps (sans le nom de corde ni
 * l'annotation finale) fait uniquement de caractères de tab, avec au moins
 * un tiret et deux tirets/chiffres consécutifs. Écarte les lignes vides, les
 * noms d'accords (« Am    C »), les paroles, les numéros de mesure.
 */
function estLigneDeTab(line) {
  const corps = stripLabel(couperAnnotation(line));
  return CARACTERES_TAB.test(corps) && corps.includes("-") && /[-0-9]{2,}/.test(corps);
}

/**
 * Analyse UNE ligne (une corde) en une liste d'évènements bruts, chacun
 * avec sa colonne de départ. Ne connaît rien du tempo ni des autres cordes.
 */
function parseStringLine(line) {
  const events = [];
  let i = 0;
  const n = line.length;

  const lireNombre = (pos) => {
    let j = pos;
    while (j < n && line[j] >= "0" && line[j] <= "9") j++;
    if (j === pos) return null;
    return { valeur: parseInt(line.slice(pos, j), 10), fin: j };
  };

  // Vibrato : un ou plusieurs « ~ » collés à la fin d'un évènement.
  const vibratoApres = (ev, pos) => {
    if (line[pos] !== "~") return pos;
    ev.vibrato = true;
    while (line[pos] === "~") pos++;
    return pos;
  };

  while (i < n) {
    const c = line[i];

    if (c === "x" || c === "X") {
      events.push({ type: "mute", col: i });
      i++;
      continue;
    }

    const nombre = lireNombre(i);
    if (nombre) {
      const apres = nombre.fin;
      const symbole = line[apres];
      if (symbole && TECH_SYMBOLS.has(symbole)) {
        const cible = lireNombre(apres + 1);
        const toFret = cible ? cible.valeur
          : symbole === "b" ? nombre.valeur + 2   // bend sans cible : un ton par défaut
          : nombre.valeur;                         // h/p/slide sans cible : dégrade en note simple
        const ev = {
          type: TECH_TYPE[symbole],
          fromFret: nombre.valeur,
          toFret,
          col: i,
        };
        i = cible ? cible.fin : apres + 1;
        // Bend relâché : « 7b9r7 » (ou « 7b9r », retour à la case de départ).
        if (symbole === "b" && line[i] === "r") {
          const retour = lireNombre(i + 1);
          ev.releaseFret = retour ? retour.valeur : ev.fromFret;
          ev.releaseCol = i;
          i = retour ? retour.fin : i + 1;
        }
        i = vibratoApres(ev, i);
        events.push(ev);
        continue;
      }
      const ev = { type: "note", fret: nombre.valeur, col: i };
      i = vibratoApres(ev, nombre.fin);
      events.push(ev);
      continue;
    }

    // '-', '|', '~' isolé, espace, tout le reste : remplissage, une colonne.
    i++;
  }

  return events;
}

/**
 * Découpe le texte en blocs de lignes de corde consécutives.
 * @returns [{ lignes: [string], debut: numéro de ligne (1-based) }]
 */
function blocsDeTab(texte) {
  const blocs = [];
  let courant = null;
  texte.split(/\r?\n/).forEach((ligne, idx) => {
    if (estLigneDeTab(ligne)) {
      if (!courant) { courant = { lignes: [], debut: idx + 1 }; blocs.push(courant); }
      courant.lignes.push(ligne);
    } else {
      courant = null;
    }
  });
  return blocs;
}

/**
 * Prépare les 6 lignes d'un système : nom de corde, annotation finale,
 * barres de début et de fin retirées.
 * @returns { lignes, largeur, barreFinale }
 */
function preparerSysteme(lignes6) {
  let barreFinale = false;
  const lignes = lignes6.map(l => {
    let t = stripLabel(couperAnnotation(l)).replace(/^[|:]+/, "");
    const sansFin = t.replace(/[\s|:]+$/, "");
    if (/[|:]/.test(t.slice(sansFin.length))) barreFinale = true;
    t = sansFin;
    return t;
  });
  const largeur = lignes.reduce((m, l) => Math.max(m, l.length), 0);
  return { lignes, largeur, barreFinale };
}

/** Décale toutes les colonnes d'un évènement de `offset`. */
function decaler(ev, offset) {
  const out = { ...ev, col: ev.col + offset };
  if (ev.releaseCol != null) out.releaseCol = ev.releaseCol + offset;
  return out;
}

/**
 * Analyse un texte de tablature complet (un ou plusieurs systèmes de 6
 * lignes) en une séquence d'évènements chronologiques, triés par colonne
 * puis par corde. Les systèmes sont enchaînés sans trou de timing.
 *
 * @param texte  le texte collé ou tapé par l'utilisateur
 * @returns { evenements, erreur, avertissements, systemes }
 *   evenements      [{ type, string, col, fret|fromFret&toFret,
 *                      vibrato?, releaseFret?, releaseCol? }, ...] trié
 *   erreur          message si aucun système de 6 lignes exploitable, sinon null
 *   avertissements  [string] blocs ignorés (nombre de lignes ≠ 6), jamais bloquant
 *   systemes        nombre de systèmes de 6 lignes retenus
 */
export function parseTab(texte) {
  if (typeof texte !== "string" || !texte.trim()) {
    return { evenements: [], erreur: "Aucun texte à analyser.", avertissements: [], systemes: 0 };
  }

  const avertissements = [];
  const systemes = [];
  let lignesDeTab = 0;
  for (const bloc of blocsDeTab(texte)) {
    const nb = bloc.lignes.length;
    lignesDeTab += nb;
    if (nb % NB_CORDES === 0) {
      for (let k = 0; k < nb; k += NB_CORDES) systemes.push(bloc.lignes.slice(k, k + NB_CORDES));
    } else if (nb >= 3) {
      avertissements.push(
        `Bloc de ${nb} lignes ignoré (ligne ${bloc.debut}) : 6 attendues, une par corde. ` +
        `Tablature de basse ou de guitare 7 cordes, ou ligne perdue au collage ?`
      );
    }
    // 1 ou 2 lignes isolées : soulignement de titre, bout de texte — ignorées.
  }

  if (!systemes.length) {
    return {
      evenements: [],
      erreur: `${lignesDeTab} ligne(s) exploitable(s) détectée(s), mais aucun bloc de 6 attendues (une par corde). Vérifie qu'aucune ligne ne s'est perdue au collage.`,
      avertissements,
      systemes: 0,
    };
  }

  const evenements = [];
  let offset = 0;
  for (const brut of systemes) {
    const { lignes, largeur, barreFinale } = preparerSysteme(brut);
    lignes.forEach((ligne, idx) => {
      const stringNum = idx + 1;   // ligne 0 = corde 1 (Mi aigu)
      for (const ev of parseStringLine(ligne)) {
        evenements.push({ ...decaler(ev, offset), string: stringNum });
      }
    });
    offset += largeur + (barreFinale ? 1 : 0);
  }

  evenements.sort((a, b) => a.col - b.col || a.string - b.string);
  return { evenements, erreur: null, avertissements, systemes: systemes.length };
}
