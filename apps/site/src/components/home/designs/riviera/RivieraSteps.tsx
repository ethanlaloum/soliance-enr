import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { MotionConditions, motionQueries } from '@/lib/motion/motionQueries';
import { MotionSetup, useLazyMotion } from '@/lib/motion/useLazyMotion';
import { containerClassName } from '@/components/home/containerClassName';
import { stepKeys } from '@/components/home/designs/homeContent';
import { Responsive } from '@/components/home/designs/Responsive';
import { rvSectionSpacingClassName, rvTitleClassName } from '@/components/home/designs/riviera/rivieraClassNames';

const reachedClassName = 'is-reached';

const railwayMotion: MotionSetup = ({ gsap }, root) => {
  const list = root.querySelector<HTMLElement>('[data-rv-steps]');
  const steps = gsap.utils.toArray<HTMLElement>('[data-rv-step]', root);
  const fills = gsap.utils.toArray<HTMLElement>('[data-rv-rail-fill]', root);
  if (!list || steps.length === 0) return;

  const mm = gsap.matchMedia();
  mm.add({ desktop: motionQueries.desktop, reduceMotion: motionQueries.reduceMotion, allowMotion: motionQueries.allowMotion }, (context) => {
    const { desktop, reduceMotion } = context.conditions as MotionConditions;
    if (reduceMotion) return;

    const axis = desktop ? 'scaleX' : 'scaleY';
    const lastIndex = steps.length - 1;
    const markReached = (progress: number) => {
      const position = progress * lastIndex;
      steps.forEach((step, index) => step.classList.toggle(reachedClassName, index <= position + 0.001));
    };

    const timeline = gsap.timeline({
      defaults: { ease: 'none', duration: 1 },
      scrollTrigger: {
        trigger: list,
        start: desktop ? 'top 78%' : 'top 70%',
        end: desktop ? 'bottom 40%' : 'bottom 62%',
        scrub: 0.5,
      },
      onUpdate: () => markReached(timeline.progress()),
    });
    fills.forEach((fill) => timeline.fromTo(fill, { [axis]: 0 }, { [axis]: 1 }));

    return () => steps.forEach((step) => step.classList.remove(reachedClassName));
  });
};

export const RivieraSteps = () => {
  const { t } = useTranslation('home');
  const sectionRef = useRef<HTMLElement>(null);

  useLazyMotion(sectionRef, railwayMotion);

  return (
    <section ref={sectionRef} aria-labelledby="steps-title" className="bg-[#CFE0F5] text-[#0B1F4D]">
      <div className={cn(containerClassName, rvSectionSpacingClassName, 'flex flex-col gap-12 lg:gap-20')}>
        <h2 id="steps-title" data-reveal-heading className={cn(rvTitleClassName, 'max-w-[760px]')}>
          {t('steps.title')}
        </h2>
        <ol data-rv-steps className="riviera-steps flex flex-col lg:grid lg:grid-cols-5 lg:gap-6">
          {stepKeys.map((key, index) => (
            <li key={key} data-rv-step className="relative grid grid-cols-[48px_1fr] gap-x-5 pb-10 last:pb-0 lg:flex lg:flex-col lg:gap-7 lg:pb-0">
              {index < stepKeys.length - 1 && (
                <span
                  aria-hidden="true"
                  className="riviera-rail absolute left-6 top-6 block h-full w-1.5 -translate-x-1/2 lg:left-8 lg:top-8 lg:h-1.5 lg:w-[calc(100%+1.5rem)] lg:-translate-y-1/2 lg:translate-x-0"
                >
                  <span data-rv-rail-fill className="riviera-rail-fill absolute inset-0 block" />
                </span>
              )}
              <span
                aria-hidden="true"
                className="riviera-station riviera-display relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-[#0B1F4D] text-[15px] font-semibold lg:h-16 lg:w-16 lg:text-lg"
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="flex flex-col gap-2 pt-2 lg:gap-3 lg:pr-2 lg:pt-0">
                <span className="text-lg font-bold leading-snug lg:leading-tight xl:text-xl">
                  <Responsive mobile={t(`steps.${key}.titleShort`)} desktop={t(`steps.${key}.title`)} />
                </span>
                <span className="max-w-[560px] text-[15px] leading-[1.6] text-[#0B1F4D]/80 xl:text-base">
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
