import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { containerClassName } from '@/components/home/containerClassName';

export const RivieraPartners = () => {
  const { t } = useTranslation('home');

  return (
    <section aria-labelledby="partners-title" className="bg-white">
      <div className={cn(containerClassName, 'grid items-center gap-5 py-10 lg:grid-cols-12 lg:gap-8 lg:py-14')}>
        <h2 id="partners-title" className="riviera-display flex items-center gap-3 text-[13px] font-semibold uppercase tracking-[0.02em] text-[#1B3FA0] lg:col-span-3">
          <span aria-hidden="true" className="relative h-3 w-6 shrink-0 overflow-hidden">
            <span className="absolute inset-x-0 top-0 block h-6 rounded-full bg-[#E07B28]" />
          </span>
          {t('partners.title')}
        </h2>
        <img
          src="/images/partner-logos.svg"
          alt={t('partners.logosAlt')}
          width={1100}
          height={72}
          loading="lazy"
          className="h-auto w-full max-w-[1100px] lg:col-span-9 lg:justify-self-end"
        />
      </div>
    </section>
  );
};
