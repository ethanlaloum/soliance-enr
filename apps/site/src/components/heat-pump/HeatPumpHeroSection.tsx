import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { contactAnchor, paths } from '@/routes/paths';
import { Breadcrumb } from '@/components/page/Breadcrumb';
import { buttonVariants } from '@/components/ui/buttonVariants';
import { containerClassName } from '@/components/home/containerClassName';
import { aidSectionId } from '@/components/heat-pump/HeatPumpAidSection';
import { ContactLink } from '@/components/contact/ContactLink';
import { ContactFormKind } from '@/components/contact/contactDialog';

const trustKeys = ['qualipac', 'daikin', 'installation'] as const;
const statKeys = ['consumption', 'bill', 'energyClass'] as const;

const ConcentricCircles = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 100 100"
    className="pointer-events-none absolute -right-[160px] -top-[120px] h-[440px] w-[440px] opacity-[0.18] lg:-right-[120px] lg:-top-[160px] lg:h-[720px] lg:w-[720px]"
  >
    {[48, 36, 24, 12].map((radius) => (
      <circle key={radius} cx="50" cy="50" r={radius} fill="none" stroke="#ffffff" strokeWidth="0.6" />
    ))}
  </svg>
);

export const HeatPumpHeroSection = () => {
  const { t } = useTranslation('heatPump');

  return (
    <section aria-labelledby="heat-pump-hero-title" className="relative overflow-hidden bg-heat">
      <ConcentricCircles />
      <div className={cn(containerClassName, 'relative grid items-center gap-9 pb-12 pt-8 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:pb-24 lg:pt-20')}>
        <div className="flex flex-col gap-4 lg:gap-[22px]">
          <Breadcrumb items={[{ label: t('breadcrumb') }]} className="motion-safe:animate-fade-up" />
          <p className="text-xs font-semibold uppercase tracking-[1.2px] text-white/85 motion-safe:animate-fade-up lg:text-sm lg:tracking-[1.5px]">
            {t('hero.eyebrow')}
          </p>
          <h1
            id="heat-pump-hero-title"
            className="text-4xl font-bold leading-[1.08] tracking-[-0.02em] text-white motion-safe:animate-fade-up motion-safe:[animation-delay:80ms] lg:text-[58px] lg:leading-[1.05]"
          >
            {t('hero.title')}
          </h1>
          <p className="text-base leading-normal text-heat-sky motion-safe:animate-fade-up motion-safe:[animation-delay:160ms] lg:text-[19px] lg:leading-[1.55]">
            {t('hero.lead')}
          </p>
          <div className="mt-1 flex flex-col gap-3.5 motion-safe:animate-fade-up motion-safe:[animation-delay:240ms] sm:flex-row sm:flex-wrap">
            <ContactLink kind={ContactFormKind.STUDY} href={`${paths.home}#${contactAnchor}`} className={buttonVariants({ size: 'md' })}>
              {t('hero.requestStudy')}
            </ContactLink>
            <a href={`#${aidSectionId}`} className={cn(buttonVariants({ variant: 'outlineLight', size: 'md' }), 'border-white')}>
              {t('hero.computeAid')}
            </a>
          </div>
          <ul
            aria-label={t('hero.trustLabel')}
            className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[13px] text-heat-mist motion-safe:animate-fade-up motion-safe:[animation-delay:320ms] lg:gap-x-6 lg:text-sm"
          >
            {trustKeys.map((key, index) => (
              <Fragment key={key}>
                {index > 0 && (
                  <li aria-hidden="true">
                    ·
                  </li>
                )}
                <li>{t(`hero.trust.${key}`)}</li>
              </Fragment>
            ))}
          </ul>
        </div>
        <div className="relative flex flex-col gap-3.5">
          <img
            src="/images/heat-pump/outdoor-unit.webp"
            alt={t('hero.imageAlt')}
            width={960}
            height={1276}
            fetchPriority="high"
            className="block h-[240px] w-full rounded-[18px] object-cover shadow-[0_30px_60px_rgba(0,0,0,0.25)] motion-safe:animate-zoom-in motion-safe:[animation-delay:120ms] lg:h-[340px] lg:rounded-[20px]"
          />
          <dl
            aria-label={t('hero.statsLabel')}
            className="grid grid-cols-3 gap-3 rounded-[14px] bg-white px-4 py-4 motion-safe:animate-fade-up motion-safe:[animation-delay:400ms] lg:px-[22px] lg:py-[18px]"
          >
            {statKeys.map((key) => (
              <div key={key} className="flex flex-col-reverse justify-end gap-0.5">
                <dt className="text-[11px] leading-snug text-slate-ink lg:text-xs">{t(`hero.stats.${key}.label`)}</dt>
                <dd className="text-[22px] font-bold text-heat lg:text-[26px]">{t(`hero.stats.${key}.value`)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
};
