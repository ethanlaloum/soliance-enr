import { useTranslation } from 'react-i18next';
import { revealDelay } from '@/components/motion/revealDelay';
import { cn } from '@/lib/utils';
import { containerClassName, sectionTitleClassName } from '@/components/home/containerClassName';

const stepKeys = ['study', 'quote', 'paperwork', 'installation', 'followUp'] as const;

export const StepsSection = () => {
  const { t } = useTranslation('home');

  return (
    <section aria-labelledby="steps-title" className={cn(containerClassName, 'flex flex-col gap-3.5 pb-2 pt-9 lg:gap-9 lg:pb-[72px] lg:pt-[88px]')}>
      <h2 id="steps-title" data-reveal className={sectionTitleClassName}>
        {t('steps.title')}
      </h2>
      <ol className="flex flex-col gap-2.5 lg:grid lg:grid-cols-5 lg:gap-[18px]">
        {stepKeys.map((key, index) => (
          <li key={key} data-reveal style={revealDelay(index)} className="flex items-start gap-3.5 lg:flex-col lg:gap-2.5 lg:rounded-[14px] lg:bg-white lg:p-6">
            <span aria-hidden="true" className="w-9 shrink-0 text-[22px] font-bold text-solar lg:w-auto lg:text-[40px]">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="flex flex-col lg:gap-2.5">
              <span className="font-bold lg:text-lg">
                <span className="lg:hidden">{t(`steps.${key}.titleShort`)}</span>
                <span className="hidden lg:inline">{t(`steps.${key}.title`)}</span>
              </span>
              <span className="text-[13px] text-slate-ink lg:text-sm lg:leading-normal">
                <span className="lg:hidden">{t(`steps.${key}.descriptionShort`)}</span>
                <span className="hidden lg:inline">{t(`steps.${key}.description`)}</span>
              </span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
};
