export interface HubSpotFieldDto {
  objectTypeId: '0-1';
  name: string;
  value: string;
}

export interface HubSpotSubmissionDto {
  submittedAt: string;
  fields: HubSpotFieldDto[];
  context: {
    pageUri: string;
    pageName: string;
  };
  legalConsentOptions: {
    consent: {
      consentToProcess: boolean;
      text: string;
    };
  };
}
