import { firstValueFrom, Observable, of, toArray } from 'rxjs';
import { AppState } from '@/store/AppState';
import { ConsentChoice } from '@/app/consent/domain/entities/ConsentChoice';
import { initialConsentState } from '@/app/consent/store/ConsentSlice';
import { InMemoryAnalyticsGateway } from '@/app/analytics/adapters/InMemoryAnalyticsGateway';
import { fakeDependencies } from '@/app/shared/test/fakeDependencies';
import { trackConversionEpic } from './trackConversionEpic';

type ConversionAction = Parameters<typeof trackConversionEpic>[0] extends Observable<infer A> ? A : never;

export const createTrackConversionEpicSUT = () => {
  const analyticsGateway = new InMemoryAnalyticsGateway();
  const dependencies = fakeDependencies({ analyticsGateway });
  let choice: ConsentChoice | null = null;

  return {
    givenConsentChoice(consentChoice: ConsentChoice | null) {
      choice = consentChoice;
    },

    whenConversionHappens(action: ConversionAction) {
      const state = { core: { consent: { consent: { ...initialConsentState, loadConsent: { state: 'succeeded' }, choice } } } } as AppState;
      return firstValueFrom(trackConversionEpic(of(action), of(state), dependencies).pipe(toArray()));
    },

    thenTrackedEventsAre() {
      return analyticsGateway.trackedEvents;
    },
  };
};
