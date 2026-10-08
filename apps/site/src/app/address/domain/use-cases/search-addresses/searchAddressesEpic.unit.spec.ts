import { beforeEach, describe, expect, it } from 'vitest';
import { AddressSuggestion } from '@/app/address/domain/entities/AddressSuggestion';
import { AddressError, AddressErrorType } from '@/app/address/domain/ports/AddressGateway';
import { searchAddressesFailed, searchAddressesSucceeded } from './searchAddressesEpic';
import { createSearchAddressesEpicSUT } from './searchAddressesEpic.sut';

const showroom: AddressSuggestion = {
  id: '06123_0420_00030',
  label: '30 Avenue du Général Leclerc 06700 Saint-Laurent-du-Var',
  name: '30 Avenue du Général Leclerc',
  postalCode: '06700',
  city: 'Saint-Laurent-du-Var',
};

describe('Address search', () => {
  let sut: ReturnType<typeof createSearchAddressesEpicSUT>;

  beforeEach(() => {
    sut = createSearchAddressesEpicSUT();
  });

  it('searches the trimmed query and returns the suggestions', async () => {
    sut.givenGatewaySuggests([showroom]);

    const actions = await sut.whenAddressIsTyped('  30 avenue du général  ');

    expect(actions).toEqual([searchAddressesSucceeded({ suggestions: [showroom] })]);
    expect(sut.thenSearchedQueriesAre()).toEqual(['30 avenue du général']);
  });

  it('searches only the last query typed within the debounce window', async () => {
    sut.givenGatewaySuggests([showroom]);

    const actions = await sut.whenAddressIsTyped('30 a', '30 av', '30 ave');

    expect(actions).toEqual([searchAddressesSucceeded({ suggestions: [showroom] })]);
    expect(sut.thenSearchedQueriesAre()).toEqual(['30 ave']);
  });

  it('does not search a query too short to be searched', async () => {
    const actions = await sut.whenAddressIsTyped('30');

    expect(actions).toEqual([]);
    expect(sut.thenSearchedQueriesAre()).toEqual([]);
  });

  it('drops a pending search when the suggestions are reset', async () => {
    const actions = await sut.whenSearchIsResetAfterTyping('30 avenue');

    expect(actions).toEqual([]);
    expect(sut.thenSearchedQueriesAre()).toEqual([]);
  });

  it('propagates the gateway error code', async () => {
    sut.givenGatewayFails(new AddressError(AddressErrorType.SEARCH_FAILED, 'Address search failed with status 429'));

    const actions = await sut.whenAddressIsTyped('30 avenue');

    expect(actions).toEqual([searchAddressesFailed({ error: 'SEARCH_FAILED' })]);
  });

  it('falls back to the unknown error code for an untyped failure', async () => {
    sut.givenGatewayFails(new Error('network down'));

    const actions = await sut.whenAddressIsTyped('30 avenue');

    expect(actions).toEqual([searchAddressesFailed({ error: 'UNKNOWN_ERROR' })]);
  });
});
