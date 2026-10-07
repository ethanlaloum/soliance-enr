import { beforeEach, describe, expect, it } from 'vitest';
import { AnalyticsEventName } from '@/app/analytics/domain/entities/AnalyticsEvent';
import { LeadFormKind } from '@/app/lead/domain/entities/LeadSubmission';
import { submitLeadSucceeded } from '@/app/lead/domain/use-cases/submit-lead/submitLeadEpic';
import { submitStudyRequestSucceeded } from '@/app/lead/domain/use-cases/submit-study-request/submitStudyRequestEpic';
import { phoneCallClicked, trackConversionSucceeded } from './trackConversionEpic';
import { createTrackConversionEpicSUT } from './trackConversionEpic.sut';

const acceptance = { analytics: true, decidedAt: '2026-10-07T09:20:00.000Z', version: 1 };
const refusal = { analytics: false, decidedAt: '2026-10-07T09:15:00.000Z', version: 1 };

describe('Conversion tracking', () => {
  let sut: ReturnType<typeof createTrackConversionEpicSUT>;

  beforeEach(() => {
    sut = createTrackConversionEpicSUT();
  });

  it('tracks a sent study request as a lead when analytics is accepted', async () => {
    sut.givenConsentChoice(acceptance);

    const actions = await sut.whenConversionHappens(submitStudyRequestSucceeded());

    const event = { name: AnalyticsEventName.LEAD_SUBMITTED, params: { form_kind: 'STUDY_REQUEST' } };
    expect(actions).toEqual([trackConversionSucceeded({ event })]);
    expect(sut.thenTrackedEventsAre()).toEqual([event]);
  });

  it('tracks a sent form with its kind', async () => {
    sut.givenConsentChoice(acceptance);

    const actions = await sut.whenConversionHappens(submitLeadSucceeded({ kind: LeadFormKind.REFERRAL }));

    const event = { name: AnalyticsEventName.LEAD_SUBMITTED, params: { form_kind: 'REFERRAL' } };
    expect(actions).toEqual([trackConversionSucceeded({ event })]);
    expect(sut.thenTrackedEventsAre()).toEqual([event]);
  });

  it('tracks a click on a phone number with the number called', async () => {
    sut.givenConsentChoice(acceptance);

    const actions = await sut.whenConversionHappens(phoneCallClicked({ phoneNumber: '+33763545144' }));

    const event = { name: AnalyticsEventName.PHONE_CALL_CLICKED, params: { phone_number: '+33763545144' } };
    expect(actions).toEqual([trackConversionSucceeded({ event })]);
    expect(sut.thenTrackedEventsAre()).toEqual([event]);
  });

  it('tracks nothing when the visitor refused analytics', async () => {
    sut.givenConsentChoice(refusal);

    const actions = await sut.whenConversionHappens(submitLeadSucceeded({ kind: LeadFormKind.SIMULATION }));

    expect(actions).toEqual([]);
    expect(sut.thenTrackedEventsAre()).toEqual([]);
  });

  it('tracks nothing while the visitor has not decided', async () => {
    sut.givenConsentChoice(null);

    const actions = await sut.whenConversionHappens(phoneCallClicked({ phoneNumber: '+33763545144' }));

    expect(actions).toEqual([]);
    expect(sut.thenTrackedEventsAre()).toEqual([]);
  });
});
