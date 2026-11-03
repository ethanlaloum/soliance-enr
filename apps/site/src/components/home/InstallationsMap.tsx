import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { installationCount, installationLocations } from '@/app/installations/domain/entities/InstallationLocation';
import { config } from '@/config';

// MapLibre weighs ~250 kB gzipped: it only loads when the contact block comes near the viewport.
const loadAhead = '400px';

export const InstallationsMap = () => {
  const { t } = useTranslation('home');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let disposed = false;
    let removeMap: (() => void) | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        void import('@/components/home/createInstallationsMap').then(({ createInstallationsMap }) => {
          if (disposed) return;
          const map = createInstallationsMap({
            container,
            locations: installationLocations,
            agency: config.addressSearchBias,
            texts: {
              agency: t('contact.map.agency'),
              popup: ({ commune, count }) => t('contact.map.popup', { commune, count }),
              locale: t('contact.map.controls', { returnObjects: true }) as Record<string, string>,
            },
          });
          removeMap = () => map.remove();
        });
      },
      { rootMargin: loadAhead },
    );
    observer.observe(container);

    return () => {
      disposed = true;
      observer.disconnect();
      removeMap?.();
    };
  }, [t]);

  return (
    <figure className="mt-2 flex flex-col gap-2">
      <div
        ref={containerRef}
        role="region"
        aria-label={t('contact.map.label', { count: installationCount })}
        className="h-[260px] overflow-hidden rounded-[14px] border border-sand-border bg-[#f2f1ee] lg:h-[320px]"
      />
      <figcaption className="text-[13px] text-slate-ink">{t('contact.map.caption', { count: installationCount })}</figcaption>
    </figure>
  );
};
