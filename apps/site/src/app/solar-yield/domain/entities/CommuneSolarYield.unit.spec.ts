import { describe, expect, it } from 'vitest';
import { solarYieldKeyOf } from '@/app/solar-yield/domain/entities/CommuneSolarYield';

describe('Commune solar yield key', () => {
  it('rounds the location to the hundredth of a degree, the precision the PVGIS proxy caches at', () => {
    expect([solarYieldKeyOf({ latitude: 43.6638, longitude: 7.1488 }), solarYieldKeyOf({ latitude: 50.6, longitude: 3.04 })]).toEqual([
      '43.66,7.15',
      '50.60,3.04',
    ]);
  });
});
