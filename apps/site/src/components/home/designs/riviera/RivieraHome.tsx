import '@fontsource-variable/unbounded';
import '@fontsource-variable/figtree';
import '@/components/home/designs/riviera/riviera.css';
import { useRef } from 'react';
import { useHeadingReveal } from '@/components/home/useHeadingReveal';
import { useMagnetic } from '@/components/home/useMagnetic';
import { RivieraContact } from '@/components/home/designs/riviera/RivieraContact';
import { RivieraHero } from '@/components/home/designs/riviera/RivieraHero';
import { RivieraPartners } from '@/components/home/designs/riviera/RivieraPartners';
import { RivieraSimulator } from '@/components/home/designs/riviera/RivieraSimulator';
import { RivieraSolutions } from '@/components/home/designs/riviera/RivieraSolutions';
import { RivieraSteps } from '@/components/home/designs/riviera/RivieraSteps';
import { RivieraTestimonials } from '@/components/home/designs/riviera/RivieraTestimonials';
import { RivieraTiles } from '@/components/home/designs/riviera/RivieraTiles';
import { RivieraWhy } from '@/components/home/designs/riviera/RivieraWhy';

export const RivieraHome = () => {
  const rootRef = useRef<HTMLDivElement>(null);

  useHeadingReveal(rootRef);
  useMagnetic(rootRef);

  return (
    <div ref={rootRef} className="riviera">
      <RivieraHero />
      <RivieraPartners />
      <RivieraSolutions />
      <RivieraSimulator />
      <RivieraSteps />
      <RivieraWhy />
      <RivieraTestimonials />
      <RivieraTiles />
      <RivieraContact />
    </div>
  );
};
