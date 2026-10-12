import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { EvCharging, evChargings, solarEstimateParameters } from '@/app/simulator/domain/entities/SolarEstimate';
import { SegmentedControl } from '@/components/simulator/controls/SegmentedControl';
import { simulatorHintClassName } from '@/components/simulator/simulatorStyles';
import { fieldLabelClassName } from '@/components/ui/fieldStyles';

type ElectricVehicleDetailsProps = {
  kmPerYear: number;
  charging: EvCharging;
  onChange: (patch: { evKmPerYear?: number; evCharging?: EvCharging }) => void;
};

const kmRange = { min: 3000, max: 30000, step: 1000 };

export const ElectricVehicleDetails = ({ kmPerYear, charging, onChange }: ElectricVehicleDetailsProps) => {
  const { t } = useTranslation('simulator');
  const kmId = useId();
  const chargingLabelId = useId();
  const chargingHintId = useId();
  const yearlyKwh = Math.round((kmPerYear * solarEstimateParameters.evKwhPer100Km) / 100 / 10) * 10;
  const kmText = t('controls.electricVehicle.kmValue', { km: kmPerYear, kwh: yearlyKwh });

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden"
    >
      <div className="mt-3 flex flex-col gap-4 rounded-xl border border-sand-line bg-ivory p-4">
        <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-slate-ink">{t('controls.electricVehicle.title')}</p>
        <div className={fieldLabelClassName}>
          <div className="flex items-baseline justify-between gap-3">
            <label htmlFor={kmId}>{t('controls.electricVehicle.km')}</label>
            <output htmlFor={kmId} className="shrink-0 text-sm font-bold text-night">
              {kmText}
            </output>
          </div>
          <input
            id={kmId}
            type="range"
            min={kmRange.min}
            max={kmRange.max}
            step={kmRange.step}
            value={kmPerYear}
            aria-valuetext={kmText}
            className="h-11 w-full cursor-pointer accent-solar"
            onChange={(event) => onChange({ evKmPerYear: Number(event.target.value) })}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <span id={chargingLabelId} className="text-[13px] font-semibold text-night sm:text-sm">
            {t('controls.electricVehicle.charging')}
          </span>
          <SegmentedControl<EvCharging>
            labelId={chargingLabelId}
            describedBy={chargingHintId}
            value={charging}
            onChange={(evCharging) => onChange({ evCharging })}
            options={evChargings.map((option) => ({ value: option, label: t(`controls.electricVehicle.chargingOptions.${option}`) }))}
            className="bg-white"
          />
          <p id={chargingHintId} className={simulatorHintClassName}>
            {t('controls.electricVehicle.chargingHint')}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
