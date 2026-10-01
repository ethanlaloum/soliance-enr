import type { LeadFields } from '@/app/lead/domain/entities/LeadSubmission';
import type { ProfessionalStudyFormData } from '@/components/professionals/professionalStudySchema';

export const buildProfessionalLeadFields = (values: ProfessionalStudyFormData): LeadFields => ({
  company: values.company.trim(),
  full_name: values.fullName.trim(),
  job_title: values.jobTitle.trim(),
  email: values.email.trim(),
  phone: values.phone.replace(/[\s.-]/g, ''),
  project_type: values.projectType,
  surface_m2: values.surface.replace(/\s/g, '').replace(',', '.'),
  zip: values.postalCode.trim(),
});
