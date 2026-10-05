import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { motionQueries } from '@/lib/motion/motionQueries';
import { MotionSetup, useLazyMotion } from '@/lib/motion/useLazyMotion';
import { containerClassName } from '@/components/home/containerClassName';
import { homeSectionTitleClassName } from '@/components/home/homeClassNames';
import { useHeadingReveal } from '@/components/home/useHeadingReveal';

const stepKeys = ['study', 'quote', 'paperwork', 'installation', 'followUp'] as const;
const reachedClassName = 'is-reached';
const progressLine = 'top 62%';

const stepsMotion: MotionSetup = ({ gsap, ScrollTrigger }, root) => {
  const mm = gsap.matchMedia();
  mm.add(motionQueries.allowMotion, () => {
    const list = root.querySelector<HTMLElement>('[data-steps-list]');
    if (!list) return;
    const steps = gsap.utils.toArray<HTMLElement>('[data-step]', list);

    list.setAttribute('data-progress', '');
    steps.forEach((step, index) => {
      ScrollTrigger.create({
        trigger: step,
        start: progressLine,
        onEnter: () => step.classList.add(reachedClassName),
        onLeaveBack: () => step.classList.remove(reachedClassName),
      });
      const fill = step.querySelector('[data-step-fill]');
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

export const StepsSection = () => {
  const { t } = useTranslation('home');
  const sectionRef = useRef<HTMLElement>(null);

  useHeadingReveal(sectionRef);

  useLazyMotion(sectionRef, stepsMotion);

  return (
    <section ref={sectionRef} aria-labelledby="steps-title" className={cn(containerClassName, 'grid gap-12 py-20 lg:grid-cols-12 lg:gap-8 lg:py-36')}>
      <div className="lg:col-span-4">
        <h2 id="steps-title" data-reveal-heading className={cn(homeSectionTitleClassName, 'lg:sticky lg:top-[18vh]')}>
          {t('steps.title')}
        </h2>
      </div>
      <ol data-steps-list className="steps-list flex flex-col lg:col-span-7 lg:col-start-6">
        {stepKeys.map((key, index) => (
          <li key={key} data-step className="relative grid grid-cols-[40px_1fr] gap-5 pb-10 last:pb-0 lg:grid-cols-[56px_1fr] lg:gap-10 lg:pb-16">
            {index < stepKeys.length - 1 && (
              <span aria-hidden="true" className="absolute bottom-0 left-5 top-10 w-px -translate-x-1/2 bg-sand-border lg:left-7 lg:top-14">
                <span data-step-fill className="absolute inset-0 block origin-top bg-solar" />
              </span>
            )}
            <span
              aria-hidden="true"
              className="step-number flex h-10 w-10 items-center justify-center rounded-full border border-solar bg-ivory text-[15px] font-semibold text-night transition-[color,background-color,border-color] duration-500 motion-reduce:transition-none lg:h-14 lg:w-14 lg:text-lg"
            >
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="flex flex-col gap-2 pt-1.5 lg:gap-3 lg:pt-2.5">
              <span className="text-lg font-bold leading-snug lg:text-[28px] lg:leading-tight lg:tracking-[-0.02em]">
                <span className="lg:hidden">{t(`steps.${key}.titleShort`)}</span>
                <span className="hidden lg:inline">{t(`steps.${key}.title`)}</span>
              </span>
              <span className="max-w-[560px] text-[15px] leading-[1.6] text-slate-ink lg:text-[17px]">
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
