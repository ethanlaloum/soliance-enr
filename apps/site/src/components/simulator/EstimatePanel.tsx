import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { SolarEstimatePreview } from '@/app/simulator/domain/entities/SimulatorWizard';
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

  const tiles = [
    {
      key: 'power',
      value: estimate ? t('estimate.power.value', { kwc: estimate.recommendedKwc, battery: estimate.recommendedBatteryKwh }) : empty,
      label: estimate ? t('estimate.power.label', { panels: estimate.panelCount }) : t('estimate.power.emptyLabel'),
    },
    {
      key: 'production',
      value: estimate ? t('estimate.production.value', { value: estimate.annualProductionKwh }) : empty,
      label: t('estimate.production.label'),
    },
    {
      key: 'savings',
      value: estimate ? t('estimate.savings.value', { value: estimate.annualSavingsEur }) : empty,
      label: t('estimate.savings.label'),
    },
    {
      key: 'autonomy',
      value: estimate ? t('estimate.autonomy.value', { value: estimate.autonomyPercent }) : empty,
      label: t('estimate.autonomy.label'),
    },
  ];

  return (
    <section
      aria-labelledby="simulator-estimate-title"
      className={cn('hz-simulator-estimate flex flex-col gap-6 rounded-[6px] bg-night p-6 text-white lg:p-9', className)}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="simulator-estimate-title" className="text-2xl font-normal tracking-[-0.04em] lg:text-[28px]">
          {t('estimate.title')}
        </h2>
        <p className="rounded-[4px] border border-night-line px-2.5 py-1 text-xs text-slate-mist">
          {isFinal ? t('estimate.resultBadge') : t('estimate.previewBadge')}
        </p>
      </div>

      <dl className="grid grid-cols-2 gap-3">
        {tiles.map((tile) => (
          <div
            key={tile.key}
            className="flex flex-col-reverse justify-end gap-2 rounded-[4px] border border-night-line bg-night-soft p-4 first:col-span-2 sm:first:col-span-1 lg:p-[18px]"
          >
            <dt className="text-xs text-slate-light lg:text-[13px]">{tile.label}</dt>
            <dd className={cn('text-[22px] font-normal tracking-[-0.045em] leading-tight lg:text-[30px]', estimate ? 'text-solar' : 'text-slate-mist')}>{tile.value}</dd>
          </div>
        ))}
      </dl>

      {!estimate && <p className="text-sm leading-normal text-slate-light">{t('estimate.emptyHint')}</p>}
      {preview && preview.referenceMonthlyBillEur !== null && (
        <p className="text-sm leading-normal text-slate-light">{t('estimate.referenceHint', { bill: preview.referenceMonthlyBillEur })}</p>
      )}

      <MonthlyProductionChart monthlyKwh={estimate?.monthlyProductionKwh ?? null} />
    </section>
  );
};
