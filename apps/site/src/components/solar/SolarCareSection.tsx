import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { revealDelay } from '@/components/motion/revealDelay';
import { containerClassName, eyebrowClassName } from '@/components/home/containerClassName';

const cards = [
  { key: 'supervision', image: '/images/solar/care-supervision.webp' },
  { key: 'repair', image: '/images/solar/care-repair.webp' },
  { key: 'maintenance', image: '/images/solar/care-maintenance.webp' },
] as const;

export const SolarCareSection = () => {
  const { t } = useTranslation('solar');

  return (
    <div className={cn(containerClassName, 'pb-10 lg:pb-16')}>
      <section
        data-reveal
        aria-labelledby="solar-care-title"
        className="flex flex-col gap-6 rounded-2xl bg-night p-6 text-white lg:gap-8 lg:rounded-3xl lg:px-16 lg:py-14"
      >
        <div className="grid gap-4 lg:grid-cols-2 lg:items-end lg:gap-10">
          <div className="flex flex-col gap-3">
            <p className={cn(eyebrowClassName, 'text-solar')}>{t('care.eyebrow')}</p>
            <h2 id="solar-care-title" className="text-[26px] font-bold leading-[1.15] tracking-[-0.02em] lg:text-[36px]">
              {t('care.title')}
            </h2>
          </div>
          <p className="text-[15px] leading-[1.55] text-slate-light lg:text-base">{t('care.body')}</p>
        </div>
        <ul className="grid gap-4 md:grid-cols-3 lg:gap-5">
          {cards.map((card, index) => (
            <li key={card.key} data-reveal style={revealDelay(index + 1)} className="overflow-hidden rounded-2xl bg-night-soft">
              <img
                src={card.image}
                alt={t(`care.cards.${card.key}.imageAlt`)}
                width={800}
                height={800}
                loading="lazy"
                className="block h-[180px] w-full object-cover lg:h-[200px]"
              />
              <div className="flex flex-col gap-1 p-[18px]">
                <h3 className="text-[17px] font-bold">{t(`care.cards.${card.key}.title`)}</h3>
                <p className="text-sm leading-normal text-slate-light">{t(`care.cards.${card.key}.description`)}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};
