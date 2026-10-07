import { firstValueFrom } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { SolianceRxLeadGateway } from '@/app/lead/adapters/RealLeadGateway';
import { ProjectType, StudyRequest } from '@/app/lead/domain/entities/StudyRequest';
import { LeadFormKind, LeadSubmission } from '@/app/lead/domain/entities/LeadSubmission';
import { LeadError, LeadErrorType } from '@/app/lead/domain/ports/LeadGateway';
import { FakeHttpClient } from '@/app/shared/test/FakeHttpClient';

const endpoint = '/api/lead.php';

const request: StudyRequest = {
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
};

const captureError = async (promise: Promise<unknown>): Promise<unknown> => {
  try {
    await promise;
  } catch (error) {
    return error;
  }
  return null;
};

describe('Lead mail gateway', () => {
  let httpClient: FakeHttpClient;
  let gateway: SolianceRxLeadGateway;

  beforeEach(() => {
    httpClient = new FakeHttpClient();
    gateway = new SolianceRxLeadGateway(httpClient, endpoint);
  });

  it('posts a study request with every field, the page context and the consent to the lead endpoint', async () => {
    httpClient.willRespond(endpoint, { status: 'sent' });

    const result = await firstValueFrom(gateway.submitStudyRequest(request));

    expect(result).toEqual(undefined);
    expect(httpClient.postCalls).toEqual([
      {
        url: endpoint,
        body: {
          kind: 'STUDY_REQUEST',
          fields: {
            full_name: 'Marie Dupont',
            phone: '0612345678',
            zip: '06700',
            project_type: 'SOLAR_PANELS',
            email: 'marie.dupont@example.com',
            monthly_electricity_bill: '180 €',
          },
          consentText: 'consent-text-v1',
          callbackConsentedAt: '2026-10-05T08:30:00.000Z',
          pageUri: 'https://soliance-enr.fr/',
          pageName: 'home',
        },
      },
    ]);
  });

  it('omits the optional study request fields that are empty', async () => {
    httpClient.willRespond(endpoint, { status: 'sent' });

    await firstValueFrom(gateway.submitStudyRequest({ ...request, email: null, monthlyBill: null }));

    expect(httpClient.postCalls).toEqual([
      {
        url: endpoint,
        body: {
          kind: 'STUDY_REQUEST',
          fields: { full_name: 'Marie Dupont', phone: '0612345678', zip: '06700', project_type: 'SOLAR_PANELS' },
          consentText: 'consent-text-v1',
          callbackConsentedAt: '2026-10-05T08:30:00.000Z',
          pageUri: 'https://soliance-enr.fr/',
          pageName: 'home',
        },
      },
    ]);
  });

  it('turns a 400 into an invalid request error', async () => {
    httpClient.willFail(endpoint, 400, { error: 'INVALID_REQUEST' });

    const error = await captureError(firstValueFrom(gateway.submitStudyRequest(request)));

    expect(error).toEqual(new LeadError(LeadErrorType.INVALID_REQUEST, 'Study request submission failed with status 400'));
    expect((error as LeadError).type).toEqual('INVALID_REQUEST');
  });

  it('turns a 503 not configured answer into a not configured error', async () => {
    httpClient.willFail(endpoint, 503, { error: 'NOT_CONFIGURED' });

    const error = await captureError(firstValueFrom(gateway.submitStudyRequest(request)));

    expect(error).toEqual(new LeadError(LeadErrorType.NOT_CONFIGURED, 'Lead mail is not configured on the server'));
    expect((error as LeadError).type).toEqual('NOT_CONFIGURED');
  });

  it('turns any other failure status into a submission failure', async () => {
    httpClient.willFail(endpoint, 502, { error: 'SUBMISSION_FAILED' });

    const error = await captureError(firstValueFrom(gateway.submitStudyRequest(request)));

    expect(error).toEqual(new LeadError(LeadErrorType.SUBMISSION_FAILED, 'Study request submission failed with status 502'));
    expect((error as LeadError).type).toEqual('SUBMISSION_FAILED');
  });

  it('turns a 503 without the not configured code into a submission failure', async () => {
    httpClient.willFail(endpoint, 503, '<html>Service Unavailable</html>');

    const error = await captureError(firstValueFrom(gateway.submitStudyRequest(request)));

    expect(error).toEqual(new LeadError(LeadErrorType.SUBMISSION_FAILED, 'Study request submission failed with status 503'));
  });

  it('posts a generic lead with its kind, its fields and its consent', async () => {
    httpClient.willRespond(endpoint, { status: 'sent' });
    const submission: LeadSubmission = {
      kind: LeadFormKind.REFERRAL,
      fields: { referrer_full_name: 'Marie Dupont', referee_phone: '0612345678' },
      consentText: 'consent-text-v1',
      callbackConsentedAt: '2026-10-05T08:30:00.000Z',
      pageUri: 'https://soliance-enr.fr/parrainage',
      pageName: 'referral',
    };

    await firstValueFrom(gateway.submitLead(submission));

    expect(httpClient.postCalls).toEqual([
      {
        url: endpoint,
        body: {
          kind: 'REFERRAL',
          fields: { referrer_full_name: 'Marie Dupont', referee_phone: '0612345678' },
          consentText: 'consent-text-v1',
          callbackConsentedAt: '2026-10-05T08:30:00.000Z',
          pageUri: 'https://soliance-enr.fr/parrainage',
          pageName: 'referral',
        },
      },
    ]);
  });

  it('names the lead kind in the failure of a generic lead', async () => {
    httpClient.willFail(endpoint, 429, { error: 'TOO_MANY_REQUESTS' });
    const submission: LeadSubmission = {
      kind: LeadFormKind.CARE_REQUEST,
      fields: { full_name: 'Camille Martin', zip: '06700', care_request_type: 'TAKEOVER' },
      consentText: 'care-consent-v1',
      callbackConsentedAt: '2026-10-05T08:30:00.000Z',
      pageUri: 'https://soliance-enr.fr/soliance-care',
      pageName: 'care',
    };

    const error = await captureError(firstValueFrom(gateway.submitLead(submission)));

    expect(error).toEqual(new LeadError(LeadErrorType.SUBMISSION_FAILED, 'CARE_REQUEST lead submission failed with status 429'));
    expect((error as LeadError).type).toEqual('SUBMISSION_FAILED');
  });
});
