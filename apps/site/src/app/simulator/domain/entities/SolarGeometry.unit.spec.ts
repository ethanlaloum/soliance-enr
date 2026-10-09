import { describe, expect, it } from 'vitest';
import { clockOffsetHours, solarHourlyShape } from '@/app/simulator/domain/entities/SolarGeometry';

const nice = { latitude: 43.7032, longitude: 7.2528 };
const june = 5;
const december = 11;

const producingHours = (shape: number[]) => shape.flatMap((share, hour) => (share > 0 ? [hour] : []));
const peakHour = (shape: number[]) => shape.indexOf(Math.max(...shape));

describe('Solar geometry', () => {
  it('shifts the clock by the time zone, summer time and the longitude', () => {
    expect([clockOffsetHours(december, nice.longitude), clockOffsetHours(june, nice.longitude), clockOffsetHours(june, 0)].map((value) => Number(value.toFixed(4)))).toEqual([
      0.5165, 1.5165, 2,
    ]);
  });

  it('spreads a south roof day in Nice from sunrise to sunset, peaking after 13 h in June', () => {
    const shape = solarHourlyShape(nice, june, 30, [0]);
    expect([Number(shape.reduce((total, share) => total + share, 0).toFixed(6)), producingHours(shape), peakHour(shape)]).toEqual([
      1,
      [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      13,
    ]);
  });

  it('keeps a shorter day in December, peaking around 12 h', () => {
    const shape = solarHourlyShape(nice, december, 30, [0]);
    expect([producingHours(shape), peakHour(shape)]).toEqual([[8, 9, 10, 11, 12, 13, 14, 15, 16], 12]);
  });

  it('peaks in the morning for an east roof and in the afternoon for a west roof', () => {
    expect([peakHour(solarHourlyShape(nice, june, 30, [-90])), peakHour(solarHourlyShape(nice, june, 30, [90]))]).toEqual([11, 15]);
  });
});
