import type { LeadFields } from '@/app/lead/domain/entities/LeadSubmission';
import type { ReferralFormData } from '@/components/referral/referralSchema';

const normalizePhone = (value: string) => value.trim().replace(/[\s.-]/g, '');

export const toReferralLeadFields = (values: ReferralFormData): LeadFields => {
  const referrerContact = values.referrerContact.trim();
  const isEmail = referrerContact.includes('@');

  return {
    referrer_full_name: values.referrerFullName.trim(),
    referrer_phone: isEmail ? null : normalizePhone(referrerContact),
    referrer_email: isEmail ? referrerContact : null,
    referee_full_name: values.refereeFullName.trim(),
    referee_phone: normalizePhone(values.refereePhone),
    referee_project: values.refereeProject,
  };
};
