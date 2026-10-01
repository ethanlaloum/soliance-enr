import '@/lib/i18n/namespaces/simulator';
import { z } from 'zod';
import i18n from '@/lib/i18n/i18n';

const frenchPhonePattern = /^(?:(?:\+|00)33[\s.-]?|0)[1-9](?:[\s.-]?\d{2}){4}$/;

export const simulationCaptureSchema = z.object({
  email: z.string().trim().email(i18n.t('simulator:capture.validation.emailInvalid')),
  phone: z.string().trim().regex(frenchPhonePattern, i18n.t('simulator:capture.validation.phoneInvalid')),
  callbackConsent: z.boolean().refine((value) => value, i18n.t('simulator:capture.validation.consentRequired')),
});

export type SimulationCaptureFormData = z.infer<typeof simulationCaptureSchema>;

export const simulationCaptureDefaultValues: SimulationCaptureFormData = {
  email: '',
  phone: '',
  callbackConsent: false,
};
