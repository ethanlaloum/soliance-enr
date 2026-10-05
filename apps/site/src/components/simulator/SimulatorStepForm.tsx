import { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import {
  daytimePresences,
  DaytimePresence,
  householdEquipments,
  RoofOrientation,
  roofOrientations,
  solarEstimateParameters,
} from '@/app/simulator/domain/entities/SolarEstimate';
import {
  RoofCovering,
  roofCoverings,
  SimulatorAnswers,
  SimulatorErrors,
  SimulatorStep,
  SimulatorValidatedField,
  toggleEquipment,
} from '@/app/simulator/domain/entities/SimulatorWizard';
import { HorizonSelect } from '@/components/ui/Select';
import { buttonVariants } from '@/components/ui/buttonVariants';
import { fieldControlClassName, fieldErrorClassName, fieldLabelClassName } from '@/components/ui/fieldStyles';
import {
  simulatorBackButtonClassName,
  simulatorCardClassName,
  simulatorHintClassName,
  simulatorStepTitleClassName,
  simulatorStepTitleId,
} from '@/components/simulator/simulatorStyles';

type SimulatorStepFormProps = {
  step: SimulatorStep;
  answers: SimulatorAnswers;
  errors: SimulatorErrors;
  onChange: (patch: Partial<SimulatorAnswers>) => void;
  onBack: () => void;
  onNext: () => void;
};

type TextFieldProps = {
  field: SimulatorValidatedField;
  value: string;
  errors: SimulatorErrors;
  autoComplete: string;
  inputMode: 'text' | 'numeric' | 'decimal';
  isRecap?: boolean;
  hasHint?: boolean;
  className?: string;
  onChange: (value: string) => void;
};

const fieldId = (field: string) => `simulator-${field}`;

const recapControlClassName = 'bg-ivory';

const TextField = ({ field, value, errors, autoComplete, inputMode, isRecap = false, hasHint = false, className, onChange }: TextFieldProps) => {
  const { t } = useTranslation('simulator');
  const error = errors[field];
  const id = fieldId(field);
  const describedBy = [hasHint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(' ') || undefined;
  const { min, max } = solarEstimateParameters.monthlyBillEur;

  return (
    <div className={cn(fieldLabelClassName, className)}>
      <label htmlFor={id}>{t(`wizard.fields.${field}`)}</label>
      <input
        id={id}
        type="text"
        value={value}
        autoComplete={autoComplete}
        inputMode={inputMode}
        placeholder={t(`wizard.fields.${field}Placeholder`)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(fieldControlClassName, isRecap && recapControlClassName)}
        onChange={(event) => onChange(event.target.value)}
      />
      {hasHint && (
        <p id={`${id}-hint`} className={simulatorHintClassName}>
          {t(`wizard.fields.${field}Hint`)}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className={fieldErrorClassName}>
          {t(`wizard.errors.${error}`, { min, max })}
        </p>
      )}
    </div>
  );
};

export const SimulatorStepForm = ({ step, answers, errors, onChange, onBack, onNext }: SimulatorStepFormProps) => {
  const { t } = useTranslation('simulator');
  const isAddressStep = step === SimulatorStep.ADDRESS;
  const isRoofStep = step === SimulatorStep.ROOF;
  const isConsumptionStep = step === SimulatorStep.CONSUMPTION;
  const roofArea = solarEstimateParameters.roofAreaM2;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onNext();
  };

  return (
    <form noValidate aria-labelledby={simulatorStepTitleId} onSubmit={handleSubmit} className={simulatorCardClassName}>
      <h2 id={simulatorStepTitleId} tabIndex={-1} className={simulatorStepTitleClassName}>
        {t(`wizard.titles.${step}`)}
      </h2>

      {isAddressStep && <p className="text-sm leading-normal text-slate-ink">{t('wizard.privacyHint')}</p>}

      <div className={cn('grid gap-3.5', isAddressStep ? 'sm:grid-cols-[minmax(0,1fr)_150px]' : 'hidden lg:grid')}>
        <TextField
          field="address"
          value={answers.address}
          errors={errors}
          autoComplete="street-address"
          inputMode="text"
          isRecap={!isAddressStep}
          onChange={(address) => onChange({ address })}
        />
        {isAddressStep && (
          <TextField
            field="postalCode"
            value={answers.postalCode}
            errors={errors}
            autoComplete="postal-code"
            inputMode="numeric"
            onChange={(postalCode) => onChange({ postalCode })}
          />
        )}
      </div>

      {(isRoofStep || isConsumptionStep) && (
        <div className={cn('grid gap-3.5 sm:grid-cols-2', isConsumptionStep && 'hidden lg:grid')}>
          <div className={fieldLabelClassName}>
            <div className="flex items-baseline justify-between gap-3">
              <label htmlFor={fieldId('roofArea')}>{t('wizard.fields.roofArea')}</label>
              <output htmlFor={fieldId('roofArea')} className="shrink-0 text-base font-bold text-night">
                {t('wizard.fields.roofAreaValue', { value: answers.roofAreaM2 })}
              </output>
            </div>
            <input
              id={fieldId('roofArea')}
              type="range"
              min={roofArea.min}
              max={roofArea.max}
              step={roofArea.step}
              value={answers.roofAreaM2}
              aria-valuetext={t('wizard.fields.roofAreaValue', { value: answers.roofAreaM2 })}
              aria-describedby={isRoofStep ? `${fieldId('roofArea')}-hint` : undefined}
              className="h-11 w-full cursor-pointer accent-solar"
              onChange={(event) => onChange({ roofAreaM2: Number(event.target.value) })}
            />
            {isRoofStep && (
              <p id={`${fieldId('roofArea')}-hint`} className={simulatorHintClassName}>
                {t('wizard.fields.roofAreaHint')}
              </p>
            )}
          </div>

          <div className={fieldLabelClassName}>
            <label htmlFor={fieldId('orientation')}>{t('wizard.fields.orientation')}</label>
            <HorizonSelect
              id={fieldId('orientation')}
              value={answers.orientation}
              className={cn(fieldControlClassName, 'px-3', isConsumptionStep && recapControlClassName)}
              onValueChange={(value) => onChange({ orientation: value as RoofOrientation })}
              options={roofOrientations.map((orientation) => ({ value: orientation, label: t(`wizard.orientations.${orientation}`) }))}
            />
          </div>
        </div>
      )}

      {isRoofStep && (
        <div className={fieldLabelClassName}>
          <label htmlFor={fieldId('roofCovering')}>{t('wizard.fields.roofCovering')}</label>
          <HorizonSelect
            id={fieldId('roofCovering')}
            value={answers.roofCovering}
            className={cn(fieldControlClassName, 'px-3')}
            onValueChange={(value) => onChange({ roofCovering: value as RoofCovering })}
            options={roofCoverings.map((covering) => ({ value: covering, label: t(`wizard.roofCoverings.${covering}`) }))}
          />
        </div>
      )}

      {isConsumptionStep && (
        <>
          <TextField
            field="monthlyBill"
            value={answers.monthlyBill}
            errors={errors}
            autoComplete="off"
            inputMode="decimal"
            hasHint
            onChange={(monthlyBill) => onChange({ monthlyBill })}
          />

          <fieldset>
            <legend className="mb-2 text-[13px] font-semibold sm:text-sm">{t('wizard.fields.equipment')}</legend>
            <div className="flex flex-wrap gap-2">
              {householdEquipments.map((item) => {
                const id = fieldId(`equipment-${item}`);
                return (
                  <label
                    key={item}
                    htmlFor={id}
                    className="flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border border-sand-border px-3.5 py-2.5 text-sm font-medium transition-colors hover:border-solar has-[:checked]:border-solar has-[:checked]:bg-solar/5 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-solar/30 motion-reduce:transition-none"
                  >
                    <input
                      id={id}
                      type="checkbox"
                      checked={answers.equipment.includes(item)}
                      className="h-[18px] w-[18px] shrink-0 accent-solar"
                      onChange={() => onChange({ equipment: toggleEquipment(answers.equipment, item) })}
                    />
                    {t(`wizard.equipments.${item}`)}
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className={fieldLabelClassName}>
            <label htmlFor={fieldId('daytimePresence')}>{t('wizard.fields.daytimePresence')}</label>
            <HorizonSelect
              id={fieldId('daytimePresence')}
              value={answers.daytimePresence}
              className={cn(fieldControlClassName, 'px-3')}
              onValueChange={(value) => onChange({ daytimePresence: value as DaytimePresence })}
              options={daytimePresences.map((presence) => ({ value: presence, label: t(`wizard.presences.${presence}`) }))}
            />
          </div>
        </>
      )}

      <div className="mt-1.5 flex gap-3">
        {!isAddressStep && (
          <button type="button" onClick={onBack} className={simulatorBackButtonClassName}>
            {t('wizard.back')}
          </button>
        )}
        <button
          type="submit"
          className={cn(buttonVariants({ size: 'md' }), 'min-w-0 flex-1 whitespace-normal px-4 text-base lg:px-[26px] lg:text-[17px]')}
        >
          {isConsumptionStep ? t('wizard.seeEstimate') : t('wizard.next')}
        </button>
      </div>
    </form>
  );
};
