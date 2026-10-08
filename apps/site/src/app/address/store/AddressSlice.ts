import { createReducer } from '@reduxjs/toolkit';
import { CommonState } from '@/store/CommonState';
import { AddressSuggestion, isSearchableAddressQuery } from '@/app/address/domain/entities/AddressSuggestion';
import {
  resetSearchAddressesState,
  searchAddressesFailed,
  searchAddressesRequested,
  searchAddressesSucceeded,
} from '@/app/address/domain/use-cases/search-addresses/searchAddressesEpic';

export interface AddressState {
  searchAddresses: CommonState;
  suggestions: AddressSuggestion[];
}

const initialState: AddressState = {
  searchAddresses: { state: null },
  suggestions: [],
};

export const addressReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(searchAddressesRequested, (state, action) => {
      if (isSearchableAddressQuery(action.payload.query)) {
        state.searchAddresses = { state: 'pending' };
        return;
      }
      state.searchAddresses = initialState.searchAddresses;
      state.suggestions = [];
    })
    .addCase(searchAddressesSucceeded, (state, action) => {
      state.searchAddresses = { state: 'succeeded' };
      state.suggestions = action.payload.suggestions;
    })
    .addCase(searchAddressesFailed, (state, action) => {
      state.searchAddresses = { state: 'failed', errorCode: action.payload.error };
      state.suggestions = [];
    })
    .addCase(resetSearchAddressesState, () => initialState);
});
