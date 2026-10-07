import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import { paths } from '@/routes/paths';
import { revealDelay } from '@/components/motion/revealDelay';
import { containerClassName } from '@/components/home/containerClassName';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { projects } from '@/app/projects/domain/entities/Project';
import { nearestSolarProjects, type ServiceArea } from '@/app/service-areas/domain/entities/ServiceArea';
import type { LocalSolarTextValues } from '@/components/local-solar/localSolarTextValues';

const shownProjectCount = 3;

type LocalSolarProjectsSectionProps = {
  area: ServiceArea;
  values: LocalSolarTextValues;
};

export const LocalSolarProjectsSection = ({ area, values }: LocalSolarProjectsSectionProps) => {
  const { t } = useTranslation('localSolar');
  const nearby = nearestSolarProjects(area, projects, shownProjectCount);

  return (
    <section aria-labelledby="local-solar-projects-title" className={cn(containerClassName, 'flex flex-col gap-5 pb-10 lg:gap-6 lg:pb-16')}>
      <div data-reveal className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <h2 id="local-solar-projects-title" className="text-[26px] font-bold leading-[1.15] tracking-[-0.02em] lg:text-[32px]">
          {t('projects.title', values)}
        </h2>
        <Link to={paths.projects} className="group shrink-0 text-[15px] font-semibold">
          {t('projects.seeAll')}{' '}
          <span aria-hidden="true" className="inline-block transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none">
            →
          </span>
        </Link>
      </div>
      <ul className="grid gap-4 md:grid-cols-3 lg:gap-5">
        {nearby.map((project, index) => (
          <li key={project.id} data-reveal style={revealDelay(index)}>
            <ProjectCard project={project} titleAs="h3" />
          </li>
        ))}
      </ul>
    </section>
  );
};
