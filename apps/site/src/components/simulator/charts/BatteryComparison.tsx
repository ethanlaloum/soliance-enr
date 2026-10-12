import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { chartEase } from '@/components/simulator/charts/chartTheme';

type Outcome = {
  autonomyPercent: number;
  annualSavingsEur: number;
};

type BatteryComparisonProps = {
  batteryKwh: number;
  withBattery: Outcome;
  withoutBattery: Outcome;
};

type Metric = {
  key: 'autonomy' | 'savings';
  withValue: number;
  withoutValue: number;
  format: (value: number) => string;
  delta: string;
};

export const BatteryComparison = ({ batteryKwh, withBattery, withoutBattery }: BatteryComparisonProps) => {
  const { t, i18n } = useTranslation('simulator');
  const integer = useMemo(() => new Intl.NumberFormat(i18n.language, { maximumFractionDigits: 0 }), [i18n.language]);

  if (batteryKwh === 0) {
    return (
      <figure className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-white">{t('charts.battery.title')}</h3>
        <p className="rounded-xl bg-night-soft p-4 text-sm leading-relaxed text-slate-light ring-1 ring-night-line/50">{t('charts.battery.none')}</p>
      </figure>
    );
  }

  const metrics: Metric[] = [
    {
      key: 'autonomy',
      withValue: withBattery.autonomyPercent,
      withoutValue: withoutBattery.autonomyPercent,
      format: (value) => t('charts.battery.percent', { value: integer.format(value) }),
      delta: t('charts.battery.autonomyGain', { value: integer.format(withBattery.autonomyPercent - withoutBattery.autonomyPercent) }),
    },
    {
      key: 'savings',
      withValue: withBattery.annualSavingsEur,
      withoutValue: withoutBattery.annualSavingsEur,
      format: (value) => t('charts.battery.euros', { value: integer.format(value) }),
      delta: t('charts.battery.savingsGain', { value: integer.format(withBattery.annualSavingsEur - withoutBattery.annualSavingsEur) }),
    },
  ];

  return (
    <figure className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-white">{t('charts.battery.title')}</h3>
      {metrics.map((metric, metricIndex) => {
        const largest = Math.max(metric.withValue, metric.withoutValue, 1);
        const rows = [
          { key: 'with', label: t('charts.battery.with', { kwh: batteryKwh }), value: metric.withValue, barClassName: 'bg-gradient-to-r from-solar to-[#FFB36B]' },
          { key: 'without', label: t('charts.battery.without'), value: metric.withoutValue, barClassName: 'bg-night-line' },
        ];
        return (
          <div key={metric.key} className="flex flex-col gap-2 rounded-xl bg-night-soft p-4 ring-1 ring-night-line/50">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-[13px] font-semibold text-white">{t(`charts.battery.metrics.${metric.key}`)}</p>
              <p className="rounded-full bg-solar/15 px-2 py-0.5 text-[11px] font-semibold text-[#FFB36B]">{metric.delta}</p>
            </div>
            {rows.map((row, rowIndex) => (
              <div key={row.key} className="grid grid-cols-[minmax(0,7rem)_1fr_auto] items-center gap-3 text-xs">
                <span className="truncate text-slate-light">{row.label}</span>
                <span className="h-2.5 overflow-hidden rounded-full bg-night">
                  <motion.span
                    className={`block h-full rounded-full ${row.barClassName}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(row.value / largest) * 100}%` }}
                    transition={{ duration: 0.7, ease: chartEase, delay: metricIndex * 0.12 + rowIndex * 0.08 }}
                  />
                </span>
                <span className="font-semibold tabular-nums text-white">{metric.format(row.value)}</span>
              </div>
            ))}
          </div>
        );
      })}
      <figcaption className="text-xs leading-normal text-slate-mist">{t('charts.battery.caption')}</figcaption>
    </figure>
  );
};
