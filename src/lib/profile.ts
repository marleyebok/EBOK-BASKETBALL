import { neon } from '@neondatabase/serverless';

/**
 * Profil « galaxie » partagé entre TOUTES les apps EBOK (schéma Neon `shared`,
 * table `shared.profiles` — la même que Playbook, Video, Mercato, Event).
 *
 * Ce sont des préférences applicatives (rôle, niveau, club, outils visés…),
 * pas l'identité Clerk : l'e-mail / le nom réel restent lus depuis Clerk.
 * Une seule fiche par compte, valable partout dans la galaxie.
 *
 * À ne pas confondre avec `shared.users` (voir db.ts), alimentée par le
 * questionnaire d'inscription : celle-ci porte les réglages modifiables
 * depuis /compte/profil, présents à l'identique dans les autres apps.
 */

export function hasDb(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

function sql() {
  return neon(process.env.DATABASE_URL!);
}

export interface GalaxyProfile {
  role?: string;
  roleOther?: string;
  level?: string;
  club?: string;
  gender?: string;
  age?: string;
  location?: string;
  tools?: string[];
}

/* Listes fermées des questions (partagées avec le formulaire). */
export const ROLES = ['Joueur', 'Coach', 'Club', 'Organisation', 'Spectateur', 'Autre'] as const;
export const LEVELS = [
  'Loisir',
  'Département',
  'Région',
  'National',
  'Pro',
  'International',
  'Autre',
] as const;
export const GENDERS = ['Homme', 'Femme'] as const;
export const TOOLS = [
  'Basketball',
  'Event',
  'Mercato',
  'Playbook',
  'Workout',
  'Vidéo',
  'Stats',
  'Notebook',
  'Académie',
  'Scouting',
  'Blog',
  'Forum',
  'Médias',
] as const;

let ready = false;
async function ensure(): Promise<void> {
  if (ready) return;
  const q = sql();
  await q`CREATE SCHEMA IF NOT EXISTS shared`;
  await q`
    CREATE TABLE IF NOT EXISTS shared.profiles (
      user_id TEXT PRIMARY KEY,
      data JSONB NOT NULL DEFAULT '{}',
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )`;
  ready = true;
}

export async function getProfile(uid: string): Promise<GalaxyProfile> {
  if (!hasDb()) return {};
  try {
    await ensure();
    const rows = await sql()`SELECT data FROM shared.profiles WHERE user_id = ${uid}`;
    return (rows[0]?.data ?? {}) as GalaxyProfile;
  } catch {
    return {};
  }
}

export async function saveProfile(uid: string, data: GalaxyProfile): Promise<void> {
  await ensure();
  const payload = JSON.stringify(data);
  await sql()`
    INSERT INTO shared.profiles (user_id, data, updated_at)
    VALUES (${uid}, ${payload}::jsonb, now())
    ON CONFLICT (user_id) DO UPDATE SET data = ${payload}::jsonb, updated_at = now()`;
}
