import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge, validators } from 'tailwind-merge';

const twMerge = extendTailwindMerge({
  override: {
    classGroups: {
      'outline-style': [{ outline: ['', 'dashed', 'dotted', 'double', 'none'] }],
      'outline-w': [{ outline: [validators.isNumber, validators.isArbitraryVariableLength, validators.isArbitraryLength] }],
    },
  },
});

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
