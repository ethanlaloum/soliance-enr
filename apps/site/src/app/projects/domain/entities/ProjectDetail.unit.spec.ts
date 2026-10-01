import { describe, expect, it } from 'vitest';
import { projects } from '@/app/projects/domain/entities/Project';
import {
  ProjectCallToAction,
  ProjectDetailLayout,
  findProjectDetail,
  projectDetailSlugs,
  projectDetails,
} from '@/app/projects/domain/entities/ProjectDetail';

describe('Project detail pages', () => {
  it('publishes the ten detail pages under their fixed slugs', () => {
    expect(projectDetailSlugs).toEqual([
      'vence-villa-16-kwc',
      'immeuble-bureaux-148-kwc',
      'pertuis-gymnase-163-kwc',
      'plan-de-la-tour-villa-20-kwc',
      'seranon-spar-36-kwc',
      'vence-villa-28-kwc',
      'villeneuve-loubet-maison-4-kwc',
      'saint-laurent-du-var-hangar-agricole-15-kwc',
      'saint-jeannet-villa-6-kwc',
      'la-colle-sur-loup-pac-13-kwc',
    ]);
  });

  it('links exactly the portfolio cards that have a detail page', () => {
    const cardSlugs = projects.flatMap((project) => (project.slug === null ? [] : [project.slug]));

    expect([...cardSlugs].sort()).toEqual([...projectDetailSlugs].sort());
  });

  it('finds the detail page of a slug', () => {
    expect(findProjectDetail(projectDetails, 'villeneuve-loubet-maison-4-kwc')).toEqual({
      layout: ProjectDetailLayout.COMPACT,
      slug: 'villeneuve-loubet-maison-4-kwc',
      mainImage: {
        key: 'seaView',
        src: '/images/projects/villeneuve-loubet-maison-4-kwc-sea-view.webp',
        width: 1280,
        height: 720,
        objectPosition: '50% 55%',
        columnWeight: 1,
      },
      mainImageFirst: true,
      secondaryImages: [
        {
          key: 'roof',
          src: '/images/projects/villeneuve-loubet-maison-4-kwc-roof.webp',
          width: 1280,
          height: 720,
          objectPosition: '50% 65%',
          columnWeight: 1,
        },
      ],
      callToAction: ProjectCallToAction.SIMULATOR,
    });
  });

  it('finds no detail page for an unknown slug', () => {
    expect(findProjectDetail(projectDetails, 'nice-villa-3-kwc')).toEqual(null);
  });

  it('finds no detail page when the route has no slug', () => {
    expect(findProjectDetail(projectDetails, undefined)).toEqual(null);
  });
});
