import { createAction } from '@reduxjs/toolkit';
import { ofType } from 'redux-observable';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { AppState } from '@/store/AppState';
import { Dependencies } from '@/store/dependencies.interface';
import { AnalyticsErrorType } from '@/app/analytics/domain/ports/AnalyticsGateway';
import { loadConsentSucceeded } from '@/app/consent/domain/use-cases/load-consent/loadConsentEpic';
import { saveConsentFailed, saveConsentSucceeded } from '@/app/consent/domain/use-cases/save-consent/saveConsentEpic';

export const applyAnalyticsConsentSucceeded = createAction<{ enabled: boolean }>('analytics/applyAnalyticsConsentSucceeded');
export const applyAnalyticsConsentFailed = createAction<{ error: string }>('analytics/applyAnalyticsConsentFailed');

type ConsentOutcome = ReturnType<typeof loadConsentSucceeded> | ReturnType<typeof saveConsentSucceeded> | ReturnType<typeof saveConsentFailed>;

export const applyAnalyticsConsentEpic = (
  action$: Observable<ConsentOutcome>,
  _state$: Observable<AppState>,
  { analyticsGateway }: Dependencies,
) =>
  action$.pipe(
    ofType(loadConsentSucceeded.type, saveConsentSucceeded.type, saveConsentFailed.type),
    switchMap((action) => {
      const enabled = action.payload.choice?.analytics === true;
      const toggle = enabled ? analyticsGateway.enable() : analyticsGateway.disable();

      return toggle.pipe(
        map(() => applyAnalyticsConsentSucceeded({ enabled })),
        catchError(() => of(applyAnalyticsConsentFailed({ error: AnalyticsErrorType.UNKNOWN_ERROR }))),
      );
    }),
  );
