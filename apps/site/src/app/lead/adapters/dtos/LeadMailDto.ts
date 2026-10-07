import { LeadFormKind } from '@/app/lead/domain/entities/LeadSubmission';

export const studyRequestMailKind = 'STUDY_REQUEST';

export interface LeadMailDto {
  kind: typeof studyRequestMailKind | LeadFormKind;
  fields: Record<string, string>;
  consentText: string;
  callbackConsentedAt: string;
  pageUri: string;
  pageName: string;
  website: string;
  fillDurationMs: number | null;
}

export interface LeadMailErrorDto {
  error: string;
}
