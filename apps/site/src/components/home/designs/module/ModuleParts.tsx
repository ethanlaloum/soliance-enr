import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

const glyphCells = [0, 1, 2, 3] as const;

export const CellGlyph = ({ className }: { className?: string }) => (
  <span aria-hidden="true" className={cn('grid h-3 w-3 shrink-0 grid-cols-2 grid-rows-2 gap-[2px]', className)}>
    {glyphCells.map((cell) => (
      <span key={cell} className="bg-[#E07B28]" />
    ))}
  </span>
);

type ModuleEyebrowProps = {
  children: ReactNode;
  tone?: 'light' | 'dark';
  className?: string;
};

export const ModuleEyebrow = ({ children, tone = 'light', className }: ModuleEyebrowProps) => (
  <p className={cn('flex items-center gap-3 text-[15px] font-medium leading-snug', tone === 'dark' ? 'text-[#AEBBCB]' : 'text-[#4A535E]', className)}>
    <CellGlyph />
    <span>{children}</span>
  </p>
);

export const ModuleStars = ({ label, className }: { label: string; className?: string }) => (
  <span
    role="img"
    aria-label={label}
    className={cn('inline-flex shrink-0 items-center rounded-[2px] bg-[#E07B28] px-2 py-1.5 text-[13px] leading-none tracking-[3px] text-[#14181D]', className)}
  >
    ★★★★★
  </span>
);
