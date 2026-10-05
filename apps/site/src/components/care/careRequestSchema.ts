import '@/lib/i18n/namespaces/care';
import { z } from 'zod';
import i18n from '@/lib/i18n/i18n';
import type { LeadFields } from '@/app/lead/domain/entities/LeadSubmission';

export const careInterests = ['HEALTH_CHECK', 'CARE', 'CONNECT', 'TAKEOVER', 'PRO', 'PARTNER'] as const;
export type CareInterest = typeof careInterests[number];
const message = (key: string) => i18n.t(`care:form.validation.${key}`);

export const careRequestSchema = z.object({
  fullName: z.string().trim().min(2, message('name')),
  phone: z.string().trim().regex(/^(?:(?:\+|00)33[\s.-]?|0)[1-9](?:[\s.-]?\d{2}){4}$/, message('phone')),
  postalCode: z.string().trim().regex(/^\d{5}$/, message('postalCode')),
  email: z.string().trim().pipe(z.union([z.string().email(message('email')), z.literal('')])),
  interest: z.enum(careInterests),
  brand: z.string().trim(),
  situation: z.string().trim().max(1000, message('tooLong')),
  callbackConsent: z.boolean().refine(Boolean, message('consent')),
});

export type CareRequestData = z.infer<typeof careRequestSchema>;
export const careDefaultValues: CareRequestData = { fullName: '', phone: '', postalCode: '', email: '', interest: 'HEALTH_CHECK', brand: '', situation: '', callbackConsent: false };

export const buildCareLeadFields = (values: CareRequestData): LeadFields => ({
  full_name: values.fullName.trim(),
  phone: values.phone.replace(/[\s.-]/g, ''),
  zip: values.postalCode.trim(),
  email: values.email.trim() || null,
  care_request_type: values.interest,
  inverter_brand: values.brand.trim() || null,
  installation_situation: values.situation.trim() || null,
});
