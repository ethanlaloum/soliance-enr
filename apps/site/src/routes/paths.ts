export const paths = {
  home: '/',
  solar: '/panneaux-solaires',
  localSolar: '/panneaux-solaires/:area',
  heatPump: '/pompe-a-chaleur',
  evCharger: '/borne-de-recharge',
  professionals: '/professionnels',
  projects: '/realisations',
  resources: '/ressources',
  simulator: '/simulateur',
  projectDetail: '/realisations/:slug',
  referral: '/parrainage',
  care: '/soliance-care',
  renovation: '/renovation-globale',
  about: '/a-propos',
  contact: '/contact',
  legalNotice: '/mentions-legales',
  termsIndividuals: '/cgv',
  termsProfessionals: '/cgv-professionnels',
  privacy: '/confidentialite',
  cookies: '/cookies',
} as const;

export const contactAnchor = 'contact';

export const projectPath = (slug: string) => `/realisations/${slug}`;

export const localSolarPath = (areaSlug: string) => `/panneaux-solaires/${areaSlug}`;
