import type { APIRoute } from 'astro';
import { verifyToken } from '@clerk/backend';
import { getProfile, hasDb, saveProfile, TOOLS, type GalaxyProfile } from '../../lib/profile';

// Route serverless (le reste du site est statique — voir astro.config.mjs).
export const prerender = false;

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

/** Garde commune aux deux méthodes : renvoie l'uid, ou une réponse d'erreur. */
async function guard(request: Request): Promise<{ uid: string } | { error: Response }> {
  if (!process.env.CLERK_SECRET_KEY) {
    return { error: json({ error: 'CLERK_SECRET_KEY manquante côté serveur.' }, 500) };
  }
  if (!hasDb()) {
    return { error: json({ error: 'DATABASE_URL manquante côté serveur.' }, 500) };
  }
  const uid = await sessionUid(request);
  if (!uid) return { error: json({ error: 'Non authentifié.' }, 401) };
  return { uid };
}

export const GET: APIRoute = async ({ request }) => {
  const g = await guard(request);
  if ('error' in g) return g.error;
  return json({ profile: await getProfile(g.uid) });
};

export const POST: APIRoute = async ({ request }) => {
  const g = await guard(request);
  if ('error' in g) return g.error;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'JSON invalide.' }, 400);
  }

  const s = (key: string, max = 120): string | undefined =>
    String(body[key] ?? '')
      .trim()
      .slice(0, max) || undefined;
  const tools = Array.isArray(body.tools)
    ? body.tools.filter((t): t is string => typeof t === 'string' && (TOOLS as readonly string[]).includes(t))
    : [];

  const data: GalaxyProfile = {
    role: s('role'),
    roleOther: s('roleOther', 60),
    level: s('level'),
    club: s('club', 80),
    gender: s('gender'),
    age: s('age', 3),
    location: s('location', 80),
    tools,
  };

  await saveProfile(g.uid, data);
  return json({ ok: true });
};
