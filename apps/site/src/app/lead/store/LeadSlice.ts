import { createReducer } from '@reduxjs/toolkit';
import { CommonState } from '@/store/CommonState';
import { LeadFormKind } from '@/app/lead/domain/entities/LeadSubmission';
import {
  resetSubmitStudyRequestState,
  submitStudyRequestFailed,
  submitStudyRequestRequested,
  submitStudyRequestSucceeded,
} from '@/app/lead/domain/use-cases/submit-study-request/submitStudyRequestEpic';
import {
  resetSubmitLeadState,
  submitLeadFailed,
  submitLeadRequested,
  submitLeadSucceeded,
} from '@/app/lead/domain/use-cases/submit-lead/submitLeadEpic';

export type SubmitStudyRequestState = CommonState;

export type SubmitLeadState = Record<LeadFormKind, CommonState>;

export interface LeadState {
  submitStudyRequest: SubmitStudyRequestState;
  submitLead: SubmitLeadState;
}

const initialState: LeadState = {
  submitStudyRequest: { state: null },
  submitLead: {
    [LeadFormKind.PROFESSIONAL_STUDY]: { state: null },
    [LeadFormKind.REFERRAL]: { state: null },
    [LeadFormKind.SIMULATION]: { state: null },
    [LeadFormKind.CARE_REQUEST]: { state: null },
  },
};

export const leadReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(submitStudyRequestRequested, (state) => {
      state.submitStudyRequest = { state: 'pending' };
    })
    .addCase(submitStudyRequestSucceeded, (state) => {
      state.submitStudyRequest = { state: 'succeeded' };
    })
    .addCase(submitStudyRequestFailed, (state, action) => {
      state.submitStudyRequest = { state: 'failed', errorCode: action.payload.error };
    })
    .addCase(resetSubmitStudyRequestState, (state) => {
      state.submitStudyRequest = initialState.submitStudyRequest;
    })
    .addCase(submitLeadRequested, (state, action) => {
      state.submitLead[action.payload.form.kind] = { state: 'pending' };
    })
    .addCase(submitLeadSucceeded, (state, action) => {
      state.submitLead[action.payload.kind] = { state: 'succeeded' };
    })
    .addCase(submitLeadFailed, (state, action) => {
      state.submitLead[action.payload.kind] = { state: 'failed', errorCode: action.payload.error };
    })
    .addCase(resetSubmitLeadState, (state, action) => {
      state.submitLead[action.payload.kind] = initialState.submitLead[action.payload.kind];
    });
});
