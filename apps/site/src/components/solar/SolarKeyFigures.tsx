import { useTranslation } from 'react-i18next';
import { revealDelay } from '@/components/motion/revealDelay';
import { containerClassName } from '@/components/home/containerClassName';

const figureKeys = ['autonomy', 'coverage', 'installation', 'paperwork'] as const;

export const SolarKeyFigures = () => {
  const { t } = useTranslation('solar');

  return (
    <div className={containerClassName}>
      <dl aria-label={t('keyFigures.label')} className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-[18px]">
        {figureKeys.map((key, index) => (
          <div
            key={key}
            data-reveal
            style={revealDelay(index)}
            className="flex flex-col-reverse justify-end gap-1.5 rounded-[14px] border border-sand-line bg-white p-4 lg:p-6"
          >
            <dt className="text-[13px] leading-snug text-slate-ink lg:text-sm">{t(`keyFigures.${key}.label`)}</dt>
            <dd className="text-[22px] font-bold leading-tight text-solar lg:text-[32px]">{t(`keyFigures.${key}.value`)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
};
