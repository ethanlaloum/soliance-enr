export enum RoofOrientation {
  SOUTH = 'SOUTH',
  SOUTH_EAST = 'SOUTH_EAST',
  SOUTH_WEST = 'SOUTH_WEST',
  EAST_WEST = 'EAST_WEST',
}

export const roofOrientations: RoofOrientation[] = [
  RoofOrientation.SOUTH,
  RoofOrientation.SOUTH_EAST,
  RoofOrientation.SOUTH_WEST,
  RoofOrientation.EAST_WEST,
];

export enum HouseholdEquipment {
  ELECTRIC_HEATING = 'ELECTRIC_HEATING',
  AIR_CONDITIONING = 'AIR_CONDITIONING',
  POOL = 'POOL',
  ELECTRIC_VEHICLE = 'ELECTRIC_VEHICLE',
}

export const householdEquipments: HouseholdEquipment[] = [
  HouseholdEquipment.ELECTRIC_HEATING,
  HouseholdEquipment.AIR_CONDITIONING,
  HouseholdEquipment.POOL,
  HouseholdEquipment.ELECTRIC_VEHICLE,
];

export enum DaytimePresence {
  MOSTLY_ABSENT = 'MOSTLY_ABSENT',
  PRESENT = 'PRESENT',
}

export const daytimePresences: DaytimePresence[] = [DaytimePresence.MOSTLY_ABSENT, DaytimePresence.PRESENT];

export interface RoofInput {
  areaM2: number;
  orientation: RoofOrientation;
}

export interface ConsumptionInput {
  monthlyBillEur: number;
  equipment: HouseholdEquipment[];
  daytimePresence: DaytimePresence;
}

export interface SolarEstimateInput {
  roof: RoofInput;
  consumption: ConsumptionInput;
}

export interface SolarEstimate {
  recommendedKwc: number;
  panelCount: number;
  recommendedBatteryKwh: number;
  annualProductionKwh: number;
  monthlyProductionKwh: number[];
  annualConsumptionKwh: number;
  selfConsumedKwh: number;
  autonomyPercent: number;
  annualSavingsEur: number;
  surplusKwh: number;
  surplusValueEur: number;
}

export interface SolarEstimateParameters {
  roofAreaM2: { min: number; max: number; step: number };
  squareMetersPerKwc: number;
  panelPowerKwc: number;
  offeredPowersKwc: number[];
  specificYieldKwhPerKwc: number;
  pvgisRetainedShare: number;
  orientationCoefficients: Record<RoofOrientation, number>;
  monthlyProductionShares: number[];
  kwhPriceEur: number;
  surplusBuyBackEurPerKwh: number;
  monthlyBillEur: { min: number; max: number };
  daytimeConsumptionShares: Record<DaytimePresence, number>;
  equipmentDaytimeShareShifts: Record<HouseholdEquipment, number>;
  daytimeConsumptionShareBounds: { min: number; max: number };
  batteryModulesKwh: number[];
  batteryFullCyclesPerYear: number;
  batteryRoundTripEfficiency: number;
  referenceConsumption: ConsumptionInput;
}

export const solarEstimateParameters: SolarEstimateParameters = {
  roofAreaM2: { min: 20, max: 120, step: 5 },
  squareMetersPerKwc: 5,
  panelPowerKwc: 0.5,
  offeredPowersKwc: [3, 6, 9, 12],
  specificYieldKwhPerKwc: 1300,
  pvgisRetainedShare: 0.8564,
  orientationCoefficients: {
    [RoofOrientation.SOUTH]: 1,
    [RoofOrientation.SOUTH_EAST]: 0.95,
    [RoofOrientation.SOUTH_WEST]: 0.95,
    [RoofOrientation.EAST_WEST]: 0.85,
  },
  monthlyProductionShares: [0.055, 0.065, 0.085, 0.095, 0.105, 0.11, 0.115, 0.105, 0.085, 0.07, 0.055, 0.055],
  kwhPriceEur: 0.25,
  surplusBuyBackEurPerKwh: 0.01,
  monthlyBillEur: { min: 20, max: 2000 },
  daytimeConsumptionShares: {
    [DaytimePresence.MOSTLY_ABSENT]: 0.35,
    [DaytimePresence.PRESENT]: 0.5,
  },
  equipmentDaytimeShareShifts: {
    [HouseholdEquipment.ELECTRIC_HEATING]: -0.05,
    [HouseholdEquipment.AIR_CONDITIONING]: 0.05,
    [HouseholdEquipment.POOL]: 0.05,
    [HouseholdEquipment.ELECTRIC_VEHICLE]: -0.05,
  },
  daytimeConsumptionShareBounds: { min: 0.2, max: 0.6 },
  batteryModulesKwh: [5, 10, 15],
  batteryFullCyclesPerYear: 300,
  batteryRoundTripEfficiency: 0.9,
  referenceConsumption: {
    monthlyBillEur: 180,
    equipment: [],
    daytimePresence: DaytimePresence.MOSTLY_ABSENT,
  },
};

const monthsPerYear = 12;
const daysPerYear = 365;
const floatTolerance = 1e-9;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const roundToStep = (value: number, step: number) => Math.round(Number((value / step).toFixed(6))) * step;

const largestOfferNotAbove = (offers: number[], limit: number): number => {
  const ascending = [...offers].sort((left, right) => left - right);
  return ascending.filter((offer) => offer <= limit + floatTolerance).at(-1) ?? ascending[0];
};

export const annualConsumptionFromBillKwh = (monthlyBillEur: number, parameters: SolarEstimateParameters = solarEstimateParameters): number =>
  (monthlyBillEur * monthsPerYear) / parameters.kwhPriceEur;

export const specificProductionKwhPerKwc = (orientation: RoofOrientation, parameters: SolarEstimateParameters = solarEstimateParameters): number =>
  parameters.specificYieldKwhPerKwc * parameters.orientationCoefficients[orientation];

export const recommendPowerKwc = (
  roof: RoofInput,
  annualConsumptionKwh: number,
  parameters: SolarEstimateParameters = solarEstimateParameters,
): number => {
  const roofLimitKwc = roof.areaM2 / parameters.squareMetersPerKwc;
  const consumptionLimitKwc = annualConsumptionKwh / specificProductionKwhPerKwc(roof.orientation, parameters);
  return largestOfferNotAbove(parameters.offeredPowersKwc, Math.min(roofLimitKwc, consumptionLimitKwc));
};

export const daytimeConsumptionShare = (consumption: ConsumptionInput, parameters: SolarEstimateParameters = solarEstimateParameters): number => {
  const shift = consumption.equipment.reduce((total, item) => total + parameters.equipmentDaytimeShareShifts[item], 0);
  const share = parameters.daytimeConsumptionShares[consumption.daytimePresence] + shift;
  const { min, max } = parameters.daytimeConsumptionShareBounds;
  return Number(clamp(share, min, max).toFixed(4));
};

export const recommendBatteryKwh = (
  eveningNightKwhPerDay: number,
  surplusKwhPerDay: number,
  parameters: SolarEstimateParameters = solarEstimateParameters,
): number => largestOfferNotAbove(parameters.batteryModulesKwh, Math.min(eveningNightKwhPerDay, surplusKwhPerDay));

export const estimateSolarInstallation = (
  input: SolarEstimateInput,
  parameters: SolarEstimateParameters = solarEstimateParameters,
): SolarEstimate => {
  const consumptionKwh = annualConsumptionFromBillKwh(input.consumption.monthlyBillEur, parameters);
  const recommendedKwc = recommendPowerKwc(input.roof, consumptionKwh, parameters);
  const productionKwh = recommendedKwc * specificProductionKwhPerKwc(input.roof.orientation, parameters);
  const daytimeKwh = consumptionKwh * daytimeConsumptionShare(input.consumption, parameters);
  const eveningNightKwh = consumptionKwh - daytimeKwh;
  const directSelfConsumedKwh = Math.min(productionKwh, daytimeKwh);
  const excessKwh = productionKwh - directSelfConsumedKwh;
  const batteryKwh = recommendBatteryKwh(eveningNightKwh / daysPerYear, excessKwh / daysPerYear, parameters);
  const efficiency = parameters.batteryRoundTripEfficiency;
  const batteryDeliveredKwh = Math.min(batteryKwh * parameters.batteryFullCyclesPerYear * efficiency, excessKwh * efficiency, eveningNightKwh);
  const surplusKwh = Math.max(0, excessKwh - batteryDeliveredKwh / efficiency);
  const selfConsumedKwh = directSelfConsumedKwh + batteryDeliveredKwh;

  return {
    recommendedKwc,
    panelCount: roundToStep(recommendedKwc / parameters.panelPowerKwc, 1),
    recommendedBatteryKwh: batteryKwh,
    annualProductionKwh: roundToStep(productionKwh, 10),
    monthlyProductionKwh: parameters.monthlyProductionShares.map((share) => roundToStep(productionKwh * share, 1)),
    annualConsumptionKwh: roundToStep(consumptionKwh, 10),
    selfConsumedKwh: roundToStep(selfConsumedKwh, 10),
    autonomyPercent: consumptionKwh > 0 ? roundToStep((selfConsumedKwh / consumptionKwh) * 100, 1) : 0,
    annualSavingsEur: roundToStep(selfConsumedKwh * parameters.kwhPriceEur, 10),
    surplusKwh: roundToStep(surplusKwh, 10),
    surplusValueEur: roundToStep(surplusKwh * parameters.surplusBuyBackEurPerKwh, 1),
  };
};
