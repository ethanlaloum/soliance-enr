import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { revealDelay } from '@/components/motion/revealDelay';
import { containerClassName, eyebrowClassName } from '@/components/solar/horizonSolutionStyles';

const pillarKeys = ['consumption', 'household', 'house'] as const;

export const SolarMethodSection = () => {
  const { t } = useTranslation('solar');

  return (
    <div className={cn(containerClassName, 'pb-10 lg:pb-20')}>
      <section
        data-reveal
        aria-labelledby="solar-method-title"
        className="flex flex-col gap-6 rounded-[4px] bg-night p-6 text-white lg:gap-7 lg:rounded-[4px] lg:px-16 lg:py-14"
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <div>
            <p className={eyebrowClassName}>{t('method.eyebrow')}</p>
            <h2 id="solar-method-title" className="mt-2 text-[26px] font-medium leading-[1.15] tracking-[-0.045em] lg:text-[36px]">
              {t('method.title')}
            </h2>
          </div>
          <p className="text-[15px] leading-normal text-slate-light lg:max-w-[440px] lg:shrink-0 lg:text-base">{t('method.intro')}</p>
        </div>
        <ol className="grid gap-3 lg:grid-cols-3 lg:gap-5">
          {pillarKeys.map((key, index) => (
            <li key={key} data-reveal style={revealDelay(index + 1)} className="flex flex-col gap-2.5 rounded-[4px] bg-night-soft p-5 lg:p-[26px]">
              <p className="text-[13px] font-medium uppercase tracking-[1px] text-solar">{t(`method.pillars.${key}.step`)}</p>
              <h3 className="text-lg font-medium lg:text-xl">{t(`method.pillars.${key}.title`)}</h3>
              <p className="text-sm leading-[1.55] text-slate-light">{t(`method.pillars.${key}.description`)}</p>
            </li>
          ))}
        </ol>
        <p className="text-[13px] leading-normal text-slate-mist lg:text-sm">{t('method.footnote')}</p>
      </section>
    </div>
  );
};
