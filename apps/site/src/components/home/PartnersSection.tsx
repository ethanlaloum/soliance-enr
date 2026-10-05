import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { containerClassName } from '@/components/home/containerClassName';

export const PartnersSection = () => {
  const { t } = useTranslation('home');

  return (
    <section aria-labelledby="partners-title" className="bg-ivory">
      <div className={cn(containerClassName, 'grid items-center gap-5 border-b border-sand-line py-10 lg:grid-cols-12 lg:gap-8 lg:py-14')}>
        <h2 id="partners-title" className="flex items-center gap-3 text-[15px] font-semibold text-night lg:col-span-2">
          <span aria-hidden="true" className="h-2 w-2 shrink-0 rotate-45 bg-solar" />
          {t('partners.title')}
        </h2>
        <img
          src="/images/partner-logos.svg"
          alt={t('partners.logosAlt')}
          width={1100}
          height={72}
          loading="lazy"
          className="h-auto w-full max-w-[1100px] lg:col-span-10 lg:h-[72px] lg:w-auto lg:justify-self-end"
        />
      </div>
    </section>
  );
};
