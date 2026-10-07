import { Observable } from 'rxjs';
import { AnalyticsEvent } from '@/app/analytics/domain/entities/AnalyticsEvent';

export enum AnalyticsErrorType {
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface AnalyticsGateway {
  enable(): Observable<void>;
  disable(): Observable<void>;
  track(event: AnalyticsEvent): Observable<void>;
}
