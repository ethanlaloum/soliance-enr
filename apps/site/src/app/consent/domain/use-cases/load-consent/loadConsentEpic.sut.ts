import { firstValueFrom, of, toArray } from 'rxjs';
import { AppState } from '@/store/AppState';
import { ConsentChoice } from '@/app/consent/domain/entities/ConsentChoice';
import { InMemoryConsentGateway } from '@/app/consent/adapters/InMemoryConsentGateway';
import { FixedClock } from '@/app/shared/adapters/FixedClock';
import { fakeDependencies } from '@/app/shared/test/fakeDependencies';
import { loadConsentEpic, loadConsentRequested } from './loadConsentEpic';

export const createLoadConsentEpicSUT = () => {
  const consentGateway = new InMemoryConsentGateway();
  const clock = new FixedClock(new Date('2026-10-07T09:00:00.000Z'));
  const dependencies = fakeDependencies({ consentGateway, clock });

  return {
    givenStoredChoice(choice: ConsentChoice | null) {
      consentGateway.withStoredChoice(choice);
    },

    givenStorageFails(error: Error) {
      consentGateway.willFailWith(error);
    },

    whenConsentIsLoaded() {
      return firstValueFrom(loadConsentEpic(of(loadConsentRequested()), of({} as AppState), dependencies).pipe(toArray()));
    },
  };
};
