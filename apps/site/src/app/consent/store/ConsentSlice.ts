import { createReducer } from '@reduxjs/toolkit';
import { CommonState } from '@/store/CommonState';
import { ConsentChoice } from '@/app/consent/domain/entities/ConsentChoice';
import { loadConsentFailed, loadConsentRequested, loadConsentSucceeded } from '@/app/consent/domain/use-cases/load-consent/loadConsentEpic';
import { saveConsentFailed, saveConsentRequested, saveConsentSucceeded } from '@/app/consent/domain/use-cases/save-consent/saveConsentEpic';
import { consentEditionClosed, consentEditionOpened } from '@/app/consent/domain/use-cases/edit-consent/editConsent';

export interface ConsentState {
  loadConsent: CommonState;
  saveConsent: CommonState;
  choice: ConsentChoice | null;
  isEditing: boolean;
}

export const initialConsentState: ConsentState = {
  loadConsent: { state: null },
  saveConsent: { state: null },
  choice: null,
  isEditing: false,
};

export const consentReducer = createReducer(initialConsentState, (builder) => {
  builder
    .addCase(loadConsentRequested, (state) => {
      state.loadConsent = { state: 'pending' };
    })
    .addCase(loadConsentSucceeded, (state, action) => {
      state.loadConsent = { state: 'succeeded' };
      state.choice = action.payload.choice;
    })
    .addCase(loadConsentFailed, (state, action) => {
      state.loadConsent = { state: 'failed', errorCode: action.payload.error };
      state.choice = null;
    })
    .addCase(saveConsentRequested, (state) => {
      state.saveConsent = { state: 'pending' };
    })
    .addCase(saveConsentSucceeded, (state, action) => {
      state.saveConsent = { state: 'succeeded' };
      state.choice = action.payload.choice;
      state.isEditing = false;
    })
    .addCase(saveConsentFailed, (state, action) => {
      state.saveConsent = { state: 'failed', errorCode: action.payload.error };
      state.choice = action.payload.choice;
      state.isEditing = false;
    })
    .addCase(consentEditionOpened, (state) => {
      state.isEditing = true;
    })
    .addCase(consentEditionClosed, (state) => {
      state.isEditing = false;
    });
});
