import { catchError, map, Observable, throwError } from 'rxjs';
import { AddressSuggestion } from '@/app/address/domain/entities/AddressSuggestion';
import { AddressError, AddressErrorType, AddressGateway } from '@/app/address/domain/ports/AddressGateway';
import { AddressFeatureDto, AddressSearchDto } from '@/app/address/adapters/dtos/AddressSearchDto';
import { HttpClient, isApiError } from '@/app/shared/domain/ports/HttpClient';

export interface AddressSearchBias {
  latitude: number;
  longitude: number;
}

export const addressSuggestionLimit = 5;

const toSuggestion = ({ geometry, properties }: AddressFeatureDto): AddressSuggestion => ({
  id: properties.id,
  label: properties.label,
  name: properties.name,
  postalCode: properties.postcode,
  city: properties.city,
  location: { latitude: geometry.coordinates[1], longitude: geometry.coordinates[0] },
});

export class SolianceRxAddressGateway implements AddressGateway {
  constructor(
    private httpClient: HttpClient,
    private endpoint: string,
    private bias: AddressSearchBias,
  ) {}

  searchAddresses(query: string): Observable<AddressSuggestion[]> {
    const params = new URLSearchParams({
      q: query,
      index: 'address',
      autocomplete: '1',
      limit: String(addressSuggestionLimit),
      lat: String(this.bias.latitude),
      lon: String(this.bias.longitude),
    });

    return this.httpClient.get<AddressSearchDto>(`${this.endpoint}?${params.toString()}`).pipe(
      map((response) => response.data.features.map(toSuggestion)),
      catchError((error: unknown) =>
        throwError(
          () => new AddressError(AddressErrorType.SEARCH_FAILED, `Address search failed with status ${isApiError(error) ? error.status : 'unknown'}`),
        ),
      ),
    );
  }
}
