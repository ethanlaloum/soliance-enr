import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { billComparisonOf, SizingChoice, SolarEstimate, solarEstimateParameters } from '@/app/simulator/domain/entities/SolarEstimate';
import { ConsumptionSource, SimulatorStep } from '@/app/simulator/domain/entities/SimulatorWizard';
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
  consumptionSource: ConsumptionSource;
  roofCapacityPanels: number;
  kwhPriceEur: number;
  onBack: () => void;
};

const leverKeys = ['shift', 'pilot', 'store'] as const;

const profileNoticeKeys: Record<ConsumptionSource, string> = {
  [ConsumptionSource.ANNUAL]: 'result.profileNoticeAnnual',
  [ConsumptionSource.BILL]: 'result.profileNotice',
  [ConsumptionSource.REFERENCE]: 'result.profileNoticeReference',
};

export const SimulatorResultCard = ({ estimate, consumptionSource, roofCapacityPanels, kwhPriceEur, onBack }: SimulatorResultCardProps) => {
  const { t } = useTranslation('simulator');

  const isCustomPower = estimate.panelChoice === SizingChoice.CUSTOM;
  const bill = billComparisonOf(estimate, kwhPriceEur);
  const target = solarEstimateParameters.savingsTarget.autonomyPercent;
  const largestBatteryKwh = Math.max(...solarEstimateParameters.batteryModulesKwh);
  const targetNotice = estimate.reachesSavingsTarget
    ? estimate.recommendedPanelCount > roofCapacityPanels
      ? t('result.beyondRoof', { count: roofCapacityPanels, target })
      : null
    : t(estimate.batteryChoice === SizingChoice.CUSTOM ? 'result.targetOutOfReachChosenBattery' : 'result.targetOutOfReach', { target, battery: largestBatteryKwh });
  const details = [
    {
      key: 'power',
      label: isCustomPower ? t('result.details.power.customLabel', { kwc: estimate.recommendedKwc }) : t('result.details.power.label'),
      value: t('result.details.power.value', { kwc: estimate.installedKwc, panels: estimate.panelCount }),
    },
    {
      key: 'battery',
      label: t(estimate.batteryChoice === SizingChoice.CUSTOM ? 'result.details.battery.customLabel' : 'result.details.battery.label'),
      value: estimate.batteryKwh > 0 ? t('result.details.battery.value', { kwh: estimate.batteryKwh }) : t('result.details.battery.none'),
    },
    {
      key: 'consumption',
      label: t('result.details.consumption.label'),
      value: t('result.details.consumption.value', { value: estimate.annualConsumptionKwh }),
    },
    {
      key: 'selfConsumption',
      label: t('result.details.selfConsumption.label'),
      value: t('result.details.selfConsumption.value', { value: estimate.selfConsumedKwh }),
    },
  ];

  return (
    <section aria-labelledby={simulatorStepTitleId} className={simulatorCardClassName}>
      <h2 id={simulatorStepTitleId} tabIndex={-1} className={simulatorStepTitleClassName}>
        {t(`wizard.titles.${SimulatorStep.RESULT}`)}
      </h2>
      <p className="text-[15px] leading-normal text-slate-ink">{t(estimate.batteryKwh > 0 ? 'result.lead' : 'result.leadWithoutBattery')}</p>

      <dl className="grid gap-3 sm:grid-cols-2">
        {details.map((detail) => (
          <div key={detail.key} className="flex flex-col-reverse justify-end gap-1 rounded-xl border border-sand-line bg-ivory px-4 py-3.5">
            <dt className="text-[13px] text-slate-ink">{detail.label}</dt>
            <dd className="text-lg font-bold text-night">{detail.value}</dd>
          </div>
        ))}
      </dl>

      <section aria-labelledby="simulator-bill-title" className="flex flex-col gap-3 rounded-xl border border-sand-line px-4 py-4">
        <h3 id="simulator-bill-title" className="text-sm font-semibold text-night">
          {t('result.bill.title')}
        </h3>
        <dl className="grid grid-cols-2 gap-3">
          <div className="flex flex-col-reverse justify-end gap-0.5">
            <dt className="text-[13px] text-slate-ink">{t('result.bill.before')}</dt>
            <dd className="text-lg font-bold text-night">{t('result.bill.perYear', { value: bill.beforeEur })}</dd>
          </div>
          <div className="flex flex-col-reverse justify-end gap-0.5">
            <dt className="text-[13px] text-slate-ink">{t('result.bill.after')}</dt>
            <dd className="text-lg font-bold text-[#a6540f]">{t('result.bill.perYear', { value: bill.afterEur })}</dd>
          </div>
        </dl>
        <p className="text-sm leading-normal text-night">
          {t('result.bill.saved', { value: bill.savedEur, monthly: bill.savedPerMonthEur, percent: bill.savedPercent })}
        </p>
      </section>

      {targetNotice && <p className="rounded-xl bg-solar/10 px-4 py-3 text-sm font-medium leading-normal text-[#7a3d08]">{targetNotice}</p>}

      <p className="rounded-xl border border-solar/30 bg-solar/5 px-4 py-3 text-sm leading-normal text-night">{t(profileNoticeKeys[consumptionSource])}</p>

      <section aria-labelledby="simulator-levers-title" className="flex flex-col gap-2.5">
        <h3 id="simulator-levers-title" className="text-sm font-semibold text-night">
          {t('result.levers.title')}
        </h3>
        <ul className="flex flex-col gap-2">
          {leverKeys.map((key) => (
            <li key={key} className="text-[13px] leading-snug text-slate-ink">
              <span className="font-semibold text-night">{t(`result.levers.${key}.title`)}</span> · {t(`result.levers.${key}.text`)}
            </li>
          ))}
        </ul>
      </section>

      <p className="text-[13px] leading-normal text-slate-ink">
        {t(estimate.batteryKwh > 0 ? 'result.surplus' : 'result.surplusWithoutBattery', {
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
