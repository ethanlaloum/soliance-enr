import type { RefObject } from 'react';
import { motionQueries } from '@/lib/motion/motionQueries';
import { type MotionSetup, useLazyMotion } from '@/lib/motion/useLazyMotion';

const horizonMotion: MotionSetup = ({ gsap, ScrollTrigger }, root) => {
  const media = gsap.matchMedia();

  media.add(
    { desktop: motionQueries.desktop, allowMotion: motionQueries.allowMotion },
    (context) => {
      if (!context.conditions?.allowMotion) return;
      const desktop = Boolean(context.conditions.desktop);
      const select = gsap.utils.selector(root);

      // Content is visible in the server HTML and stays visible without JavaScript.
      // Each entrance plays once; scrolling back never hides content again.
      select('[data-hz-reveal]').forEach((element: HTMLElement) => {
        if (element.getBoundingClientRect().top < window.innerHeight * 0.85) return;
        gsap.from(element, {
          y: desktop ? 42 : 20,
          autoAlpha: 0,
          duration: desktop ? 1.05 : 0.65,
          ease: 'power3.out',
          clearProps: 'transform,opacity,visibility',
          scrollTrigger: { trigger: element, start: 'top 89%', once: true },
        });
      });

      const proof = root.querySelector('.hz-proof');
      gsap.from(select('.hz-proof dl > div'), {
        y: 24,
        autoAlpha: 0,
        stagger: 0.13,
        duration: 0.8,
        ease: 'power3.out',
        clearProps: 'transform,opacity,visibility',
        scrollTrigger: { trigger: proof, start: 'top 91%', once: true },
      });

      // Animate the image wrapper, so the hover zoom remains independent.
      if (desktop) {
        select('[data-hz-parallax]').forEach((element: HTMLElement) => {
          gsap.fromTo(element, { yPercent: -3 }, {
            yPercent: 3,
            ease: 'none',
            scrollTrigger: {
              trigger: element.parentElement,
              start: 'clamp(top bottom)',
              end: 'clamp(bottom top)',
              scrub: 0.7,
              invalidateOnRefresh: true,
            },
          });
        });
      }

      const diagram = root.querySelector('.hz-energy-diagram');
      const drawing = gsap.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: { trigger: diagram, start: 'top 78%', once: true },
      });
      drawing
        .from(select('.hz-diagram-sun'), { scale: 0.6, rotation: -65, autoAlpha: 0, duration: 1 }, 0)
        .from(select('.hz-orbit'), { scale: 0.8, opacity: 0, stagger: 0.12, duration: 1.3 }, 0.1)
        .from(select('.hz-energy-line'), { scaleY: 0, transformOrigin: 'top', duration: 0.7 }, 0.35)
        .fromTo(select('.hz-energy-home path'), { strokeDasharray: 1, strokeDashoffset: 1 }, {
          strokeDashoffset: 0, duration: 1.5, stagger: 0.18, ease: 'power1.inOut',
        }, 0.6)
        .from(select('.hz-energy-stages > span'), { y: 12, autoAlpha: 0, stagger: 0.16, duration: 0.6 }, 1.45)
        .from(select('.hz-energy-diagram > p'), { autoAlpha: 0, duration: 0.7 }, 1.75);

      gsap.from(select('.hz-process li'), {
        x: desktop ? 24 : 0,
        y: desktop ? 0 : 12,
        autoAlpha: 0,
        stagger: 0.1,
        duration: 0.75,
        ease: 'power3.out',
        clearProps: 'transform,opacity,visibility',
        scrollTrigger: { trigger: select('.hz-process ol')[0], start: 'top 86%', once: true },
      });

      gsap.from(select('.hz-signature > span'), {
        yPercent: 70,
        autoAlpha: 0,
        duration: 1.3,
        ease: 'power4.out',
        clearProps: 'transform,opacity,visibility',
        scrollTrigger: { trigger: select('.hz-signature')[0], start: 'top 94%', once: true },
      });

      // Accordion content, font loading and image decoding can move later sections.
      // Observe layout changes without creating extra animation objects in callbacks.
      let previousHeight = root.offsetHeight;
      let refreshFrame = 0;
      const observer = new ResizeObserver(() => {
        if (root.offsetHeight === previousHeight) return;
        previousHeight = root.offsetHeight;
        window.cancelAnimationFrame(refreshFrame);
        refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());
      });
      observer.observe(root);

      return () => {
        observer.disconnect();
        window.cancelAnimationFrame(refreshFrame);
      };
    },
    root,
  );

  return () => media.revert();
};

export const useHorizonMotion = (scope: RefObject<HTMLElement | null>) => useLazyMotion(scope, horizonMotion);
