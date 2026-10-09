type EnergyGlyphProps = {
  kind: 'solar' | 'heatPump' | 'evCharger' | 'battery';
  className?: string;
};

export const EnergyGlyph = ({ kind, className }: EnergyGlyphProps) => (
  <svg aria-hidden="true" viewBox="0 0 48 48" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {kind === 'solar' && <><circle cx="24" cy="24" r="9" /><path d="M24 4v5m0 30v5M4 24h5m30 0h5M10 10l4 4m20 20 4 4M10 38l4-4m20-20 4-4" /></>}
    {kind === 'heatPump' && <><rect x="6" y="8" width="36" height="32" rx="5" /><circle cx="24" cy="24" r="11" /><circle cx="24" cy="24" r="2" /><path d="M24 22c-8-10 7-12 4-4l-3 5m1 2c13-2 8 12 2 6l-4-5m-2-1c-5 12-15 1-6-2l6 1" /></>}
    {kind === 'evCharger' && <><path d="m10 25 4-11h20l4 11M7 25h34v12H7zM10 37v4m28-4v4M12 30h5m14 0h5M20 5l-3 6h7l-3 6" /><path d="M8 24 5 22m35 2 3-2" /></>}
    {kind === 'battery' && <><rect x="12" y="7" width="24" height="35" rx="5" /><path d="M20 7V3h8v4m-9 27h10m-10-6h10m-10-6h10m-10-6h10" /></>}
  </svg>
);
