import { KeyboardEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { AddressSuggestion, addressLineOf } from '@/app/address/domain/entities/AddressSuggestion';
import { SimulatorAnswers, SimulatorFieldError } from '@/app/simulator/domain/entities/SimulatorWizard';
import { useAddressAutocomplete } from '@/hooks/useAddressAutocomplete';
import { fieldControlClassName, fieldErrorClassName, fieldLabelClassName } from '@/components/ui/fieldStyles';

type SimulatorAddressFieldProps = {
  value: string;
  error?: SimulatorFieldError;
  isRecap: boolean;
  onChange: (patch: Partial<SimulatorAnswers>) => void;
};

const id = 'simulator-address';
const listboxId = `${id}-suggestions`;
const errorId = `${id}-error`;
const optionId = (index: number) => `${id}-option-${index}`;

export const SimulatorAddressField = ({ value, error, isRecap, onChange }: SimulatorAddressFieldProps) => {
  const { t } = useTranslation('simulator');
  const { suggestions, search, clear } = useAddressAutocomplete();
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const isExpanded = isOpen && suggestions.length > 0;
  const activeOption = isExpanded && activeIndex < suggestions.length ? activeIndex : -1;

  const close = () => {
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const type = (address: string) => {
    onChange({ address, location: null, city: null });
    setIsOpen(true);
    setActiveIndex(-1);
    search(address);
  };

  const pick = (suggestion: AddressSuggestion) => {
    onChange({ address: addressLineOf(suggestion), postalCode: suggestion.postalCode, location: suggestion.location, city: suggestion.city });
    close();
    clear();
  };

  const move = (offset: number) => {
    const start = activeOption === -1 && offset < 0 ? 0 : activeOption;
    setIsOpen(true);
    setActiveIndex((start + offset + suggestions.length) % suggestions.length);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && suggestions.length > 0) {
      event.preventDefault();
      move(event.key === 'ArrowDown' ? 1 : -1);
    } else if (event.key === 'Enter' && activeOption >= 0) {
      event.preventDefault();
      pick(suggestions[activeOption]);
    } else if (event.key === 'Escape' && isExpanded) {
      event.preventDefault();
      close();
    }
  };

  return (
    <div className={fieldLabelClassName}>
      <label htmlFor={id}>{t('wizard.fields.address')}</label>
      <div className="relative">
        <input
          id={id}
          type="text"
          role="combobox"
          value={value}
          autoComplete="off"
          spellCheck={false}
          inputMode="text"
          placeholder={t('wizard.fields.addressPlaceholder')}
          aria-autocomplete="list"
          aria-expanded={isExpanded}
          aria-controls={listboxId}
          aria-activedescendant={activeOption >= 0 ? optionId(activeOption) : undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(fieldControlClassName, 'w-full', isRecap && 'bg-ivory')}
          onChange={(event) => type(event.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          onBlur={close}
        />
        <ul
          id={listboxId}
          role="listbox"
          aria-label={t('wizard.addressSuggestions.label')}
          hidden={!isExpanded}
          className="absolute inset-x-0 top-full z-20 mt-1 overflow-hidden rounded-lg border border-sand-border bg-white py-1 font-normal shadow-lg"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion.id}
              id={optionId(index)}
              role="option"
              aria-selected={index === activeOption}
              className={cn('cursor-pointer px-3.5 py-2.5', index === activeOption ? 'bg-solar/10' : 'hover:bg-ivory')}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => pick(suggestion)}
            >
              <span className="block text-[15px] font-medium text-night">{suggestion.name}</span>
              <span className="block text-[13px] text-slate-ink">
                {suggestion.postalCode} {suggestion.city}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <p role="status" className="sr-only">
        {isExpanded ? t('wizard.addressSuggestions.count', { count: suggestions.length }) : ''}
      </p>
      {error && (
        <p id={errorId} className={fieldErrorClassName}>
          {t(`wizard.errors.${error}`)}
        </p>
      )}
    </div>
  );
};
