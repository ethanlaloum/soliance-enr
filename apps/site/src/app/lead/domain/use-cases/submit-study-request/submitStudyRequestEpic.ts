import { createAction } from '@reduxjs/toolkit';
import { ofType } from 'redux-observable';
import { catchError, exhaustMap, map, Observable, of } from 'rxjs';
import { AppState } from '@/store/AppState';
import { Dependencies } from '@/store/dependencies.interface';
import { buildStudyRequest, StudyRequestForm } from '@/app/lead/domain/entities/StudyRequest';
import { LeadError, LeadErrorType } from '@/app/lead/domain/ports/LeadGateway';

export const submitStudyRequestRequested = createAction<{ form: StudyRequestForm }>('lead/submitStudyRequestRequested');
export const submitStudyRequestSucceeded = createAction('lead/submitStudyRequestSucceeded');
export const submitStudyRequestFailed = createAction<{ error: string }>('lead/submitStudyRequestFailed');
export const resetSubmitStudyRequestState = createAction('lead/resetSubmitStudyRequestState');

export const submitStudyRequestEpic = (
  action$: Observable<ReturnType<typeof submitStudyRequestRequested>>,
  _state$: Observable<AppState>,
  { leadGateway, clock }: Dependencies,
) =>
  action$.pipe(
    ofType(submitStudyRequestRequested.type),
    exhaustMap((action) => {
      const { form } = action.payload;
      if (!form.callbackConsent) {
        return of(submitStudyRequestFailed({ error: LeadErrorType.CONSENT_REQUIRED }));
      }

      return leadGateway.submitStudyRequest(buildStudyRequest(form, clock.now())).pipe(
        map(() => submitStudyRequestSucceeded()),
        catchError((error: unknown) =>
          of(submitStudyRequestFailed({ error: error instanceof LeadError ? error.type : LeadErrorType.UNKNOWN_ERROR })),
        ),
      );
    }),
  );
