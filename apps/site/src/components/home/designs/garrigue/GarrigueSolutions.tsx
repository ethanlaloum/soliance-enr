import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import { MotionConditions, motionQueries } from '@/lib/motion/motionQueries';
import { MotionSetup, useLazyMotion } from '@/lib/motion/useLazyMotion';
import { containerClassName } from '@/components/home/containerClassName';
import { useHeadingReveal } from '@/components/home/useHeadingReveal';
import { solutionEntries } from '@/components/home/designs/homeContent';
import {
  archClosedClipPath,
  archOpenClipPath,
  displayTitleClassName,
  focusOnLightClassName,
  limeSectionClassName,
} from '@/components/home/designs/garrigue/garrigueTokens';

const solutionsMotion: MotionSetup = ({ gsap, ScrollTrigger }, root) => {
  const mm = gsap.matchMedia();
  mm.add({ desktop: motionQueries.desktop, reduceMotion: motionQueries.reduceMotion, allowMotion: motionQueries.allowMotion }, (context) => {
    const { desktop, reduceMotion } = context.conditions as MotionConditions;
    const list = root.querySelector<HTMLElement>('[data-g-solutions]');
    if (!desktop || reduceMotion || !list || ScrollTrigger.isInViewport(list, 0.15)) return;

    const arches = gsap.utils.toArray<HTMLElement>('[data-g-solution-arch]', list);
    const zooms = gsap.utils.toArray<HTMLElement>('[data-g-solution-zoom]', list);

    gsap
      .timeline({ scrollTrigger: { trigger: list, start: 'top 82%', once: true } })
      .fromTo(arches, { clipPath: archClosedClipPath }, { clipPath: archOpenClipPath, duration: 1.4, ease: 'expo.inOut', stagger: 0.14 }, 0)
      .fromTo(zooms, { scale: 1.2, yPercent: 6 }, { scale: 1, yPercent: 0, duration: 1.9, ease: 'expo.out', stagger: 0.14 }, 0.2);
  });
};

export const GarrigueSolutions = () => {
  const { t } = useTranslation('home');
  const sectionRef = useRef<HTMLElement>(null);

  useHeadingReveal(sectionRef);
  useLazyMotion(sectionRef, solutionsMotion);

  return (
    <section ref={sectionRef} aria-labelledby="solutions-title" className={limeSectionClassName}>
      <div className={cn(containerClassName, 'flex flex-col gap-8 pb-20 pt-16 lg:gap-16 lg:pb-32 lg:pt-28')}>
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-12 lg:items-end lg:gap-8">
          <h2 id="solutions-title" data-reveal-heading className={cn(displayTitleClassName, 'lg:col-span-6')}>
            {t('solutions.title')}
          </h2>
          <p className="hidden max-w-[480px] text-lg leading-[1.6] text-[#4A5E52] lg:col-span-5 lg:col-start-8 lg:block">{t('solutions.intro')}</p>
        </div>
        <ul data-g-solutions className="flex flex-col lg:grid lg:grid-cols-3 lg:gap-8 xl:gap-12">
          {solutionEntries.map((solution) => (
            <li key={solution.key} className="lg:flex">
              <Link
                to={solution.to}
                className={cn(
                  'group flex items-center gap-5 border-b border-[#1E3A2F]/10 py-5 text-[#1E3A2F] hover:text-[#1E3A2F] lg:w-full lg:flex-col lg:items-stretch lg:gap-8 lg:border-0 lg:py-0',
                  focusOnLightClassName,
                )}
              >
                <img
                  src={solution.thumbnail}
                  alt=""
                  width={84}
                  height={84}
                  loading="lazy"
                  className="g-arch h-[84px] w-[84px] shrink-0 object-cover lg:hidden"
                />
                <span data-g-solution-arch className="g-arch relative hidden aspect-[4/5] bg-[#B9C7B0]/50 lg:block">
                  <span data-g-solution-zoom className="absolute inset-0 block">
                    <img
                      src={solution.image}
                      alt={t(`solutions.${solution.key}.imageAlt`)}
                      width={900}
                      height={solution.imageHeight}
                      loading="lazy"
                      style={{ objectPosition: solution.objectPosition }}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.06] group-focus-visible:scale-[1.06] motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-focus-visible:scale-100"
                    />
                  </span>
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-1 lg:gap-4">
                  <span className="hidden text-[15px] font-medium text-[#A4522B] lg:block">{t(`solutions.${solution.key}.audience`)}</span>
                  <span className="g-display text-[22px] font-[460] leading-tight tracking-[-0.01em] lg:text-[clamp(2rem,2.8vw,2.75rem)] lg:leading-[1.02] lg:tracking-[-0.025em]">
                    {t(`solutions.${solution.key}.title`)}
                  </span>
                  <span className="text-sm text-[#4A5E52] lg:hidden">{t(`solutions.${solution.key}.shortDescription`)}</span>
                  <span className="hidden max-w-[420px] text-[17px] leading-[1.6] text-[#4A5E52] lg:block">{t(`solutions.${solution.key}.description`)}</span>
                  <span aria-hidden="true" className="hidden items-center gap-3 pt-2 text-[17px] font-semibold lg:mt-auto lg:flex">
                    {t('solutions.discover')}{' '}
                    <span className="inline-block text-[#C4673A] transition-transform duration-300 ease-out-expo group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5 motion-reduce:transition-none">
                      →
                    </span>
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
