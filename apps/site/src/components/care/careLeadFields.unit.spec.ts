import { describe, expect, it } from 'vitest';
import { CareRequestFormData, careRequestSchema, CareRequestType } from '@/components/care/careRequestSchema';
import { buildCareLeadFields } from '@/components/care/careLeadFields';

const formValues: CareRequestFormData = {
  requestType: CareRequestType.TAKEOVER,
  fullName: ' Camille Martin ',
  phone: '06 12.34-56 78',
  postalCode: ' 06700 ',
  email: ' camille.martin@example.fr ',
  inverterBrand: ' SolaX ',
  situation: ' Installateur injoignable depuis 2025 ',
  callbackConsent: true,
};

const firstIssuePath = (values: CareRequestFormData) => {
  const result = careRequestSchema.safeParse(values);
  return result.success ? null : result.error.issues.map((issue) => issue.path.join('.'));
};

describe('Soliance Care lead fields', () => {
  it('maps a takeover request to trimmed snake_case lead fields with a compact phone', () => {
    expect(buildCareLeadFields(formValues)).toEqual({
      care_request_type: 'TAKEOVER',
      full_name: 'Camille Martin',
      phone: '0612345678',
      zip: '06700',
      email: 'camille.martin@example.fr',
      inverter_brand: 'SolaX',
      installation_situation: 'Installateur injoignable depuis 2025',
    });
  });

  it('sends the optional fields as empty when they are left blank', () => {
    expect(
      buildCareLeadFields({ ...formValues, requestType: CareRequestType.SUBSCRIBE_CONNECT, email: '  ', inverterBrand: '', situation: ' ' }),
    ).toEqual({
      care_request_type: 'SUBSCRIBE_CONNECT',
      full_name: 'Camille Martin',
      phone: '0612345678',
      zip: '06700',
      email: null,
      inverter_brand: null,
      installation_situation: null,
    });
  });
});

describe('Soliance Care request form', () => {
  it('accepts a request without e-mail, inverter brand or situation', () => {
    expect(firstIssuePath({ ...formValues, email: '', inverterBrand: '', situation: '' })).toBeNull();
  });

  it('refuses a request without callback consent', () => {
    expect(firstIssuePath({ ...formValues, callbackConsent: false })).toEqual(['callbackConsent']);
  });

  it('refuses an invalid phone, postal code, e-mail and an oversized situation', () => {
    expect(
      firstIssuePath({ ...formValues, phone: '12345', postalCode: '6700', email: 'camille@', situation: 'x'.repeat(1001) }),
    ).toEqual(['phone', 'postalCode', 'email', 'situation']);
  });
});
