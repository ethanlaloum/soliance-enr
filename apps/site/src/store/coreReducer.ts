import { combineReducers } from '@reduxjs/toolkit';
import { consentReducer } from '@/app/consent/store/ConsentSlice';
import { leadReducer } from '@/app/lead/store/LeadSlice';

export const coreReducer = combineReducers({
  lead: combineReducers({
    lead: leadReducer,
  }),
  consent: combineReducers({
    consent: consentReducer,
  }),
});
