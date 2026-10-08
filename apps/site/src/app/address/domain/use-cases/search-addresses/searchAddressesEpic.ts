import { createAction } from '@reduxjs/toolkit';
import { ofType } from 'redux-observable';
import { catchError, debounceTime, EMPTY, map, Observable, of, switchMap } from 'rxjs';
import { AppState } from '@/store/AppState';
import { Dependencies } from '@/store/dependencies.interface';
import { AddressSuggestion, isSearchableAddressQuery } from '@/app/address/domain/entities/AddressSuggestion';
import { AddressError, AddressErrorType } from '@/app/address/domain/ports/AddressGateway';

export const searchAddressesRequested = createAction<{ query: string }>('address/searchAddressesRequested');
export const searchAddressesSucceeded = createAction<{ suggestions: AddressSuggestion[] }>('address/searchAddressesSucceeded');
export const searchAddressesFailed = createAction<{ error: string }>('address/searchAddressesFailed');
export const resetSearchAddressesState = createAction('address/resetSearchAddressesState');

export const addressSearchDebounceMs = 250;

type SearchAddressesAction = ReturnType<typeof searchAddressesRequested> | ReturnType<typeof resetSearchAddressesState>;

export const searchAddressesEpic = (action$: Observable<SearchAddressesAction>, _state$: Observable<AppState>, { addressGateway }: Dependencies) =>
  action$.pipe(
    ofType(searchAddressesRequested.type, resetSearchAddressesState.type),
    debounceTime(addressSearchDebounceMs),
    switchMap((action) => {
      if (!searchAddressesRequested.match(action) || !isSearchableAddressQuery(action.payload.query)) return EMPTY;

      return addressGateway.searchAddresses(action.payload.query.trim()).pipe(
        map((suggestions) => searchAddressesSucceeded({ suggestions })),
        catchError((error: unknown) =>
          of(searchAddressesFailed({ error: error instanceof AddressError ? error.type : AddressErrorType.UNKNOWN_ERROR })),
        ),
      );
    }),
  );
