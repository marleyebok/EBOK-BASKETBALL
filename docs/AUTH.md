# « 1 compte, 10 outils » — Préparation du compte unique EBOK

> Document de travail : l'architecture du compte unique (SSO) de la galaxie,
> ce qui est prêt, ce qui reste à faire, et la recette d'intégration par app.
> Complément du plan général : voir `ROADMAP.md` (Phase 2 et 3).

## Le principe

Un visiteur crée **un seul compte EBOK** et il est connecté sur **toutes les
apps de la galaxie**. Techniquement :

1. Toutes les apps vivent en **sous-domaines d'un même domaine racine**
   (`event.ebok-basketball.com`, `video.ebok-basketball.com`…).
2. L'authentification est portée par **Clerk** : le cookie de session est posé
   sur `.ebok-basketball.com` et devient visible par toutes les apps.
3. Les profils vivent dans **une seule table partagée** (`shared.users` dans
   la base Neon), alimentée par un webhook Clerk. Chaque app y fait référence
   par l'identifiant `clerk_id` — jamais de table utilisateurs locale.

```
                    ┌────────────────────┐
                    │       Clerk        │  identité, sessions, login UI
                    └─────────┬──────────┘
              cookie .ebok-basketball.com  +  webhook user.created/updated
        ┌───────────┬─────────┼──────────┬───────────┐
        ▼           ▼         ▼          ▼           ▼
     event.…     video.…   mercato.…  forum.…     (autres)
        │           │         │          │           │
        └───────────┴────┬────┴──────────┴───────────┘
                         ▼
              Neon Postgres — schéma `shared`
              (users) + un schéma par app
```

## État des lieux (audit juillet 2026)

| App | Stack | Système de compte actuel | Chemin de migration |
|---|---|---|---|
| Basketball (mère) | Astro statique | aucun | Rien à migrer : liens « Se connecter » vers les apps |
| Event | HTML/JS + Firebase (`ebok-event-61657`) | Firebase Auth | Remplacer Firebase Auth par Clerk (SDK JS) ; garder Firestore pour les données au début |
| Mercato | HTML/JS + Firebase | Firebase Auth (pages inscription/connexion) | Idem Event |
| Video | Next.js + Prisma | Auth maison (codes de ligue, bcrypt/jose) | Ajouter Clerk pour l'identité ; conserver les codes de ligue comme mécanisme d'accès aux poules |
| Forum | à créer | — | Naît directement avec Clerk (modèle standard) |
| Médias | à créer | — | Annuaire public, compte utile seulement pour proposer une fiche |

## La table partagée `shared.users`

Schéma de référence, à créer dans le projet Neon « ebok » (Phase 2) :

```sql
CREATE SCHEMA IF NOT EXISTS shared;

CREATE TABLE shared.users (
  id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  clerk_id     TEXT UNIQUE NOT NULL,        -- identifiant Clerk (source de vérité)
  email        TEXT UNIQUE NOT NULL,
  pseudo       TEXT,                        -- nom affiché dans la galaxie
  avatar_url   TEXT,
  role         TEXT NOT NULL DEFAULT 'member',  -- member | responsable | admin
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Chaque app crée ensuite SON schéma et référence shared.users, ex. :
--   CREATE SCHEMA event;
--   CREATE TABLE event.inscriptions (
--     user_id BIGINT NOT NULL REFERENCES shared.users(id),
--     ...
--   );
```

Synchronisation : un endpoint webhook (hébergé sur le site d'une app Next.js,
ex. `/api/clerk-webhook`) reçoit les événements Clerk `user.created` /
`user.updated` / `user.deleted` et met à jour `shared.users`.

## Recette d'intégration Clerk (par app)

La même checklist se rejoue pour chaque app, en commençant par l'app pilote
(EBOK Event) :

- [ ] Installer le SDK Clerk adapté (`@clerk/clerk-js` pour les apps
      HTML/JS, `@clerk/nextjs` pour les apps Next.js).
- [ ] Remplacer les boutons « Se connecter / S'inscrire » par les composants
      Clerk (modale de connexion, menu avatar).
- [ ] Protéger les pages « membres » (profil, publication…) derrière la session.
- [ ] Côté serveur/API : vérifier le jeton Clerk au lieu de l'ancien système.
- [ ] Migrer les données : rattacher les contenus existants aux nouveaux
      `clerk_id` (table de correspondance ancienne-identité → nouvelle).
- [ ] Tester : connexion sur l'app A → naviguer vers l'app B → toujours connecté.

## Prérequis qui ne dépendent pas du code (actions Marley)

Sans ces deux actions, rien de ce qui précède ne peut être branché :

1. **Acheter le domaine** `ebok-basketball.com` et brancher les sous-domaines
   sur les projets Vercel (Roadmap Phase 0 et 1).
2. **Créer le compte Clerk** (avec `admin@ebok-basketball.com`), instance de
   production sur le domaine, et créer le **projet Neon « ebok »**.

Ensuite, l'intégration app par app (Phase 2 puis 3) est du ressort du code et
peut être déroulée avec Claude, une app à la fois.

## Le slogan

> **« 1 compte, 10 outils »** — affiché sur le site mère (surtitre du héro)
> et utilisable partout : réseaux sociaux, README, pages d'accueil des apps.
