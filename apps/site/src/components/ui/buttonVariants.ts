import { cva, type VariantProps } from 'class-variance-authority';

export const buttonVariants = cva(
  'site-button inline-flex items-center justify-center whitespace-nowrap rounded-[10px] font-bold transition-[color,background-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 motion-reduce:transition-none motion-reduce:hover:translate-y-0 disabled:hover:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solar disabled:cursor-not-allowed disabled:opacity-70',
  {
    variants: {
      variant: {
        primary: 'bg-solar text-white hover:bg-solar-dark hover:text-white hover:shadow-[0_12px_24px_-10px_rgba(224,123,40,0.7)]',
        outlineLight: 'border-[1.5px] border-solar font-semibold text-white hover:bg-white/5 hover:text-white',
      },
      size: {
        sm: 'px-[22px] py-[13px] text-[15px] rounded-lg',
        md: 'px-[26px] py-4 text-[17px]',
        lg: 'px-7 py-[18px] text-lg',
        block: 'h-14 w-full text-lg',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
