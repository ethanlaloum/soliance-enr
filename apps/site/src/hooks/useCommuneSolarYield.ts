import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/redux';
import { AddressLocation } from '@/app/address/domain/entities/AddressSuggestion';
import { CommuneSolarYield, solarYieldKeyOf } from '@/app/solar-yield/domain/entities/CommuneSolarYield';
import { fetchSolarYieldRequested } from '@/app/solar-yield/domain/use-cases/fetch-solar-yield/fetchSolarYieldEpic';
import { selectSolarYieldFetches, selectSolarYieldsByLocation } from '@/selectors/solar-yield/solarYieldSelectors';

export const useCommuneSolarYield = (location: AddressLocation | null): CommuneSolarYield | null => {
  const dispatch = useAppDispatch();
  const fetches = useAppSelector(selectSolarYieldFetches);
  const yields = useAppSelector(selectSolarYieldsByLocation);
  const key = location ? solarYieldKeyOf(location) : null;
  const isKnown = key !== null && fetches[key] !== undefined;

  useEffect(() => {
    if (location && !isKnown) dispatch(fetchSolarYieldRequested({ location }));
  }, [dispatch, location, isKnown]);

  return key ? (yields[key] ?? null) : null;
};
