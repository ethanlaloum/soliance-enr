export const CONSENT_VERSION = 1;

export const CONSENT_LIFETIME_DAYS = 182;

const dayInMilliseconds = 24 * 60 * 60 * 1000;

export interface ConsentChoice {
  analytics: boolean;
  decidedAt: string;
  version: number;
}

export enum ConsentStatus {
  UNDECIDED = 'UNDECIDED',
  ANALYTICS_GRANTED = 'ANALYTICS_GRANTED',
  ANALYTICS_REFUSED = 'ANALYTICS_REFUSED',
}

export const buildConsentChoice = (analytics: boolean, now: Date): ConsentChoice => ({
  analytics,
  decidedAt: now.toISOString(),
  version: CONSENT_VERSION,
});

export const parseConsentChoice = (value: unknown): ConsentChoice | null => {
  if (typeof value !== 'object' || value === null) return null;
  const { analytics, decidedAt, version } = value as Record<string, unknown>;
  if (typeof analytics !== 'boolean' || typeof decidedAt !== 'string' || typeof version !== 'number') return null;
  return { analytics, decidedAt, version };
};

export const isConsentChoiceCurrent = (choice: ConsentChoice, now: Date): boolean => {
  if (choice.version !== CONSENT_VERSION) return false;
  const decidedAt = Date.parse(choice.decidedAt);
  if (Number.isNaN(decidedAt)) return false;
  return now.getTime() - decidedAt < CONSENT_LIFETIME_DAYS * dayInMilliseconds;
};

export const consentStatusOf = (choice: ConsentChoice | null): ConsentStatus => {
  if (choice === null) return ConsentStatus.UNDECIDED;
  return choice.analytics ? ConsentStatus.ANALYTICS_GRANTED : ConsentStatus.ANALYTICS_REFUSED;
};
