import { Observable } from 'rxjs';
import { ConsentChoice } from '@/app/consent/domain/entities/ConsentChoice';

export enum ConsentErrorType {
  STORAGE_UNAVAILABLE = 'STORAGE_UNAVAILABLE',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export class ConsentError extends Error {
  constructor(
    public readonly type: ConsentErrorType,
    message: string,
  ) {
    super(message);
    this.name = 'ConsentError';
  }
}

export interface ConsentGateway {
  readChoice(): Observable<ConsentChoice | null>;
  saveChoice(choice: ConsentChoice): Observable<void>;
}
