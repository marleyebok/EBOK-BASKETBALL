// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Site 100 % statique. `site` = domaine de prod : sert aux URL canoniques,
// aux balises Open Graph absolues et au sitemap.
// À remplacer par le domaine définitif (ex. https://ebok-basketball.fr) le
// jour où il sera branché sur Vercel.
export default defineConfig({
  site: 'https://ebok-basketball.vercel.app',
  output: 'static',
  integrations: [sitemap()],
});
