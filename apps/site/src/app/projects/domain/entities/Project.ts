export enum ProjectCategory {
  SOLAR = 'solar',
  BATTERY = 'battery',
  HEAT_PUMP = 'heatPump',
  EV_CHARGER = 'evCharger',
  PROFESSIONAL = 'professional',
}

export const projectCategories: ProjectCategory[] = [
  ProjectCategory.SOLAR,
  ProjectCategory.BATTERY,
  ProjectCategory.HEAT_PUMP,
  ProjectCategory.EV_CHARGER,
  ProjectCategory.PROFESSIONAL,
];

export enum ProjectCity {
  ANTIBES = 'antibes',
  BERRE_L_ETANG = 'berreLEtang',
  FLAYOSC = 'flayosc',
  LA_COLLE_SUR_LOUP = 'laColleSurLoup',
  LA_GAUDE = 'laGaude',
  LE_PLAN_DE_LA_TOUR = 'lePlanDeLaTour',
  NICE = 'nice',
  PERTUIS = 'pertuis',
  ROQUEBRUNE_SUR_ARGENS = 'roquebruneSurArgens',
  SAINT_JEANNET = 'saintJeannet',
  SAINT_LAURENT_DU_VAR = 'saintLaurentDuVar',
  SERANON = 'seranon',
  VENCE = 'vence',
  VILLENEUVE_LOUBET = 'villeneuveLoubet',
}

export const projectCities: ProjectCity[] = [
  ProjectCity.ANTIBES,
  ProjectCity.BERRE_L_ETANG,
  ProjectCity.FLAYOSC,
  ProjectCity.LA_COLLE_SUR_LOUP,
  ProjectCity.LA_GAUDE,
  ProjectCity.LE_PLAN_DE_LA_TOUR,
  ProjectCity.NICE,
  ProjectCity.PERTUIS,
  ProjectCity.ROQUEBRUNE_SUR_ARGENS,
  ProjectCity.SAINT_JEANNET,
  ProjectCity.SAINT_LAURENT_DU_VAR,
  ProjectCity.SERANON,
  ProjectCity.VENCE,
  ProjectCity.VILLENEUVE_LOUBET,
];

export enum ProjectBadgeTone {
  SOLAR = 'solar',
  NIGHT = 'night',
  HEAT = 'heat',
}

export interface ProjectImage {
  src: string;
  width: number;
  height: number;
  objectPosition: string;
}

export interface Project {
  id: string;
  slug: string | null;
  city: ProjectCity | null;
  categories: ProjectCategory[];
  peakPowerKwc: number;
  storageKwh: number | null;
  year: number | null;
  badgeTone: ProjectBadgeTone;
  cover: ProjectImage | null;
}

export interface ProjectFilter {
  category: ProjectCategory | null;
  city: ProjectCity | null;
}

export type ProjectCategoryCounts = Record<ProjectCategory, number>;

const cardImage = (id: string, objectPosition = '50% 50%'): ProjectImage => ({
  src: `/images/projects/cards/${id}.webp`,
  width: 800,
  height: 450,
  objectPosition,
});

export const projects: Project[] = [
  {
    id: 'vence-villa-16-kwc',
    slug: 'vence-villa-16-kwc',
    city: ProjectCity.VENCE,
    categories: [ProjectCategory.SOLAR, ProjectCategory.BATTERY],
    peakPowerKwc: 16,
    storageKwh: 15,
    year: 2026,
    badgeTone: ProjectBadgeTone.SOLAR,
    cover: cardImage('vence-villa-16-kwc'),
  },
  {
    id: 'plan-de-la-tour-villa-20-kwc',
    slug: 'plan-de-la-tour-villa-20-kwc',
    city: ProjectCity.LE_PLAN_DE_LA_TOUR,
    categories: [ProjectCategory.SOLAR, ProjectCategory.BATTERY],
    peakPowerKwc: 20,
    storageKwh: 24,
    year: 2026,
    badgeTone: ProjectBadgeTone.SOLAR,
    cover: cardImage('plan-de-la-tour-villa-20-kwc'),
  },
  {
    id: 'vence-villa-28-kwc',
    slug: 'vence-villa-28-kwc',
    city: ProjectCity.VENCE,
    categories: [ProjectCategory.SOLAR, ProjectCategory.BATTERY],
    peakPowerKwc: 28.5,
    storageKwh: 35,
    year: 2026,
    badgeTone: ProjectBadgeTone.SOLAR,
    cover: cardImage('vence-villa-28-kwc'),
  },
  {
    id: 'villeneuve-loubet-maison-4-kwc',
    slug: 'villeneuve-loubet-maison-4-kwc',
    city: ProjectCity.VILLENEUVE_LOUBET,
    categories: [ProjectCategory.SOLAR, ProjectCategory.BATTERY],
    peakPowerKwc: 4,
    storageKwh: 6,
    year: 2026,
    badgeTone: ProjectBadgeTone.SOLAR,
    cover: cardImage('villeneuve-loubet-maison-4-kwc', '50% 60%'),
  },
  {
    id: 'saint-jeannet-villa-6-kwc',
    slug: 'saint-jeannet-villa-6-kwc',
    city: ProjectCity.SAINT_JEANNET,
    categories: [ProjectCategory.SOLAR, ProjectCategory.BATTERY],
    peakPowerKwc: 6,
    storageKwh: 6,
    year: 2026,
    badgeTone: ProjectBadgeTone.SOLAR,
    cover: cardImage('saint-jeannet-villa-6-kwc', '50% 60%'),
  },
  {
    id: 'saint-laurent-du-var-hangar-agricole-15-kwc',
    slug: 'saint-laurent-du-var-hangar-agricole-15-kwc',
    city: ProjectCity.SAINT_LAURENT_DU_VAR,
    categories: [ProjectCategory.SOLAR, ProjectCategory.BATTERY, ProjectCategory.PROFESSIONAL],
    peakPowerKwc: 15,
    storageKwh: 12,
    year: 2025,
    badgeTone: ProjectBadgeTone.NIGHT,
    cover: cardImage('saint-laurent-du-var-hangar-agricole-15-kwc', '50% 55%'),
  },
  {
    id: 'roquebrune-sur-argens-villa-10-kwc',
    slug: null,
    city: ProjectCity.ROQUEBRUNE_SUR_ARGENS,
    categories: [ProjectCategory.SOLAR, ProjectCategory.BATTERY],
    peakPowerKwc: 10,
    storageKwh: 11.5,
    year: 2025,
    badgeTone: ProjectBadgeTone.SOLAR,
    cover: cardImage('roquebrune-sur-argens-villa-10-kwc'),
  },
  {
    id: 'la-gaude-estate-21-kwc',
    slug: null,
    city: ProjectCity.LA_GAUDE,
    categories: [ProjectCategory.SOLAR, ProjectCategory.BATTERY],
    peakPowerKwc: 21,
    storageKwh: 18,
    year: 2025,
    badgeTone: ProjectBadgeTone.SOLAR,
    cover: cardImage('la-gaude-estate-21-kwc'),
  },
  {
    id: 'nice-equestrian-centre-9-kwc',
    slug: null,
    city: ProjectCity.NICE,
    categories: [ProjectCategory.SOLAR, ProjectCategory.BATTERY, ProjectCategory.PROFESSIONAL],
    peakPowerKwc: 9,
    storageKwh: 6,
    year: 2024,
    badgeTone: ProjectBadgeTone.NIGHT,
    cover: cardImage('nice-equestrian-centre-9-kwc', '50% 60%'),
  },
  {
    id: 'berre-l-etang-farm-shed-30-kwc',
    slug: null,
    city: ProjectCity.BERRE_L_ETANG,
    categories: [ProjectCategory.SOLAR, ProjectCategory.BATTERY, ProjectCategory.PROFESSIONAL],
    peakPowerKwc: 30,
    storageKwh: 24,
    year: 2024,
    badgeTone: ProjectBadgeTone.NIGHT,
    cover: cardImage('berre-l-etang-farm-shed-30-kwc'),
  },
  {
    id: 'saint-laurent-du-var-heat-pump-7-kwc',
    slug: null,
    city: ProjectCity.SAINT_LAURENT_DU_VAR,
    categories: [ProjectCategory.SOLAR, ProjectCategory.BATTERY, ProjectCategory.HEAT_PUMP],
    peakPowerKwc: 7,
    storageKwh: 10,
    year: 2026,
    badgeTone: ProjectBadgeTone.HEAT,
    cover: cardImage('saint-laurent-du-var-heat-pump-7-kwc', '50% 55%'),
  },
  {
    id: 'antibes-villa-10-kwc',
    slug: null,
    city: ProjectCity.ANTIBES,
    categories: [ProjectCategory.SOLAR, ProjectCategory.BATTERY],
    peakPowerKwc: 10,
    storageKwh: 10,
    year: 2026,
    badgeTone: ProjectBadgeTone.SOLAR,
    cover: cardImage('antibes-villa-10-kwc', '50% 45%'),
  },
  {
    id: 'immeuble-bureaux-148-kwc',
    slug: 'immeuble-bureaux-148-kwc',
    city: null,
    categories: [ProjectCategory.SOLAR, ProjectCategory.PROFESSIONAL],
    peakPowerKwc: 148,
    storageKwh: null,
    year: 2025,
    badgeTone: ProjectBadgeTone.NIGHT,
    cover: cardImage('immeuble-bureaux-148-kwc'),
  },
  {
    id: 'villeneuve-loubet-le-kern-145-kwc',
    slug: null,
    city: ProjectCity.VILLENEUVE_LOUBET,
    categories: [ProjectCategory.SOLAR, ProjectCategory.EV_CHARGER, ProjectCategory.PROFESSIONAL],
    peakPowerKwc: 145,
    storageKwh: null,
    year: null,
    badgeTone: ProjectBadgeTone.SOLAR,
    cover: null,
  },
  {
    id: 'la-colle-sur-loup-pac-13-kwc',
    slug: 'la-colle-sur-loup-pac-13-kwc',
    city: ProjectCity.LA_COLLE_SUR_LOUP,
    categories: [ProjectCategory.SOLAR, ProjectCategory.BATTERY, ProjectCategory.HEAT_PUMP],
    peakPowerKwc: 13,
    storageKwh: 15,
    year: 2026,
    badgeTone: ProjectBadgeTone.HEAT,
    cover: cardImage('la-colle-sur-loup-pac-13-kwc', '50% 55%'),
  },
  {
    id: 'flayosc-ev-chargers-12-kwc',
    slug: null,
    city: ProjectCity.FLAYOSC,
    categories: [ProjectCategory.SOLAR, ProjectCategory.BATTERY, ProjectCategory.EV_CHARGER],
    peakPowerKwc: 12,
    storageKwh: 6,
    year: 2025,
    badgeTone: ProjectBadgeTone.SOLAR,
    cover: cardImage('flayosc-ev-chargers-12-kwc'),
  },
  {
    id: 'pertuis-gymnase-163-kwc',
    slug: 'pertuis-gymnase-163-kwc',
    city: ProjectCity.PERTUIS,
    categories: [ProjectCategory.SOLAR, ProjectCategory.PROFESSIONAL],
    peakPowerKwc: 163,
    storageKwh: null,
    year: 2026,
    badgeTone: ProjectBadgeTone.NIGHT,
    cover: cardImage('pertuis-gymnase-163-kwc'),
  },
  {
    id: 'seranon-spar-36-kwc',
    slug: 'seranon-spar-36-kwc',
    city: ProjectCity.SERANON,
    categories: [ProjectCategory.SOLAR, ProjectCategory.PROFESSIONAL],
    peakPowerKwc: 36,
    storageKwh: null,
    year: 2024,
    badgeTone: ProjectBadgeTone.NIGHT,
    cover: cardImage('seranon-spar-36-kwc'),
  },
];

const matchesFilter = (project: Project, filter: ProjectFilter): boolean =>
  (filter.category === null || project.categories.includes(filter.category)) && (filter.city === null || project.city === filter.city);

export const filterProjects = (list: Project[], filter: ProjectFilter): Project[] => list.filter((project) => matchesFilter(project, filter));

export const listProjectCities = (list: Project[]): ProjectCity[] => projectCities.filter((city) => list.some((project) => project.city === city));

export const countProjectsByCategory = (list: Project[]): ProjectCategoryCounts => ({
  [ProjectCategory.SOLAR]: filterProjects(list, { category: ProjectCategory.SOLAR, city: null }).length,
  [ProjectCategory.BATTERY]: filterProjects(list, { category: ProjectCategory.BATTERY, city: null }).length,
  [ProjectCategory.HEAT_PUMP]: filterProjects(list, { category: ProjectCategory.HEAT_PUMP, city: null }).length,
  [ProjectCategory.EV_CHARGER]: filterProjects(list, { category: ProjectCategory.EV_CHARGER, city: null }).length,
  [ProjectCategory.PROFESSIONAL]: filterProjects(list, { category: ProjectCategory.PROFESSIONAL, city: null }).length,
});

export const findProjectBySlug = (list: Project[], slug: string | undefined): Project | null =>
  list.find((project) => slug !== undefined && project.slug === slug) ?? null;

const isProjectCity = (value: string): value is ProjectCity => (projectCities as string[]).includes(value);

export const toProjectCity = (value: string): ProjectCity | null => (isProjectCity(value) ? value : null);
