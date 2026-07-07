# EBOK Basketball — site vitrine

Page d'accueil (une seule page, 100 % statique) de l'écosystème **EBOK
Basketball** : la « boîte à outils des basketteurs » francophones. Les 9 outils
de la galaxie sont présentés sous forme de **système solaire** — un ballon de
basket au centre (le hub EBOK) et les outils qui gravitent autour sur trois
anneaux d'orbite.

Construit avec **[Astro](https://astro.build/)** : rendu statique, rapide,
SEO-friendly, sans dépendance runtime superflue.

---

## Prérequis

- **Node.js ≥ 22.12** (voir `netlify.toml` / `package.json`)
- **npm** (fourni avec Node)

## Installation

```bash
npm install
```

## Scripts

| Commande          | Effet                                                        |
| ----------------- | ------------------------------------------------------------ |
| `npm run dev`     | Serveur de développement avec rechargement à chaud (`localhost:4321`) |
| `npm run build`   | Build de production statique dans `dist/`                    |
| `npm run preview` | Sert localement le contenu de `dist/` (aperçu du build)      |

---

## Déploiement

Le site est **entièrement statique** : n'importe quel hébergeur statique
convient. La sortie du build se trouve dans `dist/`.

- **Netlify** — la config est déjà prête (`netlify.toml`). Connecte le dépôt,
  Netlify détecte tout seul (`build` → `npm run build`, publication → `dist`).
- **Vercel** — importe le dépôt ; framework « Astro » détecté automatiquement.
  Sinon : build `npm run build`, output `dist`.
- **Cloudflare Pages** — build `npm run build`, dossier de sortie `dist`.

> ⚠️ Avant la mise en ligne, renseigne le vrai domaine dans `astro.config.mjs`
> (`site: 'https://...'`). Il sert aux URL canoniques et aux balises Open Graph.

---

## Structure du projet

```
EBOK-BASKETBALL/
├── astro.config.mjs        # config Astro (domaine, sortie statique)
├── netlify.toml            # config de déploiement Netlify
├── public/                 # assets servis tels quels
│   ├── favicon.svg         # favicon (ballon néon)
│   └── og-image.svg        # image de preview Open Graph
├── src/
│   ├── data/
│   │   └── tools.ts        # ⭐ SOURCE DE VÉRITÉ : les 9 outils
│   ├── layouts/
│   │   └── BaseLayout.astro # <head>, SEO/OG, polices, styles globaux
│   ├── components/
│   │   ├── Header.astro        # logo centré
│   │   ├── Logo.astro          # logo EBOK Basketball (SVG)
│   │   ├── Hero.astro          # titre + sous-titre
│   │   ├── SolarSystem.astro   # ballon + orbites + placement des bulles
│   │   ├── ToolBubble.astro    # une bulle d'outil + sa pop-up
│   │   ├── ContactSection.astro
│   │   └── Footer.astro
│   ├── styles/
│   │   └── global.css      # tokens, fond, header, hero, contact, footer
│   └── pages/
│       └── index.astro     # assemble la page
└── README.md
```

---

## Ajouter / modifier / retirer un outil

**Tout se passe dans un seul fichier : [`src/data/tools.ts`](src/data/tools.ts).**
Aucune modification de HTML n'est nécessaire — les composants lisent ces
données pour dessiner les bulles, les pop-ups, les statuts et les orbites.

### Changer un statut

Modifie le champ `status` de l'outil concerné :

- `'on'` → **En ligne** (pastille verte)
- `'dev'` → **En développement** (pastille orange)
- `'off'` → **Bientôt** (pastille rouge)

### Brancher le vrai sous-site

Renseigne le champ `url` (par ex. `'https://video.ebok.fr'`). Tant qu'il vaut
`'#'`, la bulle ne mène nulle part.

### Ajouter un outil

Ajoute un objet dans le tableau `TOOLS` :

```ts
{
  id: 'monoutil',
  name: 'MONOUTIL',
  color: '#5cc0ff',
  status: 'off',
  description: 'Une phrase de présentation.',
  url: '#',
  angle: 20,          // position angulaire sur l'orbite (° depuis le haut)
  ring: 'outer',      // 'inner' | 'middle' | 'outer'
}
```

Le placement (`angle` + `ring`) est libre : espace les angles pour éviter les
chevauchements. Les rayons des trois anneaux se règlent dans la constante
`RINGS` du même fichier.

---

## Accessibilité & performance

- Contrastes soignés, focus clavier visible, structure sémantique
  (`header`/`main`/`section`/`footer`).
- `prefers-reduced-motion` respecté : rotation du ballon, halo et ondes
  désactivés si l'utilisateur le demande.
- Polices **Anton** (titres) et **Inter** (corps) self-hostées via
  `@fontsource` — pas d'appel à Google Fonts au runtime.
- Aucun JavaScript côté client : les interactions (survol, pop-ups, ondes)
  sont 100 % CSS.

Voir [`NOTES.md`](NOTES.md) pour les choix techniques et les points d'attention
pour la suite (sous-domaines des outils, futur « EBOK ID »).
