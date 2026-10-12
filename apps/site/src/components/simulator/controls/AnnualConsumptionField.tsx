import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { annualConsumptionRangeKwh, SimulatorFieldError } from '@/app/simulator/domain/entities/SimulatorWizard';
import { simulatorHintClassName } from '@/components/simulator/simulatorStyles';
import { fieldControlClassName, fieldErrorClassName } from '@/components/ui/fieldStyles';

type AnnualConsumptionFieldProps = {
  inputId: string;
  value: string | null;
  error?: SimulatorFieldError;
  estimatedKwh: number;
  isEstimatedFromBill: boolean;
  onChange: (value: string | null) => void;
};

export const AnnualConsumptionField = ({ inputId, value, error, estimatedKwh, isEstimatedFromBill, onChange }: AnnualConsumptionFieldProps) => {
  const { t } = useTranslation('simulator');
  const checkboxId = useId();
  const errorId = `${inputId}-error`;
  const isOpen = value !== null;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={checkboxId} className="flex min-h-11 cursor-pointer items-center gap-2.5 text-sm font-medium text-night">
        <input
          id={checkboxId}
          type="checkbox"
          checked={isOpen}
          className="h-[18px] w-[18px] shrink-0 accent-solar"
          onChange={(event) => onChange(event.target.checked ? '' : null)}
        />
        {t('controls.annualConsumption.toggle')}
      </label>
      <AnimatePresence initial={false} mode="popLayout">
        {isOpen ? (
          <motion.div
            key="annual-input"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="-m-1 overflow-hidden p-1"
          >
            <div className="flex flex-col gap-1.5">
              <label htmlFor={inputId} className="text-[13px] font-semibold text-night sm:text-sm">
                {t('controls.annualConsumption.label')}
              </label>
              <div className="relative">
                <input
                  id={inputId}
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  value={value ?? ''}
                  placeholder={t('controls.annualConsumption.placeholder')}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? errorId : undefined}
                  className={cn(fieldControlClassName, 'w-full pr-20')}
                  onChange={(event) => onChange(event.target.value)}
                />
                <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-sm text-slate-ink">
                  {t('controls.annualConsumption.unit')}
                </span>
              </div>
              {error && (
                <p id={errorId} className={fieldErrorClassName}>
                  {t('controls.annualConsumption.error', { min: annualConsumptionRangeKwh.min, max: annualConsumptionRangeKwh.max })}
                </p>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.p key="annual-estimate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={simulatorHintClassName}>
            {isEstimatedFromBill ? t('controls.annualConsumption.estimate', { kwh: estimatedKwh }) : t('controls.annualConsumption.estimateReference', { kwh: estimatedKwh })}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};
