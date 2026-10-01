import {
  ConsumptionInput,
  DaytimePresence,
  estimateSolarInstallation,
  HouseholdEquipment,
  householdEquipments,
  RoofOrientation,
  SolarEstimate,
  SolarEstimateParameters,
  solarEstimateParameters,
} from '@/app/simulator/domain/entities/SolarEstimate';

export enum SimulatorStep {
  ADDRESS = 'ADDRESS',
  ROOF = 'ROOF',
  CONSUMPTION = 'CONSUMPTION',
  RESULT = 'RESULT',
}

export const simulatorSteps: SimulatorStep[] = [SimulatorStep.ADDRESS, SimulatorStep.ROOF, SimulatorStep.CONSUMPTION, SimulatorStep.RESULT];

export enum RoofCovering {
  TILES = 'TILES',
  SLATE = 'SLATE',
  METAL_SHEET = 'METAL_SHEET',
  FLAT_ROOF = 'FLAT_ROOF',
  OTHER = 'OTHER',
}

export const roofCoverings: RoofCovering[] = [RoofCovering.TILES, RoofCovering.SLATE, RoofCovering.METAL_SHEET, RoofCovering.FLAT_ROOF, RoofCovering.OTHER];

export interface SimulatorAnswers {
  address: string;
  postalCode: string;
  roofAreaM2: number;
  orientation: RoofOrientation;
  roofCovering: RoofCovering;
  monthlyBill: string;
  equipment: HouseholdEquipment[];
  daytimePresence: DaytimePresence;
}

export const initialSimulatorAnswers: SimulatorAnswers = {
  address: '',
  postalCode: '',
  roofAreaM2: 45,
  orientation: RoofOrientation.SOUTH,
  roofCovering: RoofCovering.TILES,
  monthlyBill: '',
  equipment: [],
  daytimePresence: DaytimePresence.MOSTLY_ABSENT,
};

export enum SimulatorFieldError {
  ADDRESS_REQUIRED = 'ADDRESS_REQUIRED',
  POSTAL_CODE_INVALID = 'POSTAL_CODE_INVALID',
  MONTHLY_BILL_INVALID = 'MONTHLY_BILL_INVALID',
}

export type SimulatorValidatedField = 'address' | 'postalCode' | 'monthlyBill';

export type SimulatorErrors = Partial<Record<SimulatorValidatedField, SimulatorFieldError>>;

export interface SolarEstimatePreview {
  estimate: SolarEstimate;
  referenceMonthlyBillEur: number | null;
}

const minimumAddressLength = 3;
const postalCodePattern = /^\d{5}$/;
const monthlyBillPattern = /^\d+(?:\.\d{1,2})?$/;
const ignoredBillCharacters = /[\s€]/g;

export const parseMonthlyBill = (text: string, parameters: SolarEstimateParameters = solarEstimateParameters): number | null => {
  const normalized = text.replace(ignoredBillCharacters, '').replace(',', '.');
  if (!monthlyBillPattern.test(normalized)) return null;
  const value = Number(normalized);
  const { min, max } = parameters.monthlyBillEur;
  return value >= min && value <= max ? value : null;
};

const stepErrors: Record<SimulatorStep, (answers: SimulatorAnswers, parameters: SolarEstimateParameters) => SimulatorErrors> = {
  [SimulatorStep.ADDRESS]: (answers) => ({
    ...(answers.address.trim().length < minimumAddressLength ? { address: SimulatorFieldError.ADDRESS_REQUIRED } : {}),
    ...(postalCodePattern.test(answers.postalCode.trim()) ? {} : { postalCode: SimulatorFieldError.POSTAL_CODE_INVALID }),
  }),
  [SimulatorStep.ROOF]: () => ({}),
  [SimulatorStep.CONSUMPTION]: (answers, parameters) =>
    parseMonthlyBill(answers.monthlyBill, parameters) === null ? { monthlyBill: SimulatorFieldError.MONTHLY_BILL_INVALID } : {},
  [SimulatorStep.RESULT]: () => ({}),
};

export const validateSimulatorStep = (
  step: SimulatorStep,
  answers: SimulatorAnswers,
  parameters: SolarEstimateParameters = solarEstimateParameters,
): SimulatorErrors =>
  simulatorSteps
    .slice(0, simulatorSteps.indexOf(step) + 1)
    .reduce<SimulatorErrors>((errors, reachedStep) => ({ ...errors, ...stepErrors[reachedStep](answers, parameters) }), {});

export const simulatorStepNumber = (step: SimulatorStep): number => simulatorSteps.indexOf(step) + 1;

export const nextSimulatorStep = (step: SimulatorStep): SimulatorStep =>
  simulatorSteps[Math.min(simulatorSteps.indexOf(step) + 1, simulatorSteps.length - 1)];

export const previousSimulatorStep = (step: SimulatorStep): SimulatorStep => simulatorSteps[Math.max(simulatorSteps.indexOf(step) - 1, 0)];

export const toggleEquipment = (equipment: HouseholdEquipment[], item: HouseholdEquipment): HouseholdEquipment[] => {
  const selected = equipment.includes(item) ? equipment.filter((current) => current !== item) : [...equipment, item];
  return householdEquipments.filter((candidate) => selected.includes(candidate));
};

const previewConsumption = (answers: SimulatorAnswers, step: SimulatorStep, parameters: SolarEstimateParameters): ConsumptionInput => {
  if (step === SimulatorStep.ROOF) return parameters.referenceConsumption;
  return {
    monthlyBillEur: parseMonthlyBill(answers.monthlyBill, parameters) ?? parameters.referenceConsumption.monthlyBillEur,
    equipment: answers.equipment,
    daytimePresence: answers.daytimePresence,
  };
};

export const previewSolarEstimate = (
  answers: SimulatorAnswers,
  step: SimulatorStep,
  parameters: SolarEstimateParameters = solarEstimateParameters,
): SolarEstimatePreview | null => {
  if (step === SimulatorStep.ADDRESS) return null;
  const consumption = previewConsumption(answers, step, parameters);
  const usesReferenceBill = step === SimulatorStep.ROOF || parseMonthlyBill(answers.monthlyBill, parameters) === null;
  return {
    estimate: estimateSolarInstallation({ roof: { areaM2: answers.roofAreaM2, orientation: answers.orientation }, consumption }, parameters),
    referenceMonthlyBillEur: usesReferenceBill ? parameters.referenceConsumption.monthlyBillEur : null,
  };
};
