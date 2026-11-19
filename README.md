# Platine City

Checklist 100 % de GTA 6 en français : on coche d'une main, même hors ligne, sans spoilers, avec des infos vérifiées en jeu.

Site non officiel, non affilié à Rockstar Games ni à Take-Two Interactive.

## Stack

Next.js 16 (App Router, Cache Components) · TypeScript · Tailwind CSS 4 · PWA (service worker maison) · Vitest · Supabase (contributions) · Vercel.

## Démarrer

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # tests Vitest
npm run build && npm start   # version de production (service worker actif)
```

## Où sont les choses

| Quoi | Où |
|---|---|
| Données de jeu (à remplacer, `"sample": true`) | `src/data/game.json` |
| Logique de progression / sauvegarde | `src/lib/progress.ts`, `src/lib/storage.ts` |
| Guides (ajouter une entrée, copier `_modele`) | `src/content/guides.ts` |
| Table des contributions | `supabase/migrations/0001_contributions.sql` |
| Design system | `docs/DESIGN.md` |
| Recherche concurrents | `docs/recherche-concurrents.md` |
| Icônes PWA (régénérer) | `node scripts/make-icons.mjs` |

## Variables d'environnement

| Nom | Rôle |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL publique, ex. `https://platinecity.fr` (sitemap, canonical) |
| `SUPABASE_URL` | URL du projet Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé serveur, **secrète**, jamais préfixée `NEXT_PUBLIC_` |
| `NEXT_PUBLIC_SHOW_AD_SLOTS` | `1` pour afficher les emplacements pub (désactivés par défaut) |
