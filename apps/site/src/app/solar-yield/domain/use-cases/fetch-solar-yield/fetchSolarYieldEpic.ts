import { createAction } from '@reduxjs/toolkit';
import { ofType } from 'redux-observable';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';
import { AppState } from '@/store/AppState';
import { Dependencies } from '@/store/dependencies.interface';
import { AddressLocation } from '@/app/address/domain/entities/AddressSuggestion';
import { CommuneSolarYield, solarYieldKeyOf } from '@/app/solar-yield/domain/entities/CommuneSolarYield';
import { SolarYieldError, SolarYieldErrorType } from '@/app/solar-yield/domain/ports/SolarYieldGateway';

export const fetchSolarYieldRequested = createAction<{ location: AddressLocation }>('solarYield/fetchSolarYieldRequested');
export const fetchSolarYieldSucceeded = createAction<{ key: string; solarYield: CommuneSolarYield }>('solarYield/fetchSolarYieldSucceeded');
export const fetchSolarYieldFailed = createAction<{ key: string; error: string }>('solarYield/fetchSolarYieldFailed');

type FetchSolarYieldAction = ReturnType<typeof fetchSolarYieldRequested>;

export const fetchSolarYieldEpic = (action$: Observable<FetchSolarYieldAction>, _state$: Observable<AppState>, { solarYieldGateway }: Dependencies) =>
  action$.pipe(
    ofType(fetchSolarYieldRequested.type),
    mergeMap(({ payload }: FetchSolarYieldAction) => {
      const key = solarYieldKeyOf(payload.location);
      return solarYieldGateway.fetchSolarYield(payload.location).pipe(
        map((solarYield) => fetchSolarYieldSucceeded({ key, solarYield })),
        catchError((error: unknown) =>
          of(fetchSolarYieldFailed({ key, error: error instanceof SolarYieldError ? error.type : SolarYieldErrorType.UNKNOWN_ERROR })),
        ),
      );
    }),
  );
