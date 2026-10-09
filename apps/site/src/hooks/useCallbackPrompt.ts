import { useCallback, useEffect, useState } from 'react';
import { callbackPromptDelayMs, isCallbackPromptSnoozed } from '@/app/callback-prompt/domain/entities/CallbackPrompt';

const storageKey = 'soliance-callback-prompt-dismissed-at';

const readDismissedAt = (): number | null => {
  try {
    const value = Number(window.localStorage.getItem(storageKey));
    return Number.isFinite(value) && value > 0 ? value : null;
  } catch {
    return null;
  }
};

const writeDismissedAt = (timestamp: number) => {
  try {
    window.localStorage.setItem(storageKey, String(timestamp));
  } catch {
    return;
  }
};

export const useCallbackPrompt = (isAllowed: boolean) => {
  const [isDue, setIsDue] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (isCallbackPromptSnoozed(readDismissedAt(), Date.now())) return;
    const timer = window.setTimeout(() => setIsDue(true), callbackPromptDelayMs);
    return () => window.clearTimeout(timer);
  }, []);

  const dismiss = useCallback(() => {
    setIsDismissed(true);
    writeDismissedAt(Date.now());
  }, []);

  return { isOpen: isDue && isAllowed && !isDismissed, dismiss };
};
