import { Observable } from 'rxjs';
import { AddressSuggestion } from '@/app/address/domain/entities/AddressSuggestion';

export interface AddressGateway {
  searchAddresses(query: string): Observable<AddressSuggestion[]>;
}

export enum AddressErrorType {
  SEARCH_FAILED = 'SEARCH_FAILED',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export class AddressError extends Error {
  constructor(
    public readonly type: AddressErrorType,
    message: string,
  ) {
    super(message);
    this.name = 'AddressError';
  }
}
