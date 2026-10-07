import { describe, expect, it } from 'vitest';
import { spamSignalsOf } from '@/app/lead/domain/entities/SpamTrap';

const submittedAt = new Date('2026-10-07T14:00:10.000Z');

describe('Spam signals', () => {
  it('measures the time between the form display and its submission', () => {
    expect(spamSignalsOf({ honeypot: '', formStartedAt: Date.parse('2026-10-07T13:59:47.500Z') }, submittedAt)).toEqual({
      honeypot: '',
      fillDurationMs: 22500,
    });
  });

  it('keeps whatever a robot typed in the honeypot', () => {
    expect(spamSignalsOf({ honeypot: 'https://spam.example', formStartedAt: Date.parse('2026-10-07T14:00:09.400Z') }, submittedAt)).toEqual({
      honeypot: 'https://spam.example',
      fillDurationMs: 600,
    });
  });

  it('reports no duration when the display time is unknown', () => {
    expect(spamSignalsOf({ honeypot: '', formStartedAt: null }, submittedAt)).toEqual({ honeypot: '', fillDurationMs: null });
  });

  it('never reports a negative duration when the clocks disagree', () => {
    expect(spamSignalsOf({ honeypot: '', formStartedAt: Date.parse('2026-10-07T14:00:12.000Z') }, submittedAt)).toEqual({
      honeypot: '',
      fillDurationMs: 0,
    });
  });
});
