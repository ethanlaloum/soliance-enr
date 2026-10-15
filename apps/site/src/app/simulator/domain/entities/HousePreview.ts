import { HouseholdEquipment, RoofOrientation, RoofTilt, SolarEstimate } from '@/app/simulator/domain/entities/SolarEstimate';
import { effectiveRoofTilt, RoofCovering, SimulatorAnswers } from '@/app/simulator/domain/entities/SimulatorWizard';

export enum RoofFace {
  FRONT = 'FRONT',
  BACK = 'BACK',
}

export interface PanelSlot {
  key: string;
  face: RoofFace;
  row: number;
  column: number;
}

export interface HousePreview {
  houseLengthM: number;
  orientation: RoofOrientation;
  roofTilt: RoofTilt;
  roofCovering: RoofCovering;
  panels: PanelSlot[];
  batteryModules: number;
  equipment: HouseholdEquipment[];
}

export interface HousePreviewParameters {
  roofAreaM2: { min: number; max: number };
  houseLengthM: { min: number; max: number };
  roofEdgeMarginM: number;
  panelPitchM: number;
  maximumPanelRows: number;
  singleRowMaximumPanels: number;
  batteryModuleKwh: number;
}

export const housePreviewParameters: HousePreviewParameters = {
  roofAreaM2: { min: 20, max: 120 },
  houseLengthM: { min: 9, max: 14 },
  roofEdgeMarginM: 0.6,
  panelPitchM: 0.95,
  maximumPanelRows: 3,
  singleRowMaximumPanels: 4,
  batteryModuleKwh: 5.1,
};

const roundToCentimeter = (value: number) => Math.round(value * 100) / 100;

export const houseLengthOf = (roofAreaM2: number, parameters: HousePreviewParameters = housePreviewParameters): number => {
  const { min, max } = parameters.roofAreaM2;
  const progress = Math.min(Math.max((roofAreaM2 - min) / (max - min), 0), 1);
  return roundToCentimeter(parameters.houseLengthM.min + progress * (parameters.houseLengthM.max - parameters.houseLengthM.min));
};

export const panelColumnsFitting = (houseLengthM: number, parameters: HousePreviewParameters = housePreviewParameters): number =>
  Math.max(1, Math.floor((houseLengthM - 2 * parameters.roofEdgeMarginM) / parameters.panelPitchM));

const faceSlots = (face: RoofFace, panelCount: number, columnsFitting: number, parameters: HousePreviewParameters): PanelSlot[] => {
  const count = Math.min(panelCount, columnsFitting * parameters.maximumPanelRows);
  if (count <= 0) return [];
  const minimumRows = count > parameters.singleRowMaximumPanels ? 2 : 1;
  const rows = Math.min(parameters.maximumPanelRows, Math.max(Math.ceil(count / columnsFitting), minimumRows));
  const rowSizes = Array.from({ length: rows }, (_, row) => Math.floor(count / rows) + (row < count % rows ? 1 : 0));
  return rowSizes.flatMap((size, row) =>
    Array.from({ length: size }, (_, index) => ({
      key: `${face}-${rowSizes.slice(0, row).reduce((total, previous) => total + previous, 0) + index}`,
      face,
      row,
      column: index - (size - 1) / 2,
    })),
  );
};

export const panelSlotsOf = (
  panelCount: number,
  orientation: RoofOrientation,
  columnsFitting: number,
  parameters: HousePreviewParameters = housePreviewParameters,
): PanelSlot[] => {
  if (orientation !== RoofOrientation.EAST_WEST) return faceSlots(RoofFace.FRONT, panelCount, columnsFitting, parameters);
  const frontCount = Math.ceil(panelCount / 2);
  return [
    ...faceSlots(RoofFace.FRONT, frontCount, columnsFitting, parameters),
    ...faceSlots(RoofFace.BACK, panelCount - frontCount, columnsFitting, parameters),
  ];
};

export const housePreviewOf = (
  answers: Pick<SimulatorAnswers, 'roofAreaM2' | 'orientation' | 'roofTilt' | 'roofCovering' | 'equipment'>,
  estimate: Pick<SolarEstimate, 'panelCount' | 'batteryKwh'> | null,
  parameters: HousePreviewParameters = housePreviewParameters,
): HousePreview => {
  const houseLengthM = houseLengthOf(answers.roofAreaM2, parameters);
  return {
    houseLengthM,
    orientation: answers.orientation,
    roofTilt: effectiveRoofTilt(answers),
    roofCovering: answers.roofCovering,
    panels: estimate ? panelSlotsOf(estimate.panelCount, answers.orientation, panelColumnsFitting(houseLengthM, parameters), parameters) : [],
    batteryModules: estimate ? Math.round(estimate.batteryKwh / parameters.batteryModuleKwh) : 0,
    equipment: answers.equipment,
  };
};
