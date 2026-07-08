// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Site 100 % statique, bilingue (FR par défaut à `/`, EN à `/en/`).
// `site` = domaine de prod : URL canoniques, Open Graph, sitemap, hreflang.
export default defineConfig({
  site: 'https://ebok-basketball.vercel.app',
  output: 'static',
  integrations: [sitemap()],
  i18n: {
    locales: ['fr', 'en'],
    defaultLocale: 'fr',
    routing: {
      prefixDefaultLocale: false, // fr à la racine, en sous /en/
    },
  },
});
