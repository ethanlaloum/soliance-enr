import { KeyboardEvent, useId, useRef } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export type SegmentedOption<T extends string | number> = {
  value: T;
  label: string;
  hint?: string;
};

export type SegmentedTone = 'light' | 'dark';

type SegmentedControlProps<T extends string | number> = {
  labelId: string;
  value: T;
  options: SegmentedOption<T>[];
  onChange: (value: T) => void;
  tone?: SegmentedTone;
  describedBy?: string;
  wrapsOnMobile?: boolean;
  className?: string;
};

const toneClassNames: Record<SegmentedTone, { track: string; idle: string; selected: string; highlight: string; focus: string }> = {
  light: {
    track: 'bg-ivory ring-1 ring-sand-line',
    idle: 'text-slate-ink hover:text-night',
    selected: 'text-night',
    highlight: 'bg-white shadow-card ring-1 ring-solar/60',
    focus: 'focus-visible:outline-night',
  },
  dark: {
    track: 'bg-night-soft ring-1 ring-night-line',
    idle: 'text-slate-light hover:text-white',
    selected: 'text-night',
    highlight: 'bg-solar shadow-[0_0_18px_rgba(224,123,40,0.35)]',
    focus: 'focus-visible:outline-white',
  },
};

const highlightTransition = { type: 'spring', stiffness: 420, damping: 34 } as const;

export const SegmentedControl = <T extends string | number>({
  labelId,
  value,
  options,
  onChange,
  tone = 'light',
  describedBy,
  wrapsOnMobile = false,
  className,
}: SegmentedControlProps<T>) => {
  const highlightId = useId();
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const selectedIndex = options.findIndex((option) => option.value === value);
  const styles = toneClassNames[tone];

  const select = (index: number) => {
    const next = (index + options.length) % options.length;
    onChange(options[next].value);
    buttons.current[next]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const moves: Record<string, number> = {
      ArrowRight: selectedIndex + 1,
      ArrowDown: selectedIndex + 1,
      ArrowLeft: selectedIndex - 1,
      ArrowUp: selectedIndex - 1,
      Home: 0,
      End: options.length - 1,
    };
    if (!(event.key in moves)) return;
    event.preventDefault();
    select(moves[event.key]);
  };

  return (
    <div
      role="radiogroup"
      aria-labelledby={labelId}
      aria-describedby={describedBy}
      onKeyDown={handleKeyDown}
      className={cn(
        'grid gap-1 rounded-xl p-1 text-sm',
        wrapsOnMobile ? 'grid-cols-3 sm:auto-cols-fr sm:grid-flow-col sm:grid-cols-none' : 'auto-cols-fr grid-flow-col',
        styles.track,
        className,
      )}
    >
      {options.map((option, index) => {
        const isSelected = option.value === value;
        return (
          <button
            key={String(option.value)}
            ref={(button) => {
              buttons.current[index] = button;
            }}
            type="button"
            role="radio"
            aria-checked={isSelected}
            tabIndex={isSelected || (selectedIndex === -1 && index === 0) ? 0 : -1}
            onClick={() => onChange(option.value)}
            className={cn(
              'relative isolate flex min-h-11 min-w-0 flex-col items-center justify-center rounded-lg px-1.5 py-1.5 text-center font-semibold leading-tight outline-none transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none',
              styles.focus,
              isSelected ? styles.selected : styles.idle,
            )}
          >
            {isSelected && <motion.span layoutId={highlightId} aria-hidden="true" className={cn('absolute inset-0 -z-10 rounded-lg', styles.highlight)} transition={highlightTransition} />}
            <span className="max-w-full break-words [hyphens:auto]">{option.label}</span>
            {option.hint && <span className="mt-0.5 text-[11px] font-medium">{option.hint}</span>}
          </button>
        );
      })}
    </div>
  );
};
