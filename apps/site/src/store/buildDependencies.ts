import { config } from '@/config';
import { SolianceRxLeadGateway } from '@/app/lead/adapters/RealLeadGateway';
import { FetchHttpClient } from '@/app/shared/adapters/FetchHttpClient';
import { SystemClock } from '@/app/shared/adapters/SystemClock';
import { Dependencies } from '@/store/dependencies.interface';

export const buildRealDependencies = (): Dependencies => {
  const httpClient = new FetchHttpClient();

  return {
    leadGateway: new SolianceRxLeadGateway(httpClient, config.hubspot),
    clock: new SystemClock(),
  };
};
