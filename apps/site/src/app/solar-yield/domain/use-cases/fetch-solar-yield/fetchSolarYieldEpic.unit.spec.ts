import { beforeEach, describe, expect, it } from 'vitest';
import { SolarYieldError, SolarYieldErrorType } from '@/app/solar-yield/domain/ports/SolarYieldGateway';
import { fetchSolarYieldFailed, fetchSolarYieldSucceeded } from './fetchSolarYieldEpic';
import { createFetchSolarYieldEpicSUT } from './fetchSolarYieldEpic.sut';

const cagnes = { latitude: 43.66384, longitude: 7.14876 };
const cagnesYield = { yearlyKwhPerKwc: 1504, monthlyKwhPerKwc: [85, 94, 129, 141, 155, 160, 171, 162, 134, 110, 84, 80] };

describe('Commune solar yield fetch', () => {
  let sut: ReturnType<typeof createFetchSolarYieldEpicSUT>;

  beforeEach(() => {
    sut = createFetchSolarYieldEpicSUT();
  });

  it('fetches the yield of the address location and files it under its rounded key', async () => {
    sut.givenGatewayAnswers(cagnesYield);

    const actions = await sut.whenSolarYieldIsRequestedFor(cagnes);

    expect(actions).toEqual([fetchSolarYieldSucceeded({ key: '43.66,7.15', solarYield: cagnesYield })]);
    expect(sut.thenFetchedLocationsAre()).toEqual([cagnes]);
  });

  it('propagates the gateway error code under the same key', async () => {
    sut.givenGatewayFails(new SolarYieldError(SolarYieldErrorType.FETCH_FAILED, 'Solar yield fetch failed with status 502'));

    const actions = await sut.whenSolarYieldIsRequestedFor(cagnes);

    expect(actions).toEqual([fetchSolarYieldFailed({ key: '43.66,7.15', error: 'FETCH_FAILED' })]);
  });

  it('falls back to the unknown error code for an untyped failure', async () => {
    sut.givenGatewayFails(new Error('network down'));

    const actions = await sut.whenSolarYieldIsRequestedFor(cagnes);

    expect(actions).toEqual([fetchSolarYieldFailed({ key: '43.66,7.15', error: 'UNKNOWN_ERROR' })]);
  });
});
