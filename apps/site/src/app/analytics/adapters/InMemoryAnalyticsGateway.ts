import { Observable, of, throwError } from 'rxjs';
import { AnalyticsEvent } from '@/app/analytics/domain/entities/AnalyticsEvent';
import { AnalyticsGateway } from '@/app/analytics/domain/ports/AnalyticsGateway';

export class InMemoryAnalyticsGateway implements AnalyticsGateway {
  public readonly switches: ('enable' | 'disable')[] = [];
  public readonly trackedEvents: AnalyticsEvent[] = [];
  private failure: Error | null = null;

  willFailWith(error: Error): void {
    this.failure = error;
  }

  enable(): Observable<void> {
    return this.record(() => this.switches.push('enable'));
  }

  disable(): Observable<void> {
    return this.record(() => this.switches.push('disable'));
  }

  track(event: AnalyticsEvent): Observable<void> {
    return this.record(() => this.trackedEvents.push(event));
  }

  private record(effect: () => void): Observable<void> {
    const failure = this.failure;
    if (failure) return throwError(() => failure);
    effect();
    return of(undefined);
  }
}
