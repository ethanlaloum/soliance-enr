import { CSSProperties, KeyboardEvent, Ref, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

export type SelectOption<T extends string> = {
  value: T;
  label: string;
};

export type SelectTone = 'solar' | 'care';

type SelectProps<T extends string> = {
  id: string;
  labelId: string;
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  onBlur?: () => void;
  name?: string;
  tone?: SelectTone;
  className?: string;
  listClassName?: string;
  ref?: Ref<HTMLButtonElement>;
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
};

const toneClassNames: Record<SelectTone, { active: string; selected: string }> = {
  solar: { active: 'bg-solar/10', selected: 'text-solar-dark' },
  care: { active: 'bg-care/10', selected: 'text-care' },
};

const pageJump = 10;
const typeAheadResetMs = 500;
const preferredListHeightPx = 288;
const listGapPx = 6;

const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();

const clampIndex = (index: number, length: number) => Math.min(Math.max(index, 0), length - 1);

const listPositionBelowOrAbove = (anchor: HTMLElement | null): CSSProperties => {
  if (!anchor) return {};
  const rect = anchor.getBoundingClientRect();
  const spaceBelow = window.innerHeight - rect.bottom;
  const opensUpward = spaceBelow < preferredListHeightPx && rect.top > spaceBelow;
  return {
    left: rect.left,
    minWidth: rect.width,
    maxHeight: Math.min(preferredListHeightPx, (opensUpward ? rect.top : spaceBelow) - listGapPx * 2),
    ...(opensUpward ? { bottom: window.innerHeight - rect.top + listGapPx } : { top: rect.bottom + listGapPx }),
  };
};

const keepOptionVisible = (list: HTMLUListElement | null, index: number) => {
  const option = list?.children[index];
  if (!list || !(option instanceof HTMLElement)) return;
  if (option.offsetTop < list.scrollTop) {
    list.scrollTop = option.offsetTop - list.clientTop;
  } else if (option.offsetTop + option.offsetHeight > list.scrollTop + list.clientHeight) {
    list.scrollTop = option.offsetTop + option.offsetHeight - list.clientHeight;
  }
};

const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 20 20"
    className={cn('h-5 w-5 shrink-0 opacity-60 transition-transform duration-200 motion-reduce:transition-none', isOpen && 'rotate-180')}
  >
    <path d="M5.5 7.75 10 12.25l4.5-4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 20 20" className="h-[18px] w-[18px] shrink-0">
    <path d="m4.75 10.5 3.5 3.5 7-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Select = <T extends string>({
  id,
  labelId,
  value,
  options,
  onChange,
  onBlur,
  name,
  tone = 'solar',
  className,
  listClassName,
  ref,
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedBy,
}: SelectProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [position, setPosition] = useState<CSSProperties>({});
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typeAhead = useRef({ text: '', at: 0 });
  const listboxId = `${id}-listbox`;
  const optionId = (index: number) => `${id}-option-${index}`;
  const selectedIndex = options.findIndex((option) => option.value === value);
  const selected = options[selectedIndex];
  const toneClassName = toneClassNames[tone];

  useEffect(() => {
    if (isOpen) keepOptionVisible(listRef.current, activeIndex);
  }, [isOpen, activeIndex]);

  useEffect(() => {
    if (!isOpen) return;
    const place = () => setPosition(listPositionBelowOrAbove(wrapperRef.current));
    window.addEventListener('scroll', place, true);
    window.addEventListener('resize', place);
    return () => {
      window.removeEventListener('scroll', place, true);
      window.removeEventListener('resize', place);
    };
  }, [isOpen]);

  const open = (index = selectedIndex) => {
    setPosition(listPositionBelowOrAbove(wrapperRef.current));
    setActiveIndex(clampIndex(index, options.length));
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const choose = (index: number) => {
    const option = options[index];
    if (option && option.value !== value) onChange(option.value);
    close();
  };

  const matchTypeAhead = (character: string): number => {
    const now = Date.now();
    const sameRun = now - typeAhead.current.at < typeAheadResetMs;
    typeAhead.current = { text: (sameRun ? typeAhead.current.text : '') + normalize(character), at: now };
    const { text } = typeAhead.current;
    const start = isOpen ? activeIndex : selectedIndex;
    const ordered = options.map((_, offset) => (start + (text.length === 1 ? 1 : 0) + offset + options.length) % options.length);
    return ordered.find((index) => normalize(options[index].label).startsWith(text)) ?? -1;
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const { key, altKey } = event;

    if (!isOpen) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(key)) {
        event.preventDefault();
        open();
      } else if (key === 'Home' || key === 'End') {
        event.preventDefault();
        open(key === 'Home' ? 0 : options.length - 1);
      } else if (key.length === 1 && !event.ctrlKey && !event.metaKey && !altKey) {
        const match = matchTypeAhead(key);
        if (match >= 0) open(match);
      }
      return;
    }

    const moves: Record<string, number> = {
      ArrowDown: activeIndex + 1,
      ArrowUp: activeIndex - 1,
      Home: 0,
      End: options.length - 1,
      PageDown: activeIndex + pageJump,
      PageUp: activeIndex - pageJump,
    };

    if (key === 'ArrowUp' && altKey) {
      event.preventDefault();
      choose(activeIndex);
    } else if (key in moves) {
      event.preventDefault();
      setActiveIndex(clampIndex(moves[key], options.length));
    } else if (key === 'Enter' || key === ' ') {
      event.preventDefault();
      choose(activeIndex);
    } else if (key === 'Escape') {
      event.preventDefault();
      close();
    } else if (key === 'Tab') {
      choose(activeIndex);
    } else if (key.length === 1 && !event.ctrlKey && !event.metaKey) {
      const match = matchTypeAhead(key);
      if (match >= 0) setActiveIndex(match);
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <button
        ref={ref}
        id={id}
        type="button"
        name={name}
        value={value}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-activedescendant={isOpen && activeIndex >= 0 ? optionId(activeIndex) : undefined}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedBy}
        className={cn('flex w-full cursor-pointer items-center justify-between gap-2 text-left', className)}
        onClick={() => (isOpen ? close() : open())}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          close();
          onBlur?.();
        }}
      >
        <span className="truncate">{selected?.label}</span>
        <ChevronIcon isOpen={isOpen} />
      </button>
      {isOpen &&
        createPortal(
          <ul
            ref={listRef}
            id={listboxId}
            role="listbox"
            aria-labelledby={labelId}
            tabIndex={-1}
            style={position}
            className={cn(
              'fixed z-[60] overflow-y-auto overscroll-contain rounded-xl border border-sand-line bg-white p-1.5 font-sans text-[15px] font-normal text-night shadow-lift motion-safe:animate-fade-in motion-safe:[animation-duration:150ms]',
              listClassName,
            )}
            onMouseDown={(event) => event.preventDefault()}
          >
            {options.map((option, index) => {
              const isSelected = index === selectedIndex;
              return (
                <li
                  key={option.value}
                  id={optionId(index)}
                  role="option"
                  aria-selected={isSelected}
                  className={cn(
                    'flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 leading-snug',
                    index === activeIndex && toneClassName.active,
                    isSelected && cn('font-semibold', toneClassName.selected),
                  )}
                  onMouseMove={() => index !== activeIndex && setActiveIndex(index)}
                  onClick={() => choose(index)}
                >
                  {option.label}
                  {isSelected && <CheckIcon />}
                </li>
              );
            })}
          </ul>,
          document.body,
        )}
    </div>
  );
};
