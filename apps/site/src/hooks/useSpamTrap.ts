import { useCallback, useEffect, useRef } from 'react';
import { SpamTrap } from '@/app/lead/domain/entities/SpamTrap';

export const useSpamTrap = () => {
  const honeypotRef = useRef<HTMLInputElement>(null);
  const startedAtRef = useRef<number | null>(null);

  useEffect(() => {
    startedAtRef.current = Date.now();
  }, []);

  const readSpamTrap = useCallback(
    (): SpamTrap => ({ honeypot: honeypotRef.current?.value ?? '', formStartedAt: startedAtRef.current }),
    [],
  );

  return { honeypotRef, readSpamTrap };
};
