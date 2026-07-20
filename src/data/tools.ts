/**
 * Source de vérité unique de l'écosystème EBOK Basketball.
 *
 * Pour AJOUTER / MODIFIER / RETIRER un outil : édite uniquement ce fichier.
 * Les composants lisent ces données pour dessiner les cartes, les logos,
 * les statuts et les descriptions.
 *
 * - Changer un statut : modifie `status` ('on' | 'dev' | 'off').
 * - Brancher le vrai sous-site : renseigne `url` (ex. https://video.ebok.fr).
 */

/** Les trois états possibles d'un outil. */
export type StatusKey = 'on' | 'dev' | 'off';

export interface Status {
  /** Libellé affiché (statut discret + description). */
  label: string;
}

export interface Tool {
  /** Identifiant technique stable (slug). */
  id: string;
  /** Nom court affiché dans le logo (le préfixe « EBOK » est ajouté par l'UI). */
  name: string;
  /** Couleur propre de l'outil (logo + accents). */
  color: string;
  /** Statut courant. */
  status: StatusKey;
  /** Description brève, bilingue (fr / en). */
  description: { fr: string; en: string };
  /**
   * URL du sous-site de l'outil.
   * '#' tant que le sous-domaine n'existe pas — voir NOTES.md.
   */
  url: string;
}

/** Définition des trois statuts (libellés). Couleurs gérées en CSS. */
export const STATUSES: Record<StatusKey, Status> = {
  on: { label: 'En ligne' },
  dev: { label: 'En développement' },
  off: { label: 'Bientôt' },
};

/**
 * Les outils de l'écosystème.
 * L'ordre du tableau = l'ordre d'affichage dans la grille.
 */
export const TOOLS: Tool[] = [
  {
    id: 'video',
    name: 'VIDEO',
    color: '#1FA98C',
    status: 'on',
    description: {
      fr: "L'échange de liens vidéo pensé pour les équipes amateurs.",
      en: 'Video-link sharing built for amateur teams.',
    },
    url: 'https://ebok-video.vercel.app/',
  },
  {
    id: 'playbook',
    name: 'PLAYBOOK',
    color: '#E08A2B',
    status: 'dev',
    description: {
      fr: 'La vidéothèque des meilleurs systèmes de jeu, une base tactique pour les coachs.',
      en: 'A video library of the best plays — a tactical base for coaches.',
    },
    url: '#',
  },
  {
    id: 'event',
    name: 'EVENT',
    color: '#E23A3A',
    status: 'on',
    description: {
      fr: "L'agenda collaboratif du basket français : tournois, camps et détections.",
      en: 'The collaborative calendar of French basketball: tournaments, camps and tryouts.',
    },
    url: 'https://ebok-event.vercel.app/',
  },
  {
    id: 'stats',
    name: 'STATS',
    color: '#2E6FD6',
    status: 'dev',
    description: {
      fr: "La saisie et l'analyse de statistiques, du live scoring au bilan de saison.",
      en: 'Stat tracking and analysis, from live scoring to season reviews.',
    },
    url: '#',
  },
  {
    id: 'mercato',
    name: 'MERCATO',
    color: '#4CA62E',
    status: 'dev',
    description: {
      fr: 'La mise en relation entre clubs, joueurs et staffs — le marché amateur.',
      en: 'Connecting clubs, players and staff — the amateur transfer market.',
    },
    url: '#',
  },
  {
    id: 'notebook',
    name: 'NOTEBOOK',
    color: '#7A86A0',
    status: 'off',
    description: {
      fr: 'Rédigez, structurez et archivez toutes vos séances d’entraînement.',
      en: 'Write, structure and archive all your training sessions.',
    },
    url: '#',
  },
  {
    id: 'academie',
    name: 'ACADÉMIE',
    color: '#8A4CE0',
    status: 'off',
    description: {
      fr: 'La formation : contenus pédagogiques pour joueurs et entraîneurs.',
      en: 'Training & education: learning content for players and coaches.',
    },
    url: '#',
  },
  {
    id: 'scouting',
    name: 'SCOUTING',
    color: '#EA5A3C',
    status: 'off',
    description: {
      fr: "Le scouting report complet pour analyser l'adversaire et préparer le match.",
      en: 'The complete scouting report to analyze opponents and prepare for the game.',
    },
    url: '#',
  },
  {
    id: 'blog',
    name: 'BLOG',
    color: '#C8317E',
    status: 'off',
    description: {
      fr: "L'actualité, les analyses et les coulisses de l'écosystème EBOK.",
      en: 'News, analysis and behind-the-scenes of the EBOK ecosystem.',
    },
    url: '#',
  },
  {
    id: 'forum',
    name: 'FORUM',
    color: '#18A0C4',
    status: 'off',
    description: {
      fr: "L'espace d'échange de la communauté : questions, conseils et débats basket.",
      en: 'The community space: questions, advice and basketball talk.',
    },
    url: '#',
  },
  {
    id: 'medias',
    name: 'MÉDIAS',
    color: '#C9A227',
    status: 'off',
    description: {
      fr: "L'annuaire des médias basket : presse, podcasts, joueurs et coachs à suivre.",
      en: 'The directory of basketball media: press, podcasts, players and coaches to follow.',
    },
    url: '#',
  },
];
