import { useTranslation } from 'react-i18next';
import { paths } from '@/routes/paths';
import { EnergyPremiumHero } from '@/components/energy/EnergyPremiumHero';
import { ContactFormKind } from '@/components/contact/contactDialog';
import { professionalOffersAnchor, professionalStudyAnchor } from '@/components/professionals/professionalStudyAnchor';

export const ProfessionalsHeroSection = () => {
  const { t } = useTranslation(['professionals', 'common']);

  return <EnergyPremiumHero
    variant="pro"
    breadcrumb={t('common:nav.professionals')}
    eyebrow={t('hero.eyebrow')}
    title={t('hero.title')}
    accent={t('hero.titleAccent')}
    lead={t('hero.lead')}
    image="/images/projects/pertuis-gymnase-163-kwc-roof.webp"
    imageWidth={1280}
    imageHeight={720}
    imageAlt={t('hero.imageAlt')}
    primaryLabel={t('hero.requestStudy')}
    primaryKind={ContactFormKind.PROFESSIONAL}
    primaryHref={`#${professionalStudyAnchor}`}
    secondaryLabel={t('hero.seeReferences')}
    secondaryHref={paths.projects}
    caption={t('hero.caption')}
    learnLabel={t('hero.learn')}
    learnHref={`#${professionalOffersAnchor}`}
    trust={['range', 'lease', 'team'].map((key) => t(`hero.trust.${key}`))}
  />;
};
