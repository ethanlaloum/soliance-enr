import { useTranslation } from 'react-i18next';
import { revealDelay } from '@/components/motion/revealDelay';
import { cn } from '@/lib/utils';
import { containerClassName } from '@/components/home/containerClassName';

const steps = [
  { key: 'outdoorUnit', image: '/images/heat-pump/outdoor-unit.webp', width: 960, height: 1276, objectPosition: '50% 50%' },
  { key: 'indoorUnit', image: '/images/heat-pump/indoor-unit.webp', width: 720, height: 960, objectPosition: '50% 40%' },
  { key: 'commissioning', image: '/images/heat-pump/commissioning.webp', width: 720, height: 960, objectPosition: '50% 40%' },
] as const;

export const HeatPumpStepsSection = () => {
  const { t } = useTranslation('heatPump');

  return (
    <section aria-labelledby="heat-pump-steps-title" className={cn(containerClassName, 'flex flex-col gap-5 pb-4 pt-8 lg:gap-6 lg:pb-16 lg:pt-0')}>
      <div data-reveal className="flex flex-col gap-2">
        <h2 id="heat-pump-steps-title" className="text-[26px] font-bold tracking-[-0.02em] lg:text-[32px]">
          {t('steps.title')}
        </h2>
        <p className="max-w-[760px] text-[15px] leading-normal text-slate-ink">{t('steps.intro')}</p>
      </div>
      <ol className="grid gap-4 md:grid-cols-3 lg:gap-5">
        {steps.map((step, index) => (
          <li
            key={step.key}
            data-reveal
            style={revealDelay(index)}
            className="flex flex-col overflow-hidden rounded-2xl border border-heat-line bg-heat-surface"
          >
            <div className="relative">
              <img
                src={step.image}
                alt={t(`steps.${step.key}.imageAlt`)}
                width={step.width}
                height={step.height}
                loading="lazy"
                style={{ objectPosition: step.objectPosition }}
                className="block h-[200px] w-full object-cover lg:h-[240px]"
              />
              <span
                aria-hidden="true"
                className="absolute left-3.5 top-3.5 flex h-9 w-9 items-center justify-center rounded-full bg-heat font-bold text-white"
              >
                {index + 1}
              </span>
            </div>
            <div className="flex flex-col gap-1.5 p-5">
              <h3 className="text-lg font-bold">{t(`steps.${step.key}.title`)}</h3>
              <p className="text-sm leading-normal text-slate-ink">{t(`steps.${step.key}.description`)}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
};
