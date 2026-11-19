# Sources des données de jeu

Les données de `src/data/game.json` sont des **faits** (objectifs du 100 %, nombres requis, totaux, titres des missions), recoupés entre plusieurs sources, puis **reformulés en français**. Aucun texte, liste d'emplacements, carte ni capture n'est copié.

Tant qu'un fait n'est pas confirmé en jeu, il porte le badge « Rumeur, à confirmer » et un lien vers sa source principale.

Régénérer le fichier : `node scripts/build-game-data.mjs src/data/game.json`

## Mise à jour du 19/11/2026 (version 2026-11-19.1)

| Données | Sources consultées | Accord entre sources |
|---|---|---|
| Objectifs du 100 % (32 catégories) | PowerPyx (checklist 100 %), Push Square (checklist 100 %, en cours) | D'accord sauf « Défis de course en or » (10 ou 30 requis) et totaux absents chez Push Square |
| Missions de l'histoire (94 titres) | Push Square (chapitres et missions, en cours), Panstag (d'après PC Gamer) | 91 ou 93 missions selon la source ; 4 titres présents dans une seule liste, signalés dans l'app |

## À vérifier en jeu en priorité

- Nombre exact de missions (chapitre 2) et titres contestés : Thrillbillies, Twist Wrist Smash Grab, Kitty Litter Labs, Caught Slipping, Girls' Trip/Trap.
- Défis de course en or : 10 sur 13 ?
- Total des lieux WAiNK et des tâches optionnelles (inconnus).
- Noms français des objectifs dans le menu du jeu.
