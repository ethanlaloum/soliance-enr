import { submitStudyRequestEpic } from '@/app/lead/domain/use-cases/submit-study-request/submitStudyRequestEpic';
import { submitLeadEpic } from '@/app/lead/domain/use-cases/submit-lead/submitLeadEpic';

export const leadEpics = [submitStudyRequestEpic, submitLeadEpic];
