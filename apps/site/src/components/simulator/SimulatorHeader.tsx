import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { SimulatorStep } from '@/app/simulator/domain/entities/SimulatorWizard';
import { containerClassName, eyebrowClassName } from '@/components/home/containerClassName';
import { SimulatorStepper } from '@/components/simulator/SimulatorStepper';

type SimulatorHeaderProps = {
  step: SimulatorStep;
};

export const SimulatorHeader = ({ step }: SimulatorHeaderProps) => {
  const { t } = useTranslation('simulator');

  return (
    <div className={cn(containerClassName, 'flex flex-col items-center gap-3 pb-6 pt-9 text-center lg:pb-8 lg:pt-16')}>
      <p className={cn(eyebrowClassName, 'motion-safe:animate-fade-up motion-safe:[animation-delay:80ms]')}>{t('hero.eyebrow')}</p>
      <h1 className="max-w-[900px] text-[30px] font-bold leading-[1.12] tracking-[-0.02em] motion-safe:animate-fade-up motion-safe:[animation-delay:160ms] lg:text-5xl lg:leading-[1.15]">
        {t('hero.title')}
      </h1>
      <SimulatorStepper step={step} className="mt-2 motion-safe:animate-fade-up motion-safe:[animation-delay:240ms] lg:mt-3" />
    </div>
  );
};
