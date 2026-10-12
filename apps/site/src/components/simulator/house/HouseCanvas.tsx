import { ComponentRef, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Group, Matrix4, PerspectiveCamera, Vector3 } from 'three';
import { HousePreview } from '@/app/simulator/domain/entities/HousePreview';
import { HouseholdEquipment } from '@/app/simulator/domain/entities/SolarEstimate';
import { RoofCovering } from '@/app/simulator/domain/entities/SimulatorWizard';
import { GardenScenery } from '@/components/simulator/house/GardenScenery';
import { ridgeTopY, roofShapeOf, stageYawRadians, tiltRadians } from '@/components/simulator/house/houseGeometry';
import { AirConditioner, BatteryStack, Callout, ElectricHeating, ElectricVehicle, Pool } from '@/components/simulator/house/HouseEquipment';
import { HouseModel } from '@/components/simulator/house/HouseModel';
import {
  dampingFactor,
  HouseMotionContext,
  HouseSceneContext,
  HouseSceneState,
  useCallout,
  useIntroDelay,
  useReducedMotion,
  useSpring,
} from '@/components/simulator/house/houseMotion';
import { CompassLetters } from '@/components/simulator/house/houseTextures';
import { SolarPanels } from '@/components/simulator/house/SolarPanels';
import { DaylightCycle, EnergyFlow } from '@/components/simulator/house/SunAndEnergy';
import '@/components/simulator/house/house.css';

export type HouseSceneLabels = {
  equipment: Record<HouseholdEquipment, string>;
  panels: string | null;
  battery: string | null;
  compass: CompassLetters;
};

type HouseCanvasProps = {
  preview: HousePreview;
  labels: HouseSceneLabels;
};

const cameraTarget = new Vector3(0.6, 1, 2.4);
const cameraDirection = new Vector3(0.34, 0.56, 1).normalize();
const cameraPolarAngle = Math.acos(cameraDirection.y);
const upAxis = new Vector3(0, 1, 0);
const swayAmplitude = 0.12;
const fitMargin = 0.98;

const framingPointsFor = (houseLengthM: number, roofTopY: number) => {
  const half = houseLengthM / 2;
  const ground = [-half - 3.6, half + 4.7].flatMap((x) => [-4.6, 10.4].map((z) => new Vector3(x, 0, z)));
  const roof = [-half - 0.3, half + 0.3].flatMap((x) => [new Vector3(x, roofTopY + 0.3, 0), new Vector3(x, 3.2, -4.4)]);
  return [...ground, ...roof];
};

const fitsInView = (camera: PerspectiveCamera, points: Vector3[]) =>
  points.every((point) => {
    const projected = point.clone().project(camera);
    return Math.abs(projected.x) <= fitMargin && Math.abs(projected.y) <= fitMargin;
  });

const placeCamera = (camera: PerspectiveCamera, distance: number) => {
  camera.position.copy(cameraTarget).addScaledVector(cameraDirection, distance);
  camera.lookAt(cameraTarget);
  camera.updateMatrixWorld();
};

const fittedDistance = (camera: PerspectiveCamera, yaw: number, houseLengthM: number, roofTopY: number) => {
  const probe = camera.clone();
  const framingPoints = framingPointsFor(houseLengthM, roofTopY);
  const points = [-swayAmplitude, 0, swayAmplitude].flatMap((offset) =>
    framingPoints.map((point) => point.clone().applyAxisAngle(upAxis, yaw + offset)),
  );
  let near = 8;
  let far = 140;
  for (let step = 0; step < 22; step += 1) {
    const middle = (near + far) / 2;
    placeCamera(probe, middle);
    if (fitsInView(probe, points)) far = middle;
    else near = middle;
  }
  return far;
};

type CameraRigProps = {
  yaw: number;
  houseLengthM: number;
  roofTopY: number;
};

const CameraRig = ({ yaw, houseLengthM, roofTopY }: CameraRigProps) => {
  const camera = useThree((state) => state.camera) as PerspectiveCamera;
  const canvas = useThree((state) => state.gl.domElement);
  const width = useThree((state) => state.size.width);
  const height = useThree((state) => state.size.height);
  const reducedMotion = useReducedMotion();
  const controls = useRef<ComponentRef<typeof OrbitControls>>(null);
  const distance = useRef<number | null>(null);
  const offset = useMemo(() => new Vector3(), []);

  useEffect(() => {
    camera.aspect = width / Math.max(height, 1);
    camera.updateProjectionMatrix();
    const fitted = fittedDistance(camera, yaw, houseLengthM, roofTopY);
    if (distance.current === null) placeCamera(camera, fitted);
    distance.current = fitted;
    controls.current?.update();
  }, [camera, width, height, yaw, houseLengthM, roofTopY]);

  useEffect(() => {
    canvas.style.touchAction = 'pan-y';
  }, [canvas]);

  useFrame((_, delta) => {
    if (distance.current === null) return;
    offset.copy(camera.position).sub(cameraTarget);
    const current = offset.length();
    if (Math.abs(current - distance.current) < 0.01) return;
    offset.setLength(current + (distance.current - current) * dampingFactor(3.5, delta, reducedMotion));
    camera.position.copy(cameraTarget).add(offset);
  });

  return (
    <OrbitControls
      ref={controls}
      domElement={canvas}
      target={cameraTarget.toArray()}
      enableZoom={false}
      enablePan={false}
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.55}
      minPolarAngle={cameraPolarAngle}
      maxPolarAngle={cameraPolarAngle}
    />
  );
};

const HouseStage = ({ preview, labels }: HouseCanvasProps) => {
  const reducedMotion = useReducedMotion();
  const stage = useRef<Group>(null);
  const isFlat = preview.roofCovering === RoofCovering.FLAT_ROOF;
  const houseLength = useSpring(preview.houseLengthM, { from: preview.houseLengthM });
  const flatRoof = useSpring(isFlat ? 1 : 0, { from: isFlat ? 1 : 0 });
  const roofPitch = useSpring(tiltRadians[preview.roofTilt], { from: tiltRadians[preview.roofTilt] });
  const daylight = useRef(1);
  const stageInverse = useMemo(() => new Matrix4(), []);
  const pixelRatio = useMemo(() => ({ value: 1 }), []);
  const scene = useMemo<HouseSceneState>(
    () => ({ houseLength, flatRoof, roofPitch, daylight, stageInverse, pixelRatio }),
    [houseLength, flatRoof, roofPitch, stageInverse, pixelRatio],
  );
  const yaw = useSpring(stageYawRadians(preview.orientation), { from: stageYawRadians(preview.orientation) });
  const intro = useSpring(1, { from: 0 });
  const delayed = {
    house: useIntroDelay(0.2),
    panels: useIntroDelay(1.35),
    battery: useIntroDelay(1.7),
    equipment: useIntroDelay(2),
  };
  const has = (item: HouseholdEquipment) => preview.equipment.includes(item);
  const panelsCallout = useCallout(preview.panels.length > 0 ? labels.panels : null);

  useFrame((state) => {
    if (!stage.current) return;
    const sway = reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 0.21) * swayAmplitude;
    const shown = intro.current.value;
    stage.current.rotation.y = yaw.current.value + sway;
    stage.current.scale.setScalar(0.82 + 0.18 * shown);
    stage.current.position.y = (1 - shown) * -2.5;
    stage.current.updateMatrixWorld();
    stageInverse.copy(stage.current.matrixWorld).invert();
    pixelRatio.value = state.viewport.dpr;
  });

  return (
    <HouseSceneContext.Provider value={scene}>
      <group ref={stage}>
        <DaylightCycle />
        <GardenScenery
          orientation={preview.orientation}
          compassLetters={labels.compass}
          poolActive={has(HouseholdEquipment.POOL)}
          poolDelay={delayed.equipment}
        />
        <HouseModel covering={preview.roofCovering} introDelay={delayed.house} />
        <ElectricHeating
          active={has(HouseholdEquipment.ELECTRIC_HEATING)}
          label={labels.equipment[HouseholdEquipment.ELECTRIC_HEATING]}
          introDelay={delayed.equipment}
        />
        <SolarPanels panels={preview.panels} orientation={preview.orientation} introDelay={delayed.panels} />
        <EnergyFlow active={preview.panels.length > 0} />
        <BatteryStack modules={preview.batteryModules} label={labels.battery} introDelay={delayed.battery} />
        <Pool active={has(HouseholdEquipment.POOL)} label={labels.equipment[HouseholdEquipment.POOL]} introDelay={delayed.equipment} />
        <AirConditioner
          active={has(HouseholdEquipment.AIR_CONDITIONING)}
          label={labels.equipment[HouseholdEquipment.AIR_CONDITIONING]}
          introDelay={delayed.equipment + 0.2}
        />
        <ElectricVehicle
          active={has(HouseholdEquipment.ELECTRIC_VEHICLE)}
          label={labels.equipment[HouseholdEquipment.ELECTRIC_VEHICLE]}
          introDelay={delayed.equipment + 0.4}
        />
        <Callout text={panelsCallout} position={[0, ridgeTopY + 1.3, 0]} tone="energy" />
      </group>
    </HouseSceneContext.Provider>
  );
};

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return reduced;
};

const useInView = () => {
  const element = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const target = element.current;
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: '120px' });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return { element, inView };
};

export const HouseCanvas = ({ preview, labels }: HouseCanvasProps) => {
  const reducedMotion = usePrefersReducedMotion();
  const { element, inView } = useInView();

  return (
    <div ref={element} className="absolute inset-0 cursor-grab active:cursor-grabbing">
      <Canvas
        flat
        dpr={[1, 1.75]}
        frameloop={inView ? 'always' : 'never'}
        camera={{ fov: 30, near: 0.5, far: 400, position: [16, 22, 40] }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <HouseMotionContext.Provider value={reducedMotion}>
          <CameraRig
            yaw={stageYawRadians(preview.orientation)}
            houseLengthM={preview.houseLengthM}
            roofTopY={roofShapeOf(tiltRadians[preview.roofTilt]).ridgeTopY}
          />
          <HouseStage preview={preview} labels={labels} />
        </HouseMotionContext.Provider>
      </Canvas>
    </div>
  );
};
