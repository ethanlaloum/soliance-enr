import { describe, expect, it } from 'vitest';
import { findServiceArea, serviceAreas } from '@/app/service-areas/domain/entities/ServiceArea';
import { formatTravelTime, localSolarTextValues } from '@/components/local-solar/localSolarTextValues';

describe('Local solar page text values', () => {
  it('writes a drive time under an hour in minutes and a longer one in hours and minutes, never split across lines', () => {
    expect(formatTravelTime(12)).toEqual('12\u00a0min');
    expect(formatTravelTime(60)).toEqual('1\u00a0h\u00a000');
    expect(formatTravelTime(97)).toEqual('1\u00a0h\u00a037');
  });

  it('gathers the figures every text of the Toulon page reads', () => {
    const toulon = findServiceArea(serviceAreas, 'toulon');

    expect(toulon && localSolarTextValues(toulon, 'Toulon')).toEqual({
      city: 'Toulon',
      travel: '1\u00a0h\u00a037',
      km: 142,
      yield: 1543,
      power: 6,
      yearly: 9300,
      december: 486,
      july: 1056,
    });
  });
});
