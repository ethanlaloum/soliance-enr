import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import { contactAnchor, paths } from '@/routes/paths';
import { buttonVariants } from '@/components/ui/buttonVariants';
import { Breadcrumb } from '@/components/page/Breadcrumb';
import { containerClassName, eyebrowClassName } from '@/components/home/containerClassName';
import type { ServiceArea } from '@/app/service-areas/domain/entities/ServiceArea';
import type { LocalSolarTextValues } from '@/components/local-solar/localSolarTextValues';
import { ContactLink } from '@/components/contact/ContactLink';
import { ContactFormKind } from '@/components/contact/contactDialog';

type LocalSolarHeroSectionProps = {
  area: ServiceArea;
  values: LocalSolarTextValues;
};

export const LocalSolarHeroSection = ({ area, values }: LocalSolarHeroSectionProps) => {
  const { t } = useTranslation(['localSolar', 'solar']);

  return (
    <section
      aria-labelledby="local-solar-hero-title"
      className={cn(containerClassName, 'grid items-center gap-8 pb-8 pt-6 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:pb-16 lg:pt-[72px]')}
    >
      <div className="flex flex-col gap-4 lg:gap-5">
        <Breadcrumb items={[{ label: t('solar:breadcrumb'), to: paths.solar }, { label: values.city }]} tone="light" className="motion-safe:animate-fade-up" />
        <p className={cn(eyebrowClassName, 'motion-safe:animate-fade-up')}>
          {t('hero.eyebrow', { department: t(`departments.${area.department}`) })}
        </p>
        <h1
          id="local-solar-hero-title"
          className="text-[34px] font-bold leading-[1.08] tracking-[-0.02em] motion-safe:animate-fade-up motion-safe:[animation-delay:80ms] lg:text-[56px] lg:leading-[1.06]"
        >
          {t('hero.title', values)}
        </h1>
        <p className="text-base leading-[1.55] text-slate-ink motion-safe:animate-fade-up motion-safe:[animation-delay:160ms] lg:text-[19px]">
          {t(`areas.${area.slug}.lead`, values)}
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
        src={area.hero.src}
        alt={t(`areas.${area.slug}.imageAlt`)}
        width={area.hero.width}
        height={area.hero.height}
        fetchPriority="high"
        className="block h-[240px] w-full rounded-2xl object-cover shadow-[0_24px_60px_rgba(11,17,32,0.18)] motion-safe:animate-zoom-in motion-safe:[animation-delay:120ms] sm:h-[340px] lg:h-[520px] lg:rounded-[20px]"
      />
    </section>
  );
};
