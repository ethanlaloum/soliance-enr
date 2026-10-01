export enum ProjectType {
  SOLAR_PANELS = 'SOLAR_PANELS',
  HEAT_PUMP = 'HEAT_PUMP',
  EV_CHARGER = 'EV_CHARGER',
  PROFESSIONAL_PROJECT = 'PROFESSIONAL_PROJECT',
  UNDECIDED = 'UNDECIDED',
}

export const projectTypes: ProjectType[] = [
  ProjectType.SOLAR_PANELS,
  ProjectType.HEAT_PUMP,
  ProjectType.EV_CHARGER,
  ProjectType.PROFESSIONAL_PROJECT,
  ProjectType.UNDECIDED,
];

export interface StudyRequestForm {
  fullName: string;
  phone: string;
  email: string | null;
  postalCode: string;
  projectType: ProjectType;
  monthlyBill: string | null;
  callbackConsent: boolean;
  consentText: string;
  pageUri: string;
  pageName: string;
}

export interface StudyRequest {
  fullName: string;
  phone: string;
  email: string | null;
  postalCode: string;
  projectType: ProjectType;
  monthlyBill: string | null;
  consentText: string;
  callbackConsentedAt: string;
  pageUri: string;
  pageName: string;
}

const optionalText = (value: string | null): string | null => {
  const trimmed = value?.trim() ?? '';
  return trimmed.length > 0 ? trimmed : null;
};

export const buildStudyRequest = (form: StudyRequestForm, consentedAt: Date): StudyRequest => ({
  fullName: form.fullName.trim(),
  phone: form.phone.replace(/[\s.-]/g, ''),
  email: optionalText(form.email),
  postalCode: form.postalCode.trim(),
  projectType: form.projectType,
  monthlyBill: optionalText(form.monthlyBill),
  consentText: form.consentText,
  callbackConsentedAt: consentedAt.toISOString(),
  pageUri: form.pageUri,
  pageName: form.pageName,
});
