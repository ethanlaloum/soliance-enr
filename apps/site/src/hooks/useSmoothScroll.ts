import { useEffect } from 'react';
import { motionQueries } from '@/lib/motion/motionQueries';
import { loadMotionKit } from '@/lib/motion/useLazyMotion';

const anchorScrollDurationSeconds = 1.6;

const isModifiedClick = (event: MouseEvent) => event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;

const findSamePageTarget = (event: MouseEvent): HTMLElement | null => {
  const link = event.target instanceof Element ? event.target.closest('a[href*="#"]') : null;
  if (!(link instanceof HTMLAnchorElement) || link.target === '_blank') return null;
  const url = new URL(link.href);
  const isSamePage = url.origin === window.location.origin && url.pathname === window.location.pathname;
  if (!isSamePage || url.hash.length < 2) return null;
  return document.getElementById(decodeURIComponent(url.hash.slice(1)));
};

const hashTarget = () => (window.location.hash.length > 1 ? document.getElementById(decodeURIComponent(window.location.hash.slice(1))) : null);

const focusWithoutScrolling = (target: HTMLElement) => {
  if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
};

export const useSmoothScroll = () => {
  useEffect(() => {
    let isMounted = true;
    let teardown: (() => void) | undefined;

    Promise.all([loadMotionKit(), import('lenis')]).then(([{ gsap, ScrollTrigger }, { default: Lenis }]) => {
      if (!isMounted) return;
      ScrollTrigger.refresh();
      hashTarget()?.scrollIntoView({ block: 'start' });
      document.fonts?.ready.then(() => isMounted && ScrollTrigger.refresh());

      if (window.matchMedia(motionQueries.reduceMotion).matches) return;

      const lenis = new Lenis({ lerp: 0.1 });
      const tick = (time: number) => lenis.raf(time * 1000);
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      const onClick = (event: MouseEvent) => {
        if (event.defaultPrevented || isModifiedClick(event)) return;
        const target = findSamePageTarget(event);
        if (!target) return;
        event.preventDefault();
        lenis.scrollTo(target, { duration: anchorScrollDurationSeconds, onComplete: () => focusWithoutScrolling(target) });
      };
      document.addEventListener('click', onClick, { capture: true });

      teardown = () => {
        document.removeEventListener('click', onClick, { capture: true });
        gsap.ticker.remove(tick);
        gsap.ticker.lagSmoothing(500, 33);
        lenis.destroy();
        document.documentElement.style.removeProperty('scroll-behavior');
        document.body.style.removeProperty('scroll-behavior');
      };
    });

    return () => {
      isMounted = false;
      teardown?.();
    };
  }, []);
};
