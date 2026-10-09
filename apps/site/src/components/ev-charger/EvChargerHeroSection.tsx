import { useTranslation } from 'react-i18next';
import { EnergyPremiumHero } from '@/components/energy/EnergyPremiumHero';
import { businessAnchor } from '@/components/ev-charger/evChargerAnchors';

export const EvChargerHeroSection = () => {
  const { t } = useTranslation('evCharger');
  return <EnergyPremiumHero
    variant="charge"
    breadcrumb={t('hero.breadcrumb')}
    eyebrow={t('hero.eyebrow')}
    title={t('premium.title')}
    accent={t('premium.accent')}
    lead={t('premium.lead')}
    image="/images/solution-ev-charger.webp"
    imageAlt={t('premium.imageAlt')}
    primaryLabel={t('hero.requestQuote')}
    secondaryLabel={t('hero.businessSolutions')}
    secondaryHref={`#${businessAnchor}`}
    caption={t('premium.caption')}
    learnLabel={t('premium.learn')}
    trust={['irve', 'installation', 'connector'].map((key) => t(`hero.trust.${key}`))}
  />;
};
