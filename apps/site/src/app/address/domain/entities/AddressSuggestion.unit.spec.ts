import { describe, expect, it } from 'vitest';
import { AddressSuggestion, addressLineOf, isSearchableAddressQuery } from '@/app/address/domain/entities/AddressSuggestion';

const houseNumber: AddressSuggestion = {
  id: '06123_0420_00030',
  label: '30 Avenue du Général Leclerc 06700 Saint-Laurent-du-Var',
  name: '30 Avenue du Général Leclerc',
  postalCode: '06700',
  city: 'Saint-Laurent-du-Var',
  location: { latitude: 43.672097, longitude: 7.190202 },
};

describe('Address suggestion', () => {
  it('searches a query of at least three characters starting with a letter or a digit', () => {
    expect(['12 ', ' 12 a', 'ni', 'Nic', 'éze', '-- nice', '  '].map(isSearchableAddressQuery)).toEqual([false, true, false, true, true, false, false]);
  });

  it('turns a house number into the street followed by the city', () => {
    expect(addressLineOf(houseNumber)).toEqual('30 Avenue du Général Leclerc, Saint-Laurent-du-Var');
  });

  it('keeps the city alone for a municipality', () => {
    expect(addressLineOf({ id: '06088', label: 'Nice', name: 'Nice', postalCode: '06000', city: 'Nice', location: { latitude: 43.7032, longitude: 7.2528 } })).toEqual('Nice');
  });
});
