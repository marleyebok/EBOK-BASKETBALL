import type { APIRoute } from 'astro';
import { verifyToken } from '@clerk/backend';
import { getStoredProfile, hasDb } from '../../lib/db';
import { profileRows } from '../../lib/profile-view';

// Route serverless (le reste du site est statique — voir astro.config.mjs).
export const prerender = false;

/**
 * Profil du compte unique EBOK, en LECTURE SEULE.
 *
 * Il n'y a qu'un seul formulaire de profilage dans la galaxie : le
 * questionnaire d'inscription (/onboarding), qui écrit dans `shared.users`.
 * Cette route ne fait que relire ce profil pour l'afficher — aucune écriture.
 */

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

/** Récupère l'ID utilisateur à partir du token de session Clerk (en-tête Bearer). */
async function sessionUid(request: Request): Promise<string | null> {
  const auth = request.headers.get('authorization') || '';
  if (!auth.startsWith('Bearer ')) return null;
  const token = auth.slice('Bearer '.length).trim();
  if (!token) return null;
  try {
    const payload = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY });
    return typeof payload.sub === 'string' ? payload.sub : null;
  } catch {
    return null;
  }
}

export const GET: APIRoute = async ({ request }) => {
  if (!process.env.CLERK_SECRET_KEY) {
    return json({ error: 'CLERK_SECRET_KEY manquante côté serveur.' }, 500);
  }
  if (!hasDb()) {
    return json({ error: 'DATABASE_URL manquante côté serveur.' }, 500);
  }

  const uid = await sessionUid(request);
  if (!uid) return json({ error: 'Non authentifié.' }, 401);

  const profile = await getStoredProfile(uid);
  return json({ filled: Boolean(profile), rows: profileRows(profile) });
};
