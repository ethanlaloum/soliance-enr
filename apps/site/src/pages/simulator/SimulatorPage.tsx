import '@/lib/i18n/namespaces/simulator';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Simulator } from '@/components/simulator/Simulator';
import { SimulatorCommitmentsSection } from '@/components/simulator/SimulatorCommitmentsSection';

export const SimulatorPage = () => {
  useScrollReveal();

  return (
    <>
      <Simulator />
      <SimulatorCommitmentsSection />
    </>
  );
};
