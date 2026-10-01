import '@/lib/i18n/namespaces/referral';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { ReferralConditionsSection } from '@/components/referral/ReferralConditionsSection';
import { ReferralHeroSection } from '@/components/referral/ReferralHeroSection';
import { ReferralStepsSection } from '@/components/referral/ReferralStepsSection';

export const ReferralPage = () => {
  useScrollReveal();

  return (
    <>
      <ReferralHeroSection />
      <ReferralStepsSection />
      <ReferralConditionsSection />
    </>
  );
};
