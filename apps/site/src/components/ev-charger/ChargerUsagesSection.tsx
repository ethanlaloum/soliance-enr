import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { revealDelay } from '@/components/motion/revealDelay';
import { containerClassName, sectionTitleClassName } from '@/components/home/containerClassName';
import { BoltIcon, ChargingParkIcon, HouseIcon } from '@/components/ev-charger/EvChargerIcons';

const usages = [
  {
    key: 'singlePhase',
    Icon: HouseIcon,
    image: '/images/ev-charger/home-single-phase.webp',
    width: 800,
    height: 485,
    objectPosition: '40% 45%',
    featureKeys: ['cable', 'access', 'solar'],
    highlighted: false,
  },
  {
    key: 'threePhase',
    Icon: BoltIcon,
    image: '/images/ev-charger/home-three-phase.webp',
    width: 800,
    height: 485,
    objectPosition: '50% 60%',
    featureKeys: ['dualPoint', 'battery', 'solar'],
    highlighted: true,
  },
  {
    key: 'chargingPark',
    Icon: ChargingParkIcon,
    image: '/images/ev-charger/underground-car-park.webp',
    width: 1024,
    height: 800,
    objectPosition: '50% 50%',
    featureKeys: ['powerStudy', 'operator', 'advenir'],
    highlighted: false,
  },
] as const;

export const ChargerUsagesSection = () => {
  const { t } = useTranslation('evCharger');

  return (
    <section aria-labelledby="usages-title" className={cn(containerClassName, 'flex flex-col gap-6 pb-10 pt-12 lg:gap-8 lg:pb-16 lg:pt-[88px]')}>
      <h2 id="usages-title" data-reveal className={cn(sectionTitleClassName, 'lg:text-[42px]')}>
        {t('usages.title')}
      </h2>
      <ul className="grid gap-4 lg:grid-cols-3 lg:gap-6">
        {usages.map(({ key, Icon, image, width, height, objectPosition, featureKeys, highlighted }, index) => (
          <li
            key={key}
            data-reveal
            style={revealDelay(index)}
            className={cn(
              'flex flex-col gap-3 rounded-2xl p-6 lg:rounded-[20px] lg:p-8',
              highlighted ? 'bg-charge text-white' : 'border-2 border-charge-surface bg-white text-night',
            )}
          >
            <span
              className={cn(
                'flex h-12 w-12 items-center justify-center rounded-xl',
                highlighted ? 'bg-white/15 text-white' : 'bg-charge-surface text-charge',
              )}
            >
              <Icon />
            </span>
            <p className={cn('text-[13px] font-semibold uppercase tracking-[1px]', highlighted ? 'text-[#bfeed5]' : 'text-charge')}>
              {t(`usages.${key}.audience`)}
            </p>
            <img
              src={image}
              alt=""
              width={width}
              height={height}
              loading="lazy"
              style={{ objectPosition }}
              className="block h-[150px] w-full rounded-xl object-cover"
            />
            <h3 className="text-[22px] font-bold lg:text-[26px]">{t(`usages.${key}.title`)}</h3>
            <p className={cn('text-[15px] leading-[1.55]', highlighted ? 'text-charge-soft' : 'text-slate-text')}>{t(`usages.${key}.description`)}</p>
            <ul className={cn('text-sm leading-[1.7]', highlighted ? 'text-charge-soft' : 'text-slate-ink')}>
              {featureKeys.map((featureKey) => (
                <li key={featureKey}>{t(`usages.${key}.features.${featureKey}`)}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
};
