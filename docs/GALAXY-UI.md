# Éléments d'interface communs à la galaxie EBOK

Deux décisions valables pour **toutes** les applications de la galaxie
(`video`, `mercato`, `playbook`, `event`, `medias`, `forum`, `workout`, …) :

| Élément | Statut | Fichier |
| --- | --- | --- |
| Barre galaxie (menu déroulant en haut de page) | ❌ **retirée** | `ebok-galaxy.js` |
| Pied de page galaxie (logo + logos défilants) | ✅ **partout** | `ebok-footer.js` |

## 1. La barre galaxie est retirée

La barre noire avec le menu déroulant « aller de site en site » surchargeait
les pages. Elle a déjà été retirée du site mère (`ebok.fr`) en juillet 2026,
puisque la page d'accueil **est** le hub ; elle est maintenant retirée
partout ailleurs aussi.

La navigation inter-applications reste assurée par le pied de page commun,
qui ramène sur `ebok.fr` où toutes les cartes sont listées.

## 2. Le pied de page galaxie est partout

C'est celui d'EBOK Event : la phrase « … fait partie de la galaxie
d'applications », le logo **EBOK Basketball** cliquable, puis les **12 logos
qui défilent** de droite à gauche, et enfin le lien de contact.

Le script est autonome (il injecte son markup et son CSS), sans fond propre :
il hérite de celui du site hôte, donc il reste lisible aussi bien sur un thème
sombre (Event) que clair (Mercato).

Il ne s'affiche pas dans l'espace compte (`/compte`), où la sidebar occupe
toute la hauteur. Pour l'exclure d'une page : `<body data-no-ebok-footer>`.

### Source de vérité

- **Script** : `public/ebok-footer.js` de ce repo → <https://ebok.fr/ebok-footer.js>
- **Logos** : `public/galaxy/` de ce repo → <https://ebok.fr/galaxy/>

Une seule copie à maintenir. Les duplifier dans chaque repo représenterait
~1 Mo et 13 fichiers à resynchroniser à chaque retouche.

## Migration d'une application

Deux modifications par repo, dans cet ordre :

**a. Retirer la barre**

```
- supprimer  public/ebok-galaxy.js   (ou static/, assets/… selon le repo)
- supprimer  <script src="/ebok-galaxy.js" defer></script>
             dans le layout / le <head> commun
```

Sur un projet Next.js, la balise se trouve en général dans
`app/layout.tsx` (`<Script src="/ebok-galaxy.js" strategy="beforeInteractive">`)
ou dans `pages/_document.tsx`.

**b. Ajouter le pied de page**, juste avant `</body>` du layout commun :

```html
<script src="https://ebok.fr/ebok-footer.js" defer></script>
```

En Next.js (App Router), dans `app/layout.tsx` :

```tsx
import Script from 'next/script';
// …
<Script src="https://ebok.fr/ebok-footer.js" strategy="afterInteractive" />
```

Rien d'autre : pas de CSS à ajouter, pas de dépendance, pas de variable
d'environnement.

### Filet de sécurité

Le CSS injecté par `ebok-footer.js` contient `.ebokg-bar{display:none!important}`.
Si l'étape **b** est faite avant l'étape **a** (ou si un repo garde son
`ebok-galaxy.js` un moment), la barre disparaît quand même dès que le pied de
page est en place. L'étape **a** reste à faire pour ne pas charger un script
inutile.

## État de la migration

| App | Barre retirée | Pied de page |
| --- | --- | --- |
| Basketball (site mère) | ✅ (juillet 2026) | — (héberge les ressources, ne l'affiche pas) |
| Vidéo | à faire | à faire |
| Mercato | à faire | à faire |
| Playbook | à faire | à faire |
| Médias | à faire | à faire |
| Event | à faire | ✅ (référence) |
| Autres (stats, notebook, académie, scouting, blog, forum, workout) | à faire | à faire |
