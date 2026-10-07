import { useEffect } from 'react';
import { useCookieConsent } from '@/hooks/useCookieConsent';
import { CookieBanner } from '@/components/consent/CookieBanner';
import { CookiePreferencesDialog } from '@/components/consent/CookiePreferencesDialog';

export const CookieConsent = () => {
  const { isLoadIdle, isBannerVisible, isEditionOpen, isAnalyticsGranted, isSaving, load, decide, openEdition, closeEdition } = useCookieConsent();

  useEffect(() => {
    if (isLoadIdle) load();
  }, [isLoadIdle, load]);

  return (
    <>
      {isBannerVisible && (
        <CookieBanner isSaving={isSaving} onAcceptAll={() => decide(true)} onRefuseAll={() => decide(false)} onCustomize={openEdition} />
      )}
      {isEditionOpen && (
        <CookiePreferencesDialog isAnalyticsGranted={isAnalyticsGranted} isSaving={isSaving} onClose={closeEdition} onSave={decide} />
      )}
    </>
  );
};
