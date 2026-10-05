import '@/lib/i18n/namespaces/projects';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { revealDelay } from '@/components/motion/revealDelay';
import { Breadcrumb } from '@/components/page/Breadcrumb';
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
    <>
      <section aria-labelledby="projects-title" className={cn('hz-page-container', 'hz-page-hero flex flex-col gap-5 !pb-8 lg:gap-7')}>
        <Breadcrumb items={[{ label: t('portfolio.breadcrumb') }]} tone="light" className="motion-safe:animate-fade-up" />
        <h1
          id="projects-title"
          className="hz-page-title motion-safe:animate-fade-up motion-safe:[animation-delay:80ms]"
        >
          {t('portfolio.title')}
        </h1>
        <p className="hz-page-lead max-w-[740px] motion-safe:animate-fade-up motion-safe:[animation-delay:160ms] lg:text-lg">
          {t('portfolio.intro')}
        </p>
        <ProjectFilters
          category={category}
          city={city}
          counts={countProjectsByCategory(projectsInCity)}
          totalCount={projectsInCity.length}
          cities={portfolioCities}
          onCategoryChange={setCategory}
          onCityChange={setCity}
          className="mt-7 border-t border-sand-line pt-7 motion-safe:animate-fade-up motion-safe:[animation-delay:240ms] lg:mt-10"
        />
      </section>
      <div className={cn('hz-page-container', 'pb-20 pt-6 lg:pb-28 lg:pt-8')}>
        <p role="status" className="sr-only">
          {t('portfolio.resultCount', { count: visibleProjectIds.size })}
        </p>
        <ul className="grid gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-14">
          {projects.map((project, index) => (
            <li key={project.id} hidden={!visibleProjectIds.has(project.id)} data-reveal style={revealDelay(index % 3)}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
        {visibleProjectIds.size === 0 && (
          <div className="flex flex-col items-start gap-3 rounded-md border border-sand-line bg-white p-6 lg:p-8">
            <p className="text-base text-slate-text">{t('portfolio.empty')}</p>
            <button
              type="button"
              onClick={resetFilters}
              className="text-[15px] font-medium text-solar transition-colors hover:text-solar-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solar"
            >
              {t('portfolio.reset')}
            </button>
          </div>
        )}
      </div>
    </>
  );
};
