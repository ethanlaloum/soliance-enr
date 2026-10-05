import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { motionQueries } from '@/lib/motion/motionQueries';
import { MotionSetup, useLazyMotion } from '@/lib/motion/useLazyMotion';
import { containerClassName } from '@/components/home/containerClassName';
import { useHeadingReveal } from '@/components/home/useHeadingReveal';
import { stepKeys } from '@/components/home/designs/homeContent';
import { Responsive } from '@/components/home/designs/Responsive';
import { displayTitleClassName, limeSectionClassName } from '@/components/home/designs/garrigue/garrigueTokens';

const reachedClassName = 'is-reached';
const progressLine = 'top 62%';

const stepsMotion: MotionSetup = ({ gsap, ScrollTrigger }, root) => {
  const mm = gsap.matchMedia();
  mm.add(motionQueries.allowMotion, () => {
    const list = root.querySelector<HTMLElement>('[data-g-steps]');
    if (!list) return;
    const steps = gsap.utils.toArray<HTMLElement>('[data-g-step]', list);

    list.setAttribute('data-progress', '');
    steps.forEach((step, index) => {
      ScrollTrigger.create({
        trigger: step,
        start: progressLine,
        onEnter: () => step.classList.add(reachedClassName),
        onLeaveBack: () => step.classList.remove(reachedClassName),
      });
      const fill = step.querySelector('[data-g-step-fill]');
      const next = steps[index + 1];
      if (!fill || !next) return;
      gsap.fromTo(
        fill,
        { scaleY: 0 },
        { scaleY: 1, ease: 'none', scrollTrigger: { trigger: step, start: progressLine, endTrigger: next, end: progressLine, scrub: 0.4 } },
      );
    });

    return () => {
      list.removeAttribute('data-progress');
      steps.forEach((step) => step.classList.remove(reachedClassName));
    };
  });
};

export const GarrigueSteps = () => {
  const { t } = useTranslation('home');
  const sectionRef = useRef<HTMLElement>(null);

  useHeadingReveal(sectionRef);
  useLazyMotion(sectionRef, stepsMotion);

  return (
    <section ref={sectionRef} aria-labelledby="steps-title" className={limeSectionClassName}>
      <div className={cn(containerClassName, 'grid gap-12 py-20 lg:grid-cols-12 lg:gap-8 lg:py-36')}>
        <div className="lg:col-span-4">
          <h2 id="steps-title" data-reveal-heading className={cn(displayTitleClassName, 'lg:sticky lg:top-[18vh]')}>
            {t('steps.title')}
          </h2>
        </div>
        <ol data-g-steps className="g-steps flex flex-col lg:col-span-7 lg:col-start-6">
          {stepKeys.map((key, index) => (
            <li
              key={key}
              data-g-step
              className="relative grid grid-cols-[56px_1fr] gap-x-4 pb-12 pl-9 last:pb-0 lg:grid-cols-[148px_1fr] lg:gap-x-8 lg:pb-16 lg:pl-14"
            >
              {index < stepKeys.length - 1 && (
                <span aria-hidden="true" className="absolute -bottom-[18px] left-[9px] top-[30px] w-0.5 -translate-x-1/2 bg-[#1E3A2F]/15 lg:-bottom-[34px] lg:top-[46px]">
                  <span data-g-step-fill className="absolute inset-0 block origin-top bg-[#C4673A]" />
                </span>
              )}
              <span
                aria-hidden="true"
                className="g-step-marker absolute left-[9px] top-[18px] h-[10px] w-[20px] -translate-x-1/2 rounded-t-full bg-[#C4673A] lg:top-[34px]"
              />
              <span
                aria-hidden="true"
                className="g-step-number g-display text-[40px] font-[400] leading-none tracking-[-0.03em] text-[#C4673A] lining-nums lg:text-[88px]"
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="flex flex-col gap-2 pt-1 lg:gap-3 lg:pt-5">
                <span className="text-lg font-semibold leading-snug text-[#1E3A2F] lg:text-[26px] lg:leading-tight lg:tracking-[-0.015em]">
                  <Responsive mobile={t(`steps.${key}.titleShort`)} desktop={t(`steps.${key}.title`)} />
                </span>
                <span className="max-w-[540px] text-[15px] leading-[1.6] text-[#4A5E52] lg:text-[17px]">
                  <Responsive mobile={t(`steps.${key}.descriptionShort`)} desktop={t(`steps.${key}.description`)} />
                </span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};
