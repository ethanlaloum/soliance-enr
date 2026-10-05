import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import { MotionConditions, motionQueries } from '@/lib/motion/motionQueries';
import { MotionSetup, useLazyMotion } from '@/lib/motion/useLazyMotion';
import { containerClassName } from '@/components/home/containerClassName';
import { solutionEntries } from '@/components/home/designs/homeContent';
import {
  rvFocusOnLightClassName,
  rvPhotoTintClassName,
  rvSectionSpacingClassName,
  rvTitleClassName,
} from '@/components/home/designs/riviera/rivieraClassNames';

type SolutionKey = (typeof solutionEntries)[number]['key'];

type PosterTheme = {
  block: string;
  audience: string;
  description: string;
  ring: string;
  seal: string;
};

const posterThemes: Record<SolutionKey, PosterTheme> = {
  solar: {
    block: 'lg:bg-[#E07B28] lg:text-[#0B1120]',
    audience: 'text-[#0B1120]',
    description: 'text-[#0B1120]',
    ring: 'ring-[#E07B28]',
    seal: 'bg-[#E07B28]',
  },
  heatPump: {
    block: 'lg:bg-[#1B3FA0] lg:text-white',
    audience: 'text-[#CFE0F5]',
    description: 'text-[#CFE0F5]',
    ring: 'ring-[#1B3FA0]',
    seal: 'bg-[#1B3FA0]',
  },
  evCharger: {
    block: 'lg:bg-[#0B1F4D] lg:text-white',
    audience: 'text-[#E07B28]',
    description: 'text-[#CFE0F5]',
    ring: 'ring-[#0B1F4D]',
    seal: 'bg-[#0B1F4D]',
  },
};

const posterTilts = [-4, 3, -2.5];

const postersMotion: MotionSetup = ({ gsap, ScrollTrigger }, root) => {
  const list = root.querySelector<HTMLElement>('[data-rv-posters]');
  const posters = gsap.utils.toArray<HTMLElement>('[data-rv-poster]', root);
  if (!list || posters.length === 0) return;

  const mm = gsap.matchMedia();
  mm.add({ desktop: motionQueries.desktop, reduceMotion: motionQueries.reduceMotion, allowMotion: motionQueries.allowMotion }, (context) => {
    const { desktop, reduceMotion } = context.conditions as MotionConditions;
    if (!desktop || reduceMotion || ScrollTrigger.isInViewport(list, 0.12)) return;

    gsap
      .timeline({ scrollTrigger: { trigger: list, start: 'top 82%', once: true } })
      .from(posters, { yPercent: 22, autoAlpha: 0, duration: 1.1, ease: 'power3.out', stagger: 0.13 }, 0)
      .from(
        posters,
        {
          rotation: (index: number) => posterTilts[index % posterTilts.length],
          transformOrigin: '50% 100%',
          duration: 1.6,
          ease: 'back.out(2.4)',
          stagger: 0.13,
        },
        0,
      );
  });
};

export const RivieraSolutions = () => {
  const { t } = useTranslation('home');
  const sectionRef = useRef<HTMLElement>(null);

  useLazyMotion(sectionRef, postersMotion);

  return (
    <section ref={sectionRef} aria-labelledby="solutions-title" className="bg-[#F1F5FB] text-[#0B1F4D]">
      <div className={cn(containerClassName, rvSectionSpacingClassName, 'flex flex-col gap-8 lg:gap-16')}>
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-12 lg:items-end lg:gap-8">
          <h2 id="solutions-title" data-reveal-heading className={cn(rvTitleClassName, 'lg:col-span-6')}>
            {t('solutions.title')}
          </h2>
          <p className="hidden max-w-[520px] text-lg leading-[1.6] text-[#0B1F4D] lg:col-span-5 lg:col-start-8 lg:block">{t('solutions.intro')}</p>
        </div>
        <ul data-rv-posters className="flex flex-col border-t border-[#0B1F4D]/15 lg:grid lg:grid-cols-3 lg:gap-6 lg:border-t-0">
          {solutionEntries.map((solution) => {
            const theme = posterThemes[solution.key];
            return (
              <li key={solution.key} data-rv-poster className="lg:flex">
                <Link
                  to={solution.to}
                  className={cn(
                    'group flex items-center gap-4 border-b border-[#0B1F4D]/15 py-4 text-[#0B1F4D] hover:text-[#0B1F4D] lg:w-full lg:flex-col lg:items-stretch lg:gap-0 lg:border-0 lg:bg-white lg:p-2.5',
                    rvFocusOnLightClassName,
                  )}
                >
                  <img
                    src={solution.thumbnail}
                    alt=""
                    width={84}
                    height={84}
                    loading="lazy"
                    className={cn('h-[76px] w-[76px] shrink-0 rounded-full object-cover ring-2 ring-offset-2 ring-offset-[#F1F5FB] lg:hidden', theme.ring)}
                  />
                  <span className="relative isolate hidden aspect-[5/4] overflow-hidden lg:block">
                    <img
                      src={solution.image}
                      alt={t(`solutions.${solution.key}.imageAlt`)}
                      width={900}
                      height={solution.imageHeight}
                      loading="lazy"
                      style={{ objectPosition: solution.objectPosition }}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04] group-focus-visible:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-focus-visible:scale-100"
                    />
                    <span aria-hidden="true" className={cn(rvPhotoTintClassName, 'riviera-tint-hue group-hover:opacity-0 group-focus-visible:opacity-0')} />
                    <span aria-hidden="true" className={cn(rvPhotoTintClassName, 'riviera-tint-floor group-hover:opacity-0 group-focus-visible:opacity-0')} />
                  </span>
                  <span className={cn('relative flex min-w-0 flex-1 flex-col gap-1 lg:gap-5 lg:p-6 xl:p-10', theme.block)}>
                    <span aria-hidden="true" className={cn('absolute right-6 top-0 hidden h-14 w-14 -translate-y-1/2 rounded-full lg:block xl:right-10', theme.seal)} />
                    <span className={cn('hidden text-sm font-semibold lg:block lg:text-[15px]', theme.audience)}>{t(`solutions.${solution.key}.audience`)}</span>
                    <span className="riviera-display text-base font-semibold uppercase leading-tight tracking-[-0.01em] lg:text-[clamp(1rem,1.7vw,1.625rem)] lg:leading-[1.08]">
                      {t(`solutions.${solution.key}.title`)}
                    </span>
                    <span className="text-sm text-[#0B1F4D]/80 lg:hidden">{t(`solutions.${solution.key}.shortDescription`)}</span>
                    <span className={cn('hidden max-w-[420px] text-base leading-[1.6] lg:block', theme.description)}>{t(`solutions.${solution.key}.description`)}</span>
                    <span aria-hidden="true" className="mt-auto hidden items-center gap-3 pt-3 text-base font-semibold lg:flex">
                      {t('solutions.discover')}{' '}
                      <span className="inline-block transition-transform duration-300 ease-out-expo group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5 motion-reduce:transition-none">
                        →
                      </span>
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};
