// Groply — tab/tabParser.js
// Logique pure : aucune dépendance audio, aucun import React. Transforme un
// texte de tablature ASCII (6 lignes, une par corde) en une séquence
// d'évènements chronologiques exploitable par tabPlayer.js.
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
// ── Techniques reconnues ────────────────────────────────────────────────
//   3h5   hammer-on (de la case 3 vers la case 5)
//   5p3   pull-off (de la case 5 vers la case 3)
//   3/5   slide montant
//   5\3   slide descendant
//   7b9   bend, case 7 vers la hauteur de la case 9
//   7b    bend sans cible précisée — un ton entier par défaut (case+2)
//   x     note étouffée / percussive
// Non géré en v1, noté ici pour ne pas prétendre le contraire :
//   ~ (vibrato)        — analysé s'il traîne dans le texte mais ignoré,
//                         aucune modulation de hauteur possible sur un
//                         échantillon fixe.
//   7b9r7 (bend+release) — seul "7b9" est retenu, le "r7" retombe en note
//                         séparée. Notation avancée, pas couverte en v1.

/** Symboles de technique reconnus entre deux numéros de case. */
const TECH_SYMBOLS = new Set(["h", "p", "/", "\\", "b"]);

const TECH_TYPE = {
  h: "hammer", p: "pull", "/": "slide_up", "\\": "slide_down", b: "bend",
};

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
        events.push({
          type: TECH_TYPE[symbole],
          fromFret: nombre.valeur,
          toFret,
          col: i,
        });
        i = cible ? cible.fin : apres + 1;
        continue;
      }
      events.push({ type: "note", fret: nombre.valeur, col: i });
      i = nombre.fin;
      continue;
    }

    // '-', '|', '~', espace, tout le reste : remplissage, une colonne.
    i++;
  }

  return events;
}

/**
 * Analyse un texte de tablature complet (6 lignes) en une séquence
 * d'évènements chronologiques, triés par colonne puis par corde.
 *
 * @param texte  le texte collé ou tapé par l'utilisateur
 * @returns { evenements, erreur }
 *   evenements  [{ type, string, col, fret|fromFret&toFret }, ...] trié
 *   erreur      message si le texte n'a pas 6 lignes exploitables, sinon null
 */
export function parseTab(texte) {
  if (typeof texte !== "string" || !texte.trim()) {
    return { evenements: [], erreur: "Aucun texte à analyser." };
  }

  // Ne garde que les lignes qui RESSEMBLENT à une ligne de tab : au moins
  // quelques tirets ou chiffres. Filtre les lignes vides ou des titres
  // qu'on aurait collés par mégarde avec la tab.
  const lignesBrutes = texte.split("\n").filter(l => /[-0-9]{2,}/.test(l));

  if (lignesBrutes.length < 6) {
    return {
      evenements: [],
      erreur: `${lignesBrutes.length} ligne(s) exploitable(s) détectée(s), 6 attendues (une par corde). Vérifie qu'aucune ligne ne s'est perdue au collage.`,
    };
  }
  // Plus de 6 : on garde les 6 premières plutôt que d'échouer — une ligne
  // de titre ou de légende en trop ne doit pas bloquer toute la lecture.
  const lignes = lignesBrutes.slice(0, 6).map(stripLabel);

  const evenements = [];
  lignes.forEach((ligne, idx) => {
    const stringNum = idx + 1;   // ligne 0 = corde 1 (Mi aigu)
    for (const ev of parseStringLine(ligne)) {
      evenements.push({ ...ev, string: stringNum });
    }
  });

  evenements.sort((a, b) => a.col - b.col || a.string - b.string);
  return { evenements, erreur: null };
}
