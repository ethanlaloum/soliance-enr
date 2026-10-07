import { beforeEach, describe, expect, it } from 'vitest';
import { loadConsentSucceeded } from '@/app/consent/domain/use-cases/load-consent/loadConsentEpic';
import { saveConsentFailed, saveConsentSucceeded } from '@/app/consent/domain/use-cases/save-consent/saveConsentEpic';
import { applyAnalyticsConsentFailed, applyAnalyticsConsentSucceeded } from './applyAnalyticsConsentEpic';
import { createApplyAnalyticsConsentEpicSUT } from './applyAnalyticsConsentEpic.sut';

const acceptance = { analytics: true, decidedAt: '2026-10-07T09:20:00.000Z', version: 1 };
const refusal = { analytics: false, decidedAt: '2026-10-07T09:15:00.000Z', version: 1 };

describe('Analytics consent application', () => {
  let sut: ReturnType<typeof createApplyAnalyticsConsentEpicSUT>;

  beforeEach(() => {
    sut = createApplyAnalyticsConsentEpicSUT();
  });

  it('enables analytics when a restored choice accepts it', async () => {
    const actions = await sut.whenConsentOutcomeIs(loadConsentSucceeded({ choice: acceptance }));

    expect(actions).toEqual([applyAnalyticsConsentSucceeded({ enabled: true })]);
    expect(sut.thenAnalyticsSwitchesAre()).toEqual(['enable']);
  });

  it('keeps analytics disabled while the visitor has not decided', async () => {
    const actions = await sut.whenConsentOutcomeIs(loadConsentSucceeded({ choice: null }));

    expect(actions).toEqual([applyAnalyticsConsentSucceeded({ enabled: false })]);
    expect(sut.thenAnalyticsSwitchesAre()).toEqual(['disable']);
  });

  it('disables analytics when the visitor withdraws consent', async () => {
    const actions = await sut.whenConsentOutcomeIs(saveConsentSucceeded({ choice: refusal }));

    expect(actions).toEqual([applyAnalyticsConsentSucceeded({ enabled: false })]);
    expect(sut.thenAnalyticsSwitchesAre()).toEqual(['disable']);
  });

  it('applies an acceptance that could not be stored', async () => {
    const actions = await sut.whenConsentOutcomeIs(saveConsentFailed({ choice: acceptance, error: 'STORAGE_UNAVAILABLE' }));

    expect(actions).toEqual([applyAnalyticsConsentSucceeded({ enabled: true })]);
    expect(sut.thenAnalyticsSwitchesAre()).toEqual(['enable']);
  });

  it('reports a failure when the analytics tag cannot be switched', async () => {
    sut.givenAnalyticsFails(new Error('Tag unavailable'));

    const actions = await sut.whenConsentOutcomeIs(saveConsentSucceeded({ choice: acceptance }));

    expect(actions).toEqual([applyAnalyticsConsentFailed({ error: 'UNKNOWN_ERROR' })]);
  });
});
