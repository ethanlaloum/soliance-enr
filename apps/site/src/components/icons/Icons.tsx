type IconProps = { className?: string };

export const CheckIcon = ({ className }: IconProps) => (
  <svg aria-hidden="true" className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export const PhoneIcon = ({ className }: IconProps) => (
  <svg aria-hidden="true" className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.6a2 2 0 0 1-.5 2.1L8 9.7a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.8.3 1.7.5 2.6.7a2 2 0 0 1 1.7 2z" />
  </svg>
);

export const MenuIcon = ({ className }: IconProps) => (
  <svg aria-hidden="true" className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="5" x2="17" y2="5" />
    <line x1="3" y1="10" x2="17" y2="10" />
    <line x1="3" y1="15" x2="17" y2="15" />
  </svg>
);

export const CloseIcon = ({ className }: IconProps) => (
  <svg aria-hidden="true" className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="4" y1="4" x2="16" y2="16" />
    <line x1="16" y1="4" x2="4" y2="16" />
  </svg>
);

export const DiamondPattern = () => (
  <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.08]">
    <defs>
      <pattern id="hero-diamonds" width="36" height="36" patternUnits="userSpaceOnUse">
        <path d="M18 5 L31 18 L18 31 L5 18 Z" fill="none" stroke="#E07B28" strokeWidth="1.3" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#hero-diamonds)" />
  </svg>
);
