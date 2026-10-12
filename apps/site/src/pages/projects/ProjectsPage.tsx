import '@/lib/i18n/namespaces/projects';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { paths } from '@/routes/paths';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { revealDelay } from '@/components/motion/revealDelay';
import { EnergyPremiumHero } from '@/components/energy/EnergyPremiumHero';
import { containerClassName } from '@/components/home/containerClassName';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { ProjectFilters } from '@/components/projects/ProjectFilters';
import {
  countProjectsByCategory,
  filterProjects,
  listProjectCities,
  projects,
  type ProjectCategory,
  type ProjectCity,
} from '@/app/projects/domain/entities/Project';

const portfolioCities = listProjectCities(projects);

const portfolioAnchor = 'portfolio';

export const ProjectsPage = () => {
  useScrollReveal();
  const { t } = useTranslation('projects');
  const [category, setCategory] = useState<ProjectCategory | null>(null);
  const [city, setCity] = useState<ProjectCity | null>(null);

  const projectsInCity = filterProjects(projects, { category: null, city });
  const visibleProjectIds = new Set(filterProjects(projects, { category, city }).map((project) => project.id));
  const resetFilters = () => {
    setCategory(null);
    setCity(null);
  };

  return (
    <div className="energy-page flex flex-1 flex-col">
      <EnergyPremiumHero
        variant="projects"
        compact
        breadcrumb={t('portfolio.breadcrumb')}
        eyebrow={t('portfolio.eyebrow')}
        title={t('portfolio.title')}
        accent={t('portfolio.titleAccent')}
        lead={t('portfolio.intro')}
        image="/images/projects/vence-villa-28-kwc-villa-drone.webp"
        imageWidth={1280}
        imageHeight={720}
        imageAlt={t('portfolio.imageAlt')}
        primaryLabel={t('portfolio.requestStudy')}
        secondaryLabel={t('portfolio.simulate')}
        secondaryHref={paths.simulator}
        caption={t('portfolio.caption')}
        learnLabel={t('portfolio.learn')}
        learnHref={`#${portfolioAnchor}`}
        trust={[
          t('portfolio.trust.published', { count: projects.length }),
          t('portfolio.trust.monitoring'),
          t('portfolio.trust.clients'),
        ]}
      />
      <section id={portfolioAnchor} aria-label={t('portfolio.kicker')} className={cn(containerClassName, 'scroll-mt-4 pb-14 pt-10 lg:pb-24 lg:pt-16')}>
        <div data-reveal className="flex flex-col gap-5 border-b border-sand-line pb-6 lg:gap-6 lg:pb-8">
          <div className="flex items-center justify-between gap-4">
            <p className="energy-kicker">{t('portfolio.kicker')}</p>
            <p aria-hidden="true" className="text-[13px] tabular-nums text-slate-ink">
              {t('portfolio.count', { count: visibleProjectIds.size })}
            </p>
          </div>
          <ProjectFilters
            category={category}
            city={city}
            counts={countProjectsByCategory(projectsInCity)}
            totalCount={projectsInCity.length}
            cities={portfolioCities}
            onCategoryChange={setCategory}
            onCityChange={setCity}
          />
        </div>
        <p role="status" className="sr-only">
          {t('portfolio.resultCount', { count: visibleProjectIds.size })}
        </p>
        <ul className="mt-6 grid gap-4 md:grid-cols-2 lg:mt-10 lg:grid-cols-3 lg:gap-6">
          {projects.map((project, index) => (
            <li key={project.id} hidden={!visibleProjectIds.has(project.id)} data-reveal style={revealDelay(index % 3)}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
        {visibleProjectIds.size === 0 && (
          <div className="mt-6 flex flex-col items-start gap-3 rounded-md border border-sand-line bg-white p-6 lg:mt-10 lg:p-8">
            <p className="text-base text-slate-text">{t('portfolio.empty')}</p>
            <button type="button" onClick={resetFilters} className="energy-link">
              {t('portfolio.reset')}
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
