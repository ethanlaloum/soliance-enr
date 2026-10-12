import { AddressLocation, AddressSuggestion } from '@/app/address/domain/entities/AddressSuggestion';
import { CommuneSolarYield } from '@/app/solar-yield/domain/entities/CommuneSolarYield';
import { DepartmentSolarYield, departmentSolarYieldOf, departmentSolarYields } from '@/app/simulator/domain/entities/DepartmentSolarYield';
import {
  ConsumptionInput,
  DaytimePresence,
  EvCharging,
  estimateSolarInstallation,
  HouseholdEquipment,
  householdEquipments,
  RoofOrientation,
  RoofTilt,
  Shading,
  SolarEstimate,
  SolarEstimateInput,
  SolarEstimateParameters,
  solarEstimateParameters,
  TypicalDay,
  typicalDayOf,
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
  roofTilt: RoofTilt;
  roofCovering: RoofCovering;
  panelCount: number | null;
  batteryKwh: number | null;
  shading: Shading;
  monthlyBill: string;
  equipment: HouseholdEquipment[];
  daytimePresence: DaytimePresence;
  annualConsumption: string | null;
  evKmPerYear: number;
  evCharging: EvCharging;
  kwhPriceEur: number;
  priceTrendPercent: number;
  projectionYears: number;
}

export const initialSimulatorAnswers: SimulatorAnswers = {
  address: '',
  postalCode: '',
  location: null,
  city: null,
  roofAreaM2: 45,
  orientation: RoofOrientation.SOUTH,
  roofTilt: RoofTilt.CLASSIC,
  roofCovering: RoofCovering.TILES,
  panelCount: null,
  batteryKwh: null,
  shading: Shading.NONE,
  monthlyBill: '',
  equipment: [],
  daytimePresence: DaytimePresence.MOSTLY_ABSENT,
  annualConsumption: null,
  evKmPerYear: 13000,
  evCharging: EvCharging.NIGHT,
  kwhPriceEur: solarEstimateParameters.kwhPriceEur,
  priceTrendPercent: solarEstimateParameters.savingsProjection.priceTrendPercent,
  projectionYears: solarEstimateParameters.savingsProjection.years,
};

export enum SimulatorFieldError {
  ADDRESS_REQUIRED = 'ADDRESS_REQUIRED',
  POSTAL_CODE_INVALID = 'POSTAL_CODE_INVALID',
  MONTHLY_BILL_INVALID = 'MONTHLY_BILL_INVALID',
  ANNUAL_CONSUMPTION_INVALID = 'ANNUAL_CONSUMPTION_INVALID',
}

export enum ConsumptionSource {
  ANNUAL = 'ANNUAL',
  BILL = 'BILL',
  REFERENCE = 'REFERENCE',
}

export type SimulatorValidatedField = 'address' | 'postalCode' | 'monthlyBill' | 'annualConsumption';

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

export const annualConsumptionRangeKwh = { min: 1000, max: 50000 };

const ignoredKwhCharacters = /[\s.\u202f\u00a0]/g;
const kwhPattern = /^\d+(?:\.\d+)?$/;

export const parseAnnualConsumption = (text: string): number | null => {
  const normalized = text.replace(ignoredKwhCharacters, '').replace(',', '.');
  if (!kwhPattern.test(normalized)) return null;
  const kwh = Math.round(Number(normalized));
  return kwh >= annualConsumptionRangeKwh.min && kwh <= annualConsumptionRangeKwh.max ? kwh : null;
};

export const chosenAnnualConsumptionKwh = (answers: Pick<SimulatorAnswers, 'annualConsumption'>): number | null =>
  answers.annualConsumption === null ? null : parseAnnualConsumption(answers.annualConsumption);

export const consumptionSourceOf = (
  answers: Pick<SimulatorAnswers, 'annualConsumption' | 'monthlyBill'>,
  parameters: SolarEstimateParameters = solarEstimateParameters,
): ConsumptionSource => {
  if (chosenAnnualConsumptionKwh(answers) !== null) return ConsumptionSource.ANNUAL;
  return parseMonthlyBill(answers.monthlyBill, parameters) === null ? ConsumptionSource.REFERENCE : ConsumptionSource.BILL;
};

const consumptionErrors = (answers: SimulatorAnswers, parameters: SolarEstimateParameters): SimulatorErrors => {
  const typedAnnual = answers.annualConsumption !== null && answers.annualConsumption.trim() !== '';
  const annualIsInvalid = typedAnnual && chosenAnnualConsumptionKwh(answers) === null;
  const billIsMissing = parseMonthlyBill(answers.monthlyBill, parameters) === null && chosenAnnualConsumptionKwh(answers) === null;
  return {
    ...(billIsMissing && !annualIsInvalid ? { monthlyBill: SimulatorFieldError.MONTHLY_BILL_INVALID } : {}),
    ...(annualIsInvalid ? { annualConsumption: SimulatorFieldError.ANNUAL_CONSUMPTION_INVALID } : {}),
  };
};

const stepErrors: Record<SimulatorStep, (answers: SimulatorAnswers, parameters: SolarEstimateParameters) => SimulatorErrors> = {
  [SimulatorStep.ADDRESS]: (answers) => ({
    ...(answers.address.trim().length < minimumAddressLength ? { address: SimulatorFieldError.ADDRESS_REQUIRED } : {}),
    ...(postalCodePattern.test(answers.postalCode.trim()) ? {} : { postalCode: SimulatorFieldError.POSTAL_CODE_INVALID }),
  }),
  [SimulatorStep.ROOF]: () => ({}),
  [SimulatorStep.CONSUMPTION]: (answers, parameters) => consumptionErrors(answers, parameters),
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
    annualKwh: chosenAnnualConsumptionKwh(answers),
    evKmPerYear: answers.equipment.includes(HouseholdEquipment.ELECTRIC_VEHICLE) ? answers.evKmPerYear : null,
    evCharging: answers.evCharging,
  };
};

export const effectiveRoofTilt = (answers: Pick<SimulatorAnswers, 'roofTilt' | 'roofCovering'>): RoofTilt =>
  answers.roofCovering === RoofCovering.FLAT_ROOF ? RoofTilt.LOW : answers.roofTilt;

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

interface PreviewContext {
  input: SolarEstimateInput;
  parameters: SolarEstimateParameters;
  sunshine: LocalSunshine;
  usesReferenceBill: boolean;
}

const previewContext = (
  answers: SimulatorAnswers,
  step: SimulatorStep,
  communeYield: CommuneSolarYield | null,
  parameters: SolarEstimateParameters,
  yields: DepartmentSolarYield[],
): PreviewContext | null => {
  if (step === SimulatorStep.ADDRESS) return null;
  const priced = { ...parameters, kwhPriceEur: answers.kwhPriceEur };
  const local = localSolarContext(answers, communeYield, priced, yields);
  return {
    input: {
      roof: { areaM2: answers.roofAreaM2, orientation: answers.orientation, tilt: effectiveRoofTilt(answers) },
      consumption: previewConsumption(answers, step, priced),
      panelCount: answers.panelCount,
      batteryKwh: answers.batteryKwh,
      shading: answers.shading,
    },
    parameters: local.parameters,
    sunshine: local.sunshine,
    usesReferenceBill: step === SimulatorStep.ROOF || consumptionSourceOf(answers, priced) === ConsumptionSource.REFERENCE,
  };
};

export const previewSolarEstimate = (
  answers: SimulatorAnswers,
  step: SimulatorStep,
  communeYield: CommuneSolarYield | null = null,
  parameters: SolarEstimateParameters = solarEstimateParameters,
  yields: DepartmentSolarYield[] = departmentSolarYields,
): SolarEstimatePreview | null => {
  const context = previewContext(answers, step, communeYield, parameters, yields);
  if (!context) return null;
  return {
    estimate: estimateSolarInstallation(context.input, context.parameters),
    referenceMonthlyBillEur: context.usesReferenceBill ? parameters.referenceConsumption.monthlyBillEur : null,
    sunshine: context.sunshine,
  };
};

export const previewTypicalDay = (
  answers: SimulatorAnswers,
  step: SimulatorStep,
  monthIndex: number,
  communeYield: CommuneSolarYield | null = null,
  parameters: SolarEstimateParameters = solarEstimateParameters,
  yields: DepartmentSolarYield[] = departmentSolarYields,
): TypicalDay | null => {
  const context = previewContext(answers, step, communeYield, parameters, yields);
  return context ? typicalDayOf(context.input, monthIndex, context.parameters) : null;
};

export const geocodedAnswersPatch = (
  answers: Pick<SimulatorAnswers, 'location' | 'postalCode'>,
  suggestions: AddressSuggestion[],
): Pick<SimulatorAnswers, 'location' | 'city'> | null => {
  if (answers.location) return null;
  const match = suggestions.find((suggestion) => suggestion.postalCode === answers.postalCode.trim());
  return match ? { location: match.location, city: match.city } : null;
};
