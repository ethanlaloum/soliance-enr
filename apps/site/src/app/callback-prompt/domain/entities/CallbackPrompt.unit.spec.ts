import { describe, expect, it } from 'vitest';
import { callbackPromptSnoozeMs, isCallbackPromptAllowedOn, isCallbackPromptSnoozed } from '@/app/callback-prompt/domain/entities/CallbackPrompt';

describe('Callback prompt', () => {
  it('stays away from the simulator, the legal pages and Soliance Care, with or without a trailing slash', () => {
    expect(
      ['/', '/panneaux-solaires', '/realisations/vence-villa-16-kwc', '/simulateur', '/simulateur/', '/mentions-legales', '/confidentialite', '/cookies', '/soliance-care'].map(
        isCallbackPromptAllowedOn,
      ),
    ).toEqual([true, true, true, false, false, false, false, false, false]);
  });

  it('stays hidden for seven days after it was closed', () => {
    const dismissedAt = 1_000_000;
    expect([
      isCallbackPromptSnoozed(null, dismissedAt),
      isCallbackPromptSnoozed(dismissedAt, dismissedAt + callbackPromptSnoozeMs - 1),
      isCallbackPromptSnoozed(dismissedAt, dismissedAt + callbackPromptSnoozeMs),
    ]).toEqual([false, true, false]);
  });
});
