import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Edges } from '@react-three/drei';
import { BoxGeometry, Group, MeshBasicMaterial, PlaneGeometry } from 'three';
import { RoofOrientation } from '@/app/simulator/domain/entities/SolarEstimate';
import { AlongHouse } from '@/components/simulator/house/AlongHouse';
import { compassOffsetRadians, houseDepthM, poolLayout } from '@/components/simulator/house/houseGeometry';
import { createFloorMaterial, createGlassMaterial } from '@/components/simulator/house/houseMaterials';
import { settleSpring, useHouseScene, useSpring } from '@/components/simulator/house/houseMotion';
import { lineWidths, palette } from '@/components/simulator/house/housePalette';
import { CompassLetters, createCompassTexture } from '@/components/simulator/house/houseTextures';

const driveway = { width: 3.2, startZ: -1.4, endZ: 10.6 };
const terrace = { width: 4, depth: 2.8 };

type GardenSceneryProps = {
  orientation: RoofOrientation;
  compassLetters: CompassLetters;
  poolActive: boolean;
  poolDelay: number;
};

export const GardenScenery = ({ orientation, compassLetters, poolActive, poolDelay }: GardenSceneryProps) => {
  const scene = useHouseScene();
  const { houseLength } = scene;
  const compass = useRef<Group>(null);
  const compassYaw = useSpring(-compassOffsetRadians(orientation), { from: -compassOffsetRadians(orientation) });
  const poolOpening = useSpring(poolActive ? 1 : 0, { config: settleSpring, delay: poolActive ? poolDelay : 0 });
  const { north, east, south, west } = compassLetters;
  const compassTexture = useMemo(() => createCompassTexture({ north, east, south, west }), [north, east, south, west]);

  const resources = useMemo(
    () => ({
      floor: createFloorMaterial(scene),
      lane: createGlassMaterial(scene, { fillColor: palette.paneFill, fill: 0.025, glow: 0.14 }),
      floorGeometry: new PlaneGeometry(90, 90),
      plane: new PlaneGeometry(1, 1),
      slab: new BoxGeometry(1, 1, 1),
    }),
    [scene],
  );
  const compassMaterial = useMemo(() => new MeshBasicMaterial({ map: compassTexture, transparent: true, depthWrite: false }), [compassTexture]);

  useEffect(() => () => Object.values(resources).forEach((resource) => resource.dispose()), [resources]);
  useEffect(
    () => () => {
      compassMaterial.dispose();
      compassTexture.dispose();
    },
    [compassMaterial, compassTexture],
  );

  useFrame(() => {
    const length = houseLength.current.value;
    const { uHouseHalf, uPool, uPoolOpen } = resources.floor.uniforms;
    uHouseHalf.value.set(length / 2 + 0.45, houseDepthM / 2 + 0.45);
    uPool.value.set(-length / 2 + poolLayout.offsetFromLeftGable, poolLayout.centerZ, poolLayout.width / 2, poolLayout.depth / 2);
    uPoolOpen.value = poolOpening.current.value > 0.02 ? 1 : 0;
    if (compass.current) compass.current.rotation.y = compassYaw.current.value;
  });

  return (
    <group>
      <mesh geometry={resources.floorGeometry} material={resources.floor} rotation-x={-Math.PI / 2} position={[0, -0.002, 2]} renderOrder={-10} />
      <AlongHouse side={1} offset={3} z={(driveway.startZ + driveway.endZ) / 2}>
        <mesh geometry={resources.slab} material={resources.lane} position-y={0.01} scale={[driveway.width, 0.02, driveway.endZ - driveway.startZ]}>
          <Edges color={palette.laneLine} lineWidth={lineWidths.lane} />
        </mesh>
      </AlongHouse>
      <AlongHouse fraction={0.15} z={houseDepthM / 2 + terrace.depth / 2}>
        <mesh geometry={resources.slab} material={resources.lane} position-y={0.03} scale={[terrace.width, 0.06, terrace.depth]}>
          <Edges color={palette.laneLine} lineWidth={lineWidths.lane} />
        </mesh>
      </AlongHouse>
      <AlongHouse side={-1} offset={-2.4} z={0.6}>
        <group ref={compass} position-y={0.01}>
          <mesh geometry={resources.plane} material={compassMaterial} rotation-x={-Math.PI / 2} scale={[2.2, 2.2, 1]} renderOrder={3} />
        </group>
      </AlongHouse>
    </group>
  );
};
