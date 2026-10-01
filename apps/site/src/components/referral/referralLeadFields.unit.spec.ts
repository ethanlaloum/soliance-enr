import { describe, expect, it } from 'vitest';
import { ProjectType } from '@/app/lead/domain/entities/StudyRequest';
import { toReferralLeadFields } from '@/components/referral/referralLeadFields';

describe('Referral lead fields', () => {
  it('sends the referrer phone without separators when the referrer leaves a phone number', () => {
    const fields = toReferralLeadFields({
      referrerFullName: ' Marie Dupont ',
      referrerContact: '06 12 34 56 78',
      refereeFullName: 'Paul Martin',
      refereePhone: '07.65.43.21.09',
      refereeProject: ProjectType.HEAT_PUMP,
      callbackConsent: true,
    });

    expect(fields).toEqual({
      referrer_full_name: 'Marie Dupont',
      referrer_phone: '0612345678',
      referrer_email: null,
      referee_full_name: 'Paul Martin',
      referee_phone: '0765432109',
      referee_project: 'HEAT_PUMP',
    });
  });

  it('sends the referrer email when the referrer leaves an email address', () => {
    const fields = toReferralLeadFields({
      referrerFullName: 'Marie Dupont',
      referrerContact: ' marie.dupont@example.com ',
      refereeFullName: ' Paul Martin ',
      refereePhone: '+33 6 12 34 56 78',
      refereeProject: ProjectType.SOLAR_PANELS,
      callbackConsent: true,
    });

    expect(fields).toEqual({
      referrer_full_name: 'Marie Dupont',
      referrer_phone: null,
      referrer_email: 'marie.dupont@example.com',
      referee_full_name: 'Paul Martin',
      referee_phone: '+33612345678',
      referee_project: 'SOLAR_PANELS',
    });
  });
});
