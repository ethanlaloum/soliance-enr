import { describe, expect, it } from 'vitest';
import { consentReducer, initialConsentState } from '@/app/consent/store/ConsentSlice';
import { loadConsentFailed, loadConsentRequested, loadConsentSucceeded } from '@/app/consent/domain/use-cases/load-consent/loadConsentEpic';
import { saveConsentFailed, saveConsentRequested, saveConsentSucceeded } from '@/app/consent/domain/use-cases/save-consent/saveConsentEpic';
import { consentEditionClosed, consentEditionOpened } from '@/app/consent/domain/use-cases/edit-consent/editConsent';

const refusal = { analytics: false, decidedAt: '2026-10-07T09:15:00.000Z', version: 1 };
const acceptance = { analytics: true, decidedAt: '2026-10-07T09:20:00.000Z', version: 1 };

describe('Consent slice', () => {
  it('starts with no choice, nothing loaded and the preferences closed', () => {
    expect(consentReducer(undefined, { type: 'unknown' })).toEqual({
      loadConsent: { state: null },
      saveConsent: { state: null },
      choice: null,
      isEditing: false,
    });
  });

  it('marks the loading as pending then restores the stored choice', () => {
    const pending = consentReducer(initialConsentState, loadConsentRequested());
    const loaded = consentReducer(pending, loadConsentSucceeded({ choice: refusal }));

    expect([pending, loaded]).toEqual([
      { ...initialConsentState, loadConsent: { state: 'pending' } },
      { ...initialConsentState, loadConsent: { state: 'succeeded' }, choice: refusal },
    ]);
  });

  it('records a failed loading without any choice', () => {
    expect(consentReducer(initialConsentState, loadConsentFailed({ error: 'STORAGE_UNAVAILABLE' }))).toEqual({
      ...initialConsentState,
      loadConsent: { state: 'failed', errorCode: 'STORAGE_UNAVAILABLE' },
    });
  });

  it('applies a saved choice and closes the preferences', () => {
    const editing = { ...initialConsentState, loadConsent: { state: 'succeeded' as const }, choice: refusal, isEditing: true };
    const pending = consentReducer(editing, saveConsentRequested({ analytics: true }));
    const saved = consentReducer(pending, saveConsentSucceeded({ choice: acceptance }));

    expect([pending, saved]).toEqual([
      { ...editing, saveConsent: { state: 'pending' } },
      { loadConsent: { state: 'succeeded' }, saveConsent: { state: 'succeeded' }, choice: acceptance, isEditing: false },
    ]);
  });

  it('applies a choice that could not be stored and closes the preferences', () => {
    const editing = { ...initialConsentState, loadConsent: { state: 'succeeded' as const }, isEditing: true };

    expect(consentReducer(editing, saveConsentFailed({ choice: refusal, error: 'STORAGE_UNAVAILABLE' }))).toEqual({
      loadConsent: { state: 'succeeded' },
      saveConsent: { state: 'failed', errorCode: 'STORAGE_UNAVAILABLE' },
      choice: refusal,
      isEditing: false,
    });
  });

  it('opens and closes the preferences without touching the choice', () => {
    const decided = { ...initialConsentState, loadConsent: { state: 'succeeded' as const }, choice: acceptance };
    const opened = consentReducer(decided, consentEditionOpened());
    const closed = consentReducer(opened, consentEditionClosed());

    expect([opened, closed]).toEqual([
      { ...decided, isEditing: true },
      { ...decided, isEditing: false },
    ]);
  });
});
