import { LeadState } from '@/app/lead/store/LeadSlice';

export interface AppState {
  core: {
    lead: {
      lead: LeadState;
    };
  };
}
