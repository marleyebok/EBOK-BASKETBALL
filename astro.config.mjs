// @ts-check
import { defineConfig } from 'astro/config';

// Site 100 % statique. Renseigne `site` avec ton domaine de prod :
// il sert aux URL canoniques et aux balises Open Graph absolues.
// À remplacer par le vrai domaine EBOK Basketball le jour du déploiement.
export default defineConfig({
  site: 'https://ebok-basketball.fr',
  // Sortie statique : chaque page est pré-rendue en HTML au build.
  output: 'static',
});
