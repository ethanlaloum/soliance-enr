import { AddressLocation } from '@/app/address/domain/entities/AddressSuggestion';

export interface CommuneSolarYield {
  yearlyKwhPerKwc: number;
  monthlyKwhPerKwc: number[];
}

const keyDecimals = 2;

export const solarYieldKeyOf = ({ latitude, longitude }: AddressLocation): string => `${latitude.toFixed(keyDecimals)},${longitude.toFixed(keyDecimals)}`;
