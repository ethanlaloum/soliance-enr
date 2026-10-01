import { Clock } from '@/app/shared/domain/ports/Clock';

export class SystemClock implements Clock {
  now(): Date {
    return new Date();
  }
}
