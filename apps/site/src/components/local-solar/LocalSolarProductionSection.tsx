import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { containerClassName, eyebrowClassName } from '@/components/home/containerClassName';
import { estimateAreaProduction, type ServiceArea } from '@/app/service-areas/domain/entities/ServiceArea';
import { typicalPeakPowerKwc, type LocalSolarTextValues } from '@/components/local-solar/localSolarTextValues';

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
const chartHeight = 160;
const barWidth = 28;
const columnWidth = chartWidth / monthKeys.length;

type LocalSolarProductionSectionProps = {
  area: ServiceArea;
  values: LocalSolarTextValues;
};

export const LocalSolarProductionSection = ({ area, values }: LocalSolarProductionSectionProps) => {
  const { t } = useTranslation('localSolar');
  const { monthlyKwh } = estimateAreaProduction(area, typicalPeakPowerKwc);
  const peak = Math.max(...monthlyKwh);

  return (
    <section
      aria-labelledby="local-solar-production-title"
      className={cn(containerClassName, 'grid gap-8 pb-10 pt-12 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-16 lg:pb-16 lg:pt-20')}
    >
      <div data-reveal className="flex flex-col gap-4">
        <p className={eyebrowClassName}>{t('production.eyebrow', values)}</p>
        <h2 id="local-solar-production-title" className="text-[26px] font-bold leading-[1.15] tracking-[-0.02em] lg:text-[36px]">
          {t('production.title', values)}
        </h2>
        <p className="text-[15px] leading-[1.6] text-slate-ink lg:text-base">{t('production.body', values)}</p>
        <p className="text-[15px] leading-[1.6] text-slate-ink lg:text-base">{t('production.battery')}</p>
      </div>
      <figure data-reveal className="flex flex-col gap-4 rounded-2xl border border-sand-line bg-white p-5 lg:p-8">
        <figcaption className="text-base font-bold lg:text-lg">{t('production.chartTitle', values)}</figcaption>
        <div aria-hidden="true">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none" className="block h-[140px] w-full lg:h-[180px]">
            {monthlyKwh.map((kwh, index) => {
              const height = (kwh / peak) * (chartHeight - 4);
              return (
                <rect
                  key={monthKeys[index]}
                  x={index * columnWidth + (columnWidth - barWidth) / 2}
                  y={chartHeight - height}
                  width={barWidth}
                  height={height}
                  rx={3}
                  className="fill-solar"
                />
              );
            })}
          </svg>
          <div className="mt-1.5 grid grid-cols-12 text-center text-[11px] text-slate-ink lg:text-xs">
            {monthKeys.map((month) => (
              <span key={month}>{t(`production.months.${month}.short`)}</span>
            ))}
          </div>
        </div>
        <ul className="sr-only">
          {monthKeys.map((month, index) => (
            <li key={month}>{t('production.monthValue', { month: t(`production.months.${month}.long`), value: monthlyKwh[index] })}</li>
          ))}
        </ul>
        <p className="text-xs leading-normal text-slate-ink">{t('production.source')}</p>
      </figure>
    </section>
  );
};
