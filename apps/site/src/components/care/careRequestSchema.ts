import '@/lib/i18n/namespaces/care';
import { z } from 'zod';
import i18n from '@/lib/i18n/i18n';

export enum CareRequestType {
  SUBSCRIBE_CARE = 'SUBSCRIBE_CARE',
  SUBSCRIBE_CONNECT = 'SUBSCRIBE_CONNECT',
  HEALTH_CHECK = 'HEALTH_CHECK',
  TAKEOVER = 'TAKEOVER',
  CLAIM = 'CLAIM',
  PRO = 'PRO',
  PARTNER = 'PARTNER',
}

export const careRequestTypes: CareRequestType[] = [
  CareRequestType.SUBSCRIBE_CARE,
  CareRequestType.SUBSCRIBE_CONNECT,
  CareRequestType.HEALTH_CHECK,
  CareRequestType.TAKEOVER,
  CareRequestType.CLAIM,
  CareRequestType.PRO,
  CareRequestType.PARTNER,
];

const frenchPhonePattern = /^(?:(?:\+|00)33[\s.-]?|0)[1-9](?:[\s.-]?\d{2}){4}$/;
const postalCodePattern = /^\d{5}$/;
const emailSchema = z.string().email();

const message = (key: string) => i18n.t(`care:form.validation.${key}`);

export const careRequestSchema = z.object({
  requestType: z.nativeEnum(CareRequestType),
  fullName: z.string().trim().min(2, message('fullNameRequired')),
  phone: z.string().trim().regex(frenchPhonePattern, message('phoneInvalid')),
  postalCode: z.string().trim().regex(postalCodePattern, message('postalCodeInvalid')),
  email: z
    .string()
    .trim()
    .refine((value) => value.length === 0 || emailSchema.safeParse(value).success, message('emailInvalid')),
  inverterBrand: z.string().trim(),
  situation: z.string().trim().max(1000, message('situationTooLong')),
  callbackConsent: z.boolean().refine((value) => value, message('consentRequired')),
});

export type CareRequestFormData = z.infer<typeof careRequestSchema>;

export const careRequestDefaultValues: CareRequestFormData = {
  requestType: CareRequestType.SUBSCRIBE_CARE,
  fullName: '',
  phone: '',
  postalCode: '',
  email: '',
  inverterBrand: '',
  situation: '',
  callbackConsent: false,
};
