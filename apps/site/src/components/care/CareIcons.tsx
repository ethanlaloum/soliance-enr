type IconProps = { className?: string };

const strokeProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

export const PlugIcon = ({ className }: IconProps) => (
  <svg aria-hidden="true" className={className} width="28" height="28" viewBox="0 0 24 24" {...strokeProps}>
    <path d="M9 7V3M15 7V3M7 7h10v4a5 5 0 0 1-10 0zM12 16v5" />
  </svg>
);

export const ChipIcon = ({ className }: IconProps) => (
  <svg aria-hidden="true" className={className} width="28" height="28" viewBox="0 0 24 24" {...strokeProps}>
    <rect x="6" y="6" width="12" height="12" rx="2" />
    <path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" />
  </svg>
);

export const TruckIcon = ({ className }: IconProps) => (
  <svg aria-hidden="true" className={className} width="28" height="28" viewBox="0 0 24 24" {...strokeProps}>
    <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7" />
    <circle cx="7" cy="17" r="2" />
    <circle cx="17" cy="17" r="2" />
  </svg>
);

export const ShieldIcon = ({ className }: IconProps) => (
  <svg aria-hidden="true" className={className} width="24" height="24" viewBox="0 0 24 24" {...strokeProps}>
    <path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6z" />
    <path d="m8.5 12 2.5 2.5 4.5-5" />
  </svg>
);

export const ToolsIcon = ({ className }: IconProps) => (
  <svg aria-hidden="true" className={className} width="24" height="24" viewBox="0 0 24 24" {...strokeProps}>
    <path d="M14.7 6.3a4 4 0 0 0 5 5L21 13l-8 8-3-3 6.3-6.3a4 4 0 0 1-5-5L13 5z" />
    <path d="m3 21 6-6" />
  </svg>
);

export const BoltIcon = ({ className }: IconProps) => (
  <svg aria-hidden="true" className={className} width="24" height="24" viewBox="0 0 24 24" {...strokeProps}>
    <path d="M13 2 4 14h7l-1 8 9-12h-7z" />
  </svg>
);

export const ChatIcon = ({ className }: IconProps) => (
  <svg aria-hidden="true" className={className} width="24" height="24" viewBox="0 0 24 24" {...strokeProps}>
    <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-5A8 8 0 1 1 21 12z" />
  </svg>
);

export const PinIcon = ({ className }: IconProps) => (
  <svg aria-hidden="true" className={className} width="24" height="24" viewBox="0 0 24 24" {...strokeProps}>
    <path d="M12 21s7-6.1 7-12a7 7 0 0 0-14 0c0 5.9 7 12 7 12z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
);

export const CareDiamondPattern = ({ id }: { id: string }) => (
  <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.09]">
    <defs>
      <pattern id={id} width="34" height="34" patternUnits="userSpaceOnUse">
        <path d="M17 5 L29 17 L17 29 L5 17 Z" fill="none" stroke="#7fd1a8" strokeWidth="1.3" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill={`url(#${id})`} />
  </svg>
);
