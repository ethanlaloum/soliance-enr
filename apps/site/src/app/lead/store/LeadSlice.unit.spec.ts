import { describe, expect, it } from 'vitest';
import { leadReducer } from '@/app/lead/store/LeadSlice';
import { ProjectType, StudyRequestForm } from '@/app/lead/domain/entities/StudyRequest';
import { LeadFormKind } from '@/app/lead/domain/entities/LeadSubmission';
import {
  resetSubmitLeadState,
  submitLeadFailed,
  submitLeadRequested,
  submitLeadSucceeded,
} from '@/app/lead/domain/use-cases/submit-lead/submitLeadEpic';
import {
  resetSubmitStudyRequestState,
  submitStudyRequestFailed,
  submitStudyRequestRequested,
  submitStudyRequestSucceeded,
} from '@/app/lead/domain/use-cases/submit-study-request/submitStudyRequestEpic';

const idleLeads = { PROFESSIONAL_STUDY: { state: null }, REFERRAL: { state: null }, SIMULATION: { state: null }, CARE_REQUEST: { state: null } };

const form: StudyRequestForm = {
  fullName: 'Marie Dupont',
  phone: '0612345678',
  email: null,
  postalCode: '06700',
  projectType: ProjectType.HEAT_PUMP,
  monthlyBill: null,
  callbackConsent: true,
  consentText: 'consent-text-v1',
  pageUri: 'https://soliance-enr.fr/',
  pageName: 'home',
  spamTrap: { honeypot: '', formStartedAt: null },
};

describe('Study request submission state', () => {
  it('enters the pending state when a request is submitted', () => {
    const state = leadReducer(undefined, submitStudyRequestRequested({ form }));

    expect(state).toEqual({ submitStudyRequest: { state: 'pending' }, submitLead: idleLeads });
  });

  it('records the success', () => {
    const pending = leadReducer(undefined, submitStudyRequestRequested({ form }));

    const state = leadReducer(pending, submitStudyRequestSucceeded());

    expect(state).toEqual({ submitStudyRequest: { state: 'succeeded' }, submitLead: idleLeads });
  });

  it('stores the error code on failure', () => {
    const state = leadReducer(undefined, submitStudyRequestFailed({ error: 'SUBMISSION_FAILED' }));

    expect(state).toEqual({ submitStudyRequest: { state: 'failed', errorCode: 'SUBMISSION_FAILED' }, submitLead: idleLeads });
  });

  it('clears a previous error when a new request is submitted', () => {
    const failed = leadReducer(undefined, submitStudyRequestFailed({ error: 'SUBMISSION_FAILED' }));

    const state = leadReducer(failed, submitStudyRequestRequested({ form }));

    expect(state).toEqual({ submitStudyRequest: { state: 'pending' }, submitLead: idleLeads });
  });

  it('returns to the initial state on reset', () => {
    const succeeded = leadReducer(undefined, submitStudyRequestSucceeded());

    const state = leadReducer(succeeded, resetSubmitStudyRequestState());

    expect(state).toEqual({ submitStudyRequest: { state: null }, submitLead: idleLeads });
  });

  it('tracks each generic lead form on its own', () => {
    const pending = leadReducer(
      undefined,
      submitLeadRequested({
        form: {
          kind: LeadFormKind.REFERRAL,
          fields: {},
          callbackConsent: true,
          consentText: 'consent-text-v1',
          pageUri: 'https://soliance-enr.fr/parrainage',
          pageName: 'referral',
          spamTrap: { honeypot: '', formStartedAt: null },
        },
      }),
    );

    const state = leadReducer(pending, submitLeadFailed({ kind: LeadFormKind.SIMULATION, error: 'SUBMISSION_FAILED' }));

    expect(state).toEqual({
      submitStudyRequest: { state: null },
      submitLead: {
        PROFESSIONAL_STUDY: { state: null },
        REFERRAL: { state: 'pending' },
        SIMULATION: { state: 'failed', errorCode: 'SUBMISSION_FAILED' },
        CARE_REQUEST: { state: null },
      },
    });
  });

  it('resets one generic lead form without touching the others', () => {
    const referralDone = leadReducer(undefined, submitLeadSucceeded({ kind: LeadFormKind.REFERRAL }));
    const bothDone = leadReducer(referralDone, submitLeadSucceeded({ kind: LeadFormKind.SIMULATION }));

    const state = leadReducer(bothDone, resetSubmitLeadState({ kind: LeadFormKind.REFERRAL }));

    expect(state).toEqual({
      submitStudyRequest: { state: null },
      submitLead: { PROFESSIONAL_STUDY: { state: null }, REFERRAL: { state: null }, SIMULATION: { state: 'succeeded' }, CARE_REQUEST: { state: null } },
    });
  });
});
