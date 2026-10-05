import './projectCard.css';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import { projectPath } from '@/routes/paths';
import { DiamondPattern } from '@/components/icons/Icons';
import { ProjectBadgeTone, type Project } from '@/app/projects/domain/entities/Project';

const metricKeys = ['first', 'second', 'third'] as const;

const badgeToneClassName: Record<ProjectBadgeTone, string> = {
  [ProjectBadgeTone.SOLAR]: 'bg-solar',
  [ProjectBadgeTone.NIGHT]: 'bg-night',
  [ProjectBadgeTone.HEAT]: 'bg-heat',
};

export const ProjectCard = ({ project }: { project: Project }) => {
  const { t } = useTranslation('projects');
  const prefix = `items.${project.id}`;
  const { slug } = project;
  const hasDetail = slug !== null;

  return (
    <article
      id={`project-${project.id}`}
      className={cn(
        'hz-project-card relative flex h-full scroll-mt-28 flex-col overflow-hidden rounded-[18px] border border-sand-line bg-white text-night',
        hasDetail &&
          'group transition-[transform,box-shadow] duration-300 ease-out-expo has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-solar has-[a:focus-visible]:ring-offset-2 has-[a:focus-visible]:ring-offset-ivory hover:-translate-y-1 hover:shadow-lift motion-reduce:transition-none motion-reduce:hover:translate-y-0',
      )}
    >
      <div className="relative h-[190px] overflow-hidden lg:h-[210px]">
        {project.cover ? (
          <img
            src={project.cover.src}
            alt={t(`${prefix}.imageAlt`)}
            width={project.cover.width}
            height={project.cover.height}
            loading="lazy"
            style={{ objectPosition: project.cover.objectPosition }}
            className={cn(
              'block h-full w-full object-cover',
              hasDetail && 'transition-transform duration-500 ease-out-expo group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100',
            )}
          />
        ) : (
          <div className="relative flex h-full items-center justify-center bg-night px-8 text-center text-sm font-semibold text-slate-light">
            <DiamondPattern />
            <span className="relative">{t(`${prefix}.imagePlaceholder`)}</span>
          </div>
        )}
        <span
          className={cn(
            'absolute left-3.5 top-3.5 max-w-[calc(100%-28px)] rounded-[14px] px-2.5 py-[5px] text-xs font-bold text-white',
            badgeToneClassName[project.badgeTone],
          )}
        >
          {t(`${prefix}.badge`)}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5 lg:p-[22px]">
        <h2 className="text-lg font-bold leading-snug lg:text-xl">
          {slug ? (
            <Link
              to={projectPath(slug)}
              className="text-night after:absolute after:inset-0 after:content-[''] hover:text-night focus-visible:outline-none"
            >
              {t(`${prefix}.title`)}
            </Link>
          ) : (
            t(`${prefix}.title`)
          )}
        </h2>
        <p className="text-sm leading-normal text-slate-ink">{t(`${prefix}.description`)}</p>
        <dl className="mt-1.5 flex flex-wrap gap-x-3 gap-y-2 text-[13px] leading-snug sm:gap-x-4">
          {metricKeys.map((key) => (
            <div key={key} className="flex min-w-0 flex-col-reverse justify-end">
              <dt>{t(`${prefix}.metrics.${key}.label`)}</dt>
              <dd className="whitespace-nowrap text-base font-bold text-solar lg:text-lg">{t(`${prefix}.metrics.${key}.value`)}</dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  );
};
