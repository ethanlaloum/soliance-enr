import { describe, expect, it } from 'vitest';
import {
  annualConsumptionFromBillKwh,
  DaytimePresence,
  estimateSolarInstallation,
  EvCharging,
  HouseholdEquipment,
  SizingChoice,
  batteryNeed,
  batteryOptionsKwh,
  clampBatteryKwh,
  clampPanelCount,
  cumulativeSavingsEur,
  dailyProductionPerKwc,
  householdDailyLoadsKwh,
  panelCountRange,
  powersFittingRoof,
  recommendBatteryKwh,
  recommendPowerKwc,
  RoofOrientation,
  RoofTilt,
  Shading,
  solarEstimateParameters,
  typicalDayOf,
} from '@/app/simulator/domain/entities/SolarEstimate';
import { daysPerMonth } from '@/app/simulator/domain/entities/SolarGeometry';

const referenceHousehold = { monthlyBillEur: 180, equipment: [], daytimePresence: DaytimePresence.MOSTLY_ABSENT };

const monthlyKwh = (loads: number[][]) => loads.map((day, month) => day.reduce((total, hour) => total + hour, 0) * daysPerMonth[month]);
const monthlyTotals = (loads: number[][]) => monthlyKwh(loads).map(Math.round);
const yearTotal = (loads: number[][]) => Math.round(monthlyKwh(loads).reduce((total, month) => total + month, 0));

describe('Household consumption', () => {
  it('divides twelve monthly bills by the kWh price', () => {
    expect([annualConsumptionFromBillKwh(180), annualConsumptionFromBillKwh(0)]).toEqual([8640, 0]);
  });

  it('spreads the yearly consumption over the months, a bit more in winter', () => {
    const loads = householdDailyLoadsKwh(referenceHousehold);
    expect([monthlyTotals(loads), yearTotal(loads)]).toEqual([[849, 791, 747, 696, 659, 630, 630, 615, 659, 718, 791, 857], 8640]);
  });

  it('puts electric heating in winter and the pool in summer', () => {
    expect([
      monthlyTotals(householdDailyLoadsKwh({ ...referenceHousehold, equipment: [HouseholdEquipment.ELECTRIC_HEATING] })),
      monthlyTotals(householdDailyLoadsKwh({ ...referenceHousehold, equipment: [HouseholdEquipment.POOL] })),
    ]).toEqual([
      [1201, 1062, 897, 659, 465, 378, 378, 369, 430, 638, 958, 1205],
      [768, 717, 699, 685, 694, 710, 730, 718, 704, 704, 727, 785],
    ]);
  });

  it('caps the equipment at 70 % of the consumption when every piece is ticked', () => {
    const loads = householdDailyLoadsKwh({ ...referenceHousehold, equipment: [...Object.values(HouseholdEquipment)] });
    expect(yearTotal(loads)).toEqual(8640);
  });
});

describe('Roof capacity', () => {
  it('offers every power whose panels fit on the roof at 5 m² per kWc, and the smallest one otherwise', () => {
    expect([10, 29, 30, 45, 59, 60, 120].map((areaM2) => powersFittingRoof({ areaM2, orientation: RoofOrientation.SOUTH }))).toEqual([
      [3],
      [3],
      [3, 6],
      [3, 6, 9],
      [3, 6, 9],
      [3, 6, 9, 12],
      [3, 6, 9, 12],
    ]);
  });
});

describe('Recommended power', () => {
  it('picks the offer whose production at 1 400 kWh/kWc comes closest to the consumption, within the roof', () => {
    const southRoof = (areaM2: number) => ({ areaM2, orientation: RoofOrientation.SOUTH });
    expect([
      recommendPowerKwc(southRoof(45), 4800),
      recommendPowerKwc(southRoof(45), 8640),
      recommendPowerKwc(southRoof(45), 14400),
      recommendPowerKwc(southRoof(25), 14400),
      recommendPowerKwc(southRoof(120), 19200),
      recommendPowerKwc({ areaM2: 45, orientation: RoofOrientation.EAST_WEST }, 9000),
    ]).toEqual([3, 6, 9, 3, 12, 9]);
  });
});

describe('Recommended battery', () => {
  it('rounds the evening and night need down to a Solax module, within the daily surplus', () => {
    expect([
      recommendBatteryKwh({ eveningNightKwhPerDay: 14.2, surplusKwhPerDay: 9.8 }),
      recommendBatteryKwh({ eveningNightKwhPerDay: 14.2, surplusKwhPerDay: 20 }),
      recommendBatteryKwh({ eveningNightKwhPerDay: 16, surplusKwhPerDay: 20 }),
      recommendBatteryKwh({ eveningNightKwhPerDay: 3, surplusKwhPerDay: 2 }),
    ]).toEqual([5, 10, 15, 5]);
  });

  it('measures the need left after the panels and the surplus they leave, per average day', () => {
    const need = batteryNeed(6, dailyProductionPerKwc(RoofOrientation.SOUTH), householdDailyLoadsKwh(referenceHousehold));
    expect([Number(need.eveningNightKwhPerDay.toFixed(1)), Number(need.surplusKwhPerDay.toFixed(1))]).toEqual([15.8, 13.5]);
  });
});

describe('Solar installation estimate', () => {
  it('sizes the reference household on a south roof of 45 m² at 6 kWc and a 10 kWh battery', () => {
    expect(estimateSolarInstallation({ roof: { areaM2: 45, orientation: RoofOrientation.SOUTH }, consumption: referenceHousehold })).toEqual({
      recommendedKwc: 6,
      recommendedPanelCount: 12,
      installedKwc: 6,
      panelCount: 12,
      panelChoice: SizingChoice.RECOMMENDED,
      recommendedBatteryKwh: 10,
      batteryKwh: 10,
      batteryChoice: SizingChoice.RECOMMENDED,
      annualProductionKwh: 7800,
      monthlyProductionKwh: [429, 507, 663, 741, 819, 858, 897, 819, 663, 546, 429, 429],
      annualConsumptionKwh: 8640,
      monthlyConsumptionKwh: [849, 791, 747, 696, 659, 630, 630, 615, 659, 718, 791, 857],
      selfConsumedKwh: 5000,
      selfConsumptionPercent: 64,
      autonomyPercent: 58,
      annualSavingsEur: 1250,
      surplusKwh: 2540,
      surplusValueEur: 25,
      withoutBattery: { selfConsumedKwh: 2720, autonomyPercent: 31, annualSavingsEur: 680 },
    });
  });

  it('keeps 3 kWc on a 25 m² roof even for a large bill', () => {
    expect(
      estimateSolarInstallation({ roof: { areaM2: 25, orientation: RoofOrientation.SOUTH }, consumption: { ...referenceHousehold, monthlyBillEur: 400 } }),
    ).toEqual({
      recommendedKwc: 3,
      recommendedPanelCount: 6,
      installedKwc: 3,
      panelCount: 6,
      panelChoice: SizingChoice.RECOMMENDED,
      recommendedBatteryKwh: 5,
      batteryKwh: 5,
      batteryChoice: SizingChoice.RECOMMENDED,
      annualProductionKwh: 3900,
      monthlyProductionKwh: [215, 254, 332, 371, 410, 429, 449, 410, 332, 273, 215, 215],
      annualConsumptionKwh: 19200,
      monthlyConsumptionKwh: [1887, 1757, 1660, 1546, 1464, 1399, 1399, 1367, 1464, 1595, 1757, 1904],
      selfConsumedKwh: 3740,
      selfConsumptionPercent: 96,
      autonomyPercent: 19,
      annualSavingsEur: 930,
      surplusKwh: 120,
      surplusValueEur: 1,
      withoutBattery: { selfConsumedKwh: 3340, autonomyPercent: 17, annualSavingsEur: 840 },
    });
  });

  it('sizes a large home with heating, pool and an electric car on a big east / west roof', () => {
    expect(
      estimateSolarInstallation({
        roof: { areaM2: 120, orientation: RoofOrientation.EAST_WEST },
        consumption: {
          monthlyBillEur: 400,
          equipment: [HouseholdEquipment.ELECTRIC_HEATING, HouseholdEquipment.POOL, HouseholdEquipment.ELECTRIC_VEHICLE],
          daytimePresence: DaytimePresence.PRESENT,
        },
      }),
    ).toEqual({
      recommendedKwc: 12,
      recommendedPanelCount: 24,
      installedKwc: 12,
      panelCount: 24,
      panelChoice: SizingChoice.RECOMMENDED,
      recommendedBatteryKwh: 10,
      batteryKwh: 10,
      batteryChoice: SizingChoice.RECOMMENDED,
      annualProductionKwh: 12200,
      monthlyProductionKwh: [671, 793, 1037, 1159, 1281, 1342, 1403, 1281, 1037, 854, 671, 671],
      annualConsumptionKwh: 19200,
      monthlyConsumptionKwh: [2415, 2152, 1869, 1454, 1146, 1067, 1112, 1102, 1094, 1394, 1951, 2443],
      selfConsumedKwh: 8330,
      selfConsumptionPercent: 68,
      autonomyPercent: 43,
      annualSavingsEur: 2080,
      surplusKwh: 3640,
      surplusValueEur: 36,
      withoutBattery: { selfConsumedKwh: 6290, autonomyPercent: 33, annualSavingsEur: 1570 },
    });
  });

  it('chooses the cheapest installation and reports no autonomy and no savings when nothing is consumed', () => {
    expect(
      estimateSolarInstallation({ roof: { areaM2: 45, orientation: RoofOrientation.SOUTH }, consumption: { ...referenceHousehold, monthlyBillEur: 0 } }),
    ).toEqual({
      recommendedKwc: 3,
      recommendedPanelCount: 6,
      installedKwc: 3,
      panelCount: 6,
      panelChoice: SizingChoice.RECOMMENDED,
      recommendedBatteryKwh: 5,
      batteryKwh: 5,
      batteryChoice: SizingChoice.RECOMMENDED,
      annualProductionKwh: 3900,
      monthlyProductionKwh: [215, 254, 332, 371, 410, 429, 449, 410, 332, 273, 215, 215],
      annualConsumptionKwh: 0,
      monthlyConsumptionKwh: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      selfConsumedKwh: 0,
      selfConsumptionPercent: 0,
      autonomyPercent: 0,
      annualSavingsEur: 0,
      surplusKwh: 3900,
      surplusValueEur: 39,
      withoutBattery: { selfConsumedKwh: 0, autonomyPercent: 0, annualSavingsEur: 0 },
    });
  });

  it('saves more with more sunshine for the same household and the same roof', () => {
    const savings = [900, 1100, 1300, 1500].map(
      (specificYieldKwhPerKwc) =>
        estimateSolarInstallation(
          { roof: { areaM2: 45, orientation: RoofOrientation.SOUTH }, consumption: referenceHousehold },
          { ...solarEstimateParameters, specificYieldKwhPerKwc },
        ).annualSavingsEur,
    );
    expect(savings).toEqual([880, 1180, 1250, 1490]);
  });

  it('produces less on an east / west roof than on a south roof of the same power', () => {
    const production = [RoofOrientation.SOUTH, RoofOrientation.SOUTH_EAST, RoofOrientation.EAST_WEST].map(
      (orientation) => estimateSolarInstallation({ roof: { areaM2: 30, orientation }, consumption: referenceHousehold }).annualProductionKwh,
    );
    expect(production).toEqual([7800, 7320, 6100]);
  });
});

describe('Chosen number of panels', () => {
  it('lets the visitor choose from 6 panels up to what the roof holds, never beyond the 12 kWc offer', () => {
    expect([
      panelCountRange({ areaM2: 20, orientation: RoofOrientation.SOUTH }),
      panelCountRange({ areaM2: 45, orientation: RoofOrientation.SOUTH }),
      panelCountRange({ areaM2: 120, orientation: RoofOrientation.EAST_WEST }),
    ]).toEqual([
      { min: 6, max: 8 },
      { min: 6, max: 18 },
      { min: 6, max: 24 },
    ]);
  });

  it('rounds a chosen count to a whole panel and keeps it within the range', () => {
    expect([clampPanelCount(7.4, { min: 6, max: 18 }), clampPanelCount(2, { min: 6, max: 18 }), clampPanelCount(30, { min: 6, max: 18 })]).toEqual([7, 6, 18]);
  });

  it('simulates the chosen panels while still giving the recommended power', () => {
    expect(
      estimateSolarInstallation({ roof: { areaM2: 45, orientation: RoofOrientation.SOUTH }, consumption: referenceHousehold, panelCount: 8 }),
    ).toEqual({
      recommendedKwc: 6,
      recommendedPanelCount: 12,
      installedKwc: 4,
      panelCount: 8,
      panelChoice: SizingChoice.CUSTOM,
      recommendedBatteryKwh: 5,
      batteryKwh: 5,
      batteryChoice: SizingChoice.RECOMMENDED,
      annualProductionKwh: 5200,
      monthlyProductionKwh: [286, 338, 442, 494, 546, 572, 598, 546, 442, 364, 286, 286],
      annualConsumptionKwh: 8640,
      monthlyConsumptionKwh: [849, 791, 747, 696, 659, 630, 630, 615, 659, 718, 791, 857],
      selfConsumedKwh: 3490,
      selfConsumptionPercent: 67,
      autonomyPercent: 40,
      annualSavingsEur: 870,
      surplusKwh: 1590,
      surplusValueEur: 16,
      withoutBattery: { selfConsumedKwh: 2420, autonomyPercent: 28, annualSavingsEur: 610 },
    });
  });

  it('caps a chosen count that no longer fits after the roof shrinks, and simulates the capped installation', () => {
    expect(
      estimateSolarInstallation({ roof: { areaM2: 20, orientation: RoofOrientation.SOUTH }, consumption: referenceHousehold, panelCount: 18 }),
    ).toEqual({
      recommendedKwc: 3,
      recommendedPanelCount: 6,
      installedKwc: 4,
      panelCount: 8,
      panelChoice: SizingChoice.CUSTOM,
      recommendedBatteryKwh: 5,
      batteryKwh: 5,
      batteryChoice: SizingChoice.RECOMMENDED,
      annualProductionKwh: 5200,
      monthlyProductionKwh: [286, 338, 442, 494, 546, 572, 598, 546, 442, 364, 286, 286],
      annualConsumptionKwh: 8640,
      monthlyConsumptionKwh: [849, 791, 747, 696, 659, 630, 630, 615, 659, 718, 791, 857],
      selfConsumedKwh: 3490,
      selfConsumptionPercent: 67,
      autonomyPercent: 40,
      annualSavingsEur: 870,
      surplusKwh: 1590,
      surplusValueEur: 16,
      withoutBattery: { selfConsumedKwh: 2420, autonomyPercent: 28, annualSavingsEur: 610 },
    });
  });
});

const south45 = { areaM2: 45, orientation: RoofOrientation.SOUTH };

describe('Roof tilt and shading', () => {
  it('follows the PVGIS ratios of Nice for a 15°, 30° and 45° south roof', () => {
    const production = [RoofTilt.LOW, RoofTilt.CLASSIC, RoofTilt.STEEP].map(
      (tilt) => estimateSolarInstallation({ roof: { ...south45, tilt }, consumption: referenceHousehold }).annualProductionKwh,
    );
    expect(production).toEqual([7320, 7800, 7850]);
  });

  it('takes 5 % off for light shading and 15 % for strong shading', () => {
    const production = [Shading.NONE, Shading.LIGHT, Shading.STRONG].map(
      (shading) => estimateSolarInstallation({ roof: south45, consumption: referenceHousehold, shading }).annualProductionKwh,
    );
    expect(production).toEqual([7800, 7410, 6630]);
  });
});

describe('Chosen battery', () => {
  it('offers no battery or one of the Solax modules, snapping any other size to the closest option', () => {
    expect([batteryOptionsKwh(), clampBatteryKwh(7), clampBatteryKwh(13), clampBatteryKwh(40), clampBatteryKwh(1)]).toEqual([[0, 5, 10, 15], 5, 15, 15, 0]);
  });

  it('simulates the installation without a battery when the visitor removes it', () => {
    expect(estimateSolarInstallation({ roof: south45, consumption: referenceHousehold, batteryKwh: 0 })).toEqual({
      recommendedKwc: 6,
      recommendedPanelCount: 12,
      installedKwc: 6,
      panelCount: 12,
      panelChoice: SizingChoice.RECOMMENDED,
      recommendedBatteryKwh: 10,
      batteryKwh: 0,
      batteryChoice: SizingChoice.CUSTOM,
      annualProductionKwh: 7800,
      monthlyProductionKwh: [429, 507, 663, 741, 819, 858, 897, 819, 663, 546, 429, 429],
      annualConsumptionKwh: 8640,
      monthlyConsumptionKwh: [849, 791, 747, 696, 659, 630, 630, 615, 659, 718, 791, 857],
      selfConsumedKwh: 2720,
      selfConsumptionPercent: 35,
      autonomyPercent: 31,
      annualSavingsEur: 680,
      surplusKwh: 5080,
      surplusValueEur: 51,
      withoutBattery: { selfConsumedKwh: 2720, autonomyPercent: 31, annualSavingsEur: 680 },
    });
  });
});

describe('Detailed consumption', () => {
  it('sizes on the yearly consumption the visitor enters instead of the bill', () => {
    const estimate = estimateSolarInstallation({ roof: south45, consumption: { ...referenceHousehold, annualKwh: 5000 } });
    expect([estimate.recommendedKwc, estimate.annualConsumptionKwh, estimate.autonomyPercent, estimate.annualSavingsEur]).toEqual([3, 5000, 52, 650]);
  });

  it('self-consumes more when the electric car charges in the daytime than at night', () => {
    const household = { ...referenceHousehold, equipment: [HouseholdEquipment.ELECTRIC_VEHICLE], evKmPerYear: 15000 };
    const results = [EvCharging.NIGHT, EvCharging.MIXED, EvCharging.DAYTIME].map((evCharging) => {
      const estimate = estimateSolarInstallation({ roof: south45, consumption: { ...household, evCharging }, batteryKwh: 0 });
      return [estimate.selfConsumedKwh, estimate.autonomyPercent, estimate.annualSavingsEur];
    });
    expect(results).toEqual([
      [2070, 24, 520],
      [3290, 38, 820],
      [4050, 47, 1010],
    ]);
  });
});

describe('Typical day and long-term savings', () => {
  it('traces an average July day hour by hour, the battery filling at noon and covering the evening', () => {
    expect(typicalDayOf({ roof: south45, consumption: referenceHousehold }, 6)).toEqual({
      productionKwh: [0, 0, 0, 0, 0, 0, 0.01, 0.26, 0.99, 1.82, 2.59, 3.22, 3.62, 3.76, 3.63, 3.24, 2.62, 1.85, 1.02, 0.28, 0.01, 0, 0, 0],
      consumptionKwh: [0.62, 0.55, 0.53, 0.53, 0.53, 0.57, 0.79, 1.1, 1.01, 0.71, 0.62, 0.62, 0.66, 0.64, 0.6, 0.62, 0.75, 1.06, 1.41, 1.59, 1.54, 1.37, 1.1, 0.79],
      selfConsumedKwh: [0.62, 0.55, 0.53, 0.53, 0.29, 0, 0.01, 0.26, 0.99, 0.71, 0.62, 0.62, 0.66, 0.64, 0.6, 0.62, 0.75, 1.06, 1.41, 1.59, 1.54, 1.37, 1.1, 0.79],
      batteryLevelKwh: [2.11, 1.49, 0.91, 0.32, 0, 0, 0, 0, 0, 1.11, 3.09, 5.69, 8.64, 10, 10, 10, 10, 10, 9.57, 8.12, 6.42, 4.9, 3.68, 2.79],
      exportedKwh: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1.77, 3.03, 2.62, 1.87, 0.79, 0, 0, 0, 0, 0, 0],
      importedKwh: [0, 0, 0, 0, 0.24, 0.57, 0.78, 0.84, 0.03, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    });
  });

  it('adds up the yearly savings with the electricity price trend and the panel ageing', () => {
    expect(cumulativeSavingsEur(1250, { years: 5, priceTrendPercent: 2, degradationPercent: 0.5 })).toEqual([1250, 2520, 3810, 5110, 6440]);
  });

  it('keeps the yearly savings flat with no price trend and no ageing', () => {
    expect(cumulativeSavingsEur(1000, { years: 3, priceTrendPercent: 0, degradationPercent: 0 })).toEqual([1000, 2000, 3000]);
  });
});
