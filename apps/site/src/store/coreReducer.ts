import { combineReducers } from '@reduxjs/toolkit';
import { leadReducer } from '@/app/lead/store/LeadSlice';

export const coreReducer = combineReducers({
  lead: combineReducers({
    lead: leadReducer,
  }),
});
