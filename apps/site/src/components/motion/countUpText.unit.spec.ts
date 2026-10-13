import { describe, expect, it } from 'vitest';
import { countUpText, isCountable } from '@/components/motion/countUpText';

describe('Count up text', () => {
  it('counts every number of a figure from zero, keeping what surrounds it', () => {
    expect(countUpText('280+', 0)).toEqual('0+');
    expect(countUpText('280+', 0.5)).toEqual('140+');
    expect(countUpText('−75 %', 0.4)).toEqual('−30 %');
    expect(countUpText('70 à 85 %', 0.2)).toEqual('14 à 17 %');
    expect(countUpText('6 kWc + 10 kWh', 0.5)).toEqual('3 kWc + 5 kWh');
  });

  it('keeps the thousands separator and the decimal comma of the figure', () => {
    expect(countUpText('≈ 7\u202f800 kWh', 0.5)).toEqual('≈ 3\u202f900 kWh');
    expect(countUpText('≈ 7\u202f800 kWh', 0.1)).toEqual('≈ 780 kWh');
    expect(countUpText('≈ 125 000 €', 0.25)).toEqual('≈ 31 250 €');
    expect(countUpText('11,5 kWh', 0)).toEqual('0,0 kWh');
    expect(countUpText('11,5 kWh', 0.5)).toEqual('5,8 kWh');
  });

  it('gives back the figure exactly once the count is over', () => {
    expect(countUpText('≈ 1\u202f543 kWh', 1)).toEqual('≈ 1\u202f543 kWh');
    expect(countUpText('21 014 kWh', 1)).toEqual('21 014 kWh');
  });

  it('leaves the digits of a product name alone', () => {
    expect(countUpText('X3 Forth 30 kW', 0.5)).toEqual('X3 Forth 15 kW');
  });

  it('counts a figure only when one of its numbers reaches ten', () => {
    expect(isCountable('70 à 85 %')).toEqual(true);
    expect(isCountable('6 kWc + 10 kWh')).toEqual(true);
    expect(isCountable('≈ 1\u202f300')).toEqual(true);
    expect(isCountable('1 à 3 jours')).toEqual(false);
    expect(isCountable('< 3 ans')).toEqual(false);
    expect(isCountable('7,5 ans')).toEqual(false);
    expect(isCountable('X3 Forth')).toEqual(false);
    expect(isCountable('A+++')).toEqual(false);
  });
});
