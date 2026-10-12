import { Euler, Quaternion, Vector3 } from 'three';
import { housePreviewParameters, PanelSlot, RoofFace } from '@/app/simulator/domain/entities/HousePreview';
import { RoofOrientation, RoofTilt } from '@/app/simulator/domain/entities/SolarEstimate';

export const houseDepthM = 7.6;
export const wallHeightM = 3;
export const roofPitch = Math.PI / 6;
export const eaveOverhangM = 0.45;
export const gableOverhangM = 0.3;
export const roofThicknessM = 0.16;
export const flatSlabM = 0.24;
export const parapetHeightM = 0.42;

export const panelWidthM = 0.9;
export const panelLengthM = 1.35;
export const panelThicknessM = 0.045;
export const panelGapM = 0.06;
export const panelStandoffM = 0.09;
export const panelEaveMarginM = 0.4;
const flatPanelTilt = (12 * Math.PI) / 180;

const halfDepth = houseDepthM / 2;

export const tiltRadians: Record<RoofTilt, number> = {
  [RoofTilt.LOW]: (15 * Math.PI) / 180,
  [RoofTilt.CLASSIC]: Math.PI / 6,
  [RoofTilt.STEEP]: Math.PI / 4,
};

export interface RoofShape {
  pitch: number;
  ridgeRise: number;
  slopeLength: number;
  slabLength: number;
  normal: Vector3;
  upSlope: Vector3;
  eaveBottom: Vector3;
  slabCenter: Vector3;
  ridgeTopY: number;
  panelEaveMargin: number;
}

const rowsOnSlope = 3;

export const roofShapeOf = (pitch: number): RoofShape => {
  const normal = new Vector3(0, Math.cos(pitch), Math.sin(pitch));
  const upSlope = new Vector3(0, Math.sin(pitch), -Math.cos(pitch));
  const slopeLength = (halfDepth + eaveOverhangM) / Math.cos(pitch);
  const slabLength = slopeLength + roofThicknessM * Math.tan(pitch);
  const eaveBottom = new Vector3(0, wallHeightM - eaveOverhangM * Math.tan(pitch), halfDepth + eaveOverhangM);
  const ridgeRise = halfDepth * Math.tan(pitch);
  const panelRun = rowsOnSlope * panelLengthM + (rowsOnSlope - 1) * panelGapM;
  return {
    pitch,
    ridgeRise,
    slopeLength,
    slabLength,
    normal,
    upSlope,
    eaveBottom,
    slabCenter: eaveBottom.clone().addScaledVector(upSlope, slabLength / 2).addScaledVector(normal, roofThicknessM / 2),
    ridgeTopY: wallHeightM + ridgeRise + roofThicknessM / Math.cos(pitch),
    panelEaveMargin: Math.max(0.12, Math.min(panelEaveMarginM, slopeLength - panelRun - 0.06)),
  };
};

const defaultShape = roofShapeOf(roofPitch);

let cachedShape = defaultShape;

export const roofShapeAt = (pitch: number): RoofShape => {
  if (Math.abs(cachedShape.pitch - pitch) > 1e-6) cachedShape = roofShapeOf(pitch);
  return cachedShape;
};

export const ridgeRiseM = defaultShape.ridgeRise;
export const slopeLengthM = defaultShape.slopeLength;
export const roofNormal = defaultShape.normal;
export const upSlope = defaultShape.upSlope;
export const eaveBottom = defaultShape.eaveBottom;
export const slopeSlabLengthM = defaultShape.slabLength;
export const slopeSlabCenter = defaultShape.slabCenter;
export const ridgeTopY = defaultShape.ridgeTopY;
export const flatDeckTopY = wallHeightM + flatSlabM;

export interface Pose {
  position: Vector3;
  quaternion: Quaternion;
}

const halfTurn = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), Math.PI);

const mirrored = ({ position, quaternion }: Pose): Pose => ({
  position: new Vector3(-position.x, position.y, -position.z),
  quaternion: halfTurn.clone().multiply(quaternion),
});

const tilted = (angle: number) => new Quaternion().setFromEuler(new Euler(angle, 0, 0));

const gableFrontPose = (row: number, column: number, shape: RoofShape): Pose => {
  const alongSlope = shape.panelEaveMargin + row * (panelLengthM + panelGapM) + panelLengthM / 2;
  const position = shape.eaveBottom
    .clone()
    .addScaledVector(shape.normal, roofThicknessM + panelStandoffM + panelThicknessM / 2)
    .addScaledVector(shape.upSlope, alongSlope);
  position.x = column * housePreviewParameters.panelPitchM;
  return { position, quaternion: tilted(shape.pitch) };
};

const flatPanelCenterY = flatDeckTopY + 0.12 + (panelLengthM / 2) * Math.sin(flatPanelTilt);
const flatPanelHalfDepth = (panelLengthM / 2) * Math.cos(flatPanelTilt);

const flatSingleFacePose = (row: number, column: number): Pose => ({
  position: new Vector3(column * housePreviewParameters.panelPitchM, flatPanelCenterY, 2.2 - row * 2.15),
  quaternion: tilted(flatPanelTilt),
});

const flatTentPose = (face: RoofFace, row: number, column: number): Pose => {
  const tentCenter = 1.5 - row * 3;
  const front = face === RoofFace.FRONT;
  return {
    position: new Vector3(
      (front ? 1 : -1) * column * housePreviewParameters.panelPitchM,
      flatPanelCenterY,
      tentCenter + (front ? 1 : -1) * (flatPanelHalfDepth + 0.02),
    ),
    quaternion: front ? tilted(flatPanelTilt) : halfTurn.clone().multiply(tilted(flatPanelTilt)),
  };
};

export const panelPose = (slot: PanelSlot, flatRoof: boolean, orientation: RoofOrientation, shape: RoofShape = defaultShape): Pose => {
  if (flatRoof) {
    return orientation === RoofOrientation.EAST_WEST ? flatTentPose(slot.face, slot.row, slot.column) : flatSingleFacePose(slot.row, slot.column);
  }
  const pose = gableFrontPose(slot.row, slot.column, shape);
  return slot.face === RoofFace.FRONT ? pose : mirrored(pose);
};

const frontBearingDegrees: Record<RoofOrientation, number> = {
  [RoofOrientation.SOUTH]: 180,
  [RoofOrientation.SOUTH_EAST]: 135,
  [RoofOrientation.SOUTH_WEST]: 225,
  [RoofOrientation.EAST_WEST]: 90,
};

export const compassOffsetRadians = (orientation: RoofOrientation): number => ((180 - frontBearingDegrees[orientation]) * Math.PI) / 180;

export const stageYawRadians = (orientation: RoofOrientation): number => (orientation === RoofOrientation.EAST_WEST ? -Math.PI / 2 : 0);

export const poolLayout = {
  offsetFromLeftGable: 2.9,
  centerZ: houseDepthM / 2 + 5,
  width: 5,
  depth: 2.6,
  coping: 0.3,
  basinDepth: 1.3,
  waterline: 0.14,
};

export const maximumPanelsPerFace = { [RoofFace.FRONT]: 24, [RoofFace.BACK]: 12 };
