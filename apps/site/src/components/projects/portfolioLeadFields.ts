import type { LeadFields } from '@/app/lead/domain/entities/LeadSubmission';
import type { PortfolioRequestFormData } from '@/components/projects/portfolioRequestSchema';

export const buildPortfolioLeadFields = (values: PortfolioRequestFormData): LeadFields => ({
  first_name: values.firstName.trim(),
  last_name: values.lastName.trim(),
  email: values.email.trim(),
  phone: values.phone.replace(/[\s.-]/g, ''),
});
