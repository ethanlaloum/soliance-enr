import { describe, expect, it } from 'vitest';
import {
  buildConsentChoice,
  consentStatusOf,
  ConsentStatus,
  isConsentChoiceCurrent,
  parseConsentChoice,
} from '@/app/consent/domain/entities/ConsentChoice';

describe('Consent choice', () => {
  it('stamps a choice with its decision time and the current consent version', () => {
    expect(buildConsentChoice(true, new Date('2026-10-07T09:15:00.000Z'))).toEqual({
      analytics: true,
      decidedAt: '2026-10-07T09:15:00.000Z',
      version: 1,
    });
  });

  it('keeps a choice made less than six months ago', () => {
    const choice = { analytics: false, decidedAt: '2026-04-10T09:00:00.000Z', version: 1 };

    expect(isConsentChoiceCurrent(choice, new Date('2026-10-07T09:00:00.000Z'))).toEqual(true);
  });

  it('expires a choice made 182 days ago or more', () => {
    const choice = { analytics: true, decidedAt: '2026-04-08T09:00:00.000Z', version: 1 };

    expect(isConsentChoiceCurrent(choice, new Date('2026-10-07T09:00:00.000Z'))).toEqual(false);
  });

  it('expires a choice made under a previous consent version', () => {
    const choice = { analytics: true, decidedAt: '2026-10-01T09:00:00.000Z', version: 0 };

    expect(isConsentChoiceCurrent(choice, new Date('2026-10-07T09:00:00.000Z'))).toEqual(false);
  });

  it('expires a choice whose decision time is unreadable', () => {
    const choice = { analytics: true, decidedAt: 'yesterday', version: 1 };

    expect(isConsentChoiceCurrent(choice, new Date('2026-10-07T09:00:00.000Z'))).toEqual(false);
  });

  it('reads a stored choice with the expected shape', () => {
    expect(parseConsentChoice({ analytics: true, decidedAt: '2026-10-01T09:00:00.000Z', version: 1, extra: 'ignored' })).toEqual({
      analytics: true,
      decidedAt: '2026-10-01T09:00:00.000Z',
      version: 1,
    });
  });

  it('rejects a stored value that is not a consent choice', () => {
    expect([parseConsentChoice('granted'), parseConsentChoice(null), parseConsentChoice({ analytics: 'yes', decidedAt: '2026-10-01', version: 1 })]).toEqual([
      null,
      null,
      null,
    ]);
  });

  it('derives the consent status from the choice', () => {
    expect([
      consentStatusOf(null),
      consentStatusOf({ analytics: true, decidedAt: '2026-10-01T09:00:00.000Z', version: 1 }),
      consentStatusOf({ analytics: false, decidedAt: '2026-10-01T09:00:00.000Z', version: 1 }),
    ]).toEqual([ConsentStatus.UNDECIDED, ConsentStatus.ANALYTICS_GRANTED, ConsentStatus.ANALYTICS_REFUSED]);
  });
});
