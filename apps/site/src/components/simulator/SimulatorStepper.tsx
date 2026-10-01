import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { SimulatorStep, simulatorStepNumber, simulatorSteps } from '@/app/simulator/domain/entities/SimulatorWizard';

type SimulatorStepperProps = {
  step: SimulatorStep;
  className?: string;
};

export const SimulatorStepper = ({ step, className }: SimulatorStepperProps) => {
  const { t } = useTranslation('simulator');
  const currentNumber = simulatorStepNumber(step);

  return (
    <div className={cn('flex flex-col items-center gap-2.5', className)}>
      <ol aria-label={t('hero.stepsLabel')} className="flex items-center gap-2 text-sm text-slate-ink lg:gap-2.5">
        {simulatorSteps.map((item) => {
          const number = simulatorStepNumber(item);
          const isReached = number <= currentNumber;
          return (
            <li key={item} aria-current={item === step ? 'step' : undefined} className="flex items-center gap-2 lg:gap-2.5">
              {number > 1 && (
                <span
                  aria-hidden="true"
                  className={cn(
                    'h-0.5 w-6 transition-colors duration-500 motion-reduce:transition-none lg:w-10',
                    isReached ? 'bg-solar' : 'bg-sand-border',
                  )}
                />
              )}
              <span
                aria-hidden="true"
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-full text-[13px] font-bold transition-colors duration-500 motion-reduce:transition-none',
                  isReached ? 'bg-solar text-white' : 'border-2 border-sand-border text-slate',
                )}
              >
                {number}
              </span>
              <span className="sr-only lg:not-sr-only">{t(`steps.${item}`)}</span>
            </li>
          );
        })}
      </ol>
      <p className="text-sm font-semibold text-night lg:hidden">
        {t('hero.currentStep', { current: currentNumber, total: simulatorSteps.length, label: t(`steps.${step}`) })}
      </p>
    </div>
  );
};
