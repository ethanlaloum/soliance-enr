import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { containerClassName } from '@/components/home/containerClassName';
import { CareDashboard } from '@/components/care/CareDashboard';
import { CareDiamondPattern } from '@/components/care/CareIcons';
import { CareRequestLink } from '@/components/care/CareRequestLink';
import { CareRequestType } from '@/components/care/careRequestSchema';
import { careOrangeButtonClassName, careOutlineOnDarkButtonClassName } from '@/components/care/careStyles';

export const CareHeroSection = () => {
  const { t } = useTranslation('care');

  return (
    <section aria-labelledby="care-hero-title" className="relative overflow-hidden bg-care-forest text-white">
      <CareDiamondPattern id="care-hero-diamonds" />
      <div className={cn(containerClassName, 'relative grid items-center gap-10 pb-20 pt-10 lg:grid-cols-2 lg:gap-16 lg:pb-[130px] lg:pt-[72px] desktop:px-20')}>
        <div className="flex flex-col gap-5 lg:gap-6">
          <p className="text-xs font-semibold uppercase tracking-[1.5px] text-care-leaf motion-safe:animate-fade-up lg:text-[15px]">{t('hero.eyebrow')}</p>
          <h1
            id="care-hero-title"
            className="text-[34px] font-semibold leading-[1.08] tracking-[-0.02em] motion-safe:animate-fade-up motion-safe:[animation-delay:80ms] sm:text-[44px] lg:text-[52px] lg:leading-[1.05] xl:text-[62px]"
          >
            {t('hero.title')}
          </h1>
          <p className="text-[17px] leading-normal text-care-pale motion-safe:animate-fade-up motion-safe:[animation-delay:160ms] lg:text-xl">
            {t('hero.lead')}
          </p>
          <div className="mt-1 flex flex-col gap-3 motion-safe:animate-fade-up motion-safe:[animation-delay:240ms] sm:flex-row sm:flex-wrap sm:gap-3.5 lg:mt-2">
            <CareRequestLink requestType={CareRequestType.SUBSCRIBE_CARE} className={careOrangeButtonClassName}>
              {t('hero.subscribe')}
            </CareRequestLink>
            <CareRequestLink requestType={CareRequestType.HEALTH_CHECK} className={careOutlineOnDarkButtonClassName}>
              {t('hero.healthCheck')}
            </CareRequestLink>
          </div>
          <p className="text-[13px] text-care-fog motion-safe:animate-fade-up motion-safe:[animation-delay:320ms] lg:text-sm">{t('hero.note')}</p>
        </div>
        <CareDashboard />
      </div>
      <svg aria-hidden="true" viewBox="0 0 1440 60" preserveAspectRatio="none" className="absolute inset-x-0 -bottom-px block h-8 w-full fill-white lg:h-[60px]">
        <path d="M0 60 C420 0 1020 0 1440 60 Z" />
      </svg>
    </section>
  );
};
