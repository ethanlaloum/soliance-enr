import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/buttonVariants';
import { revealDelay } from '@/components/motion/revealDelay';
import { callToActionTargets, ficheThemeClassNames } from '@/components/projects/projectFicheTheme';
import {
  ProjectDetailTheme,
  type ProjectCallToAction,
  type ProjectDetailImage,
  type TechnicalSheetRow,
} from '@/app/projects/domain/entities/ProjectDetail';

const metricKeys = ['first', 'second', 'third'] as const;

const productionBarHeights = [22, 36, 56, 72, 84, 92, 94, 88, 72, 52, 30, 18];

type FicheImageProps = {
  slug: string;
  image: ProjectDetailImage;
  priority?: boolean;
  className?: string;
};

export const FicheImage = ({ slug, image, priority = false, className }: FicheImageProps) => {
  const { t } = useTranslation('projects');

  return (
    <img
      src={image.src}
      alt={t(`fiches.${slug}.images.${image.key}`)}
      width={image.width}
      height={image.height}
      loading={priority ? undefined : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      style={{ objectPosition: image.objectPosition }}
      className={cn('block w-full object-cover', className)}
    />
  );
};

type FicheMetricTilesProps = {
  keyPrefix: string;
  tone: 'dark' | 'light';
  className?: string;
};

export const FicheMetricTiles = ({ keyPrefix, tone, className }: FicheMetricTilesProps) => {
  const { t } = useTranslation('projects');

  return (
    <dl className={cn('grid gap-2.5', className)}>
      {metricKeys.map((key) => (
        <div
          key={key}
          className={cn('flex flex-col-reverse justify-end gap-0.5 rounded-[10px] p-3 lg:p-3.5', tone === 'dark' ? 'bg-night-soft' : 'bg-ivory')}
        >
          <dt className={cn('text-xs leading-snug', tone === 'dark' ? 'text-slate-light' : 'text-slate-ink')}>{t(`${keyPrefix}.${key}.label`)}</dt>
          <dd className="text-lg font-bold leading-tight text-solar lg:text-[22px]">{t(`${keyPrefix}.${key}.value`)}</dd>
        </div>
      ))}
    </dl>
  );
};

export const ProductionChart = () => (
  <svg aria-hidden="true" viewBox="0 0 440 110" className="h-[90px] w-full lg:h-[110px]">
    <g className="fill-solar">
      {productionBarHeights.map((height, index) => (
        <rect key={index} x={8 + index * 36} y={102 - height} width={26} height={height} />
      ))}
    </g>
    <line x1="0" y1="103" x2="440" y2="103" className="stroke-night-line" />
  </svg>
);

type FicheTechnicalSheetProps = {
  slug: string;
  rows: TechnicalSheetRow[];
  theme: ProjectDetailTheme;
};

export const FicheTechnicalSheet = ({ slug, rows, theme }: FicheTechnicalSheetProps) => {
  const { t } = useTranslation('projects');
  const titleId = `${slug}-technical-sheet`;

  return (
    <section data-reveal aria-labelledby={titleId} className={cn('flex flex-col gap-2 rounded-xl p-[18px] text-sm', ficheThemeClassNames[theme].surface)}>
      <h2 id={titleId} className="text-base font-bold">
        {t('fiche.technicalSheet.title')}
      </h2>
      <dl>
        {rows.map((row, index) => (
          <div
            key={row}
            className={cn(
              'flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 py-1.5',
              index < rows.length - 1 && cn('border-b', ficheThemeClassNames[theme].line),
            )}
          >
            <dt className="text-slate-ink">{t(`fiche.technicalSheet.rows.${row}`)}</dt>
            <dd className="text-right font-bold">{t(`fiches.${slug}.technicalSheet.${row}`)}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
};

type FicheTestimonialProps = {
  slug: string;
  hasAuthor: boolean;
  theme: ProjectDetailTheme;
};

export const FicheTestimonial = ({ slug, hasAuthor, theme }: FicheTestimonialProps) => {
  const { t } = useTranslation('projects');

  return (
    <figure data-reveal className={cn('border-l-[3px] py-1 pl-[18px]', ficheThemeClassNames[theme].quoteBorder)}>
      <blockquote className="text-base leading-[1.55] text-slate-text">{t(`fiches.${slug}.testimonial.quote`)}</blockquote>
      {hasAuthor && <figcaption className="mt-1 text-[13px] text-slate">{t(`fiches.${slug}.testimonial.author`)}</figcaption>}
    </figure>
  );
};

type FicheCallToActionProps = {
  slug: string;
  callToAction: ProjectCallToAction;
  theme?: ProjectDetailTheme;
  compact?: boolean;
};

export const FicheCallToAction = ({ slug, callToAction, theme = ProjectDetailTheme.SOLAR, compact = false }: FicheCallToActionProps) => {
  const { t } = useTranslation('projects');

  return (
    <div data-reveal style={revealDelay(1)} className="self-start">
      <Link
        to={callToActionTargets[callToAction]}
        className={cn(
          buttonVariants({ size: 'md' }),
          'whitespace-normal text-center',
          compact ? 'px-[22px] py-[13px] text-[15px]' : 'px-6 py-3.5 text-base',
          ficheThemeClassNames[theme].button,
        )}
      >
        {t(`fiches.${slug}.cta`)}
      </Link>
    </div>
  );
};
