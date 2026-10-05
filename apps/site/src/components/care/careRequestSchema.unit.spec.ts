import { describe, expect, it } from 'vitest';
import { buildCareLeadFields, careDefaultValues, careRequestSchema } from './careRequestSchema';

const valid = { ...careDefaultValues, fullName: ' Camille Test ', phone: '+33 6 12 34 56 78', postalCode: ' 75012 ', interest: 'CONNECT' as const, callbackConsent: true };

describe('Care callback request', () => {
  it('accepts a remote request outside the local service area without optional fields', () => {
    const parsed = careRequestSchema.parse({ ...valid, email: '  ' });
    expect(buildCareLeadFields(parsed)).toEqual({ full_name: 'Camille Test', phone: '+33612345678', zip: '75012', email: null, care_request_type: 'CONNECT', inverter_brand: null, installation_situation: null });
  });

  it('keeps the takeover context and inverter brand with the contact details', () => {
    const parsed = careRequestSchema.parse({ ...valid, interest: 'TAKEOVER', brand: ' SolaX ', situation: ' Installateur fermé ', email: ' camille@example.com ' });
    expect(buildCareLeadFields(parsed)).toMatchObject({ care_request_type: 'TAKEOVER', inverter_brand: 'SolaX', installation_situation: 'Installateur fermé', email: 'camille@example.com' });
  });

  it('requires explicit callback consent', () => {
    const result = careRequestSchema.safeParse({ ...valid, callbackConsent: false });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0].path).toEqual(['callbackConsent']);
  });

  it.each([{ phone: '123' }, { postalCode: 'Paris' }, { email: 'invalid@' }, { situation: 'x'.repeat(1001) }])('rejects invalid contact data or an oversized message: %j', (invalid) => {
    expect(careRequestSchema.safeParse({ ...valid, ...invalid }).success).toBe(false);
  });
});
