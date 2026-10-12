import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'motion/react';
import { SolarEstimate, TypicalDay } from '@/app/simulator/domain/entities/SolarEstimate';
import { BatteryComparison } from '@/components/simulator/charts/BatteryComparison';
import { MonthlyEnergyChart } from '@/components/simulator/charts/MonthlyEnergyChart';
import { SavingsProjectionChart } from '@/components/simulator/charts/SavingsProjectionChart';
import { TypicalDayChart } from '@/components/simulator/charts/TypicalDayChart';
import { AnimatedNumber } from '@/components/simulator/controls/AnimatedNumber';
import { SegmentedControl } from '@/components/simulator/controls/SegmentedControl';

type DashboardTab = 'monthly' | 'typical' | 'projection' | 'battery';

const tabs: DashboardTab[] = ['monthly', 'typical', 'projection', 'battery'];

type ResultDashboardProps = {
  estimate: SolarEstimate;
  typicalDays: { summer: TypicalDay; winter: TypicalDay } | null;
  cumulativeEur: number[];
  projectionYears: number;
};

type Kpi = {
  key: string;
  value: number;
  format: (value: number) => string;
  isEnergy: boolean;
};

const tabTransition = { duration: 0.28, ease: [0.22, 1, 0.36, 1] } as const;

export const ResultDashboard = ({ estimate, typicalDays, cumulativeEur, projectionYears }: ResultDashboardProps) => {
  const { t, i18n } = useTranslation('simulator');
  const [tab, setTab] = useState<DashboardTab>('monthly');
  const integer = useMemo(() => new Intl.NumberFormat(i18n.language, { maximumFractionDigits: 0 }), [i18n.language]);
  const roundTo = useCallback((value: number, step: number) => integer.format(Math.round(value / step) * step), [integer]);
  const formatSavings = useCallback((value: number) => `${roundTo(value, 10)} €`, [roundTo]);
  const formatPercent = useCallback((value: number) => `${roundTo(value, 1)} %`, [roundTo]);
  const formatEnergy = useCallback((value: number) => `${roundTo(value, 10)} kWh`, [roundTo]);

  const kpis: Kpi[] = [
    { key: 'savings', value: estimate.annualSavingsEur, format: formatSavings, isEnergy: true },
    { key: 'autonomy', value: estimate.autonomyPercent, format: formatPercent, isEnergy: false },
    { key: 'production', value: estimate.annualProductionKwh, format: formatEnergy, isEnergy: true },
    { key: 'selfConsumption', value: estimate.selfConsumptionPercent, format: formatPercent, isEnergy: false },
  ];

  return (
    <section aria-labelledby="simulator-dashboard-title" className="flex flex-col gap-5 rounded-2xl border border-night-line/60 bg-night p-5 text-white lg:rounded-[20px] lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="simulator-dashboard-title" className="text-lg font-bold lg:text-xl">
          {t('dashboard.title')}
        </h2>
        <p className="inline-flex items-center gap-2 rounded-full border border-night-line px-2.5 py-1 text-xs text-slate-light">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-solar motion-safe:animate-pulse" />
          {t('dashboard.live')}
        </p>
      </div>

      <dl className="grid grid-cols-2 gap-3">
        {kpis.map((kpi, index) => (
          <motion.div
            key={kpi.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...tabTransition, delay: 0.06 * index }}
            className="flex flex-col-reverse justify-end gap-1 rounded-xl bg-night-soft p-4 ring-1 ring-night-line/50 lg:p-[18px]"
          >
            <dt className="text-xs leading-snug text-slate-light lg:text-[13px]">{t(`dashboard.kpis.${kpi.key}`)}</dt>
            <dd className={kpi.isEnergy ? 'text-[24px] font-bold leading-tight text-solar lg:text-[30px]' : 'text-[24px] font-bold leading-tight text-[#BFEAF5] lg:text-[30px]'}>
              <AnimatedNumber value={kpi.value} format={kpi.format} />
            </dd>
          </motion.div>
        ))}
      </dl>

      <div className="flex flex-col gap-4">
        <span id="simulator-dashboard-tabs" className="sr-only">
          {t('dashboard.tabsLabel')}
        </span>
        <SegmentedControl<DashboardTab>
          labelId="simulator-dashboard-tabs"
          tone="dark"
          value={tab}
          onChange={setTab}
          options={tabs.map((value) => ({ value, label: t(`dashboard.tabs.${value}`, { years: projectionYears }) }))}
          className="text-xs sm:text-sm"
        />
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={tabTransition}>
            {tab === 'monthly' && <MonthlyEnergyChart productionKwh={estimate.monthlyProductionKwh} consumptionKwh={estimate.monthlyConsumptionKwh} />}
            {tab === 'typical' && typicalDays && <TypicalDayChart summer={typicalDays.summer} winter={typicalDays.winter} batteryKwh={estimate.batteryKwh} />}
            {tab === 'projection' && <SavingsProjectionChart cumulativeEur={cumulativeEur} years={projectionYears} />}
            {tab === 'battery' && (
              <BatteryComparison
                batteryKwh={estimate.batteryKwh}
                withBattery={{ autonomyPercent: estimate.autonomyPercent, annualSavingsEur: estimate.annualSavingsEur }}
                withoutBattery={{ autonomyPercent: estimate.withoutBattery.autonomyPercent, annualSavingsEur: estimate.withoutBattery.annualSavingsEur }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
