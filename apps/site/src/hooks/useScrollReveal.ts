import { useEffect } from 'react';

const readyClassName = 'reveal-ready';

const isInViewport = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > 0;
};

export const useScrollReveal = () => {
  useEffect(() => {
    const root = document.documentElement;
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-revealed])'));
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      elements.forEach((element) => element.setAttribute('data-revealed', ''));
      return;
    }

    elements.filter(isInViewport).forEach((element) => element.setAttribute('data-revealed', ''));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute('data-revealed', '');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    );

    elements.filter((element) => !element.hasAttribute('data-revealed')).forEach((element) => observer.observe(element));
    root.classList.add(readyClassName);

    return () => {
      observer.disconnect();
      root.classList.remove(readyClassName);
    };
  }, []);
};
