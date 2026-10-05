import { cn } from '@/lib/utils';

export const TileMark = ({ className }: { className?: string }) => (
  <span aria-hidden="true" className={cn('inline-block h-[7px] w-[14px] shrink-0 rounded-t-full bg-[#C4673A]', className)} />
);

type TileFriezeProps = {
  variant: 'genoise' | 'eave';
  className?: string;
};

export const TileFrieze = ({ variant, className }: TileFriezeProps) => (
  <div aria-hidden="true" data-g-frieze className={cn('g-frieze', variant === 'genoise' ? 'g-frieze-genoise' : 'g-frieze-eave', className)}>
    <span data-g-frieze-row className="g-frieze-row" />
    {variant === 'genoise' && <span data-g-frieze-row className="g-frieze-row" />}
  </div>
);

export const Stars = ({ label, className }: { label: string; className?: string }) => (
  <span role="img" aria-label={label} className={cn('tracking-[3px] text-[#C4673A]', className)}>
    ★★★★★
  </span>
);
