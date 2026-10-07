import { ProjectCategory, ProjectCity, type Project } from '@/app/projects/domain/entities/Project';

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export enum ServiceAreaDepartment {
  ALPES_MARITIMES = '06',
  VAR = '83',
}

export interface ServiceAreaImage {
  src: string;
  width: number;
  height: number;
}

export interface ServiceArea {
  slug: string;
  department: ServiceAreaDepartment;
  location: GeoPoint;
  solarYieldKwhPerKwc: number;
  monthlyYieldKwhPerKwc: number[];
  roadDistanceKm: number;
  driveMinutes: number;
  hero: ServiceAreaImage;
}

export interface AreaProductionEstimate {
  peakPowerKwc: number;
  yearlyKwh: number;
  monthlyKwh: number[];
}

const heroImage = (src: string): ServiceAreaImage => ({ src, width: 1280, height: 720 });

export const serviceAreas: ServiceArea[] = [
  {
    slug: 'nice',
    department: ServiceAreaDepartment.ALPES_MARITIMES,
    location: { latitude: 43.7032, longitude: 7.2528 },
    solarYieldKwhPerKwc: 1518,
    monthlyYieldKwhPerKwc: [86, 95, 130, 141, 155, 161, 173, 164, 136, 112, 85, 81],
    roadDistanceKm: 9,
    driveMinutes: 12,
    hero: heroImage('/images/local/nice.webp'),
  },
  {
    slug: 'antibes',
    department: ServiceAreaDepartment.ALPES_MARITIMES,
    location: { latitude: 43.5823, longitude: 7.1048 },
    solarYieldKwhPerKwc: 1495,
    monthlyYieldKwhPerKwc: [83, 93, 129, 141, 155, 160, 170, 161, 134, 109, 82, 78],
    roadDistanceKm: 18,
    driveMinutes: 18,
    hero: heroImage('/images/local/antibes.webp'),
  },
  {
    slug: 'cagnes-sur-mer',
    department: ServiceAreaDepartment.ALPES_MARITIMES,
    location: { latitude: 43.6712, longitude: 7.1502 },
    solarYieldKwhPerKwc: 1491,
    monthlyYieldKwhPerKwc: [83, 92, 129, 141, 155, 160, 171, 162, 133, 109, 81, 76],
    roadDistanceKm: 5,
    driveMinutes: 10,
    hero: heroImage('/images/projects/villeneuve-loubet-maison-4-kwc-sea-view.webp'),
  },
  {
    slug: 'cannes',
    department: ServiceAreaDepartment.ALPES_MARITIMES,
    location: { latitude: 43.5454, longitude: 7.0152 },
    solarYieldKwhPerKwc: 1508,
    monthlyYieldKwhPerKwc: [84, 93, 130, 142, 155, 161, 172, 163, 135, 110, 83, 79],
    roadDistanceKm: 27,
    driveMinutes: 28,
    hero: heroImage('/images/local/cannes.webp'),
  },
  {
    slug: 'grasse',
    department: ServiceAreaDepartment.ALPES_MARITIMES,
    location: { latitude: 43.656, longitude: 6.937 },
    solarYieldKwhPerKwc: 1527,
    monthlyYieldKwhPerKwc: [90, 96, 130, 140, 154, 159, 172, 165, 135, 112, 88, 86],
    roadDistanceKm: 34,
    driveMinutes: 32,
    hero: heroImage('/images/local/grasse.webp'),
  },
  {
    slug: 'menton',
    department: ServiceAreaDepartment.ALPES_MARITIMES,
    location: { latitude: 43.7961, longitude: 7.498 },
    solarYieldKwhPerKwc: 1463,
    monthlyYieldKwhPerKwc: [71, 87, 127, 140, 156, 161, 173, 165, 133, 106, 75, 69],
    roadDistanceKm: 44,
    driveMinutes: 42,
    hero: heroImage('/images/local/menton.webp'),
  },
  {
    slug: 'toulon',
    department: ServiceAreaDepartment.VAR,
    location: { latitude: 43.1364, longitude: 5.9334 },
    solarYieldKwhPerKwc: 1543,
    monthlyYieldKwhPerKwc: [86, 98, 132, 148, 160, 165, 176, 165, 139, 110, 83, 81],
    roadDistanceKm: 142,
    driveMinutes: 97,
    hero: heroImage('/images/projects/plan-de-la-tour-villa-20-kwc-villa-drone.webp'),
  },
  {
    slug: 'frejus',
    department: ServiceAreaDepartment.VAR,
    location: { latitude: 43.4553, longitude: 6.7848 },
    solarYieldKwhPerKwc: 1537,
    monthlyYieldKwhPerKwc: [88, 96, 133, 145, 157, 163, 174, 165, 137, 112, 85, 83],
    roadDistanceKm: 61,
    driveMinutes: 51,
    hero: heroImage('/images/local/frejus.webp'),
  },
];

export const serviceAreaSlugs = serviceAreas.map((area) => area.slug);

export const projectCityLocations: Record<ProjectCity, GeoPoint> = {
  [ProjectCity.ANTIBES]: { latitude: 43.5823, longitude: 7.1048 },
  [ProjectCity.BERRE_L_ETANG]: { latitude: 43.4976, longitude: 5.1596 },
  [ProjectCity.FLAYOSC]: { latitude: 43.5441, longitude: 6.3577 },
  [ProjectCity.LA_COLLE_SUR_LOUP]: { latitude: 43.6869, longitude: 7.0975 },
  [ProjectCity.LA_GAUDE]: { latitude: 43.7177, longitude: 7.1605 },
  [ProjectCity.LE_PLAN_DE_LA_TOUR]: { latitude: 43.337, longitude: 6.5462 },
  [ProjectCity.NICE]: { latitude: 43.7032, longitude: 7.2528 },
  [ProjectCity.PERTUIS]: { latitude: 43.6931, longitude: 5.5345 },
  [ProjectCity.ROQUEBRUNE_SUR_ARGENS]: { latitude: 43.4282, longitude: 6.6525 },
  [ProjectCity.SAINT_JEANNET]: { latitude: 43.7619, longitude: 7.1477 },
  [ProjectCity.SAINT_LAURENT_DU_VAR]: { latitude: 43.6865, longitude: 7.1822 },
  [ProjectCity.SERANON]: { latitude: 43.7655, longitude: 6.6892 },
  [ProjectCity.VENCE]: { latitude: 43.7373, longitude: 7.0995 },
  [ProjectCity.VILLENEUVE_LOUBET]: { latitude: 43.647, longitude: 7.0984 },
};

const earthRadiusKm = 6371;

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

export const distanceKm = (from: GeoPoint, to: GeoPoint): number => {
  const latitudeDelta = toRadians(to.latitude - from.latitude);
  const longitudeDelta = toRadians(to.longitude - from.longitude);
  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 + Math.cos(toRadians(from.latitude)) * Math.cos(toRadians(to.latitude)) * Math.sin(longitudeDelta / 2) ** 2;
  return 2 * earthRadiusKm * Math.asin(Math.sqrt(haversine));
};

export const findServiceArea = (list: ServiceArea[], slug: string | undefined): ServiceArea | null =>
  list.find((area) => slug !== undefined && area.slug === slug) ?? null;

export const nearestSolarProjects = (area: ServiceArea, list: Project[], count: number): Project[] => {
  const located = list.flatMap((project) =>
    project.city !== null && project.categories.includes(ProjectCategory.SOLAR) && !project.categories.includes(ProjectCategory.EV_CHARGER)
      ? [{ project, city: project.city, distance: distanceKm(area.location, projectCityLocations[project.city]) }]
      : [],
  );
  const seenCities = new Set<ProjectCity>();
  return [...located]
    .sort((first, second) => first.distance - second.distance)
    .filter(({ city }) => {
      if (seenCities.has(city)) return false;
      seenCities.add(city);
      return true;
    })
    .slice(0, count)
    .map(({ project }) => project);
};

export const estimateAreaProduction = (area: ServiceArea, peakPowerKwc: number): AreaProductionEstimate => ({
  peakPowerKwc,
  yearlyKwh: Math.round((area.solarYieldKwhPerKwc * peakPowerKwc) / 100) * 100,
  monthlyKwh: area.monthlyYieldKwhPerKwc.map((kwh) => Math.round(kwh * peakPowerKwc)),
});
