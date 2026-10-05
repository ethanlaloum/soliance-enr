export enum LeadFormKind {
  PROFESSIONAL_STUDY = 'PROFESSIONAL_STUDY',
  REFERRAL = 'REFERRAL',
  SIMULATION = 'SIMULATION',
  CARE_REQUEST = 'CARE_REQUEST',
}

export const leadFormKinds: LeadFormKind[] = [LeadFormKind.PROFESSIONAL_STUDY, LeadFormKind.REFERRAL, LeadFormKind.SIMULATION, LeadFormKind.CARE_REQUEST];

export type LeadFields = Record<string, string | null>;

export interface LeadSubmissionForm {
  kind: LeadFormKind;
  fields: LeadFields;
  callbackConsent: boolean;
  consentText: string;
  pageUri: string;
  pageName: string;
}

export interface LeadSubmission {
  kind: LeadFormKind;
  fields: Record<string, string>;
  consentText: string;
  callbackConsentedAt: string;
  pageUri: string;
  pageName: string;
}

const keepFilledFields = (fields: LeadFields): Record<string, string> =>
  Object.fromEntries(
    Object.entries(fields)
      .map(([name, value]) => [name, value?.trim() ?? ''] as const)
      .filter(([, value]) => value.length > 0),
  );

export const buildLeadSubmission = (form: LeadSubmissionForm, consentedAt: Date): LeadSubmission => ({
  kind: form.kind,
  fields: keepFilledFields(form.fields),
  consentText: form.consentText,
  callbackConsentedAt: consentedAt.toISOString(),
  pageUri: form.pageUri,
  pageName: form.pageName,
});
