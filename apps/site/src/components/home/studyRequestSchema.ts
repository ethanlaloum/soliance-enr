import '@/lib/i18n/namespaces/home';
import { z } from 'zod';
import i18n from '@/lib/i18n/i18n';
import { ProjectType } from '@/app/lead/domain/entities/StudyRequest';

const frenchPhonePattern = /^(?:(?:\+|00)33[\s.-]?|0)[1-9](?:[\s.-]?\d{2}){4}$/;
const postalCodePattern = /^\d{5}$/;

export const studyRequestSchema = z.object({
  fullName: z.string().trim().min(2, i18n.t('home:contact.form.validation.fullNameRequired')),
  phone: z.string().trim().regex(frenchPhonePattern, i18n.t('home:contact.form.validation.phoneInvalid')),
  email: z.union([z.literal(''), z.string().trim().email(i18n.t('home:contact.form.validation.emailInvalid'))]),
  postalCode: z.string().trim().regex(postalCodePattern, i18n.t('home:contact.form.validation.postalCodeInvalid')),
  projectType: z.nativeEnum(ProjectType),
  monthlyBill: z.string().trim().max(20, i18n.t('home:contact.form.validation.monthlyBillTooLong')),
  callbackConsent: z.boolean().refine((value) => value, i18n.t('home:contact.form.validation.consentRequired')),
});

export type StudyRequestFormData = z.infer<typeof studyRequestSchema>;

export const studyRequestDefaultValues: StudyRequestFormData = {
  fullName: '',
  phone: '',
  email: '',
  postalCode: '',
  projectType: ProjectType.SOLAR_PANELS,
  monthlyBill: '',
  callbackConsent: false,
};
