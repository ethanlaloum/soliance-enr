export interface SpamTrap {
  honeypot: string;
  formStartedAt: number | null;
}

export interface SpamSignals {
  honeypot: string;
  fillDurationMs: number | null;
}

export const spamSignalsOf = (trap: SpamTrap, now: Date): SpamSignals => ({
  honeypot: trap.honeypot,
  fillDurationMs: trap.formStartedAt === null ? null : Math.max(0, Math.round(now.getTime() - trap.formStartedAt)),
});
