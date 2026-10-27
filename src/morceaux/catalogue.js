// Groply — morceaux/catalogue.js
// Catalogue du lecteur de morceaux (Outils › Morceaux).
//
// RÈGLE : uniquement des œuvres du DOMAINE PUBLIC (compositeur mort depuis
// plus de 70 ans, airs traditionnels) ou des riffs / exercices ORIGINAUX
// écrits pour Groply. Aucune tab, aucun arrangement, aucune parole protégés.
// Chaque fichier de titres/ indique sa base de licence dans `licence`.
//
// Champs d'un morceau :
//   id, titre, auteur, description
//   niveau         "debutant" | "intermediaire"
//   type           "melodie" | "riff" | "accords"
//   tempo          BPM d'origine (à la noire, y compris en 6/8)
//   tonalite, mesure ("4/4", "3/4", "6/8")
//   colsParMesure  caractères par mesure dans la tab (16 en 4/4, 12 sinon)
//   melodie?       notes attendues (« Mi Mi Fa Sol | … ») — vérifiées par test
//   accords?       symboles des accords à montrer en diagramme
//   grille?        un accord par mesure
//   licence        base juridique
//   tab            ASCII lu par tab/tabParser.js (voir morceaux.js)
import odeALaJoie from "./titres/odeALaJoie.js";
import auClairDeLaLune from "./titres/auClairDeLaLune.js";
import frereJacques from "./titres/frereJacques.js";
import ahVousDiraiJe from "./titres/ahVousDiraiJe.js";
import greensleeves from "./titres/greensleeves.js";
import premiersAccords from "./titres/premiersAccords.js";
import pickingDoLamFaSol from "./titres/pickingDoLamFaSol.js";
import risingSun from "./titres/risingSun.js";
import riffRockMi from "./titres/riffRockMi.js";
import riffFolkRe from "./titres/riffFolkRe.js";
import bluesEnLa from "./titres/bluesEnLa.js";
import menuetEnSol from "./titres/menuetEnSol.js";
import amazingGrace from "./titres/amazingGrace.js";
import laCucaracha from "./titres/laCucaracha.js";
import balladePop from "./titres/balladePop.js";
import skankReggae from "./titres/skankReggae.js";
import riffPowerChords from "./titres/riffPowerChords.js";
import scarboroughFair from "./titres/scarboroughFair.js";
import furElise from "./titres/furElise.js";
import londonderryAir from "./titres/londonderryAir.js";
import irishWasherwoman from "./titres/irishWasherwoman.js";
import canonPachelbel from "./titres/canonPachelbel.js";
import travisDoLamRemSol from "./titres/travisDoLamRemSol.js";
import bluesLentMi from "./titres/bluesLentMi.js";
import chankFunk from "./titres/chankFunk.js";
import bossaPouceDoigts from "./titres/bossaPouceDoigts.js";

export const MORCEAUX = [
  odeALaJoie,
  auClairDeLaLune,
  frereJacques,
  ahVousDiraiJe,
  premiersAccords,
  riffRockMi,
  greensleeves,
  pickingDoLamFaSol,
  risingSun,
  riffFolkRe,
  bluesEnLa,
  menuetEnSol,
  amazingGrace,
  laCucaracha,
  balladePop,
  skankReggae,
  riffPowerChords,
  scarboroughFair,
  furElise,
  londonderryAir,
  irishWasherwoman,
  canonPachelbel,
  travisDoLamRemSol,
  bluesLentMi,
  chankFunk,
  bossaPouceDoigts,
];

export const morceauParId = (id) => MORCEAUX.find(m => m.id === id) || null;
