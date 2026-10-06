import type { LeadFields } from '@/app/lead/domain/entities/LeadSubmission';
import type { CareRequestFormData } from '@/components/care/careRequestSchema';

const optional = (value: string): string | null => {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

export const buildCareLeadFields = (values: CareRequestFormData): LeadFields => ({
  care_request_type: values.requestType,
  full_name: values.fullName.trim(),
  phone: values.phone.replace(/[\s.-]/g, ''),
  zip: values.postalCode.trim(),
  email: optional(values.email),
  inverter_brand: optional(values.inverterBrand),
  installation_situation: optional(values.situation),
});
