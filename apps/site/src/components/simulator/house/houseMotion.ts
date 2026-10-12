import { createContext, MutableRefObject, useContext, useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Matrix4 } from 'three';

export interface Spring {
  value: number;
  velocity: number;
}

export interface SpringConfig {
  stiffness: number;
  damping: number;
}

const gentleSpring: SpringConfig = { stiffness: 90, damping: 19 };
export const settleSpring: SpringConfig = { stiffness: 150, damping: 19 };
export const rezzSpring: SpringConfig = { stiffness: 26, damping: 10.5 };
export const drivingSpring: SpringConfig = { stiffness: 38, damping: 12.5 };

const longestSubstep = 1 / 120;
const longestFrame = 0.1;

export const stepSpring = (spring: Spring, target: number, delta: number, config: SpringConfig, reducedMotion: boolean) => {
  if (reducedMotion) {
    spring.value = target;
    spring.velocity = 0;
    return;
  }
  let remaining = Math.min(delta, longestFrame);
  while (remaining > 0) {
    const step = Math.min(remaining, longestSubstep);
    const force = config.stiffness * (target - spring.value) - config.damping * spring.velocity;
    spring.velocity += force * step;
    spring.value += spring.velocity * step;
    remaining -= step;
  }
};

export const dampingFactor = (rate: number, delta: number, reducedMotion: boolean) => (reducedMotion ? 1 : 1 - Math.exp(-rate * Math.min(delta, longestFrame)));

export const HouseMotionContext = createContext(false);

export const useReducedMotion = () => useContext(HouseMotionContext);

export interface HouseSceneState {
  houseLength: MutableRefObject<Spring>;
  flatRoof: MutableRefObject<Spring>;
  roofPitch: MutableRefObject<Spring>;
  daylight: MutableRefObject<number>;
  stageInverse: Matrix4;
  pixelRatio: { value: number };
}

export const HouseSceneContext = createContext<HouseSceneState | null>(null);

export const useHouseScene = (): HouseSceneState => {
  const scene = useContext(HouseSceneContext);
  if (!scene) throw new Error('useHouseScene must be used inside the house scene');
  return scene;
};

type SpringOptions = {
  config?: SpringConfig;
  delay?: number;
  from?: number;
};

export const useSpring = (target: number, { config = gentleSpring, delay = 0, from = 0 }: SpringOptions = {}): MutableRefObject<Spring> => {
  const reducedMotion = useReducedMotion();
  const spring = useRef<Spring>({ value: from, velocity: 0 });
  const activeTarget = useRef(from);
  const plan = useRef<{ target: number; delay: number; remaining: number | null }>({ target, delay, remaining: null });

  useEffect(() => {
    if (plan.current.target === target) return;
    plan.current = { target, delay, remaining: null };
  }, [target, delay]);

  useFrame((_, delta) => {
    const next = plan.current;
    if (next.remaining === null) next.remaining = reducedMotion ? 0 : next.delay;
    if (next.remaining > 0) next.remaining -= Math.min(delta, longestFrame);
    if (next.remaining <= 0) activeTarget.current = next.target;
    stepSpring(spring.current, activeTarget.current, delta, config, reducedMotion);
  });

  return spring;
};

const calloutDurationMs = 2600;

export const useCallout = (trigger: string | null): string | null => {
  const [shown, setShown] = useState<string | null>(null);
  const [initialTrigger] = useState(trigger);
  const hasChanged = useRef(false);

  useEffect(() => {
    if (!hasChanged.current && trigger === initialTrigger) return;
    hasChanged.current = true;
    setShown(trigger);
    if (trigger === null) return;
    const timer = window.setTimeout(() => setShown(null), calloutDurationMs);
    return () => window.clearTimeout(timer);
  }, [trigger, initialTrigger]);

  return shown;
};

export const useIntroDelay = (seconds: number): number => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? 0 : seconds;
};
