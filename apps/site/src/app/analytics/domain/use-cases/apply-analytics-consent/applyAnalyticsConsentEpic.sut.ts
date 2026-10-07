import { firstValueFrom, Observable, of, toArray } from 'rxjs';
import { AppState } from '@/store/AppState';
import { InMemoryAnalyticsGateway } from '@/app/analytics/adapters/InMemoryAnalyticsGateway';
import { fakeDependencies } from '@/app/shared/test/fakeDependencies';
import { applyAnalyticsConsentEpic } from './applyAnalyticsConsentEpic';

type ConsentOutcome = Parameters<typeof applyAnalyticsConsentEpic>[0] extends Observable<infer A> ? A : never;

export const createApplyAnalyticsConsentEpicSUT = () => {
  const analyticsGateway = new InMemoryAnalyticsGateway();
  const dependencies = fakeDependencies({ analyticsGateway });

  return {
    givenAnalyticsFails(error: Error) {
      analyticsGateway.willFailWith(error);
    },

    whenConsentOutcomeIs(outcome: ConsentOutcome) {
      return firstValueFrom(applyAnalyticsConsentEpic(of(outcome), of({} as AppState), dependencies).pipe(toArray()));
    },

    thenAnalyticsSwitchesAre() {
      return analyticsGateway.switches;
    },
  };
};
