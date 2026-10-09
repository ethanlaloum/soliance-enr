import { Action } from '@reduxjs/toolkit';
import { firstValueFrom, from, of, toArray } from 'rxjs';
import { AppState } from '@/store/AppState';
import { AddressLocation } from '@/app/address/domain/entities/AddressSuggestion';
import { CommuneSolarYield } from '@/app/solar-yield/domain/entities/CommuneSolarYield';
import { InMemorySolarYieldGateway } from '@/app/solar-yield/adapters/InMemorySolarYieldGateway';
import { fakeDependencies } from '@/app/shared/test/fakeDependencies';
import { fetchSolarYieldEpic, fetchSolarYieldRequested } from './fetchSolarYieldEpic';

export const createFetchSolarYieldEpicSUT = () => {
  const solarYieldGateway = new InMemorySolarYieldGateway();
  const dependencies = fakeDependencies({ solarYieldGateway });

  return {
    givenGatewayAnswers(solarYield: CommuneSolarYield) {
      solarYieldGateway.willAnswer(solarYield);
    },

    givenGatewayFails(error: Error) {
      solarYieldGateway.willFailWith(error);
    },

    whenSolarYieldIsRequestedFor(location: AddressLocation): Promise<Action[]> {
      return firstValueFrom(fetchSolarYieldEpic(from([fetchSolarYieldRequested({ location })]), of({} as AppState), dependencies).pipe(toArray()));
    },

    thenFetchedLocationsAre() {
      return solarYieldGateway.fetchedLocations;
    },
  };
};
