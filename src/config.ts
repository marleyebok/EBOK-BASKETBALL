/**
 * Configuration du site (à ajuster sans toucher au reste du code).
 */
export const siteConfig = {
  /** Adresse de contact / destinataire de repli du formulaire. */
  contactEmail: 'Ebok.basket@gmail.com',

  /**
   * Endpoint Formspree pour le formulaire d'accès anticipé.
   * - Vide '' : le formulaire fonctionne quand même via un repli `mailto:`.
   * - Pour collecter proprement les e-mails : crée un formulaire gratuit sur
   *   https://formspree.io puis colle ici l'URL (ex. 'https://formspree.io/f/abcdwxyz').
   */
  formspreeEndpoint: '',

  /**
   * Analytics respectueux de la vie privée (Plausible, sans cookies).
   * - Vide '' : désactivé (aucun script chargé).
   * - Renseigne le domaine du site (ex. 'ebok-basketball.vercel.app') APRÈS avoir
   *   créé le site sur https://plausible.io pour activer la mesure d'audience.
   */
  plausibleDomain: '',
};
