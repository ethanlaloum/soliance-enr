export enum AnalyticsEventName {
  LEAD_SUBMITTED = 'generate_lead',
  PHONE_CALL_CLICKED = 'click_to_call',
}

export interface AnalyticsEvent {
  name: AnalyticsEventName;
  params: Record<string, string>;
}

export const STUDY_REQUEST_FORM_KIND = 'STUDY_REQUEST';

export const leadSubmittedEvent = (formKind: string): AnalyticsEvent => ({
  name: AnalyticsEventName.LEAD_SUBMITTED,
  params: { form_kind: formKind },
});

export const phoneCallClickedEvent = (phoneNumber: string): AnalyticsEvent => ({
  name: AnalyticsEventName.PHONE_CALL_CLICKED,
  params: { phone_number: phoneNumber },
});
