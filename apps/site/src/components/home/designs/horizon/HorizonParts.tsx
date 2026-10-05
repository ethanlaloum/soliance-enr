import type { ReactNode } from 'react';

export const HorizonArrow = ({ diagonal = false }: { diagonal?: boolean }) => (
  <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" className="hz-arrow">
    <path d={diagonal ? 'M5 19 19 5M5 5h14v14' : 'M4 12h15m-6-6 6 6-6 6'} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const HorizonSun = ({ className = '' }: { className?: string }) => (
  <svg aria-hidden="true" viewBox="0 0 100 100" fill="none" className={className}>
    <circle cx="50" cy="50" r="18" stroke="currentColor" strokeWidth="1.8" />
    {Array.from({ length: 16 }, (_, index) => (
      <path key={index} d="M50 5v17" stroke="currentColor" strokeWidth="1.8" transform={`rotate(${index * 22.5} 50 50)`} />
    ))}
  </svg>
);

export const HorizonLabel = ({ children }: { children: ReactNode }) => <p className="hz-label"><span aria-hidden="true" />{children}</p>;
