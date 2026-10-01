import { cn } from '@/lib/utils';

type SolianceLogoProps = {
  name: string;
  size?: 'header' | 'footer';
  className?: string;
};

export const SolianceLogo = ({ name, size = 'header', className }: SolianceLogoProps) => (
  <span className={cn('flex items-center', size === 'header' ? 'gap-2.5 lg:gap-3' : 'gap-2.5', className)}>
    <span
      aria-hidden="true"
      className={cn(
        'block rotate-45 bg-solar',
        size === 'header' ? 'h-4 w-4 rounded-sm lg:h-[22px] lg:w-[22px] lg:rounded-[3px]' : 'h-4 w-4 rounded-sm',
      )}
    />
    <span
      className={cn(
        'font-bold tracking-[-0.01em] text-white',
        size === 'header' ? 'text-[21px] lg:text-[26px]' : 'text-lg lg:text-xl',
      )}
    >
      {name}
    </span>
  </span>
);
