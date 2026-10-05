import { cn } from '@/lib/utils';

type SolianceLogoProps = {
  name: string;
  size?: 'header' | 'footer';
  className?: string;
};

export const SolianceMark = ({ className }: { className?: string }) => (
  <svg aria-hidden="true" viewBox="0 0 32 32" className={cn('block shrink-0', className)}>
    <path d="M16 1 31 16 16 31 1 16Z" fill="#E07B28" />
    <path d="M16 8.5 23.5 16 16 23.5 8.5 16Z" fill="#FFFFFF" fillOpacity="0.32" />
    <circle cx="16" cy="16" r="2.6" fill="#0B1120" />
  </svg>
);

export const SolianceLogo = ({ name, size = 'header', className }: SolianceLogoProps) => (
  <span className={cn('flex items-center', size === 'header' ? 'gap-2.5 lg:gap-3' : 'gap-2.5', className)}>
    <SolianceMark className={size === 'header' ? 'h-7 w-7 lg:h-8 lg:w-8' : 'h-6 w-6'} />
    <span className={cn('soliance-wordmark font-bold tracking-[-0.01em] text-white', size === 'header' ? 'text-[21px] lg:text-[26px]' : 'text-lg lg:text-xl')}>{name}</span>
  </span>
);
