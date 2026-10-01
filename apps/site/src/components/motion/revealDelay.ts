import { CSSProperties } from 'react';

export const revealDelay = (index: number, stepMs = 80): CSSProperties => ({ '--reveal-delay': `${index * stepMs}ms` }) as CSSProperties;
