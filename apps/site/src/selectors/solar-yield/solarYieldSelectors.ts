import { AppState } from '@/store/AppState';

export const selectSolarYieldFetches = (state: AppState) => state.core.solarYield.solarYield.fetchSolarYield;

export const selectSolarYieldsByLocation = (state: AppState) => state.core.solarYield.solarYield.byLocation;
