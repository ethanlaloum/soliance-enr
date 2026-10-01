import '@/lib/i18n/namespaces/referral';
import { z } from 'zod';
import i18n from '@/lib/i18n/i18n';
import { ProjectType } from '@/app/lead/domain/entities/StudyRequest';

const frenchPhonePattern = /^(?:(?:\+|00)33[\s.-]?|0)[1-9](?:[\s.-]?\d{2}){4}$/;

const emailSchema = z.string().email();

const isPhoneOrEmail = (value: string) => frenchPhonePattern.test(value) || emailSchema.safeParse(value).success;

export const refereeProjects = [ProjectType.SOLAR_PANELS, ProjectType.HEAT_PUMP, ProjectType.EV_CHARGER, ProjectType.UNDECIDED] as const;

export const referralSchema = z.object({
  referrerFullName: z.string().trim().min(2, i18n.t('referral:form.validation.referrerFullNameRequired')),
  referrerContact: z.string().trim().refine(isPhoneOrEmail, i18n.t('referral:form.validation.referrerContactInvalid')),
  refereeFullName: z.string().trim().min(2, i18n.t('referral:form.validation.refereeFullNameRequired')),
  refereePhone: z.string().trim().regex(frenchPhonePattern, i18n.t('referral:form.validation.refereePhoneInvalid')),
  refereeProject: z.enum(refereeProjects),
  callbackConsent: z.boolean().refine((value) => value, i18n.t('referral:form.validation.consentRequired')),
});

export type ReferralFormData = z.infer<typeof referralSchema>;

export const referralDefaultValues: ReferralFormData = {
  referrerFullName: '',
  referrerContact: '',
  refereeFullName: '',
  refereePhone: '',
  refereeProject: ProjectType.SOLAR_PANELS,
  callbackConsent: false,
};
