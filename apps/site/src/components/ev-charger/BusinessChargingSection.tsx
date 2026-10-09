import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { revealDelay } from '@/components/motion/revealDelay';
import { containerClassName, eyebrowClassName } from '@/components/home/containerClassName';
import { businessAnchor } from '@/components/ev-charger/evChargerAnchors';

const sites = [
  { key: 'condominium', image: '/images/ev-charger/underground-car-park.webp', width: 1024, height: 800 },
  { key: 'fleet', image: '/images/ev-charger/company-fleet.webp', width: 1024, height: 760 },
] as const;

export const BusinessChargingSection = () => {
  const { t } = useTranslation('evCharger');

  return (
    <section
      id={businessAnchor}
      aria-labelledby="business-title"
      className={cn(containerClassName, 'flex scroll-mt-6 flex-col gap-6 pt-14 lg:gap-7 lg:pt-[88px]')}
    >
      <div data-reveal className="flex max-w-[760px] flex-col gap-2.5">
        <p className={cn(eyebrowClassName, 'text-solar-dark')}>{t('business.eyebrow')}</p>
        <h2 id="business-title" className="text-[26px] font-bold tracking-[-0.02em] lg:text-[38px]">
          {t('business.title')}
        </h2>
        <p className="text-[15px] leading-[1.55] text-slate-text lg:text-base">{t('business.body')}</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr] lg:gap-6">
        {sites.map((site, index) => (
          <figure key={site.key} data-reveal style={revealDelay(index)} className="relative overflow-hidden rounded-2xl lg:rounded-[20px]">
            <img
              src={site.image}
              alt={t(`business.${site.key}.imageAlt`)}
              width={site.width}
              height={site.height}
              loading="lazy"
              className="block h-[240px] w-full object-cover sm:h-[300px] lg:h-[380px]"
            />
            <figcaption className="absolute bottom-3 left-3 right-3 rounded-xl bg-white/[0.94] px-4 py-3 text-[13px] lg:bottom-5 lg:left-5 lg:right-auto lg:max-w-[calc(100%-40px)] lg:text-sm">
              <span className="block font-bold text-night">{t(`business.${site.key}.title`)}</span>
              <span className="block text-slate-ink">{t(`business.${site.key}.description`)}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
};
