import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import { contactAnchor, paths } from '@/routes/paths';
import { buttonVariants } from '@/components/ui/buttonVariants';
import { Breadcrumb } from '@/components/page/Breadcrumb';
import { containerClassName } from '@/components/solar/horizonSolutionStyles';

export const SolarHeroSection = () => {
  const { t } = useTranslation('solar');

  return (
    <section
      aria-labelledby="solar-hero-title"
      className={cn(containerClassName, 'hz-solution-hero hz-solution-hero-grid grid items-center gap-8 pb-8 pt-6 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:pb-16 lg:pt-[72px]')}
    >
      <div className="flex flex-col gap-4 lg:gap-5">
        <Breadcrumb items={[{ label: t('breadcrumb') }]} tone="light" className="motion-safe:animate-fade-up" />
        <h1
          id="solar-hero-title"
          className="hz-page-title"
        >
          {t('hero.title')}
        </h1>
        <p className="hz-page-lead">
          {t('hero.lead')}
        </p>
        <div className="flex flex-col gap-3 motion-safe:animate-fade-up motion-safe:[animation-delay:240ms] sm:flex-row sm:flex-wrap lg:gap-3.5">
          <Link to={`${paths.home}#${contactAnchor}`} className={buttonVariants({ size: 'md' })}>
            {t('hero.requestStudy')}
          </Link>
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
        className="hz-solution-hero-photo block h-[240px] w-full rounded-[4px] object-cover [object-position:50%_55%] shadow-none motion-safe:animate-zoom-in motion-safe:[animation-delay:120ms] sm:h-[340px] lg:h-[520px] lg:rounded-[4px]"
      />
    </section>
  );
};
