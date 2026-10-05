import { useEffect, useRef, type RefObject } from 'react';
import { motionQueries } from '@/lib/motion/motionQueries';

export const useCareMotion = (scope: RefObject<HTMLElement | null>, paused: boolean) => {
  const isPaused = useRef(paused);
  const syncPlayback = useRef<() => void>(() => {});

  useEffect(() => {
    isPaused.current = paused;
    syncPlayback.current();
  }, [paused]);

  useEffect(() => {
    let mounted = true;
    let cleanup: (() => void) | undefined;

    import('gsap').then(({ gsap }) => {
      const root = scope.current;
      if (!mounted || !root) return;
      const media = gsap.matchMedia();
      media.add(motionQueries.allowMotion, () => {
        const select = gsap.utils.selector(root);
        const animations: { tween: gsap.core.Tween; target: Element; visible: boolean }[] = [];
        const observeTween = (target: Element | null, tween: gsap.core.Tween) => {
          if (target) animations.push({ target, tween, visible: false });
        };
        const hero = root.querySelector('.care-hero-art');
        const watch = root.querySelector('.care-watch-visual');
        const monitor = root.querySelector('.care-monitor');

        observeTween(hero, gsap.to(select('.care-hero-satellite'), { rotation: 360, duration: 30, ease: 'none', repeat: -1, paused: true }));
        observeTween(hero, gsap.to(select('.care-hero-sun'), { rotation: 360, duration: 50, ease: 'none', repeat: -1, paused: true }));
        observeTween(hero, gsap.to(select('.care-hero-orbit-inner'), { scale: 1.055, duration: 4.5, ease: 'sine.inOut', repeat: -1, yoyo: true, paused: true }));
        observeTween(watch, gsap.to(select('.care-watch-visual > svg'), { rotation: 360, duration: 40, ease: 'none', repeat: -1, paused: true }));
        observeTween(monitor, gsap.fromTo(select('.care-chart-line'), { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 3, repeat: -1, repeatDelay: 5, ease: 'power1.inOut', paused: true }));

        const sync = () => animations.forEach(({ tween, visible }) => tween.paused(isPaused.current || document.hidden || !visible));
        syncPlayback.current = sync;
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => animations.filter(({ target }) => target === entry.target).forEach((animation) => { animation.visible = entry.isIntersecting; }));
          sync();
        }, { threshold: 0.05 });
        new Set(animations.map(({ target }) => target)).forEach((target) => observer.observe(target));
        document.addEventListener('visibilitychange', sync);

        return () => {
          observer.disconnect();
          document.removeEventListener('visibilitychange', sync);
          syncPlayback.current = () => {};
        };
      }, root);
      cleanup = () => media.revert();
    });

    return () => { mounted = false; cleanup?.(); };
  }, [scope]);
};
