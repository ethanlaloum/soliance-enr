import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Edges } from '@react-three/drei';
import { BoxGeometry, ExtrudeGeometry, Group, Mesh, ShaderMaterial, Shape } from 'three';
import { RoofCovering } from '@/app/simulator/domain/entities/SimulatorWizard';
import { AlongHouse } from '@/components/simulator/house/AlongHouse';
import {
  flatSlabM,
  gableOverhangM,
  houseDepthM,
  parapetHeightM,
  ridgeRiseM,
  roofShapeAt,
  roofThicknessM,
  slopeSlabCenter,
  slopeSlabLengthM,
  wallHeightM,
} from '@/components/simulator/house/houseGeometry';
import { createGlassMaterial } from '@/components/simulator/house/houseMaterials';
import { dampingFactor, useHouseScene, useReducedMotion, useSpring } from '@/components/simulator/house/houseMotion';
import { lineWidths, palette } from '@/components/simulator/house/housePalette';

type Opening = {
  fraction: number;
  width: number;
  height: number;
  bottom: number;
};

const frontOpenings: Opening[] = [
  { fraction: -0.34, width: 1.2, height: 1.35, bottom: 1 },
  { fraction: -0.12, width: 1, height: 2.2, bottom: 0 },
  { fraction: 0.15, width: 2.8, height: 2.25, bottom: 0 },
  { fraction: 0.37, width: 1.2, height: 1.35, bottom: 1 },
];

const backOpenings: Opening[] = [
  { fraction: -0.22, width: 1.2, height: 1.35, bottom: 1 },
  { fraction: 0.22, width: 1.8, height: 1.35, bottom: 1 },
];

const roofFill: Record<RoofCovering, number> = {
  [RoofCovering.TILES]: 0.34,
  [RoofCovering.SLATE]: 0.52,
  [RoofCovering.METAL_SHEET]: 0.42,
  [RoofCovering.FLAT_ROOF]: 0.34,
  [RoofCovering.OTHER]: 0.38,
};

const halfDepth = houseDepthM / 2;
const roofLength = (length: number) => length + 2 * gableOverhangM;
const unitBox = new BoxGeometry(1, 1, 1);

const createGableGeometry = () => {
  const shape = new Shape();
  shape.moveTo(-halfDepth, 0);
  shape.lineTo(halfDepth, 0);
  shape.lineTo(0, ridgeRiseM);
  shape.closePath();
  const geometry = new ExtrudeGeometry(shape, { depth: 1, bevelEnabled: false });
  geometry.translate(0, 0, -0.5);
  geometry.rotateY(Math.PI / 2);
  return geometry;
};

type OpeningMeshProps = {
  opening: Opening;
  material: ShaderMaterial;
};

const OpeningMesh = ({ opening, material }: OpeningMeshProps) => (
  <mesh geometry={unitBox} material={material} position={[0, opening.bottom + opening.height / 2, 0.012]} scale={[opening.width, opening.height, 0.02]}>
    <Edges color={palette.openingLine} lineWidth={lineWidths.opening} />
  </mesh>
);

type HouseModelProps = {
  covering: RoofCovering;
  introDelay: number;
};

export const HouseModel = ({ covering, introDelay }: HouseModelProps) => {
  const scene = useHouseScene();
  const { houseLength, flatRoof, roofPitch } = scene;
  const reducedMotion = useReducedMotion();
  const body = useRef<Group>(null);
  const walls = useRef<Mesh>(null);
  const gable = useRef<Mesh>(null);
  const gableRoof = useRef<Group>(null);
  const slabs = useRef<(Mesh | null)[]>([]);
  const flatRoofGroup = useRef<Group>(null);
  const flatSlab = useRef<Mesh>(null);
  const parapets = useRef<(Mesh | null)[]>([]);
  const clock = useRef(0);
  const [rezzDelay] = useState(introDelay);
  const rezz = useMemo(() => ({ value: 0 }), []);

  const rise = useSpring(1, { delay: introDelay, from: 0 });
  const roofDrop = useSpring(0, { delay: introDelay + 0.35, from: 1 });

  const gableGeometry = useMemo(createGableGeometry, []);
  const materials = useMemo(
    () => ({
      shell: createGlassMaterial(scene, { fillColor: palette.houseFill, fill: 0.28, line: 0.09, glow: 0.3, fresnel: 0.1, rezz }),
      gable: createGlassMaterial(scene, { fillColor: palette.houseFill, fill: 0.28, line: 0.09, fresnel: 0.1, boxEdges: false, rezz }),
      roof: createGlassMaterial(scene, { fillColor: palette.houseFill, fill: roofFill[RoofCovering.TILES], line: 0.12, glow: 0.36, fresnel: 0.08, rezz }),
      opening: createGlassMaterial(scene, { fillColor: palette.paneFill, fill: 0.08, glow: 0.22, fresnel: 0.05, rezz }),
    }),
    [scene, rezz],
  );

  useEffect(
    () => () => {
      Object.values(materials).forEach((material) => material.dispose());
      gableGeometry.dispose();
    },
    [materials, gableGeometry],
  );

  useFrame((_, delta) => {
    clock.current += delta;
    rezz.value = reducedMotion ? 1000 : clock.current - rezzDelay;

    const length = houseLength.current.value;
    const flat = Math.min(Math.max(flatRoof.current.value, 0), 1);
    const shape = roofShapeAt(roofPitch.current.value);
    const fill = materials.roof.uniforms.uFill;
    fill.value += (roofFill[covering] - fill.value) * dampingFactor(5, delta, reducedMotion);

    if (body.current) body.current.scale.y = Math.max(rise.current.value, 0.001);
    if (walls.current) walls.current.scale.x = length;
    if (gable.current) {
      gable.current.scale.x = length;
      gable.current.scale.y = Math.max((1 - flat) * (shape.ridgeRise / ridgeRiseM), 0.001);
      gable.current.visible = flat < 0.995;
    }
    const lift = roofDrop.current.value * 1.6;
    if (gableRoof.current) {
      gableRoof.current.scale.y = Math.max(1 - flat, 0.001);
      gableRoof.current.position.y = wallHeightM + lift;
      gableRoof.current.visible = flat < 0.995;
    }
    slabs.current.forEach((slab) => {
      if (!slab) return;
      slab.position.copy(shape.slabCenter);
      slab.rotation.x = shape.pitch;
      slab.scale.set(roofLength(length), roofThicknessM, shape.slabLength);
    });
    if (flatRoofGroup.current) {
      flatRoofGroup.current.scale.y = Math.max(flat, 0.001);
      flatRoofGroup.current.position.y = wallHeightM + lift;
      flatRoofGroup.current.visible = flat > 0.005;
    }
    if (flatSlab.current) flatSlab.current.scale.x = length + 0.3;
    const [front, back, left, right] = parapets.current;
    if (front) front.scale.x = length + 0.3;
    if (back) back.scale.x = length + 0.3;
    if (left) left.position.x = -(length / 2 + 0.075);
    if (right) right.position.x = length / 2 + 0.075;
  });

  const structureEdges = <Edges color={palette.structureLine} lineWidth={lineWidths.structure} />;

  return (
    <group ref={body}>
      <mesh ref={walls} geometry={unitBox} material={materials.shell} position-y={wallHeightM / 2} scale={[1, wallHeightM, houseDepthM]}>
        {structureEdges}
      </mesh>
      <mesh ref={gable} geometry={gableGeometry} material={materials.gable} position-y={wallHeightM}>
        {structureEdges}
      </mesh>

      {frontOpenings.map((opening) => (
        <AlongHouse key={`front-${opening.fraction}`} fraction={opening.fraction} z={halfDepth}>
          <OpeningMesh opening={opening} material={materials.opening} />
        </AlongHouse>
      ))}
      {backOpenings.map((opening) => (
        <AlongHouse key={`back-${opening.fraction}`} fraction={opening.fraction} z={-halfDepth} rotationY={Math.PI}>
          <OpeningMesh opening={opening} material={materials.opening} />
        </AlongHouse>
      ))}

      <group ref={gableRoof} position-y={wallHeightM}>
        {[0, Math.PI].map((turn, index) => (
          <group key={turn} rotation-y={turn} position-y={-wallHeightM}>
            <mesh
              ref={(mesh) => {
                slabs.current[index] = mesh;
              }}
              geometry={unitBox}
              material={materials.roof}
              position={slopeSlabCenter.toArray()}
              rotation-x={Math.PI / 6}
              scale={[1, roofThicknessM, slopeSlabLengthM]}
            >
              {structureEdges}
            </mesh>
          </group>
        ))}
      </group>

      <group ref={flatRoofGroup} position-y={wallHeightM}>
        <mesh ref={flatSlab} geometry={unitBox} material={materials.roof} position-y={flatSlabM / 2} scale={[1, flatSlabM, houseDepthM + 0.3]}>
          {structureEdges}
        </mesh>
        {[
          { position: [0, flatSlabM + parapetHeightM / 2, halfDepth + 0.075], scale: [1, parapetHeightM, 0.15] },
          { position: [0, flatSlabM + parapetHeightM / 2, -(halfDepth + 0.075)], scale: [1, parapetHeightM, 0.15] },
          { position: [0, flatSlabM + parapetHeightM / 2, 0], scale: [0.15, parapetHeightM, houseDepthM + 0.3] },
          { position: [0, flatSlabM + parapetHeightM / 2, 0], scale: [0.15, parapetHeightM, houseDepthM + 0.3] },
        ].map(({ position, scale }, index) => (
          <mesh
            key={index}
            ref={(mesh) => {
              parapets.current[index] = mesh;
            }}
            geometry={unitBox}
            material={materials.shell}
            position={position as [number, number, number]}
            scale={scale as [number, number, number]}
          >
            {structureEdges}
          </mesh>
        ))}
      </group>
    </group>
  );
};
