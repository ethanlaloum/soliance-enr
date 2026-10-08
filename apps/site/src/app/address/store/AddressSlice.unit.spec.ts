import { describe, expect, it } from 'vitest';
import { addressReducer } from '@/app/address/store/AddressSlice';
import { AddressSuggestion } from '@/app/address/domain/entities/AddressSuggestion';
import {
  resetSearchAddressesState,
  searchAddressesFailed,
  searchAddressesRequested,
  searchAddressesSucceeded,
} from '@/app/address/domain/use-cases/search-addresses/searchAddressesEpic';

const showroom: AddressSuggestion = {
  id: '06123_0420_00030',
  label: '30 Avenue du Général Leclerc 06700 Saint-Laurent-du-Var',
  name: '30 Avenue du Général Leclerc',
  postalCode: '06700',
  city: 'Saint-Laurent-du-Var',
};

const withSuggestions = () => addressReducer(undefined, searchAddressesSucceeded({ suggestions: [showroom] }));

describe('Address search state', () => {
  it('stores the suggestions found', () => {
    expect(withSuggestions()).toEqual({ searchAddresses: { state: 'succeeded' }, suggestions: [showroom] });
  });

  it('keeps the previous suggestions while a searchable query is pending', () => {
    const state = addressReducer(withSuggestions(), searchAddressesRequested({ query: '30 avenue du g' }));

    expect(state).toEqual({ searchAddresses: { state: 'pending' }, suggestions: [showroom] });
  });

  it('clears the suggestions at once when the query becomes too short', () => {
    const state = addressReducer(withSuggestions(), searchAddressesRequested({ query: '30' }));

    expect(state).toEqual({ searchAddresses: { state: null }, suggestions: [] });
  });

  it('stores the error code and drops the suggestions on failure', () => {
    const state = addressReducer(withSuggestions(), searchAddressesFailed({ error: 'SEARCH_FAILED' }));

    expect(state).toEqual({ searchAddresses: { state: 'failed', errorCode: 'SEARCH_FAILED' }, suggestions: [] });
  });

  it('returns to the idle state on reset', () => {
    const state = addressReducer(withSuggestions(), resetSearchAddressesState());

    expect(state).toEqual({ searchAddresses: { state: null }, suggestions: [] });
  });
});
