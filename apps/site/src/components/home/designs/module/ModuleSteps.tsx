import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { MotionConditions, motionQueries } from '@/lib/motion/motionQueries';
import { MotionSetup, useLazyMotion } from '@/lib/motion/useLazyMotion';
import { containerClassName } from '@/components/home/containerClassName';
import { useHeadingReveal } from '@/components/home/useHeadingReveal';
import { stepKeys } from '@/components/home/designs/homeContent';
import { Responsive } from '@/components/home/designs/Responsive';
import { titleXLClassName } from '@/components/home/designs/module/moduleClassNames';

const chargedClassName = 'is-charged';
const chargeLineRatio = 0.62;
const pinLengthRatio = 1.3;
const firstChargeLead = 0.75;

const stepsMotion: MotionSetup = ({ gsap, ScrollTrigger }, root) => {
  const stage = root.querySelector<HTMLElement>('[data-steps-stage]');
  const battery = root.querySelector<HTMLElement>('[data-steps]');
  if (!stage || !battery) return;
  const steps = gsap.utils.toArray<HTMLElement>('[data-step]', battery);

  const charge = (count: number) => {
    steps.forEach((step, index) => step.classList.toggle(chargedClassName, index < count));
    battery.toggleAttribute('data-full', count >= steps.length);
  };
  const countAtProgress = (progress: number) => Math.min(steps.length, Math.floor(progress * steps.length + firstChargeLead));
  const countAtChargeLine = () => steps.filter((step) => step.getBoundingClientRect().top < window.innerHeight * chargeLineRatio).length;

  const mm = gsap.matchMedia();
  mm.add({ desktop: motionQueries.desktop, reduceMotion: motionQueries.reduceMotion, allowMotion: motionQueries.allowMotion }, (context) => {
    const { desktop, reduceMotion } = context.conditions as MotionConditions;
    if (reduceMotion) return;

    battery.setAttribute('data-settling', '');
    battery.setAttribute('data-charging', '');

    if (desktop) {
      const trigger = ScrollTrigger.create({
        trigger: stage,
        start: () => (stage.offsetHeight > window.innerHeight ? 'bottom bottom' : 'top top'),
        end: () => `+=${Math.round(window.innerHeight * pinLengthRatio)}`,
        pin: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => charge(countAtProgress(self.progress)),
        onRefresh: (self) => charge(countAtProgress(self.progress)),
      });
      charge(countAtProgress(trigger.progress));
    } else {
      ScrollTrigger.create({
        trigger: battery,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: () => charge(countAtChargeLine()),
        onRefresh: () => charge(countAtChargeLine()),
      });
      charge(countAtChargeLine());
    }

    battery.getBoundingClientRect();
    battery.removeAttribute('data-settling');

    return () => {
      battery.removeAttribute('data-charging');
      battery.removeAttribute('data-full');
      steps.forEach((step) => step.classList.remove(chargedClassName));
    };
  });
};

export const ModuleSteps = () => {
  const { t } = useTranslation('home');
  const sectionRef = useRef<HTMLElement>(null);

  useHeadingReveal(sectionRef);
  useLazyMotion(sectionRef, stepsMotion);

  return (
    <section ref={sectionRef} aria-labelledby="steps-title" className="bg-white text-[#14181D]">
      <div data-steps-stage className={cn(containerClassName, 'flex flex-col gap-12 py-20 lg:min-h-screen lg:justify-center lg:gap-16 lg:pb-16 lg:pt-28')}>
        <h2 id="steps-title" data-reveal-heading className={titleXLClassName}>
          {t('steps.title')}
        </h2>
        <div data-steps className="mod-battery mb-3 lg:mb-0">
          <span aria-hidden="true" className="mod-battery-shell" />
          <ol className="mod-battery-steps">
            {stepKeys.map((key, index) => (
              <li key={key} data-step className="mod-step">
                <span aria-hidden="true" className="mod-segment">
                  <span className="mod-segment-fill" />
                  <span aria-hidden="true" className="mod-segment-number">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </span>
                <span className="flex flex-col gap-2 lg:gap-3">
                  <span className="mod-step-title text-lg font-bold leading-snug tracking-[-0.01em] lg:text-[22px] lg:leading-[1.2] lg:tracking-[-0.02em]">
                    <Responsive mobile={t(`steps.${key}.titleShort`)} desktop={t(`steps.${key}.title`)} />
                  </span>
                  <span className="text-[15px] leading-[1.55] text-[#4A535E] lg:text-base">
                    <Responsive mobile={t(`steps.${key}.descriptionShort`)} desktop={t(`steps.${key}.description`)} />
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};
