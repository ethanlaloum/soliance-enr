import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { revealDelay } from '@/components/motion/revealDelay';
import { containerClassName } from '@/components/home/containerClassName';

const sizes = [
  {
    key: 'small',
    image: '/images/solar/size-small-villeneuve-loubet.webp',
    objectPosition: '50% 70%',
    featured: false,
    features: ['installation', 'monitoring', 'quote'],
  },
  {
    key: 'medium',
    image: '/images/solar/size-medium-saint-jeannet.webp',
    objectPosition: '50% 60%',
    featured: true,
    features: ['installation', 'bill', 'absence'],
  },
  {
    key: 'large',
    image: '/images/solar/size-large-villa.webp',
    objectPosition: '50% 50%',
    featured: false,
    features: ['installation', 'bill', 'financing'],
  },
] as const;

export const SolarSizesSection = () => {
  const { t } = useTranslation('solar');

  return (
    <section aria-labelledby="solar-sizes-title" className={cn(containerClassName, 'flex flex-col gap-5 pb-10 pt-12 lg:gap-8 lg:pb-16 lg:pt-20')}>
      <h2 id="solar-sizes-title" data-reveal className="text-[28px] font-bold leading-[1.15] tracking-[-0.02em] lg:text-[40px]">
        {t('sizes.title')}
      </h2>
      <ul className="grid gap-4 lg:grid-cols-3 lg:gap-6">
        {sizes.map((size, index) => (
          <li
            key={size.key}
            data-reveal
            style={revealDelay(index)}
            className={cn(
              'flex flex-col gap-3 rounded-[18px] p-6 lg:p-8',
              size.featured ? 'bg-night text-white' : 'border border-sand-line bg-white',
            )}
          >
            <img
              src={size.image}
              alt={t(`sizes.${size.key}.imageAlt`)}
              width={800}
              height={450}
              loading="lazy"
              style={{ objectPosition: size.objectPosition }}
              className="block h-[150px] w-full rounded-xl object-cover"
            />
            <p className="text-[13px] font-semibold uppercase tracking-[1px] text-solar">{t(`sizes.${size.key}.tag`)}</p>
            <h3 className="text-[22px] font-bold leading-tight lg:text-2xl">{t(`sizes.${size.key}.title`)}</h3>
            <p className={cn('text-[15px] leading-[1.55]', size.featured ? 'text-slate-light' : 'text-slate-ink')}>
              {t(`sizes.${size.key}.description`)}
            </p>
            <ul className={cn('mt-1.5 text-sm leading-[1.7]', size.featured ? 'text-slate-light' : 'text-slate-ink')}>
              {size.features.map((feature) => (
                <li key={feature}>{t(`sizes.${size.key}.features.${feature}`)}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <p data-reveal className="text-[13px] leading-normal text-slate lg:text-sm">
        {t('sizes.footnote')}
      </p>
    </section>
  );
};
