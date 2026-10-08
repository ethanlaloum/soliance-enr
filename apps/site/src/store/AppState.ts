import { AddressState } from '@/app/address/store/AddressSlice';
import { ConsentState } from '@/app/consent/store/ConsentSlice';
import { LeadState } from '@/app/lead/store/LeadSlice';

export interface AppState {
  core: {
    lead: {
      lead: LeadState;
    };
    consent: {
      consent: ConsentState;
    };
    address: {
      address: AddressState;
    };
  };
}
