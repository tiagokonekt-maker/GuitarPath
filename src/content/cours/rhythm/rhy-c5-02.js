// Leçon du module « rhythm » + les questions de quiz qui s'y rattachent.
// Format décrit dans src/content/README.md.

export default {
  id: "rhy-c5-02", level: 8,
  title: "Reggae et ska : jouer sur les contretemps",
  duration: 10,
  gropiTip: "Tape du pied sur 1-2-3-4 et dis « pied-tchk » à chaque temps : ton accord ne sonne que sur le « tchk », jamais en même temps que ton pied. Si les deux se rejoignent, ralentis.",
  content: [
    { type: "p", text: "Le reggae et le ska sont des musiques jamaïcaines qui ont révolutionné la guitare rythmique en plaçant les accents là où personne ne les attendait : sur les contretemps. La guitare joue 'en négatif' — là où les autres instruments ne jouent pas. Cette approche radicalement différente crée une musique hypnotique et unique." },
    { type: "h", text: "Le skank reggae : jouer sur les 'et'" },
    { type: "p", text: "Le pattern reggae de base s'appelle le 'skank'. Principe : jouer des accords étouffés (courts, staccato) uniquement sur les contretemps. En 4/4 : silence(1) - accord(et-1) - silence(2) - accord(et-2) - silence(3) - accord(et-3) - silence(4) - accord(et-4). La guitare ne joue JAMAIS sur les temps 1, 2, 3, 4." },
    { type: "h", text: "L'importance de l'espace" },
    { type: "p", text: "Dans le reggae, la guitare laisse les temps forts complètement vides. La basse (très grave et proéminente) et la grosse caisse marquent les temps. La guitare et le clavier occupent les contretemps. Cette répartition crée l'espace caractéristique du reggae — chaque instrument a sa propre 'fenêtre temporelle', et tous ensemble ils forment un tout cohérent." },
    { type: "h", text: "La technique du skank" },
    { type: "p", text: "Pour jouer le skank proprement : joue l'accord (court et étouffé) sur le contretemps, puis relâche immédiatement la pression de la main gauche pour créer le silence sur le temps suivant. Le son doit être COURT et net. Un skank qui traîne sonne 'pas reggae'. La définition du son vient de la précision du relâchement." },
    {
      type: "strum_pattern",
      caption: "Reggae skank — uniquement sur les contretemps (les 'et')",
      data: { pattern: ["-","H","-","H","-","H","-","H"], beats: 4, style: "reggae", bpm: 80 },
    },
    { type: "h", text: "Le ska : plus vite, plus court" },
    { type: "p", text: "Le ska est l'ancêtre du reggae (années 50-60 en Jamaïque). Même principe (accords sur les contretemps), mais à un tempo beaucoup plus rapide (120-160 BPM contre 70-90 BPM pour le reggae). Les accords sont encore plus courts et percussifs. Ska original (The Skatalites), ska britannique (The Specials), ska punk (Rancid, Sublime)." },
    { type: "h", text: "Le riddim : la boucle reggae" },
    { type: "p", text: "En reggae, on appelle 'riddim' la boucle rythmique de base sur laquelle tout repose. La guitare fait partie du riddim avec son skank. La précision rythmique doit être absolue — le riddim reggae est souvent plus strict que le rock ou le jazz. Un skank légèrement décalé est immédiatement perceptible dans le contexte reggae." },
    { type: "h", text: "Le lien avec la syncope" },
    { type: "p", text: "Le skank reggae est une forme extrême de syncope : toutes les notes sont sur les contretemps, sans exception. Jouer le reggae développe donc le sens du contretemps de façon très efficace. Après quelques sessions de skank, jouer des syncopes dans d'autres styles (funk, jazz) devient beaucoup plus naturel." },
    { type: "ref", text: "'No Woman No Cry' (Bob Marley, 1975) : écoute la guitare et le piano dans le fond. Ils skanquent sur les contretemps pendant que la basse de Family Man Barrett tient les temps. 'The Harder They Come' (Jimmy Cliff, 1972) : exemple de ska à la limite du reggae early. 'What I Got' (Sublime, 1996) : ska-punk où la guitare skanque à tempo rapide." },
    { type: "tip", text: "Drill skank (10 min) : backing reggae en Do à 75 BPM (YouTube). Joue UNIQUEMENT sur les 'et' de chaque temps avec des accords courts et étouffés. Commence lentement (60 BPM). Compte à voix haute : 'silence(1) - chord(et) - silence(2) - chord(et)...' Ton oreille va s'inverser — après 5 minutes, le 'et' devient ta référence naturelle." },
  ],
  quiz: ["q-rhy-08","q-rhy-37","q-rhy-04","q-rhy-06"],
};

export const quiz = [
  {id:"q-rhy-08",courseId:"rhythm",lessonId:"rhy-c5-02",lvl:2,q:"Le pattern reggae 'skank' joue…",o:["Uniquement sur les contretemps","Sur tous les temps","Uniquement sur les temps 2 et 4","Sur le 1 et le 3"],a:0,exp:"Skank reggae = guitare uniquement sur les contretemps (les 'et'). Le 1 et le 3 sont silence côté guitare. La basse marque les temps.",xp:35},
  {id:"q-rhy-37",courseId:"rhythm",lessonId:"rhy-c5-02",lvl:2,q:"Pourquoi la guitare reggae sonne-t-elle « en l'air » ?",o:["Elle joue dans un registre très aigu, au-dessus du chant","Elle utilise un accordage volontairement plus haut","Elle joue sur les contretemps, laissant les temps aux autres","Elle se place systématiquement en retard sur le tempo"],a:2,exp:"La guitare occupe les espaces que les autres laissent vides. Ce partage est la définition même d'un arrangement : chacun sa place dans la mesure, personne ne double le voisin.",xp:30},
];
