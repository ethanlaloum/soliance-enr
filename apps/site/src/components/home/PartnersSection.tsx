import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { containerClassName } from '@/components/home/containerClassName';

export const PartnersSection = () => {
  const { t } = useTranslation('home');

  return (
    <section aria-labelledby="partners-title" className="border-b border-sand-line bg-white">
      <div data-reveal className={cn(containerClassName, 'flex flex-col items-start gap-4 py-8 lg:flex-row lg:items-center lg:gap-7 lg:py-10')}>
        <h2 id="partners-title" className="shrink-0 text-sm font-semibold uppercase tracking-[1px] text-slate">
          {t('partners.title')}
        </h2>
        <img
          src="/images/partner-logos.svg"
          alt={t('partners.logosAlt')}
          width={1100}
          height={72}
          loading="lazy"
          className="h-auto w-full max-w-[1100px] lg:h-[72px] lg:w-auto lg:flex-1"
        />
      </div>
    </section>
  );
};
