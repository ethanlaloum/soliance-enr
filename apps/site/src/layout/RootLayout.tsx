import { Outlet } from 'react-router';
import { usePhoneCallTracking } from '@/hooks/usePhoneCallTracking';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { CookieConsent } from '@/components/consent/CookieConsent';

export const RootLayout = () => {
  usePhoneCallTracking();
  useSmoothScroll();

  return (
    <>
      <Outlet />
      <CookieConsent />
    </>
  );
};
