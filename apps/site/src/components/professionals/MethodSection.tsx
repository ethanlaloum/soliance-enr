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
    <div className={cn(containerClassName, 'grid gap-8 pb-2 pt-12 lg:grid-cols-2 lg:gap-14 lg:pb-16 lg:pt-20')}>
      <section aria-labelledby="method-title" className="flex flex-col gap-5">
        <h2 id="method-title" data-reveal className="text-[28px] font-bold tracking-[-0.02em] lg:text-4xl">
          {t('method.title')}
        </h2>
        <ol className="flex flex-col gap-3.5 lg:gap-3">
          {stepKeys.map((key, index) => (
            <li key={key} data-reveal style={revealDelay(index)} className="flex items-start gap-4">
              <span aria-hidden="true" className="w-11 shrink-0 text-[22px] font-bold text-solar lg:text-[26px]">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="font-bold lg:text-[17px]">{t(`method.steps.${key}.title`)}</span>
                <span className="text-sm text-slate-ink">{t(`method.steps.${key}.description`)}</span>
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
