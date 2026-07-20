# EBOK Basketball — Architecture de la galaxie & Roadmap

> Compte unique, domaines, emails, bases de données, hébergement.
> Version Markdown du document PDF de juillet 2026.

## 1. La vision en une image

Dix applications, **un seul domaine racine**, **un seul compte visiteur**, **une seule base de données**.

| Élément | Aujourd'hui | Cible |
|---|---|---|
| Site mère | ebok-basketball.vercel.app | `www.ebok-basketball.com` |
| EBOK Event | ebok-event.vercel.app | `event.ebok-basketball.com` |
| EBOK Video | ebok-video.vercel.app | `video.ebok-basketball.com` |
| EBOK Mercato | ebok-mercato.vercel.app | `mercato.ebok-basketball.com` |
| Autres apps | — | `playbook.ebok-basketball.com`, etc. |
| Compte visiteur | Aucun | 1 compte valable partout (SSO) |

**Pourquoi les sous-domaines sont LA décision clé :** deux sites sur le même
domaine racine peuvent **partager le même cookie de session**. C'est ce qui rend
le compte unique simple et quasi gratuit. Avec 10 domaines différents, le SSO
devient un projet complexe et payant.

## 2. Nom de domaine

- **Acheter UN seul domaine** : `ebok-basketball.com` (~10–12 €/an).
  Alternatives : `ebok.app`, `ebok.basketball`.
- Registrar : **Cloudflare Registrar** (prix coûtant) ou OVH.
- DNS géré chez **Cloudflare (gratuit)**.

## 3. Emails

### Adresse « maître » (infrastructure)
- `admin@ebok-basketball.com` via **Cloudflare Email Routing** (gratuit),
  redirigée vers la boîte Gmail principale.
- **Tous** les comptes techniques (Vercel, GitHub, Neon, Cloudflare, Firebase)
  utilisent cette adresse unique.
- Gestionnaire de mots de passe (Bitwarden) + **2FA partout**.

### Une adresse par site
- Alias gratuits : `event@`, `video@`, `mercato@`, `playbook@…` → redirigés
  vers l'email personnel de chaque responsable.
- Pour envoyer depuis ces adresses : « Send as » Gmail, puis Zoho Mail Free
  (5 boîtes) ou Google Workspace (~6 €/mois/boîte) plus tard.
- **Ne pas payer Google Workspace en phase de test.**

## 4. Compte unique (SSO)

- L'auth vit sur le domaine racine : cookie posé sur `.ebok-basketball.com`,
  visible par toutes les apps en sous-domaine.
- Profils dans **une seule table `users`** partagée.

| | Clerk (recommandé) | Better Auth (alternative) |
|---|---|---|
| Coût | Gratuit < 10 000 users actifs/mois | Gratuit (open source) |
| Effort | Très faible (composants prêts) | Moyen (auth auto-hébergée, stockage Neon) |
| SSO multi-apps | Natif sur sous-domaines | Natif via cookie racine |
| Risque | Dépendance tierce | Plus de code à maintenir |

**Avis franc : démarrer avec Clerk.** Migration vers Better Auth possible plus
tard si > 10 000 utilisateurs actifs/mois.

## 5. Bases de données

- **Un seul projet Neon (Postgres), une seule base**, un **schéma par app** :
  `event.*`, `video.*`, `mercato.*`… + un schéma `shared` (table `users`).
- Éviter Firebase pour les données : rester sur Postgres partout.
- Médias : vidéos = embeds YouTube ; images = Cloudflare R2 (10 Go gratuits)
  ou Vercel Blob.

## 6. Hébergement & code

- **Vercel Hobby** (gratuit, non commercial) : un projet par app, chacun sur
  son sous-domaine. Passer Pro (~20 $/mois) si monétisation.
- **Organisation GitHub `ebok-basketball`** avec un repo par app.
- À terme : paquet partagé `ebok-ui` (header galaxie commun). Pas urgent.
- Stack des nouvelles apps : **Next.js + Neon + Clerk** sur Vercel.
  Le site mère reste en Astro (statique).

## 7. Budget

| Poste | Phase test | Après lancement |
|---|---|---|
| Domaine | ~10–12 €/an | ~10–12 €/an |
| DNS + Email Routing | 0 € | 0 € |
| Vercel | 0 € | ~20 $/mois si Pro |
| Neon | 0 € | ~19 $/mois si > 0,5 Go |
| Clerk | 0 € | 0 € < 10k users/mois |
| Emails pro | 0 € | 0–6 €/mois/boîte |
| **Total** | **~1 €/mois** | **~0 à 45 €/mois** |

## 8. Roadmap phase par phase

### Phase 0 — Fondations (1 à 2 jours)
- [ ] Acheter `ebok-basketball.com`.
- [ ] Compte Cloudflare + DNS du domaine.
- [ ] Email Routing : `admin@` → Gmail.
- [ ] Bitwarden + 2FA sur GitHub, Vercel, Neon, Cloudflare, Gmail.
- [ ] Organisation GitHub `ebok-basketball`, transfert des repos.
- [ ] Basculer les comptes techniques sur `admin@ebok-basketball.com`.

### Phase 1 — Domaines branchés (½ journée)
- [ ] `www.ebok-basketball.com` (+ apex) sur le projet site mère.
- [ ] `event.`, `video.`, `mercato.` sur leurs projets Vercel.
- [ ] Vérifier HTTPS + redirections des anciennes URLs `*.vercel.app`.
- [ ] Alias emails `event@`, `video@`, `mercato@`.

### Phase 2 — Compte unique, app pilote (1 semaine)
- [ ] Compte Clerk (instance de production sur le domaine).
- [ ] Connexion e-mail + Google.
- [ ] Projet Neon « ebok » : schémas `shared`, `event`, `video`, `mercato` ;
      table `shared.users` synchronisée avec Clerk (webhook).
- [ ] Intégrer Clerk dans **EBOK Event** (pilote).
- [ ] Tester le parcours complet inscription → session partagée.

### Phase 3 — Généralisation du SSO (1 à 2 semaines)
- [ ] Clerk dans EBOK Video puis EBOK Mercato.
- [ ] Boutons « Se connecter / Mon compte » sur le site mère.
- [ ] Header commun « galaxie » (logo + menu 10 apps + avatar).
- [ ] Test mobile inter-apps.

### Phase 4 — Nouvelles apps (en continu)
- [ ] Modèle commun : Next.js + Clerk + Neon (schéma dédié).
- [ ] Déploiement Vercel + sous-domaine + alias email responsable.
- [ ] Ajout au site mère (statut « En développement » → « En ligne »).

### Phase 5 — Avant diffusion publique (1 semaine)
- [ ] Pages légales : mentions, confidentialité (RGPD), contact.
- [ ] Analytics (Vercel Analytics ou Plausible).
- [ ] SEO : titres, descriptions, sitemap, Open Graph.
- [ ] Backups Neon + export mensuel des utilisateurs Clerk.
- [ ] Test mobile complet + test par un proche.
- [ ] Lancement progressif.

## 9. Les 3 règles d'or

1. **Un domaine, des sous-domaines.**
2. **Une seule base, un schéma par app.**
3. **Une app pilote avant de généraliser.**
