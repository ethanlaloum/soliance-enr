import '@/lib/i18n/namespaces/localSolar';
import '@/lib/i18n/namespaces/solar';
import '@/lib/i18n/namespaces/projects';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { NotFoundPage } from '@/pages/not-found/NotFoundPage';
import { SolarCtaSection } from '@/components/solar/SolarCtaSection';
import { SolarMethodSection } from '@/components/solar/SolarMethodSection';
import { LocalSolarContextSection } from '@/components/local-solar/LocalSolarContextSection';
import { LocalSolarFacts } from '@/components/local-solar/LocalSolarFacts';
import { LocalSolarFaqSection } from '@/components/local-solar/LocalSolarFaqSection';
import { LocalSolarHeroSection } from '@/components/local-solar/LocalSolarHeroSection';
import { LocalSolarProductionSection } from '@/components/local-solar/LocalSolarProductionSection';
import { LocalSolarProjectsSection } from '@/components/local-solar/LocalSolarProjectsSection';
import { localSolarTextValues } from '@/components/local-solar/localSolarTextValues';
import { findServiceArea, serviceAreas } from '@/app/service-areas/domain/entities/ServiceArea';

export const LocalSolarPage = () => {
  useScrollReveal();
  const { t } = useTranslation('common');
  const { area: areaSlug } = useParams();
  const area = findServiceArea(serviceAreas, areaSlug);

  if (!area) return <NotFoundPage />;

  const values = localSolarTextValues(area, t(`serviceAreas.${area.slug}`));

  return (
    <>
      <LocalSolarHeroSection area={area} values={values} />
      <LocalSolarFacts values={values} />
      <LocalSolarProductionSection area={area} values={values} />
      <LocalSolarContextSection area={area} values={values} />
      <SolarMethodSection />
      <LocalSolarProjectsSection area={area} values={values} />
      <LocalSolarFaqSection area={area} values={values} />
      <SolarCtaSection />
    </>
  );
};
