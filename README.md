# EBOK Basketball — site vitrine

Page d'accueil (une seule page, 100 % statique) de l'écosystème **EBOK
Basketball** : la « boîte à outils des basketteurs » francophones. Les 9 outils
sont présentés dans une **grille de cartes** épurée ; chaque carte affiche le
logo de l'outil, un statut discret, et révèle sa description au survol (desktop)
ou au clic (mobile). Chaque outil pointe vers son propre site.

Construit avec **[Astro](https://astro.build/)** : rendu statique, rapide,
SEO-friendly. Thème clair, aucune dépendance runtime superflue.

---

## Prérequis

- **Node.js ≥ 22.12**
- **npm**

## Installation

```bash
npm install
```

## Scripts

| Commande          | Effet                                                        |
| ----------------- | ------------------------------------------------------------ |
| `npm run dev`     | Serveur de développement (`localhost:4321`)                  |
| `npm run build`   | Build de production statique dans `dist/`                    |
| `npm run preview` | Sert localement le contenu de `dist/`                        |

---

## Déploiement

Site **entièrement statique** (sortie dans `dist/`).

- **Vercel** — importe le dépôt ; framework « Astro » détecté automatiquement.
- **Netlify** — config prête (`netlify.toml`).
- **Cloudflare Pages** — build `npm run build`, dossier `dist`.

> ⚠️ Renseigne le vrai domaine dans `astro.config.mjs` (`site`) avant la mise en
> ligne (URL canoniques + Open Graph).

---

## Structure

```
src/
├── data/
│   └── tools.ts            # ⭐ SOURCE DE VÉRITÉ : les 9 outils
├── layouts/
│   └── BaseLayout.astro    # <head>, SEO/OG, polices, styles globaux
├── components/
│   ├── Header.astro        # logo centré
│   ├── Logo.astro          # logo « EBOK BASKETBALL » (marque)
│   ├── ToolLogo.astro      # logo « EBOK <NOM> » d'un outil (100 % CSS)
│   ├── Hero.astro          # surtitre + titre + sous-titre
│   ├── ToolGrid.astro      # grille + script d'ouverture au clic (mobile)
│   ├── ToolCard.astro      # une carte : logo + statut + description
│   ├── ContactSection.astro
│   └── Footer.astro
├── styles/
│   └── global.css          # thème clair, logo, cartes, sections
└── pages/
    └── index.astro
public/
├── favicon.svg
├── og-image.svg            # aperçu Open Graph (placeholder — voir NOTES.md)
└── logos/                  # les 10 logos en PNG HD (fond transparent)
```

---

## Ajouter / modifier / retirer un outil

**Tout se passe dans [`src/data/tools.ts`](src/data/tools.ts).** Aucune
modification de HTML nécessaire.

### Changer un statut
Modifie `status` : `'on'` (En ligne, vert), `'dev'` (En développement, orange),
`'off'` (Bientôt, gris).

### Brancher le vrai sous-site
Renseigne `url` (ex. `'https://video.ebok.fr'`). Tant qu'il vaut `'#'`, le lien
« Voir l'outil » ne mène nulle part.

### Ajouter un outil
Ajoute un objet au tableau `TOOLS` :

```ts
{
  id: 'monoutil',
  name: 'MONOUTIL',      // affiché dans le logo (préfixe « EBOK » ajouté par l'UI)
  color: '#5cc0ff',      // couleur propre (logo + accents)
  status: 'off',
  description: 'Une phrase de présentation.',
  url: '#',
}
```

Le logo de l'outil est **généré automatiquement** en CSS à partir de `name` +
`color` (composant `ToolLogo`) — rien d'autre à créer.

---

## À propos des logos

Les logos sont **rendus en CSS** (police Anton) via `ToolLogo.astro` : nets à
toute taille, sans image. Le dossier [`public/logos/`](public/logos/) contient
en plus une **export PNG HD à fond transparent** de chaque logo (pour usage
hors-site : réseaux sociaux, documents…).

Voir [`NOTES.md`](NOTES.md) pour les choix techniques et les points d'attention
(sous-domaines des outils, futur « EBOK ID », image Open Graph).
