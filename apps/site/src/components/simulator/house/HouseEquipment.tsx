import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Edges, Html, Line } from '@react-three/drei';
import {
  BoxGeometry,
  CatmullRomCurve3,
  CylinderGeometry,
  ExtrudeGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  ShaderMaterial,
  Shape,
  TubeGeometry,
  Vector3,
} from 'three';
import { AlongHouse } from '@/components/simulator/house/AlongHouse';
import { houseDepthM, poolLayout } from '@/components/simulator/house/houseGeometry';
import { createDeviceMaterial, createGlassMaterial, createWaterSurfaceMaterial } from '@/components/simulator/house/houseMaterials';
import { drivingSpring, rezzSpring, useCallout, useHouseScene, useReducedMotion, useSpring } from '@/components/simulator/house/houseMotion';
import { lineWidths, palette } from '@/components/simulator/house/housePalette';

const unitBox = new BoxGeometry(1, 1, 1);
const halfDepth = houseDepthM / 2;

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);

const smoothStep = (from: number, to: number, value: number) => {
  const progress = clamp01((value - from) / (to - from));
  return progress * progress * (3 - 2 * progress);
};

const applyRezz = (group: Group | null, materials: ShaderMaterial[], progress: number) => {
  const value = clamp01(progress);
  if (group) group.visible = value > 0.002;
  materials.forEach((material) => {
    material.uniforms.uProgress.value = value;
  });
};

const deviceEdges = <Edges color={palette.deviceLine} lineWidth={lineWidths.device} />;
const deviceDetailEdges = <Edges color={palette.deviceLine} lineWidth={lineWidths.deviceDetail} />;

type CalloutProps = {
  text: string | null;
  position: [number, number, number];
  tone?: 'light' | 'energy';
};

export const Callout = ({ text, position, tone = 'light' }: CalloutProps) =>
  text ? (
    <Html position={position} center zIndexRange={[30, 10]} style={{ pointerEvents: 'none' }}>
      <span key={text} className={tone === 'energy' ? 'house-callout house-callout--energy' : 'house-callout'}>
        {text}
      </span>
    </Html>
  ) : null;

type EquipmentProps = {
  active: boolean;
  label: string;
  introDelay: number;
};

const rectangle = (width: number, depth: number, y: number): [number, number, number][] => [
  [-width / 2, y, -depth / 2],
  [width / 2, y, -depth / 2],
  [width / 2, y, depth / 2],
  [-width / 2, y, depth / 2],
  [-width / 2, y, -depth / 2],
];

const copingOutline = rectangle(poolLayout.width + 2 * poolLayout.coping, poolLayout.depth + 2 * poolLayout.coping, 0.012);
const basinOutline = rectangle(poolLayout.width, poolLayout.depth, 0.012);

export const Pool = ({ active, label, introDelay }: EquipmentProps) => {
  const scene = useHouseScene();
  const group = useRef<Group>(null);
  const basin = useRef<Group>(null);
  const water = useRef<Group>(null);
  const presence = useSpring(active ? 1 : 0, { config: rezzSpring, delay: introDelay });
  const fill = useSpring(active ? 1 : 0, { delay: active ? introDelay + 0.35 : 0 });
  const callout = useCallout(active ? label : null);

  const resources = useMemo(
    () => ({
      basin: createGlassMaterial(scene, { fillColor: palette.poolPit, fill: 0.55, line: 0.16, cell: 0.25, glow: 0.22 }),
      volume: createGlassMaterial(scene, { fillColor: palette.waterFill, fill: 0.3, lineColor: palette.waterGlow, glow: 0.4 }),
      surface: createWaterSurfaceMaterial(scene),
      surfaceGeometry: new PlaneGeometry(poolLayout.width, poolLayout.depth),
    }),
    [scene],
  );
  useEffect(() => () => Object.values(resources).forEach((resource) => resource.dispose()), [resources]);

  useFrame(() => {
    const shown = clamp01(presence.current.value);
    if (group.current) group.current.visible = shown > 0.003;
    if (basin.current) basin.current.scale.y = Math.max(shown, 0.001);
    const level = clamp01(fill.current.value);
    if (water.current) {
      water.current.visible = level > 0.01;
      water.current.scale.y = Math.max(level, 0.001);
    }
    resources.surface.uniforms.uLevel.value = level;
  });

  const waterHeight = poolLayout.basinDepth - poolLayout.waterline;

  return (
    <AlongHouse side={-1} offset={poolLayout.offsetFromLeftGable} z={poolLayout.centerZ}>
      <group ref={group} visible={false}>
        <Line points={copingOutline} color={palette.poolCoping} lineWidth={lineWidths.coping} />
        <Line points={basinOutline} color={palette.poolRim} lineWidth={lineWidths.rim} />
        <group ref={basin}>
          <mesh
            geometry={unitBox}
            material={resources.basin}
            position-y={-poolLayout.basinDepth / 2}
            scale={[poolLayout.width, poolLayout.basinDepth, poolLayout.depth]}
            renderOrder={-2}
          >
            <Edges color={palette.poolBasinLine} lineWidth={lineWidths.basin} />
          </mesh>
        </group>
        <group ref={water} position-y={-poolLayout.basinDepth}>
          <mesh
            geometry={unitBox}
            material={resources.volume}
            position-y={waterHeight / 2}
            scale={[poolLayout.width - 0.02, waterHeight, poolLayout.depth - 0.02]}
            renderOrder={-2}
          />
          <mesh geometry={resources.surfaceGeometry} material={resources.surface} rotation-x={-Math.PI / 2} position-y={waterHeight} renderOrder={-1} />
        </group>
      </group>
      <Callout text={callout} position={[0, 1.1, 0]} />
    </AlongHouse>
  );
};

export const AirConditioner = ({ active, label, introDelay }: EquipmentProps) => {
  const scene = useHouseScene();
  const reducedMotion = useReducedMotion();
  const outdoor = useRef<Group>(null);
  const indoor = useRef<Group>(null);
  const fan = useRef<Group>(null);
  const outdoorRezz = useSpring(active ? 1 : 0, { config: rezzSpring, delay: introDelay });
  const indoorRezz = useSpring(active ? 1 : 0, { config: rezzSpring, delay: active ? introDelay + 0.2 : 0 });
  const callout = useCallout(active ? label : null);

  const resources = useMemo(
    () => ({
      outdoorBody: createDeviceMaterial(scene),
      disc: createDeviceMaterial(scene, { boxEdges: false }),
      indoorBody: createDeviceMaterial(scene),
      blade: new MeshBasicMaterial({ color: palette.fanBlade }),
      discGeometry: new CylinderGeometry(0.23, 0.23, 0.02, 40),
    }),
    [scene],
  );
  useEffect(() => () => Object.values(resources).forEach((resource) => resource.dispose()), [resources]);

  useFrame((_, delta) => {
    const outdoorProgress = outdoorRezz.current.value;
    applyRezz(outdoor.current, [resources.outdoorBody, resources.disc], outdoorProgress);
    applyRezz(indoor.current, [resources.indoorBody], indoorRezz.current.value);
    if (!fan.current) return;
    fan.current.visible = outdoorProgress > 0.7;
    if (!reducedMotion) fan.current.rotation.z -= delta * 6;
  });

  return (
    <>
      <AlongHouse side={1} offset={-1.05} z={halfDepth + 0.24}>
        <group ref={outdoor} visible={false}>
          <mesh geometry={unitBox} material={resources.outdoorBody} position-y={0.4} scale={[0.9, 0.62, 0.32]}>
            {deviceEdges}
          </mesh>
          <mesh geometry={resources.discGeometry} material={resources.disc} position={[-0.14, 0.4, 0.165]} rotation-x={Math.PI / 2}>
            {deviceDetailEdges}
          </mesh>
          <group ref={fan} position={[-0.14, 0.4, 0.18]}>
            {[0, 1, 2].map((blade) => (
              <mesh key={blade} geometry={unitBox} material={resources.blade} rotation-z={(blade * Math.PI * 2) / 3} scale={[0.07, 0.38, 0.01]} />
            ))}
          </group>
        </group>
        <Callout text={callout} position={[0, 1.3, 0.2]} />
      </AlongHouse>
      <AlongHouse fraction={0.37} z={halfDepth - 0.16}>
        <group ref={indoor} position-y={2.55} visible={false}>
          <mesh geometry={unitBox} material={resources.indoorBody} scale={[0.95, 0.3, 0.2]}>
            {deviceEdges}
          </mesh>
        </group>
      </AlongHouse>
    </>
  );
};

const radiatorSpots = [
  { fraction: -0.34, z: halfDepth - 0.12, turn: 0 },
  { fraction: 0.37, z: halfDepth - 0.12, turn: 0 },
  { fraction: -0.22, z: -(halfDepth - 0.12), turn: Math.PI },
  { fraction: 0.22, z: -(halfDepth - 0.12), turn: Math.PI },
];

const heatParticles = 4;

type RadiatorProps = {
  fraction: number;
  z: number;
  turn: number;
  index: number;
  active: boolean;
  introDelay: number;
  heat: MeshBasicMaterial;
  cube: BoxGeometry;
};

const Radiator = ({ fraction, z, turn, index, active, introDelay, heat, cube }: RadiatorProps) => {
  const scene = useHouseScene();
  const reducedMotion = useReducedMotion();
  const group = useRef<Group>(null);
  const particles = useRef<(Mesh | null)[]>([]);
  const rezz = useSpring(active ? 1 : 0, { config: rezzSpring, delay: active ? introDelay + index * 0.12 : 0 });
  const body = useMemo(() => createDeviceMaterial(scene), [scene]);
  useEffect(() => () => body.dispose(), [body]);

  useFrame((state) => {
    const progress = rezz.current.value;
    applyRezz(group.current, [body], progress);
    particles.current.forEach((particle, particleIndex) => {
      if (!particle) return;
      particle.visible = progress > 0.9 && !reducedMotion;
      if (!particle.visible) return;
      const cycle = (state.clock.elapsedTime * 0.35 + particleIndex / heatParticles + index * 0.17) % 1;
      particle.position.set((particleIndex / (heatParticles - 1) - 0.5) * 0.7, 0.85 + cycle * 1.4, 0.05 + Math.sin(cycle * 6 + particleIndex) * 0.05);
      particle.scale.setScalar(Math.max(Math.sin(cycle * Math.PI), 0.001));
    });
  });

  return (
    <AlongHouse fraction={fraction} z={z} rotationY={turn}>
      <group ref={group} visible={false}>
        <mesh geometry={unitBox} material={body} position-y={0.5} scale={[1, 0.56, 0.08]}>
          {deviceEdges}
        </mesh>
        {Array.from({ length: heatParticles }, (_, particleIndex) => (
          <mesh
            key={particleIndex}
            ref={(particle) => {
              particles.current[particleIndex] = particle;
            }}
            geometry={cube}
            material={heat}
            visible={false}
          />
        ))}
      </group>
    </AlongHouse>
  );
};

export const ElectricHeating = ({ active, label, introDelay }: EquipmentProps) => {
  const callout = useCallout(active ? label : null);
  const resources = useMemo(
    () => ({
      heat: new MeshBasicMaterial({ color: palette.energyCore }),
      cube: new BoxGeometry(0.08, 0.08, 0.08),
    }),
    [],
  );
  useEffect(() => () => Object.values(resources).forEach((resource) => resource.dispose()), [resources]);

  return (
    <>
      {radiatorSpots.map((spot, index) => (
        <Radiator key={`${spot.fraction}-${spot.z}`} {...spot} index={index} active={active} introDelay={introDelay} {...resources} />
      ))}
      <AlongHouse fraction={-0.34} z={halfDepth}>
        <Callout text={callout} position={[0, 2.2, 0.3]} />
      </AlongHouse>
    </>
  );
};

const batteryModuleHeightM = 0.52;
const batteryModuleStepM = 0.56;
const batteryBaseY = 0.04;
const maximumBatteryModules = 3;

type BatteryModuleProps = {
  index: number;
  active: boolean;
  delay: number;
  charge: MeshBasicMaterial;
};

const BatteryModule = ({ index, active, delay, charge }: BatteryModuleProps) => {
  const scene = useHouseScene();
  const group = useRef<Group>(null);
  const bar = useRef<Mesh>(null);
  const rezz = useSpring(active ? 1 : 0, { config: rezzSpring, delay });
  const body = useMemo(() => createDeviceMaterial(scene), [scene]);
  useEffect(() => () => body.dispose(), [body]);

  useFrame(() => {
    const progress = rezz.current.value;
    applyRezz(group.current, [body], progress);
    if (bar.current) bar.current.visible = progress > 0.8;
  });

  return (
    <group ref={group} position-y={batteryBaseY + index * batteryModuleStepM + batteryModuleHeightM / 2} visible={false}>
      <mesh geometry={unitBox} material={body} scale={[0.2, batteryModuleHeightM, 0.74]}>
        {deviceEdges}
      </mesh>
      <mesh ref={bar} geometry={unitBox} material={charge} position={[0.103, 0, 0]} scale={[0.006, 0.36, 0.06]} visible={false} />
    </group>
  );
};

type BatteryStackProps = {
  modules: number;
  label: string | null;
  introDelay: number;
};

export const BatteryStack = ({ modules, label, introDelay }: BatteryStackProps) => {
  const reducedMotion = useReducedMotion();
  const { daylight } = useHouseScene();
  const callout = useCallout(modules > 0 ? label : null);
  const charge = useMemo(() => new MeshBasicMaterial({ color: palette.energyCore }), []);
  const core = useMemo(() => charge.color.clone(), [charge]);
  useEffect(() => () => charge.dispose(), [charge]);

  useFrame((state) => {
    const pulse = reducedMotion ? 0.5 : 0.5 + 0.5 * Math.sin(state.clock.elapsedTime * 2.2);
    charge.color.copy(core).multiplyScalar(0.45 + 0.55 * pulse * (0.4 + 0.6 * daylight.current));
  });

  return (
    <AlongHouse side={1} offset={0.12} z={-1.8}>
      {Array.from({ length: maximumBatteryModules }, (_, index) => (
        <BatteryModule key={index} index={index} active={index < modules} delay={introDelay + index * 0.18} charge={charge} />
      ))}
      <Callout text={callout} position={[0.4, 2.2, 0]} tone="energy" />
    </AlongHouse>
  );
};

const parkedCar = new Vector3(3, 0, 1.2);
const driveDistanceM = 9;
const wheelRadiusM = 0.34;

const createCarGeometry = () => {
  const profile: [number, number][] = [
    [-2.15, 0.28],
    [2.15, 0.28],
    [2.15, 0.86],
    [1.72, 0.94],
    [0.95, 1.36],
    [-0.3, 1.36],
    [-1.05, 0.9],
    [-2.15, 0.78],
  ];
  const shape = new Shape();
  profile.forEach(([x, y], index) => (index === 0 ? shape.moveTo(x, y) : shape.lineTo(x, y)));
  shape.closePath();
  const geometry = new ExtrudeGeometry(shape, { depth: 1.8, bevelEnabled: false });
  geometry.translate(0, 0, -0.9);
  geometry.rotateY(Math.PI / 2);
  return geometry;
};

const chargingCable = new CatmullRomCurve3([
  new Vector3(0.14, 0.94, 0.9),
  new Vector3(0.45, 0.1, 0.85),
  new Vector3(1.3, 0.04, 0.35),
  new Vector3(2.02, 0.4, -0.25),
  new Vector3(2.1, 0.7, -0.3),
]);

const cableSegments = 64;
const cableRadialSegments = 6;

const wheelPositions: [number, number, number][] = [
  [-0.84, wheelRadiusM, -1.36],
  [0.84, wheelRadiusM, -1.36],
  [-0.84, wheelRadiusM, 1.36],
  [0.84, wheelRadiusM, 1.36],
];

export const ElectricVehicle = ({ active, label, introDelay }: EquipmentProps) => {
  const scene = useHouseScene();
  const car = useRef<Group>(null);
  const wheels = useRef<(Group | null)[]>([]);
  const wallbox = useRef<Group>(null);
  const cable = useRef<Mesh>(null);
  const lastZ = useRef<number | null>(null);
  const wallboxRezz = useSpring(active ? 1 : 0, { config: rezzSpring, delay: introDelay });
  const drive = useSpring(active ? 1 : 0, { config: drivingSpring, delay: active ? introDelay + 0.2 : 0 });
  const carRezz = useSpring(active ? 1 : 0, { config: rezzSpring, delay: active ? introDelay + 0.2 : 0 });
  const callout = useCallout(active ? label : null);

  const resources = useMemo(
    () => ({
      body: createDeviceMaterial(scene, { boxEdges: false, cell: 0.16 }),
      wheel: createDeviceMaterial(scene, { boxEdges: false }),
      wallbox: createDeviceMaterial(scene),
      cable: new MeshBasicMaterial({ color: palette.energyCore }),
      carGeometry: createCarGeometry(),
      wheelGeometry: new CylinderGeometry(wheelRadiusM, wheelRadiusM, 0.24, 28),
      cableGeometry: new TubeGeometry(chargingCable, cableSegments, 0.035, cableRadialSegments, false),
    }),
    [scene],
  );
  useEffect(() => () => Object.values(resources).forEach((resource) => resource.dispose()), [resources]);

  useFrame(() => {
    applyRezz(wallbox.current, [resources.wallbox], wallboxRezz.current.value);
    applyRezz(car.current, [resources.body, resources.wheel], carRezz.current.value);

    const progress = drive.current.value;
    const z = parkedCar.z + (1 - progress) * driveDistanceM;
    if (car.current) car.current.position.set(parkedCar.x, 0, z);
    if (lastZ.current !== null) {
      const rolled = (z - lastZ.current) / wheelRadiusM;
      wheels.current.forEach((wheel) => {
        if (wheel) wheel.rotation.x += rolled;
      });
    }
    lastZ.current = z;

    const plugged = smoothStep(0.9, 1, progress) * (active ? 1 : 0);
    if (cable.current) {
      cable.current.visible = plugged > 0.01;
      resources.cableGeometry.setDrawRange(0, Math.floor(plugged * cableSegments) * cableRadialSegments * 6);
    }
  });

  return (
    <AlongHouse side={1}>
      <group ref={wallbox} position={[0.06, 1.15, 0.9]} visible={false}>
        <mesh geometry={unitBox} material={resources.wallbox} scale={[0.1, 0.42, 0.3]}>
          {deviceEdges}
        </mesh>
      </group>
      <mesh ref={cable} geometry={resources.cableGeometry} material={resources.cable} visible={false} />
      <group ref={car} visible={false}>
        <mesh geometry={resources.carGeometry} material={resources.body}>
          {deviceEdges}
        </mesh>
        {wheelPositions.map((position, index) => (
          <group
            key={index}
            ref={(wheel) => {
              wheels.current[index] = wheel;
            }}
            position={position}
          >
            <mesh geometry={resources.wheelGeometry} material={resources.wheel} rotation-z={Math.PI / 2}>
              {deviceDetailEdges}
            </mesh>
          </group>
        ))}
      </group>
      <Callout text={callout} position={[0.9, 2.5, parkedCar.z]} />
    </AlongHouse>
  );
};
