import { useTranslation } from 'react-i18next';
import { revealDelay } from '@/components/motion/revealDelay';
import { cn } from '@/lib/utils';
import { containerClassName, sectionTitleClassName } from '@/components/home/containerClassName';

const stepKeys = ['study', 'quote', 'paperwork', 'installation', 'followUp'] as const;

export const StepsSection = () => {
  const { t } = useTranslation('home');

  return (
    <section data-installation-steps aria-labelledby="steps-title" className={cn(containerClassName, 'home-steps flex flex-col gap-5 pb-2 pt-12 lg:gap-9 lg:pb-[88px] lg:pt-[104px]')}>
      <div data-reveal>
        <p className="home-kicker mb-3">{t('steps.eyebrow')}</p>
        <h2 id="steps-title" className={sectionTitleClassName}>
          {t('steps.title')}
        </h2>
      </div>
      <div className="home-steps__journey">
        <div className="home-steps__track" aria-hidden="true">
          <span data-steps-charge />
        </div>
        <ol className="home-steps__list relative flex flex-col gap-6 lg:grid lg:grid-cols-5 lg:gap-[18px]">
          {stepKeys.map((key, index) => (
            <li key={key} data-reveal data-installation-step style={revealDelay(index)} className="home-steps__card flex items-start gap-4 lg:flex-col lg:gap-3 lg:rounded-[14px] lg:p-6">
              <span aria-hidden="true" className="home-steps__number w-9 shrink-0 text-[22px] font-bold text-solar lg:w-auto lg:text-[40px]">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="home-steps__copy flex flex-col lg:gap-2.5">
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
      </div>
    </section>
  );
};
