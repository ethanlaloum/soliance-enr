import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import { paths } from '@/routes/paths';
import { revealDelay } from '@/components/motion/revealDelay';
import { containerClassName } from '@/components/home/containerClassName';
import { BoltIcon, LightningShape } from '@/components/ev-charger/EvChargerIcons';

type ProjectCard = {
  key: string;
  photo: { src: string; width: number; height: number; objectPosition: string } | null;
};

const projects: ProjectCard[] = [
  { key: 'pulsarPlus', photo: { src: '/images/ev-charger/project-pulsar-plus-facade.webp', width: 800, height: 563, objectPosition: '50% 40%' } },
  { key: 'flayosc', photo: { src: '/images/ev-charger/project-flayosc-posts.webp', width: 800, height: 600, objectPosition: '50% 30%' } },
  { key: 'niceCondominium', photo: null },
];

export const EvChargerProjectsSection = () => {
  const { t } = useTranslation('evCharger');

  return (
    <section aria-labelledby="ev-projects-title" className={cn(containerClassName, 'flex flex-col gap-5 pb-12 lg:gap-6 lg:pb-16')}>
      <div data-reveal className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <h2 id="ev-projects-title" className="text-2xl font-bold tracking-[-0.02em] lg:text-[32px]">
          {t('projects.title')}
        </h2>
        <Link to={paths.projects} className="group shrink-0 text-[15px] font-semibold text-charge hover:text-charge-dark">
          {t('projects.viewAll')}{' '}
          <span aria-hidden="true" className="inline-block transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none">
            →
          </span>
        </Link>
      </div>
      <ul className="grid gap-4 md:grid-cols-3 lg:gap-5">
        {projects.map((project, index) => (
          <li key={project.key} data-reveal style={revealDelay(index)}>
            <Link
              to={paths.projects}
              className="group flex h-full flex-col overflow-hidden rounded-2xl bg-charge-surface text-night transition-[transform,box-shadow] duration-300 ease-out-expo hover:-translate-y-1 hover:text-night hover:shadow-card motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <div className="h-40 overflow-hidden">
                {project.photo ? (
                  <img
                    src={project.photo.src}
                    alt={t(`projects.items.${project.key}.imageAlt`)}
                    width={project.photo.width}
                    height={project.photo.height}
                    loading="lazy"
                    style={{ objectPosition: project.photo.objectPosition }}
                    className="block h-full w-full object-cover transition-transform duration-500 ease-out-expo group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#128C4F_0%,#0d6b3c_100%)] text-white"
                  >
                    <LightningShape className="absolute -right-8 -top-6 h-52 w-52 text-white/10" />
                    <span className="relative flex items-center gap-3">
                      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-charge shadow-soft">
                        <BoltIcon className="h-6 w-6" />
                      </span>
                      <span className="text-xl font-bold">{t(`projects.items.${project.key}.coverLabel`)}</span>
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-1 p-[18px]">
                <h3 className="text-[17px] font-bold">{t(`projects.items.${project.key}.title`)}</h3>
                <p className="text-[13px] text-slate-ink">{t(`projects.items.${project.key}.description`)}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};
