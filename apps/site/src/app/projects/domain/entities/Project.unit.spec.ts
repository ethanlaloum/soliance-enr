import { describe, expect, it } from 'vitest';
import {
  ProjectBadgeTone,
  ProjectCategory,
  ProjectCity,
  countProjectsByCategory,
  filterProjects,
  findProjectBySlug,
  listProjectCities,
  projects,
  toProjectCity,
  type Project,
} from '@/app/projects/domain/entities/Project';

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

const venceVilla = aProject({
  id: 'vence-villa',
  slug: 'vence-villa',
  city: ProjectCity.VENCE,
  categories: [ProjectCategory.SOLAR, ProjectCategory.BATTERY],
  storageKwh: 15,
});
const niceStables = aProject({
  id: 'nice-stables',
  city: ProjectCity.NICE,
  categories: [ProjectCategory.SOLAR, ProjectCategory.BATTERY, ProjectCategory.PROFESSIONAL],
  storageKwh: 6,
});
const vencePool = aProject({
  id: 'vence-pool',
  city: ProjectCity.VENCE,
  categories: [ProjectCategory.SOLAR, ProjectCategory.HEAT_PUMP],
});
const officeWithoutCity = aProject({
  id: 'office',
  slug: 'office',
  city: null,
  categories: [ProjectCategory.SOLAR, ProjectCategory.PROFESSIONAL],
});
const fixtures = [venceVilla, niceStables, vencePool, officeWithoutCity];

describe('Project portfolio filtering', () => {
  it('keeps every project in its original order when no filter is set', () => {
    expect(filterProjects(fixtures, { category: null, city: null })).toEqual([venceVilla, niceStables, vencePool, officeWithoutCity]);
  });

  it('keeps the projects that include the selected category', () => {
    expect(filterProjects(fixtures, { category: ProjectCategory.BATTERY, city: null })).toEqual([venceVilla, niceStables]);
  });

  it('keeps the projects located in the selected city', () => {
    expect(filterProjects(fixtures, { category: null, city: ProjectCity.VENCE })).toEqual([venceVilla, vencePool]);
  });

  it('keeps the projects that match both the category and the city', () => {
    expect(filterProjects(fixtures, { category: ProjectCategory.HEAT_PUMP, city: ProjectCity.VENCE })).toEqual([vencePool]);
  });

  it('returns no project when no project matches the category in the city', () => {
    expect(filterProjects(fixtures, { category: ProjectCategory.EV_CHARGER, city: ProjectCity.NICE })).toEqual([]);
  });
});

describe('Project category counts', () => {
  it('counts the projects of each category, a project counting once in each of its categories', () => {
    expect(countProjectsByCategory(fixtures)).toEqual({
      [ProjectCategory.SOLAR]: 4,
      [ProjectCategory.BATTERY]: 2,
      [ProjectCategory.HEAT_PUMP]: 1,
      [ProjectCategory.EV_CHARGER]: 0,
      [ProjectCategory.PROFESSIONAL]: 2,
    });
  });

  it('counts the published portfolio shown on the projects page', () => {
    expect(countProjectsByCategory(projects)).toEqual({
      [ProjectCategory.SOLAR]: 18,
      [ProjectCategory.BATTERY]: 14,
      [ProjectCategory.HEAT_PUMP]: 2,
      [ProjectCategory.EV_CHARGER]: 2,
      [ProjectCategory.PROFESSIONAL]: 7,
    });
  });
});

describe('Project cities', () => {
  it('lists each city once in alphabetical order and ignores projects without a city', () => {
    expect(listProjectCities(fixtures)).toEqual([ProjectCity.NICE, ProjectCity.VENCE]);
  });

  it('lists the cities of the published portfolio for the city filter', () => {
    expect(listProjectCities(projects)).toEqual([
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
    ]);
  });

  it('reads a known city from the city select value', () => {
    expect(toProjectCity('saintLaurentDuVar')).toEqual(ProjectCity.SAINT_LAURENT_DU_VAR);
  });

  it('reads no city from an unknown select value', () => {
    expect(toProjectCity('paris')).toEqual(null);
  });
});

describe('Project lookup by slug', () => {
  it('finds the project whose detail page has the slug', () => {
    expect(findProjectBySlug(fixtures, 'office')).toEqual(officeWithoutCity);
  });

  it('finds no project for a project that has no detail page', () => {
    expect(findProjectBySlug(fixtures, 'nice-stables')).toEqual(null);
  });

  it('finds no project when the route has no slug', () => {
    expect(findProjectBySlug(fixtures, undefined)).toEqual(null);
  });
});
