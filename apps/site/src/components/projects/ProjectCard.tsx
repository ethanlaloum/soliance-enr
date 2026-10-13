import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import { projectPath } from '@/routes/paths';
import { ArrowUpRightIcon, DiamondPattern } from '@/components/icons/Icons';
import { ProjectBadgeTone, type Project } from '@/app/projects/domain/entities/Project';
import { CountUpValue } from '@/components/motion/CountUpValue';

const metricKeys = ['first', 'second', 'third'] as const;

const badgeDotClassName: Record<ProjectBadgeTone, string> = {
  [ProjectBadgeTone.SOLAR]: 'bg-solar',
  [ProjectBadgeTone.NIGHT]: 'bg-ivory',
  [ProjectBadgeTone.HEAT]: 'bg-slate-light',
};

type ProjectCardProps = {
  project: Project;
  titleAs?: 'h2' | 'h3';
};

export const ProjectCard = ({ project, titleAs: Title = 'h2' }: ProjectCardProps) => {
  const { t, i18n } = useTranslation('projects');
  const prefix = `items.${project.id}`;
  const { slug } = project;
  const hasDetail = slug !== null;
  const shownMetricKeys = metricKeys.filter((key) => i18n.exists(`projects:${prefix}.metrics.${key}.value`));

  return (
    <article
      className={cn(
        'relative flex h-full flex-col overflow-hidden rounded-md border border-sand-line bg-white text-night',
        hasDetail &&
          'group transition-[transform,box-shadow,border-color] duration-300 ease-out-expo has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-solar has-[a:focus-visible]:ring-offset-2 has-[a:focus-visible]:ring-offset-ivory hover:-translate-y-1 hover:border-sand-border hover:shadow-card motion-reduce:transition-none motion-reduce:hover:translate-y-0',
      )}
    >
      <div className="relative h-[200px] overflow-hidden lg:h-[230px]">
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
              hasDetail && 'transition-transform duration-700 ease-out-expo group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100',
            )}
          />
        ) : (
          <div aria-hidden="true" className="relative flex h-full flex-col items-center justify-center gap-5 overflow-hidden bg-night px-8 text-center text-ivory">
            <DiamondPattern />
            <span className="relative block h-10 w-10 rotate-45 rounded-[4px] bg-solar shadow-[0_0_60px_rgba(224,123,40,0.55)]" />
            <span className="relative text-lg font-medium tracking-[-0.02em]">{t(`${prefix}.coverLabel`)}</span>
          </div>
        )}
        <span className="absolute left-3 top-3 inline-flex max-w-[calc(100%-68px)] items-center gap-2 rounded-[3px] bg-night/80 px-2.5 py-1.5 text-[10px] font-semibold uppercase leading-tight tracking-[0.12em] text-ivory backdrop-blur-sm">
          <span aria-hidden="true" className={cn('h-1.5 w-1.5 shrink-0 rounded-full', badgeDotClassName[project.badgeTone])} />
          {t(`${prefix}.badge`)}
        </span>
        {hasDetail && (
          <span
            aria-hidden="true"
            className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-ivory text-night transition-colors duration-300 group-hover:bg-solar motion-reduce:transition-none"
          >
            <ArrowUpRightIcon className="h-3.5 w-3.5" />
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2.5 p-5 lg:p-6">
        <Title className="text-[19px] font-medium leading-snug tracking-[-0.02em] lg:text-xl">
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
        </Title>
        <p className="text-sm leading-[1.6] text-slate-ink">{t(`${prefix}.description`)}</p>
        {shownMetricKeys.length > 0 && (
          <dl className="mt-auto grid grid-cols-3 gap-2 border-t border-sand-line pt-4 sm:gap-3">
            {shownMetricKeys.map((key) => (
              <div key={key} className="flex min-w-0 flex-col-reverse justify-end gap-1 border-sand-line [&:not(:first-child)]:border-l [&:not(:first-child)]:pl-2.5 sm:[&:not(:first-child)]:pl-3">
                <dt className="text-[11px] leading-snug text-slate-ink">{t(`${prefix}.metrics.${key}.label`)}</dt>
                <dd className="whitespace-nowrap text-sm font-medium tracking-[-0.02em] text-solar-dark sm:text-[15px] lg:text-base"><CountUpValue value={t(`${prefix}.metrics.${key}.value`)} /></dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </article>
  );
};
