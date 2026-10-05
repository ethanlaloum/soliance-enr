import { describe, expect, it } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn', () => {
  it('keeps the Tailwind 3 outline style next to an outline width', () => {
    expect(cn('focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-solar')).toBe(
      'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-solar',
    );
  });

  it('lets a later outline style or width replace an earlier one', () => {
    expect(cn('outline outline-2', 'outline-dashed outline-4')).toBe('outline-dashed outline-4');
  });

  it('still lets a later class of the same group win', () => {
    expect(cn('px-4 text-night', 'px-6 hover:text-white')).toBe('text-night px-6 hover:text-white');
  });
});
