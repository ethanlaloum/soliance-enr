import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { Shading, shadings } from '@/app/simulator/domain/entities/SolarEstimate';
import { SegmentedControl } from '@/components/simulator/controls/SegmentedControl';
import { simulatorHintClassName } from '@/components/simulator/simulatorStyles';

type ShadingFieldProps = {
  value: Shading;
  onChange: (shading: Shading) => void;
};

export const ShadingField = ({ value, onChange }: ShadingFieldProps) => {
  const { t } = useTranslation('simulator');
  const labelId = useId();
  const hintId = useId();

  return (
    <div className="flex flex-col gap-1.5">
      <span id={labelId} className="text-[13px] font-semibold text-night sm:text-sm">
        {t('controls.shading.label')}
      </span>
      <SegmentedControl<Shading>
        labelId={labelId}
        describedBy={hintId}
        value={value}
        onChange={onChange}
        options={shadings.map((shading) => ({ value: shading, label: t(`controls.shading.options.${shading}`), hint: t(`controls.shading.hints.${shading}`) }))}
      />
      <p id={hintId} className={simulatorHintClassName}>
        {t('controls.shading.hint')}
      </p>
    </div>
  );
};
