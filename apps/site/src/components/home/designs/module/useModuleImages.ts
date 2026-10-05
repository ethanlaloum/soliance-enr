import { RefObject } from 'react';
import { MotionConditions, motionQueries } from '@/lib/motion/motionQueries';
import { MotionSetup, useLazyMotion } from '@/lib/motion/useLazyMotion';

const parallaxShiftPercent = 6;

const gridOf = (image: HTMLElement, desktop: boolean) => ({
  cols: Number(desktop ? image.dataset.colsLg : image.dataset.cols),
  rows: Number(desktop ? image.dataset.rowsLg : image.dataset.rows),
});

const moduleImagesMotion: MotionSetup = ({ gsap, ScrollTrigger }, root) => {
  const mm = gsap.matchMedia();
  mm.add({ desktop: motionQueries.desktop, reduceMotion: motionQueries.reduceMotion, allowMotion: motionQueries.allowMotion }, (context) => {
    const { desktop, reduceMotion } = context.conditions as MotionConditions;
    if (reduceMotion) return;

    gsap.utils.toArray<HTMLElement>('[data-module-image]', root).forEach((image) => {
      if (image.offsetParent === null) return;
      const media = image.querySelector<HTMLElement>('[data-module-media]');

      if (desktop && media && image.hasAttribute('data-module-parallax')) {
        gsap.to(media, {
          yPercent: parallaxShiftPercent,
          ease: 'none',
          scrollTrigger: { trigger: image, start: 'clamp(top bottom)', end: 'bottom top', scrub: true },
        });
      }

      if (image.dataset.intro !== 'scroll' || ScrollTrigger.isInViewport(image, 0.1)) return;
      const { cols, rows } = gridOf(image, desktop);
      const covers = gsap.utils.toArray<HTMLElement>('[data-module-cover]', image).slice(0, cols * rows);

      gsap.fromTo(
        covers,
        { autoAlpha: 1, rotationX: 0, transformPerspective: 800, transformOrigin: '50% 0%' },
        {
          rotationX: -90,
          autoAlpha: 0,
          duration: desktop ? 0.85 : 0.6,
          ease: 'power2.inOut',
          stagger: { grid: [rows, cols], from: [0, 1], amount: desktop ? 0.85 : 0.5 },
          scrollTrigger: { trigger: image, start: 'top 82%', once: true },
        },
      );
    });
  });
};

export const useModuleImages = (scope: RefObject<HTMLElement | null>) => useLazyMotion(scope, moduleImagesMotion);
