/**
 * Internationalisation (FR / EN).
 * FR à la racine `/`, EN sous `/en/`. Le français est la langue de repli.
 *
 * Pour ajouter/modifier un texte d'interface : édite `ui` ci-dessous.
 * Les descriptions des outils vivent dans `src/data/tools.ts` (bilingues).
 */

export type Lang = 'fr' | 'en';
export const defaultLang: Lang = 'fr';
export const locales: Lang[] = ['fr', 'en'];
export const localeNames: Record<Lang, string> = { fr: 'FR', en: 'EN' };
export const ogLocale: Record<Lang, string> = { fr: 'fr_FR', en: 'en_US' };

export const ui = {
  fr: {
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
    'status.on': 'En ligne',
    'status.dev': 'En dev.',
    'status.off': 'Bientôt',
    'cta.on': "Voir l'outil",
    'cta.dev': 'En cours de construction',
    'cta.off': 'Bientôt disponible',
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
  },
  en: {
    'meta.title': "EBOK Basketball — the hoopers' toolkit",
    'meta.desc':
      'One account, ten tools: the EBOK galaxy for French-speaking basketball coaches, players and clubs — from the court to the analysis.',
    'nav.home': 'EBOK Basketball — home',
    'hero.eyebrow': 'One account · Ten tools',
    'hero.titlePre': 'The toolkit for ',
    'hero.titleEm': 'hoopers',
    'hero.lede':
      'A galaxy of tools for French-speaking coaches, players and clubs — from the court to the analysis. Each tool opens its own site, and soon a single account will open them all.',
    'hero.cta': 'Request early access',
    'tools.aria': 'The tools of the EBOK Basketball ecosystem',
    'status.on': 'Online',
    'status.dev': 'In dev.',
    'status.off': 'Soon',
    'cta.on': 'Open the tool',
    'cta.dev': 'Under construction',
    'cta.off': 'Coming soon',
    'contact.eyebrow': 'A need · An idea · A tool',
    'contact.title': "Let's build what's next together",
    'contact.text':
      'Players and fans of French basketball: any collaboration request is welcome.',
    'contact.btn': 'Contact us',
    'footer': "EBOK Basketball — the hoopers' toolkit · © 2026",
    // Early-access page
    'ea.metaTitle': 'Early access — EBOK Basketball',
    'ea.metaDesc':
      'Join the EBOK Basketball early-access program: try the tools in preview.',
    'ea.eyebrow': 'Beta program · Early access',
    'ea.title': 'Try EBOK tools in preview',
    'ea.lede':
      "Leave your email and pick the tools you're interested in. You'll be notified as soon as their early access opens, before anyone else.",
    'ea.emailLabel': 'Your email',
    'ea.emailPlaceholder': 'you@example.com',
    'ea.toolsLabel': 'Which tools interest you?',
    'ea.submit': 'I want early access',
    'ea.note': 'No spam. Unsubscribe anytime.',
    'ea.thanksTitle': 'Thanks! 🏀',
    'ea.thanksText':
      "Your request has been recorded. We'll email you as soon as access opens.",
    'ea.back': 'Back to home',
    'ea.subject': 'EBOK early access',
    'ea.mailEmail': 'Email',
    'ea.mailTools': 'Requested tools',
  },
} as const;

type UiKey = keyof (typeof ui)['fr'];

/** Retourne la langue courante à partir de `Astro.currentLocale`. */
export function currentLang(locale?: string): Lang {
  return locale === 'en' ? 'en' : 'fr';
}

/** Fabrique une fonction de traduction pour une langue. */
export function useT(lang: Lang) {
  return (key: UiKey): string => ui[lang][key] ?? ui[defaultLang][key];
}

/** Chemin de la même page dans l'autre langue (pour le sélecteur + hreflang). */
export function localizedPath(pathname: string, target: Lang): string {
  const base = pathname.replace(/^\/en(?=\/|$)/, '') || '/';
  if (target === 'fr') return base;
  return base === '/' ? '/en/' : `/en${base}`;
}
