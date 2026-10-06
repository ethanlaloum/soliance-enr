import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

export const CareLogo = ({ size = 'header' }: { size?: 'header' | 'footer' }) => {
  const { t } = useTranslation('care');

  return (
    <span className="flex items-center gap-2.5 lg:gap-3">
      <span
        aria-hidden="true"
        className={cn(
          'block rotate-45 border-care-leaf bg-care',
          size === 'header' ? 'h-4 w-4 border-[2.5px] lg:h-5 lg:w-5 lg:border-[3px]' : 'h-3.5 w-3.5 border-2',
        )}
      />
      <span className={cn('font-bold tracking-[-0.01em] text-white', size === 'header' ? 'text-xl lg:text-2xl' : 'text-lg lg:text-xl')}>
        {t('brand.name')} <span className="text-care-leaf">{t('brand.suffix')}</span>
      </span>
    </span>
  );
};
