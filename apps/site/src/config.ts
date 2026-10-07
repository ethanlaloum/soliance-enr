const readEnv = (value: string | undefined): string | null => (value && value.trim().length > 0 ? value.trim() : null);

export const config = {
  siteUrl: 'https://soliance-enr.fr',
  carePhoneHref: 'tel:+33633251179',
  careEmail: 'technique@soliance-enr.fr',
  simulatorUrl: 'https://vesta.eco/simulateur/soliance',
  showroomMapUrl: 'https://www.google.com/maps/search/?api=1&query=30+avenue+du+G%C3%A9n%C3%A9ral+Leclerc+06700+Saint-Laurent-du-Var',
  salesPhoneHref: 'tel:+33763545144',
  adminPhoneHref: 'tel:+33659403888',
  referralPhoneHref: 'tel:+33608628471',
  googleSiteVerification: readEnv(import.meta.env.VITE_GOOGLE_SITE_VERIFICATION),
  leadEndpoint: '/api/lead.php',
};
