import { useEffect, useState } from 'react';

const scrolledThresholdPx = 8;
const hideThresholdPx = 160;
const directionDeltaPx = 6;

export const useHeaderVisibility = (isLocked: boolean) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setIsScrolled(y > scrolledThresholdPx);
      if (Math.abs(y - lastY) < directionDeltaPx) return;
      setIsHidden(y > lastY && y > hideThresholdPx);
      lastY = y;
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return { isScrolled, isHidden: isHidden && !isLocked };
};
