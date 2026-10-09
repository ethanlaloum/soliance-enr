import { paths } from '@/routes/paths';

export const callbackPromptDelayMs = 30_000;
export const callbackPromptSnoozeMs = 7 * 24 * 60 * 60 * 1000;

const pathsWithoutPrompt: string[] = [paths.simulator, paths.legalNotice, paths.privacy, paths.cookies, paths.care];

const trimTrailingSlash = (pathname: string) => (pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname);

export const isCallbackPromptAllowedOn = (pathname: string): boolean => !pathsWithoutPrompt.includes(trimTrailingSlash(pathname));

export const isCallbackPromptSnoozed = (dismissedAt: number | null, now: number, snoozeMs: number = callbackPromptSnoozeMs): boolean =>
  dismissedAt !== null && now - dismissedAt < snoozeMs;
