import { Battery, simulateDay, simulateDayHours } from '@/app/simulator/domain/entities/BatteryDay';
import { daysPerMonth, hoursPerDay, SolarSite, solarHourlyShape } from '@/app/simulator/domain/entities/SolarGeometry';

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

export enum RoofTilt {
  LOW = 'LOW',
  CLASSIC = 'CLASSIC',
  STEEP = 'STEEP',
}

export const roofTilts: RoofTilt[] = [RoofTilt.LOW, RoofTilt.CLASSIC, RoofTilt.STEEP];

export enum Shading {
  NONE = 'NONE',
  LIGHT = 'LIGHT',
  STRONG = 'STRONG',
}

export const shadings: Shading[] = [Shading.NONE, Shading.LIGHT, Shading.STRONG];

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

export enum EvCharging {
  NIGHT = 'NIGHT',
  MIXED = 'MIXED',
  DAYTIME = 'DAYTIME',
}

export const evChargings: EvCharging[] = [EvCharging.NIGHT, EvCharging.MIXED, EvCharging.DAYTIME];

export enum SizingChoice {
  RECOMMENDED = 'RECOMMENDED',
  CUSTOM = 'CUSTOM',
}

export interface RoofInput {
  areaM2: number;
  orientation: RoofOrientation;
  tilt?: RoofTilt;
}

export interface ConsumptionInput {
  monthlyBillEur: number;
  equipment: HouseholdEquipment[];
  daytimePresence: DaytimePresence;
  annualKwh?: number | null;
  evKmPerYear?: number | null;
  evCharging?: EvCharging;
}

export interface SolarEstimateInput {
  roof: RoofInput;
  consumption: ConsumptionInput;
  panelCount?: number | null;
  batteryKwh?: number | null;
  shading?: Shading;
}

export interface PanelCountRange {
  min: number;
  max: number;
}

export interface BatteryComparison {
  selfConsumedKwh: number;
  autonomyPercent: number;
  annualSavingsEur: number;
}

export interface SolarEstimate {
  recommendedKwc: number;
  recommendedPanelCount: number;
  installedKwc: number;
  panelCount: number;
  panelChoice: SizingChoice;
  recommendedBatteryKwh: number;
  batteryKwh: number;
  batteryChoice: SizingChoice;
  annualProductionKwh: number;
  monthlyProductionKwh: number[];
  annualConsumptionKwh: number;
  monthlyConsumptionKwh: number[];
  selfConsumedKwh: number;
  selfConsumptionPercent: number;
  autonomyPercent: number;
  annualSavingsEur: number;
  surplusKwh: number;
  surplusValueEur: number;
  withoutBattery: BatteryComparison;
}

export interface HouseholdLoad {
  annualShare: number;
  monthlyWeights: number[];
  hourlyWeights: number[];
}

export interface ProductionDayType {
  productionFactor: number;
  weight: number;
}

export interface SavingsProjection {
  years: number;
  priceTrendPercent: number;
  degradationPercent: number;
}

export interface SolarEstimateParameters {
  roofAreaM2: { min: number; max: number; step: number };
  squareMetersPerKwc: number;
  panelPowerKwc: number;
  minimumPanelCount: number;
  offeredPowersKwc: number[];
  batteryModulesKwh: number[];
  site: SolarSite;
  specificYieldKwhPerKwc: number;
  monthlyProductionShares: number[];
  tiltDegrees: Record<RoofTilt, number>;
  orientationAzimuthsDegrees: Record<RoofOrientation, number[]>;
  orientationCoefficients: Record<RoofTilt, Record<RoofOrientation, number>>;
  shadingFactors: Record<Shading, number>;
  productionDayTypes: ProductionDayType[];
  kwhPriceEur: number;
  surplusBuyBackEurPerKwh: number;
  monthlyBillEur: { min: number; max: number };
  baseMonthlyWeights: number[];
  baseHourlyWeights: Record<DaytimePresence, number[]>;
  equipmentLoads: Record<HouseholdEquipment, HouseholdLoad>;
  evKwhPer100Km: number;
  evHourlyWeights: Record<EvCharging, number[]>;
  maximumEquipmentShare: number;
  batteryRoundTripEfficiency: number;
  batteryPowerKwPerKwh: number;
  sizingYieldKwhPerKwc: number;
  referenceConsumption: ConsumptionInput;
  savingsProjection: SavingsProjection;
}

const nightCharging = [1, 1, 1, 1, 1, 0.5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.5, 1, 1, 1, 1, 1];

export const solarEstimateParameters: SolarEstimateParameters = {
  roofAreaM2: { min: 20, max: 120, step: 5 },
  squareMetersPerKwc: 5,
  panelPowerKwc: 0.5,
  minimumPanelCount: 6,
  offeredPowersKwc: [3, 6, 9, 12],
  batteryModulesKwh: [5, 10, 15],
  site: { latitude: 43.6721, longitude: 7.1902 },
  specificYieldKwhPerKwc: 1300,
  monthlyProductionShares: [0.055, 0.065, 0.085, 0.095, 0.105, 0.11, 0.115, 0.105, 0.085, 0.07, 0.055, 0.055],
  tiltDegrees: {
    [RoofTilt.LOW]: 15,
    [RoofTilt.CLASSIC]: 30,
    [RoofTilt.STEEP]: 45,
  },
  orientationAzimuthsDegrees: {
    [RoofOrientation.SOUTH]: [0],
    [RoofOrientation.SOUTH_EAST]: [-45],
    [RoofOrientation.SOUTH_WEST]: [45],
    [RoofOrientation.EAST_WEST]: [-90, 90],
  },
  orientationCoefficients: {
    [RoofTilt.LOW]: {
      [RoofOrientation.SOUTH]: 0.939,
      [RoofOrientation.SOUTH_EAST]: 0.904,
      [RoofOrientation.SOUTH_WEST]: 0.903,
      [RoofOrientation.EAST_WEST]: 0.814,
    },
    [RoofTilt.CLASSIC]: {
      [RoofOrientation.SOUTH]: 1,
      [RoofOrientation.SOUTH_EAST]: 0.938,
      [RoofOrientation.SOUTH_WEST]: 0.937,
      [RoofOrientation.EAST_WEST]: 0.782,
    },
    [RoofTilt.STEEP]: {
      [RoofOrientation.SOUTH]: 1.006,
      [RoofOrientation.SOUTH_EAST]: 0.929,
      [RoofOrientation.SOUTH_WEST]: 0.928,
      [RoofOrientation.EAST_WEST]: 0.734,
    },
  },
  shadingFactors: {
    [Shading.NONE]: 1,
    [Shading.LIGHT]: 0.95,
    [Shading.STRONG]: 0.85,
  },
  productionDayTypes: [
    { productionFactor: 0.35, weight: 1 / 3 },
    { productionFactor: 1, weight: 1 / 3 },
    { productionFactor: 1.65, weight: 1 / 3 },
  ],
  kwhPriceEur: 0.25,
  surplusBuyBackEurPerKwh: 0.01,
  monthlyBillEur: { min: 20, max: 2000 },
  baseMonthlyWeights: [1.16, 1.08, 1.02, 0.95, 0.9, 0.86, 0.86, 0.84, 0.9, 0.98, 1.08, 1.17],
  baseHourlyWeights: {
    [DaytimePresence.MOSTLY_ABSENT]: [
      2.8, 2.5, 2.4, 2.4, 2.4, 2.6, 3.6, 5, 4.6, 3.2, 2.8, 2.8, 3, 2.9, 2.7, 2.8, 3.4, 4.8, 6.4, 7.2, 7, 6.2, 5, 3.6,
    ],
    [DaytimePresence.PRESENT]: [
      2.6, 2.3, 2.2, 2.2, 2.2, 2.4, 3.2, 4.4, 4.6, 4.4, 4.4, 4.8, 5.2, 4.6, 4.2, 4, 4.2, 5, 6, 6.4, 6.2, 5.5, 4.5, 3.3,
    ],
  },
  equipmentLoads: {
    [HouseholdEquipment.ELECTRIC_HEATING]: {
      annualShare: 0.4,
      monthlyWeights: [0.2, 0.17, 0.13, 0.07, 0.02, 0, 0, 0, 0.01, 0.06, 0.14, 0.2],
      hourlyWeights: [3, 3, 3, 3, 3.5, 4.5, 6, 6.5, 5.5, 4, 3.2, 3, 3, 2.8, 2.8, 3, 3.8, 5.2, 6.2, 6.2, 5.8, 5, 4.2, 3.5],
    },
    [HouseholdEquipment.AIR_CONDITIONING]: {
      annualShare: 0.1,
      monthlyWeights: [0, 0, 0, 0, 0.03, 0.18, 0.36, 0.33, 0.1, 0, 0, 0],
      hourlyWeights: [1, 0.8, 0.6, 0.5, 0.5, 0.5, 0.5, 0.8, 1, 1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7, 7, 6.5, 5.5, 4.5, 3.5, 2.5, 1.8, 1.2],
    },
    [HouseholdEquipment.POOL]: {
      annualShare: 0.12,
      monthlyWeights: [0.02, 0.02, 0.04, 0.07, 0.11, 0.15, 0.17, 0.17, 0.12, 0.07, 0.03, 0.03],
      hourlyWeights: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
    },
    [HouseholdEquipment.ELECTRIC_VEHICLE]: {
      annualShare: 0.2,
      monthlyWeights: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      hourlyWeights: nightCharging,
    },
  },
  evKwhPer100Km: 17,
  evHourlyWeights: {
    [EvCharging.NIGHT]: nightCharging,
    [EvCharging.MIXED]: [0.5, 0.5, 0.5, 0.5, 0.5, 0.25, 0, 0, 0, 0.5, 1, 1, 1, 1, 1, 1, 0.5, 0, 0.25, 0.5, 0.5, 0.5, 0.5, 0.5],
    [EvCharging.DAYTIME]: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0.5, 1, 1, 1, 1, 1, 1, 0.5, 0, 0, 0, 0, 0, 0, 0],
  },
  maximumEquipmentShare: 0.7,
  batteryRoundTripEfficiency: 0.9,
  batteryPowerKwPerKwh: 0.5,
  sizingYieldKwhPerKwc: 1400,
  referenceConsumption: {
    monthlyBillEur: 180,
    equipment: [],
    daytimePresence: DaytimePresence.MOSTLY_ABSENT,
  },
  savingsProjection: { years: 20, priceTrendPercent: 2, degradationPercent: 0.5 },
};

const monthsPerYear = 12;
const floatTolerance = 1e-9;

const roundToStep = (value: number, step: number) => Math.round(Number((value / step).toFixed(6))) * step;

const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);

const normalize = (weights: number[]): number[] => {
  const total = sum(weights);
  return weights.map((weight) => (total > 0 ? weight / total : 0));
};

const tiltOf = (roof: RoofInput): RoofTilt => roof.tilt ?? RoofTilt.CLASSIC;

export const annualConsumptionFromBillKwh = (monthlyBillEur: number, parameters: SolarEstimateParameters = solarEstimateParameters): number =>
  (monthlyBillEur * monthsPerYear) / parameters.kwhPriceEur;

export const annualConsumptionKwh = (consumption: ConsumptionInput, parameters: SolarEstimateParameters = solarEstimateParameters): number =>
  consumption.annualKwh ?? annualConsumptionFromBillKwh(consumption.monthlyBillEur, parameters);

const equipmentLoadOf = (item: HouseholdEquipment, consumption: ConsumptionInput, annualKwh: number, parameters: SolarEstimateParameters): HouseholdLoad => {
  const load = parameters.equipmentLoads[item];
  if (item !== HouseholdEquipment.ELECTRIC_VEHICLE) return load;
  const evShare = consumption.evKmPerYear && annualKwh > 0 ? (consumption.evKmPerYear * parameters.evKwhPer100Km) / 100 / annualKwh : load.annualShare;
  return { ...load, annualShare: evShare, hourlyWeights: parameters.evHourlyWeights[consumption.evCharging ?? EvCharging.NIGHT] };
};

export const householdDailyLoadsKwh = (consumption: ConsumptionInput, parameters: SolarEstimateParameters = solarEstimateParameters): number[][] => {
  const annualKwh = annualConsumptionKwh(consumption, parameters);
  const equipmentLoads = consumption.equipment.map((item) => equipmentLoadOf(item, consumption, annualKwh, parameters));
  const equipmentShare = sum(equipmentLoads.map((load) => load.annualShare));
  const equipmentScale = equipmentShare > parameters.maximumEquipmentShare ? parameters.maximumEquipmentShare / equipmentShare : 1;
  const loads: HouseholdLoad[] = [
    {
      annualShare: 1 - equipmentShare * equipmentScale,
      monthlyWeights: parameters.baseMonthlyWeights,
      hourlyWeights: parameters.baseHourlyWeights[consumption.daytimePresence],
    },
    ...equipmentLoads.map((load) => ({ ...load, annualShare: load.annualShare * equipmentScale })),
  ];

  return daysPerMonth.map((days, month) =>
    Array.from({ length: hoursPerDay }, (_, hour) =>
      loads.reduce((total, load) => {
        const monthly = normalize(load.monthlyWeights)[month];
        const hourly = normalize(load.hourlyWeights)[hour];
        return total + (annualKwh * load.annualShare * monthly * hourly) / days;
      }, 0),
    ),
  );
};

export const dailyProductionPerKwc = (
  orientation: RoofOrientation,
  parameters: SolarEstimateParameters = solarEstimateParameters,
  tilt: RoofTilt = RoofTilt.CLASSIC,
  shading: Shading = Shading.NONE,
): number[][] => {
  const shares = normalize(parameters.monthlyProductionShares);
  const coefficient = parameters.orientationCoefficients[tilt][orientation] * parameters.shadingFactors[shading];
  return daysPerMonth.map((days, month) => {
    const dailyKwh = (parameters.specificYieldKwhPerKwc * shares[month] * coefficient) / days;
    return solarHourlyShape(parameters.site, month, parameters.tiltDegrees[tilt], parameters.orientationAzimuthsDegrees[orientation]).map(
      (share) => dailyKwh * share,
    );
  });
};

export interface YearEnergy {
  monthlyProductionKwh: number[];
  monthlyConsumptionKwh: number[];
  consumptionKwh: number;
  selfConsumedKwh: number;
  exportedKwh: number;
}

const batteryOf = (batteryKwh: number, parameters: SolarEstimateParameters): Battery => ({
  capacityKwh: batteryKwh,
  maxPowerKw: batteryKwh * parameters.batteryPowerKwPerKwh,
  roundTripEfficiency: parameters.batteryRoundTripEfficiency,
});

export const simulateYear = (
  powerKwc: number,
  batteryKwh: number,
  productionPerKwc: number[][],
  loads: number[][],
  parameters: SolarEstimateParameters = solarEstimateParameters,
): YearEnergy => {
  const battery = batteryOf(batteryKwh, parameters);
  const year: YearEnergy = { monthlyProductionKwh: [], monthlyConsumptionKwh: [], consumptionKwh: 0, selfConsumedKwh: 0, exportedKwh: 0 };

  daysPerMonth.forEach((days, month) => {
    let monthProduction = 0;
    let monthConsumption = 0;
    parameters.productionDayTypes.forEach(({ productionFactor, weight }) => {
      const production = productionPerKwc[month].map((kwh) => kwh * powerKwc * productionFactor);
      const day = simulateDay(production, loads[month], battery);
      const dayCount = days * weight;
      monthProduction += day.productionKwh * dayCount;
      monthConsumption += day.consumptionKwh * dayCount;
      year.consumptionKwh += day.consumptionKwh * dayCount;
      year.selfConsumedKwh += (day.directSelfConsumedKwh + day.batteryDeliveredKwh) * dayCount;
      year.exportedKwh += day.exportedKwh * dayCount;
    });
    year.monthlyProductionKwh.push(monthProduction);
    year.monthlyConsumptionKwh.push(monthConsumption);
  });

  return year;
};

export interface BatteryNeed {
  eveningNightKwhPerDay: number;
  surplusKwhPerDay: number;
}

export const batteryNeed = (powerKwc: number, productionPerKwc: number[][], loads: number[][]): BatteryNeed => {
  const daysPerYear = sum(daysPerMonth);
  const totals = daysPerMonth.reduce(
    (accumulated, days, month) =>
      loads[month].reduce((monthSum, load, hour) => {
        const produced = productionPerKwc[month][hour] * powerKwc;
        return {
          eveningNight: monthSum.eveningNight + Math.max(0, load - produced) * days,
          surplus: monthSum.surplus + Math.max(0, produced - load) * days,
        };
      }, accumulated),
    { eveningNight: 0, surplus: 0 },
  );
  return { eveningNightKwhPerDay: totals.eveningNight / daysPerYear, surplusKwhPerDay: totals.surplus / daysPerYear };
};

export const recommendBatteryKwh = (need: BatteryNeed, parameters: SolarEstimateParameters = solarEstimateParameters): number => {
  const ascending = [...parameters.batteryModulesKwh].sort((left, right) => left - right);
  const limit = Math.min(need.eveningNightKwhPerDay, need.surplusKwhPerDay);
  return ascending.filter((module) => module <= limit + floatTolerance).at(-1) ?? ascending[0];
};

export const batteryOptionsKwh = (parameters: SolarEstimateParameters = solarEstimateParameters): number[] => [
  0,
  ...[...parameters.batteryModulesKwh].sort((left, right) => left - right),
];

export const clampBatteryKwh = (batteryKwh: number, parameters: SolarEstimateParameters = solarEstimateParameters): number =>
  batteryOptionsKwh(parameters).reduce((closest, option) => (Math.abs(option - batteryKwh) < Math.abs(closest - batteryKwh) ? option : closest));

export const powersFittingRoof = (roof: RoofInput, parameters: SolarEstimateParameters = solarEstimateParameters): number[] => {
  const ascending = [...parameters.offeredPowersKwc].sort((left, right) => left - right);
  const fitting = ascending.filter((power) => power * parameters.squareMetersPerKwc <= roof.areaM2 + floatTolerance);
  return fitting.length > 0 ? fitting : ascending.slice(0, 1);
};

export const recommendPowerKwc = (
  roof: RoofInput,
  annualConsumption: number,
  parameters: SolarEstimateParameters = solarEstimateParameters,
): number => {
  const fitting = powersFittingRoof(roof, parameters);
  const coveringKwc = annualConsumption / (parameters.sizingYieldKwhPerKwc * parameters.orientationCoefficients[tiltOf(roof)][roof.orientation]);
  return fitting.reduce((closest, power) => (Math.abs(power - coveringKwc) < Math.abs(closest - coveringKwc) - floatTolerance ? power : closest));
};

export const panelCountRange = (roof: RoofInput, parameters: SolarEstimateParameters = solarEstimateParameters): PanelCountRange => {
  const roofCapacity = Math.floor(roof.areaM2 / (parameters.squareMetersPerKwc * parameters.panelPowerKwc) + floatTolerance);
  const offerCapacity = Math.round(Math.max(...parameters.offeredPowersKwc) / parameters.panelPowerKwc);
  return { min: parameters.minimumPanelCount, max: Math.max(parameters.minimumPanelCount, Math.min(roofCapacity, offerCapacity)) };
};

export const clampPanelCount = (panelCount: number, range: PanelCountRange): number => Math.min(Math.max(Math.round(panelCount), range.min), range.max);

interface InstallationSizing {
  loads: number[][];
  productionPerKwc: number[][];
  recommendedKwc: number;
  recommendedPanelCount: number;
  panelCount: number;
  panelChoice: SizingChoice;
  installedKwc: number;
  recommendedBatteryKwh: number;
  batteryKwh: number;
  batteryChoice: SizingChoice;
}

const sizeInstallation = (input: SolarEstimateInput, parameters: SolarEstimateParameters): InstallationSizing => {
  const loads = householdDailyLoadsKwh(input.consumption, parameters);
  const productionPerKwc = dailyProductionPerKwc(input.roof.orientation, parameters, tiltOf(input.roof), input.shading ?? Shading.NONE);
  const recommendedKwc = recommendPowerKwc(input.roof, annualConsumptionKwh(input.consumption, parameters), parameters);
  const recommendedPanelCount = roundToStep(recommendedKwc / parameters.panelPowerKwc, 1);
  const chosenPanelCount = input.panelCount ?? null;
  const panelCount = chosenPanelCount === null ? recommendedPanelCount : clampPanelCount(chosenPanelCount, panelCountRange(input.roof, parameters));
  const installedKwc = roundToStep(panelCount * parameters.panelPowerKwc, parameters.panelPowerKwc);
  const recommendedBatteryKwh = recommendBatteryKwh(batteryNeed(installedKwc, productionPerKwc, loads), parameters);
  const chosenBatteryKwh = input.batteryKwh ?? null;
  return {
    loads,
    productionPerKwc,
    recommendedKwc,
    recommendedPanelCount,
    panelCount,
    panelChoice: chosenPanelCount === null ? SizingChoice.RECOMMENDED : SizingChoice.CUSTOM,
    installedKwc,
    recommendedBatteryKwh,
    batteryKwh: chosenBatteryKwh === null ? recommendedBatteryKwh : clampBatteryKwh(chosenBatteryKwh, parameters),
    batteryChoice: chosenBatteryKwh === null ? SizingChoice.RECOMMENDED : SizingChoice.CUSTOM,
  };
};

export const estimateSolarInstallation = (
  input: SolarEstimateInput,
  parameters: SolarEstimateParameters = solarEstimateParameters,
): SolarEstimate => {
  const sizing = sizeInstallation(input, parameters);
  const year = simulateYear(sizing.installedKwc, sizing.batteryKwh, sizing.productionPerKwc, sizing.loads, parameters);
  const withoutBattery = sizing.batteryKwh === 0 ? year : simulateYear(sizing.installedKwc, 0, sizing.productionPerKwc, sizing.loads, parameters);
  const productionKwh = sum(year.monthlyProductionKwh);
  const autonomyOf = (energy: YearEnergy) => (energy.consumptionKwh > 0 ? roundToStep((energy.selfConsumedKwh / energy.consumptionKwh) * 100, 1) : 0);
  const savingsOf = (energy: YearEnergy) => roundToStep(energy.selfConsumedKwh * parameters.kwhPriceEur, 10);

  return {
    recommendedKwc: sizing.recommendedKwc,
    recommendedPanelCount: sizing.recommendedPanelCount,
    installedKwc: sizing.installedKwc,
    panelCount: sizing.panelCount,
    panelChoice: sizing.panelChoice,
    recommendedBatteryKwh: sizing.recommendedBatteryKwh,
    batteryKwh: sizing.batteryKwh,
    batteryChoice: sizing.batteryChoice,
    annualProductionKwh: roundToStep(productionKwh, 10),
    monthlyProductionKwh: year.monthlyProductionKwh.map((month) => roundToStep(month, 1)),
    annualConsumptionKwh: roundToStep(year.consumptionKwh, 10),
    monthlyConsumptionKwh: year.monthlyConsumptionKwh.map((month) => roundToStep(month, 1)),
    selfConsumedKwh: roundToStep(year.selfConsumedKwh, 10),
    selfConsumptionPercent: productionKwh > 0 ? roundToStep((year.selfConsumedKwh / productionKwh) * 100, 1) : 0,
    autonomyPercent: autonomyOf(year),
    annualSavingsEur: savingsOf(year),
    surplusKwh: roundToStep(year.exportedKwh, 10),
    surplusValueEur: roundToStep(year.exportedKwh * parameters.surplusBuyBackEurPerKwh, 1),
    withoutBattery: {
      selfConsumedKwh: roundToStep(withoutBattery.selfConsumedKwh, 10),
      autonomyPercent: autonomyOf(withoutBattery),
      annualSavingsEur: savingsOf(withoutBattery),
    },
  };
};

export interface TypicalDay {
  productionKwh: number[];
  consumptionKwh: number[];
  selfConsumedKwh: number[];
  batteryLevelKwh: number[];
  exportedKwh: number[];
  importedKwh: number[];
}

const roundHundredth = (value: number) => Math.round(value * 100) / 100;

export const typicalDayOf = (
  input: SolarEstimateInput,
  monthIndex: number,
  parameters: SolarEstimateParameters = solarEstimateParameters,
): TypicalDay => {
  const sizing = sizeInstallation(input, parameters);
  const production = sizing.productionPerKwc[monthIndex].map((kwh) => kwh * sizing.installedKwc);
  const hours = simulateDayHours(production, sizing.loads[monthIndex], batteryOf(sizing.batteryKwh, parameters));
  return {
    productionKwh: hours.productionKwh.map(roundHundredth),
    consumptionKwh: hours.consumptionKwh.map(roundHundredth),
    selfConsumedKwh: hours.directSelfConsumedKwh.map((direct, hour) => roundHundredth(direct + hours.batteryDeliveredKwh[hour])),
    batteryLevelKwh: hours.batteryLevelKwh.map(roundHundredth),
    exportedKwh: hours.exportedKwh.map(roundHundredth),
    importedKwh: hours.importedKwh.map(roundHundredth),
  };
};

export const cumulativeSavingsEur = (annualSavingsEur: number, projection: SavingsProjection): number[] => {
  let total = 0;
  return Array.from({ length: projection.years }, (_, year) => {
    total += annualSavingsEur * (1 + projection.priceTrendPercent / 100) ** year * (1 - projection.degradationPercent / 100) ** year;
    return roundToStep(total, 10);
  });
};
