import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { revealDelay } from '@/components/motion/revealDelay';
import { cn } from '@/lib/utils';
import { paths, projectPath } from '@/routes/paths';
import { containerClassName } from '@/components/home/containerClassName';

const projects = [
  { key: 'laColleSurLoup', to: projectPath('la-colle-sur-loup-pac-13-kwc'), image: '/images/heat-pump/project-la-colle-sur-loup.webp', width: 900, height: 324 },
  { key: 'saintLaurentDuVar', to: paths.projects, image: '/images/heat-pump/project-saint-laurent-du-var.webp', width: 900, height: 507 },
  { key: 'antibes', to: paths.projects, image: '/images/heat-pump/project-antibes.webp', width: 900, height: 507 },
] as const;

export const HeatPumpProjectsSection = () => {
  const { t } = useTranslation('heatPump');

  return (
    <section aria-labelledby="heat-pump-projects-title" className={cn(containerClassName, 'flex flex-col gap-5 pb-4 pt-8 lg:gap-6 lg:pb-16 lg:pt-0')}>
      <div data-reveal className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <h2 id="heat-pump-projects-title" className="text-[26px] font-bold tracking-[-0.02em] lg:text-[32px]">
          {t('projects.title')}
        </h2>
        <Link to={paths.projects} className="group text-[15px] font-semibold text-heat hover:text-night">
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
              to={project.to}
              className="group flex h-full flex-col overflow-hidden rounded-2xl bg-heat-soft text-night transition-[transform,box-shadow] duration-300 ease-out-expo hover:-translate-y-1 hover:text-night hover:shadow-card motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <span className="relative block overflow-hidden">
                <img
                  src={project.image}
                  alt={t(`projects.${project.key}.imageAlt`)}
                  width={project.width}
                  height={project.height}
                  loading="lazy"
                  className="block h-40 w-full object-cover transition-transform duration-500 ease-out-expo group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
                <span className="absolute left-3.5 top-3.5 rounded-[14px] bg-heat px-2.5 py-[5px] text-xs font-bold text-white">
                  {t(`projects.${project.key}.tag`)}
                </span>
              </span>
              <span className="flex flex-col gap-1 p-[18px]">
                <span className="text-[17px] font-bold">{t(`projects.${project.key}.title`)}</span>
                <span className="text-[13px] leading-normal text-slate-ink">{t(`projects.${project.key}.description`)}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};
