import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { countUpText, isCountable } from '@/components/motion/countUpText';

const durationMs = 1600;
const easeOutCubic = (progress: number) => 1 - (1 - progress) ** 3;

const show = (figure: HTMLElement, progress: number) => {
  figure.textContent = countUpText(figure.dataset.countUp ?? '', progress);
};

export const useCountUp = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;

    const figures = Array.from(document.querySelectorAll<HTMLElement>('[data-count-up]'))
      .filter((figure) => isCountable(figure.dataset.countUp ?? ''));
    const frames = new Map<HTMLElement, number>();

    const play = (figure: HTMLElement) => {
      const start = performance.now();
      const step = (now: number) => {
        const progress = Math.min((now - start) / durationMs, 1);
        show(figure, easeOutCubic(progress));
        if (progress < 1) frames.set(figure, requestAnimationFrame(step));
        else frames.delete(figure);
      };
      frames.set(figure, requestAnimationFrame(step));
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          play(entry.target as HTMLElement);
        });
      },
      { threshold: 0.5 },
    );

    figures.forEach((figure) => {
      show(figure, 0);
      observer.observe(figure);
    });

    return () => {
      observer.disconnect();
      frames.forEach((frame) => cancelAnimationFrame(frame));
      figures.forEach((figure) => show(figure, 1));
    };
  }, [pathname]);
};
