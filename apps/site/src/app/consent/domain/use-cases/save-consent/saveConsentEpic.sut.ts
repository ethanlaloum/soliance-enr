import { firstValueFrom, of, toArray } from 'rxjs';
import { AppState } from '@/store/AppState';
import { InMemoryConsentGateway } from '@/app/consent/adapters/InMemoryConsentGateway';
import { FixedClock } from '@/app/shared/adapters/FixedClock';
import { fakeDependencies } from '@/app/shared/test/fakeDependencies';
import { saveConsentEpic, saveConsentRequested } from './saveConsentEpic';

export const createSaveConsentEpicSUT = () => {
  const consentGateway = new InMemoryConsentGateway();
  const clock = new FixedClock(new Date('2026-10-07T09:15:00.000Z'));
  const dependencies = fakeDependencies({ consentGateway, clock });

  return {
    givenStorageFails(error: Error) {
      consentGateway.willFailWith(error);
    },

    whenVisitorDecides(analytics: boolean) {
      return firstValueFrom(saveConsentEpic(of(saveConsentRequested({ analytics })), of({} as AppState), dependencies).pipe(toArray()));
    },

    thenSavedChoicesAre() {
      return consentGateway.savedChoices;
    },
  };
};
