import { createAction } from '@reduxjs/toolkit';
import { ofType } from 'redux-observable';
import { catchError, filter, map, mergeMap, Observable, of, withLatestFrom } from 'rxjs';
import { AppState } from '@/store/AppState';
import { Dependencies } from '@/store/dependencies.interface';
import {
  AnalyticsEvent,
  leadSubmittedEvent,
  phoneCallClickedEvent,
  STUDY_REQUEST_FORM_KIND,
} from '@/app/analytics/domain/entities/AnalyticsEvent';
import { AnalyticsErrorType } from '@/app/analytics/domain/ports/AnalyticsGateway';
import { submitLeadSucceeded } from '@/app/lead/domain/use-cases/submit-lead/submitLeadEpic';
import { submitStudyRequestSucceeded } from '@/app/lead/domain/use-cases/submit-study-request/submitStudyRequestEpic';
import { selectAnalyticsConsentGranted } from '@/selectors/consent/consentSelectors';

export const phoneCallClicked = createAction<{ phoneNumber: string }>('analytics/phoneCallClicked');
export const trackConversionSucceeded = createAction<{ event: AnalyticsEvent }>('analytics/trackConversionSucceeded');
export const trackConversionFailed = createAction<{ error: string }>('analytics/trackConversionFailed');

type ConversionAction =
  | ReturnType<typeof submitStudyRequestSucceeded>
  | ReturnType<typeof submitLeadSucceeded>
  | ReturnType<typeof phoneCallClicked>;

const conversionEventOf = (action: ConversionAction): AnalyticsEvent => {
  if (submitLeadSucceeded.match(action)) return leadSubmittedEvent(action.payload.kind);
  if (phoneCallClicked.match(action)) return phoneCallClickedEvent(action.payload.phoneNumber);
  return leadSubmittedEvent(STUDY_REQUEST_FORM_KIND);
};

export const trackConversionEpic = (
  action$: Observable<ConversionAction>,
  state$: Observable<AppState>,
  { analyticsGateway }: Dependencies,
) =>
  action$.pipe(
    ofType(submitStudyRequestSucceeded.type, submitLeadSucceeded.type, phoneCallClicked.type),
    withLatestFrom(state$),
    filter(([, state]) => selectAnalyticsConsentGranted(state)),
    mergeMap(([action]) => {
      const event = conversionEventOf(action);

      return analyticsGateway.track(event).pipe(
        map(() => trackConversionSucceeded({ event })),
        catchError(() => of(trackConversionFailed({ error: AnalyticsErrorType.UNKNOWN_ERROR }))),
      );
    }),
  );
