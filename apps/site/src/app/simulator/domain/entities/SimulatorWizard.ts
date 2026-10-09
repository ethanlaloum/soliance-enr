import { AddressLocation, AddressSuggestion } from '@/app/address/domain/entities/AddressSuggestion';
import { CommuneSolarYield } from '@/app/solar-yield/domain/entities/CommuneSolarYield';
import { DepartmentSolarYield, departmentSolarYieldOf, departmentSolarYields } from '@/app/simulator/domain/entities/DepartmentSolarYield';
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
  location: AddressLocation | null;
  city: string | null;
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
  location: null,
  city: null,
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
  sunshine: LocalSunshine;
}

export enum SunshineScope {
  COMMUNE = 'COMMUNE',
  DEPARTMENT = 'DEPARTMENT',
  REGIONAL_DEFAULT = 'REGIONAL_DEFAULT',
}

export interface LocalSunshine {
  scope: SunshineScope;
  placeName: string | null;
  yieldKwhPerKwc: number;
  peakMonthKwhPerKwc: number;
}

export interface LocalSolarContext {
  parameters: SolarEstimateParameters;
  sunshine: LocalSunshine;
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

const sunshineOf = (scope: SunshineScope, placeName: string | null, parameters: SolarEstimateParameters): LocalSolarContext => {
  const monthlyTotal = parameters.monthlyProductionShares.reduce((total, share) => total + share, 0);
  const peakShare = Math.max(...parameters.monthlyProductionShares) / monthlyTotal;
  return {
    parameters,
    sunshine: {
      scope,
      placeName,
      yieldKwhPerKwc: parameters.specificYieldKwhPerKwc,
      peakMonthKwhPerKwc: Math.round(parameters.specificYieldKwhPerKwc * peakShare),
    },
  };
};

const withYield = (
  parameters: SolarEstimateParameters,
  site: AddressLocation,
  yearlyKwhPerKwc: number,
  monthlyKwhPerKwc: number[],
): SolarEstimateParameters => ({
  ...parameters,
  site,
  specificYieldKwhPerKwc: yearlyKwhPerKwc,
  monthlyProductionShares: monthlyKwhPerKwc,
});

export const localSolarContext = (
  answers: Pick<SimulatorAnswers, 'postalCode' | 'location' | 'city'>,
  communeYield: CommuneSolarYield | null,
  parameters: SolarEstimateParameters = solarEstimateParameters,
  yields: DepartmentSolarYield[] = departmentSolarYields,
): LocalSolarContext => {
  if (answers.location && communeYield) {
    return sunshineOf(
      SunshineScope.COMMUNE,
      answers.city,
      withYield(parameters, answers.location, communeYield.yearlyKwhPerKwc, communeYield.monthlyKwhPerKwc),
    );
  }
  const department = departmentSolarYieldOf(answers.postalCode, yields);
  if (department) {
    return sunshineOf(
      SunshineScope.DEPARTMENT,
      department.name,
      withYield(parameters, department.location, department.yieldKwhPerKwc, department.monthlyYieldKwhPerKwc),
    );
  }
  return sunshineOf(SunshineScope.REGIONAL_DEFAULT, null, parameters);
};

export const previewSolarEstimate = (
  answers: SimulatorAnswers,
  step: SimulatorStep,
  communeYield: CommuneSolarYield | null = null,
  parameters: SolarEstimateParameters = solarEstimateParameters,
  yields: DepartmentSolarYield[] = departmentSolarYields,
): SolarEstimatePreview | null => {
  if (step === SimulatorStep.ADDRESS) return null;
  const consumption = previewConsumption(answers, step, parameters);
  const usesReferenceBill = step === SimulatorStep.ROOF || parseMonthlyBill(answers.monthlyBill, parameters) === null;
  const local = localSolarContext(answers, communeYield, parameters, yields);
  return {
    estimate: estimateSolarInstallation({ roof: { areaM2: answers.roofAreaM2, orientation: answers.orientation }, consumption }, local.parameters),
    referenceMonthlyBillEur: usesReferenceBill ? parameters.referenceConsumption.monthlyBillEur : null,
    sunshine: local.sunshine,
  };
};

export const geocodedAnswersPatch = (
  answers: Pick<SimulatorAnswers, 'location' | 'postalCode'>,
  suggestions: AddressSuggestion[],
): Pick<SimulatorAnswers, 'location' | 'city'> | null => {
  if (answers.location) return null;
  const match = suggestions.find((suggestion) => suggestion.postalCode === answers.postalCode.trim());
  return match ? { location: match.location, city: match.city } : null;
};
