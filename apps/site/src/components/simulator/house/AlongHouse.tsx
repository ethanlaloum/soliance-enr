import { ReactNode, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import { useHouseScene } from '@/components/simulator/house/houseMotion';

type AlongHouseProps = {
  fraction?: number;
  side?: -1 | 0 | 1;
  offset?: number;
  y?: number;
  z?: number;
  rotationY?: number;
  children: ReactNode;
};

export const AlongHouse = ({ fraction = 0, side = 0, offset = 0, y = 0, z = 0, rotationY = 0, children }: AlongHouseProps) => {
  const group = useRef<Group>(null);
  const { houseLength } = useHouseScene();

  useFrame(() => {
    if (!group.current) return;
    const length = houseLength.current.value;
    group.current.position.x = fraction * length + (side * length) / 2 + offset;
  });

  return (
    <group ref={group} position-y={y} position-z={z} rotation-y={rotationY}>
      {children}
    </group>
  );
};
