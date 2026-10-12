import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'motion/react';
import { chartEase, monthKeys } from '@/components/simulator/charts/chartTheme';

type MonthlyEnergyChartProps = {
  productionKwh: number[];
  consumptionKwh: number[];
};

const width = 520;
const height = 190;
const baseline = 168;
const plotTop = 14;
const columnWidth = width / 12;
const barWidth = 20;

export const MonthlyEnergyChart = ({ productionKwh, consumptionKwh }: MonthlyEnergyChartProps) => {
  const { t } = useTranslation('simulator');
  const reducedMotion = useReducedMotion();
  const gradientId = useId();
  const scale = Math.max(...productionKwh, ...consumptionKwh, 1) * 1.08;
  const yOf = (value: number) => baseline - (value / scale) * (baseline - plotTop);
  const centerOf = (index: number) => index * columnWidth + columnWidth / 2;
  const consumptionPath = consumptionKwh.map((value, index) => `${index === 0 ? 'M' : 'L'} ${centerOf(index).toFixed(1)} ${yOf(value).toFixed(1)}`).join(' ');

  return (
    <figure className="flex flex-col gap-3">
      <figcaption className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-white">{t('charts.monthly.title')}</h3>
        <span className="flex items-center gap-4 text-xs text-slate-light">
          <span className="flex items-center gap-1.5">
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-sm bg-solar" />
            {t('charts.legend.production')}
          </span>
          <span className="flex items-center gap-1.5">
            <span aria-hidden="true" className="h-0.5 w-4 rounded-full bg-[#BFEAF5]" />
            {t('charts.legend.consumption')}
          </span>
        </span>
      </figcaption>
      <div aria-hidden="true">
        <svg viewBox={`0 0 ${width} ${height}`} className="block h-[170px] w-full lg:h-[200px]" preserveAspectRatio="none">
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFB36B" />
              <stop offset="100%" stopColor="#E07B28" stopOpacity="0.75" />
            </linearGradient>
          </defs>
          {[0.25, 0.5, 0.75].map((share) => (
            <line
              key={share}
              x1="0"
              x2={width}
              y1={baseline - share * (baseline - plotTop)}
              y2={baseline - share * (baseline - plotTop)}
              stroke="#3a4a63"
              strokeOpacity="0.45"
              strokeDasharray="3 5"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          {productionKwh.map((value, index) => {
            const barHeight = baseline - yOf(value);
            return (
              <motion.rect
                key={monthKeys[index]}
                x={centerOf(index) - barWidth / 2}
                width={barWidth}
                rx="3"
                fill={`url(#${gradientId})`}
                initial={reducedMotion ? false : { y: baseline, height: 0 }}
                animate={{ y: baseline - barHeight, height: barHeight }}
                transition={reducedMotion ? { duration: 0 } : { duration: 0.7, ease: chartEase, delay: index * 0.035 }}
              />
            );
          })}
          <motion.path
            d={consumptionPath}
            fill="none"
            stroke="#BFEAF5"
            strokeWidth="2.2"
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            initial={reducedMotion ? false : { pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1, d: consumptionPath }}
            transition={reducedMotion ? { duration: 0 } : { duration: 0.9, ease: chartEase, delay: 0.25 }}
          />
          {consumptionKwh.map((value, index) => (
            <motion.circle
              key={monthKeys[index]}
              r="3.4"
              fill="#0B1120"
              stroke="#4CC9EC"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
              initial={reducedMotion ? false : { cx: centerOf(index), cy: baseline, opacity: 0 }}
              animate={{ cx: centerOf(index), cy: yOf(value), opacity: 1 }}
              transition={reducedMotion ? { duration: 0 } : { duration: 0.6, ease: chartEase, delay: 0.3 + index * 0.03 }}
            />
          ))}
          <line x1="0" x2={width} y1={baseline + 0.5} y2={baseline + 0.5} stroke="#3a4a63" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="mt-1.5 grid grid-cols-12 text-center text-[11px] text-slate-mist">
          {monthKeys.map((month) => (
            <span key={month}>{t(`estimate.months.${month}.short`)}</span>
          ))}
        </div>
      </div>
      <ul className="sr-only">
        {monthKeys.map((month, index) => (
          <li key={month}>
            {t('charts.monthly.srValue', { month: t(`estimate.months.${month}.long`), production: productionKwh[index], consumption: consumptionKwh[index] })}
          </li>
        ))}
      </ul>
      <p className="text-xs leading-normal text-slate-mist">{t('charts.monthly.caption')}</p>
    </figure>
  );
};
