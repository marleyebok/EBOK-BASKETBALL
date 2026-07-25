/**
 * Mise en forme du profil pour l'affichage (lecture seule).
 *
 * Le profil est rempli UNE fois, par le questionnaire d'inscription
 * (/onboarding) : c'est le seul formulaire de profilage de la galaxie. Les
 * pages /compte/profil des différentes apps ne font que l'afficher, et
 * renvoient vers le questionnaire pour le modifier.
 *
 * Les libellés sont ceux du questionnaire (voir i18n.ts, clés `onb.*`), pour
 * qu'un membre relise exactement ce qu'il a coché.
 */

const ROLE_LABELS: Record<string, string> = {
  joueur: 'Joueur / Joueuse',
  coach: 'Coach',
  staff: 'Staff technique ou médical',
  club: 'Club',
  organisation: 'Organisation (ligue, comité…)',
  spectateur: 'Spectateur / Supporter',
  parent: 'Parent',
  autre: 'Autre',
};

const STAFF_LABELS: Record<string, string> = {
  assistant: 'Coach assistant',
  dev_joueur: 'Développement joueur',
  video: 'Analyste vidéo',
  prepa_physique: 'Préparateur physique',
  prepa_mental: 'Préparateur mental',
  kine: 'Kinésithérapeute',
  osteo: 'Ostéopathe',
  medecin: 'Médecin',
  autre: 'Autre',
};

const SEXE_LABELS: Record<string, string> = {
  homme: 'Homme',
  femme: 'Femme',
  autre: 'Autre',
  non_precise: 'Préfère ne pas dire',
};

const TOOL_LABELS: Record<string, string> = {
  video: 'Vidéo',
  playbook: 'Playbook',
  event: 'Event',
  stats: 'Stats',
  mercato: 'Mercato',
  notebook: 'Notebook',
  academie: 'Académie',
  scouting: 'Scouting',
  blog: 'Blog',
  forum: 'Forum',
  workout: 'Workout',
  medias: 'Médias',
};

export interface ProfileRow {
  label: string;
  value: string;
}

interface ProfileLike {
  firstName?: string | null;
  lastName?: string | null;
  pseudo?: string | null;
  role?: string | null;
  roleOther?: string | null;
  staffRole?: string | null;
  staffRoleOther?: string | null;
  age?: number | string | null;
  sexe?: string | null;
  interests?: string[] | null;
}

/**
 * Transforme le profil stocké en lignes « libellé / valeur » prêtes à afficher.
 * Les champs vides sont omis : on ne montre pas de lignes vides.
 */
export function profileRows(p: ProfileLike | null): ProfileRow[] {
  if (!p) return [];
  const rows: ProfileRow[] = [];
  const push = (label: string, value: unknown) => {
    const v = value === null || value === undefined ? '' : String(value).trim();
    if (v) rows.push({ label, value: v });
  };

  push('Pseudo', p.pseudo);
  const name = [p.firstName, p.lastName].filter(Boolean).join(' ');
  push('Nom', name);

  // Rôle : on précise la fonction (staff) ou le texte libre le cas échéant.
  if (p.role) {
    let role = ROLE_LABELS[p.role] ?? p.role;
    if (p.role === 'staff' && p.staffRole) {
      const fn = p.staffRole === 'autre' && p.staffRoleOther
        ? p.staffRoleOther
        : STAFF_LABELS[p.staffRole] ?? p.staffRole;
      role += ` — ${fn}`;
    } else if (p.role === 'autre' && p.roleOther) {
      role += ` — ${p.roleOther}`;
    }
    push('Rôle', role);
  }

  push('Âge', p.age);
  push('Sexe', p.sexe ? SEXE_LABELS[p.sexe] ?? p.sexe : '');

  const interests = (p.interests ?? []).map((id) => TOOL_LABELS[id] ?? id);
  push('Outils qui vous intéressent', interests.join(', '));

  return rows;
}
