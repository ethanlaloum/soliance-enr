import { applyAnalyticsConsentEpic } from '@/app/analytics/domain/use-cases/apply-analytics-consent/applyAnalyticsConsentEpic';
import { trackConversionEpic } from '@/app/analytics/domain/use-cases/track-conversion/trackConversionEpic';

export const analyticsEpics = [applyAnalyticsConsentEpic, trackConversionEpic];
