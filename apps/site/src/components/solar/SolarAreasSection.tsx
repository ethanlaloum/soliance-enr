import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import { localSolarPath } from '@/routes/paths';
import { containerClassName } from '@/components/home/containerClassName';
import { serviceAreas } from '@/app/service-areas/domain/entities/ServiceArea';

export const SolarAreasSection = () => {
  const { t } = useTranslation(['solar', 'common']);

  return (
    <section aria-labelledby="solar-areas-title" data-reveal className={cn(containerClassName, 'flex flex-col gap-4 pb-10 lg:gap-5 lg:pb-16')}>
      <h2 id="solar-areas-title" className="text-[26px] font-bold leading-[1.15] tracking-[-0.02em] lg:text-[32px]">
        {t('areas.title')}
      </h2>
      <p className="max-w-3xl text-[15px] leading-[1.6] text-slate-ink lg:text-base">{t('areas.description')}</p>
      <ul className="flex flex-wrap gap-2.5">
        {serviceAreas.map((area) => {
          const city = t(`common:serviceAreas.${area.slug}`);
          return (
            <li key={area.slug}>
              <Link
                to={localSolarPath(area.slug)}
                aria-label={t('areas.linkLabel', { city })}
                className="inline-flex min-h-11 items-center rounded-full border border-sand-line bg-white px-4 text-[15px] font-semibold text-night transition-colors hover:border-solar hover:text-night"
              >
                {city}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
};
