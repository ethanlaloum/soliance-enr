import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import { contactAnchor, paths } from '@/routes/paths';
import { buttonVariants } from '@/components/ui/buttonVariants';
import { Breadcrumb } from '@/components/page/Breadcrumb';
import { containerClassName } from '@/components/home/containerClassName';
import { ContactLink } from '@/components/contact/ContactLink';
import { ContactFormKind } from '@/components/contact/contactDialog';

export const SolarHeroSection = () => {
  const { t } = useTranslation('solar');

  return (
    <section
      aria-labelledby="solar-hero-title"
      className={cn(containerClassName, 'grid items-center gap-8 pb-8 pt-6 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:pb-16 lg:pt-[72px]')}
    >
      <div className="flex flex-col gap-4 lg:gap-5">
        <Breadcrumb items={[{ label: t('breadcrumb') }]} tone="light" className="motion-safe:animate-fade-up" />
        <h1
          id="solar-hero-title"
          className="text-[34px] font-bold leading-[1.08] tracking-[-0.02em] motion-safe:animate-fade-up motion-safe:[animation-delay:80ms] lg:text-[56px] lg:leading-[1.06]"
        >
          {t('hero.title')}
        </h1>
        <p className="text-base leading-[1.55] text-slate-ink motion-safe:animate-fade-up motion-safe:[animation-delay:160ms] lg:text-[19px]">
          {t('hero.lead')}
        </p>
        <div className="flex flex-col gap-3 motion-safe:animate-fade-up motion-safe:[animation-delay:240ms] sm:flex-row sm:flex-wrap lg:gap-3.5">
          <ContactLink kind={ContactFormKind.STUDY} href={`${paths.home}#${contactAnchor}`} className={buttonVariants({ size: 'md' })}>
            {t('hero.requestStudy')}
          </ContactLink>
          <Link
            to={paths.simulator}
            className={cn(buttonVariants({ variant: 'outlineLight', size: 'md' }), 'border-night text-night hover:bg-night/5 hover:text-night')}
          >
            {t('hero.simulate')}
          </Link>
        </div>
      </div>
      <img
        src="/images/solar/hero-roquebrune-villa.webp"
        alt={t('hero.imageAlt')}
        width={1280}
        height={720}
        fetchPriority="high"
        className="block h-[240px] w-full rounded-2xl object-cover [object-position:50%_55%] shadow-[0_24px_60px_rgba(11,17,32,0.18)] motion-safe:animate-zoom-in motion-safe:[animation-delay:120ms] sm:h-[340px] lg:h-[520px] lg:rounded-[20px]"
      />
    </section>
  );
};
