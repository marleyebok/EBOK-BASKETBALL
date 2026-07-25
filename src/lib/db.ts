import { neon } from '@neondatabase/serverless';

/**
 * Accès à la base Neon PARTAGÉE de la galaxie (le même projet « ebok » que
 * Mercato / Workout / Médias…), schéma `shared` — le socle du compte unique
 * EBOK (profil complété lors de l'onboarding après inscription).
 *
 * Tant que DATABASE_URL n'est pas configurée, `hasDb()` renvoie false : la
 * route API répond en erreur explicite plutôt que de planter.
 */

export function hasDb(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

function sql() {
  return neon(process.env.DATABASE_URL!);
}

export interface OnboardingProfile {
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  pseudo: string;
  role: string;
  roleOther: string | null;
  staffRole: string | null;
  staffRoleOther: string | null;
  age: number | null;
  sexe: string | null;
  interests: string[];
}

let schemaReady = false;

/** Crée le schéma/la table au premier appel (idempotent). */
async function ensureSchema(): Promise<void> {
  if (schemaReady) return;
  const q = sql();
  await q`CREATE SCHEMA IF NOT EXISTS shared`;
  await q`
    CREATE TABLE IF NOT EXISTS shared.users (
      id               BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      clerk_id         TEXT UNIQUE NOT NULL,
      email            TEXT NOT NULL,
      first_name       TEXT,
      last_name        TEXT,
      pseudo           TEXT,
      role             TEXT,
      role_other       TEXT,
      staff_role       TEXT,
      staff_role_other TEXT,
      age              INT,
      sexe             TEXT,
      interests        TEXT[] NOT NULL DEFAULT '{}',
      onboarded_at     TIMESTAMPTZ,
      created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
    )`;
  schemaReady = true;
}

/** Enregistre (ou met à jour) le profil d'onboarding d'un membre. */
export async function upsertOnboardingProfile(p: OnboardingProfile): Promise<void> {
  await ensureSchema();
  const q = sql();
  await q`
    INSERT INTO shared.users (
      clerk_id, email, first_name, last_name, pseudo,
      role, role_other, staff_role, staff_role_other,
      age, sexe, interests, onboarded_at, updated_at
    ) VALUES (
      ${p.clerkId}, ${p.email}, ${p.firstName}, ${p.lastName}, ${p.pseudo},
      ${p.role}, ${p.roleOther}, ${p.staffRole}, ${p.staffRoleOther},
      ${p.age}, ${p.sexe}, ${p.interests}, now(), now()
    )
    ON CONFLICT (clerk_id) DO UPDATE SET
      email = EXCLUDED.email,
      first_name = EXCLUDED.first_name,
      last_name = EXCLUDED.last_name,
      pseudo = EXCLUDED.pseudo,
      role = EXCLUDED.role,
      role_other = EXCLUDED.role_other,
      staff_role = EXCLUDED.staff_role,
      staff_role_other = EXCLUDED.staff_role_other,
      age = EXCLUDED.age,
      sexe = EXCLUDED.sexe,
      interests = EXCLUDED.interests,
      onboarded_at = now(),
      updated_at = now()
  `;
}
