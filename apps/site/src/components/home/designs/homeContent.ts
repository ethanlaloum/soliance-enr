import { paths } from '@/routes/paths';

export const trustKeys = ['rge', 'decennial', 'installation', 'localTeam'] as const;
export const statKeys = ['installations', 'signature', 'maintenance'] as const;
export const estimateKeys = ['power', 'production', 'autonomy'] as const;
export const stepKeys = ['study', 'quote', 'paperwork', 'installation', 'followUp'] as const;
export const valueKeys = ['trust', 'transparency', 'expertise', 'proximity'] as const;
export const assuranceKeys = ['insurance', 'financing'] as const;
export const testimonialKeys = ['solar', 'heatPump', 'evCharger'] as const;

export const solutionEntries = [
  { key: 'solar', to: paths.solar, image: '/images/solution-solar.webp', imageHeight: 507, thumbnail: '/images/hero-vence-villa.webp', objectPosition: '50% 45%' },
  { key: 'heatPump', to: paths.heatPump, image: '/images/solution-heat-pump.webp', imageHeight: 900, thumbnail: '/images/solution-heat-pump.webp', objectPosition: '50% 50%' },
  { key: 'evCharger', to: paths.evCharger, image: '/images/solution-ev-charger.webp', imageHeight: 900, thumbnail: '/images/solution-ev-charger-thumb.webp', objectPosition: '50% 60%' },
] as const;

export const heroImage = { src: '/images/hero-villa-contemporaine.jpg', width: 1280, height: 720 } as const;
