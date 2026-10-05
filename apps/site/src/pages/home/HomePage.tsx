import '@/lib/i18n/namespaces/home';
import { Suspense, useEffect, useState } from 'react';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { loadMotionKit } from '@/lib/motion/useLazyMotion';
import { ContactSection } from '@/components/home/ContactSection';
import { HeroSection } from '@/components/home/HeroSection';
import { PartnersSection } from '@/components/home/PartnersSection';
import { PromoTilesSection } from '@/components/home/PromoTilesSection';
import { SimulatorSection } from '@/components/home/SimulatorSection';
import { SolutionsSection } from '@/components/home/SolutionsSection';
import { StepsSection } from '@/components/home/StepsSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { WhySolianceSection } from '@/components/home/WhySolianceSection';
import { DesignSwitcher } from '@/components/home/designs/DesignSwitcher';
import { defaultHomeDesign, designStorageKey, HomeDesignId, homeDesigns, isHomeDesignId } from '@/components/home/designs/homeDesigns';

const NuitHome = () => (
  <>
    <HeroSection />
    <PartnersSection />
    <SolutionsSection />
    <SimulatorSection />
    <StepsSection />
    <WhySolianceSection />
    <TestimonialsSection />
    <PromoTilesSection />
    <ContactSection />
  </>
);

const readStoredDesign = (): HomeDesignId | null => {
  try {
    const requested = new URLSearchParams(window.location.search).get('design');
    if (isHomeDesignId(requested)) return requested;
    const stored = window.localStorage.getItem(designStorageKey);
    return isHomeDesignId(stored) ? stored : null;
  } catch {
    return null;
  }
};

const storeDesign = (id: HomeDesignId) => {
  try {
    window.localStorage.setItem(designStorageKey, id);
  } catch {
    return;
  }
};

export const HomePage = () => {
  const [design, setDesign] = useState<HomeDesignId>(defaultHomeDesign);
  const [isMounted, setIsMounted] = useState(false);

  useSmoothScroll();

  useEffect(() => {
    setIsMounted(true);
    const stored = import.meta.env.DEV ? readStoredDesign() : null;
    if (stored) setDesign(stored);
  }, []);

  useEffect(() => {
    let isActive = true;
    loadMotionKit().then(({ ScrollTrigger }) => {
      document.fonts?.ready.then(() => isActive && ScrollTrigger.refresh());
    });
    return () => {
      isActive = false;
    };
  }, [design]);

  const changeDesign = (id: HomeDesignId) => {
    storeDesign(id);
    window.scrollTo({ top: 0, behavior: 'instant' });
    setDesign(id);
  };

  const DesignComponent = homeDesigns.find((entry) => entry.id === design)?.Component ?? null;

  return (
    <>
      {DesignComponent ? (
        <Suspense fallback={<div className="min-h-screen bg-[#F7F4EE]" />}>
          <DesignComponent key={design} />
        </Suspense>
      ) : (
        <NuitHome />
      )}
      {import.meta.env.DEV && isMounted && <DesignSwitcher current={design} onChange={changeDesign} />}
    </>
  );
};
