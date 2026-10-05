export const rvFocusOnDarkClassName =
  'focus-visible:[outline-style:solid] focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-[#E07B28]';

export const rvFocusOnLightClassName =
  'focus-visible:[outline-style:solid] focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-[#1B3FA0]';

export const rvTitleClassName =
  'riviera-display [text-wrap:balance] text-[clamp(1.5rem,6.2vw,2.25rem)] font-[650] uppercase leading-[1.06] tracking-[-0.01em] lg:text-[clamp(2.25rem,3.3vw,3.25rem)]';

export const rvSectionSpacingClassName = 'py-20 lg:py-32';

const rvCtaBaseClassName =
  'inline-flex min-h-14 items-center justify-center whitespace-nowrap rounded-full px-7 text-base font-semibold transition-colors duration-300 ease-out-expo motion-reduce:transition-none lg:text-[17px]';

export const rvCtaSunClassName = `${rvCtaBaseClassName} ${rvFocusOnDarkClassName} bg-[#E07B28] text-[#0B1120] hover:bg-white hover:text-[#0B1120]`;

export const rvCtaGhostClassName = `${rvCtaBaseClassName} ${rvFocusOnDarkClassName} border-2 border-[#CFE0F5]/60 text-white hover:border-white hover:bg-white hover:text-[#1B3FA0]`;

export const rvPhotoTintClassName = 'riviera-tint transition-opacity duration-700 ease-out-expo motion-reduce:transition-none';
