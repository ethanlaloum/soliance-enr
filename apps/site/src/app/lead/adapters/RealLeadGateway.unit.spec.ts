import { firstValueFrom } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { SolianceRxLeadGateway } from '@/app/lead/adapters/RealLeadGateway';
import { ProjectType, StudyRequest } from '@/app/lead/domain/entities/StudyRequest';
import { LeadFormKind, LeadSubmission } from '@/app/lead/domain/entities/LeadSubmission';
import { LeadError, LeadErrorType } from '@/app/lead/domain/ports/LeadGateway';
import { FakeHttpClient } from '@/app/shared/test/FakeHttpClient';

const submitUrl = 'https://api.hsforms.com/submissions/v3/integration/submit/portal-1/form-1';
const referralUrl = 'https://api.hsforms.com/submissions/v3/integration/submit/portal-1/referral-form-1';

const settings = {
  portalId: 'portal-1',
  studyRequestFormId: 'form-1',
  leadFormIds: {
    [LeadFormKind.PROFESSIONAL_STUDY]: null,
    [LeadFormKind.REFERRAL]: 'referral-form-1',
    [LeadFormKind.SIMULATION]: 'simulation-form-1',
    [LeadFormKind.CARE_REQUEST]: 'care-form-1',
  },
};

const request: StudyRequest = {
  fullName: 'Marie Dupont',
  phone: '0612345678',
  email: 'marie.dupont@example.com',
  postalCode: '06700',
  projectType: ProjectType.SOLAR_PANELS,
  monthlyBill: '180 €',
  consentText: 'consent-text-v1',
  callbackConsentedAt: '2026-10-05T08:30:00.000Z',
  pageUri: 'https://soliance.fr/',
  pageName: 'home',
};

const captureError = async (promise: Promise<unknown>): Promise<unknown> => {
  try {
    await promise;
  } catch (error) {
    return error;
  }
  return null;
};

describe('HubSpot study request gateway', () => {
  let httpClient: FakeHttpClient;
  let gateway: SolianceRxLeadGateway;

  beforeEach(() => {
    httpClient = new FakeHttpClient();
    gateway = new SolianceRxLeadGateway(httpClient, settings);
  });

  it('posts every field, the page context and the consent text to the form endpoint', async () => {
    httpClient.willRespond(submitUrl, { inlineMessage: 'ok' });

    const result = await firstValueFrom(gateway.submitStudyRequest(request));

    expect(result).toEqual(undefined);
    expect(httpClient.postCalls).toEqual([
      {
        url: submitUrl,
        body: {
          submittedAt: '1791189000000',
          fields: [
            { objectTypeId: '0-1', name: 'full_name', value: 'Marie Dupont' },
            { objectTypeId: '0-1', name: 'phone', value: '0612345678' },
            { objectTypeId: '0-1', name: 'zip', value: '06700' },
            { objectTypeId: '0-1', name: 'project_type', value: 'SOLAR_PANELS' },
            { objectTypeId: '0-1', name: 'callback_consented_at', value: '2026-10-05T08:30:00.000Z' },
            { objectTypeId: '0-1', name: 'email', value: 'marie.dupont@example.com' },
            { objectTypeId: '0-1', name: 'monthly_electricity_bill', value: '180 €' },
          ],
          context: { pageUri: 'https://soliance.fr/', pageName: 'home' },
          legalConsentOptions: { consent: { consentToProcess: true, text: 'consent-text-v1' } },
        },
      },
    ]);
  });

  it('omits the optional fields that are empty', async () => {
    httpClient.willRespond(submitUrl, {});

    await firstValueFrom(gateway.submitStudyRequest({ ...request, email: null, monthlyBill: null }));

    expect(httpClient.postCalls[0]).toEqual({
      url: submitUrl,
      body: {
        submittedAt: '1791189000000',
        fields: [
          { objectTypeId: '0-1', name: 'full_name', value: 'Marie Dupont' },
          { objectTypeId: '0-1', name: 'phone', value: '0612345678' },
          { objectTypeId: '0-1', name: 'zip', value: '06700' },
          { objectTypeId: '0-1', name: 'project_type', value: 'SOLAR_PANELS' },
          { objectTypeId: '0-1', name: 'callback_consented_at', value: '2026-10-05T08:30:00.000Z' },
        ],
        context: { pageUri: 'https://soliance.fr/', pageName: 'home' },
        legalConsentOptions: { consent: { consentToProcess: true, text: 'consent-text-v1' } },
      },
    });
  });

  it('turns a 400 into an invalid request error', async () => {
    httpClient.willFail(submitUrl, 400, { status: 'error' });

    const error = await captureError(firstValueFrom(gateway.submitStudyRequest(request)));

    expect(error).toEqual(new LeadError(LeadErrorType.INVALID_REQUEST, 'Study request submission failed with status 400'));
    expect((error as LeadError).type).toEqual('INVALID_REQUEST');
  });

  it('turns any other failure status into a submission failure', async () => {
    httpClient.willFail(submitUrl, 503);

    const error = await captureError(firstValueFrom(gateway.submitStudyRequest(request)));

    expect(error).toEqual(new LeadError(LeadErrorType.SUBMISSION_FAILED, 'Study request submission failed with status 503'));
    expect((error as LeadError).type).toEqual('SUBMISSION_FAILED');
  });

  it('refuses to send when the HubSpot form is not configured', async () => {
    const unconfigured = new SolianceRxLeadGateway(httpClient, { ...settings, portalId: null });

    const error = await captureError(firstValueFrom(unconfigured.submitStudyRequest(request)));

    expect(error).toEqual(new LeadError(LeadErrorType.NOT_CONFIGURED, 'HubSpot portal id or study request form id is missing'));
    expect((error as LeadError).type).toEqual('NOT_CONFIGURED');
    expect(httpClient.postCalls).toEqual([]);
  });

  it('posts a generic lead with its fields and consent to the form of its kind', async () => {
    httpClient.willRespond(referralUrl, {});
    const submission: LeadSubmission = {
      kind: LeadFormKind.REFERRAL,
      fields: { referrer_name: 'Marie Dupont', referee_phone: '0612345678' },
      consentText: 'consent-text-v1',
      callbackConsentedAt: '2026-10-05T08:30:00.000Z',
      pageUri: 'https://soliance.fr/parrainage',
      pageName: 'referral',
    };

    await firstValueFrom(gateway.submitLead(submission));

    expect(httpClient.postCalls).toEqual([
      {
        url: referralUrl,
        body: {
          submittedAt: '1791189000000',
          fields: [
            { objectTypeId: '0-1', name: 'referrer_name', value: 'Marie Dupont' },
            { objectTypeId: '0-1', name: 'referee_phone', value: '0612345678' },
            { objectTypeId: '0-1', name: 'callback_consented_at', value: '2026-10-05T08:30:00.000Z' },
          ],
          context: { pageUri: 'https://soliance.fr/parrainage', pageName: 'referral' },
          legalConsentOptions: { consent: { consentToProcess: true, text: 'consent-text-v1' } },
        },
      },
    ]);
  });

  it('refuses a generic lead whose form is not configured', async () => {
    const submission: LeadSubmission = {
      kind: LeadFormKind.PROFESSIONAL_STUDY,
      fields: { company: 'Acme' },
      consentText: 'consent-text-v1',
      callbackConsentedAt: '2026-10-05T08:30:00.000Z',
      pageUri: 'https://soliance.fr/professionnels',
      pageName: 'professionals',
    };

    const error = await captureError(firstValueFrom(gateway.submitLead(submission)));

    expect(error).toEqual(new LeadError(LeadErrorType.NOT_CONFIGURED, 'HubSpot portal id or PROFESSIONAL_STUDY lead form id is missing'));
    expect(httpClient.postCalls).toEqual([]);
  });

  it('routes Care requests to their dedicated form with the selected offer and consent', async () => {
    const url = 'https://api.hsforms.com/submissions/v3/integration/submit/portal-1/care-form-1';
    httpClient.willRespond(url, {});
    await firstValueFrom(gateway.submitLead({
      kind: LeadFormKind.CARE_REQUEST,
      fields: { full_name: 'Camille Test', care_request_type: 'TAKEOVER', zip: '06700' },
      consentText: 'care-consent', callbackConsentedAt: request.callbackConsentedAt,
      pageUri: 'https://soliance.fr/soliance-care', pageName: 'Soliance Care',
    }));
    expect(httpClient.postCalls).toEqual([{ url, body: {
      submittedAt: '1791189000000',
      fields: [
        { objectTypeId: '0-1', name: 'full_name', value: 'Camille Test' },
        { objectTypeId: '0-1', name: 'care_request_type', value: 'TAKEOVER' },
        { objectTypeId: '0-1', name: 'zip', value: '06700' },
        { objectTypeId: '0-1', name: 'callback_consented_at', value: request.callbackConsentedAt },
      ],
      context: { pageUri: 'https://soliance.fr/soliance-care', pageName: 'Soliance Care' },
      legalConsentOptions: { consent: { consentToProcess: true, text: 'care-consent' } },
    } }]);
  });

  it('does not send Care requests to another form when its form ID is missing', async () => {
    const unconfigured = new SolianceRxLeadGateway(httpClient, { ...settings, leadFormIds: { ...settings.leadFormIds, [LeadFormKind.CARE_REQUEST]: null } });
    const error = await captureError(firstValueFrom(unconfigured.submitLead({
      kind: LeadFormKind.CARE_REQUEST, fields: { full_name: 'Camille Test' },
      consentText: 'care-consent', callbackConsentedAt: request.callbackConsentedAt,
      pageUri: 'https://soliance.fr/soliance-care', pageName: 'Soliance Care',
    })));
    expect((error as LeadError).type).toBe(LeadErrorType.NOT_CONFIGURED);
    expect(httpClient.postCalls).toEqual([]);
  });
});
