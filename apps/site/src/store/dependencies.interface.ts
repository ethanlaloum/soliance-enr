import { AddressGateway } from '@/app/address/domain/ports/AddressGateway';
import { AnalyticsGateway } from '@/app/analytics/domain/ports/AnalyticsGateway';
import { ConsentGateway } from '@/app/consent/domain/ports/ConsentGateway';
import { LeadGateway } from '@/app/lead/domain/ports/LeadGateway';
import { Clock } from '@/app/shared/domain/ports/Clock';
import { SolarYieldGateway } from '@/app/solar-yield/domain/ports/SolarYieldGateway';

export interface Dependencies {
  leadGateway: LeadGateway;
  consentGateway: ConsentGateway;
  analyticsGateway: AnalyticsGateway;
  addressGateway: AddressGateway;
  solarYieldGateway: SolarYieldGateway;
  clock: Clock;
}
