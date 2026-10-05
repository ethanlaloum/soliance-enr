export const titleXLClassName = '[text-wrap:balance] text-[clamp(2.5rem,5.6vw,5.5rem)] font-extrabold leading-[0.96] tracking-[-0.045em]';

export const titleLClassName = '[text-wrap:balance] text-[clamp(2.5rem,4.4vw,4.25rem)] font-extrabold leading-[0.97] tracking-[-0.042em]';

export const focusOnLightClassName = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14181D]';

export const focusOnDarkClassName = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white';

const ctaBaseClassName =
  'inline-flex min-h-14 items-center justify-center whitespace-nowrap rounded-[4px] px-7 text-[17px] font-semibold tracking-[-0.01em] transition-[color,background-color,border-color] duration-300 ease-out-expo motion-reduce:transition-none';

export const ctaSolidClassName = `${ctaBaseClassName} ${focusOnLightClassName} bg-[#14181D] text-white hover:bg-[#E07B28] hover:text-[#14181D]`;

export const ctaOutlineClassName = `${ctaBaseClassName} ${focusOnLightClassName} border-[1.5px] border-[#14181D] text-[#14181D] hover:bg-[#14181D] hover:text-white`;

export const ctaAccentClassName = `${ctaBaseClassName} ${focusOnDarkClassName} bg-[#E07B28] text-[#14181D] hover:bg-white hover:text-[#14181D]`;
