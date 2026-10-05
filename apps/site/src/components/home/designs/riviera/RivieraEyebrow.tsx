import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type RivieraEyebrowProps = {
  children: ReactNode;
  className?: string;
};

export const RivieraEyebrow = ({ children, className }: RivieraEyebrowProps) => (
  <p className={cn('flex items-center gap-3 text-sm font-semibold text-[#CFE0F5] lg:text-[15px]', className)}>
    <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#E07B28]" />
    <span>{children}</span>
  </p>
);
