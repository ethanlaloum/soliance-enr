import '@/lib/i18n/namespaces/professionals';
import { useCountUp } from '@/hooks/useCountUp';
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
  useCountUp();

  return (
    <div className="energy-page flex flex-1 flex-col">
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
