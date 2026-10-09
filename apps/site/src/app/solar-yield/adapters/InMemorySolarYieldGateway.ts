import { Observable, of, throwError } from 'rxjs';
import { AddressLocation } from '@/app/address/domain/entities/AddressSuggestion';
import { CommuneSolarYield } from '@/app/solar-yield/domain/entities/CommuneSolarYield';
import { SolarYieldGateway } from '@/app/solar-yield/domain/ports/SolarYieldGateway';

export class InMemorySolarYieldGateway implements SolarYieldGateway {
  public readonly fetchedLocations: AddressLocation[] = [];
  private solarYield: CommuneSolarYield | null = null;
  private failure: Error | null = null;

  willAnswer(solarYield: CommuneSolarYield): void {
    this.solarYield = solarYield;
  }

  willFailWith(error: Error): void {
    this.failure = error;
  }

  fetchSolarYield(location: AddressLocation): Observable<CommuneSolarYield> {
    this.fetchedLocations.push(location);
    const failure = this.failure;
    if (failure) return throwError(() => failure);
    return of(this.solarYield as CommuneSolarYield);
  }
}
