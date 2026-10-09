import { catchError, map, Observable, throwError } from 'rxjs';
import { AddressLocation } from '@/app/address/domain/entities/AddressSuggestion';
import { CommuneSolarYield } from '@/app/solar-yield/domain/entities/CommuneSolarYield';
import { SolarYieldError, SolarYieldErrorType, SolarYieldGateway } from '@/app/solar-yield/domain/ports/SolarYieldGateway';
import { SolarYieldDto } from '@/app/solar-yield/adapters/dtos/SolarYieldDto';
import { HttpClient, isApiError } from '@/app/shared/domain/ports/HttpClient';

const monthsPerYear = 12;

const isValidYield = (dto: SolarYieldDto | null | undefined): dto is SolarYieldDto =>
  typeof dto?.yearlyKwhPerKwc === 'number' &&
  dto.yearlyKwhPerKwc > 0 &&
  Array.isArray(dto.monthlyKwhPerKwc) &&
  dto.monthlyKwhPerKwc.length === monthsPerYear &&
  dto.monthlyKwhPerKwc.every((month) => typeof month === 'number' && month >= 0);

export class SolianceRxSolarYieldGateway implements SolarYieldGateway {
  constructor(
    private httpClient: HttpClient,
    private endpoint: string,
  ) {}

  fetchSolarYield({ latitude, longitude }: AddressLocation): Observable<CommuneSolarYield> {
    const params = new URLSearchParams({ lat: latitude.toFixed(4), lon: longitude.toFixed(4) });

    return this.httpClient.get<SolarYieldDto>(`${this.endpoint}?${params.toString()}`).pipe(
      map(({ data }) => {
        if (!isValidYield(data)) throw new SolarYieldError(SolarYieldErrorType.FETCH_FAILED, 'Solar yield answer is malformed');
        return { yearlyKwhPerKwc: data.yearlyKwhPerKwc, monthlyKwhPerKwc: data.monthlyKwhPerKwc };
      }),
      catchError((error: unknown) =>
        throwError(() =>
          error instanceof SolarYieldError
            ? error
            : new SolarYieldError(SolarYieldErrorType.FETCH_FAILED, `Solar yield fetch failed with status ${isApiError(error) ? error.status : 'unknown'}`),
        ),
      ),
    );
  }
}
