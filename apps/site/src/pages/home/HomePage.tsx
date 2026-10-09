import '@/lib/i18n/namespaces/home';
import '@/components/home/home-motion.css';
import { useRef } from 'react';
import { useHomeScrollMotion } from '@/hooks/useHomeScrollMotion';
import { ContactSection } from '@/components/home/ContactSection';
import { HeroSection } from '@/components/home/HeroSection';
import { PartnersSection } from '@/components/home/PartnersSection';
import { PromoTilesSection } from '@/components/home/PromoTilesSection';
import { SimulatorSection } from '@/components/home/SimulatorSection';
import { SolutionsSection } from '@/components/home/SolutionsSection';
import { StepsSection } from '@/components/home/StepsSection';
import { WhySolianceSection } from '@/components/home/WhySolianceSection';
import { EnergyFlowSection } from '@/components/home/EnergyFlowSection';
import { FranceSunshineSection } from '@/components/home/FranceSunshineSection';

export const HomePage = () => {
  const motionRef = useRef<HTMLDivElement>(null);
  useHomeScrollMotion(motionRef);

  return (
    <div ref={motionRef} className="home-motion">
      <div className="home-scroll-charge" aria-hidden="true"><span data-page-charge /></div>
      <HeroSection />
      <PartnersSection />
      <EnergyFlowSection />
      <FranceSunshineSection />
      <SolutionsSection />
      <SimulatorSection />
      <StepsSection />
      <WhySolianceSection />
      <PromoTilesSection />
      <ContactSection />
    </div>
  );
};
