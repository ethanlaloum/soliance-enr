import { beforeEach, describe, expect, it } from 'vitest';
import { ConsentError, ConsentErrorType } from '@/app/consent/domain/ports/ConsentGateway';
import { loadConsentFailed, loadConsentSucceeded } from './loadConsentEpic';
import { createLoadConsentEpicSUT } from './loadConsentEpic.sut';

describe('Consent loading', () => {
  let sut: ReturnType<typeof createLoadConsentEpicSUT>;

  beforeEach(() => {
    sut = createLoadConsentEpicSUT();
  });

  it('restores a choice made less than six months ago', async () => {
    sut.givenStoredChoice({ analytics: true, decidedAt: '2026-09-01T10:00:00.000Z', version: 1 });

    const actions = await sut.whenConsentIsLoaded();

    expect(actions).toEqual([loadConsentSucceeded({ choice: { analytics: true, decidedAt: '2026-09-01T10:00:00.000Z', version: 1 } })]);
  });

  it('asks again when the stored choice is older than six months', async () => {
    sut.givenStoredChoice({ analytics: false, decidedAt: '2026-03-01T10:00:00.000Z', version: 1 });

    const actions = await sut.whenConsentIsLoaded();

    expect(actions).toEqual([loadConsentSucceeded({ choice: null })]);
  });

  it('asks when no choice was stored', async () => {
    sut.givenStoredChoice(null);

    const actions = await sut.whenConsentIsLoaded();

    expect(actions).toEqual([loadConsentSucceeded({ choice: null })]);
  });

  it('propagates the storage error code', async () => {
    sut.givenStorageFails(new ConsentError(ConsentErrorType.STORAGE_UNAVAILABLE, 'The consent choice cannot be stored'));

    const actions = await sut.whenConsentIsLoaded();

    expect(actions).toEqual([loadConsentFailed({ error: 'STORAGE_UNAVAILABLE' })]);
  });
});
