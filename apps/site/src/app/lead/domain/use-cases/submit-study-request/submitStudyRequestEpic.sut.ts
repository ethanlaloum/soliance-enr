import { firstValueFrom, of, toArray } from 'rxjs';
import { AppState } from '@/store/AppState';
import { LeadState } from '@/app/lead/store/LeadSlice';
import { StudyRequestForm } from '@/app/lead/domain/entities/StudyRequest';
import { InMemoryLeadGateway } from '@/app/lead/adapters/InMemoryLeadGateway';
import { FixedClock } from '@/app/shared/adapters/FixedClock';
import { fakeDependencies } from '@/app/shared/test/fakeDependencies';
import { submitStudyRequestEpic, submitStudyRequestRequested } from './submitStudyRequestEpic';

const stateWithLead = (lead: LeadState): AppState => ({ core: { lead: { lead } } }) as AppState;

export const createSubmitStudyRequestEpicSUT = () => {
  const leadGateway = new InMemoryLeadGateway();
  const clock = new FixedClock(new Date('2026-10-05T08:30:00.000Z'));

  const context = {
    leadGateway,
    dependencies: fakeDependencies({ leadGateway, clock }),
    state: stateWithLead({
      submitStudyRequest: { state: null },
      submitLead: { PROFESSIONAL_STUDY: { state: null }, REFERRAL: { state: null }, SIMULATION: { state: null }, CARE_REQUEST: { state: null } },
    }),
  };

  return {
    context,

    givenGatewayFails(error: Error) {
      context.leadGateway.willFailWith(error);
    },

    whenStudyRequestIsSubmitted(form: StudyRequestForm) {
      return firstValueFrom(
        submitStudyRequestEpic(of(submitStudyRequestRequested({ form })), of(context.state), context.dependencies).pipe(toArray()),
      );
    },

    thenSubmittedStudyRequestsAre() {
      return context.leadGateway.submittedStudyRequests;
    },
  };
};
