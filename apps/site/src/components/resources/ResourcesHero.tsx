import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Breadcrumb } from '@/components/page/Breadcrumb';

export const ResourcesHero = () => {
  const { t } = useTranslation('resources');

  return (
    <section aria-labelledby="resources-title" className={cn('hz-page-container', 'hz-page-hero flex flex-col gap-5 lg:gap-7')}>
      <Breadcrumb items={[{ label: t('hero.breadcrumb') }]} tone="light" className="motion-safe:animate-fade-up" />
      <h1
        id="resources-title"
        className="hz-page-title motion-safe:animate-fade-up motion-safe:[animation-delay:80ms]"
      >
        {t('hero.title')}
      </h1>
      <p className="hz-page-lead max-w-[760px] motion-safe:animate-fade-up motion-safe:[animation-delay:160ms] lg:text-lg lg:leading-[1.55]">
        {t('hero.lead')}
      </p>
    </section>
  );
};
