import { describe, expect, it } from 'vitest';
import { ProjectBadgeTone, ProjectCategory, ProjectCity, projects, type Project } from '@/app/projects/domain/entities/Project';
import {
  ServiceAreaDepartment,
  distanceKm,
  estimateAreaProduction,
  findServiceArea,
  nearestSolarProjects,
  serviceAreas,
  type ServiceArea,
} from '@/app/service-areas/domain/entities/ServiceArea';

const aProject = (overrides: Partial<Project> & Pick<Project, 'id'>): Project => ({
  slug: null,
  city: ProjectCity.NICE,
  categories: [ProjectCategory.SOLAR],
  peakPowerKwc: 6,
  storageKwh: null,
  year: 2026,
  badgeTone: ProjectBadgeTone.SOLAR,
  cover: null,
  ...overrides,
});

const antibes: ServiceArea = {
  slug: 'antibes',
  department: ServiceAreaDepartment.ALPES_MARITIMES,
  location: { latitude: 43.5823, longitude: 7.1048 },
  solarYieldKwhPerKwc: 1495,
  monthlyYieldKwhPerKwc: [83, 93, 129, 141, 155, 160, 170, 161, 134, 109, 82, 78],
  roadDistanceKm: 18,
  driveMinutes: 18,
  hero: { src: '/images/local/antibes.webp', width: 1280, height: 720 },
};

const niceStables = aProject({ id: 'nice-stables', city: ProjectCity.NICE });
const antibesVilla = aProject({ id: 'antibes-villa', city: ProjectCity.ANTIBES });
const antibesSecondVilla = aProject({ id: 'antibes-second-villa', city: ProjectCity.ANTIBES });
const villeneuveHouse = aProject({ id: 'villeneuve-house', city: ProjectCity.VILLENEUVE_LOUBET });
const villeneuveSolarChargers = aProject({ id: 'villeneuve-chargers', city: ProjectCity.VILLENEUVE_LOUBET, categories: [ProjectCategory.SOLAR, ProjectCategory.EV_CHARGER] });
const officeWithoutCity = aProject({ id: 'office', city: null });

describe('Service areas', () => {
  it('finds an area by its slug and nothing for an unknown or missing slug', () => {
    expect(findServiceArea([antibes], 'antibes')).toEqual(antibes);
    expect(findServiceArea([antibes], 'marseille')).toEqual(null);
    expect(findServiceArea([antibes], undefined)).toEqual(null);
  });

  it('measures the straight-line distance between two places in kilometres', () => {
    expect(Math.round(distanceKm({ latitude: 43.7032, longitude: 7.2528 }, antibes.location))).toEqual(18);
    expect(distanceKm(antibes.location, antibes.location)).toEqual(0);
  });

  it('picks the nearest solar projects, one per city, leaving out charger projects and projects without a city', () => {
    expect(
      nearestSolarProjects(antibes, [niceStables, villeneuveSolarChargers, officeWithoutCity, antibesSecondVilla, villeneuveHouse, antibesVilla], 3),
    ).toEqual([antibesSecondVilla, villeneuveHouse, niceStables]);
  });

  it('shows the real projects closest to each local page', () => {
    expect(
      Object.fromEntries(serviceAreas.map((area) => [area.slug, nearestSolarProjects(area, projects, 3).map((project) => project.id)])),
    ).toEqual({
      nice: ['nice-equestrian-centre-9-kwc', 'saint-laurent-du-var-hangar-agricole-15-kwc', 'la-gaude-estate-21-kwc'],
      antibes: ['antibes-villa-10-kwc', 'villeneuve-loubet-maison-4-kwc', 'la-colle-sur-loup-pac-13-kwc'],
      'cagnes-sur-mer': ['saint-laurent-du-var-hangar-agricole-15-kwc', 'la-colle-sur-loup-pac-13-kwc', 'villeneuve-loubet-maison-4-kwc'],
      cannes: ['antibes-villa-10-kwc', 'villeneuve-loubet-maison-4-kwc', 'la-colle-sur-loup-pac-13-kwc'],
      grasse: ['villeneuve-loubet-maison-4-kwc', 'la-colle-sur-loup-pac-13-kwc', 'antibes-villa-10-kwc'],
      menton: ['nice-equestrian-centre-9-kwc', 'saint-laurent-du-var-hangar-agricole-15-kwc', 'saint-jeannet-villa-6-kwc'],
      toulon: ['plan-de-la-tour-villa-20-kwc', 'roquebrune-sur-argens-villa-10-kwc', 'pertuis-gymnase-163-kwc'],
      frejus: ['roquebrune-sur-argens-villa-10-kwc', 'plan-de-la-tour-villa-20-kwc', 'antibes-villa-10-kwc'],
    });
  });

  it('estimates the production of an installation from the local yield, the year rounded to 100 kWh', () => {
    expect(estimateAreaProduction(antibes, 6)).toEqual({
      peakPowerKwc: 6,
      yearlyKwh: 9000,
      monthlyKwh: [498, 558, 774, 846, 930, 960, 1020, 966, 804, 654, 492, 468],
    });
  });
});
