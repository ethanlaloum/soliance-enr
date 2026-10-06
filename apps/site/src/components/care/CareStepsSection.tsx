import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { revealDelay } from '@/components/motion/revealDelay';
import { containerClassName } from '@/components/home/containerClassName';
import { careAnchors, careSectionScrollClassName } from '@/components/care/careAnchors';
import { ChipIcon, PlugIcon, TruckIcon } from '@/components/care/CareIcons';
import { careTitleClassName } from '@/components/care/careStyles';

type Step = { title: string; body: string };

const stepIcons = [PlugIcon, ChipIcon, TruckIcon];

export const CareStepsSection = () => {
  const { t } = useTranslation('care');
  const steps = t('steps.items', { returnObjects: true }) as Step[];

  return (
    <section id={careAnchors.howItWorks} aria-labelledby="care-steps-title" className={careSectionScrollClassName}>
      <div className={cn(containerClassName, 'flex flex-col gap-8 py-14 lg:gap-10 lg:py-[88px] desktop:px-20')}>
        <div data-reveal className="flex max-w-[760px] flex-col gap-3">
          <h2 id="care-steps-title" className={careTitleClassName}>
            {t('steps.title')}
          </h2>
          <p className="text-base leading-[1.55] text-care-muted lg:text-lg">{t('steps.intro')}</p>
        </div>
        <ol className="grid gap-4 md:grid-cols-3 lg:gap-7">
          {steps.map((step, index) => {
            const Icon = stepIcons[index];
            return (
              <li
                key={step.title}
                data-reveal
                style={revealDelay(index)}
                className="flex flex-col gap-3 rounded-2xl bg-white p-6 shadow-[0_1px_2px_rgba(15,42,31,0.06),0_10px_28px_rgba(15,42,31,0.08)] lg:p-8"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-care-surface text-care lg:h-14 lg:w-14">
                    {Icon && <Icon />}
                  </span>
                  <span aria-hidden="true" className="text-4xl font-semibold text-care-pale lg:text-[44px]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="text-lg font-bold lg:text-[21px]">{step.title}</h3>
                <p className="text-[15px] leading-[1.55] text-care-muted lg:text-base">{step.body}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
};
