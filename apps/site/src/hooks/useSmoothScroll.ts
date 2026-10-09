import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

export const useSmoothScroll = () => {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.12,
      autoRaf: true,
      allowNestedScroll: true,
      stopInertiaOnNavigate: true,
      prevent: (node) => node instanceof HTMLDialogElement,
    });

    return () => lenis.destroy();
  }, []);
};
