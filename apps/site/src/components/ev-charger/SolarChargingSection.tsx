import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import { paths } from '@/routes/paths';
import { buttonVariants } from '@/components/ui/buttonVariants';
import { containerClassName, eyebrowClassName } from '@/components/home/containerClassName';

const statKeys = ['energy', 'solarShare'] as const;

export const SolarChargingSection = () => {
  const { t } = useTranslation('evCharger');

  return (
    <div className={containerClassName}>
      <section
        data-reveal
        aria-labelledby="solar-charging-title"
        className="grid items-center gap-8 rounded-2xl bg-night p-6 text-white lg:grid-cols-[1fr_1.1fr] lg:gap-14 lg:rounded-3xl lg:px-16 lg:py-14"
      >
        <div className="flex flex-col gap-4">
          <p className={cn(eyebrowClassName, 'text-care-mint')}>{t('solarCharging.eyebrow')}</p>
          <h2 id="solar-charging-title" className="text-[26px] font-bold tracking-[-0.02em] lg:text-[38px]">
            {t('solarCharging.title')}
          </h2>
          <p className="text-[15px] leading-[1.55] text-slate-light lg:text-base">{t('solarCharging.body')}</p>
          <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              to={paths.solar}
              className={cn(buttonVariants({ variant: 'outlineLight', size: 'sm' }), 'rounded-[10px] border-care-mint px-5 py-3 focus-visible:outline-care-mint')}
            >
              {t('solarCharging.discoverSolar')}
            </Link>
            <Link to={paths.simulator} className={cn(buttonVariants({ size: 'sm' }), 'rounded-[10px] px-5')}>
              {t('solarCharging.simulate')}
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-3.5 rounded-[18px] bg-night-soft p-5 lg:rounded-[20px] lg:p-7">
          <p className="text-[15px] font-bold lg:text-base">{t('solarCharging.example.title')}</p>
          <dl className="grid grid-cols-2 gap-2 lg:gap-3">
            {statKeys.map((key) => (
              <div key={key} className="flex flex-col-reverse justify-end gap-0.5 rounded-[10px] bg-night p-3 lg:p-3.5">
                <dt className="text-[11px] leading-snug text-slate-light lg:text-xs">{t(`solarCharging.example.stats.${key}.label`)}</dt>
                <dd className="text-[17px] font-bold leading-tight text-care-mint lg:text-2xl">{t(`solarCharging.example.stats.${key}.value`)}</dd>
              </div>
            ))}
          </dl>
          <p className="text-xs text-slate-mist">{t('solarCharging.example.note')}</p>
        </div>
      </section>
    </div>
  );
};
