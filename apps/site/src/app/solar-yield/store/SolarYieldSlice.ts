import { createReducer } from '@reduxjs/toolkit';
import { CommonState } from '@/store/CommonState';
import { CommuneSolarYield, solarYieldKeyOf } from '@/app/solar-yield/domain/entities/CommuneSolarYield';
import {
  fetchSolarYieldFailed,
  fetchSolarYieldRequested,
  fetchSolarYieldSucceeded,
} from '@/app/solar-yield/domain/use-cases/fetch-solar-yield/fetchSolarYieldEpic';

export interface SolarYieldState {
  fetchSolarYield: Record<string, CommonState>;
  byLocation: Record<string, CommuneSolarYield>;
}

const initialState: SolarYieldState = {
  fetchSolarYield: {},
  byLocation: {},
};

export const solarYieldReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(fetchSolarYieldRequested, (state, action) => {
      state.fetchSolarYield[solarYieldKeyOf(action.payload.location)] = { state: 'pending' };
    })
    .addCase(fetchSolarYieldSucceeded, (state, action) => {
      state.fetchSolarYield[action.payload.key] = { state: 'succeeded' };
      state.byLocation[action.payload.key] = action.payload.solarYield;
    })
    .addCase(fetchSolarYieldFailed, (state, action) => {
      state.fetchSolarYield[action.payload.key] = { state: 'failed', errorCode: action.payload.error };
    });
});
