import { RefObject } from 'react';
import { motionQueries } from '@/lib/motion/motionQueries';
import { MotionSetup, useLazyMotion } from '@/lib/motion/useLazyMotion';

const headingRevealMotion: MotionSetup = ({ gsap, ScrollTrigger, SplitText }, root) => {
  const mm = gsap.matchMedia();
  mm.add(motionQueries.allowMotion, () => {
    gsap.utils.toArray<HTMLElement>('[data-reveal-heading]', root).forEach((heading) => {
      if (ScrollTrigger.isInViewport(heading, 0.05)) return;
      let hasPlayed = false;
      SplitText.create(heading, {
        type: 'lines',
        mask: 'lines',
        linesClass: 'reveal-line',
        autoSplit: true,
        onSplit: (split) => {
          if (hasPlayed) return;
          return gsap.from(split.lines, {
            yPercent: 108,
            duration: 1.15,
            ease: 'expo.out',
            stagger: 0.09,
            scrollTrigger: { trigger: heading, start: 'top 86%', once: true },
            onComplete: () => {
              hasPlayed = true;
            },
          });
        },
      });
    });
  });
};

export const useHeadingReveal = (scope: RefObject<HTMLElement | null>) => useLazyMotion(scope, headingRevealMotion);
