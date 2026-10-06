import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import { contactAnchor, paths } from '@/routes/paths';
import { buttonVariants } from '@/components/ui/buttonVariants';
import { Breadcrumb } from '@/components/page/Breadcrumb';
import { containerClassName, eyebrowClassName } from '@/components/home/containerClassName';
import { LightningShape } from '@/components/ev-charger/EvChargerIcons';
import { SolarChargeWidget } from '@/components/ev-charger/SolarChargeWidget';
import { businessAnchor } from '@/components/ev-charger/evChargerAnchors';

const trustKeys = ['irve', 'installation', 'connector'] as const;

export const EvChargerHeroSection = () => {
  const { t } = useTranslation('evCharger');

  return (
    <section aria-labelledby="ev-charger-title" className="relative overflow-hidden bg-charge-surface">
      <LightningShape className="absolute -bottom-16 -right-16 h-[300px] w-[300px] text-charge opacity-[0.12] lg:-bottom-[120px] lg:-right-20 lg:h-[520px] lg:w-[520px]" />
      <div className={cn(containerClassName, 'relative grid items-center gap-8 pb-12 pt-6 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pb-24 lg:pt-20')}>
        <div className="flex flex-col gap-4 lg:gap-[22px]">
          <Breadcrumb tone="light" items={[{ label: t('hero.breadcrumb') }]} className="motion-safe:animate-fade-up" />
          <p className={cn(eyebrowClassName, 'text-charge motion-safe:animate-fade-up')}>{t('hero.eyebrow')}</p>
          <h1
            id="ev-charger-title"
            className="text-4xl font-bold leading-[1.08] tracking-[-0.02em] text-night motion-safe:animate-fade-up motion-safe:[animation-delay:80ms] lg:text-[48px] lg:leading-[1.05] xl:text-[58px]"
          >
            <Trans t={t} i18nKey="hero.title" components={{ highlight: <span className="text-charge" /> }} />
          </h1>
          <p className="text-base leading-normal text-slate-text motion-safe:animate-fade-up motion-safe:[animation-delay:160ms] lg:text-[19px] lg:leading-[1.55]">
            {t('hero.lead')}
          </p>
          <div className="flex flex-col gap-3.5 motion-safe:animate-fade-up motion-safe:[animation-delay:240ms] sm:flex-row sm:flex-wrap">
            <Link to={`${paths.home}#${contactAnchor}`} className={buttonVariants({ size: 'md' })}>
              {t('hero.requestQuote')}
            </Link>
            <a
              href={`#${businessAnchor}`}
              className={cn(
                buttonVariants({ variant: 'outlineLight', size: 'md' }),
                'border-charge bg-white text-charge hover:bg-charge-soft hover:text-charge-dark focus-visible:outline-charge',
              )}
            >
              {t('hero.businessSolutions')}
            </a>
          </div>
          <ul
            aria-label={t('hero.trustLabel')}
            className="flex flex-wrap gap-x-6 gap-y-1.5 text-[13px] text-slate-ink motion-safe:animate-fade-up motion-safe:[animation-delay:320ms] lg:text-sm"
          >
            {trustKeys.map((key, index) => (
              <li key={key} className="flex items-center gap-6">
                {index > 0 && <span aria-hidden="true">·</span>}
                {t(`hero.trust.${key}`)}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative flex flex-col gap-3.5">
          <img
            src="/images/ev-charger/hero-wallbox-post.webp"
            alt={t('hero.imageAlt')}
            width={1280}
            height={886}
            fetchPriority="high"
            className="block h-[220px] w-full rounded-2xl object-cover [object-position:50%_55%] shadow-[0_24px_60px_rgba(18,140,79,0.18)] motion-safe:animate-zoom-in motion-safe:[animation-delay:120ms] sm:h-[300px] lg:h-[360px] lg:rounded-[20px]"
          />
          <SolarChargeWidget className="motion-safe:animate-fade-up motion-safe:[animation-delay:400ms]" />
        </div>
      </div>
    </section>
  );
};
