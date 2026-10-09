import '@/lib/i18n/namespaces/heatPump';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { DaikinSection } from '@/components/heat-pump/DaikinSection';
import { HeatPumpAidSection } from '@/components/heat-pump/HeatPumpAidSection';
import { HeatPumpCtaSection } from '@/components/heat-pump/HeatPumpCtaSection';
import { HeatPumpHeroSection } from '@/components/heat-pump/HeatPumpHeroSection';
import { HeatPumpExplainer } from '@/components/heat-pump/HeatPumpExplainer';
import { HeatPumpProjectsSection } from '@/components/heat-pump/HeatPumpProjectsSection';
import { HeatPumpSolutionsSection } from '@/components/heat-pump/HeatPumpSolutionsSection';
import { HeatPumpStepsSection } from '@/components/heat-pump/HeatPumpStepsSection';
import '@/components/heat-pump/heat-pump-premium.css';

export const HeatPumpPage = () => {
  useScrollReveal();

  return (
    <div className="heat-pump-page flex flex-1 flex-col">
      <HeatPumpHeroSection />
      <HeatPumpExplainer />
      <HeatPumpSolutionsSection />
      <DaikinSection />
      <HeatPumpAidSection />
      <HeatPumpStepsSection />
      <HeatPumpProjectsSection />
      <HeatPumpCtaSection />
    </div>
  );
};
