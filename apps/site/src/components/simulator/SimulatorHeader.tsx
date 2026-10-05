import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { SimulatorStep } from '@/app/simulator/domain/entities/SimulatorWizard';
import { containerClassName } from '@/components/home/containerClassName';
import { SimulatorStepper } from '@/components/simulator/SimulatorStepper';

type SimulatorHeaderProps = {
  step: SimulatorStep;
};

export const SimulatorHeader = ({ step }: SimulatorHeaderProps) => {
  const { t } = useTranslation('simulator');

  return (
    <div className={cn(containerClassName, 'hz-simulator-header')}>
      <p className="hz-page-eyebrow motion-safe:animate-fade-up motion-safe:[animation-delay:80ms]">{t('hero.eyebrow')}</p>
      <h1 className="hz-simulator-title max-w-[1040px] motion-safe:animate-fade-up motion-safe:[animation-delay:160ms]">
        {t('hero.title')}
      </h1>
      <SimulatorStepper step={step} className="hz-simulator-steps mt-2 motion-safe:animate-fade-up motion-safe:[animation-delay:240ms] lg:mt-3" />
    </div>
  );
};
