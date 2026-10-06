import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { containerClassName } from '@/components/home/containerClassName';

export const CareBrandsSection = () => {
  const { t } = useTranslation('care');
  const brands = t('brands.list', { returnObjects: true }) as string[];

  return (
    <section aria-labelledby="care-brands-title" className="border-b border-care-line bg-white">
      <div className={cn(containerClassName, 'flex flex-col gap-3 py-6 lg:flex-row lg:items-center lg:gap-10 lg:py-[30px] desktop:px-20')}>
        <h2 id="care-brands-title" className="whitespace-nowrap text-sm font-bold text-care lg:text-[15px]">
          {t('brands.label')}
        </h2>
        <ul aria-label={t('brands.listLabel')} className="flex flex-wrap items-center gap-2">
          {brands.map((brand) => (
            <li key={brand} className="rounded-full border border-[#dbe7e0] bg-care-chip px-3 py-1.5 text-[13px] font-semibold text-care-text lg:px-3.5 lg:text-[15px]">
              {brand}
            </li>
          ))}
          <li className="text-[13px] text-care-muted lg:text-[15px]">{t('brands.more')}</li>
        </ul>
      </div>
    </section>
  );
};
