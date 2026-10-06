import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

const chargeLevelPercent = 68;

export const SolarChargeWidget = ({ className }: { className?: string }) => {
  const { t } = useTranslation('evCharger');
  const titleId = useId();

  return (
    <div className={cn('flex flex-col gap-2.5 rounded-[14px] border border-charge-line bg-white px-[18px] py-4 text-night lg:px-[22px] lg:py-[18px]', className)}>
      <div className="flex items-center justify-between gap-4">
        <p id={titleId} className="text-sm font-bold lg:text-[15px]">
          {t('hero.widget.title')}
        </p>
        <p className="shrink-0 text-xs font-bold text-charge">{t('hero.widget.power')}</p>
      </div>
      <div
        role="progressbar"
        aria-labelledby={titleId}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={chargeLevelPercent}
        aria-valuetext={t('hero.widget.levelValueText')}
        className="h-2.5 overflow-hidden rounded-[5px] bg-charge-surface"
      >
        <div
          style={{ width: `${chargeLevelPercent}%` }}
          className="h-full origin-left bg-charge motion-safe:transition-transform motion-safe:delay-500 motion-safe:duration-[1400ms] motion-safe:ease-out-expo motion-safe:[@starting-style]:scale-x-0"
        />
      </div>
      <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 text-xs text-slate-ink lg:text-[13px]">
        <span>{t('hero.widget.level')}</span>
        <span>{t('hero.widget.forecast')}</span>
      </div>
    </div>
  );
};
