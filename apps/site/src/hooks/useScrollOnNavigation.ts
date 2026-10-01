import { useEffect } from 'react';
import { useLocation } from 'react-router';

const maxAttempts = 20;
const retryDelayMs = 100;

export const useScrollOnNavigation = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      return;
    }

    const targetId = decodeURIComponent(hash.slice(1));
    let attempts = 0;
    let timer: number | undefined;

    const scrollToTarget = () => {
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ block: 'start' });
        return;
      }
      attempts += 1;
      if (attempts < maxAttempts) timer = window.setTimeout(scrollToTarget, retryDelayMs);
    };

    scrollToTarget();
    return () => window.clearTimeout(timer);
  }, [pathname, hash]);
};
