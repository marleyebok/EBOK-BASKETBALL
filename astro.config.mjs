// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// Site en français uniquement, déployé sur Vercel.
// `site` = domaine de prod : URL canoniques, Open Graph, sitemap.
//
// `output: 'server'` est nécessaire pour la route API `/api/onboarding`
// (écriture dans Neon). Le reste du site reste statique : chaque page
// existante porte `export const prerender = true` pour être pré-rendue au
// build, comme avant — seule la route API tourne en serverless (Vercel).
export default defineConfig({
  site: 'https://ebok.fr',
  output: 'server',
  adapter: vercel(),
  integrations: [sitemap()],
});
