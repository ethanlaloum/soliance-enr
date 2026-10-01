import { LeadGateway } from '@/app/lead/domain/ports/LeadGateway';
import { Clock } from '@/app/shared/domain/ports/Clock';

export interface Dependencies {
  leadGateway: LeadGateway;
  clock: Clock;
}
