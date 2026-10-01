import { Observable } from 'rxjs';
import { StudyRequest } from '@/app/lead/domain/entities/StudyRequest';
import { LeadSubmission } from '@/app/lead/domain/entities/LeadSubmission';

export interface LeadGateway {
  submitStudyRequest(request: StudyRequest): Observable<void>;
  submitLead(submission: LeadSubmission): Observable<void>;
}

export enum LeadErrorType {
  CONSENT_REQUIRED = 'CONSENT_REQUIRED',
  INVALID_REQUEST = 'INVALID_REQUEST',
  SUBMISSION_FAILED = 'SUBMISSION_FAILED',
  NOT_CONFIGURED = 'NOT_CONFIGURED',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export class LeadError extends Error {
  constructor(
    public readonly type: LeadErrorType,
    message: string,
  ) {
    super(message);
    this.name = 'LeadError';
  }
}
