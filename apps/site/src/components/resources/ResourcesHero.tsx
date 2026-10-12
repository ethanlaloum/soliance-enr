import { useTranslation } from 'react-i18next';
import { paths } from '@/routes/paths';
import { EnergyPremiumHero } from '@/components/energy/EnergyPremiumHero';
import { resourceSectionIds } from '@/components/resources/resourceSectionIds';

export const ResourcesHero = () => {
  const { t } = useTranslation('resources');

  return <EnergyPremiumHero
    variant="resources"
    compact
    breadcrumb={t('hero.breadcrumb')}
    eyebrow={t('hero.eyebrow')}
    title={t('hero.title')}
    accent={t('hero.titleAccent')}
    lead={t('hero.lead')}
    image="/images/projects/vence-villa-16-kwc-panels-hills.webp"
    imageWidth={1280}
    imageHeight={853}
    imageAlt={t('hero.imageAlt')}
    primaryLabel={t('hero.requestStudy')}
    secondaryLabel={t('hero.simulate')}
    secondaryHref={paths.simulator}
    caption={t('hero.caption')}
    learnLabel={t('hero.learn')}
    learnHref={`#${resourceSectionIds[0]}`}
    trust={['team', 'topics', 'plain'].map((key) => t(`hero.trust.${key}`))}
  />;
};
