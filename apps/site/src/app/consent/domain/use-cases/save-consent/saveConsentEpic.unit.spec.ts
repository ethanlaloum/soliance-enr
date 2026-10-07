import { beforeEach, describe, expect, it } from 'vitest';
import { ConsentError, ConsentErrorType } from '@/app/consent/domain/ports/ConsentGateway';
import { saveConsentFailed, saveConsentSucceeded } from './saveConsentEpic';
import { createSaveConsentEpicSUT } from './saveConsentEpic.sut';

describe('Consent saving', () => {
  let sut: ReturnType<typeof createSaveConsentEpicSUT>;

  beforeEach(() => {
    sut = createSaveConsentEpicSUT();
  });

  it('stores an acceptance stamped with the decision time and version', async () => {
    const actions = await sut.whenVisitorDecides(true);

    const choice = { analytics: true, decidedAt: '2026-10-07T09:15:00.000Z', version: 1 };
    expect(actions).toEqual([saveConsentSucceeded({ choice })]);
    expect(sut.thenSavedChoicesAre()).toEqual([choice]);
  });

  it('stores a refusal the same way', async () => {
    const actions = await sut.whenVisitorDecides(false);

    const choice = { analytics: false, decidedAt: '2026-10-07T09:15:00.000Z', version: 1 };
    expect(actions).toEqual([saveConsentSucceeded({ choice })]);
    expect(sut.thenSavedChoicesAre()).toEqual([choice]);
  });

  it('keeps the choice for the visit when it cannot be stored', async () => {
    sut.givenStorageFails(new ConsentError(ConsentErrorType.STORAGE_UNAVAILABLE, 'The consent choice cannot be stored'));

    const actions = await sut.whenVisitorDecides(false);

    expect(actions).toEqual([
      saveConsentFailed({ choice: { analytics: false, decidedAt: '2026-10-07T09:15:00.000Z', version: 1 }, error: 'STORAGE_UNAVAILABLE' }),
    ]);
    expect(sut.thenSavedChoicesAre()).toEqual([]);
  });
});
