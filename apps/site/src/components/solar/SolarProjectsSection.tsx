import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import { paths, projectPath } from '@/routes/paths';
import { revealDelay } from '@/components/motion/revealDelay';
import { containerClassName } from '@/components/solar/horizonSolutionStyles';

const projects = [
  { key: 'venceVilla', slug: 'vence-villa-16-kwc', image: '/images/solar/project-vence-villa.webp', height: 533 },
  { key: 'varVilla', slug: 'plan-de-la-tour-villa-20-kwc', image: '/images/solar/project-var-villa.webp', height: 450 },
  { key: 'solisInvest', slug: 'immeuble-bureaux-148-kwc', image: '/images/solar/project-solis-invest.webp', height: 450 },
] as const;

export const SolarProjectsSection = () => {
  const { t } = useTranslation('solar');

  return (
    <section aria-labelledby="solar-projects-title" className={cn(containerClassName, 'flex flex-col gap-5 pb-10 lg:gap-6 lg:pb-16')}>
      <div data-reveal className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <h2 id="solar-projects-title" className="text-[26px] font-medium leading-[1.15] tracking-[-0.045em] lg:text-[32px]">
          {t('projects.title')}
        </h2>
        <Link to={paths.projects} className="group shrink-0 text-[15px] font-medium">
          {t('projects.seeAll')}{' '}
          <span aria-hidden="true" className="inline-block transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none">
            →
          </span>
        </Link>
      </div>
      <ul className="grid gap-4 md:grid-cols-3 lg:gap-5">
        {projects.map((project, index) => (
          <li key={project.key} data-reveal style={revealDelay(index)}>
            <Link
              to={projectPath(project.slug)}
              className="group flex h-full flex-col overflow-hidden rounded-[4px] border-b border-sand-line bg-transparent text-night transition-[transform,box-shadow] duration-300 ease-out-expo hover:-translate-y-1 hover:text-night hover:shadow-none motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <span className="block overflow-hidden">
                <img
                  src={project.image}
                  alt={t(`projects.cards.${project.key}.imageAlt`)}
                  width={800}
                  height={project.height}
                  loading="lazy"
                  className="block h-[240px] w-full object-cover transition-transform duration-500 ease-out-expo group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
              </span>
              <span className="flex flex-col gap-1 p-[18px]">
                <span className="text-[17px] font-medium">{t(`projects.cards.${project.key}.title`)}</span>
                <span className="text-[13px] text-slate-ink">{t(`projects.cards.${project.key}.details`)}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};
