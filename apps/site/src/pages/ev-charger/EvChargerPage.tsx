import '@/lib/i18n/namespaces/evCharger';
import { EnergyScrollExplainer } from '@/components/energy/EnergyScrollExplainer';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { AidsAndFaqSection } from '@/components/ev-charger/AidsAndFaqSection';
import { BusinessChargingSection } from '@/components/ev-charger/BusinessChargingSection';
import { ChargerUsagesSection } from '@/components/ev-charger/ChargerUsagesSection';
import { EvChargerCtaSection } from '@/components/ev-charger/EvChargerCtaSection';
import { EvChargerHeroSection } from '@/components/ev-charger/EvChargerHeroSection';
import { EvChargerProjectsSection } from '@/components/ev-charger/EvChargerProjectsSection';
import { SolarChargingSection } from '@/components/ev-charger/SolarChargingSection';

export const EvChargerPage = () => {
  useScrollReveal();

  return (
    <div className="energy-product-page energy-product-page--charge flex flex-1 flex-col">
      <EvChargerHeroSection />
      <EnergyScrollExplainer variant="charge" />
      <ChargerUsagesSection />
      <SolarChargingSection />
      <BusinessChargingSection />
      <AidsAndFaqSection />
      <EvChargerProjectsSection />
      <EvChargerCtaSection />
    </div>
  );
};
