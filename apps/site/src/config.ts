const readEnv = (value: string | undefined): string | null => (value && value.trim().length > 0 ? value.trim() : null);

export const config = {
  siteUrl: 'https://soliance-enr.fr',
  carePhoneHref: 'tel:+33633251179',
  careEmail: 'technique@soliance-enr.fr',
  officePhoneHref: 'tel:+33493195031',
  officeEmail: 'adv@soliance-enr.fr',
  simulatorUrl: 'https://vesta.eco/simulateur/soliance',
  showroomMapUrl: 'https://www.google.com/maps/search/?api=1&query=30+avenue+du+G%C3%A9n%C3%A9ral+Leclerc+06700+Saint-Laurent-du-Var',
  salesPhoneHref: 'tel:+33763545144',
  adminPhoneHref: 'tel:+33659403888',
  referralPhoneHref: 'tel:+33608628471',
  googleSiteVerification: readEnv(import.meta.env.VITE_GOOGLE_SITE_VERIFICATION),
  analyticsMeasurementId: readEnv(import.meta.env.VITE_GA_MEASUREMENT_ID),
  consentStorageKey: 'soliance-consent',
  leadEndpoint: '/api/lead.php',
  addressSearchEndpoint: 'https://data.geopf.fr/geocodage/search',
  addressSearchBias: { latitude: 43.6721, longitude: 7.1902 },
  solarYieldEndpoint: '/api/pvgis.php',
};
