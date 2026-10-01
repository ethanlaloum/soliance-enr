import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import { paths } from '@/routes/paths';
import { buttonVariants } from '@/components/ui/buttonVariants';
import { DiamondPattern } from '@/components/icons/Icons';
import { containerClassName, eyebrowClassName } from '@/components/home/containerClassName';
import { professionalStudyAnchor } from '@/components/professionals/professionalStudyAnchor';

export const ProfessionalsHeroSection = () => {
  const { t } = useTranslation('professionals');

  return (
    <section aria-labelledby="professionals-hero-title" className="relative overflow-hidden bg-night">
      <DiamondPattern />
      <div className={cn(containerClassName, 'relative grid items-center gap-8 pb-10 pt-8 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:pb-24 lg:pt-20')}>
        <div className="flex flex-col gap-4 lg:gap-[22px]">
          <p className={cn(eyebrowClassName, 'motion-safe:animate-fade-up')}>{t('hero.eyebrow')}</p>
          <h1
            id="professionals-hero-title"
            className="text-[34px] font-bold leading-[1.08] tracking-[-0.02em] text-white motion-safe:animate-fade-up motion-safe:[animation-delay:80ms] lg:text-[56px] lg:leading-[1.06]"
          >
            {t('hero.title')}
          </h1>
          <p className="text-base leading-normal text-slate-light motion-safe:animate-fade-up motion-safe:[animation-delay:160ms] lg:text-[19px] lg:leading-[1.55]">
            {t('hero.lead')}
          </p>
          <div className="mt-1 flex flex-col gap-3.5 motion-safe:animate-fade-up motion-safe:[animation-delay:240ms] sm:flex-row sm:flex-wrap">
            <a href={`#${professionalStudyAnchor}`} className={cn(buttonVariants({ size: 'md' }), 'whitespace-normal text-center sm:whitespace-nowrap')}>
              {t('hero.requestStudy')}
            </a>
            <Link to={paths.projects} className={cn(buttonVariants({ variant: 'outlineLight', size: 'md' }), 'whitespace-normal text-center sm:whitespace-nowrap')}>
              {t('hero.seeReferences')}
            </Link>
          </div>
        </div>
        <img
          src="/images/professionals/hero-parking-carport.webp"
          alt={t('hero.imageAlt')}
          width={1024}
          height={1024}
          fetchPriority="high"
          className="relative block h-[220px] w-full rounded-2xl object-cover shadow-float motion-safe:animate-zoom-in motion-safe:[animation-delay:120ms] sm:h-[300px] lg:h-[380px] lg:rounded-[20px]"
        />
      </div>
    </section>
  );
};
