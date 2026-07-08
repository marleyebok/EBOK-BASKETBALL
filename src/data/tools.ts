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
  /** Description brève (révélée au survol / clic). */
  description: string;
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
 * Les 9 outils de l'écosystème.
 * L'ordre du tableau = l'ordre d'affichage dans la grille.
 */
export const TOOLS: Tool[] = [
  {
    id: 'video',
    name: 'VIDEO',
    color: '#1FA98C',
    status: 'on',
    description: "L'échange de liens vidéo pensé pour les équipes amateurs.",
    url: '#',
  },
  {
    id: 'playbook',
    name: 'PLAYBOOK',
    color: '#E08A2B',
    status: 'dev',
    description: 'La vidéothèque des meilleurs systèmes de jeu, une base tactique pour les coachs.',
    url: '#',
  },
  {
    id: 'event',
    name: 'EVENT',
    color: '#E23A3A',
    status: 'dev',
    description: "L'agenda collaboratif du basket français : tournois, camps et détections.",
    url: '#',
  },
  {
    id: 'stats',
    name: 'STATS',
    color: '#2E6FD6',
    status: 'off',
    description: "La saisie et l'analyse de statistiques, du live scoring au bilan de saison.",
    url: '#',
  },
  {
    id: 'mercato',
    name: 'MERCATO',
    color: '#4CA62E',
    status: 'off',
    description: 'La mise en relation entre clubs, joueurs et staffs — le marché amateur.',
    url: '#',
  },
  {
    id: 'notebook',
    name: 'NOTEBOOK',
    color: '#7A86A0',
    status: 'off',
    description: 'Rédigez, structurez et archivez toutes vos séances d’entraînement.',
    url: '#',
  },
  {
    id: 'academie',
    name: 'ACADÉMIE',
    color: '#8A4CE0',
    status: 'off',
    description: 'La formation : contenus pédagogiques pour joueurs et entraîneurs.',
    url: '#',
  },
  {
    id: 'scouting',
    name: 'SCOUTING',
    color: '#EA5A3C',
    status: 'off',
    description: "Le scouting report complet pour analyser l'adversaire et préparer le match.",
    url: '#',
  },
  {
    id: 'blog',
    name: 'BLOG',
    color: '#C8317E',
    status: 'off',
    description: "L'actualité, les analyses et les coulisses de l'écosystème EBOK.",
    url: '#',
  },
];
