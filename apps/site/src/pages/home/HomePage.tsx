import '@/lib/i18n/namespaces/home';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { ContactSection } from '@/components/home/ContactSection';
import { HeroSection } from '@/components/home/HeroSection';
import { PartnersSection } from '@/components/home/PartnersSection';
import { PromoTilesSection } from '@/components/home/PromoTilesSection';
import { SimulatorSection } from '@/components/home/SimulatorSection';
import { SolutionsSection } from '@/components/home/SolutionsSection';
import { StepsSection } from '@/components/home/StepsSection';
import { WhySolianceSection } from '@/components/home/WhySolianceSection';

export const HomePage = () => {
  useScrollReveal();

  return (
    <>
      <HeroSection />
      <PartnersSection />
      <SolutionsSection />
      <SimulatorSection />
      <StepsSection />
      <WhySolianceSection />
      <PromoTilesSection />
      <ContactSection />
    </>
  );
};
