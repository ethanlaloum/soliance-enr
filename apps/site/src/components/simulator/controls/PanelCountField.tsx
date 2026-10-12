import { useCallback, useId, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { PanelCountRange } from '@/app/simulator/domain/entities/SolarEstimate';
import { AnimatedNumber } from '@/components/simulator/controls/AnimatedNumber';
import { simulatorHintClassName } from '@/components/simulator/simulatorStyles';
import { fieldLabelClassName } from '@/components/ui/fieldStyles';

type PanelCountFieldProps = {
  panelCount: number;
  installedKwc: number;
  recommendedPanelCount: number;
  recommendedKwc: number;
  isCustom: boolean;
  isReferenceHousehold?: boolean;
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
  isReferenceHousehold = false,
  range,
  onChange,
  id,
}: PanelCountFieldProps) => {
  const { t } = useTranslation('simulator');
  const generatedId = useId();
  const slider = useRef<HTMLInputElement>(null);
  const inputId = id ?? generatedId;
  const hintId = `${inputId}-hint`;
  const span = Math.max(range.max - range.min, 1);
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
      <div className="relative pt-5">
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
          max={range.max}
          step={1}
          value={Math.min(Math.max(panelCount, range.min), range.max)}
          aria-valuetext={valueText}
          aria-describedby={hintId}
          className="h-11 w-full cursor-pointer accent-solar"
          onChange={(event) => onChange(Number(event.target.value))}
        />
      </div>
      <p id={hintId} className={simulatorHintClassName}>
        {isCustom
          ? t(isReferenceHousehold ? 'controls.panelCount.customReferenceHint' : 'controls.panelCount.customHint', { count: recommendedPanelCount, kwc: recommendedKwc })
          : t(isReferenceHousehold ? 'controls.panelCount.referenceHint' : 'controls.panelCount.hint')}
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
