import { AppState } from '@/store/AppState';
import { LeadFormKind } from '@/app/lead/domain/entities/LeadSubmission';

export const selectSubmitStudyRequestLoading = (state: AppState) => state.core.lead.lead.submitStudyRequest.state === 'pending';
export const selectSubmitStudyRequestSuccess = (state: AppState) => state.core.lead.lead.submitStudyRequest.state === 'succeeded';
export const selectSubmitStudyRequestError = (state: AppState) => state.core.lead.lead.submitStudyRequest.errorCode ?? null;

export const selectSubmitLeadLoading = (state: AppState, kind: LeadFormKind) => state.core.lead.lead.submitLead[kind].state === 'pending';
export const selectSubmitLeadSuccess = (state: AppState, kind: LeadFormKind) => state.core.lead.lead.submitLead[kind].state === 'succeeded';
export const selectSubmitLeadError = (state: AppState, kind: LeadFormKind) => state.core.lead.lead.submitLead[kind].errorCode ?? null;
