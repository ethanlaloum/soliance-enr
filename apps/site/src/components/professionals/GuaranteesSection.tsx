import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { revealDelay } from '@/components/motion/revealDelay';
import { containerClassName } from '@/components/solar/horizonSolutionStyles';

const guaranteeKeys = ['financing', 'insurance', 'partners'] as const;

export const GuaranteesSection = () => {
  const { t } = useTranslation('professionals');

  return (
    <section aria-labelledby="guarantees-title" className={cn(containerClassName, 'pb-12 pt-6 lg:pb-20 lg:pt-0')}>
      <h2 id="guarantees-title" className="sr-only">
        {t('guarantees.title')}
      </h2>
      <dl className="grid gap-3 lg:grid-cols-3 lg:gap-5">
        {guaranteeKeys.map((key, index) => (
          <div
            key={key}
            data-reveal
            style={revealDelay(index)}
            className="flex flex-col gap-1.5 rounded-[4px] border border-sand-line bg-white p-5 lg:p-[22px]"
          >
            <dt className="text-xs font-medium uppercase tracking-[1px] text-slate lg:text-[13px]">{t(`guarantees.${key}.label`)}</dt>
            <dd className="text-base font-medium lg:text-[17px]">{t(`guarantees.${key}.value`)}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
};
