import { beforeEach, describe, expect, it } from 'vitest';
import { LeadFormKind, LeadSubmissionForm } from '@/app/lead/domain/entities/LeadSubmission';
import { LeadError, LeadErrorType } from '@/app/lead/domain/ports/LeadGateway';
import { submitLeadFailed, submitLeadSucceeded } from './submitLeadEpic';
import { createSubmitLeadEpicSUT } from './submitLeadEpic.sut';

const professionalForm: LeadSubmissionForm = {
  kind: LeadFormKind.PROFESSIONAL_STUDY,
  fields: { company: ' Acme Logistique ', role: 'Directeur', project_type: 'ROOFTOP', surface_m2: '', email: null },
  callbackConsent: true,
  consentText: 'consent-text-v1',
  pageUri: 'https://soliance-enr.fr/professionnels',
  pageName: 'professionals',
};

describe('Generic lead submission', () => {
  let sut: ReturnType<typeof createSubmitLeadEpicSUT>;

  beforeEach(() => {
    sut = createSubmitLeadEpicSUT();
  });

  it('sends the trimmed filled fields stamped with the consent time and succeeds', async () => {
    const actions = await sut.whenLeadIsSubmitted(professionalForm);

    expect(actions).toEqual([submitLeadSucceeded({ kind: LeadFormKind.PROFESSIONAL_STUDY })]);
    expect(sut.thenSubmittedLeadsAre()).toEqual([
      {
        kind: LeadFormKind.PROFESSIONAL_STUDY,
        fields: { company: 'Acme Logistique', role: 'Directeur', project_type: 'ROOFTOP' },
        consentText: 'consent-text-v1',
        callbackConsentedAt: '2026-10-05T08:30:00.000Z',
        pageUri: 'https://soliance-enr.fr/professionnels',
        pageName: 'professionals',
      },
    ]);
  });

  it('refuses a lead without callback consent and sends nothing', async () => {
    const actions = await sut.whenLeadIsSubmitted({ ...professionalForm, kind: LeadFormKind.REFERRAL, callbackConsent: false });

    expect(actions).toEqual([submitLeadFailed({ kind: LeadFormKind.REFERRAL, error: 'CONSENT_REQUIRED' })]);
    expect(sut.thenSubmittedLeadsAre()).toEqual([]);
  });

  it('propagates the gateway error code for the submitted form', async () => {
    sut.givenGatewayFails(new LeadError(LeadErrorType.NOT_CONFIGURED, 'HubSpot portal id or SIMULATION lead form id is missing'));

    const actions = await sut.whenLeadIsSubmitted({ ...professionalForm, kind: LeadFormKind.SIMULATION });

    expect(actions).toEqual([submitLeadFailed({ kind: LeadFormKind.SIMULATION, error: 'NOT_CONFIGURED' })]);
  });

  it('falls back to the unknown error code for an untyped failure', async () => {
    sut.givenGatewayFails(new Error('network down'));

    const actions = await sut.whenLeadIsSubmitted(professionalForm);

    expect(actions).toEqual([submitLeadFailed({ kind: LeadFormKind.PROFESSIONAL_STUDY, error: 'UNKNOWN_ERROR' })]);
  });
});
