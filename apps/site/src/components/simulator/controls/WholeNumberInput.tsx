import { useState } from 'react';
import { cn } from '@/lib/utils';
import { fieldControlClassName } from '@/components/ui/fieldStyles';

type WholeNumberInputProps = {
  id: string;
  value: number;
  min: number;
  label: string;
  describedBy?: string;
  className?: string;
  onChange: (value: number) => void;
};

const wholeNumberPattern = /^\d+$/;

const typedNumberOf = (text: string): number | null => {
  const trimmed = text.replace(/[\s\u202f\u00a0]/g, '');
  return wholeNumberPattern.test(trimmed) ? Number(trimmed) : null;
};

export const WholeNumberInput = ({ id, value, min, label, describedBy, className, onChange }: WholeNumberInputProps) => {
  const [draft, setDraft] = useState<string | null>(null);

  const type = (text: string) => {
    setDraft(text);
    const typed = typedNumberOf(text);
    if (typed !== null && typed >= min) onChange(typed);
  };

  const commit = () => {
    const typed = draft === null ? null : typedNumberOf(draft);
    if (typed !== null && typed < min) onChange(min);
    setDraft(null);
  };

  return (
    <input
      id={id}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      value={draft ?? String(value)}
      aria-label={label}
      aria-describedby={describedBy}
      className={cn(fieldControlClassName, 'mb-0.5 h-11 w-[88px] shrink-0 px-2 text-center font-semibold sm:h-11', className)}
      onChange={(event) => type(event.target.value)}
      onBlur={commit}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          commit();
        }
      }}
    />
  );
};
