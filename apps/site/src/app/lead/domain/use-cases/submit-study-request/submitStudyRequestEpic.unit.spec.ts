import { beforeEach, describe, expect, it } from 'vitest';
import { ProjectType, StudyRequestForm } from '@/app/lead/domain/entities/StudyRequest';
import { LeadError, LeadErrorType } from '@/app/lead/domain/ports/LeadGateway';
import { submitStudyRequestFailed, submitStudyRequestSucceeded } from './submitStudyRequestEpic';
import { createSubmitStudyRequestEpicSUT } from './submitStudyRequestEpic.sut';

const homeownerForm: StudyRequestForm = {
  fullName: '  Marie Dupont ',
  phone: '06 12 34 56 78',
  email: ' marie.dupont@example.com ',
  postalCode: '06700',
  projectType: ProjectType.SOLAR_PANELS,
  monthlyBill: '180 €',
  callbackConsent: true,
  consentText: 'consent-text-v1',
  pageUri: 'https://soliance-enr.fr/',
  pageName: 'home',
  spamTrap: { honeypot: '', formStartedAt: Date.parse('2026-10-05T08:29:48.000Z') },
};

describe('Study request submission', () => {
  let sut: ReturnType<typeof createSubmitStudyRequestEpicSUT>;

  beforeEach(() => {
    sut = createSubmitStudyRequestEpicSUT();
  });

  it('sends the normalised request stamped with the consent time and succeeds', async () => {
    const actions = await sut.whenStudyRequestIsSubmitted(homeownerForm);

    expect(actions).toEqual([submitStudyRequestSucceeded()]);
    expect(sut.thenSubmittedStudyRequestsAre()).toEqual([
      {
        fullName: 'Marie Dupont',
        phone: '0612345678',
        email: 'marie.dupont@example.com',
        postalCode: '06700',
        projectType: ProjectType.SOLAR_PANELS,
        monthlyBill: '180 €',
        consentText: 'consent-text-v1',
        callbackConsentedAt: '2026-10-05T08:30:00.000Z',
        pageUri: 'https://soliance-enr.fr/',
        pageName: 'home',
        spamSignals: { honeypot: '', fillDurationMs: 12000 },
      },
    ]);
  });

  it('sends null for an empty optional email and bill', async () => {
    await sut.whenStudyRequestIsSubmitted({ ...homeownerForm, email: '   ', monthlyBill: null });

    expect(sut.thenSubmittedStudyRequestsAre()).toEqual([
      {
        fullName: 'Marie Dupont',
        phone: '0612345678',
        email: null,
        postalCode: '06700',
        projectType: ProjectType.SOLAR_PANELS,
        monthlyBill: null,
        consentText: 'consent-text-v1',
        callbackConsentedAt: '2026-10-05T08:30:00.000Z',
        pageUri: 'https://soliance-enr.fr/',
        pageName: 'home',
        spamSignals: { honeypot: '', fillDurationMs: 12000 },
      },
    ]);
  });

  it('passes on the honeypot value and the time spent filling the form', async () => {
    await sut.whenStudyRequestIsSubmitted({
      ...homeownerForm,
      spamTrap: { honeypot: 'https://spam.example', formStartedAt: Date.parse('2026-10-05T08:29:59.200Z') },
    });

    expect(sut.thenSubmittedStudyRequestsAre().map((submitted) => submitted.spamSignals)).toEqual([
      { honeypot: 'https://spam.example', fillDurationMs: 800 },
    ]);
  });

  it('refuses a request without callback consent and sends nothing', async () => {
    const actions = await sut.whenStudyRequestIsSubmitted({ ...homeownerForm, callbackConsent: false });

    expect(actions).toEqual([submitStudyRequestFailed({ error: 'CONSENT_REQUIRED' })]);
    expect(sut.thenSubmittedStudyRequestsAre()).toEqual([]);
  });

  it('propagates the gateway error code', async () => {
    sut.givenGatewayFails(new LeadError(LeadErrorType.SUBMISSION_FAILED, 'Study request submission failed with status 500'));

    const actions = await sut.whenStudyRequestIsSubmitted(homeownerForm);

    expect(actions).toEqual([submitStudyRequestFailed({ error: 'SUBMISSION_FAILED' })]);
  });

  it('falls back to the unknown error code for an untyped failure', async () => {
    sut.givenGatewayFails(new Error('network down'));

    const actions = await sut.whenStudyRequestIsSubmitted(homeownerForm);

    expect(actions).toEqual([submitStudyRequestFailed({ error: 'UNKNOWN_ERROR' })]);
  });
});
