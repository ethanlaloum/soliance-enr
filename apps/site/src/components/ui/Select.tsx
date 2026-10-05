import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type Ref } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import './select.css';

type SelectOption = { value: string; label: string; disabled?: boolean };

type HorizonSelectProps = {
  id: string;
  name?: string;
  value: string;
  onValueChange: (value: string) => void;
  onBlur?: () => void;
  options: SelectOption[];
  className?: string;
  disabled?: boolean;
  'aria-invalid'?: boolean | 'true' | 'false';
  'aria-describedby'?: string;
  ref?: Ref<HTMLButtonElement>;
};

const normalizeSearch = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase();

export const HorizonSelect = ({ id, name, value, onValueChange, onBlur, options, className, disabled = false, ref, ...aria }: HorizonSelectProps) => {
  const listId = useId();
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const searchRef = useRef({ query: '', time: 0 });
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [position, setPosition] = useState<CSSProperties>({ visibility: 'hidden' });
  const selectedIndex = options.findIndex((option) => option.value === value);
  const enabledIndexes = options.flatMap((option, index) => option.disabled ? [] : [index]);
  const open = isOpen && !disabled && enabledIndexes.length > 0;
  const activeOptionId = activeIndex >= 0 && options[activeIndex] && !options[activeIndex].disabled ? `${listId}-${activeIndex}` : undefined;

  const close = () => {
    setIsOpen(false);
    searchRef.current = { query: '', time: 0 };
  };

  const show = (edge?: 'first' | 'last') => {
    if (disabled || enabledIndexes.length === 0) return;
    const initial = edge === 'last' ? enabledIndexes.at(-1)! : edge === 'first' ? enabledIndexes[0] : enabledIndexes.includes(selectedIndex) ? selectedIndex : enabledIndexes[0];
    setActiveIndex(initial);
    setPosition({ visibility: 'hidden' });
    setIsOpen(true);
  };

  const choose = (index: number) => {
    const option = options[index];
    if (!option || option.disabled) return;
    onValueChange(option.value);
    close();
    triggerRef.current?.focus({ preventScroll: true });
  };

  useLayoutEffect(() => {
    if (!open) return;
    const updatePosition = () => {
      const trigger = triggerRef.current;
      const list = listRef.current;
      if (!trigger || !list) return;
      const rect = trigger.getBoundingClientRect();
      const viewport = window.visualViewport;
      const viewportLeft = viewport?.offsetLeft ?? 0;
      const viewportTop = viewport?.offsetTop ?? 0;
      const viewportWidth = viewport?.width ?? window.innerWidth;
      const viewportHeight = viewport?.height ?? window.innerHeight;
      const margin = 12;
      const gap = 8;
      const below = viewportTop + viewportHeight - rect.bottom - margin - gap;
      const above = rect.top - viewportTop - margin - gap;
      const naturalHeight = Math.min(280, list.scrollHeight + 2);
      const placeAbove = below < naturalHeight && above > below;
      const maxHeight = Math.max(0, Math.min(280, placeAbove ? above : below));
      const width = Math.min(Math.max(rect.width, 220), Math.max(0, viewportWidth - margin * 2));
      const left = Math.max(viewportLeft + margin, Math.min(rect.left, viewportLeft + viewportWidth - width - margin));
      const top = placeAbove ? Math.max(viewportTop + margin, rect.top - gap - Math.min(naturalHeight, maxHeight)) : rect.bottom + gap;
      setPosition({ position: 'fixed', left, top, width, maxHeight });
    };
    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    window.visualViewport?.addEventListener('resize', updatePosition);
    window.visualViewport?.addEventListener('scroll', updatePosition);
    const resizeObserver = new ResizeObserver(updatePosition);
    if (triggerRef.current) resizeObserver.observe(triggerRef.current);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
      window.visualViewport?.removeEventListener('resize', updatePosition);
      window.visualViewport?.removeEventListener('scroll', updatePosition);
      resizeObserver.disconnect();
    };
  }, [open, options.length]);

  useEffect(() => {
    if (!open) return;
    const dismiss = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Node && !triggerRef.current?.contains(target) && !listRef.current?.contains(target)) {
        setIsOpen(false);
        searchRef.current = { query: '', time: 0 };
      }
    };
    document.addEventListener('pointerdown', dismiss, true);
    return () => document.removeEventListener('pointerdown', dismiss, true);
  }, [open]);

  useLayoutEffect(() => {
    if (!open || !activeOptionId) return;
    const list = listRef.current;
    const option = document.getElementById(activeOptionId);
    if (!list || !option) return;
    if (option.offsetTop < list.scrollTop) list.scrollTop = option.offsetTop;
    else if (option.offsetTop + option.offsetHeight > list.scrollTop + list.clientHeight) {
      list.scrollTop = option.offsetTop + option.offsetHeight - list.clientHeight;
    }
  }, [open, activeOptionId, position.width, position.maxHeight]);

  useEffect(() => {
    if (disabled || enabledIndexes.length === 0) setIsOpen(false);
  }, [disabled, enabledIndexes.length]);

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled || event.altKey || event.ctrlKey || event.metaKey || event.nativeEvent.isComposing) return;
    if (event.key === 'Tab') {
      close();
      return;
    }
    if (event.key === 'Escape') {
      if (open) { event.preventDefault(); event.stopPropagation(); close(); }
      return;
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!open) { show(event.key === 'ArrowUp' && selectedIndex < 0 ? 'last' : undefined); return; }
      const current = enabledIndexes.indexOf(activeIndex);
      const next = (current + (event.key === 'ArrowDown' ? 1 : -1) + enabledIndexes.length) % enabledIndexes.length;
      setActiveIndex(enabledIndexes[next]);
      return;
    }
    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      if (!open) show(event.key === 'Home' ? 'first' : 'last');
      else setActiveIndex(event.key === 'Home' ? enabledIndexes[0] : enabledIndexes.at(-1)!);
      return;
    }
    if (event.key === 'Enter' || (event.key === ' ' && (!searchRef.current.query || Date.now() - searchRef.current.time > 700))) {
      event.preventDefault();
      if (open) choose(activeIndex); else show();
      return;
    }
    if (event.key.length === 1) {
      event.preventDefault();
      const now = Date.now();
      const query = normalizeSearch((now - searchRef.current.time > 700 ? '' : searchRef.current.query) + event.key);
      searchRef.current = { query, time: now };
      const repeated = query.split('').every((character) => character === query[0]);
      const term = repeated ? query[0] : query;
      const start = open ? activeIndex : selectedIndex;
      const candidates = [...enabledIndexes.filter((index) => index > start), ...enabledIndexes.filter((index) => index <= start)];
      const match = !repeated && open && normalizeSearch(options[activeIndex]?.label ?? '').startsWith(term)
        ? activeIndex
        : candidates.find((index) => normalizeSearch(options[index].label).startsWith(term));
      if (!open) show();
      if (match !== undefined) setActiveIndex(match);
    }
  };

  return (
    <>
      {name && <input type="hidden" name={name} value={value} disabled={disabled} />}
      <button
        {...aria}
        ref={(element) => {
          triggerRef.current = element;
          if (typeof ref === 'function') return ref(element);
          if (ref) ref.current = element;
        }}
        type="button"
        id={id}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-activedescendant={open ? activeOptionId : undefined}
        disabled={disabled}
        className={cn('hz-select-trigger', className)}
        onClick={() => open ? close() : show()}
        onKeyDown={onKeyDown}
        onBlur={() => { close(); onBlur?.(); }}
      >
        <span className="hz-select-value">{options[selectedIndex]?.label ?? ''}</span>
        <svg className="hz-select-chevron" aria-hidden="true" width="16" height="16" viewBox="0 0 20 20" fill="none">
          <path d="m5 8 5 5 5-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && createPortal(
        <ul id={listId} ref={listRef} role="listbox" aria-labelledby={id} className="hz-select-list" style={position} data-lenis-prevent>
          {options.map((option, index) => (
            <li
              key={option.value}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={option.value === value}
              aria-disabled={option.disabled || undefined}
              data-active={index === activeIndex || undefined}
              className="hz-select-option"
              onPointerDown={(event) => event.preventDefault()}
              onPointerMove={(event) => { if (event.pointerType === 'mouse' && !option.disabled) setActiveIndex(index); }}
              onClick={() => choose(index)}
            >
              <span>{option.label}</span>
              {option.value === value && <svg aria-hidden="true" width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="m4 10 4 4 8-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
            </li>
          ))}
        </ul>, document.body,
      )}
    </>
  );
};
