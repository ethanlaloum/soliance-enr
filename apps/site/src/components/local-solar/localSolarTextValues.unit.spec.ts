import { describe, expect, it } from 'vitest';
import { findServiceArea, serviceAreas } from '@/app/service-areas/domain/entities/ServiceArea';
import { formatTravelTime, localSolarTextValues } from '@/components/local-solar/localSolarTextValues';

describe('Local solar page text values', () => {
  it('writes a drive time under an hour in minutes and a longer one in hours and minutes', () => {
    expect(formatTravelTime(12)).toEqual('12 min');
    expect(formatTravelTime(60)).toEqual('1 h 00');
    expect(formatTravelTime(97)).toEqual('1 h 37');
  });

  it('gathers the figures every text of the Toulon page reads', () => {
    const toulon = findServiceArea(serviceAreas, 'toulon');

    expect(toulon && localSolarTextValues(toulon, 'Toulon')).toEqual({
      city: 'Toulon',
      travel: '1 h 37',
      km: 142,
      yield: 1543,
      power: 6,
      yearly: 9300,
      december: 486,
      july: 1056,
    });
  });
});
