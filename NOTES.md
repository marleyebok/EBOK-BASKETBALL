# Notes techniques — EBOK Basketball

## Choix techniques (et pourquoi)

### Astro plutôt que du HTML/CSS/JS vanilla

Le périmètre est une page unique statique, mais le projet est pensé pour
**grandir** (une galaxie d'outils, de futurs sous-sites, un compte unique…).
Astro apporte ce qu'un fichier unique ne permet pas proprement :

- **Composants réutilisables** (`Header`, `Hero`, `ToolGrid`, `ToolCard`,
  `ToolLogo`, `ContactSection`, `Footer`).
- **Données centralisées** en TypeScript (`src/data/tools.ts`) : ajouter,
  retirer ou modifier un outil = éditer un seul fichier, jamais du HTML.
- **Zéro JavaScript expédié au navigateur** par défaut : Astro pré-rend tout en
  HTML/CSS. La page reste ultra-légère (bon pour Lighthouse).
- **Config de déploiement triviale** vers Netlify / Vercel / Cloudflare Pages.

Si le site devait rester éternellement figé à une page sans évolution, du
vanilla organisé aurait suffi. Ce n'est pas le pari ici.

### Presque aucun JavaScript client

La quasi-totalité des interactions (survol des cartes, glissé de la description,
statut) est en **CSS pur**. Le seul script (`ToolGrid.astro`, quelques lignes)
gère l'**ouverture au clic sur mobile** : le survol n'existant pas au tactile,
un clic bascule une classe `.open` pour afficher la description en place. Rien
de bloquant, pas d'hydratation lourde.

### Styles : CSS natif + variables

Pas de framework CSS. Les **variables CSS** portent la charte (palette claire,
polices, statuts) dans `src/styles/global.css`. Le rayon des coins du logo est
piloté par une seule variable `--r`.

Le CSS des cartes prévoit les deux modes : **desktop** (description en infobulle
qui glisse au survol) et **mobile** (< 640 px : description masquée puis ouverte
au clic, indice « Détails » visible). Thème **clair uniquement**, choix assumé.

### Polices self-hostées

**Anton** (titres/logo) et **Inter** (corps) sont servies via les paquets
`@fontsource`, donc **self-hostées** : pas de dépendance à Google Fonts au
runtime (meilleure perf, meilleure vie privée, build reproductible hors-ligne).

### Les logos en CSS (composant `ToolLogo`)

Chaque logo « EBOK <NOM> » est **rendu en CSS** (police Anton) à partir d'un nom
et d'une couleur : deux blocs flex (bloc coloré « EBOK » + nom), avec une forme
précise pilotée par `border-radius` (coins haut-gauche / bas-droite arrondis,
bas-gauche / haut-droite droits ; séparation droite en haut, arrondie en bas).
Avantages : net à toute taille, largeur auto-ajustée au texte, une seule source
pour la marque et les 9 outils, aucune image à maintenir.

Un **export PNG HD à fond transparent** de chaque logo est fourni dans
`public/logos/` pour les usages hors-site (réseaux sociaux, documents).

### La grille de cartes

Grille responsive (`repeat(auto-fill, minmax(300px, 1fr))`). Chaque carte porte
le logo de l'outil, un **statut discret** (coin haut-droit, code couleur
vert/orange/gris) et une description révélée par animation. La carte n'est pas
un lien : c'est le lien « Voir l'outil » de la description qui mène au site
externe — indispensable pour permettre l'ouverture au clic sur mobile.

### Version d'Astro

Le projet a été démarré sur **Astro 7** (dernière majeure) pour partir sur une
base à jour et un `npm audit` propre (0 vulnérabilité).

---

## Points d'attention pour la suite

### 1. Brancher les vrais sous-domaines des outils

Chaque outil possède déjà un champ **`url`** dans `src/data/tools.ts`
(actuellement `'#'`). Le jour où un sous-site existe, il suffit d'y mettre son
adresse, par ex. :

```ts
{ id: 'video', /* … */ url: 'https://video.ebok.fr' }
```

Recommandations quand les sous-sites arriveront :

- **Convention de sous-domaines** claire et homogène :
  `video.ebok.fr`, `playbook.ebok.fr`, `event.ebok.fr`, … Cette page-hub reste
  sur le domaine racine (`ebok.fr` / `www`).
- Penser à renseigner **`site`** dans `astro.config.mjs` avec le domaine racine
  définitif (URL canoniques + Open Graph).
- Si certains outils ouvrent dans un nouvel onglet, on pourra ajouter un champ
  optionnel `external: true` aux données et l'exploiter dans `ToolCard.astro`
  (`target="_blank" rel="noopener"`).

### 2. Image de partage, SEO & analytics

- **Open Graph** : `public/og-image.png` (1200×630) est en place, généré au
  branding actuel. À régénérer si le branding change.
- **SEO** : `sitemap-index.xml` (build), `robots.txt`, et JSON-LD `Organization`
  dans le `<head>`. Pensez à mettre `site` (dans `astro.config.mjs`) et le
  domaine du `robots.txt` à jour avec le domaine définitif.
- **Analytics** : Plausible câblé mais **désactivé** tant que
  `plausibleDomain` (dans `src/config.ts`) est vide — voir le README.
- **Accès anticipé** : la page `/acces-anticipe` collecte e-mail + outils
  souhaités. Repli `mailto:` par défaut ; brancher Formspree via `config.ts`
  pour une vraie collecte.

### 3. Préparer un compte unique « EBOK ID »

La page est aujourd'hui **100 % statique, sans backend** — et doit le rester à
ce stade. Pour un identifiant unique partagé entre tous les outils plus tard :

- **Auth centralisée** : un fournisseur d'identité unique (ex. service OAuth /
  OpenID Connect maison, ou une solution type Clerk/Auth0/Supabase Auth) hébergé
  sur `id.ebok.fr`, que chaque sous-site interroge. On évite de dupliquer la
  logique d'auth par outil.
- **Session inter-sous-domaines** : cookies de session posés sur le domaine
  parent (`.ebok.fr`) pour être partagés par tous les sous-domaines, ou flux
  SSO par redirection/token.
- **Impact sur cette page** : minime. On pourra ajouter au hub un bouton
  « Se connecter / Mon EBOK ID » pointant vers `id.ebok.fr`. Si un jour on veut
  afficher l'état connecté ici, il faudra introduire un petit îlot interactif
  (Astro island) ou passer la page en rendu hybride — mais rien de tel n'est
  nécessaire tant qu'on reste sur une vitrine statique.
- **Anticiper côté données** : le modèle actuel (`Tool`) pourra accueillir des
  champs de contrôle d'accès (ex. `requiresAuth`, `plan`) sans refonte.

### 4. Divers

- La grille s'adapte automatiquement au nombre d'outils (auto-fill) : ajouter
  un outil ne demande qu'une entrée dans `tools.ts`.
- Pour un multilingue éventuel, externaliser les libellés d'interface (hero,
  contact, footer) dans un fichier de données comme les outils.
