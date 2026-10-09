import { combineReducers } from '@reduxjs/toolkit';
import { addressReducer } from '@/app/address/store/AddressSlice';
import { consentReducer } from '@/app/consent/store/ConsentSlice';
import { leadReducer } from '@/app/lead/store/LeadSlice';
import { solarYieldReducer } from '@/app/solar-yield/store/SolarYieldSlice';

export const coreReducer = combineReducers({
  lead: combineReducers({
    lead: leadReducer,
  }),
  consent: combineReducers({
    consent: consentReducer,
  }),
  address: combineReducers({
    address: addressReducer,
  }),
  solarYield: combineReducers({
    solarYield: solarYieldReducer,
  }),
});
