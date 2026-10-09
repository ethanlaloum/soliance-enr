import { firstValueFrom } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { SolianceRxSolarYieldGateway } from '@/app/solar-yield/adapters/RealSolarYieldGateway';
import { SolarYieldError, SolarYieldErrorType } from '@/app/solar-yield/domain/ports/SolarYieldGateway';
import { FakeHttpClient } from '@/app/shared/test/FakeHttpClient';

const endpoint = '/api/pvgis.php';
const cagnesUrl = `${endpoint}?lat=43.6638&lon=7.1488`;
const cagnes = { latitude: 43.66384, longitude: 7.14876 };
const cagnesMonthly = [85, 94, 129, 141, 155, 160, 171, 162, 134, 110, 84, 80];

const captureError = async (promise: Promise<unknown>): Promise<unknown> => {
  try {
    await promise;
  } catch (error) {
    return error;
  }
  return null;
};

describe('Commune solar yield gateway', () => {
  let httpClient: FakeHttpClient;
  let gateway: SolianceRxSolarYieldGateway;

  beforeEach(() => {
    httpClient = new FakeHttpClient();
    gateway = new SolianceRxSolarYieldGateway(httpClient, endpoint);
  });

  it('asks the PVGIS proxy for the address location and returns the yearly and monthly yield', async () => {
    httpClient.willRespond(cagnesUrl, { yearlyKwhPerKwc: 1504, monthlyKwhPerKwc: cagnesMonthly });

    const solarYield = await firstValueFrom(gateway.fetchSolarYield(cagnes));

    expect(httpClient.getCalls).toEqual([cagnesUrl]);
    expect(solarYield).toEqual({ yearlyKwhPerKwc: 1504, monthlyKwhPerKwc: cagnesMonthly });
  });

  it('turns an http failure into a fetch failure carrying the status', async () => {
    httpClient.willFail(cagnesUrl, 502);

    const error = await captureError(firstValueFrom(gateway.fetchSolarYield(cagnes)));

    expect(error).toEqual(new SolarYieldError(SolarYieldErrorType.FETCH_FAILED, 'Solar yield fetch failed with status 502'));
  });

  it('refuses an answer without twelve months', async () => {
    httpClient.willRespond(cagnesUrl, { yearlyKwhPerKwc: 1504, monthlyKwhPerKwc: [85, 94] });

    const error = await captureError(firstValueFrom(gateway.fetchSolarYield(cagnes)));

    expect(error).toEqual(new SolarYieldError(SolarYieldErrorType.FETCH_FAILED, 'Solar yield answer is malformed'));
  });
});
