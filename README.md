# Radio Télévision Douvanjou

Site éditorial réalisé avec React, TypeScript et Vite. Le backend utilise des fonctions Vercel et une base PostgreSQL.

## Organisation

- `frontend/` contient l’application React, ses ressources statiques et sa configuration Vite.
- `backend/` contient le code serveur, la configuration PostgreSQL et les instructions de configuration.
- `api/` conserve le petit adaptateur requis par les fonctions Vercel.

## Développement

- `npm run dev` démarre uniquement le frontend Vite.
- `npm run dev:vercel` démarre le site et les fonctions API. Configure d’abord `.env.local` avec les variables de `backend/.env.example`.
- `npm run build` compile le frontend et vérifie aussi le code de l’API.
- Depuis `frontend/`, `npm run` affiche les commandes du frontend; `npm run build` vérifie le projet complet.
- Depuis `backend/`, `npm run` affiche les commandes du backend; `npm run dev` démarre Vercel depuis la racine du projet.

La configuration de la base, la création du premier compte administrateur et le déploiement sont décrits dans [backend/README.md](./backend/README.md).
