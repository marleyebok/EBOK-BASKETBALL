# EBOK Forum 🗣️🏀

> **L'espace d'échange de la communauté basket de la galaxie EBOK.**
> Repo réservé — le développement n'a pas encore commencé.

## Le futur contenu

EBOK Forum sera le lieu où les membres de la galaxie (joueurs, coachs,
dirigeants, parents, passionnés) échangent entre eux :

- **Catégories de discussion** : entraînement, tactique, arbitrage, vie de
  club, matériel, mercato amateur, coin des coachs, coin des parents…
- **Fils de discussion** : questions/réponses, conseils, débats, retours
  d'expérience.
- **Profils communautaires** : chaque message est signé du compte unique EBOK
  (« 1 compte, 10 outils ») — pseudo, avatar et badges partagés avec le reste
  de la galaxie.
- **Modération** : signalement, chartes par catégorie, rôle modérateur confié
  à des membres de confiance.
- **Passerelles avec les autres outils** : partager un événement EBOK Event,
  une annonce EBOK Mercato ou une vidéo EBOK Video directement dans un fil.

## Principes

- Bienveillance et respect d'abord : le forum est un vestiaire, pas un ring.
- Français d'abord, ouvert à toute la communauté francophone.
- Gratuit pour les membres.

## Stack prévue (standard de la galaxie)

- **Next.js** (App Router) déployé sur **Vercel** — sous-domaine
  `forum.ebok-basketball.com`
- **Clerk** pour le compte unique EBOK (voir `docs/AUTH.md` du repo
  [EBOK-BASKETBALL](https://github.com/marleyebok/EBOK-BASKETBALL))
- **Neon Postgres**, schéma `forum` + référence à la table partagée
  `shared.users`
- Barre commune `ebok-galaxy.js` en haut de page, comme sur toutes les apps

## Statut

🟡 **Bientôt** — repo créé pour réserver la place dans la galaxie.
Le développement démarrera après la mise en place du compte unique
(Phases 2–3 de la roadmap).
