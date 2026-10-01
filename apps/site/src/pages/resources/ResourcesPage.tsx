import '@/lib/i18n/namespaces/resources';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { FaqSection } from '@/components/resources/FaqSection';
import { GlossarySection } from '@/components/resources/GlossarySection';
import { NewsSection } from '@/components/resources/NewsSection';
import { ResourcesHero } from '@/components/resources/ResourcesHero';
import { ResourcesSectionNav } from '@/components/resources/ResourcesSectionNav';

export const ResourcesPage = () => {
  useScrollReveal();

  return (
    <>
      <ResourcesHero />
      <div>
        <ResourcesSectionNav />
        <NewsSection />
        <FaqSection />
        <GlossarySection />
      </div>
    </>
  );
};
