import { AppState } from '@/store/AppState';
import { consentStatusOf, ConsentStatus } from '@/app/consent/domain/entities/ConsentChoice';

const selectConsentState = (state: AppState) => state.core.consent.consent;

export const selectConsentLoadIdle = (state: AppState) => selectConsentState(state).loadConsent.state === null;

export const selectConsentResolved = (state: AppState) => {
  const loadState = selectConsentState(state).loadConsent.state;
  return loadState === 'succeeded' || loadState === 'failed';
};

export const selectConsentStatus = (state: AppState): ConsentStatus | null =>
  selectConsentResolved(state) ? consentStatusOf(selectConsentState(state).choice) : null;

export const selectAnalyticsConsentGranted = (state: AppState) => selectConsentState(state).choice?.analytics === true;

export const selectConsentBannerVisible = (state: AppState) =>
  selectConsentResolved(state) && selectConsentState(state).choice === null && !selectConsentState(state).isEditing;

export const selectConsentEditionOpen = (state: AppState) => selectConsentState(state).isEditing;

export const selectConsentSaving = (state: AppState) => selectConsentState(state).saveConsent.state === 'pending';
