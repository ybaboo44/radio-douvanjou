# Backend Radio Douvanjou

L’application utilise une API Vercel (adaptateur dans `../api/[...path].ts`, logique serveur dans `server/`) et PostgreSQL. Les tables nécessaires sont créées automatiquement au premier appel de l’API.

## Configuration Vercel

1. Crée une base PostgreSQL, par exemple avec Neon ou Supabase, et copie sa chaîne de connexion TLS.
2. Dans **Vercel → projet → Settings → Environment Variables**, ajoute :
   - `POSTGRES_URL` : chaîne de connexion de PostgreSQL.
   - `ADMIN_EMAIL` : adresse du premier compte Super Admin.
   - `ADMIN_PASSWORD` : mot de passe unique d’au moins 12 caractères. N’utilise pas un mot de passe court ou réutilisé.
3. Applique ces variables à l’environnement Production (et Preview si nécessaire), puis redéploie.
4. Connecte-toi à `/admin/login` avec `ADMIN_EMAIL` et `ADMIN_PASSWORD`. La première requête initialise les tables et crée ce compte s’il n’existe pas.

Ne mets jamais de vraies valeurs de connexion dans Git. Pour changer le mot de passe initial, utilise l’administration des utilisateurs après avoir créé le compte.

## Développement local

Copie `backend/.env.example` vers `.env.local` à la racine du dépôt, complète `POSTGRES_URL` et remplace le mot de passe d’exemple par un secret fort et unique. L’adresse de bootstrap indiquée est `admin@radiodouvanjou.com`. Ne partage pas le mot de passe et ne le committe pas. Démarre ensuite les fonctions Vercel avec :

```sh
npm run dev:vercel
```

Depuis le dossier `backend/`, les commandes disponibles sont `npm run dev`, `npm run build`, `npm run typecheck` et `npm run lint`. Le script de développement appelle la configuration Vercel de la racine du dépôt.

Le seul `npm run dev` démarre Vite sans les fonctions API. `POSTGRES_URL` doit pointer vers une base PostgreSQL joignable depuis l’ordinateur.

## Fonctions incluses

- Sessions d’administration dans des cookies `HttpOnly`, mots de passe hachés avec scrypt, limitation des tentatives de connexion et autorisations revérifiées par l’API.
- Paramètres du site partagés, comptes administrateurs, flux et fiches de podcasts persistés dans PostgreSQL.
- Contenus éditoriaux persistés et servis aux pages publiques; les articles brouillons ne sont pas retournés au public.
- Les mots de passe temporaires sont affichés une seule fois à l’administrateur qui les réinitialise. Aucun service d’e-mail n’est configuré.

La création et la modification des flux sont disponibles. La synchronisation automatique des flux RSS et l’import des épisodes nécessitent encore un parseur RSS et une tâche planifiée; l’API répond explicitement qu’elle n’est pas configurée plutôt que de prétendre avoir effectué une synchronisation.
