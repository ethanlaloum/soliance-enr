import type { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { revealDelay } from '@/components/motion/revealDelay';
import { ficheThemeClassNames } from '@/components/projects/projectFicheTheme';
import {
  FicheCallToAction,
  FicheImage,
  FicheMetricTiles,
  FicheTechnicalSheet,
  FicheTestimonial,
  ProductionChart,
} from '@/components/projects/ProjectFicheParts';
import {
  ProjectPanelKind,
  type ProjectDetailImage,
  type ProjectPanel,
  type ProjectStoryDetail,
} from '@/app/projects/domain/entities/ProjectDetail';

const PlayIcon = () => (
  <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" className="fill-white">
    <path d="M8 5 L19 12 L8 19 Z" />
  </svg>
);

type HeroStripProps = {
  slug: string;
  images: ProjectDetailImage[];
  videoImageKey: string | null;
};

const HeroStrip = ({ slug, images, videoImageKey }: HeroStripProps) => {
  const { t } = useTranslation('projects');
  const columns = images.map((image) => `minmax(0, ${image.columnWeight}fr)`).join(' ');
  const firstImageSpansRow = images.length !== 2;

  return (
    <div
      role="group"
      aria-label={t('fiche.galleryLabel')}
      style={{ '--hero-columns': columns } as CSSProperties}
      className="grid grid-cols-2 gap-0.5 motion-safe:animate-zoom-in lg:gap-0 lg:[grid-template-columns:var(--hero-columns)]"
    >
      {images.map((image, index) => (
        <div key={image.key} className={cn('relative', index === 0 && firstImageSpansRow && 'col-span-2 lg:col-span-1')}>
          <FicheImage
            slug={slug}
            image={image}
            priority={index === 0}
            className={cn(index === 0 && firstImageSpansRow ? 'h-[220px] sm:h-[320px]' : 'h-[170px] sm:h-[260px]', 'lg:h-[420px]')}
          />
          {image.key === videoImageKey && (
            <>
              <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-solar/95 lg:h-[72px] lg:w-[72px]">
                  <PlayIcon />
                </span>
              </div>
              <p className="absolute bottom-3 left-3 right-3 w-fit rounded-lg bg-night/85 px-3 py-2 text-xs text-white lg:bottom-4 lg:left-4 lg:text-[13px]">
                {t(`fiches.${slug}.videoCaption`)}
              </p>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

type SideImagesProps = {
  slug: string;
  images: ProjectDetailImage[];
  priority: boolean;
};

const SideImages = ({ slug, images, priority }: SideImagesProps) => {
  if (images.length === 3) {
    const [main, ...others] = images;
    return (
      <div className="grid h-[240px] grid-cols-[minmax(0,2fr)_minmax(0,1fr)] grid-rows-2 gap-2 motion-safe:animate-zoom-in lg:h-[260px]">
        <FicheImage slug={slug} image={main} priority={priority} className="row-span-2 h-full rounded-md" />
        {others.map((image) => (
          <FicheImage key={image.key} slug={slug} image={image} className="h-full rounded-md" />
        ))}
      </div>
    );
  }

  return (
    <div data-reveal className={cn('grid gap-2', images.length > 1 && 'grid-cols-2')}>
      {images.map((image) => (
        <FicheImage
          key={image.key}
          slug={slug}
          image={image}
          className={cn('rounded-md', images.length > 1 ? 'h-[140px] lg:h-[170px]' : 'h-[220px] lg:h-[260px]')}
        />
      ))}
    </div>
  );
};

type FichePanelProps = {
  slug: string;
  panel: ProjectPanel;
};

const FichePanel = ({ slug, panel }: FichePanelProps) => {
  const { t } = useTranslation('projects');
  const titleId = `${slug}-panel-title`;
  const isExpectedResults = panel.kind === ProjectPanelKind.EXPECTED_RESULTS;

  return (
    <section data-reveal aria-labelledby={titleId} className="flex flex-col gap-3 rounded-md bg-night p-5 text-white lg:p-[22px]">
      {isExpectedResults ? (
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <h2 id={titleId} className="text-base font-medium">
            {t('fiche.expectedResults.title')}
          </h2>
          <p className="text-xs text-care-mint">{t('fiche.expectedResults.measurement')}</p>
        </div>
      ) : (
        <>
          <h2 id={titleId} className="text-base font-medium">
            {t(`fiches.${slug}.panel.title`)}
          </h2>
          <p className="text-sm leading-[1.55] text-slate-light">{t(`fiches.${slug}.panel.text`)}</p>
        </>
      )}
      {panel.hasMetrics && <FicheMetricTiles keyPrefix={`fiches.${slug}.panel.metrics`} tone="dark" className="sm:grid-cols-3" />}
      {panel.hasChart && <ProductionChart />}
    </section>
  );
};

export const ProjectStoryFiche = ({ detail }: { detail: ProjectStoryDetail }) => {
  const { t } = useTranslation('projects');
  const theme = ficheThemeClassNames[detail.theme];
  const prefix = `fiches.${detail.slug}`;

  return (
    <article
      aria-labelledby="project-title"
      className={cn(
        'overflow-hidden rounded-md border bg-white motion-safe:animate-fade-up motion-safe:[animation-delay:80ms] lg:rounded-md',
        theme.border,
      )}
    >
      <p className={cn('px-5 py-3 text-xs font-medium uppercase tracking-[1px] lg:px-10 lg:py-3.5 lg:text-[13px]', theme.band)}>{t(`${prefix}.band`)}</p>
      {detail.heroImages.length > 0 && <HeroStrip slug={detail.slug} images={detail.heroImages} videoImageKey={detail.videoImageKey} />}
      <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-14 lg:px-12 lg:py-14">
        <div className="flex flex-col gap-6 lg:gap-7">
          <p className={cn('text-xs font-medium uppercase tracking-[1px] lg:text-[13px]', theme.accent)}>{t(`${prefix}.eyebrow`)}</p>
          <h1 id="project-title" className="text-[34px] font-medium leading-[1.12] tracking-[-0.045em] lg:text-[48px]">
            {t(`${prefix}.title`)}
          </h1>
          <div className="grid gap-3 sm:grid-cols-2 lg:gap-3.5">
            {detail.storyBlocks.map((block, index) => (
              <div key={block} data-reveal style={revealDelay(index)} className={cn('border-t border-sand-line py-5', theme.surface)}>
                <h2 className="text-xs font-medium uppercase text-slate">{t(`fiche.blocks.${block}`)}</h2>
                <p className="mt-1 text-sm leading-normal">{t(`${prefix}.blocks.${block}`)}</p>
              </div>
            ))}
          </div>
          <FicheTestimonial slug={detail.slug} hasAuthor={detail.testimonialHasAuthor} theme={detail.theme} />
          <FicheCallToAction slug={detail.slug} callToAction={detail.callToAction} theme={detail.theme} />
        </div>
        <div className="flex flex-col gap-3.5">
          {detail.sideImages.length > 0 && <SideImages slug={detail.slug} images={detail.sideImages} priority={detail.heroImages.length === 0} />}
          {detail.panel && <FichePanel slug={detail.slug} panel={detail.panel} />}
          {detail.technicalSheetRows.length > 0 && <FicheTechnicalSheet slug={detail.slug} rows={detail.technicalSheetRows} theme={detail.theme} />}
          {detail.hasEstimateNote && <p className="text-xs text-slate">{t('fiche.estimateNote')}</p>}
        </div>
      </div>
    </article>
  );
};
