import { useTranslation } from 'react-i18next';
import { revealDelay } from '@/components/motion/revealDelay';
import { containerClassName } from '@/components/home/containerClassName';
import type { LocalSolarTextValues } from '@/components/local-solar/localSolarTextValues';

export const LocalSolarFacts = ({ values }: { values: LocalSolarTextValues }) => {
  const { t } = useTranslation('localSolar');
  const facts = [
    { key: 'yield', value: values.yield },
    { key: 'typical', value: values.yearly },
    { key: 'distance', value: null },
    { key: 'repair', value: null },
  ] as const;

  return (
    <div className={containerClassName}>
      <dl aria-label={t('facts.label', values)} className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-[18px]">
        {facts.map((fact, index) => (
          <div
            key={fact.key}
            data-reveal
            style={revealDelay(index)}
            className="flex flex-col-reverse justify-end gap-1.5 rounded-[14px] border border-sand-line bg-white p-4 lg:p-6"
          >
            <dt className="text-[13px] leading-snug text-slate-ink lg:text-sm">{t(`facts.${fact.key}.label`, values)}</dt>
            <dd className="text-[22px] font-bold leading-tight text-solar lg:text-[32px]">{t(`facts.${fact.key}.value`, { ...values, value: fact.value })}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
};
