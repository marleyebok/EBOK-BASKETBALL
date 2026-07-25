import type { APIRoute } from 'astro';
import { verifyToken, createClerkClient } from '@clerk/backend';
import { hasDb, upsertOnboardingProfile } from '../../lib/db';

// Route serverless (le reste du site est statique — voir astro.config.mjs).
export const prerender = false;

const VALID_ROLES = new Set([
  'joueur',
  'coach',
  'staff',
  'club',
  'organisation',
  'spectateur',
  'parent',
  'autre',
]);

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

export const POST: APIRoute = async ({ request }) => {
  if (!process.env.CLERK_SECRET_KEY) {
    return json({ error: 'CLERK_SECRET_KEY manquante côté serveur.' }, 500);
  }
  if (!hasDb()) {
    return json({ error: 'DATABASE_URL manquante côté serveur.' }, 500);
  }

  const uid = await sessionUid(request);
  if (!uid) {
    return json({ error: 'Non authentifié.' }, 401);
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'JSON invalide.' }, 400);
  }

  const firstName = String(body.firstName ?? '').trim().slice(0, 80);
  const lastName = String(body.lastName ?? '').trim().slice(0, 80);
  const pseudo = String(body.pseudo ?? '').trim().slice(0, 40);
  const role = String(body.role ?? '').trim();
  const roleOther = body.roleOther ? String(body.roleOther).trim().slice(0, 120) : null;
  const staffRole = body.staffRole ? String(body.staffRole).trim() : null;
  const staffRoleOther = body.staffRoleOther
    ? String(body.staffRoleOther).trim().slice(0, 120)
    : null;
  const ageRaw = Number(body.age);
  const age = Number.isInteger(ageRaw) && ageRaw > 0 && ageRaw < 120 ? ageRaw : null;
  const sexe = body.sexe ? String(body.sexe).trim() : null;
  const interests = Array.isArray(body.interests)
    ? body.interests.filter((i): i is string => typeof i === 'string').slice(0, 30)
    : [];

  if (!pseudo || !VALID_ROLES.has(role)) {
    return json({ error: 'Pseudo et rôle sont obligatoires.' }, 400);
  }

  const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
  const user = await clerk.users.getUser(uid);
  const primary =
    user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId) ??
    user.emailAddresses[0];
  const email = primary?.emailAddress ?? '';

  await upsertOnboardingProfile({
    clerkId: uid,
    email,
    firstName,
    lastName,
    pseudo,
    role,
    roleOther,
    staffRole,
    staffRoleOther,
    age,
    sexe,
    interests,
  });

  // Repère léger sur le compte Clerk : permet à n'importe quelle app de la
  // galaxie de savoir instantanément (sans requête base) que ce membre a déjà
  // complété son profil, pour ne jamais lui repropose l'onboarding.
  await clerk.users.updateUserMetadata(uid, {
    publicMetadata: { onboarded: true },
  });

  return json({ ok: true });
};
