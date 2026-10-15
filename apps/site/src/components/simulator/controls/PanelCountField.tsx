import { useCallback, useId, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { PanelCountRange, solarEstimateParameters } from '@/app/simulator/domain/entities/SolarEstimate';
import { AnimatedNumber } from '@/components/simulator/controls/AnimatedNumber';
import { WholeNumberInput } from '@/components/simulator/controls/WholeNumberInput';
import { simulatorHintClassName } from '@/components/simulator/simulatorStyles';
import { fieldLabelClassName } from '@/components/ui/fieldStyles';

type PanelCountFieldProps = {
  panelCount: number;
  installedKwc: number;
  recommendedPanelCount: number;
  recommendedKwc: number;
  isCustom: boolean;
  range: PanelCountRange;
  onChange: (panelCount: number | null) => void;
  id?: string;
};

const thumbPx = 16;

export const PanelCountField = ({
  panelCount,
  installedKwc,
  recommendedPanelCount,
  recommendedKwc,
  isCustom,
  range,
  onChange,
  id,
}: PanelCountFieldProps) => {
  const { t } = useTranslation('simulator');
  const generatedId = useId();
  const slider = useRef<HTMLInputElement>(null);
  const inputId = id ?? generatedId;
  const countInputId = `${inputId}-count`;
  const hintId = `${inputId}-hint`;
  const exceedsRoof = panelCount > range.max;
  const sliderMax = Math.max(range.max, panelCount, recommendedPanelCount);
  const target = solarEstimateParameters.savingsTarget.autonomyPercent;
  const span = Math.max(sliderMax - range.min, 1);
  const markerShare = Math.min(Math.max((recommendedPanelCount - range.min) / span, 0), 1);
  const formatPanels = useCallback((value: number) => t('controls.panelCount.panels', { count: Math.round(value) }), [t]);
  const valueText = t('controls.panelCount.valueText', { count: panelCount, kwc: installedKwc });

  return (
    <div className={fieldLabelClassName}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={inputId}>{t('controls.panelCount.label')}</label>
        <span aria-hidden="true" className="shrink-0 text-base font-bold text-night">
          <AnimatedNumber value={panelCount} format={formatPanels} />
          <span className="font-semibold text-slate-ink"> · {t('controls.panelCount.kwc', { kwc: installedKwc })}</span>
        </span>
      </div>
      <div className="flex items-end gap-3">
      <div className="relative min-w-0 flex-1 pt-5">
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute top-0 flex -translate-x-1/2 flex-col items-center text-[10px] font-semibold uppercase tracking-wide text-[#a6540f]"
          animate={{ left: `calc(${markerShare * 100}% + ${(0.5 - markerShare) * thumbPx}px)` }}
          initial={false}
          transition={{ type: 'spring', stiffness: 260, damping: 30 }}
        >
          {t('controls.panelCount.recommendedMarker')}
          <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-solar" />
        </motion.span>
        <input
          ref={slider}
          id={inputId}
          type="range"
          min={range.min}
          max={sliderMax}
          step={1}
          value={Math.max(panelCount, range.min)}
          aria-valuetext={valueText}
          aria-describedby={hintId}
          className="h-11 w-full cursor-pointer accent-solar"
          onChange={(event) => onChange(Number(event.target.value))}
        />
      </div>
      <WholeNumberInput
        id={countInputId}
        value={panelCount}
        min={range.min}
        label={t('controls.panelCount.inputLabel')}
        describedBy={hintId}
        onChange={onChange}
      />
      </div>
      {exceedsRoof && (
        <p className="rounded-lg bg-solar/10 px-3 py-2 text-[13px] font-medium leading-snug text-[#7a3d08]">
          {t('controls.panelCount.beyondRoof', { count: range.max })}
        </p>
      )}
      <p id={hintId} className={simulatorHintClassName}>
        {isCustom ? t('controls.panelCount.customHint', { count: recommendedPanelCount, kwc: recommendedKwc, target }) : t('controls.panelCount.hint', { target })}
        {isCustom && (
          <button
            type="button"
            onClick={() => {
              onChange(null);
              slider.current?.focus();
            }}
            className="ml-1.5 font-semibold text-[#a6540f] underline decoration-solar/40 underline-offset-2 hover:decoration-solar"
          >
            {t('controls.panelCount.reset')}
          </button>
        )}
      </p>
    </div>
  );
};
