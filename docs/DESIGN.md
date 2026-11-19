# Design System — « Platine City »

> Nom choisi le 19/11/2026 (domaines visés : platinecity.fr / .com). Le nom et le logo restent sans « GTA » ; le mot-clé « GTA 6 » vit dans les titres et les URL (/gta-6/…). Le site reste un outil de joueur : le design sert la rapidité de lecture d'une main, manette posée sur les genoux.
> Statut : socle validé par contraste, direction A retenue (§9).

## 1. Ambiance
Miami à 21 h : un ciel encore chaud au ras de l'horizon, des enseignes de motel rose et cyan qui s'allument une par une. On ne reproduit pas l'identité de l'éditeur du jeu : pas de dégradé « coucher de soleil » en aplat derrière un logo, pas de lettrage pinceau, pas de palmiers en silhouette, pas de typo ou de mise en page de jaquette.
- Densité 6/10 (« appli du quotidien »), variance 5/10, mouvement 4/10 (réponses aux gestes, une seule séquence d'ouverture).
- Le néon est une **information**, pas un décor : le rose signale ce qu'on peut faire, le cyan ce qui est fait.

## 2. Couleurs (sombre par défaut)
| Jeton | Hex | Rôle | Contraste sur `nuit` |
|---|---|---|---|
| `nuit` | #0D1222 | Fond de page | — |
| `surface` | #161D33 | Feuilles, lignes de liste | — |
| `surface-2` | #1F2842 | Éléments surélevés, barre du bas | — |
| `ligne` | #2B3555 | Séparateurs décoratifs uniquement | 1,55 |
| `contour` | #6B77A3 | Bordure des cases, champs (≥ 3:1 requis) | ≈ 3,6 |
| `sable` | #F4EEE6 | Texte principal | 16,2 |
| `brume` | #A6AEC6 | Texte secondaire, méta | 8,4 |
| `rose` | #FF5C93 | Accent d'action : bouton principal, focus, onglet actif | 6,4 |
| `lagon` | #3DE3D3 | Fait / progression / validé | 11,7 |
| `soleil` | #FFB861 | Statut « rumeur / non vérifié », avertissements | 10,9 |

Règles : texte sur bouton rose ou lagon = `nuit` (6,4 et 11,7). Jamais de noir pur. Le halo néon (`box-shadow` teinté) est réservé à **un seul** élément par écran : l'élément qui vient de changer d'état.
Mode clair (option, V1.1) : `nuit` ↔ #FBF7F2, `sable` ↔ #141A2E, rose foncé #C2185B, lagon foncé #00796F.

## 3. Typographie
Trois pistes testées dans les maquettes (§9) ; le socle commun :
- **Texte courant** : Figtree 400/600, 16 px min (17 px dans les listes), interlignage 1,5, ≤ 65 caractères.
- **Chiffres** : `font-variant-numeric: tabular-nums` partout où un compteur bouge.
- Échelle (ratio 1,25) : 13 · 16 · 20 · 25 · 31 · 39 · 49 px. Titres d'écran 25–31 px ; un seul très grand chiffre par écran (le %).
- Interdits : capitales espacées pour les étiquettes, un mot de titre coloré différemment, dégradé sur le texte.

## 4. Espacements & grille
- Base 4 px ; échelle 4 · 8 · 12 · 16 · 24 · 32 · 48.
- Gouttière mobile 16 px, colonne unique < 768 px, max 1120 px sur desktop (liste + panneau détail).
- Rayons : 6 px (cases, puces), 14 px (feuilles), 999 px (filtres). La hiérarchie se lit aussi dans les rayons.

## 5. Ergonomie une main
- Zone du pouce : navigation, recherche et filtres **en bas** de l'écran. Rien d'important dans le tiers supérieur à part le statut.
- Ligne de checklist ≥ 56 px de haut ; toute la ligne coche (cible ≥ 44 × 44). Case à droite par défaut, réglable gaucher.
- Compteurs (« 147/300 ») : boutons − / + de 48 px, appui long = saisie directe.
- Annuler toujours possible : toast « Cascade 148 cochée · Annuler » pendant 5 s.
- Mode anti-spoiler activé par défaut : noms masqués (« Mission 14 ») jusqu'à ce que l'élément précédent soit coché ; un appui révèle.

## 6. Composants
- **Ligne de checklist** : titre, méta (zone, statut vérifié/rumeur), case. Cochée → texte `brume`, case `lagon`, petit tracé du ✓ (180 ms).
- **Anneau / jauge de catégorie** : progression en `lagon`, piste `ligne`.
- **Badge fiabilité** : « Vérifié 19/11 » (lagon) ou « Rumeur » (soleil), toujours avec date au survol/appui.
- **Barre du bas** : Accueil, Checklist, Recherche, Profil ; onglet actif = texte `sable` + trait rose 3 px.
- **Feuille de filtres** : monte depuis le bas, poignée visible, filtres en pastilles.
- **Emplacement pub** : bloc gris `surface` étiqueté « Publicité », **jamais** avant le premier contenu sur mobile, jamais entre une ligne et sa case.
- **Bandeau newsletter** : en fin de page d'accueil seulement.
- **Mention légale** : pied de page de chaque page — « Site non officiel, non affilié à Rockstar Games ni à Take-Two Interactive. »

## 7. Mouvement
- Réponses aux gestes : cocher (scale 0,96 → 1 + tracé), feuille (ressort, 260 ms), toast (glissement 200 ms).
- Une seule séquence d'ouverture : la jauge globale se remplit au premier affichage de la session.
- Le halo néon s'allume 600 ms sur l'élément qui vient d'atteindre 100 %, puis s'éteint.
- `prefers-reduced-motion` : tout passe en fondu 0 ms.
- Animations sur `transform`/`opacity` uniquement.

## 8. Accessibilité & perf
- AA minimum (contrastes ci-dessus), focus visible rose 2 px + décalage 2 px, cases = vrais `<input type="checkbox">` ou `role="checkbox"` + `aria-checked`.
- Polices auto-hébergées (next/font), sous-ensemble latin, `font-display: swap`. Pas d'image dans les listes. Objectif Lighthouse > 95.

## 9. Direction retenue : A — Enseigne (choisie le 19/11/2026)
- **Titres** : Big Shoulders Display 700/800, condensé, lettrage d'enseigne Art déco. Utilisé pour le nom, les titres d'écran (25–49 px) et le grand % (88 px). Jamais pour du texte courant.
- **Texte** : Figtree 400/600/700.
- **Signature** : le soleil à rayures posé sur l'horizon cyan ; sa hauteur suit le % global (0 % = sous l'horizon, 100 % = disque entier). C'est le seul élément décoratif de l'app.
- **Accueil** : statut de sauvegarde → soleil + % → carte « Reprendre » (dernière catégorie touchée, −/+1) → liste « Ton 100 % » à filets → guides vérifiés → pub → mention légale.
- **Checklist** : titre + compteur en Big Shoulders, barre lagon ; lignes ≥ 64 px entièrement cliquables, case à droite ; barre du bas = filtres (À faire / Faites / Toutes), anti-spoiler, recherche ; toast « Annuler » au-dessus.
- Maquettes de référence : https://claude.ai/artifact/2TQEqyhC9H6DiYGERFVWiC (artboards A).
- Directions écartées : B (Carnet de route, Instrument Serif), C (Tableau de bord, Archivo + JetBrains Mono).
