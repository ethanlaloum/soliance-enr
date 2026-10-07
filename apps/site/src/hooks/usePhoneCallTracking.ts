import { useEffect } from 'react';
import { useAppDispatch } from '@/store/redux';
import { phoneCallClicked } from '@/app/analytics/domain/use-cases/track-conversion/trackConversionEpic';

const phoneLinkSelector = 'a[href^="tel:"]';

export const usePhoneCallTracking = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest(phoneLinkSelector) : null;
      const href = link?.getAttribute('href');
      if (href) dispatch(phoneCallClicked({ phoneNumber: href.slice('tel:'.length) }));
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [dispatch]);
};
