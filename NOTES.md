# Notes techniques — EBOK Basketball

## Choix techniques (et pourquoi)

### Astro plutôt que du HTML/CSS/JS vanilla

Le périmètre est une page unique statique, mais le projet est pensé pour
**grandir** (une galaxie d'outils, de futurs sous-sites, un compte unique…).
Astro apporte ce qu'un fichier unique ne permet pas proprement :

- **Composants réutilisables** (`Header`, `Hero`, `SolarSystem`, `ToolBubble`,
  `ContactSection`, `Footer`) — la demande explicite du cahier des charges.
- **Données centralisées** en TypeScript (`src/data/tools.ts`) : ajouter,
  retirer ou modifier un outil = éditer un seul fichier, jamais du HTML.
- **Zéro JavaScript expédié au navigateur** par défaut : Astro pré-rend tout en
  HTML/CSS. La page reste ultra-légère (bon pour Lighthouse).
- **Config de déploiement triviale** vers Netlify / Vercel / Cloudflare Pages.

Si le site devait rester éternellement figé à une page sans évolution, du
vanilla organisé aurait suffi. Ce n'est pas le pari ici.

### Aucun JavaScript client

Toutes les interactions décrites (rotation du ballon, halo « respirant », ondes
concentriques des statuts, ouverture des pop-ups au survol, bascule
desktop → grille mobile) sont réalisées **uniquement en CSS**. Résultat : pas
de JS bloquant, pas d'hydratation, un rendu instantané et accessible.

### Styles : CSS natif + variables

Pas de framework CSS. Les **variables CSS** portent la charte (palette polaire,
polices, statuts). Les styles globaux vivent dans `src/styles/global.css` ; le
système solaire et les bulles portent leurs styles *scoped* dans leur composant.

Le CSS des bulles est écrit **mobile-first** : par défaut une carte lisible
(description visible, pas de survol requis sur tactile) ; le comportement
« infobulle flottante sur orbite » est ajouté au-dessus de 720 px. Cela évite
toute fuite de spécificité entre les deux dispositions.

### Polices self-hostées

**Anton** (titres/logo) et **Inter** (corps) sont servies via les paquets
`@fontsource`, donc **self-hostées** : pas de dépendance à Google Fonts au
runtime (meilleure perf, meilleure vie privée, build reproductible hors-ligne).

### Le logo en SVG

Le fichier `EBOK_Basketball_Logo_transparent.png` n'ayant pas été fourni, le
logo a été **recréé en SVG vectoriel** (`src/components/Logo.astro`) :
transparent, net à toute taille, ultra-léger. Pour utiliser le vrai fichier de
marque, dépose-le dans `public/` et remplace le `<svg>` par une balise `<img>`
(instructions dans le composant).

### Le ballon de basket

Sphère blanche + coutures tracées en **SVG** (trait bleu néon, style « à main
levée » via des courbes de Bézier asymétriques). La sphère et ses coutures
tournent ensemble (20 s/tour) ; le texte central « EBOK / Basketball » est un
calque **séparé et fixe**, avec plaque de lisibilité et ombres portées.

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
  optionnel `external: true` aux données et l'exploiter dans `ToolBubble.astro`
  (`target="_blank" rel="noopener"`).

### 2. Remplacer l'image Open Graph

`public/og-image.svg` est un **placeholder** vectoriel. Beaucoup de plateformes
sociales n'affichent pas les OG en SVG : générer une **image PNG/JPG 1200×630**
et mettre à jour le chemin dans `BaseLayout.astro` avant une campagne de partage.

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

- Le placement des bulles (`angle` + `ring`) est paramétrable ; en cas d'ajout
  au-delà de 9 outils, vérifier qu'aucune bulle ne chevauche une autre en
  desktop (largeur des badges vs rayon d'orbite).
- Pour un multilingue éventuel, externaliser les libellés d'interface (hero,
  contact, footer) dans un fichier de données comme les outils.
