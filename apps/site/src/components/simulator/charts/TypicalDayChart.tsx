import { useCallback, useId, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'motion/react';
import { TypicalDay } from '@/app/simulator/domain/entities/SolarEstimate';
import { chartEase, sum } from '@/components/simulator/charts/chartTheme';
import { AnimatedNumber } from '@/components/simulator/controls/AnimatedNumber';
import { SegmentedControl } from '@/components/simulator/controls/SegmentedControl';

type Season = 'summer' | 'winter';

type TypicalDayChartProps = {
  summer: TypicalDay;
  winter: TypicalDay;
  batteryKwh: number;
};

const width = 480;
const height = 190;
const baseline = 168;
const plotTop = 12;
const hours = 24;
const hourTicks = [0, 6, 12, 18, 24];

const xOf = (hour: number) => (hour / hours) * width;

const linePath = (values: number[], yOf: (value: number) => number) =>
  values.map((value, hour) => `${hour === 0 ? 'M' : 'L'} ${xOf(hour + 0.5).toFixed(1)} ${yOf(value).toFixed(1)}`).join(' ');

const areaPath = (values: number[], yOf: (value: number) => number) =>
  `M ${xOf(0.5).toFixed(1)} ${baseline} ${values.map((value, hour) => `L ${xOf(hour + 0.5).toFixed(1)} ${yOf(value).toFixed(1)}`).join(' ')} L ${xOf(hours - 0.5).toFixed(1)} ${baseline} Z`;

const drawTransition = { duration: 0.6, ease: chartEase };

export const TypicalDayChart = ({ summer, winter, batteryKwh }: TypicalDayChartProps) => {
  const { t, i18n } = useTranslation('simulator');
  const reducedMotion = useReducedMotion();
  const transition = reducedMotion ? { duration: 0 } : drawTransition;
  const [season, setSeason] = useState<Season>('summer');
  const labelId = useId();
  const productionGradientId = useId();
  const day = season === 'summer' ? summer : winter;
  const scale = Math.max(...summer.productionKwh, ...summer.consumptionKwh, ...winter.productionKwh, ...winter.consumptionKwh, 0.1) * 1.12;
  const yOf = useCallback((value: number) => baseline - (value / scale) * (baseline - plotTop), [scale]);
  const yOfBattery = useCallback((value: number) => baseline - (batteryKwh > 0 ? value / batteryKwh : 0) * (baseline - plotTop) * 0.92, [batteryKwh]);
  const decimal = useMemo(() => new Intl.NumberFormat(i18n.language, { minimumFractionDigits: 1, maximumFractionDigits: 1 }), [i18n.language]);
  const formatKwh = useCallback((value: number) => t('charts.typicalDay.kwh', { value: decimal.format(value) }), [t, decimal]);

  const productionArea = areaPath(day.productionKwh, yOf);
  const productionLine = linePath(day.productionKwh, yOf);
  const consumptionLine = linePath(day.consumptionKwh, yOf);
  const batteryArea = areaPath(day.batteryLevelKwh, yOfBattery);

  const totals = [
    { key: 'production', value: sum(day.productionKwh), className: 'text-solar' },
    { key: 'selfConsumed', value: sum(day.selfConsumedKwh), className: 'text-[#BFEAF5]' },
    { key: 'imported', value: sum(day.importedKwh), className: 'text-slate-light' },
  ];

  return (
    <figure className="flex flex-col gap-3">
      <figcaption className="flex flex-wrap items-center justify-between gap-3">
        <h3 id={labelId} className="text-sm font-semibold text-white">
          {t('charts.typicalDay.title')}
        </h3>
        <SegmentedControl<Season>
          labelId={labelId}
          tone="dark"
          value={season}
          onChange={setSeason}
          options={[
            { value: 'summer', label: t('charts.typicalDay.summer') },
            { value: 'winter', label: t('charts.typicalDay.winter') },
          ]}
          className="w-full text-xs sm:w-auto"
        />
      </figcaption>
      <div aria-hidden="true">
        <svg viewBox={`0 0 ${width} ${height}`} className="block h-[170px] w-full lg:h-[200px]" preserveAspectRatio="none">
          <defs>
            <linearGradient id={productionGradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFB36B" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#E07B28" stopOpacity="0.08" />
            </linearGradient>
          </defs>
          {[6, 12, 18].map((hour) => (
            <line key={hour} x1={xOf(hour)} x2={xOf(hour)} y1={plotTop} y2={baseline} stroke="#3a4a63" strokeOpacity="0.4" strokeDasharray="3 5" vectorEffect="non-scaling-stroke" />
          ))}
          {batteryKwh > 0 && (
            <motion.path
              d={batteryArea}
              fill="#4CC9EC"
              fillOpacity="0.14"
              stroke="#4CC9EC"
              strokeOpacity="0.7"
              strokeWidth="1.4"
              strokeDasharray="4 4"
              vectorEffect="non-scaling-stroke"
              initial={false}
              animate={{ d: batteryArea }}
              transition={transition}
            />
          )}
          <motion.path d={productionArea} fill={`url(#${productionGradientId})`} initial={false} animate={{ d: productionArea }} transition={transition} />
          <motion.path
            d={productionLine}
            fill="none"
            stroke="#FFB36B"
            strokeWidth="2.4"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            initial={false}
            animate={{ d: productionLine }}
            transition={transition}
          />
          <motion.path
            d={consumptionLine}
            fill="none"
            stroke="#BFEAF5"
            strokeWidth="2"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            initial={false}
            animate={{ d: consumptionLine }}
            transition={transition}
          />
          <line x1="0" x2={width} y1={baseline + 0.5} y2={baseline + 0.5} stroke="#3a4a63" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="relative mt-1.5 h-4 text-[11px] text-slate-mist">
          {hourTicks.map((hour) => (
            <span
              key={hour}
              className="absolute -translate-x-1/2 first:translate-x-0 last:-translate-x-full"
              style={{ left: `${(hour / hours) * 100}%` }}
            >
              {t('charts.typicalDay.hour', { hour })}
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-light">
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-sm bg-solar" />
          {t('charts.legend.production')}
        </span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="h-0.5 w-4 rounded-full bg-[#BFEAF5]" />
          {t('charts.legend.consumption')}
        </span>
        {batteryKwh > 0 && (
          <span className="flex items-center gap-1.5">
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-sm border border-dashed border-[#4CC9EC] bg-[#4CC9EC]/15" />
            {t('charts.legend.battery', { kwh: batteryKwh })}
          </span>
        )}
      </div>
      <dl className="grid grid-cols-3 gap-2">
        {totals.map((total) => (
          <div key={total.key} className="flex flex-col-reverse gap-0.5 rounded-lg bg-night-soft px-3 py-2.5 ring-1 ring-night-line/50">
            <dt className="text-[11px] leading-snug text-slate-mist">{t(`charts.typicalDay.totals.${total.key}`)}</dt>
            <dd className={`text-base font-bold ${total.className}`}>
              <AnimatedNumber value={total.value} format={formatKwh} />
            </dd>
          </div>
        ))}
      </dl>
      <p className="sr-only">
        {t('charts.typicalDay.srSummary', {
          season: t(`charts.typicalDay.${season}`),
          production: decimal.format(totals[0].value),
          selfConsumed: decimal.format(totals[1].value),
          imported: decimal.format(totals[2].value),
        })}
      </p>
    </figure>
  );
};
