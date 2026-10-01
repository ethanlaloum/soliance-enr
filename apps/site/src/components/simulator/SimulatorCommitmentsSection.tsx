import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { containerClassName } from '@/components/home/containerClassName';
import { revealDelay } from '@/components/motion/revealDelay';

const commitmentKeys = ['dataUsed', 'noDataSold', 'fixedPrice'] as const;

export const SimulatorCommitmentsSection = () => {
  const { t } = useTranslation('simulator');

  return (
    <section aria-labelledby="simulator-commitments-title" className={cn(containerClassName, 'pb-14 lg:pb-16')}>
      <h2 id="simulator-commitments-title" className="sr-only">
        {t('commitments.title')}
      </h2>
      <ul className="grid gap-3 md:grid-cols-3 lg:gap-5">
        {commitmentKeys.map((key, index) => (
          <li key={key} data-reveal style={revealDelay(index)} className="rounded-[14px] border border-sand-line bg-white p-5 lg:p-[22px]">
            <h3 className="text-base font-bold">{t(`commitments.${key}.title`)}</h3>
            <p className="mt-1 text-sm leading-normal text-slate-ink">{t(`commitments.${key}.description`)}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};
