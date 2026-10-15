// Leçon du module « harmony » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "harm-c6-04", level: 8,
  title: "Les progressions modales",
  duration: 9,
  content: [
    { type: "p", text: "Toutes les progressions d'accords ne suivent pas la logique tonale classique (I-IV-V, ii-V-I). Il existe aussi les progressions 'modales' : des suites d'accords qui gravitent autour d'un mode plutôt que d'une tonalité. Ces progressions sont la base du jazz modal, du rock psychédélique, et d'une grande partie de la musique folk et celtique.", img: "/illus-palette-couleurs.webp", imgAlt: "Une palette de peintre avec plusieurs touches de couleurs", imgSide: "right" },
    { type: "h", text: "Qu'est-ce qu'une progression modale ?" },
    { type: "p", text: "Une progression modale se construit sur les accords diatoniques d'un mode spécifique, en ancrant l'oreille sur la tonique du mode (et non de la gamme parente). Au lieu de I-IV-V-I (qui confirme la tonalité), une progression modale tourne autour d'un accord central sans jamais 'résoudre' définitivement. Ça crée une ambiance statique, hypnotique." },
    { type: "h", text: "La vamp dorien" },
    { type: "p", text: "La vamp dorien la plus classique : Im7-IV7 en boucle. Ex : Dm7-G7 qui tourne sans aller vers Cmaj7. Ou juste Dm7 pendant de nombreuses mesures. Le Ré est la tonique modale, la gamme est Ré dorien. La progression ne résout jamais vers Do — elle reste en Ré. 'So What' (Miles Davis) = Dm7 en boucle pendant 16 mesures." },
    { type: "h", text: "La vamp mixolydien" },
    { type: "p", text: "I7-♭VII en boucle : Ré7-Do ou La7-Sol. La fondamentale reste sur I, mais le ♭VII (accord majeur un ton plus bas) apporte la couleur mixolydienne. 'Hey Joe' (Hendrix) : C-G-D-A-E = ♭VII-♭IV-♭I-♭V-I en Mi mixolydien. 'Sweet Home Alabama' (Lynyrd Skynyrd) : D-C-G en Sol mixolydien." },
    { type: "h", text: "La vamp phrygienne" },
    { type: "p", text: "Im-♭II en boucle : Am-Bb ou Em-F. La ♭II est la note caractéristique du phrygien. Cette progression sonne immédiatement 'espagnol', 'flamenco'. La cadence flamenco classique : Am-G-F-E (i-♭VII-♭VI-V en La phrygien). Beaucoup de musique latine et de métal utilisent cette progression." },
    { type: "h", text: "La vamp lydien" },
    { type: "p", text: "Imaj7-II en boucle : Cmaj7-D. La présence du II (accord majeur construit sur le 2e degré = le #4 caractéristique du lydien) donne la couleur lydienne. Très utilisée dans les bandes-son de films (John Williams). Évoque la magie, l'espace ouvert." },
    { type: "h", text: "Comment distinguer tonal vs modal" },
    { type: "p", text: "Tonal : la progression 'voyage', crée des tensions et des résolutions, revient à la tonique. Modal : la progression 'tourne', reste sur une sonorité, crée une hypnose. Dans la musique moderne, les deux coexistent souvent : couplets modaux (vamp) + refrain tonal (progression). Ex : 'Light My Fire' (The Doors) : intro en Ré dorien (modal), solo modal, mais chorus plus tonal." },
    { type: "ref", text: "'Riders on the Storm' (The Doors) : vamp Dm7-Em7 en Ré dorien pendant tout le morceau. 'Oye Como Va' (Santana) : Am7-D7 en La dorien. 'Scarborough Fair' (Simon & Garfunkel) : mélodie en Mi dorien avec progressions modales. Ces morceaux montrent comment une vamp simple peut créer une atmosphère inoubliable." },
    { type: "tip", text: "Compose une vamp modale : choisis un mode (commence par dorien ou mixolydien). Construis 2 accords qui capturent sa couleur. Ex : Dm7-G (dorien) ou A7-G (mixolydien). Boucle ces 2 accords pendant 5 minutes et improvise par-dessus avec le mode correspondant. Tu viens de composer une pièce modale." },
  ],
  quiz: ["q-impro-02"],
};

export const quiz = [
  {id:"q-impro-02",courseId:"impro",lessonId:"harm-c6-04",lvl:2,q:"Sur une vamp Em7-A7 modale (= ii-V sans résolution), quel mode utiliser ?",o:["Mi phrygien","Mi locrien","Mi dorien","Mi ionien"],a:2,exp:"Em7-A7 = ii-V en Ré majeur sans résolution sur Dmaj7. Sur le ii d'un ii-V modal = dorien du ii. Donc Mi dorien (= Ré majeur en partant de Mi).",xp:50},
];
