import type { AddressLocation } from '@/app/address/domain/entities/AddressSuggestion';

const pixelsPerLongitudeDegree = 33.8;
const pixelsPerLatitudeDegree = 48.6;
const xAtLongitudeZero = 235.99;
const yAtLatitudeZero = 2541.78;

export type MapPoint = { x: number; y: number };

export const projectOnSunshineMap = ({ latitude, longitude }: AddressLocation): MapPoint => ({
  x: xAtLongitudeZero + longitude * pixelsPerLongitudeDegree,
  y: yAtLatitudeZero - latitude * pixelsPerLatitudeDegree,
});

const lille: AddressLocation = { latitude: 50.6311, longitude: 3.0468 };
const ajaccio: AddressLocation = { latitude: 41.9267, longitude: 8.7369 };

export const sunshineMapTransformOf = (projectOnOtherMap: (location: AddressLocation) => MapPoint): string => {
  const [fromA, fromB] = [projectOnOtherMap(lille), projectOnOtherMap(ajaccio)];
  const [toA, toB] = [projectOnSunshineMap(lille), projectOnSunshineMap(ajaccio)];
  const scaleX = (toB.x - toA.x) / (fromB.x - fromA.x);
  const scaleY = (toB.y - toA.y) / (fromB.y - fromA.y);
  const round = (value: number) => Number(value.toFixed(4));
  return `matrix(${round(scaleX)} 0 0 ${round(scaleY)} ${round(toA.x - fromA.x * scaleX)} ${round(toA.y - fromA.y * scaleY)})`;
};
