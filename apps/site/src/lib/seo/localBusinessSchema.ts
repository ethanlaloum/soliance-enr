import { config } from '@/config';
import { businessId } from '@/lib/seo/structuredData';

export const localBusinessSchema = (description: string) => ({
  '@context': 'https://schema.org',
  '@type': 'Electrician',
  '@id': businessId(config.siteUrl),
  name: 'Soliance',
  legalName: 'Solar Trade SAS',
  description,
  url: config.siteUrl,
  image: `${config.siteUrl}/images/hero-villa-premium.webp`,
  logo: `${config.siteUrl}/favicon.svg`,
  telephone: '+33763545144',
  email: 'commercial@soliance-enr.fr',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '30 avenue du Général Leclerc',
    postalCode: '06700',
    addressLocality: 'Saint-Laurent-du-Var',
    addressRegion: 'Provence-Alpes-Côte d’Azur',
    addressCountry: 'FR',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 43.672097, longitude: 7.190202 },
  hasMap: config.showroomMapUrl,
  areaServed: [
    { '@type': 'AdministrativeArea', name: 'Alpes-Maritimes' },
    { '@type': 'AdministrativeArea', name: 'Var' },
    { '@type': 'AdministrativeArea', name: 'Bouches-du-Rhône' },
  ],
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
  ],
  identifier: 'SIREN 949 576 946',
});
