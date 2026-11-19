// Génère app/src/data/game.json à partir de faits recoupés (reformulés, jamais copiés).
import { writeFileSync } from "node:fs";

const out = process.argv[2];
const DATE = "2026-11-19";
const PP = "https://www.powerpyx.com/gta-6-100-completion-checklist-guide/";
const PSM = "https://www.pushsquare.com/guides/gta-6-chapters-and-story-missions";
const PAN = "https://www.panstag.com/2026/11/gta-6-missions-list-hours-to-beat.html";
const rumor = (source) => ({ status: "rumor", source });

// --- Missions de l'histoire (titres du jeu, ordre recoupé sur 2 sources) ---
const chapters = [
  ["Prologue", "Gone Fishing", "Gear Up", "Just a Scratch", "Lab Fees", "Unwanted Attention", "Pipework", "Hey Arnold!", "Island Dreams", "Feng Shui", "Coming Home", "Buck Me", "Clean Up After Donnie", "Down to Earth", "Clear Skies", "Day Release", "Swamped", "Don Gone", "Recalibration", "Tourist Trap", "Home Sweet Home", "Discharge Time"],
  ["What's in the Bag?", "Ambulance Chaser", "Just Moved In", "Girls' Trip", "Moses", "Daily Driver", "Slam Dunk", "Breakfast Run", "Coffee Break", "Afternoon Delight", "Thrillbillies", "Twist Wrist, Smash, Grab", "Checking Out"],
  ["Welcome to Vice City", "Dealer's Choice", "Meet the Heders", "Dubious Provenance", "Mami Knows Best", "South Leonida Real Estate", "Tyrone", "Here, Kitty Kitty", "Kitty Litter Labs", "Car Service", "Top Billing", "Boobie Time", "First Impressions", "Caught Slipping", "Crosstown Traffic", "Credit Check", "Steal the Zorrusso for Randy", "Sinfrontera National Bank", "Security Expert", "Ride or Die", "Company Property", "The Missing Link", "Safe Word", "Cooties", "Bricked Up", "Hidden Charges", "The Cartel Heist"],
  ["Ocean Beach", "Another Life", "Company Cars", "Lawyer Up", "Party Hard", "Heavy Lifting", "Photo/Shoot", "Making Gainz", "Watch It", "Cash Injections", "Amateur Hour", "Dirty Work", "Too Much Baggage", "Adventures in Babysitting", "Fresh Evidence", "Power Play", "Child's Play", "Headliners", "Close Surveillance", "Delivery Method", "Team Building", "Fully Catered", "VCIA Takedown", "Sunset", "Starting from Zero"],
  ["Bird in the Hand", "Taking Liberties", "VC Baby", "Doggie Bag", "Operation Savage Glory", "Protective Custody", "The End of the Road"],
];
// Présentes dans une seule des deux listes : à confirmer en jeu.
const disputed = {
  "Thrillbillies": "Absente de certaines listes (peut-être une mission secondaire)",
  "Twist Wrist, Smash, Grab": "Absente de certaines listes (peut-être une mission secondaire)",
  "Kitty Litter Labs": "Absente de certaines listes",
  "Caught Slipping": "Absente de certaines listes",
  "Girls' Trip": "Titre exact à confirmer (« Girls' Trip » ou « Girls' Trap »)",
};
const slugify = (s) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
let n = 0;
const missions = chapters.flatMap((titles, c) =>
  titles.map((title) => {
    n += 1;
    const note = disputed[title];
    return {
      id: `mission-${slugify(title)}`,
      n,
      title,
      where: note ? `Chapitre ${c + 1} · ${note}` : `Chapitre ${c + 1}`,
      ...(c >= 3 ? { spoiler: true } : {}),
      reliability: rumor(note ? PAN : PSM),
    };
  }),
);

// --- Objectifs du 100 % : [id, slug, nom FR, unité, requis, total|null, section, libellé jeu, description] ---
const goals = [
  ["taches", "taches-optionnelles", "Tâches optionnelles", "tâche", 100, null, "histoire", "Optional Tasks Completed", "Petites activités annexes. Les méditations et les livraisons de voitures en font partie. Il en existe bien plus que 100."],
  ["gangs", "operations-de-gangs", "Opérations contre les gangs", "opération", 39, 39, "histoire", "Gang Operations Cleared", "Repaires de gangs à nettoyer sur la carte. Les 39 sont nécessaires."],
  ["braquages", "braquages-de-banque", "Casses de banques", "casse", 22, 22, "histoire", "Bank Jobs Fully Completed", "Chaque banque doit être braquée jusqu'au bout. Les 22 comptent."],
  ["prets", "prets-sur-salaire", "Boutiques de prêts sur salaire", "boutique", 7, 7, "histoire", "Payday Loan Jobs Fully Completed", "Les 7 officines de prêt à dévaliser entièrement."],
  ["casses-eclair", "casses-eclair", "Casses éclair", "casse", 34, 35, "histoire", "Smash 'N' Grabs Fully Completed", "Vitrines à défoncer et vider en vitesse. 34 suffisent sur 35."],
  ["hold-up", "hold-up-magasins", "Hold-up de magasins", "hold-up", 50, 91, "histoire", "Stick Ups Fully Completed", "50 commerces différents à braquer : refaire le même magasin ne compte qu'une fois."],
  ["coffres", "coffres-forts", "Coffres-forts de grandes banques", "coffre", 8, 8, "histoire", "Vaults Hit", "Seules les grandes banques ont un coffre. Les 8 sont requis."],
  ["kenton", "sets-kenton", "Sets Kenton", "set", 5, 7, "activites", "Kenton Sets Completed", "5 sets sur 7 suffisent pour le 100 %, mais les 7 servent à débloquer toutes les découvertes sous-marines."],
  ["cartes", "cartes-a-collectionner", "Sets de cartes à collectionner", "set", 15, 18, "activites", "Collectible Card Sets Found", "18 sets pour 480 cartes au total. Il faut en compléter 15."],
  ["waink", "lieux-waink", "Lieux scannés avec WAiNK", "lieu", 100, null, "activites", "WAiNK Locations Scanned", "Lieux à scanner avec l'appli WAiNK du téléphone. Le total réel n'est pas encore connu."],
  ["sous-marin", "decouvertes-sous-marines", "Découvertes sous-marines", "découverte", 33, 33, "activites", "Underwater Discoveries Found", "Toutes sont requises. Il faut avoir fini les 7 sets Kenton pour y accéder entièrement."],
  ["magazines", "magazines-livres-bd", "Magazines, livres et BD", "titre", 30, 34, "activites", "Magazines, Books & Comics Found", "Seuls les titres différents comptent, doublons exclus. Les échanges de livres font partie du total."],
  ["meditation", "spots-de-meditation", "Spots de méditation", "spot", 15, 18, "activites", "Meditation Spots Completed", "15 spots sur 18. Les faire avec Jason puis avec Lucia compte double."],
  ["flamants", "flamants-cocaine", "Flamants à cocaïne détruits", "flamant", 100, 125, "activites", "Cocaine Flamingos Destroyed", "Seuls les flamants au bec noir et blanc comptent. 100 sur 125."],
  ["playlists", "playlists", "Playlists uniques terminées", "playlist", 2, 2, "activites", "Unique Playlists Completed", "Les 2 playlists sont requises."],
  ["styles", "styles", "Styles découverts", "style", 70, 79, "activites", "Discovered Styles", "Tenues et looks à découvrir : 70 sur 79."],
  ["courses", "courses", "Courses gagnées", "course", 30, 40, "activites", "Unique Races Won", "30 courses différentes à remporter sur 40."],
  ["defis-course", "defis-de-course-or", "Défis de course en or", "médaille", 10, 13, "activites", "Race Challenge Gold Medals", "Le nombre requis varie selon les sources (10 ou plus) : à confirmer en jeu."],
  ["tir", "stand-de-tir-or", "Médailles d'or au stand de tir", "médaille", 42, 42, "activites", "Shooting Range Gold Medals", "Toutes les épreuves du stand de tir en or."],
  ["jeux-video", "jeux-video", "Jeux vidéo joués", "jeu", 4, 4, "activites", "Video Games Played", "Lancer chacun des 4 jeux une fois suffit."],
  ["billard", "billard", "Adversaires battus au billard", "adversaire", 5, 7, "activites", "Pool Opponents Defeated", "5 adversaires différents sur 7."],
  ["mini-golf", "mini-golf", "Parcours de mini-golf", "parcours", 2, 3, "activites", "Mini Golf Locations Played", "Seuls les 3 mini-golfs comptent, pas les grands parcours de golf."],
  ["basket", "paniers-de-basket", "Paniers de basket", "panier", 90, 100, "activites", "Basketball Hoops", "90 paniers différents : marquer 90 fois au même endroit ne compte pas."],
  ["drones", "courses-de-drones", "Contre-la-montre en drone", "épreuve", 42, 42, "activites", "Drone Time Trials Completed", "Les 42 épreuves sont requises, avec le temps de référence sur une partie d'entre elles."],
  ["cascades", "cascades", "Cascades", "cascade", 300, 397, "activites", "Stunts Completed", "Sauts et cascades : 300 sur 397."],
  ["defis", "defis", "Défis terminés", "défi", 70, 80, "activites", "Challenges Completed", "70 défis sur 80."],
  ["bret", "cibles-de-bret", "Cibles de Bret", "cible", 15, 15, "activites", "Bret's Target Decks", "Les 15 sont requises."],
  ["vehicules", "vehicules-scannes", "Véhicules scannés", "véhicule", 200, 277, "decouverte", "Base Model Vehicles Scanned", "Modèles de base uniquement : 200 sur 277. Les versions spéciales (« Standout ») ne comptent pas."],
  ["armes", "armes", "Armes trouvées", "arme", 50, 66, "decouverte", "Standard Issue Weapons Found", "Tenir chaque arme en main une fois suffit : 50 sur 66."],
  ["animaux", "animaux", "Animaux étudiés", "animal", 100, 255, "decouverte", "Animals Studied", "Chaque race de chien et de chat compte à part. 100 sur 255."],
];

const categories = [
  {
    id: "histoire", slug: "histoire", name: "Missions de l'histoire", unit: "mission",
    section: "histoire", required: missions.length, total: missions.length, gameLabel: "Story",
    description: "Les missions principales dans l'ordre, chapitre par chapitre. Les sources annoncent entre 91 et 93 missions : celles qui ne font pas l'unanimité sont signalées. Les titres des chapitres 4 et 5 sont masqués par l'anti-spoiler.",
    reliability: rumor(PSM),
    items: missions,
  },
  ...goals.map(([id, slug, name, unit, required, total, section, gameLabel, description]) => ({
    id, slug, name, unit, section, required,
    total: total ?? required,
    ...(total == null ? { totalKnown: false } : {}),
    gameLabel, description,
    reliability: rumor(PP),
    items: [],
  })),
  {
    id: "reventes", slug: "reventes", name: "Reventes au receleur", unit: "objectif",
    section: "histoire", required: 4, total: 4, gameLabel: "Fenced",
    description: "Montants à atteindre en revendant au receleur. Coche chaque objectif une fois le montant atteint.",
    reliability: rumor(PP),
    items: [
      ["stupefiants", "Stupéfiants : 100 000 $", "Narcotics Fenced"],
      ["bijoux", "Bijoux : 100 000 $", "Jewelry Fenced"],
      ["billets", "Billets marqués : 250 000 $", "Marked Bills Fenced"],
      ["vehicules", "Véhicules : 200 000 $", "Vehicles Fenced"],
    ].map(([k, title, label], i) => ({ id: `revente-${k}`, n: i + 1, title, where: `Dans le jeu : ${label}`, reliability: rumor(PP) })),
  },
];

const data = {
  version: `${DATE}.1`,
  sample: false,
  updatedAt: DATE,
  sections: [
    { id: "histoire", name: "Histoire et casses" },
    { id: "activites", name: "Exploration et activités" },
    { id: "decouverte", name: "Découverte" },
  ],
  categories,
};
writeFileSync(out, JSON.stringify(data, null, 2) + "\n");
console.log(`${categories.length} catégories, ${missions.length} missions, objectif total ${categories.reduce((a, c) => a + c.required, 0)}`);
