import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { SizingChoice } from '@/app/simulator/domain/entities/SolarEstimate';
import { SolarEstimatePreview } from '@/app/simulator/domain/entities/SimulatorWizard';
import { AnimatedNumber } from '@/components/simulator/controls/AnimatedNumber';
import { MonthlyProductionChart } from '@/components/simulator/MonthlyProductionChart';

type EstimatePanelProps = {
  preview: SolarEstimatePreview | null;
  isFinal: boolean;
  className?: string;
};

export const EstimatePanel = ({ preview, isFinal, className }: EstimatePanelProps) => {
  const { t } = useTranslation('simulator');
  const estimate = preview?.estimate ?? null;
  const empty = t('estimate.empty');

  const formatProduction = useCallback((value: number) => t('estimate.production.value', { value: Math.round(value / 10) * 10 }), [t]);
  const formatSavings = useCallback((value: number) => t('estimate.savings.value', { value: Math.round(value / 10) * 10 }), [t]);
  const formatAutonomy = useCallback((value: number) => t('estimate.autonomy.value', { value: Math.round(value) }), [t]);

  const tiles = [
    {
      key: 'power',
      value: estimate
        ? estimate.batteryKwh > 0
          ? t('estimate.power.value', { kwc: estimate.installedKwc, battery: estimate.batteryKwh })
          : t('estimate.power.valueWithoutBattery', { kwc: estimate.installedKwc })
        : empty,
      label: estimate
        ? t(
            estimate.panelChoice === SizingChoice.CUSTOM
              ? 'estimate.power.customLabel'
              : estimate.batteryKwh > 0
                ? 'estimate.power.label'
                : 'estimate.power.labelWithoutBattery',
            { panels: estimate.panelCount },
          )
        : t('estimate.power.emptyLabel'),
    },
    {
      key: 'production',
      value: estimate ? <AnimatedNumber value={estimate.annualProductionKwh} format={formatProduction} /> : empty,
      label: t('estimate.production.label'),
    },
    {
      key: 'savings',
      value: estimate ? <AnimatedNumber value={estimate.annualSavingsEur} format={formatSavings} /> : empty,
      label: t('estimate.savings.label'),
    },
    {
      key: 'autonomy',
      value: estimate ? <AnimatedNumber value={estimate.autonomyPercent} format={formatAutonomy} /> : empty,
      label: t(estimate && estimate.batteryKwh === 0 ? 'estimate.autonomy.labelWithoutBattery' : 'estimate.autonomy.label'),
    },
  ];

  return (
    <section
      aria-labelledby="simulator-estimate-title"
      className={cn('flex flex-col gap-[18px] rounded-2xl bg-night p-5 text-white lg:rounded-[20px] lg:p-8', className)}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="simulator-estimate-title" className="text-lg font-bold lg:text-xl">
          {t('estimate.title')}
        </h2>
        <p className="rounded-[20px] border border-night-line px-2.5 py-1 text-xs text-slate-mist">
          {isFinal ? t('estimate.resultBadge') : t('estimate.previewBadge')}
        </p>
      </div>

      <dl className="grid grid-cols-2 gap-3">
        {tiles.map((tile) => (
          <div
            key={tile.key}
            className="flex flex-col-reverse justify-end gap-1 rounded-xl bg-night-soft p-4 first:col-span-2 sm:first:col-span-1 lg:p-[18px]"
          >
            <dt className="text-xs text-slate-light lg:text-[13px]">{tile.label}</dt>
            <dd className={cn('text-[22px] font-bold leading-tight lg:text-[30px]', estimate ? 'text-solar' : 'text-slate-mist')}>{tile.value}</dd>
          </div>
        ))}
      </dl>

      {!estimate && <p className="text-sm leading-normal text-slate-light">{t('estimate.emptyHint')}</p>}
      {preview && preview.referenceMonthlyBillEur !== null && (
        <p className="text-sm leading-normal text-slate-light">{t('estimate.referenceHint', { bill: preview.referenceMonthlyBillEur })}</p>
      )}

      <MonthlyProductionChart monthlyKwh={estimate?.monthlyProductionKwh ?? null} sunshine={preview?.sunshine ?? null} />
    </section>
  );
};
