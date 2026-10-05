import { RefObject, useEffect } from 'react';
import type { MotionKit } from '@/lib/motion/gsap';

export type MotionSetup = (kit: MotionKit, root: HTMLElement) => void | (() => void);

export const loadMotionKit = (): Promise<MotionKit> => import('@/lib/motion/gsap');

export const useLazyMotion = (scope: RefObject<HTMLElement | null>, setup: MotionSetup) => {
  useEffect(() => {
    let isMounted = true;
    let revert: (() => void) | undefined;

    loadMotionKit().then((kit) => {
      const root = scope.current;
      if (!isMounted || !root) return;
      const context = kit.gsap.context(() => setup(kit, root), root);
      revert = () => context.revert();
    });

    return () => {
      isMounted = false;
      revert?.();
    };
  }, [scope, setup]);
};
