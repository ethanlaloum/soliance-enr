import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { BoxGeometry, Material, Mesh, MeshBasicMaterial } from 'three';
import { PanelSlot, RoofFace } from '@/app/simulator/domain/entities/HousePreview';
import { RoofOrientation } from '@/app/simulator/domain/entities/SolarEstimate';
import {
  maximumPanelsPerFace,
  panelLengthM,
  panelPose,
  panelThicknessM,
  panelWidthM,
  roofShapeAt,
} from '@/components/simulator/house/houseGeometry';
import { createPanelTopMaterial } from '@/components/simulator/house/houseMaterials';
import { dampingFactor, settleSpring, useHouseScene, useReducedMotion, useSpring } from '@/components/simulator/house/houseMotion';
import { palette } from '@/components/simulator/house/housePalette';

const panelKeys = [RoofFace.FRONT, RoofFace.BACK].flatMap((face) => Array.from({ length: maximumPanelsPerFace[face] }, (_, index) => `${face}-${index}`));

const staggerSeconds = 0.055;
const dropHeightM = 1.6;

type PanelProps = {
  slot: PanelSlot | null;
  delay: number;
  orientation: RoofOrientation;
  geometry: BoxGeometry;
  materials: Material[];
};

type Placement = { face: RoofFace; row: number; column: number };

const Panel = ({ slot, delay, orientation, geometry, materials }: PanelProps) => {
  const mesh = useRef<Mesh>(null);
  const reducedMotion = useReducedMotion();
  const { roofPitch, flatRoof } = useHouseScene();
  const presence = useSpring(slot ? 1 : 0, { config: settleSpring, delay });
  const lastSlot = useRef<PanelSlot | null>(null);
  const placement = useRef<Placement | null>(null);

  useFrame((_, delta) => {
    const panel = mesh.current;
    if (!panel) return;
    if (slot) lastSlot.current = slot;
    const target = lastSlot.current;
    const shown = presence.current.value;
    panel.visible = target !== null && shown > 0.003;
    if (!target) return;

    const current = placement.current;
    if (!current || current.face !== target.face || shown < 0.02) {
      placement.current = { face: target.face, row: target.row, column: target.column };
    } else {
      const blend = dampingFactor(6.5, delta, reducedMotion);
      current.row += (target.row - current.row) * blend;
      current.column += (target.column - current.column) * blend;
    }

    const place = { ...target, ...placement.current };
    const shape = roofShapeAt(roofPitch.current.value);
    const pose = panelPose(place, false, orientation, shape);
    const flat = Math.min(Math.max(flatRoof.current.value, 0), 1);
    if (flat > 0.001) {
      const flatPose = panelPose(place, true, orientation, shape);
      pose.position.lerp(flatPose.position, flat);
      pose.quaternion.slerp(flatPose.quaternion, flat);
    }
    panel.position.copy(pose.position);
    panel.position.y += Math.max(0, 1 - shown) * dropHeightM;
    panel.quaternion.copy(pose.quaternion);
    panel.scale.setScalar(Math.max(shown, 0.001));
  });

  return <mesh ref={mesh} geometry={geometry} material={materials} visible={false} />;
};

type SolarPanelsProps = {
  panels: PanelSlot[];
  orientation: RoofOrientation;
  introDelay: number;
};

export const SolarPanels = ({ panels, orientation, introDelay }: SolarPanelsProps) => {
  const previousCount = useRef(0);
  const geometry = useMemo(() => new BoxGeometry(panelWidthM, panelThicknessM, panelLengthM), []);
  const scene = useHouseScene();
  const energy = useMemo(() => ({ value: 1 }), []);
  const materials = useMemo(() => {
    const side = new MeshBasicMaterial({ color: palette.energyDim });
    const top = createPanelTopMaterial(scene, energy);
    const bottom = new MeshBasicMaterial({ color: palette.panelTile });
    return [side, side, top, bottom, side, side];
  }, [scene, energy]);

  useFrame(() => {
    energy.value = 0.72 + 0.28 * scene.daylight.current;
  });

  useEffect(() => {
    previousCount.current = panels.length;
  }, [panels.length]);

  useEffect(
    () => () => {
      geometry.dispose();
      new Set(materials).forEach((material) => material.dispose());
    },
    [geometry, materials],
  );

  const slotsByKey = new Map(panels.map((slot, index) => [slot.key, { slot, index }]));
  const firstNewIndex = previousCount.current;

  return (
    <group>
      {panelKeys.map((key) => {
        const entry = slotsByKey.get(key);
        return (
          <Panel
            key={key}
            slot={entry?.slot ?? null}
            delay={entry ? introDelay + Math.max(0, entry.index - firstNewIndex) * staggerSeconds : 0}
            orientation={orientation}
            geometry={geometry}
            materials={materials}
          />
        );
      })}
    </group>
  );
};
