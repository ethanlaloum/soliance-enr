import { ReactNode } from 'react';

type IconProps = { className?: string };

const StrokeIcon = ({ className, children }: IconProps & { children: ReactNode }) => (
  <svg
    aria-hidden="true"
    className={className}
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

export const SolarPanelIcon = ({ className }: IconProps) => (
  <StrokeIcon className={className}>
    <path d="M6 5h15l-3 10H3L6 5z" />
    <path d="M4.5 10h15M11 5 8 15M16 5l-3 10M10.5 15v4M7 19h7" />
  </StrokeIcon>
);

export const MeterIcon = ({ className }: IconProps) => (
  <StrokeIcon className={className}>
    <rect x="5" y="3" width="14" height="18" rx="2" />
    <circle cx="12" cy="10" r="4" />
    <path d="m12 10 2-2M9 17h6" />
  </StrokeIcon>
);

export const PylonIcon = ({ className }: IconProps) => (
  <StrokeIcon className={className}>
    <path d="M12 2 7 22M12 2l5 20M5 7h14M7 7l5 5 5-5M8.6 15h6.8M6 22h12" />
  </StrokeIcon>
);

export const HubIcon = ({ className }: IconProps) => (
  <StrokeIcon className={className}>
    <circle cx="12" cy="12" r="2.6" />
    <circle cx="4.8" cy="5.8" r="2" />
    <circle cx="19.2" cy="5.8" r="2" />
    <circle cx="12" cy="20.2" r="2" />
    <path d="m10 10.3-3.7-3.2M14 10.3l3.7-3.2M12 14.6v3.6" />
  </StrokeIcon>
);

export const BuildingsIcon = ({ className }: IconProps) => (
  <StrokeIcon className={className}>
    <path d="M3 21h18M5 21V10h5v11M10 21V4h9v17" />
    <path d="M13 8h3M13 11.5h3M13 15h3M7 13.5h1M7 17h1" />
  </StrokeIcon>
);

export const BankIcon = ({ className }: IconProps) => (
  <StrokeIcon className={className}>
    <path d="M3 9.5 12 4l9 5.5H3z" />
    <path d="M5.5 10v8M10 10v8M14 10v8M18.5 10v8M3 20.5h18" />
  </StrokeIcon>
);

export const EuroIcon = ({ className }: IconProps) => (
  <StrokeIcon className={className}>
    <path d="M17.5 7.2a6 6 0 1 0 0 9.6" />
    <path d="M5 10.5h8M5 13.5h8" />
  </StrokeIcon>
);

export const ParkingIcon = ({ className }: IconProps) => (
  <StrokeIcon className={className}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
    <path d="M9.5 16.5v-9h3.5a2.8 2.8 0 0 1 0 5.6H9.5" />
  </StrokeIcon>
);

export const CarportIcon = ({ className }: IconProps) => (
  <StrokeIcon className={className}>
    <path d="M2.5 8.5 21.5 4.5v2.2l-19 4z" />
    <path d="M5 10.3V21M19 7.2V21" />
    <path d="M8.5 20.5v-2.8l1.4-2.7h4.2l1.4 2.7v2.8z" />
  </StrokeIcon>
);

export const BoltIcon = ({ className }: IconProps) => (
  <StrokeIcon className={className}>
    <path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12L13 2z" />
  </StrokeIcon>
);
