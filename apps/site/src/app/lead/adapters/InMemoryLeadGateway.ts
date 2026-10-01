import { Observable, of, throwError } from 'rxjs';
import { StudyRequest } from '@/app/lead/domain/entities/StudyRequest';
import { LeadSubmission } from '@/app/lead/domain/entities/LeadSubmission';
import { LeadGateway } from '@/app/lead/domain/ports/LeadGateway';

export class InMemoryLeadGateway implements LeadGateway {
  public readonly submittedStudyRequests: StudyRequest[] = [];
  public readonly submittedLeads: LeadSubmission[] = [];
  private failure: Error | null = null;

  willFailWith(error: Error): void {
    this.failure = error;
  }

  submitStudyRequest(request: StudyRequest): Observable<void> {
    const failure = this.failure;
    if (failure) return throwError(() => failure);
    this.submittedStudyRequests.push(request);
    return of(undefined);
  }

  submitLead(submission: LeadSubmission): Observable<void> {
    const failure = this.failure;
    if (failure) return throwError(() => failure);
    this.submittedLeads.push(submission);
    return of(undefined);
  }
}
