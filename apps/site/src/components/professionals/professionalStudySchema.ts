import '@/lib/i18n/namespaces/professionals';
import { z } from 'zod';
import i18n from '@/lib/i18n/i18n';

export enum ProfessionalProjectType {
  INDUSTRIAL_OR_AGRICULTURAL_ROOF = 'INDUSTRIAL_OR_AGRICULTURAL_ROOF',
  PARKING_CARPORT = 'PARKING_CARPORT',
  EV_CHARGING = 'EV_CHARGING',
  CONDOMINIUM_OR_LANDLORD = 'CONDOMINIUM_OR_LANDLORD',
  PUBLIC_AUTHORITY_OR_TENDER = 'PUBLIC_AUTHORITY_OR_TENDER',
}

export const professionalProjectTypes: ProfessionalProjectType[] = [
  ProfessionalProjectType.INDUSTRIAL_OR_AGRICULTURAL_ROOF,
  ProfessionalProjectType.PARKING_CARPORT,
  ProfessionalProjectType.EV_CHARGING,
  ProfessionalProjectType.CONDOMINIUM_OR_LANDLORD,
  ProfessionalProjectType.PUBLIC_AUTHORITY_OR_TENDER,
];

const frenchPhonePattern = /^(?:(?:\+|00)33[\s.-]?|0)[1-9](?:[\s.-]?\d{2}){4}$/;
const postalCodePattern = /^\d{5}$/;
const surfacePattern = /^\d{1,7}(?:[.,]\d{1,2})?$/;

const message = (key: string) => i18n.t(`professionals:form.validation.${key}`);

export const professionalStudySchema = z.object({
  company: z.string().trim().min(2, message('companyRequired')),
  fullName: z.string().trim().min(2, message('fullNameRequired')),
  jobTitle: z.string().trim().min(2, message('jobTitleRequired')),
  email: z.string().trim().email(message('emailInvalid')),
  phone: z.string().trim().regex(frenchPhonePattern, message('phoneInvalid')),
  projectType: z.nativeEnum(ProfessionalProjectType),
  surface: z
    .string()
    .trim()
    .refine((value) => surfacePattern.test(value.replace(/\s/g, '')), message('surfaceInvalid')),
  postalCode: z.string().trim().regex(postalCodePattern, message('postalCodeInvalid')),
  callbackConsent: z.boolean().refine((value) => value, message('consentRequired')),
});

export type ProfessionalStudyFormData = z.infer<typeof professionalStudySchema>;

export const professionalStudyDefaultValues: ProfessionalStudyFormData = {
  company: '',
  fullName: '',
  jobTitle: '',
  email: '',
  phone: '',
  projectType: ProfessionalProjectType.INDUSTRIAL_OR_AGRICULTURAL_ROOF,
  surface: '',
  postalCode: '',
  callbackConsent: false,
};
