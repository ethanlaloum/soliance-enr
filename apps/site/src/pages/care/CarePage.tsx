import '@/lib/i18n/namespaces/care';
import { useCallback, useState } from 'react';
import { useScrollOnNavigation } from '@/hooks/useScrollOnNavigation';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { careAnchors } from '@/components/care/careAnchors';
import { CareBrandsSection } from '@/components/care/CareBrandsSection';
import { CareBusinessSection } from '@/components/care/CareBusinessSection';
import { CareClaimSection } from '@/components/care/CareClaimSection';
import { CareFaqSection } from '@/components/care/CareFaqSection';
import { CareFooter } from '@/components/care/CareFooter';
import { CareHeader } from '@/components/care/CareHeader';
import { CareHeroSection } from '@/components/care/CareHeroSection';
import { CarePlansSection } from '@/components/care/CarePlansSection';
import { CareRequestContext } from '@/components/care/careRequestContext';
import { CareRequestType } from '@/components/care/careRequestSchema';
import { CareRequestDialog } from '@/components/care/CareRequestDialog';
import { CareRequestSection } from '@/components/care/CareRequestSection';
import { CareStepsSection } from '@/components/care/CareStepsSection';
import { CareTakeoverSection } from '@/components/care/CareTakeoverSection';
import { CareTeamSection } from '@/components/care/CareTeamSection';
import { CareWarrantySection } from '@/components/care/CareWarrantySection';

export const CarePage = () => {
  const [requestType, setRequestType] = useState(CareRequestType.SUBSCRIBE_CARE);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const openRequest = useCallback((type: CareRequestType) => {
    setRequestType(type);
    setIsRequestDialogOpen(true);
  }, []);
  useScrollOnNavigation();
  useScrollReveal();

  return (
    <CareRequestContext.Provider value={openRequest}>
      <div id={careAnchors.top} className="flex min-h-screen flex-col bg-care-canvas font-sans text-care-ink">
        <CareHeader />
        <main className="flex flex-1 flex-col">
          <CareHeroSection />
          <CareBrandsSection />
          <CareStepsSection />
          <CareWarrantySection />
          <CarePlansSection />
          <CareTakeoverSection />
          <CareClaimSection />
          <CareBusinessSection />
          <CareTeamSection />
          <CareFaqSection />
          <CareRequestSection requestType={requestType} onRequestTypeChange={setRequestType} />
        </main>
        <CareFooter />
      </div>
      {isRequestDialogOpen && (
        <CareRequestDialog requestType={requestType} onRequestTypeChange={setRequestType} onClose={() => setIsRequestDialogOpen(false)} />
      )}
    </CareRequestContext.Provider>
  );
};
