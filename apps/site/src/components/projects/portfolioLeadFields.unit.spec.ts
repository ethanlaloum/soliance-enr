import { describe, expect, it } from 'vitest';
import { PortfolioRequestFormData, portfolioRequestSchema } from '@/components/projects/portfolioRequestSchema';
import { buildPortfolioLeadFields } from '@/components/projects/portfolioLeadFields';

const formValues: PortfolioRequestFormData = {
  firstName: ' Camille ',
  lastName: ' Martin ',
  email: ' camille.martin@example.fr ',
  phone: '06 12.34-56 78',
  callbackConsent: true,
};

const issuePaths = (values: PortfolioRequestFormData) => {
  const result = portfolioRequestSchema.safeParse(values);
  return result.success ? null : result.error.issues.map((issue) => issue.path.join('.'));
};

describe('Portfolio request lead fields', () => {
  it('maps the request to trimmed snake_case lead fields with a compact phone', () => {
    expect(buildPortfolioLeadFields(formValues)).toEqual({
      first_name: 'Camille',
      last_name: 'Martin',
      email: 'camille.martin@example.fr',
      phone: '0612345678',
    });
  });
});

describe('Portfolio request form', () => {
  it('accepts a complete request', () => {
    expect(issuePaths(formValues)).toBeNull();
  });

  it('refuses a request without callback consent', () => {
    expect(issuePaths({ ...formValues, callbackConsent: false })).toEqual(['callbackConsent']);
  });

  it('refuses blank names, an invalid e-mail and an invalid phone', () => {
    expect(issuePaths({ ...formValues, firstName: ' ', lastName: '', email: 'camille@', phone: '12345' })).toEqual([
      'firstName',
      'lastName',
      'email',
      'phone',
    ]);
  });
});
