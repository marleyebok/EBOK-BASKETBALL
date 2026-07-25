import { Clerk } from '@clerk/clerk-js';

/**
 * Chargement de Clerk côté navigateur, mutualisé entre les pages du site
 * statique (contrôles d'en-tête, espace /compte…).
 *
 * Deux pièges déjà rencontrés, traités ici une fois pour toutes :
 *  - `@clerk/clerk-js` seul se charge « en mode headless » : sans le bundle UI
 *    passé à `.load({ ui: { ClerkUI } })`, toute modale (SignIn/SignUp/
 *    UserButton/UserProfile) échoue avec « Clerk was not loaded with Ui
 *    components ». Le bundle est servi par l'instance Clerk elle-même.
 *  - si `.load()` échoue, rappeler `.load()` sur la MÊME instance ne relance
 *    rien : il faut repartir d'une instance neuve. D'où le `attempt` remis à
 *    zéro (avec un timeout explicite, Clerk pouvant ne jamais trancher).
 */

const DEFAULT_PUBLISHABLE_KEY = 'pk_live_Y2xlcmsuZWJvay5mciQ';

export const PUBLISHABLE_KEY: string =
  (import.meta.env.PUBLIC_CLERK_PUBLISHABLE_KEY as string | undefined) ||
  DEFAULT_PUBLISHABLE_KEY;

/** Domaine Frontend API (`clerk.ebok.fr`), encodé dans la clé publiable. */
function frontendApiDomain(key: string): string {
  return atob(key.split('_')[2]).slice(0, -1);
}

/** Le bundle UI s'annonce sur `window` ; son type précis n'est pas exporté. */
type WindowWithClerkUI = typeof window & { __internal_ClerkUICtor?: any };

let uiScript: Promise<void> | null = null;
function loadUiBundle(): Promise<void> {
  if (uiScript) return uiScript;
  const win = window as WindowWithClerkUI;
  uiScript = new Promise<void>((resolve, reject) => {
    if (win.__internal_ClerkUICtor) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = `https://${frontendApiDomain(PUBLISHABLE_KEY)}/npm/@clerk/ui@1/dist/ui.browser.js`;
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Échec du chargement du bundle UI Clerk'));
    document.head.appendChild(script);
  }).catch((err) => {
    uiScript = null; // permet un nouvel essai
    throw err;
  });
  return uiScript;
}

let clerk: Clerk | null = null;
let attempt: Promise<Clerk> | null = null;

/** Charge Clerk (localisé en français, avec les composants d'interface). */
export function loadClerk(timeoutMs = 12000): Promise<Clerk> {
  if (clerk?.loaded) return Promise.resolve(clerk);
  if (attempt) return attempt;

  const instance = clerk ?? new Clerk(PUBLISHABLE_KEY);
  clerk = instance;

  const win = window as WindowWithClerkUI;
  const run = Promise.all([
    import('@clerk/localizations').then((m) => m.frFR),
    loadUiBundle(),
  ]).then(async ([localization]) => {
    await instance.load({ localization, ui: { ClerkUI: win.__internal_ClerkUICtor } });
    return instance;
  });

  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Clerk : délai de chargement dépassé')), timeoutMs)
  );

  attempt = Promise.race([run, timeout]).catch((err) => {
    attempt = null;
    clerk = null; // instance neuve au prochain essai (une instance bloquée ne retente rien)
    throw err;
  });
  return attempt;
}
