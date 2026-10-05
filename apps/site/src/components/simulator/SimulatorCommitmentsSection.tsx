import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { containerClassName } from '@/components/home/containerClassName';
import { revealDelay } from '@/components/motion/revealDelay';

const commitmentKeys = ['dataUsed', 'noDataSold', 'fixedPrice'] as const;

export const SimulatorCommitmentsSection = () => {
  const { t } = useTranslation('simulator');

  return (
    <section aria-labelledby="simulator-commitments-title" className={cn(containerClassName, 'hz-simulator-commitments pb-16 lg:pb-24')}>
      <h2 id="simulator-commitments-title" className="sr-only">
        {t('commitments.title')}
      </h2>
      <ul className="grid gap-3 md:grid-cols-3 lg:gap-5">
        {commitmentKeys.map((key, index) => (
          <li key={key} data-reveal style={revealDelay(index)} className="border-t border-sand-line pt-6 lg:pr-8">
            <h3 className="text-xl font-normal tracking-[-0.035em]">{t(`commitments.${key}.title`)}</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-ink">{t(`commitments.${key}.description`)}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};
