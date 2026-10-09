import { Observable } from 'rxjs';
import { AddressLocation } from '@/app/address/domain/entities/AddressSuggestion';
import { CommuneSolarYield } from '@/app/solar-yield/domain/entities/CommuneSolarYield';

export interface SolarYieldGateway {
  fetchSolarYield(location: AddressLocation): Observable<CommuneSolarYield>;
}

export enum SolarYieldErrorType {
  FETCH_FAILED = 'FETCH_FAILED',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export class SolarYieldError extends Error {
  constructor(
    public readonly type: SolarYieldErrorType,
    message: string,
  ) {
    super(message);
    this.name = 'SolarYieldError';
  }
}
