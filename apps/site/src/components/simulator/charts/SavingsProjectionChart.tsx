import { useCallback, useId, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'motion/react';
import { chartEase } from '@/components/simulator/charts/chartTheme';
import { AnimatedNumber } from '@/components/simulator/controls/AnimatedNumber';

type SavingsProjectionChartProps = {
  cumulativeEur: number[];
  years: number;
};

const width = 480;
const height = 170;
const baseline = 152;
const plotTop = 12;
const samples = 30;
const tickCandidates = [1, 5, 10, 15, 20, 25, 30];

const valueAt = (cumulative: number[], year: number) => {
  if (year <= 0 || cumulative.length === 0) return 0;
  const lower = Math.floor(year);
  const upper = Math.min(Math.ceil(year), cumulative.length);
  const lowerValue = lower === 0 ? 0 : cumulative[lower - 1];
  const upperValue = cumulative[upper - 1] ?? lowerValue;
  return lowerValue + (upperValue - lowerValue) * (year - lower);
};

export const SavingsProjectionChart = ({ cumulativeEur, years }: SavingsProjectionChartProps) => {
  const { t, i18n } = useTranslation('simulator');
  const reducedMotion = useReducedMotion();
  const gradientId = useId();
  const total = cumulativeEur.at(-1) ?? 0;
  const integer = useMemo(() => new Intl.NumberFormat(i18n.language, { maximumFractionDigits: 0 }), [i18n.language]);
  const formatTotal = useCallback((value: number) => t('charts.projection.total', { value: integer.format(Math.round(value / 10) * 10) }), [t, integer]);

  const points = Array.from({ length: samples + 1 }, (_, index) => {
    const year = (index / samples) * years;
    const value = valueAt(cumulativeEur, year);
    return { x: (index / samples) * width, y: baseline - (total > 0 ? value / (total * 1.08) : 0) * (baseline - plotTop) };
  });
  const line = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(' ');
  const area = `${line} L ${width} ${baseline} L 0 ${baseline} Z`;
  const ticks = [...new Set([...tickCandidates.filter((year) => year < years), years])];
  const midYear = Math.round(years / 2);

  return (
    <figure className="flex flex-col gap-3">
      <figcaption className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-white">{t('charts.projection.title', { years })}</h3>
        <p className="text-[28px] font-bold leading-tight text-solar lg:text-[34px]">
          <AnimatedNumber value={total} format={formatTotal} />
        </p>
        <p className="text-xs text-slate-light">{t('charts.projection.subtitle', { years, middle: midYear, value: integer.format(valueAt(cumulativeEur, midYear)) })}</p>
      </figcaption>
      <div aria-hidden="true">
        <svg viewBox={`0 0 ${width} ${height}`} className="block h-[150px] w-full lg:h-[170px]" preserveAspectRatio="none">
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E07B28" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#E07B28" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0.33, 0.66].map((share) => (
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
          <motion.path
            d={area}
            fill={`url(#${gradientId})`}
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1, d: area }}
            transition={reducedMotion ? { duration: 0 } : { duration: 0.7, ease: chartEase }}
          />
          <motion.path
            d={line}
            fill="none"
            stroke="#FFB36B"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            initial={reducedMotion ? false : { pathLength: 0 }}
            animate={{ pathLength: 1, d: line }}
            transition={reducedMotion ? { duration: 0 } : { duration: 0.9, ease: chartEase }}
          />
          <motion.circle
            r="4.5"
            fill="#FFB36B"
            stroke="#0B1120"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            initial={false}
            animate={{ cx: points[samples].x - 4, cy: points[samples].y }}
            transition={reducedMotion ? { duration: 0 } : { duration: 0.7, ease: chartEase }}
          />
          <line x1="0" x2={width} y1={baseline + 0.5} y2={baseline + 0.5} stroke="#3a4a63" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="relative mt-1.5 h-4 text-[11px] text-slate-mist">
          {ticks.map((year) => (
            <span key={year} className="absolute -translate-x-1/2 last:-translate-x-full" style={{ left: `${(year / years) * 100}%` }}>
              {t('charts.projection.year', { count: year })}
            </span>
          ))}
        </div>
      </div>
      <p className="sr-only">{t('charts.projection.srSummary', { years, value: integer.format(total) })}</p>
      <p className="text-xs leading-normal text-slate-mist">{t('charts.projection.caption')}</p>
    </figure>
  );
};
