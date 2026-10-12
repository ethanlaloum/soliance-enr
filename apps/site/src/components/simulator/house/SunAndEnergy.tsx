import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { BoxGeometry, Mesh, MeshBasicMaterial, Sprite, SpriteMaterial, Vector3 } from 'three';
import { AlongHouse } from '@/components/simulator/house/AlongHouse';
import { houseDepthM, roofShapeAt } from '@/components/simulator/house/houseGeometry';
import { useHouseScene, useReducedMotion, useSpring } from '@/components/simulator/house/houseMotion';
import { palette } from '@/components/simulator/house/housePalette';
import { createGlowTexture } from '@/components/simulator/house/houseTextures';

const dayDurationSeconds = 40;

const smoothStep = (from: number, to: number, value: number) => {
  const progress = Math.min(Math.max((value - from) / (to - from), 0), 1);
  return progress * progress * (3 - 2 * progress);
};

export const DaylightCycle = () => {
  const { daylight } = useHouseScene();
  const reducedMotion = useReducedMotion();

  useFrame((state) => {
    const cycle = reducedMotion ? 0.36 : (state.clock.elapsedTime / dayDurationSeconds + 0.2) % 1;
    const fade = smoothStep(0, 0.06, cycle) * (1 - smoothStep(0.94, 1, cycle));
    daylight.current = fade * (0.3 + 0.7 * Math.sin(cycle * Math.PI));
  });

  return null;
};

const halfDepth = houseDepthM / 2;
const conduitZ = halfDepth - 0.12;
const batteryInletZ = -1.42;
const conduitY = 0.3;
const packetCount = 6;

const pointAlong = (points: Vector3[], distance: number, target: Vector3) => {
  let remaining = distance;
  for (let index = 1; index < points.length; index += 1) {
    const length = points[index].distanceTo(points[index - 1]);
    if (remaining <= length) return target.lerpVectors(points[index - 1], points[index], length > 0 ? remaining / length : 0);
    remaining -= length;
  }
  return target.copy(points[points.length - 1]);
};

const pathLength = (points: Vector3[]) => points.slice(1).reduce((total, point, index) => total + point.distanceTo(points[index]), 0);

type EnergyFlowProps = {
  active: boolean;
};

export const EnergyFlow = ({ active }: EnergyFlowProps) => {
  const reducedMotion = useReducedMotion();
  const { daylight, flatRoof, roofPitch } = useHouseScene();
  const packets = useRef<(Mesh | null)[]>([]);
  const halos = useRef<(Sprite | null)[]>([]);
  const conduits = useRef<(Mesh | null)[]>([]);
  const presence = useSpring(active ? 1 : 0, { delay: active ? 0.6 : 0 });
  const phase = useRef(0);

  const path = useMemo(
    () => [new Vector3(), new Vector3(0.12, 2.62, conduitZ), new Vector3(0.12, conduitY, conduitZ), new Vector3(0.12, conduitY, batteryInletZ)],
    [],
  );

  const resources = useMemo(() => {
    const glowTexture = createGlowTexture();
    return {
      glowTexture,
      packet: new BoxGeometry(0.15, 0.15, 0.15),
      core: new MeshBasicMaterial({ color: palette.energyCore }),
      halo: new SpriteMaterial({ map: glowTexture, color: palette.energyGlow, transparent: true, depthWrite: false }),
      conduit: new MeshBasicMaterial({ color: palette.conduit }),
      box: new BoxGeometry(1, 1, 1),
    };
  }, []);
  useEffect(() => () => Object.values(resources).forEach((resource) => resource.dispose()), [resources]);

  useFrame((_, delta) => {
    const flat = Math.min(Math.max(flatRoof.current.value, 0), 1);
    const eaveY = roofShapeAt(roofPitch.current.value).eaveBottom.y + 0.04;
    path[0].set(-0.25, eaveY + flat * (3.66 - eaveY), halfDepth + 0.32 - flat * 0.42);
    const shown = Math.min(Math.max(presence.current.value, 0), 1);
    const total = pathLength(path);
    const speed = 0.45 + 1.1 * daylight.current;
    if (!reducedMotion) phase.current = (phase.current + Math.min(delta, 0.1) * speed) % total;
    resources.halo.opacity = (0.4 + 0.3 * daylight.current) * shown;
    conduits.current.forEach((conduit) => {
      if (conduit) conduit.visible = shown > 0.01;
    });
    packets.current.forEach((packet, index) => {
      const halo = halos.current[index];
      if (!packet || !halo) return;
      const visible = shown > 0.01;
      packet.visible = visible;
      halo.visible = visible;
      if (!visible) return;
      const along = (phase.current + (index * total) / packetCount) % total;
      pointAlong(path, along, packet.position);
      halo.position.copy(packet.position);
      const scale = Math.sqrt(Math.sin((along / total) * Math.PI)) * shown;
      packet.scale.setScalar(Math.max(scale, 0.001));
      halo.scale.setScalar(Math.max(scale * 0.75, 0.001));
    });
  });

  return (
    <AlongHouse side={1}>
      <mesh
        ref={(mesh) => {
          conduits.current[0] = mesh;
        }}
        geometry={resources.box}
        material={resources.conduit}
        position={[0.06, (2.62 + conduitY) / 2, conduitZ]}
        scale={[0.05, 2.62 - conduitY, 0.05]}
        visible={false}
      />
      <mesh
        ref={(mesh) => {
          conduits.current[1] = mesh;
        }}
        geometry={resources.box}
        material={resources.conduit}
        position={[0.06, conduitY, (conduitZ + batteryInletZ) / 2]}
        scale={[0.05, 0.05, conduitZ - batteryInletZ]}
        visible={false}
      />
      {Array.from({ length: packetCount }, (_, index) => (
        <group key={index}>
          <mesh
            ref={(mesh) => {
              packets.current[index] = mesh;
            }}
            geometry={resources.packet}
            material={resources.core}
            visible={false}
          />
          <sprite
            ref={(sprite) => {
              halos.current[index] = sprite;
            }}
            material={resources.halo}
            visible={false}
          />
        </group>
      ))}
    </AlongHouse>
  );
};
