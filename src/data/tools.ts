/**
 * Source de vérité unique de la galaxie EBOK Basketball.
 *
 * Pour AJOUTER / MODIFIER / RETIRER un outil : édite uniquement ce fichier.
 * Aucune modification de HTML n'est nécessaire — les composants lisent ces
 * données pour dessiner les bulles, les pop-ups, les statuts et les orbites.
 *
 * Pour changer un statut : modifie le champ `status` ('on' | 'dev' | 'off').
 * Pour brancher le vrai sous-site : renseigne `url` (ex. https://video.ebok.fr).
 */

/** Les trois états possibles d'un outil de la galaxie. */
export type StatusKey = 'on' | 'dev' | 'off';

/** Sur quel anneau d'orbite la bulle est posée. */
export type Ring = 'inner' | 'middle' | 'outer';

export interface Status {
  /** Libellé affiché en toutes lettres dans la pop-up. */
  label: string;
  /** Couleur de la pastille et des ondes concentriques. */
  color: string;
}

export interface Tool {
  /** Identifiant technique stable (slug), utile pour les ancres / le futur routage. */
  id: string;
  /** Nom court affiché dans la bulle (le préfixe « EBOK » est ajouté par l'UI). */
  name: string;
  /** Couleur propre de l'outil (nom + barre de la pop-up). */
  color: string;
  /** Statut courant de l'outil. */
  status: StatusKey;
  /** Description brève montrée dans la pop-up (et sous la bulle sur mobile). */
  description: string;
  /**
   * URL du sous-site de l'outil.
   * '#' tant que le sous-domaine n'existe pas — voir NOTES.md pour le branchement.
   */
  url: string;
  /** Position angulaire sur l'orbite, en degrés, mesurée depuis le haut, sens horaire. */
  angle: number;
  /** Anneau d'orbite (rayon défini dans RINGS ci-dessous). */
  ring: Ring;
}

/**
 * Définition des trois statuts.
 * Couleurs conformes à la charte : vert / orange / rouge.
 */
export const STATUSES: Record<StatusKey, Status> = {
  on: { label: 'En ligne', color: '#12c98a' },
  dev: { label: 'En développement', color: '#f2a83b' },
  off: { label: 'Bientôt', color: '#e0576a' },
};

/**
 * Rayons des trois anneaux d'orbite, exprimés en fraction de la largeur du
 * champ orbital (l'UI les convertit en pourcentages). Modifiables librement.
 */
export const RINGS: Record<Ring, number> = {
  inner: 0.21,
  middle: 0.34,
  outer: 0.47,
};

/**
 * Les 9 outils de la galaxie.
 *
 * `layout` (angle + ring) est pensé pour éviter tout alignement radial :
 * les angles sont espacés de 40° et les anneaux alternent
 * (interne → externe → milieu → …). Les 3 outils actifs — Video, Playbook,
 * Event — occupent l'anneau interne, régulièrement répartis.
 */
export const TOOLS: Tool[] = [
  {
    id: 'video',
    name: 'VIDEO',
    color: '#1FA98C',
    status: 'on',
    description: "L'échange de liens vidéo pensé pour les équipes amateurs.",
    url: '#',
    angle: 0,
    ring: 'inner',
  },
  {
    id: 'stats',
    name: 'STATS',
    color: '#2E6FD6',
    status: 'off',
    description: "La saisie et l'analyse de statistiques, du live scoring au bilan de saison.",
    url: '#',
    angle: 40,
    ring: 'outer',
  },
  {
    id: 'notebook',
    name: 'NOTEBOOK',
    color: '#7a86a0',
    status: 'off',
    description: 'Rédigez, structurez et archivez toutes vos séances d’entraînement.',
    url: '#',
    angle: 80,
    ring: 'middle',
  },
  {
    id: 'playbook',
    name: 'PLAYBOOK',
    color: '#E08a2b',
    status: 'dev',
    description: 'La vidéothèque des meilleurs systèmes de jeu, une base tactique pour les coachs.',
    url: '#',
    angle: 120,
    ring: 'inner',
  },
  {
    id: 'academie',
    name: 'ACADEMIE',
    color: '#8A4CE0',
    status: 'off',
    description: 'La formation : contenus pédagogiques pour joueurs et entraîneurs.',
    url: '#',
    angle: 160,
    ring: 'outer',
  },
  {
    id: 'scouting',
    name: 'SCOUTING',
    color: '#EA5A3C',
    status: 'off',
    description: "Le scouting report complet pour analyser l'adversaire et préparer le plan de match.",
    url: '#',
    angle: 200,
    ring: 'middle',
  },
  {
    id: 'event',
    name: 'EVENT',
    color: '#E23A3A',
    status: 'dev',
    description: "L'agenda collaboratif du basket français : événements, tournois, camps et détections.",
    url: '#',
    angle: 240,
    ring: 'inner',
  },
  {
    id: 'mercato',
    name: 'MERCATO',
    color: '#4CA62E',
    status: 'off',
    description: 'La mise en relation entre clubs, joueurs et staffs, le marché des transferts amateur.',
    url: '#',
    angle: 280,
    ring: 'outer',
  },
  {
    id: 'blog',
    name: 'BLOG',
    color: '#C8317E',
    status: 'off',
    description: "L'actualité, les analyses et les coulisses de la galaxie EBOK Basketball.",
    url: '#',
    angle: 320,
    ring: 'middle',
  },
];
