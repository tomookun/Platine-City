import type { SectionId } from "./types";

/**
 * Version anglaise des données de jeu. Mêmes identifiants qu'en français :
 * la progression est partagée entre les deux langues.
 */
export const SECTIONS_EN: Record<SectionId, string> = {
  histoire: "Story and heists",
  activites: "Exploration and activities",
  decouverte: "Discovery",
};

type CatEn = { slug: string; name: string; unit: string; description: string };

export const CATEGORIES_EN: Record<string, CatEn> = {
  histoire: {
    slug: "story-missions",
    name: "Story missions",
    unit: "mission",
    description:
      "Main missions in order, chapter by chapter. Sources list between 91 and 93 missions: the ones they disagree on are flagged. Chapter 4 and 5 titles stay hidden while spoiler-free mode is on.",
  },
  taches: {
    slug: "optional-tasks",
    name: "Optional tasks",
    unit: "task",
    description:
      "Small side activities. Meditations and car deliveries count. There are far more than 100.",
  },
  gangs: {
    slug: "gang-operations",
    name: "Gang operations",
    unit: "operation",
    description: "Gang hideouts to clear across the map. All 39 are required.",
  },
  braquages: {
    slug: "bank-jobs",
    name: "Bank jobs",
    unit: "job",
    description: "Each bank has to be fully robbed. All 22 count.",
  },
  prets: {
    slug: "payday-loan-jobs",
    name: "Payday loan jobs",
    unit: "shop",
    description: "The 7 payday loan stores to clean out completely.",
  },
  "casses-eclair": {
    slug: "smash-and-grabs",
    name: "Smash 'n' grabs",
    unit: "job",
    description:
      "Shop windows to smash and empty fast. 34 out of 35 are enough.",
  },
  "hold-up": {
    slug: "store-stick-ups",
    name: "Store stick-ups",
    unit: "stick-up",
    description:
      "50 different stores to rob: hitting the same store twice only counts once.",
  },
  coffres: {
    slug: "bank-vaults",
    name: "Large bank vaults",
    unit: "vault",
    description: "Only large banks have a vault. All 8 are required.",
  },
  kenton: {
    slug: "kenton-sets",
    name: "Kenton sets",
    unit: "set",
    description:
      "5 of 7 sets are enough for 100%, but all 7 unlock every underwater discovery.",
  },
  cartes: {
    slug: "collectible-cards",
    name: "Collectible card sets",
    unit: "set",
    description: "18 sets with 480 cards in total. You need to complete 15.",
  },
  waink: {
    slug: "waink-locations",
    name: "WAiNK locations scanned",
    unit: "location",
    description:
      "Places to scan with the WAiNK phone app. The real total isn't known yet.",
  },
  "sous-marin": {
    slug: "underwater-discoveries",
    name: "Underwater discoveries",
    unit: "discovery",
    description:
      "All are required. You need all 7 Kenton sets to reach every one of them.",
  },
  magazines: {
    slug: "magazines-books-comics",
    name: "Magazines, books and comics",
    unit: "title",
    description:
      "Only unique titles count, no duplicates. Book swaps are part of the total.",
  },
  meditation: {
    slug: "meditation-spots",
    name: "Meditation spots",
    unit: "spot",
    description:
      "15 of 18 spots. Doing them with both Jason and Lucia counts twice.",
  },
  flamants: {
    slug: "cocaine-flamingos",
    name: "Cocaine flamingos destroyed",
    unit: "flamingo",
    description:
      "Only flamingos with a black-and-white beak count. 100 out of 125.",
  },
  playlists: {
    slug: "playlists",
    name: "Unique playlists completed",
    unit: "playlist",
    description: "Both playlists are required.",
  },
  styles: {
    slug: "styles",
    name: "Discovered styles",
    unit: "style",
    description: "Outfits and looks to discover: 70 out of 79.",
  },
  courses: {
    slug: "races",
    name: "Races won",
    unit: "race",
    description: "Win 30 different races out of 40.",
  },
  "defis-course": {
    slug: "race-challenge-gold",
    name: "Race challenge gold medals",
    unit: "medal",
    description:
      "The required number varies between sources (10 or more): to be confirmed in game.",
  },
  tir: {
    slug: "shooting-range-gold",
    name: "Shooting range gold medals",
    unit: "medal",
    description: "Every shooting range challenge with gold.",
  },
  "jeux-video": {
    slug: "video-games",
    name: "Video games played",
    unit: "game",
    description: "Starting each of the 4 games once is enough.",
  },
  billard: {
    slug: "pool-opponents",
    name: "Pool opponents beaten",
    unit: "opponent",
    description: "5 different opponents out of 7.",
  },
  "mini-golf": {
    slug: "mini-golf",
    name: "Mini golf courses",
    unit: "course",
    description:
      "Only the 3 mini golf courses count, not the big golf courses.",
  },
  basket: {
    slug: "basketball-hoops",
    name: "Basketball hoops",
    unit: "hoop",
    description:
      "90 different hoops: scoring 90 times at the same one doesn't count.",
  },
  drones: {
    slug: "drone-time-trials",
    name: "Drone time trials",
    unit: "trial",
    description:
      "All 42 trials are required, with the par time on some of them.",
  },
  cascades: {
    slug: "stunts",
    name: "Stunts",
    unit: "stunt",
    description: "Jumps and stunts: 300 out of 397.",
  },
  defis: {
    slug: "challenges",
    name: "Challenges completed",
    unit: "challenge",
    description: "70 challenges out of 80.",
  },
  bret: {
    slug: "brets-target-decks",
    name: "Bret's target decks",
    unit: "deck",
    description: "All 15 are required.",
  },
  vehicules: {
    slug: "vehicles-scanned",
    name: "Vehicles scanned",
    unit: "vehicle",
    description:
      "Base models only: 200 out of 277. Special “Standout” versions don't count.",
  },
  armes: {
    slug: "weapons",
    name: "Weapons found",
    unit: "weapon",
    description: "Holding each weapon once is enough: 50 out of 66.",
  },
  animaux: {
    slug: "animals",
    name: "Animals studied",
    unit: "animal",
    description: "Every dog and cat breed counts separately. 100 out of 255.",
  },
  reventes: {
    slug: "fenced-goods",
    name: "Fenced goods",
    unit: "goal",
    description:
      "Amounts to reach by selling to the fence. Tick each goal once you hit the amount.",
  },
};

/** Objets dont le libellé est traduit tel quel. */
export const ITEMS_EN: Record<string, { title?: string; where?: string }> = {
  "revente-stupefiants": {
    title: "Narcotics: $100,000",
    where: "In game: Narcotics Fenced",
  },
  "revente-bijoux": {
    title: "Jewelry: $100,000",
    where: "In game: Jewelry Fenced",
  },
  "revente-billets": {
    title: "Marked bills: $250,000",
    where: "In game: Marked Bills Fenced",
  },
  "revente-vehicules": {
    title: "Vehicles: $200,000",
    where: "In game: Vehicles Fenced",
  },
};

/** Notes des missions contestées (partie après « Chapitre N · »). */
export const NOTES_EN: Record<string, string> = {
  "Absente de certaines listes (peut-être une mission secondaire)":
    "Missing from some lists (may be a side mission)",
  "Absente de certaines listes": "Missing from some lists",
  "Titre exact à confirmer (« Girls' Trip » ou « Girls' Trap »)":
    "Exact title to be confirmed (“Girls' Trip” or “Girls' Trap”)",
};
