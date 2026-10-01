import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { buttonVariants, ButtonVariantProps } from '@/components/ui/buttonVariants';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & ButtonVariantProps;

export const Button = ({ className, variant, size, type = 'button', ...props }: ButtonProps) => (
  <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />
);
