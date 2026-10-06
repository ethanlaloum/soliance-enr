import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/buttonVariants';

export const careEyebrowClassName = 'text-xs font-bold uppercase tracking-[1.2px] text-care lg:text-[15px] lg:tracking-[1.5px]';

export const careTitleClassName = 'text-[28px] font-semibold leading-[1.12] tracking-[-0.02em] lg:text-[42px]';

export const careBodyClassName = 'text-base leading-[1.55] text-care-text lg:text-lg';

export const careOrangeButtonClassName = cn(buttonVariants({ size: 'lg' }), 'text-[17px] lg:text-lg');

export const careGreenButtonClassName = cn(
  buttonVariants({ size: 'lg' }),
  'bg-care text-[17px] hover:bg-care-deep hover:shadow-[0_12px_24px_-10px_rgba(26,122,82,0.7)] focus-visible:outline-care lg:text-lg',
);

export const careOutlineButtonClassName = cn(
  buttonVariants({ variant: 'outlineLight', size: 'lg' }),
  'border-2 border-care text-[17px] font-bold text-care hover:bg-care-surface hover:text-care-deep focus-visible:outline-care lg:text-lg',
);

export const careOutlineOnDarkButtonClassName = cn(
  buttonVariants({ variant: 'outlineLight', size: 'lg' }),
  'border-care-leaf text-[17px] focus-visible:outline-care-leaf lg:text-lg',
);
