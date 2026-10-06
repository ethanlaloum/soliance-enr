import '@/lib/i18n/namespaces/solar';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { SolarAidsAndFaqSection } from '@/components/solar/SolarAidsAndFaqSection';
import { SolarCareSection } from '@/components/solar/SolarCareSection';
import { SolarCtaSection } from '@/components/solar/SolarCtaSection';
import { SolarHardwareSection } from '@/components/solar/SolarHardwareSection';
import { SolarHeroSection } from '@/components/solar/SolarHeroSection';
import { SolarKeyFigures } from '@/components/solar/SolarKeyFigures';
import { SolarMethodSection } from '@/components/solar/SolarMethodSection';
import { SolarProjectsSection } from '@/components/solar/SolarProjectsSection';
import { SolarSizesSection } from '@/components/solar/SolarSizesSection';

export const SolarPage = () => {
  useScrollReveal();

  return (
    <>
      <SolarHeroSection />
      <SolarKeyFigures />
      <SolarSizesSection />
      <SolarMethodSection />
      <SolarHardwareSection />
      <SolarAidsAndFaqSection />
      <SolarCareSection />
      <SolarProjectsSection />
      <SolarCtaSection />
    </>
  );
};
