import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { HomeDesignId, homeDesigns } from '@/components/home/designs/homeDesigns';

type DesignSwitcherProps = {
  current: HomeDesignId;
  onChange: (id: HomeDesignId) => void;
};

export const DesignSwitcher = ({ current, onChange }: DesignSwitcherProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const active = homeDesigns.find((design) => design.id === current) ?? homeDesigns[0];

  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={rootRef} data-design-switcher data-lenis-prevent className="fixed bottom-4 left-4 z-50 font-sans lg:bottom-6 lg:left-6">
      {isOpen && (
        <ul role="listbox" aria-label="Design de la page d'accueil" className="mb-2 w-56 overflow-hidden rounded-2xl border border-white/10 bg-night/95 p-1.5 text-white shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-md">
          {homeDesigns.map((design, index) => (
            <li key={design.id} role="option" aria-selected={design.id === current}>
              <button
                type="button"
                onClick={() => {
                  onChange(design.id);
                  setIsOpen(false);
                }}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors hover:bg-white/10',
                  design.id === current && 'bg-white/10',
                )}
              >
                <span aria-hidden="true" className="flex shrink-0 overflow-hidden rounded-full border border-white/20">
                  {design.swatches.map((swatch) => (
                    <span key={swatch} className="block h-5 w-2.5" style={{ backgroundColor: swatch }} />
                  ))}
                </span>
                <span className="flex-1">{design.label}</span>
                <span aria-hidden="true" className="text-xs text-slate-light">
                  {index === 0 ? 'actuel' : `0${index}`}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onClick={() => setIsOpen((open) => !open)}
        className="flex h-12 items-center gap-3 rounded-full border border-white/15 bg-night/95 pl-2 pr-5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(0,0,0,0.3)] backdrop-blur-md transition-colors hover:border-solar focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-solar"
      >
        <span aria-hidden="true" className="flex overflow-hidden rounded-full border border-white/20">
          {active.swatches.map((swatch) => (
            <span key={swatch} className="block h-8 w-4" style={{ backgroundColor: swatch }} />
          ))}
        </span>
        Design : {active.label}
      </button>
    </div>
  );
};
