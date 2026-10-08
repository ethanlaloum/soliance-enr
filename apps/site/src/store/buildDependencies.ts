import { config } from '@/config';
import { SolianceRxAddressGateway } from '@/app/address/adapters/RealAddressGateway';
import { GoogleTagAnalyticsGateway } from '@/app/analytics/adapters/RealAnalyticsGateway';
import { LocalStorageConsentGateway } from '@/app/consent/adapters/RealConsentGateway';
import { SolianceRxLeadGateway } from '@/app/lead/adapters/RealLeadGateway';
import { FetchHttpClient } from '@/app/shared/adapters/FetchHttpClient';
import { SystemClock } from '@/app/shared/adapters/SystemClock';
import { Dependencies } from '@/store/dependencies.interface';

export const buildRealDependencies = (): Dependencies => {
  const httpClient = new FetchHttpClient();

  return {
    leadGateway: new SolianceRxLeadGateway(httpClient, config.leadEndpoint),
    consentGateway: new LocalStorageConsentGateway(config.consentStorageKey),
    analyticsGateway: new GoogleTagAnalyticsGateway(config.analyticsMeasurementId),
    addressGateway: new SolianceRxAddressGateway(httpClient, config.addressSearchEndpoint, config.addressSearchBias),
    clock: new SystemClock(),
  };
};
