import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { SolarEstimate, solarEstimateParameters } from '@/app/simulator/domain/entities/SolarEstimate';
import { SimulatorStep } from '@/app/simulator/domain/entities/SimulatorWizard';
import { buttonVariants } from '@/components/ui/buttonVariants';
import {
  simulatorBackButtonClassName,
  simulatorCaptureId,
  simulatorCardClassName,
  simulatorStepTitleClassName,
  simulatorStepTitleId,
} from '@/components/simulator/simulatorStyles';

type SimulatorResultCardProps = {
  estimate: SolarEstimate;
  onBack: () => void;
};

export const SimulatorResultCard = ({ estimate, onBack }: SimulatorResultCardProps) => {
  const { t } = useTranslation('simulator');

  const details = [
    { key: 'power', value: t('result.details.power.value', { kwc: estimate.recommendedKwc, panels: estimate.panelCount }) },
    { key: 'battery', value: t('result.details.battery.value', { kwh: estimate.recommendedBatteryKwh }) },
    { key: 'consumption', value: t('result.details.consumption.value', { value: estimate.annualConsumptionKwh }) },
    { key: 'selfConsumption', value: t('result.details.selfConsumption.value', { value: estimate.selfConsumedKwh }) },
  ] as const;

  return (
    <section aria-labelledby={simulatorStepTitleId} className={simulatorCardClassName}>
      <h2 id={simulatorStepTitleId} tabIndex={-1} className={simulatorStepTitleClassName}>
        {t(`wizard.titles.${SimulatorStep.RESULT}`)}
      </h2>
      <p className="text-[15px] leading-normal text-slate-ink">{t('result.lead')}</p>

      <dl className="grid gap-3 sm:grid-cols-2">
        {details.map((detail) => (
          <div key={detail.key} className="flex flex-col-reverse justify-end gap-1 rounded-xl border border-sand-line bg-ivory px-4 py-3.5">
            <dt className="text-[13px] text-slate-ink">{t(`result.details.${detail.key}.label`)}</dt>
            <dd className="text-lg font-bold text-night">{detail.value}</dd>
          </div>
        ))}
      </dl>

      <p className="text-[13px] leading-normal text-slate-ink">
        {t('result.surplus', {
          kwh: estimate.surplusKwh,
          tariff: solarEstimateParameters.surplusBuyBackEurPerKwh,
          value: estimate.surplusValueEur,
        })}
      </p>
      <p className="text-sm font-semibold text-night">{t('result.price')}</p>

      <div className="mt-1.5 flex flex-col gap-3 sm:flex-row">
        <a
          href={`#${simulatorCaptureId}`}
          className={cn(buttonVariants({ size: 'md' }), 'whitespace-normal px-4 text-center text-base sm:order-last sm:flex-1 lg:hidden')}
        >
          {t('result.cta')}
        </a>
        <button type="button" onClick={onBack} className={simulatorBackButtonClassName}>
          {t('wizard.back')}
        </button>
      </div>
    </section>
  );
};
