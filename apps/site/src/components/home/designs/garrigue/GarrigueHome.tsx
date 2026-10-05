import '@fontsource-variable/fraunces/full.css';
import '@fontsource-variable/work-sans';
import '@/components/home/designs/garrigue/garrigue.css';
import { useRef } from 'react';
import { MotionConditions, motionQueries } from '@/lib/motion/motionQueries';
import { MotionSetup, useLazyMotion } from '@/lib/motion/useLazyMotion';
import { GarrigueContact } from '@/components/home/designs/garrigue/GarrigueContact';
import { GarrigueHero } from '@/components/home/designs/garrigue/GarrigueHero';
import { GarriguePartners } from '@/components/home/designs/garrigue/GarriguePartners';
import { GarriguePromoTiles } from '@/components/home/designs/garrigue/GarriguePromoTiles';
import { GarrigueSimulator } from '@/components/home/designs/garrigue/GarrigueSimulator';
import { GarrigueSolutions } from '@/components/home/designs/garrigue/GarrigueSolutions';
import { GarrigueSteps } from '@/components/home/designs/garrigue/GarrigueSteps';
import { GarrigueTestimonials } from '@/components/home/designs/garrigue/GarrigueTestimonials';
import { GarrigueWhy } from '@/components/home/designs/garrigue/GarrigueWhy';

const tileWidth = (frieze: HTMLElement) => parseFloat(getComputedStyle(frieze).getPropertyValue('--g-tile')) || 0;

const friezeMotion: MotionSetup = ({ gsap }, root) => {
  const mm = gsap.matchMedia();
  mm.add({ desktop: motionQueries.desktop, reduceMotion: motionQueries.reduceMotion, allowMotion: motionQueries.allowMotion }, (context) => {
    const { desktop, reduceMotion } = context.conditions as MotionConditions;
    if (!desktop || reduceMotion) return;

    gsap.utils.toArray<HTMLElement>('[data-g-frieze]', root).forEach((frieze) => {
      gsap.fromTo(
        gsap.utils.toArray<HTMLElement>('[data-g-frieze-row]', frieze),
        { x: 0 },
        {
          x: (index: number) => (index % 2 === 0 ? 1 : -1) * tileWidth(frieze),
          ease: 'none',
          scrollTrigger: { trigger: frieze, start: 'clamp(top bottom)', end: 'clamp(bottom top)', scrub: 0.8, invalidateOnRefresh: true },
        },
      );
    });
  });
};

export const GarrigueHome = () => {
  const rootRef = useRef<HTMLDivElement>(null);

  useLazyMotion(rootRef, friezeMotion);

  return (
    <div ref={rootRef} className="garrigue flex flex-col">
      <GarrigueHero />
      <GarriguePartners />
      <GarrigueSolutions />
      <GarrigueSimulator />
      <GarrigueSteps />
      <GarrigueWhy />
      <GarrigueTestimonials />
      <GarriguePromoTiles />
      <GarrigueContact />
    </div>
  );
};
