import { simulateDay } from '@/app/simulator/domain/entities/BatteryDay';
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

export interface HouseholdLoad {
  annualShare: number;
  monthlyWeights: number[];
  hourlyWeights: number[];
}

export interface ProductionDayType {
  productionFactor: number;
  weight: number;
}

export interface SolarEstimateParameters {
  roofAreaM2: { min: number; max: number; step: number };
  squareMetersPerKwc: number;
  panelPowerKwc: number;
  offeredPowersKwc: number[];
  batteryModulesKwh: number[];
  site: SolarSite;
  specificYieldKwhPerKwc: number;
  monthlyProductionShares: number[];
  panelTiltDegrees: number;
  orientationAzimuthsDegrees: Record<RoofOrientation, number[]>;
  orientationCoefficients: Record<RoofOrientation, number>;
  productionDayTypes: ProductionDayType[];
  kwhPriceEur: number;
  surplusBuyBackEurPerKwh: number;
  monthlyBillEur: { min: number; max: number };
  baseMonthlyWeights: number[];
  baseHourlyWeights: Record<DaytimePresence, number[]>;
  equipmentLoads: Record<HouseholdEquipment, HouseholdLoad>;
  maximumEquipmentShare: number;
  batteryRoundTripEfficiency: number;
  batteryPowerKwPerKwh: number;
  sizingYieldKwhPerKwc: number;
  referenceConsumption: ConsumptionInput;
}

export const solarEstimateParameters: SolarEstimateParameters = {
  roofAreaM2: { min: 20, max: 120, step: 5 },
  squareMetersPerKwc: 5,
  panelPowerKwc: 0.5,
  offeredPowersKwc: [3, 6, 9, 12],
  batteryModulesKwh: [5, 10, 15],
  site: { latitude: 43.6721, longitude: 7.1902 },
  specificYieldKwhPerKwc: 1300,
  monthlyProductionShares: [0.055, 0.065, 0.085, 0.095, 0.105, 0.11, 0.115, 0.105, 0.085, 0.07, 0.055, 0.055],
  panelTiltDegrees: 30,
  orientationAzimuthsDegrees: {
    [RoofOrientation.SOUTH]: [0],
    [RoofOrientation.SOUTH_EAST]: [-45],
    [RoofOrientation.SOUTH_WEST]: [45],
    [RoofOrientation.EAST_WEST]: [-90, 90],
  },
  orientationCoefficients: {
    [RoofOrientation.SOUTH]: 1,
    [RoofOrientation.SOUTH_EAST]: 0.95,
    [RoofOrientation.SOUTH_WEST]: 0.95,
    [RoofOrientation.EAST_WEST]: 0.85,
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
      hourlyWeights: [1, 1, 1, 1, 1, 0.5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.5, 1, 1, 1, 1, 1],
    },
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
};

const monthsPerYear = 12;
const floatTolerance = 1e-9;

const roundToStep = (value: number, step: number) => Math.round(Number((value / step).toFixed(6))) * step;

const normalize = (weights: number[]): number[] => {
  const sum = weights.reduce((total, weight) => total + weight, 0);
  return weights.map((weight) => (sum > 0 ? weight / sum : 0));
};

export const annualConsumptionFromBillKwh = (monthlyBillEur: number, parameters: SolarEstimateParameters = solarEstimateParameters): number =>
  (monthlyBillEur * monthsPerYear) / parameters.kwhPriceEur;

export const householdDailyLoadsKwh = (consumption: ConsumptionInput, parameters: SolarEstimateParameters = solarEstimateParameters): number[][] => {
  const annualKwh = annualConsumptionFromBillKwh(consumption.monthlyBillEur, parameters);
  const equipmentShare = consumption.equipment.reduce((total, item) => total + parameters.equipmentLoads[item].annualShare, 0);
  const equipmentScale = equipmentShare > parameters.maximumEquipmentShare ? parameters.maximumEquipmentShare / equipmentShare : 1;
  const loads: HouseholdLoad[] = [
    {
      annualShare: 1 - equipmentShare * equipmentScale,
      monthlyWeights: parameters.baseMonthlyWeights,
      hourlyWeights: parameters.baseHourlyWeights[consumption.daytimePresence],
    },
    ...consumption.equipment.map((item) => ({ ...parameters.equipmentLoads[item], annualShare: parameters.equipmentLoads[item].annualShare * equipmentScale })),
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

export const dailyProductionPerKwc = (orientation: RoofOrientation, parameters: SolarEstimateParameters = solarEstimateParameters): number[][] => {
  const shares = normalize(parameters.monthlyProductionShares);
  const coefficient = parameters.orientationCoefficients[orientation];
  return daysPerMonth.map((days, month) => {
    const dailyKwh = (parameters.specificYieldKwhPerKwc * shares[month] * coefficient) / days;
    return solarHourlyShape(parameters.site, month, parameters.panelTiltDegrees, parameters.orientationAzimuthsDegrees[orientation]).map(
      (share) => dailyKwh * share,
    );
  });
};

export interface YearEnergy {
  monthlyProductionKwh: number[];
  consumptionKwh: number;
  selfConsumedKwh: number;
  exportedKwh: number;
}

export const simulateYear = (
  powerKwc: number,
  batteryKwh: number,
  productionPerKwc: number[][],
  loads: number[][],
  parameters: SolarEstimateParameters = solarEstimateParameters,
): YearEnergy => {
  const battery = {
    capacityKwh: batteryKwh,
    maxPowerKw: batteryKwh * parameters.batteryPowerKwPerKwh,
    roundTripEfficiency: parameters.batteryRoundTripEfficiency,
  };
  const year: YearEnergy = { monthlyProductionKwh: [], consumptionKwh: 0, selfConsumedKwh: 0, exportedKwh: 0 };

  daysPerMonth.forEach((days, month) => {
    let monthProduction = 0;
    parameters.productionDayTypes.forEach(({ productionFactor, weight }) => {
      const production = productionPerKwc[month].map((kwh) => kwh * powerKwc * productionFactor);
      const day = simulateDay(production, loads[month], battery);
      const dayCount = days * weight;
      monthProduction += day.productionKwh * dayCount;
      year.consumptionKwh += day.consumptionKwh * dayCount;
      year.selfConsumedKwh += (day.directSelfConsumedKwh + day.batteryDeliveredKwh) * dayCount;
      year.exportedKwh += day.exportedKwh * dayCount;
    });
    year.monthlyProductionKwh.push(monthProduction);
  });

  return year;
};

export interface BatteryNeed {
  eveningNightKwhPerDay: number;
  surplusKwhPerDay: number;
}

export const batteryNeed = (powerKwc: number, productionPerKwc: number[][], loads: number[][]): BatteryNeed => {
  const daysPerYear = daysPerMonth.reduce((total, days) => total + days, 0);
  const totals = daysPerMonth.reduce(
    (sum, days, month) =>
      loads[month].reduce((monthSum, load, hour) => {
        const produced = productionPerKwc[month][hour] * powerKwc;
        return {
          eveningNight: monthSum.eveningNight + Math.max(0, load - produced) * days,
          surplus: monthSum.surplus + Math.max(0, produced - load) * days,
        };
      }, sum),
    { eveningNight: 0, surplus: 0 },
  );
  return { eveningNightKwhPerDay: totals.eveningNight / daysPerYear, surplusKwhPerDay: totals.surplus / daysPerYear };
};

export const recommendBatteryKwh = (need: BatteryNeed, parameters: SolarEstimateParameters = solarEstimateParameters): number => {
  const ascending = [...parameters.batteryModulesKwh].sort((left, right) => left - right);
  const limit = Math.min(need.eveningNightKwhPerDay, need.surplusKwhPerDay);
  return ascending.filter((module) => module <= limit + floatTolerance).at(-1) ?? ascending[0];
};

export const powersFittingRoof = (roof: RoofInput, parameters: SolarEstimateParameters = solarEstimateParameters): number[] => {
  const ascending = [...parameters.offeredPowersKwc].sort((left, right) => left - right);
  const fitting = ascending.filter((power) => power * parameters.squareMetersPerKwc <= roof.areaM2 + floatTolerance);
  return fitting.length > 0 ? fitting : ascending.slice(0, 1);
};

export const recommendPowerKwc = (
  roof: RoofInput,
  annualConsumptionKwh: number,
  parameters: SolarEstimateParameters = solarEstimateParameters,
): number => {
  const fitting = powersFittingRoof(roof, parameters);
  const coveringKwc = annualConsumptionKwh / (parameters.sizingYieldKwhPerKwc * parameters.orientationCoefficients[roof.orientation]);
  return fitting.reduce((closest, power) => (Math.abs(power - coveringKwc) < Math.abs(closest - coveringKwc) - floatTolerance ? power : closest));
};

export const estimateSolarInstallation = (
  input: SolarEstimateInput,
  parameters: SolarEstimateParameters = solarEstimateParameters,
): SolarEstimate => {
  const loads = householdDailyLoadsKwh(input.consumption, parameters);
  const productionPerKwc = dailyProductionPerKwc(input.roof.orientation, parameters);
  const powerKwc = recommendPowerKwc(input.roof, annualConsumptionFromBillKwh(input.consumption.monthlyBillEur, parameters), parameters);
  const batteryKwh = recommendBatteryKwh(batteryNeed(powerKwc, productionPerKwc, loads), parameters);
  const year = simulateYear(powerKwc, batteryKwh, productionPerKwc, loads, parameters);
  const productionKwh = year.monthlyProductionKwh.reduce((total, month) => total + month, 0);

  return {
    recommendedKwc: powerKwc,
    panelCount: roundToStep(powerKwc / parameters.panelPowerKwc, 1),
    recommendedBatteryKwh: batteryKwh,
    annualProductionKwh: roundToStep(productionKwh, 10),
    monthlyProductionKwh: year.monthlyProductionKwh.map((month) => roundToStep(month, 1)),
    annualConsumptionKwh: roundToStep(year.consumptionKwh, 10),
    selfConsumedKwh: roundToStep(year.selfConsumedKwh, 10),
    autonomyPercent: year.consumptionKwh > 0 ? roundToStep((year.selfConsumedKwh / year.consumptionKwh) * 100, 1) : 0,
    annualSavingsEur: roundToStep(year.selfConsumedKwh * parameters.kwhPriceEur, 10),
    surplusKwh: roundToStep(year.exportedKwh, 10),
    surplusValueEur: roundToStep(year.exportedKwh * parameters.surplusBuyBackEurPerKwh, 1),
  };
};
