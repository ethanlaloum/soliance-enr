import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { solarEstimateParameters } from '@/app/simulator/domain/entities/SolarEstimate';
import { LocalSunshine } from '@/app/simulator/domain/entities/SimulatorWizard';

const monthKeys = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
] as const;

const chartWidth = 520;
const baseline = 131;
const maxBarHeight = 118;
const barWidth = 30;
const columnWidth = chartWidth / monthKeys.length;

type MonthlyProductionChartProps = {
  monthlyKwh: number[] | null;
  sunshine: LocalSunshine | null;
};

export const MonthlyProductionChart = ({ monthlyKwh, sunshine }: MonthlyProductionChartProps) => {
  const { t } = useTranslation('simulator');
  const values = monthlyKwh ?? solarEstimateParameters.monthlyProductionShares;
  const peak = Math.max(...values);

  return (
    <figure className="flex flex-col gap-3">
      <div aria-hidden="true">
        <svg viewBox={`0 0 ${chartWidth} 132`} preserveAspectRatio="none" className="block h-[104px] w-full lg:h-[132px]">
          {monthKeys.map((month, index) => {
            const height = peak > 0 ? (values[index] / peak) * maxBarHeight : 0;
            return (
              <rect
                key={month}
                x={index * columnWidth + (columnWidth - barWidth) / 2}
                y={baseline - height}
                width={barWidth}
                height={height}
                className={cn('transition-colors duration-500 motion-reduce:transition-none', monthlyKwh ? 'fill-solar' : 'fill-night-line')}
              />
            );
          })}
          <line x1="0" y1="131.5" x2={chartWidth} y2="131.5" vectorEffect="non-scaling-stroke" className="stroke-night-line" />
        </svg>
        <div className="mt-1.5 grid grid-cols-12 text-center text-[11px] text-slate-mist">
          {monthKeys.map((month) => (
            <span key={month}>{t(`estimate.months.${month}.short`)}</span>
          ))}
        </div>
      </div>
      {monthlyKwh && (
        <ul className="sr-only">
          {monthKeys.map((month, index) => (
            <li key={month}>{t('estimate.monthValue', { month: t(`estimate.months.${month}.long`), value: monthlyKwh[index] })}</li>
          ))}
        </ul>
      )}
      <figcaption className="text-xs leading-normal text-slate-mist">
        {sunshine?.departmentName
          ? t('estimate.captionDepartment', { department: sunshine.departmentName, yield: sunshine.yieldKwhPerKwc, pvgis: sunshine.pvgisKwhPerKwc })
          : t('estimate.caption', { yield: sunshine?.yieldKwhPerKwc ?? solarEstimateParameters.specificYieldKwhPerKwc })}
      </figcaption>
    </figure>
  );
};
