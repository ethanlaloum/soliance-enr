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
      wide: '(min-width: 768px)',
      short: '(max-height: 599px)',
      reduceMotion: '(prefers-reduced-motion: reduce)',
    }, (context) => {
      const { desktop, reduceMotion } = context.conditions as { desktop: boolean; reduceMotion: boolean };
      if (reduceMotion) return;

      gsap.to(root.querySelector('[data-page-charge]'), {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
      });

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

      const story = root.querySelector<HTMLElement>('[data-energy-story]');
      if (story) {
        // Read the vector geometry before setting any animated styles.
        const paths = Array.from(story.querySelectorAll<SVGPathElement>('[data-energy-path]'))
          .map((path) => ({ path, length: path.getTotalLength(), kind: path.dataset.energyPath }));
        const pinWholeStory = window.innerWidth >= 768 && story.offsetHeight <= window.innerHeight + 1;
        const storySystem = story.querySelector<HTMLElement>('.energy-story__system');
        const canPin = pinWholeStory || (storySystem !== null && storySystem.offsetHeight <= window.innerHeight + 1);
        const energy = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            id: 'home-energy-story',
            trigger: pinWholeStory ? story : storySystem,
            start: canPin ? 'top top' : 'clamp(top 80%)',
            end: () => canPin ? `+=${Math.round(window.innerHeight * (pinWholeStory ? 2.3 : 1.35))}` : 'clamp(bottom 40%)',
            pin: canPin ? pinWholeStory ? story : storySystem : false,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            scrub: 0.8,
            refreshPriority: 2,
          },
        });
        energy.fromTo(story.querySelector('[data-energy-sun]'),
          { opacity: 0.45, scale: 0.9, transformOrigin: 'center center' },
          { opacity: 1, scale: 1, duration: 0.3 }, 0);
        energy.fromTo(story.querySelector('[data-energy-house]'),
          { opacity: 0.35 }, { opacity: 1, duration: 0.3 }, 0.15);
        paths.forEach(({ path, length, kind }) => {
          energy.fromTo(path, { strokeDasharray: length, strokeDashoffset: length }, {
            strokeDashoffset: 0,
            duration: kind === 'source' ? 0.32 : kind === 'home' ? 0.2 : 0.35,
          }, kind === 'source' ? 0 : kind === 'home' ? 0.25 : kind === 'storage' ? 0.4 : 0.65);
        });
        energy.fromTo(story.querySelector('[data-energy-node="battery"]'),
          { opacity: 0.3, scale: 0.88, transformOrigin: 'center center' },
          { opacity: 1, scale: 1, duration: 0.2 }, 0.6);
        energy.fromTo(story.querySelectorAll('[data-energy-node]:not([data-energy-node="battery"])'),
          { opacity: 0.3, scale: 0.88, transformOrigin: 'center center' },
          { opacity: 1, scale: 1, duration: 0.2, stagger: 0.06 }, 0.85);
        energy.fromTo(story.querySelector('[data-energy-signature]'),
          { scaleX: 0 }, { scaleX: 1, duration: 0.6 }, 0.15);
        energy.fromTo(story.querySelectorAll('[data-energy-use]'),
          { opacity: 0.4, y: 8 }, { opacity: 1, y: 0, duration: 0.2, stagger: 0.06 }, 0.85);
        story.querySelectorAll('[data-energy-phase]').forEach((phase, index) => {
          energy.fromTo(phase, { opacity: 0.25 }, { opacity: 1, duration: 0.2 }, index * 0.38);
        });
        energy.to(story.querySelector('[data-energy-cue]'), { opacity: 0, duration: 0.2 }, 0.9);
      }

      root.querySelectorAll<HTMLElement>('[data-solution-card]').forEach((card) => {
        const photo = card.querySelector('[data-solution-image]');
        if (desktop && photo) {
          gsap.fromTo(photo, { scale: 1.13, yPercent: -3 }, {
            scale: 1, yPercent: 0, ease: 'none',
            scrollTrigger: { trigger: card, start: 'clamp(top bottom)', end: 'clamp(center center)', scrub: 0.7 },
          });
          const icon = card.querySelector('[data-solution-icon] svg');
          const kind = card.dataset.solutionCard;
          gsap.fromTo(icon,
            kind === 'evCharger' ? { x: -8, opacity: 0.3 } : { rotation: kind === 'heatPump' ? -90 : -35, opacity: 0.3 },
            { x: 0, rotation: 0, opacity: 1, duration: 1.2, ease: 'power3.out',
              scrollTrigger: { trigger: card, start: 'clamp(top 75%)', once: true } });
        }
        gsap.fromTo(card.querySelector('[data-solution-charge]'), { scaleX: 0 }, {
          scaleX: 1, duration: 1.3, ease: 'power2.inOut',
          scrollTrigger: { trigger: card, start: 'clamp(top 80%)', once: true },
        });
      });

      const simulator = root.querySelector('[data-simulator]');
      if (simulator) {
        gsap.fromTo(simulator.querySelector('[data-simulator-halo]'), { x: 80, y: 50, opacity: 0.3 }, {
          x: -40, y: -30, opacity: 1, ease: 'none',
          scrollTrigger: { trigger: simulator, start: 'clamp(top bottom)', end: 'clamp(bottom top)', scrub: 0.8 },
        });
        if (desktop) {
          const charging = gsap.timeline({
            defaults: { ease: 'power3.out' },
            scrollTrigger: { trigger: simulator, start: 'clamp(top 75%)', once: true },
          });
          charging.fromTo(simulator.querySelector('[data-simulator-image]'), { scale: 1.12 }, { scale: 1, duration: 1.7 }, 0)
            .fromTo(simulator.querySelector('[data-autonomy-ring]'), { strokeDashoffset: 75 }, { strokeDashoffset: 0, duration: 1.5, ease: 'power2.inOut' }, 0.2)
            .fromTo(simulator.querySelectorAll('[data-estimate]'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 }, 0.5);
        }
      }

      const steps = root.querySelector('[data-installation-steps]');
      if (steps) {
        gsap.fromTo(steps.querySelector('[data-steps-charge]'), desktop ? { scaleX: 0 } : { scaleY: 0 }, {
          ...(desktop ? { scaleX: 1 } : { scaleY: 1 }), ease: 'none',
          scrollTrigger: { trigger: steps, start: 'clamp(top 75%)', end: desktop ? 'clamp(bottom 50%)' : 'clamp(bottom 70%)', scrub: 0.5 },
        });
        steps.querySelectorAll<HTMLElement>('[data-installation-step]').forEach((step, index) => {
          gsap.fromTo(step, { opacity: 0.4, y: 20 }, {
            opacity: 1, y: 0, duration: 0.8, delay: desktop ? index * 0.14 : 0, ease: 'power3.out',
            clearProps: 'transform,opacity',
            scrollTrigger: { trigger: desktop ? steps : step, start: 'clamp(top 78%)', once: true },
          });
        });
      }

      root.querySelectorAll<HTMLElement>('[data-team-image], [data-promo-image]').forEach((image) => {
        gsap.fromTo(image, { scale: 1.08, yPercent: -2 }, {
          scale: 1, yPercent: 0, ease: 'none',
          scrollTrigger: { trigger: image.parentElement, start: 'clamp(top bottom)', end: 'clamp(bottom 40%)', scrub: 0.7 },
        });
      });

      const groups = new Map<HTMLElement, HTMLElement[]>();
      root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((element) => {
        if (element.hasAttribute('data-installation-step')) return;
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
      if (!disposed) {
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
      }
    };
    void document.fonts.ready.then(refresh);

    return () => {
      disposed = true;
      media.revert();
    };
  }, { scope });
};
