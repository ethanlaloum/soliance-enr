import '@/components/solar/horizonSolutions.css';
import '@/lib/i18n/namespaces/professionals';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { CaseStudiesSection } from '@/components/professionals/CaseStudiesSection';
import { GuaranteesSection } from '@/components/professionals/GuaranteesSection';
import { MethodSection } from '@/components/professionals/MethodSection';
import { OffersSection } from '@/components/professionals/OffersSection';
import { ProfessionalsHeroSection } from '@/components/professionals/ProfessionalsHeroSection';
import { SchemesSection } from '@/components/professionals/SchemesSection';
import { StudyCtaSection } from '@/components/professionals/StudyCtaSection';

export const ProfessionalsPage = () => {
  useScrollReveal();

  return (
    <div className="hz-solution-page">
      <ProfessionalsHeroSection />
      <OffersSection />
      <CaseStudiesSection />
      <StudyCtaSection />
      <SchemesSection />
      <MethodSection />
      <GuaranteesSection />
    </div>
  );
};
