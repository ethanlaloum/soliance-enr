import { loadConsentEpic } from '@/app/consent/domain/use-cases/load-consent/loadConsentEpic';
import { saveConsentEpic } from '@/app/consent/domain/use-cases/save-consent/saveConsentEpic';

export const consentEpics = [loadConsentEpic, saveConsentEpic];
