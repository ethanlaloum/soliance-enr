import { defer, Observable, of, throwError } from 'rxjs';
import { ConsentChoice, parseConsentChoice } from '@/app/consent/domain/entities/ConsentChoice';
import { ConsentError, ConsentErrorType, ConsentGateway } from '@/app/consent/domain/ports/ConsentGateway';

const readStorage = (): Storage | null => {
  try {
    return typeof window === 'undefined' ? null : window.localStorage;
  } catch {
    return null;
  }
};

export class LocalStorageConsentGateway implements ConsentGateway {
  constructor(private readonly storageKey: string) {}

  readChoice(): Observable<ConsentChoice | null> {
    return defer(() => {
      try {
        const raw = readStorage()?.getItem(this.storageKey) ?? null;
        return of(raw === null ? null : parseConsentChoice(JSON.parse(raw)));
      } catch {
        return of(null);
      }
    });
  }

  saveChoice(choice: ConsentChoice): Observable<void> {
    return defer(() => {
      const storage = readStorage();
      try {
        if (!storage) throw new Error('No local storage');
        storage.setItem(this.storageKey, JSON.stringify(choice));
        return of(undefined);
      } catch {
        return throwError(() => new ConsentError(ConsentErrorType.STORAGE_UNAVAILABLE, 'The consent choice cannot be stored'));
      }
    });
  }
}
