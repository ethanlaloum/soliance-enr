import { createAction } from '@reduxjs/toolkit';
import { ofType } from 'redux-observable';
import { catchError, exhaustMap, map, Observable, of } from 'rxjs';
import { AppState } from '@/store/AppState';
import { Dependencies } from '@/store/dependencies.interface';
import { ConsentChoice, isConsentChoiceCurrent } from '@/app/consent/domain/entities/ConsentChoice';
import { ConsentError, ConsentErrorType } from '@/app/consent/domain/ports/ConsentGateway';

export const loadConsentRequested = createAction('consent/loadConsentRequested');
export const loadConsentSucceeded = createAction<{ choice: ConsentChoice | null }>('consent/loadConsentSucceeded');
export const loadConsentFailed = createAction<{ error: string }>('consent/loadConsentFailed');

export const loadConsentEpic = (
  action$: Observable<ReturnType<typeof loadConsentRequested>>,
  _state$: Observable<AppState>,
  { consentGateway, clock }: Dependencies,
) =>
  action$.pipe(
    ofType(loadConsentRequested.type),
    exhaustMap(() =>
      consentGateway.readChoice().pipe(
        map((choice) => loadConsentSucceeded({ choice: choice !== null && isConsentChoiceCurrent(choice, clock.now()) ? choice : null })),
        catchError((error: unknown) =>
          of(loadConsentFailed({ error: error instanceof ConsentError ? error.type : ConsentErrorType.UNKNOWN_ERROR })),
        ),
      ),
    ),
  );
