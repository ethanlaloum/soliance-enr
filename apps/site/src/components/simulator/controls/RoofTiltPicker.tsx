import { KeyboardEvent, useId, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { RoofTilt, roofTilts, solarEstimateParameters } from '@/app/simulator/domain/entities/SolarEstimate';
import { simulatorHintClassName } from '@/components/simulator/simulatorStyles';

type RoofProfileProps = {
  degrees: number;
  isSelected: boolean;
};

const baseY = 52;
const leftEave = 12;
const rightEave = 88;
const ridgeX = 50;

const RoofProfile = ({ degrees, isSelected }: RoofProfileProps) => {
  const rise = (ridgeX - leftEave) * Math.tan((degrees * Math.PI) / 180);
  const ridgeY = baseY - rise;
  const panelStart = 0.32;
  const panelEnd = 0.78;
  const along = (share: number) => ({ x: rightEave + (ridgeX - rightEave) * share, y: baseY - rise * share });
  const arcRadius = 14;
  const arcEnd = { x: leftEave + arcRadius * Math.cos((degrees * Math.PI) / 180), y: baseY - arcRadius * Math.sin((degrees * Math.PI) / 180) };

  return (
    <svg viewBox="0 0 100 72" aria-hidden="true" className="h-14 w-full">
      <rect x="20" y={baseY} width="60" height="15" rx="1.5" className="fill-ivory stroke-sand-border" strokeWidth="1.5" />
      <polyline
        points={`${leftEave},${baseY} ${ridgeX},${ridgeY} ${rightEave},${baseY}`}
        fill="none"
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
        className={cn('transition-colors duration-300 motion-reduce:transition-none', isSelected ? 'stroke-solar' : 'stroke-night')}
      />
      <line
        x1={along(panelStart).x}
        y1={along(panelStart).y - 2.6}
        x2={along(panelEnd).x}
        y2={along(panelEnd).y - 2.6}
        strokeWidth="3.4"
        strokeLinecap="round"
        className={cn('transition-colors duration-300 motion-reduce:transition-none', isSelected ? 'stroke-solar-dark' : 'stroke-slate-mist')}
      />
      <path d={`M ${leftEave + arcRadius} ${baseY} A ${arcRadius} ${arcRadius} 0 0 0 ${arcEnd.x} ${arcEnd.y}`} fill="none" strokeWidth="1.2" className="stroke-slate" />
    </svg>
  );
};

type RoofTiltPickerProps = {
  value: RoofTilt;
  onChange: (tilt: RoofTilt) => void;
};

const highlightTransition = { type: 'spring', stiffness: 420, damping: 34 } as const;

export const RoofTiltPicker = ({ value, onChange }: RoofTiltPickerProps) => {
  const { t } = useTranslation('simulator');
  const labelId = useId();
  const hintId = useId();
  const highlightId = useId();
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const selectedIndex = roofTilts.indexOf(value);

  const select = (index: number) => {
    const next = (index + roofTilts.length) % roofTilts.length;
    onChange(roofTilts[next]);
    buttons.current[next]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const moves: Record<string, number> = {
      ArrowRight: selectedIndex + 1,
      ArrowDown: selectedIndex + 1,
      ArrowLeft: selectedIndex - 1,
      ArrowUp: selectedIndex - 1,
      Home: 0,
      End: roofTilts.length - 1,
    };
    if (!(event.key in moves)) return;
    event.preventDefault();
    select(moves[event.key]);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <span id={labelId} className="text-[13px] font-semibold text-night sm:text-sm">
        {t('controls.roofTilt.label')}
      </span>
      <div role="radiogroup" aria-labelledby={labelId} aria-describedby={hintId} onKeyDown={handleKeyDown} className="grid grid-cols-3 gap-2">
        {roofTilts.map((tilt, index) => {
          const isSelected = tilt === value;
          const degrees = solarEstimateParameters.tiltDegrees[tilt];
          return (
            <button
              key={tilt}
              ref={(button) => {
                buttons.current[index] = button;
              }}
              type="button"
              role="radio"
              aria-checked={isSelected}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => onChange(tilt)}
              className={cn(
                'relative isolate flex min-w-0 flex-col items-center gap-1 rounded-xl border px-1.5 pb-2.5 pt-2 text-center outline-none transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-night motion-reduce:transition-none',
                isSelected ? 'border-transparent' : 'border-sand-border hover:border-solar/60',
              )}
            >
              {isSelected && (
                <motion.span
                  layoutId={highlightId}
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 rounded-xl bg-solar/5 ring-2 ring-solar"
                  transition={highlightTransition}
                />
              )}
              <RoofProfile degrees={degrees} isSelected={isSelected} />
              <span lang="fr" className="max-w-full break-words text-[11px] font-semibold leading-tight text-night [hyphens:auto] sm:text-[13px]">
                {t(`controls.roofTilt.options.${tilt}`)}
              </span>
              <span className="text-xs text-slate-ink">{t('controls.roofTilt.degrees', { value: degrees })}</span>
            </button>
          );
        })}
      </div>
      <p id={hintId} className={simulatorHintClassName}>
        {t('controls.roofTilt.hint')}
      </p>
    </div>
  );
};
