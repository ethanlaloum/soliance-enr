import { Observable, of, throwError } from 'rxjs';
import { AddressSuggestion } from '@/app/address/domain/entities/AddressSuggestion';
import { AddressGateway } from '@/app/address/domain/ports/AddressGateway';

export class InMemoryAddressGateway implements AddressGateway {
  public readonly searchedQueries: string[] = [];
  private suggestions: AddressSuggestion[] = [];
  private failure: Error | null = null;

  willSuggest(suggestions: AddressSuggestion[]): void {
    this.suggestions = suggestions;
  }

  willFailWith(error: Error): void {
    this.failure = error;
  }

  searchAddresses(query: string): Observable<AddressSuggestion[]> {
    this.searchedQueries.push(query);
    const failure = this.failure;
    if (failure) return throwError(() => failure);
    return of(this.suggestions);
  }
}
