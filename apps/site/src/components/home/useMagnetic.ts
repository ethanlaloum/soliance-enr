import { RefObject } from 'react';
import { motionQueries } from '@/lib/motion/motionQueries';
import { MotionSetup, useLazyMotion } from '@/lib/motion/useLazyMotion';

const pullRatio = 0.22;
const maxPullPx = 10;

const magneticMotion: MotionSetup = ({ gsap }, root) => {
  const mm = gsap.matchMedia();
  mm.add(`${motionQueries.finePointer} and ${motionQueries.allowMotion}`, () => {
    const detachers = gsap.utils.toArray<HTMLElement>('[data-magnetic]', root).map((element) => {
      const moveX = gsap.quickTo(element, 'x', { duration: 0.6, ease: 'power3.out' });
      const moveY = gsap.quickTo(element, 'y', { duration: 0.6, ease: 'power3.out' });
      const onPointerMove = (event: PointerEvent) => {
        const box = element.getBoundingClientRect();
        moveX(gsap.utils.clamp(-maxPullPx, maxPullPx, (event.clientX - (box.left + box.width / 2)) * pullRatio));
        moveY(gsap.utils.clamp(-maxPullPx, maxPullPx, (event.clientY - (box.top + box.height / 2)) * pullRatio));
      };
      const onPointerLeave = () => {
        moveX(0);
        moveY(0);
      };
      element.addEventListener('pointermove', onPointerMove);
      element.addEventListener('pointerleave', onPointerLeave);
      return () => {
        element.removeEventListener('pointermove', onPointerMove);
        element.removeEventListener('pointerleave', onPointerLeave);
      };
    });
    return () => detachers.forEach((detach) => detach());
  });
};

export const useMagnetic = (scope: RefObject<HTMLElement | null>) => useLazyMotion(scope, magneticMotion);
