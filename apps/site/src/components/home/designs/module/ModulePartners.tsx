import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { containerClassName } from '@/components/home/containerClassName';
import { CellGlyph } from '@/components/home/designs/module/ModuleParts';

export const ModulePartners = () => {
  const { t } = useTranslation('home');

  return (
    <section aria-labelledby="partners-title" className="bg-white">
      <div className={cn(containerClassName, 'grid items-center gap-5 border-t border-[#C9D1DA] py-8 lg:grid-cols-12 lg:gap-10 lg:py-10')}>
        <h2 id="partners-title" className="flex items-center gap-3 text-[15px] font-semibold text-[#14181D] lg:col-span-2">
          <CellGlyph />
          {t('partners.title')}
        </h2>
        <img
          src="/images/partner-logos.svg"
          alt={t('partners.logosAlt')}
          width={1100}
          height={72}
          loading="lazy"
          className="h-auto w-full max-w-[1100px] lg:col-span-10 lg:h-[64px] lg:w-auto lg:justify-self-end"
        />
      </div>
    </section>
  );
};
