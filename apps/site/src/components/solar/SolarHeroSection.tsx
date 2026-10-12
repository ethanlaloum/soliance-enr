import { useTranslation } from 'react-i18next';
import { EnergyPremiumHero } from '@/components/energy/EnergyPremiumHero';
import { paths } from '@/routes/paths';

export const SolarHeroSection = () => {
  const { t } = useTranslation('solar');
  return <EnergyPremiumHero
    variant="solar"
    breadcrumb={t('breadcrumb')}
    eyebrow={t('premium.eyebrow')}
    title={t('premium.title')}
    accent={t('premium.accent')}
    lead={t('premium.lead')}
    image="/images/solar/hero-roquebrune-villa.webp"
    imageWidth={1280}
    imageHeight={720}
    imageAlt={t('premium.imageAlt')}
    primaryLabel={t('hero.requestStudy')}
    secondaryLabel={t('hero.simulate')}
    secondaryHref={paths.simulator}
    caption={t('premium.caption')}
    learnLabel={t('premium.learn')}
    trust={['study', 'battery', 'teams'].map((key) => t(`premium.trust.${key}`))}
  />;
};
