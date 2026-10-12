import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { revealDelay } from '@/components/motion/revealDelay';
import { containerClassName } from '@/components/home/containerClassName';
import { ProfessionalStudyForm } from '@/components/professionals/ProfessionalStudyForm';
import { professionalStudyAnchor } from '@/components/professionals/professionalStudyAnchor';

const stepKeys = ['study', 'technical', 'delivery', 'operations'] as const;

export const MethodSection = () => {
  const { t } = useTranslation('professionals');

  return (
    <div className={cn(containerClassName, 'grid grid-cols-[minmax(0,1fr)] gap-10 pb-4 pt-14 lg:grid-cols-2 lg:gap-16 lg:pb-16 lg:pt-24')}>
      <section aria-labelledby="method-title" className="flex flex-col gap-6 lg:gap-8">
        <div data-reveal className="flex flex-col gap-3 lg:gap-4">
          <p className="energy-kicker">{t('method.kicker')}</p>
          <h2 id="method-title" className="energy-title">
            {t('method.title')}
          </h2>
        </div>
        <ol className="flex flex-col border-b border-sand-line">
          {stepKeys.map((key, index) => (
            <li key={key} data-reveal style={revealDelay(index)} className="grid grid-cols-[48px_minmax(0,1fr)] gap-3 border-t border-sand-line py-5 lg:grid-cols-[64px_minmax(0,1fr)] lg:py-6">
              <span aria-hidden="true" className="pt-0.5 text-[13px] font-semibold tabular-nums tracking-[0.12em] text-solar-dark">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="flex flex-col gap-1.5">
                <span className="text-[17px] font-medium tracking-[-0.015em] lg:text-lg">{t(`method.steps.${key}.title`)}</span>
                <span className="text-sm leading-[1.6] text-slate-ink">{t(`method.steps.${key}.description`)}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>
      <div id={professionalStudyAnchor} data-reveal style={revealDelay(1, 120)} className="scroll-mt-6 lg:self-start">
        <ProfessionalStudyForm />
      </div>
    </div>
  );
};
