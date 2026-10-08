import { Action } from '@reduxjs/toolkit';
import { firstValueFrom, from, of, toArray } from 'rxjs';
import { AppState } from '@/store/AppState';
import { AddressSuggestion } from '@/app/address/domain/entities/AddressSuggestion';
import { InMemoryAddressGateway } from '@/app/address/adapters/InMemoryAddressGateway';
import { fakeDependencies } from '@/app/shared/test/fakeDependencies';
import { resetSearchAddressesState, searchAddressesEpic, searchAddressesRequested } from './searchAddressesEpic';

type SearchAddressesInput = ReturnType<typeof searchAddressesRequested> | ReturnType<typeof resetSearchAddressesState>;

export const createSearchAddressesEpicSUT = () => {
  const addressGateway = new InMemoryAddressGateway();
  const dependencies = fakeDependencies({ addressGateway });

  const run = (actions: SearchAddressesInput[]): Promise<Action[]> =>
    firstValueFrom(searchAddressesEpic(from(actions), of({} as AppState), dependencies).pipe(toArray()));

  return {
    givenGatewaySuggests(suggestions: AddressSuggestion[]) {
      addressGateway.willSuggest(suggestions);
    },

    givenGatewayFails(error: Error) {
      addressGateway.willFailWith(error);
    },

    whenAddressIsTyped(...queries: string[]) {
      return run(queries.map((query) => searchAddressesRequested({ query })));
    },

    whenSearchIsResetAfterTyping(query: string) {
      return run([searchAddressesRequested({ query }), resetSearchAddressesState()]);
    },

    thenSearchedQueriesAre() {
      return addressGateway.searchedQueries;
    },
  };
};
