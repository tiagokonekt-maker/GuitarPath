// Groply — store/gropiTips.js
//
// Extrait de HomeScreen.jsx lors de la refonte Parcours-accueil : ce
// contenu (conseils, anecdotes, rappels de progression) appartient à la
// voix de Gropi, pas à un écran en particulier. Le séparer permet de
// l'utiliser depuis n'importe quel écran — ici la variante « accueil » de
// CoursesScreen — sans dupliquer 70 lignes de contenu.

export const GROPI_TIPS = [
  // ── Contextuel (prioritaire, condition spécifique à l'état du joueur) ──────
  { type:"progress", cond:(s,rs)=>rs.toReview>=10,   text:(_,rs)=>`Tu as ${rs.toReview} questions qui attendent d'être revues. La mémoire s'efface vite, c'est le bon moment pour les reprendre.` },
  { type:"progress", cond:(s)=>s.streak===0&&Object.keys(s.completedLessons||{}).length>0, text:()=>"Ta série est retombée à zéro. Tu es là, c'est déjà l'essentiel : rallume-la aujourd'hui." },
  { type:"progress", cond:(s)=>s.streak>=7,           text:(s)=>`${s.streak} jours d'affilée. La régularité, c'est 80 % du chemin, continue comme ça.` },
  { type:"progress", cond:(s)=>s.streak>=3,           text:(s)=>`Série de ${s.streak} jours. Tu construis une vraie habitude, ne la casse pas maintenant.` },
  { type:"progress", cond:(s)=>s.level>=3&&(s.xp||0)>0, text:()=>"Tu progresses bien. C'est le bon moment pour tenter quelque chose de nouveau." },
  { type:"progress", cond:(s)=>Object.keys(s.completedLessons||{}).length===0, text:()=>"Commence par une leçon : 10 minutes aujourd'hui valent mieux qu'une heure dimanche." },
  { type:"tip",      cond:()=>new Date().getDay()===1, text:()=>"Lundi est un bon jour pour revoir la semaine passée avant d'avancer." },
  { type:"tip",      cond:()=>new Date().getDay()===5, text:()=>"Vendredi soir et guitare, ça marche bien ensemble. 15 minutes de Jam pour finir la semaine sur une bonne note." },

  // ── Rappels de progression (toujours éligibles, piochent dans les vraies stats) ──
  { type:"progress", cond:(s)=>Object.keys(s.completedLessons||{}).length>=1, text:(s)=>`${Object.keys(s.completedLessons).length} leçon${Object.keys(s.completedLessons).length>1?"s":""} déjà complétée${Object.keys(s.completedLessons).length>1?"s":""}. Chaque leçon ajoute une pierre à l'édifice, même les plus courtes.` },
  { type:"progress", cond:(s)=>(s.unlockedBadges||[]).length>=1, text:(s)=>`${s.unlockedBadges.length} badge${s.unlockedBadges.length>1?"s":""} débloqué${s.unlockedBadges.length>1?"s":""}. Va voir ta collection dans l'onglet Progrès, ça fait toujours plaisir.` },
  { type:"progress", cond:(s)=>(s.dailyChallengeCount||0)>=3, text:(s)=>`${s.dailyChallengeCount} défis du jour relevés. C'est ce genre de petite régularité qui construit une vraie oreille.` },

  // ── Conseils pratiques (toujours éligibles) ──────────────────────────────
  { type:"tip", cond:()=>true, text:()=>"Accorde-toi avant de jouer. 30 secondes qui évitent de fausser toute la session." },
  { type:"tip", cond:()=>true, text:()=>"Entre cordes 3 et 2, le décalage est de 4 cases, pas 5. C'est la cassure du manche, un repère à retenir par cœur." },
  { type:"tip", cond:()=>true, text:()=>"Vise la tierce de chaque accord quand tu improvises : c'est elle qui raconte l'histoire." },
  { type:"tip", cond:()=>true, text:()=>"Le silence fait partie de la musique. Laisser respirer une phrase la rend souvent plus puissante." },
  { type:"tip", cond:()=>true, text:()=>"Joue lentement, puis accélère. Un tempo lent parfait vaut mieux qu'un tempo rapide raté." },
  { type:"tip", cond:()=>true, text:()=>"La pentatonique mineure position 1 fonctionne sur 90 % des jams en mineur. Maîtrise-la d'abord." },
  { type:"tip", cond:()=>true, text:()=>"Le mode dorien est un mineur naturel avec une 6te majeure. C'est la gamme de Santana ou de Daft Punk, écoute-les différemment." },

  // ── Anecdotes musicales (faits historiques vérifiables, jamais de paroles) ──
  { type:"anecdote", cond:()=>true, text:()=>"Le riff de 'Smoke on the Water' (Deep Purple) est né d'un incendie bien réel : un concert de Frank Zappa à Montreux qui a pris feu en 1971, sous les yeux du groupe." },
  { type:"anecdote", cond:()=>true, text:()=>"Jimi Hendrix était gaucher, mais jouait souvent sur une Stratocaster de droitier simplement retournée, cordes replacées à l'envers." },
  { type:"anecdote", cond:()=>true, text:()=>"Le riff d'intro de 'Stairway to Heaven' est tellement rejoué en magasin de musique qu'il a inspiré une scène culte de 'Wayne's World' où un panneau l'interdit carrément." },
  { type:"anecdote", cond:()=>true, text:()=>"B.B. King a appelé toutes ses guitares 'Lucille', en souvenir d'un incendie qu'il a fui de justesse pendant un concert." },
  { type:"anecdote", cond:()=>true, text:()=>"Eddie Van Halen a popularisé le tapping à deux mains sur 'Eruption' — une technique que très peu de guitaristes utilisaient avant lui à ce niveau." },
  { type:"anecdote", cond:()=>true, text:()=>"La gamme pentatonique n'est pas née en Occident : on la retrouve, inventée indépendamment, dans les musiques traditionnelles chinoise, africaine et amérindienne." },
  { type:"anecdote", cond:()=>true, text:()=>"Keith Richards joue une bonne partie des riffs des Rolling Stones en accordage ouvert de Sol, sur une guitare à seulement 5 cordes (sans le Mi grave)." },
  { type:"anecdote", cond:()=>true, text:()=>"Brian May (Queen) a construit sa guitare légendaire, la 'Red Special', avec son père — en partie à partir de bois de cheminée récupéré." },
  { type:"anecdote", cond:()=>true, text:()=>"Le blues à 12 mesures est la structure la plus reprise de l'histoire du rock : des milliers de morceaux, du blues au rock'n'roll, s'appuient sur elle." },
  { type:"anecdote", cond:()=>true, text:()=>"Slash a enregistré le riff de 'Sweet Child O' Mine' sur une copie de Gibson Les Paul, avant même de pouvoir s'offrir une vraie." },
];

export const TIP_LABELS = { tip:"Conseil de Gropi", anecdote:"Anecdote musicale", progress:"Ta progression" };

/**
 * Choisit le conseil du jour. Rotation par jour du mois parmi les conseils
 * éligibles aujourd'hui : le même jour montre toujours le même conseil
 * (cohérent si on ne le ferme pas), un autre jour pioche ailleurs.
 *
 * @param state  état de progression
 * @param rs     stats de révision, ex. { toReview } — {} si non disponible
 *               (la variante home de CoursesScreen n'a pas ces stats sous
 *               la main : les conditions qui en dépendent sont simplement
 *               ignorées dans ce cas, sans planter).
 */
export function pickTip(state, rs = {}) {
  const dayIdx = new Date().getDate();
  const contextual = GROPI_TIPS.filter(t => { try { return t.cond(state, rs); } catch { return false; } });
  if (contextual.length === 0) return { type:"tip", text:"Gropi est là pour toi." };
  const picked = contextual[dayIdx % contextual.length];
  return { type: picked.type, text: picked.text(state, rs) };
}
