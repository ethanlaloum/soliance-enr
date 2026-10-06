import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { FicheCallToAction, FicheImage, FicheMetricTiles } from '@/components/projects/ProjectFicheParts';
import type { ProjectCompactDetail } from '@/app/projects/domain/entities/ProjectDetail';

export const ProjectCompactFiche = ({ detail }: { detail: ProjectCompactDetail }) => {
  const { t } = useTranslation('projects');
  const prefix = `fiches.${detail.slug}`;

  return (
    <article
      aria-labelledby="project-title"
      className={cn(
        'grid overflow-hidden rounded-[20px] border border-sand-line bg-white motion-safe:animate-fade-up motion-safe:[animation-delay:80ms] lg:rounded-[24px]',
        detail.mainImageFirst ? 'lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]' : 'lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]',
      )}
    >
      <FicheImage
        slug={detail.slug}
        image={detail.mainImage}
        priority
        className={cn('h-[240px] motion-safe:animate-zoom-in sm:h-[340px] lg:h-full lg:min-h-[460px]', !detail.mainImageFirst && 'lg:order-last')}
      />
      <div className="flex flex-col justify-center gap-4 p-5 sm:p-8 lg:p-11">
        <p className="text-xs font-semibold uppercase tracking-[1px] text-solar lg:text-[13px]">{t(`${prefix}.eyebrow`)}</p>
        <h1 id="project-title" className="text-[26px] font-bold leading-[1.15] tracking-[-0.02em] lg:text-[30px]">
          {t(`${prefix}.title`)}
        </h1>
        <p className="text-[15px] leading-[1.55] text-slate-ink">{t(`${prefix}.summary`)}</p>
        <FicheMetricTiles keyPrefix={`${prefix}.metrics`} tone="light" className="grid-cols-3 gap-2 sm:gap-3" />
        <div data-reveal role="group" aria-label={t('fiche.galleryLabel')} className={cn('grid gap-2.5', detail.secondaryImages.length > 1 && 'grid-cols-2')}>
          {detail.secondaryImages.map((image) => (
            <FicheImage key={image.key} slug={detail.slug} image={image} className="h-[150px] rounded-xl lg:h-[175px]" />
          ))}
        </div>
        <FicheCallToAction slug={detail.slug} callToAction={detail.callToAction} compact />
      </div>
    </article>
  );
};
