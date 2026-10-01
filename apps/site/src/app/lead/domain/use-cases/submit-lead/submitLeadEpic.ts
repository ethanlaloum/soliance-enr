import { createAction } from '@reduxjs/toolkit';
import { ofType } from 'redux-observable';
import { catchError, exhaustMap, map, Observable, of } from 'rxjs';
import { AppState } from '@/store/AppState';
import { Dependencies } from '@/store/dependencies.interface';
import { buildLeadSubmission, LeadFormKind, LeadSubmissionForm } from '@/app/lead/domain/entities/LeadSubmission';
import { LeadError, LeadErrorType } from '@/app/lead/domain/ports/LeadGateway';

export const submitLeadRequested = createAction<{ form: LeadSubmissionForm }>('lead/submitLeadRequested');
export const submitLeadSucceeded = createAction<{ kind: LeadFormKind }>('lead/submitLeadSucceeded');
export const submitLeadFailed = createAction<{ kind: LeadFormKind; error: string }>('lead/submitLeadFailed');
export const resetSubmitLeadState = createAction<{ kind: LeadFormKind }>('lead/resetSubmitLeadState');

export const submitLeadEpic = (
  action$: Observable<ReturnType<typeof submitLeadRequested>>,
  _state$: Observable<AppState>,
  { leadGateway, clock }: Dependencies,
) =>
  action$.pipe(
    ofType(submitLeadRequested.type),
    exhaustMap((action) => {
      const { form } = action.payload;
      if (!form.callbackConsent) {
        return of(submitLeadFailed({ kind: form.kind, error: LeadErrorType.CONSENT_REQUIRED }));
      }

      return leadGateway.submitLead(buildLeadSubmission(form, clock.now())).pipe(
        map(() => submitLeadSucceeded({ kind: form.kind })),
        catchError((error: unknown) =>
          of(submitLeadFailed({ kind: form.kind, error: error instanceof LeadError ? error.type : LeadErrorType.UNKNOWN_ERROR })),
        ),
      );
    }),
  );
