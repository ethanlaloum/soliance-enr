import { useTranslation } from 'react-i18next';
import { revealDelay } from '@/components/motion/revealDelay';
import { cn } from '@/lib/utils';
import { containerClassName, sectionTitleClassName } from '@/components/solar/horizonSolutionStyles';

type Solution = {
  key: 'airToAir' | 'airToWater' | 'waterHeater';
  image: string;
  width: number;
  height: number;
  objectPosition: string;
  featureKeys: readonly string[];
  highlighted: boolean;
};

const solutions: readonly Solution[] = [
  {
    key: 'airToAir',
    image: '/images/heat-pump/air-to-air-split.webp',
    width: 800,
    height: 534,
    objectPosition: '50% 30%',
    featureKeys: ['installation', 'control', 'aid'],
    highlighted: false,
  },
  {
    key: 'airToWater',
    image: '/images/heat-pump/air-to-water-module.webp',
    width: 800,
    height: 534,
    objectPosition: '50% 30%',
    featureKeys: ['installation', 'study', 'aid'],
    highlighted: true,
  },
  {
    key: 'waterHeater',
    image: '/images/heat-pump/thermodynamic-water-heater.webp',
    width: 800,
    height: 800,
    objectPosition: '50% 40%',
    featureKeys: ['installation', 'solar', 'aid'],
    highlighted: false,
  },
];

export const HeatPumpSolutionsSection = () => {
  const { t } = useTranslation('heatPump');

  return (
    <section aria-labelledby="heat-pump-solutions-title" className={cn(containerClassName, 'flex flex-col gap-5 pb-4 pt-12 lg:gap-9 lg:pb-16 lg:pt-[88px]')}>
      <div data-reveal className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
        <h2 id="heat-pump-solutions-title" className={cn(sectionTitleClassName, 'lg:text-[42px]')}>
          {t('solutions.title')}
        </h2>
        <p className="max-w-[480px] text-[15px] text-slate-ink lg:text-base">{t('solutions.intro')}</p>
      </div>
      <ul className="grid gap-4 lg:grid-cols-3 lg:gap-6">
        {solutions.map((solution, index) => (
          <li key={solution.key} data-reveal style={revealDelay(index)}>
            <article
              aria-labelledby={`heat-pump-solution-${solution.key}`}
              className={cn(
                'hz-solution-offer flex h-full flex-col gap-3.5 rounded-[4px] p-6 lg:p-8',
                solution.highlighted ? 'bg-heat text-white' : 'bg-heat-soft text-night',
              )}
            >
              <img
                src={solution.image}
                alt={t(`solutions.${solution.key}.imageAlt`)}
                width={solution.width}
                height={solution.height}
                loading="lazy"
                style={{ objectPosition: solution.objectPosition }}
                className="block h-[210px] w-full rounded-[4px] object-cover lg:h-[210px]"
              />
              <p
                className={cn(
                  'text-xs font-medium uppercase tracking-[1px] lg:text-[13px]',
                  solution.highlighted ? 'text-heat-mist' : 'text-heat',
                )}
              >
                {t(`solutions.${solution.key}.eyebrow`)}
              </p>
              <h3 id={`heat-pump-solution-${solution.key}`} className="text-[22px] font-medium lg:text-[26px]">
                {t(`solutions.${solution.key}.title`)}
              </h3>
              <p className={cn('text-[15px] leading-[1.55]', solution.highlighted ? 'text-heat-sky' : 'text-slate-text')}>
                {t(`solutions.${solution.key}.description`)}
              </p>
              <ul className={cn('text-sm leading-[1.7]', solution.highlighted ? 'text-heat-sky' : 'text-slate-text')}>
                {solution.featureKeys.map((featureKey) => (
                  <li key={featureKey}>{t(`solutions.${solution.key}.features.${featureKey}`)}</li>
                ))}
              </ul>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
};
