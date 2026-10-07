import { createAction } from '@reduxjs/toolkit';
import { ofType } from 'redux-observable';
import { catchError, exhaustMap, map, Observable, of } from 'rxjs';
import { AppState } from '@/store/AppState';
import { Dependencies } from '@/store/dependencies.interface';
import { buildConsentChoice, ConsentChoice } from '@/app/consent/domain/entities/ConsentChoice';
import { ConsentError, ConsentErrorType } from '@/app/consent/domain/ports/ConsentGateway';

export const saveConsentRequested = createAction<{ analytics: boolean }>('consent/saveConsentRequested');
export const saveConsentSucceeded = createAction<{ choice: ConsentChoice }>('consent/saveConsentSucceeded');
export const saveConsentFailed = createAction<{ choice: ConsentChoice; error: string }>('consent/saveConsentFailed');

export const saveConsentEpic = (
  action$: Observable<ReturnType<typeof saveConsentRequested>>,
  _state$: Observable<AppState>,
  { consentGateway, clock }: Dependencies,
) =>
  action$.pipe(
    ofType(saveConsentRequested.type),
    exhaustMap((action) => {
      const choice = buildConsentChoice(action.payload.analytics, clock.now());

      return consentGateway.saveChoice(choice).pipe(
        map(() => saveConsentSucceeded({ choice })),
        catchError((error: unknown) =>
          of(saveConsentFailed({ choice, error: error instanceof ConsentError ? error.type : ConsentErrorType.UNKNOWN_ERROR })),
        ),
      );
    }),
  );
