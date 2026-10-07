import { Observable, of, throwError } from 'rxjs';
import { ConsentChoice } from '@/app/consent/domain/entities/ConsentChoice';
import { ConsentGateway } from '@/app/consent/domain/ports/ConsentGateway';

export class InMemoryConsentGateway implements ConsentGateway {
  public readonly savedChoices: ConsentChoice[] = [];
  private storedChoice: ConsentChoice | null = null;
  private failure: Error | null = null;

  withStoredChoice(choice: ConsentChoice | null): void {
    this.storedChoice = choice;
  }

  willFailWith(error: Error): void {
    this.failure = error;
  }

  readChoice(): Observable<ConsentChoice | null> {
    const failure = this.failure;
    if (failure) return throwError(() => failure);
    return of(this.storedChoice);
  }

  saveChoice(choice: ConsentChoice): Observable<void> {
    const failure = this.failure;
    if (failure) return throwError(() => failure);
    this.savedChoices.push(choice);
    this.storedChoice = choice;
    return of(undefined);
  }
}
