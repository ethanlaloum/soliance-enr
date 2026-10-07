import { Outlet } from 'react-router';
import { usePhoneCallTracking } from '@/hooks/usePhoneCallTracking';
import { CookieConsent } from '@/components/consent/CookieConsent';

export const RootLayout = () => {
  usePhoneCallTracking();

  return (
    <>
      <Outlet />
      <CookieConsent />
    </>
  );
};
