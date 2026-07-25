/**
 * Textes d'interface — site en français uniquement.
 *
 * Pour ajouter/modifier un texte : édite `ui` ci-dessous.
 * Les descriptions des outils vivent dans `src/data/tools.ts`.
 */

export const ui = {
  'meta.title': 'EBOK Basketball — la boîte à outils des basketteurs',
  'meta.desc':
    "1 compte, 10 outils : la galaxie EBOK pour les coachs, joueurs et clubs de basket francophones — du terrain à l'analyse.",
  'nav.home': 'EBOK Basketball — accueil',
  'hero.eyebrow': '1 compte · 10 outils',
  'hero.titlePre': 'La boîte à outils des ',
  'hero.titleEm': 'basketteurs',
  'hero.lede':
    "Une galaxie d'outils pour les coachs, joueurs et clubs francophones — du terrain à l'analyse. Chaque outil ouvre son propre site, et bientôt un seul compte les ouvrira tous.",
  'hero.cta': 'Demander un accès anticipé',
  'tools.aria': "Les outils de l'écosystème EBOK Basketball",
  'auth.aria': 'Compte EBOK',
  'auth.signin': 'Se connecter',
  'auth.signup': 'Créer un compte',
  'status.on': 'En ligne',
  'status.dev': 'En dev.',
  'cta.on': "Voir l'outil",
  'cta.dev': 'Voir la page',
  'contact.eyebrow': 'Un besoin · Une idée · Un outil',
  'contact.title': 'Construisons la suite ensemble',
  'contact.text':
    'Acteurs et passionnés du basket français : toute demande de collaboration est la bienvenue.',
  'contact.btn': 'Nous contacter',
  'footer': 'EBOK Basketball — la boîte à outils des basketteurs · © 2026',
  // Page accès anticipé
  'ea.metaTitle': 'Accès anticipé — EBOK Basketball',
  'ea.metaDesc':
    "Rejoignez le programme d'accès anticipé EBOK Basketball : testez les outils en avant-première.",
  'ea.eyebrow': 'Programme bêta · Accès anticipé',
  'ea.title': 'Testez les outils EBOK en avant-première',
  'ea.lede':
    "Laissez votre e-mail et choisissez les outils qui vous intéressent. Vous serez averti dès l'ouverture de leur accès anticipé, avant tout le monde.",
  'ea.emailLabel': 'Votre e-mail',
  'ea.emailPlaceholder': 'vous@exemple.fr',
  'ea.toolsLabel': 'Quels outils vous intéressent ?',
  'ea.submit': 'Je veux un accès anticipé',
  'ea.note': 'Aucun spam. Désinscription possible à tout moment.',
  'ea.thanksTitle': 'Merci ! 🏀',
  'ea.thanksText':
    "Votre demande est bien enregistrée. On vous écrit dès l'ouverture des accès.",
  'ea.back': "Retour à l'accueil",
  'ea.subject': 'Accès anticipé EBOK',
  'ea.mailEmail': 'E-mail',
  'ea.mailTools': 'Outils souhaités',
  // Onboarding (questionnaire après création de compte)
  'onb.metaTitle': 'Complétez votre profil — EBOK Basketball',
  'onb.metaDesc': 'Quelques questions pour personnaliser votre compte EBOK.',
  'onb.eyebrow': 'Bienvenue dans la galaxie EBOK',
  'onb.step1.title': 'Faisons connaissance',
  'onb.firstName': 'Prénom',
  'onb.lastName': 'Nom',
  'onb.pseudo': 'Pseudo (affiché dans la galaxie)',
  'onb.step2.title': 'Quel est votre rôle ?',
  'onb.role.joueur': 'Joueur / Joueuse',
  'onb.role.coach': 'Coach',
  'onb.role.staff': 'Staff technique ou médical',
  'onb.role.club': 'Club',
  'onb.role.organisation': 'Organisation (ligue, comité…)',
  'onb.role.spectateur': 'Spectateur / Supporter',
  'onb.role.parent': 'Parent',
  'onb.role.autre': 'Autre',
  'onb.roleOtherPlaceholder': 'Précisez…',
  'onb.staff.title': 'Précisez votre fonction',
  'onb.staff.assistant': 'Coach assistant',
  'onb.staff.dev_joueur': 'Développement joueur',
  'onb.staff.video': 'Analyste vidéo',
  'onb.staff.prepa_physique': 'Préparateur physique',
  'onb.staff.prepa_mental': 'Préparateur mental',
  'onb.staff.kine': 'Kinésithérapeute',
  'onb.staff.osteo': 'Ostéopathe',
  'onb.staff.medecin': 'Médecin',
  'onb.staff.autre': 'Autre',
  'onb.staffOtherPlaceholder': 'Précisez…',
  'onb.step3.title': 'Un peu plus sur vous',
  'onb.age': 'Âge',
  'onb.sexe': 'Sexe',
  'onb.sexe.homme': 'Homme',
  'onb.sexe.femme': 'Femme',
  'onb.sexe.autre': 'Autre',
  'onb.sexe.non_precise': 'Préfère ne pas dire',
  'onb.step4.title': 'Quels outils vous intéressent ?',
  'onb.step4.sub': 'Plusieurs choix possibles — vous pourrez changer d’avis à tout moment.',
  'onb.back': 'Retour',
  'onb.continue': 'Continuer',
  'onb.saving': 'Enregistrement…',
  'onb.error': "Un problème est survenu. Réessayez, ou continuez, vous pourrez compléter votre profil plus tard.",
  'onb.skip': 'Passer pour l’instant',
} as const;

type UiKey = keyof typeof ui;

/** Conservé pour compatibilité d'appel (`useT(currentLang(...))`) : renvoie toujours 'fr'. */
export function currentLang(_locale?: string): 'fr' {
  return 'fr';
}

/** Fonction de traduction (site français uniquement). */
export function useT(_lang?: string) {
  return (key: UiKey): string => ui[key];
}
