import { cn } from '@/lib/utils';

type IconProps = { className?: string };

const strokeProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

export const HouseIcon = ({ className }: IconProps) => (
  <svg aria-hidden="true" className={className} width="24" height="24" viewBox="0 0 24 24" {...strokeProps}>
    <path d="M3 11 L12 3 L21 11 V21 H3 Z" />
  </svg>
);

export const BoltIcon = ({ className }: IconProps) => (
  <svg aria-hidden="true" className={className} width="24" height="24" viewBox="0 0 24 24" {...strokeProps}>
    <path d="M13 2 L4 14 H12 L11 22 L20 10 H12 Z" />
  </svg>
);

export const ChargingParkIcon = ({ className }: IconProps) => (
  <svg aria-hidden="true" className={className} width="24" height="24" viewBox="0 0 24 24" {...strokeProps}>
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
  </svg>
);

export const LightningShape = ({ className }: IconProps) => (
  <svg aria-hidden="true" className={cn('pointer-events-none', className)} viewBox="0 0 100 100">
    <path d="M55 5 L30 55 L48 55 L40 95 L72 42 L54 42 Z" fill="currentColor" />
  </svg>
);
