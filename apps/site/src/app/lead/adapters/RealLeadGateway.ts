import { catchError, map, Observable, throwError } from 'rxjs';
import { StudyRequest } from '@/app/lead/domain/entities/StudyRequest';
import { LeadFormKind, LeadSubmission } from '@/app/lead/domain/entities/LeadSubmission';
import { LeadError, LeadErrorType, LeadGateway } from '@/app/lead/domain/ports/LeadGateway';
import { HubSpotFieldDto, HubSpotSubmissionDto } from '@/app/lead/adapters/dtos/HubSpotSubmissionDto';
import { HttpClient, isApiError } from '@/app/shared/domain/ports/HttpClient';

export interface HubSpotFormSettings {
  portalId: string | null;
  studyRequestFormId: string | null;
  leadFormIds: Record<LeadFormKind, string | null>;
}

const contactField = (name: string, value: string): HubSpotFieldDto => ({ objectTypeId: '0-1', name, value });

export class SolianceRxLeadGateway implements LeadGateway {
  private readonly baseUrl = 'https://api.hsforms.com/submissions/v3/integration/submit';

  constructor(
    private httpClient: HttpClient,
    private settings: HubSpotFormSettings,
  ) {}

  submitStudyRequest(request: StudyRequest): Observable<void> {
    const fields: HubSpotFieldDto[] = [
      contactField('full_name', request.fullName),
      contactField('phone', request.phone),
      contactField('zip', request.postalCode),
      contactField('project_type', request.projectType),
      contactField('callback_consented_at', request.callbackConsentedAt),
    ];
    if (request.email) fields.push(contactField('email', request.email));
    if (request.monthlyBill) fields.push(contactField('monthly_electricity_bill', request.monthlyBill));

    return this.send(this.settings.studyRequestFormId, 'study request', this.toDto(fields, request));
  }

  submitLead(submission: LeadSubmission): Observable<void> {
    const fields = [
      ...Object.entries(submission.fields).map(([name, value]) => contactField(name, value)),
      contactField('callback_consented_at', submission.callbackConsentedAt),
    ];

    return this.send(this.settings.leadFormIds[submission.kind], `${submission.kind} lead`, this.toDto(fields, submission));
  }

  private send(formId: string | null, label: string, dto: HubSpotSubmissionDto): Observable<void> {
    const { portalId } = this.settings;
    if (!portalId || !formId) {
      return throwError(() => new LeadError(LeadErrorType.NOT_CONFIGURED, `HubSpot portal id or ${label} form id is missing`));
    }

    return this.httpClient.post<HubSpotSubmissionDto, unknown>(`${this.baseUrl}/${portalId}/${formId}`, dto).pipe(
      map(() => undefined),
      catchError((error: unknown) => {
        const status = isApiError(error) ? error.status : null;
        const type = status === 400 ? LeadErrorType.INVALID_REQUEST : LeadErrorType.SUBMISSION_FAILED;
        return throwError(() => new LeadError(type, `${label[0].toUpperCase()}${label.slice(1)} submission failed with status ${status ?? 'unknown'}`));
      }),
    );
  }

  private toDto(
    fields: HubSpotFieldDto[],
    context: { callbackConsentedAt: string; pageUri: string; pageName: string; consentText: string },
  ): HubSpotSubmissionDto {
    return {
      submittedAt: String(Date.parse(context.callbackConsentedAt)),
      fields,
      context: { pageUri: context.pageUri, pageName: context.pageName },
      legalConsentOptions: { consent: { consentToProcess: true, text: context.consentText } },
    };
  }
}
