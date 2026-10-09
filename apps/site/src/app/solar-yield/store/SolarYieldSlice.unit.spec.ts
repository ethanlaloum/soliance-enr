import { describe, expect, it } from 'vitest';
import { solarYieldReducer } from '@/app/solar-yield/store/SolarYieldSlice';
import {
  fetchSolarYieldFailed,
  fetchSolarYieldRequested,
  fetchSolarYieldSucceeded,
} from '@/app/solar-yield/domain/use-cases/fetch-solar-yield/fetchSolarYieldEpic';

const cagnes = { latitude: 43.66384, longitude: 7.14876 };
const cagnesYield = { yearlyKwhPerKwc: 1504, monthlyKwhPerKwc: [85, 94, 129, 141, 155, 160, 171, 162, 134, 110, 84, 80] };

describe('Commune solar yield state', () => {
  it('marks the location pending while its yield is fetched', () => {
    expect(solarYieldReducer(undefined, fetchSolarYieldRequested({ location: cagnes }))).toEqual({
      fetchSolarYield: { '43.66,7.15': { state: 'pending' } },
      byLocation: {},
    });
  });

  it('keeps the yield found for the location', () => {
    const pending = solarYieldReducer(undefined, fetchSolarYieldRequested({ location: cagnes }));

    expect(solarYieldReducer(pending, fetchSolarYieldSucceeded({ key: '43.66,7.15', solarYield: cagnesYield }))).toEqual({
      fetchSolarYield: { '43.66,7.15': { state: 'succeeded' } },
      byLocation: { '43.66,7.15': cagnesYield },
    });
  });

  it('stores the error code of the location without a yield', () => {
    const pending = solarYieldReducer(undefined, fetchSolarYieldRequested({ location: cagnes }));

    expect(solarYieldReducer(pending, fetchSolarYieldFailed({ key: '43.66,7.15', error: 'FETCH_FAILED' }))).toEqual({
      fetchSolarYield: { '43.66,7.15': { state: 'failed', errorCode: 'FETCH_FAILED' } },
      byLocation: {},
    });
  });
});
