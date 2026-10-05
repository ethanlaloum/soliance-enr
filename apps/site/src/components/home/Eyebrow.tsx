import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type EyebrowProps = {
  children: ReactNode;
  tone?: 'onDark' | 'onLight';
  className?: string;
};

export const Eyebrow = ({ children, tone = 'onDark', className }: EyebrowProps) => (
  <p className={cn('flex items-center gap-3 text-sm font-medium lg:text-[15px]', tone === 'onDark' ? 'text-slate-light' : 'text-slate-ink', className)}>
    <span aria-hidden="true" className="h-2 w-2 shrink-0 rotate-45 bg-solar" />
    <span>{children}</span>
  </p>
);
