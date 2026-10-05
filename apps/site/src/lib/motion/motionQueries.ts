export const motionQueries = {
  desktop: '(min-width: 1024px)',
  reduceMotion: '(prefers-reduced-motion: reduce)',
  allowMotion: '(prefers-reduced-motion: no-preference)',
  finePointer: '(hover: hover) and (pointer: fine)',
} as const;

export type MotionConditions = { desktop: boolean; reduceMotion: boolean };
