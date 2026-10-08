import { firstValueFrom } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { SolianceRxAddressGateway } from '@/app/address/adapters/RealAddressGateway';
import { AddressError, AddressErrorType } from '@/app/address/domain/ports/AddressGateway';
import { FakeHttpClient } from '@/app/shared/test/FakeHttpClient';

const endpoint = 'https://data.geopf.fr/geocodage/search';
const searchUrl = `${endpoint}?q=30+avenue+du+g%C3%A9n%C3%A9ral&index=address&autocomplete=1&limit=5&lat=43.6721&lon=7.1902`;

const captureError = async (promise: Promise<unknown>): Promise<unknown> => {
  try {
    await promise;
  } catch (error) {
    return error;
  }
  return null;
};

describe('Address search gateway', () => {
  let httpClient: FakeHttpClient;
  let gateway: SolianceRxAddressGateway;

  beforeEach(() => {
    httpClient = new FakeHttpClient();
    gateway = new SolianceRxAddressGateway(httpClient, endpoint, { latitude: 43.6721, longitude: 7.1902 });
  });

  it('searches five addresses around the showroom and maps each feature to a suggestion', async () => {
    httpClient.willRespond(searchUrl, {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [7.190202, 43.672097] },
          properties: {
            id: '06123_0420_00030',
            label: '30 Avenue du Général Leclerc 06700 Saint-Laurent-du-Var',
            name: '30 Avenue du Général Leclerc',
            postcode: '06700',
            city: 'Saint-Laurent-du-Var',
            type: 'housenumber',
            score: 0.89,
          },
        },
        {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [7.2528, 43.7032] },
          properties: { id: '06088', label: 'Nice', name: 'Nice', postcode: '06000', city: 'Nice', type: 'municipality', score: 0.7 },
        },
      ],
    });

    const suggestions = await firstValueFrom(gateway.searchAddresses('30 avenue du général'));

    expect(httpClient.getCalls).toEqual([searchUrl]);
    expect(suggestions).toEqual([
      {
        id: '06123_0420_00030',
        label: '30 Avenue du Général Leclerc 06700 Saint-Laurent-du-Var',
        name: '30 Avenue du Général Leclerc',
        postalCode: '06700',
        city: 'Saint-Laurent-du-Var',
        location: { latitude: 43.672097, longitude: 7.190202 },
      },
      { id: '06088', label: 'Nice', name: 'Nice', postalCode: '06000', city: 'Nice', location: { latitude: 43.7032, longitude: 7.2528 } },
    ]);
  });

  it('turns an http failure into a search failure carrying the status', async () => {
    httpClient.willFail(searchUrl, 429);

    const error = await captureError(firstValueFrom(gateway.searchAddresses('30 avenue du général')));

    expect(error).toEqual(new AddressError(AddressErrorType.SEARCH_FAILED, 'Address search failed with status 429'));
    expect((error as AddressError).type).toEqual(AddressErrorType.SEARCH_FAILED);
  });
});
