import { useEffect, useRef, useState } from 'react';
import { animate, useMotionValue, useReducedMotion } from 'motion/react';

type AnimatedNumberProps = {
  value: number;
  format: (value: number) => string;
  className?: string;
};

const countEase = [0.22, 1, 0.36, 1] as const;

export const AnimatedNumber = ({ value, format, className }: AnimatedNumberProps) => {
  const element = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(value);
  const reducedMotion = useReducedMotion();
  const [initialText] = useState(() => format(value));

  useEffect(
    () =>
      motionValue.on('change', (latest) => {
        if (element.current) element.current.textContent = format(latest);
      }),
    [motionValue, format],
  );

  useEffect(() => {
    if (reducedMotion) {
      motionValue.set(value);
      return;
    }
    const controls = animate(motionValue, value, { duration: 0.9, ease: countEase });
    return () => controls.stop();
  }, [motionValue, value, reducedMotion]);

  return (
    <span ref={element} className={className}>
      {initialText}
    </span>
  );
};
