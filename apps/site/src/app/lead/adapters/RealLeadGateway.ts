import { catchError, map, Observable, throwError } from 'rxjs';
import { StudyRequest } from '@/app/lead/domain/entities/StudyRequest';
import { LeadSubmission } from '@/app/lead/domain/entities/LeadSubmission';
import { LeadError, LeadErrorType, LeadGateway } from '@/app/lead/domain/ports/LeadGateway';
import { LeadMailDto, LeadMailErrorDto, studyRequestMailKind } from '@/app/lead/adapters/dtos/LeadMailDto';
import { HttpClient, isApiError } from '@/app/shared/domain/ports/HttpClient';

type SubmissionContext = Pick<LeadMailDto, 'consentText' | 'callbackConsentedAt' | 'pageUri' | 'pageName'>;

const toContext = (source: SubmissionContext): SubmissionContext => ({
  consentText: source.consentText,
  callbackConsentedAt: source.callbackConsentedAt,
  pageUri: source.pageUri,
  pageName: source.pageName,
});

const notConfiguredCode = 'NOT_CONFIGURED';

const isNotConfigured = (data: unknown): boolean =>
  typeof data === 'object' && data !== null && (data as Partial<LeadMailErrorDto>).error === notConfiguredCode;

const toLeadError = (error: unknown, label: string): LeadError => {
  const status = isApiError(error) ? error.status : null;
  if (isApiError(error) && error.status === 503 && isNotConfigured(error.data)) {
    return new LeadError(LeadErrorType.NOT_CONFIGURED, 'Lead mail is not configured on the server');
  }
  const type = status === 400 ? LeadErrorType.INVALID_REQUEST : LeadErrorType.SUBMISSION_FAILED;
  return new LeadError(type, `${label[0].toUpperCase()}${label.slice(1)} submission failed with status ${status ?? 'unknown'}`);
};

export class SolianceRxLeadGateway implements LeadGateway {
  constructor(
    private httpClient: HttpClient,
    private endpoint: string,
  ) {}

  submitStudyRequest(request: StudyRequest): Observable<void> {
    const fields: Record<string, string> = {
      full_name: request.fullName,
      phone: request.phone,
      zip: request.postalCode,
      project_type: request.projectType,
    };
    if (request.email) fields.email = request.email;
    if (request.monthlyBill) fields.monthly_electricity_bill = request.monthlyBill;

    return this.send('study request', { kind: studyRequestMailKind, fields, ...toContext(request) });
  }

  submitLead(submission: LeadSubmission): Observable<void> {
    return this.send(`${submission.kind} lead`, { kind: submission.kind, fields: submission.fields, ...toContext(submission) });
  }

  private send(label: string, dto: LeadMailDto): Observable<void> {
    return this.httpClient.post<LeadMailDto, unknown>(this.endpoint, dto).pipe(
      map(() => undefined),
      catchError((error: unknown) => throwError(() => toLeadError(error, label))),
    );
  }
}
