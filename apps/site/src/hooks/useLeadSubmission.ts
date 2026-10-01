import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/redux';
import { LeadFields, LeadFormKind } from '@/app/lead/domain/entities/LeadSubmission';
import { resetSubmitLeadState, submitLeadRequested } from '@/app/lead/domain/use-cases/submit-lead/submitLeadEpic';
import { selectSubmitLeadError, selectSubmitLeadLoading, selectSubmitLeadSuccess } from '@/selectors/lead/leadSelectors';

export const useLeadSubmission = (kind: LeadFormKind) => {
  const dispatch = useAppDispatch();
  const isSubmitting = useAppSelector((state) => selectSubmitLeadLoading(state, kind));
  const isSubmitted = useAppSelector((state) => selectSubmitLeadSuccess(state, kind));
  const errorCode = useAppSelector((state) => selectSubmitLeadError(state, kind));

  const submit = useCallback(
    (fields: LeadFields, callbackConsent: boolean, consentText: string) => {
      dispatch(
        submitLeadRequested({
          form: { kind, fields, callbackConsent, consentText, pageUri: window.location.href, pageName: document.title },
        }),
      );
    },
    [dispatch, kind],
  );

  const reset = useCallback(() => dispatch(resetSubmitLeadState({ kind })), [dispatch, kind]);

  return { submit, reset, isSubmitting, isSubmitted, errorCode };
};
