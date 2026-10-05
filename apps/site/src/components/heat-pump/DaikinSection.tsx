import { useTranslation } from 'react-i18next';
import { revealDelay } from '@/components/motion/revealDelay';
import { cn } from '@/lib/utils';
import { containerClassName } from '@/components/solar/horizonSolutionStyles';

const featureKeys = ['silence', 'refrigerant', 'app', 'warranty'] as const;

export const DaikinSection = () => {
  const { t } = useTranslation('heatPump');

  return (
    <section aria-labelledby="heat-pump-daikin-title" className={cn(containerClassName, 'pt-8 lg:pt-0')}>
      <div className="grid items-center gap-8 rounded-[4px] bg-heat-surface px-5 py-8 lg:grid-cols-[1fr_1.2fr] lg:gap-14 lg:rounded-[4px] lg:px-16 lg:py-14">
        <div data-reveal className="flex flex-col gap-3.5 lg:gap-4">
          <p className="text-xs font-medium uppercase tracking-[1.2px] text-heat lg:text-sm lg:tracking-[1.5px]">{t('daikin.eyebrow')}</p>
          <h2 id="heat-pump-daikin-title" className="text-[26px] font-medium leading-tight tracking-[-0.045em] lg:text-4xl">
            {t('daikin.title')}
          </h2>
          <p className="text-[15px] leading-[1.55] text-slate-ink lg:text-base">{t('daikin.description')}</p>
          <p className="text-[13px] leading-normal text-slate">{t('daikin.caption')}</p>
        </div>
        <div className="flex flex-col gap-3.5">
          <img
            data-reveal
            src="/images/heat-pump/daikin-altherma-garage.webp"
            alt={t('daikin.imageAlt')}
            width={900}
            height={1200}
            loading="lazy"
            className="block h-[240px] w-full rounded-[4px] object-cover object-[50%_55%] lg:h-[300px]"
          />
          <ul className="grid gap-3 sm:grid-cols-2 sm:gap-3.5">
            {featureKeys.map((key, index) => (
              <li key={key} data-reveal style={revealDelay(index)} className="rounded-[4px] border border-heat-line bg-white p-[18px] lg:p-5">
                <h3 className="text-base font-medium text-heat lg:text-[17px]">{t(`daikin.features.${key}.title`)}</h3>
                <p className="mt-1 text-sm leading-normal text-slate-ink">{t(`daikin.features.${key}.description`)}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
