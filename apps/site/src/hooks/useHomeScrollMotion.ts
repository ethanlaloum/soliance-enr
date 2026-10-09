import type { RefObject } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export const useHomeScrollMotion = (scope: RefObject<HTMLDivElement | null>) => {
  useGSAP(() => {
    const root = scope.current;
    if (!root) return;

    const media = gsap.matchMedia();
    media.add({
      desktop: '(min-width: 1024px)',
      mobile: '(max-width: 1023px)',
      reduceMotion: '(prefers-reduced-motion: reduce)',
    }, (context) => {
      const { desktop, reduceMotion } = context.conditions as { desktop: boolean; reduceMotion: boolean };
      if (reduceMotion) return;

      const film = root.querySelector('.villa-film');
      const scene = root.querySelector('.villa-film__scene');
      if (film && scene) {
        gsap.to(scene, {
          scale: desktop ? 1.065 : 1.04,
          yPercent: desktop ? 2.5 : 1,
          transformOrigin: 'center center',
          ease: 'none',
          scrollTrigger: {
            trigger: film,
            start: 'clamp(top top)',
            end: 'clamp(bottom top)',
            scrub: 0.65,
          },
        });
      }

      if (desktop) {
        gsap.to(root.querySelectorAll('[data-hero-scroll-copy]'), {
          y: -36,
          opacity: 0.75,
          ease: 'none',
          scrollTrigger: {
            trigger: root.querySelector('.villa-hero'),
            start: 'clamp(top top)',
            end: 'clamp(bottom top)',
            scrub: 0.65,
          },
        });
      }

      const groups = new Map<HTMLElement, HTMLElement[]>();
      root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((element) => {
        if (element.getBoundingClientRect().top < window.innerHeight * 0.9) return;
        const parent = element.parentElement;
        if (!parent) return;
        const group = groups.get(parent) ?? [];
        group.push(element);
        groups.set(parent, group);
      });

      groups.forEach((elements) => {
        gsap.fromTo(elements, { opacity: 0, y: desktop ? 36 : 22 }, {
          opacity: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.1,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: elements[0],
            start: 'clamp(top 90%)',
            once: true,
          },
        });
      });
    }, root);

    let disposed = false;
    const refresh = () => {
      if (!disposed) ScrollTrigger.refresh();
    };
    void document.fonts.ready.then(refresh);

    return () => {
      disposed = true;
      media.revert();
    };
  }, { scope });
};
