import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Breadcrumb } from '@/components/page/Breadcrumb';
import { containerClassName } from '@/components/home/containerClassName';

export const ResourcesHero = () => {
  const { t } = useTranslation('resources');

  return (
    <section aria-labelledby="resources-title" className={cn(containerClassName, 'flex flex-col gap-3 pb-5 pt-8 lg:gap-4 lg:pb-7 lg:pt-16')}>
      <Breadcrumb items={[{ label: t('hero.breadcrumb') }]} tone="light" className="motion-safe:animate-fade-up" />
      <h1
        id="resources-title"
        className="text-[34px] font-bold leading-[1.1] tracking-[-0.02em] motion-safe:animate-fade-up motion-safe:[animation-delay:80ms] lg:text-[52px] lg:leading-[1.1]"
      >
        {t('hero.title')}
      </h1>
      <p className="max-w-[860px] text-base leading-normal text-slate-ink motion-safe:animate-fade-up motion-safe:[animation-delay:160ms] lg:text-lg lg:leading-[1.55]">
        {t('hero.lead')}
      </p>
    </section>
  );
};
