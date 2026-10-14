import '@/lib/i18n/namespaces/projects';
import { z } from 'zod';
import i18n from '@/lib/i18n/i18n';

const frenchPhonePattern = /^(?:(?:\+|00)33[\s.-]?|0)[1-9](?:[\s.-]?\d{2}){4}$/;

const message = (key: string) => i18n.t(`projects:portfolioRequest.validation.${key}`);

export const portfolioRequestSchema = z.object({
  firstName: z.string().trim().min(1, message('firstNameRequired')),
  lastName: z.string().trim().min(1, message('lastNameRequired')),
  email: z.string().trim().email(message('emailInvalid')),
  phone: z.string().trim().regex(frenchPhonePattern, message('phoneInvalid')),
  callbackConsent: z.boolean().refine((value) => value, message('consentRequired')),
});

export type PortfolioRequestFormData = z.infer<typeof portfolioRequestSchema>;

export const portfolioRequestDefaultValues: PortfolioRequestFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  callbackConsent: false,
};
