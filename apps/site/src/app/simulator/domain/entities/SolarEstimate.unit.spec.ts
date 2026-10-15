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
  billComparisonOf,
  clampBatteryKwh,
  clampPanelCount,
  clampRoofArea,
  cumulativeSavingsEur,
  dailyProductionPerKwc,
  householdDailyLoadsKwh,
  panelCountRange,
  roofPanelCapacity,
  recommendBatteryKwh,
  recommendInstallation,
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
  it('takes the 260 € subscription off twelve monthly bills, then divides by the kWh price', () => {
    expect([annualConsumptionFromBillKwh(180), annualConsumptionFromBillKwh(20), annualConsumptionFromBillKwh(0)]).toEqual([9047.619047619048, 0, 0]);
  });

  it('spreads the yearly consumption over the months, a bit more in winter', () => {
    const loads = householdDailyLoadsKwh(referenceHousehold);
    expect([monthlyTotals(loads), yearTotal(loads)]).toEqual([
      [889, 828, 782, 728, 690, 659, 659, 644, 690, 751, 828, 897],
      9048,
    ]);
  });

  it('puts electric heating in winter and the pool in summer', () => {
    expect([
      monthlyTotals(householdDailyLoadsKwh({ ...referenceHousehold, equipment: [HouseholdEquipment.ELECTRIC_HEATING] })),
      monthlyTotals(householdDailyLoadsKwh({ ...referenceHousehold, equipment: [HouseholdEquipment.POOL] })),
    ]).toEqual([
      [1025, 939, 866, 749, 626, 546, 528, 515, 589, 730, 903, 1032],
      [804, 750, 732, 717, 727, 743, 765, 751, 738, 737, 761, 822],
    ]);
  });

  it('caps the equipment at 70 % of the consumption when every piece is ticked', () => {
    const loads = householdDailyLoadsKwh({ ...referenceHousehold, equipment: [...Object.values(HouseholdEquipment)] });
    expect(yearTotal(loads)).toEqual(9048);
  });
});

describe('Recommended installation', () => {
  const southProduction = dailyProductionPerKwc(RoofOrientation.SOUTH);
  const householdOf = (monthlyBillEur: number, equipment: HouseholdEquipment[] = []) =>
    householdDailyLoadsKwh({ monthlyBillEur, equipment, daytimePresence: DaytimePresence.MOSTLY_ABSENT });
  const sizedFor = (monthlyBillEur: number, equipment: HouseholdEquipment[]) => {
    const estimate = estimateSolarInstallation({
      roof: { areaM2: 45, orientation: RoofOrientation.SOUTH },
      consumption: { monthlyBillEur, equipment, daytimePresence: DaytimePresence.MOSTLY_ABSENT },
    });
    return [estimate.panelCount, estimate.batteryKwh, estimate.autonomyPercent];
  };

  it('sizes the panels to produce 6 % more than the yearly consumption, then picks the smallest battery that covers 70 % of it', () => {
    expect([recommendInstallation(southProduction, householdOf(80)), recommendInstallation(southProduction, householdOf(120)), recommendInstallation(southProduction, householdOf(180))]).toEqual([
      { panelCount: 6, batteryKwh: 5.1, reachesSavingsTarget: true },
      { panelCount: 10, batteryKwh: 10.2, reachesSavingsTarget: true },
      { panelCount: 15, batteryKwh: 15.3, reachesSavingsTarget: true },
    ]);
  });

  it('keeps the same panels when a pool or air conditioning moves part of the same bill to sunny hours, and lowers only the battery', () => {
    expect([
      recommendInstallation(southProduction, householdOf(180)),
      recommendInstallation(southProduction, householdOf(180, [HouseholdEquipment.POOL])),
      recommendInstallation(southProduction, householdOf(180, [HouseholdEquipment.AIR_CONDITIONING])),
    ]).toEqual([
      { panelCount: 15, batteryKwh: 15.3, reachesSavingsTarget: true },
      { panelCount: 15, batteryKwh: 10.2, reachesSavingsTarget: true },
      { panelCount: 15, batteryKwh: 10.2, reachesSavingsTarget: true },
    ]);
  });

  it('keeps the same panels and asks for a bigger battery when an electric car charges at night', () => {
    expect([recommendInstallation(southProduction, householdOf(230)), recommendInstallation(southProduction, householdOf(230, [HouseholdEquipment.ELECTRIC_VEHICLE]))]).toEqual([
      { panelCount: 20, batteryKwh: 15.3, reachesSavingsTarget: true },
      { panelCount: 20, batteryKwh: 20.4, reachesSavingsTarget: true },
    ]);
  });

  it('adds panels with the battery the visitor chose until they stop helping, 5.1 kWh staying below 70 %', () => {
    expect([recommendInstallation(southProduction, householdOf(180), 5.1), recommendInstallation(southProduction, householdOf(180), 15.3)]).toEqual([
      { panelCount: 17, batteryKwh: 5.1, reachesSavingsTarget: false },
      { panelCount: 15, batteryKwh: 15.3, reachesSavingsTarget: true },
    ]);
  });

  it('adds battery modules, then panels, until a large night-time consumer reaches 70 %', () => {
    expect([sizedFor(400, [HouseholdEquipment.ELECTRIC_VEHICLE]), sizedFor(600, [...Object.values(HouseholdEquipment)])]).toEqual([
      [36, 30.6, 72],
      [68, 30.6, 72],
    ]);
  });

  it('never lowers the panels when a pool joins an electric car on the same bill', () => {
    expect([sizedFor(400, [HouseholdEquipment.ELECTRIC_VEHICLE]), sizedFor(400, [HouseholdEquipment.ELECTRIC_VEHICLE, HouseholdEquipment.POOL])]).toEqual([
      [36, 30.6, 72],
      [36, 25.5, 72],
    ]);
  });

  it('reports 70 % out of reach when nothing is consumed or when the visitor removes the battery', () => {
    expect([recommendInstallation(southProduction, householdOf(0)), recommendInstallation(southProduction, householdOf(180), 0)]).toEqual([
      { panelCount: 6, batteryKwh: 0, reachesSavingsTarget: false },
      { panelCount: 15, batteryKwh: 0, reachesSavingsTarget: false },
    ]);
  });
});

describe('Recommended battery', () => {
  it('rounds the evening and night need down to a Solax module, within the daily surplus', () => {
    expect([
      recommendBatteryKwh({ eveningNightKwhPerDay: 14.2, surplusKwhPerDay: 9.8 }),
      recommendBatteryKwh({ eveningNightKwhPerDay: 14.2, surplusKwhPerDay: 20 }),
      recommendBatteryKwh({ eveningNightKwhPerDay: 16, surplusKwhPerDay: 20 }),
      recommendBatteryKwh({ eveningNightKwhPerDay: 3, surplusKwhPerDay: 2 }),
    ]).toEqual([5.1, 10.2, 15.3, 5.1]);
  });

  it('measures the need left after the panels and the surplus they leave, per average day', () => {
    const need = batteryNeed(6, dailyProductionPerKwc(RoofOrientation.SOUTH), householdDailyLoadsKwh(referenceHousehold));
    expect([Number(need.eveningNightKwhPerDay.toFixed(1)), Number(need.surplusKwhPerDay.toFixed(1))]).toEqual([16.6, 13.2]);
  });
});

describe('Solar installation estimate', () => {
  it('sizes the reference household on a south roof of 45 m² at 7.5 kWc, with the 15.3 kWh battery that covers 70 %', () => {
    expect(estimateSolarInstallation({ roof: { areaM2: 45, orientation: RoofOrientation.SOUTH }, consumption: referenceHousehold })).toEqual({
      recommendedKwc: 7.5,
      recommendedPanelCount: 15,
      installedKwc: 7.5,
      panelCount: 15,
      panelChoice: SizingChoice.RECOMMENDED,
      recommendedBatteryKwh: 15.3,
      batteryKwh: 15.3,
      batteryChoice: SizingChoice.RECOMMENDED,
      annualProductionKwh: 9750,
      monthlyProductionKwh: [536, 634, 829, 926, 1024, 1073, 1121, 1024, 829, 683, 536, 536],
      annualConsumptionKwh: 9050,
      monthlyConsumptionKwh: [889, 828, 782, 728, 690, 659, 659, 644, 690, 751, 828, 897],
      selfConsumedKwh: 7070,
      selfConsumptionPercent: 72,
      autonomyPercent: 78,
      annualSavingsEur: 1480,
      surplusKwh: 2560,
      surplusValueEur: 28,
      reachesSavingsTarget: true,
      withoutBattery: { selfConsumedKwh: 3040, autonomyPercent: 34, annualSavingsEur: 640 },
    });
  });

  it('sizes 18 kWc for a 400 € bill beyond a 25 m² roof, with the 25.5 kWh battery that covers 70 %', () => {
    expect(
      estimateSolarInstallation({ roof: { areaM2: 25, orientation: RoofOrientation.SOUTH }, consumption: { ...referenceHousehold, monthlyBillEur: 400 } }),
    ).toEqual({
      recommendedKwc: 18,
      recommendedPanelCount: 36,
      installedKwc: 18,
      panelCount: 36,
      panelChoice: SizingChoice.RECOMMENDED,
      recommendedBatteryKwh: 25.5,
      batteryKwh: 25.5,
      batteryChoice: SizingChoice.RECOMMENDED,
      annualProductionKwh: 23400,
      monthlyProductionKwh: [1287, 1521, 1989, 2223, 2457, 2574, 2691, 2457, 1989, 1638, 1287, 1287],
      annualConsumptionKwh: 21620,
      monthlyConsumptionKwh: [2125, 1979, 1869, 1741, 1649, 1576, 1576, 1539, 1649, 1795, 1979, 2144],
      selfConsumedKwh: 15290,
      selfConsumptionPercent: 65,
      autonomyPercent: 71,
      annualSavingsEur: 3210,
      surplusKwh: 7860,
      surplusValueEur: 86,
      reachesSavingsTarget: true,
      withoutBattery: { selfConsumedKwh: 7280, autonomyPercent: 34, annualSavingsEur: 1530 },
    });
  });

  it('sizes a large home with heating, pool and an electric car on a big east / west roof at 23 kWc and 20.4 kWh, covering 71 %', () => {
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
      recommendedKwc: 23,
      recommendedPanelCount: 46,
      installedKwc: 23,
      panelCount: 46,
      panelChoice: SizingChoice.RECOMMENDED,
      recommendedBatteryKwh: 20.4,
      batteryKwh: 20.4,
      batteryChoice: SizingChoice.RECOMMENDED,
      annualProductionKwh: 23380,
      monthlyProductionKwh: [1286, 1520, 1987, 2221, 2455, 2572, 2689, 2455, 1987, 1637, 1286, 1286],
      annualConsumptionKwh: 21620,
      monthlyConsumptionKwh: [2182, 2024, 1935, 1774, 1614, 1550, 1558, 1540, 1551, 1713, 1961, 2217],
      selfConsumedKwh: 15350,
      selfConsumptionPercent: 66,
      autonomyPercent: 71,
      annualSavingsEur: 3220,
      surplusKwh: 7850,
      surplusValueEur: 86,
      reachesSavingsTarget: true,
      withoutBattery: { selfConsumedKwh: 9250, autonomyPercent: 43, annualSavingsEur: 1940 },
    });
  });

  it('chooses the smallest installation without a battery and reports no autonomy, no savings and no target reached when nothing is consumed', () => {
    expect(
      estimateSolarInstallation({ roof: { areaM2: 45, orientation: RoofOrientation.SOUTH }, consumption: { ...referenceHousehold, monthlyBillEur: 0 } }),
    ).toEqual({
      recommendedKwc: 3,
      recommendedPanelCount: 6,
      installedKwc: 3,
      panelCount: 6,
      panelChoice: SizingChoice.RECOMMENDED,
      recommendedBatteryKwh: 0,
      batteryKwh: 0,
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
      surplusValueEur: 43,
      reachesSavingsTarget: false,
      withoutBattery: { selfConsumedKwh: 0, autonomyPercent: 0, annualSavingsEur: 0 },
    });
  });

  it('saves more with more sunshine for the same household and the same roof', () => {
    const savings = [900, 1100, 1300, 1500].map(
      (specificYieldKwhPerKwc) =>
        estimateSolarInstallation(
          { roof: { areaM2: 45, orientation: RoofOrientation.SOUTH }, consumption: referenceHousehold, panelCount: 12, batteryKwh: 10.2 },
          { ...solarEstimateParameters, specificYieldKwhPerKwc },
        ).annualSavingsEur,
    );
    expect(savings).toEqual([1010, 1130, 1210, 1280]);
  });

  it('produces less on an east / west roof than on a south roof of the same power', () => {
    const production = [RoofOrientation.SOUTH, RoofOrientation.SOUTH_EAST, RoofOrientation.EAST_WEST].map(
      (orientation) => estimateSolarInstallation({ roof: { areaM2: 30, orientation }, consumption: referenceHousehold, panelCount: 12 }).annualProductionKwh,
    );
    expect(production).toEqual([7800, 7320, 6100]);
  });
});

describe('Chosen number of panels', () => {
  it('rounds a typed roof area to a whole square metre, raises it to 20 m² and never caps it', () => {
    expect([clampRoofArea(44.6), clampRoofArea(8), clampRoofArea(120), clampRoofArea(850)]).toEqual([45, 20, 120, 850]);
  });

  it('counts the panels the roof surface holds, beyond the 12 kWc offer too', () => {
    expect([
      roofPanelCapacity({ areaM2: 20, orientation: RoofOrientation.SOUTH }),
      roofPanelCapacity({ areaM2: 45, orientation: RoofOrientation.SOUTH }),
      roofPanelCapacity({ areaM2: 120, orientation: RoofOrientation.EAST_WEST }),
      roofPanelCapacity({ areaM2: 400, orientation: RoofOrientation.SOUTH }),
    ]).toEqual([8, 18, 48, 160]);
  });

  it('spans the panel slider from 6 panels to what the roof holds', () => {
    expect([
      panelCountRange({ areaM2: 20, orientation: RoofOrientation.SOUTH }),
      panelCountRange({ areaM2: 45, orientation: RoofOrientation.SOUTH }),
      panelCountRange({ areaM2: 120, orientation: RoofOrientation.EAST_WEST }),
    ]).toEqual([
      { min: 6, max: 8 },
      { min: 6, max: 18 },
      { min: 6, max: 48 },
    ]);
  });

  it('rounds a chosen count to a whole panel, raises it to 6 and never caps it', () => {
    expect([clampPanelCount(7.4), clampPanelCount(2), clampPanelCount(30), clampPanelCount(250)]).toEqual([7, 6, 30, 250]);
  });

  it('simulates as many panels as the visitor asks for, beyond the 12 kWc offer', () => {
    expect(
      estimateSolarInstallation({ roof: { areaM2: 45, orientation: RoofOrientation.SOUTH }, consumption: referenceHousehold, panelCount: 60 }),
    ).toEqual({
      recommendedKwc: 7.5,
      recommendedPanelCount: 15,
      installedKwc: 30,
      panelCount: 60,
      panelChoice: SizingChoice.CUSTOM,
      recommendedBatteryKwh: 10.2,
      batteryKwh: 10.2,
      batteryChoice: SizingChoice.RECOMMENDED,
      annualProductionKwh: 39000,
      monthlyProductionKwh: [2145, 2535, 3315, 3705, 4095, 4290, 4485, 4095, 3315, 2730, 2145, 2145],
      annualConsumptionKwh: 9050,
      monthlyConsumptionKwh: [889, 828, 782, 728, 690, 659, 659, 644, 690, 751, 828, 897],
      selfConsumedKwh: 7280,
      selfConsumptionPercent: 19,
      autonomyPercent: 80,
      annualSavingsEur: 1530,
      surplusKwh: 31610,
      surplusValueEur: 348,
      reachesSavingsTarget: true,
      withoutBattery: { selfConsumedKwh: 3690, autonomyPercent: 41, annualSavingsEur: 770 },
    });
  });

  it('simulates the chosen panels while still giving the recommended power', () => {
    expect(
      estimateSolarInstallation({ roof: { areaM2: 45, orientation: RoofOrientation.SOUTH }, consumption: referenceHousehold, panelCount: 8 }),
    ).toEqual({
      recommendedKwc: 7.5,
      recommendedPanelCount: 15,
      installedKwc: 4,
      panelCount: 8,
      panelChoice: SizingChoice.CUSTOM,
      recommendedBatteryKwh: 5.1,
      batteryKwh: 5.1,
      batteryChoice: SizingChoice.RECOMMENDED,
      annualProductionKwh: 5200,
      monthlyProductionKwh: [286, 338, 442, 494, 546, 572, 598, 546, 442, 364, 286, 286],
      annualConsumptionKwh: 9050,
      monthlyConsumptionKwh: [889, 828, 782, 728, 690, 659, 659, 644, 690, 751, 828, 897],
      selfConsumedKwh: 3970,
      selfConsumptionPercent: 76,
      autonomyPercent: 44,
      annualSavingsEur: 830,
      surplusKwh: 1190,
      surplusValueEur: 13,
      reachesSavingsTarget: true,
      withoutBattery: { selfConsumedKwh: 2650, autonomyPercent: 29, annualSavingsEur: 560 },
    });
  });

  it('keeps a chosen count after the roof shrinks, and simulates every chosen panel', () => {
    expect(
      estimateSolarInstallation({ roof: { areaM2: 20, orientation: RoofOrientation.SOUTH }, consumption: referenceHousehold, panelCount: 18 }),
    ).toEqual({
      recommendedKwc: 7.5,
      recommendedPanelCount: 15,
      installedKwc: 9,
      panelCount: 18,
      panelChoice: SizingChoice.CUSTOM,
      recommendedBatteryKwh: 10.2,
      batteryKwh: 10.2,
      batteryChoice: SizingChoice.RECOMMENDED,
      annualProductionKwh: 11700,
      monthlyProductionKwh: [644, 761, 995, 1112, 1229, 1287, 1346, 1229, 995, 819, 644, 644],
      annualConsumptionKwh: 9050,
      monthlyConsumptionKwh: [889, 828, 782, 728, 690, 659, 659, 644, 690, 751, 828, 897],
      selfConsumedKwh: 6530,
      selfConsumptionPercent: 56,
      autonomyPercent: 72,
      annualSavingsEur: 1370,
      surplusKwh: 5060,
      surplusValueEur: 56,
      reachesSavingsTarget: true,
      withoutBattery: { selfConsumedKwh: 3140, autonomyPercent: 35, annualSavingsEur: 660 },
    });
  });
});

const south45 = { areaM2: 45, orientation: RoofOrientation.SOUTH };

describe('Roof tilt and shading', () => {
  it('follows the PVGIS ratios of Nice for a 15°, 30° and 45° south roof', () => {
    const production = [RoofTilt.LOW, RoofTilt.CLASSIC, RoofTilt.STEEP].map(
      (tilt) => estimateSolarInstallation({ roof: { ...south45, tilt }, consumption: referenceHousehold, panelCount: 12 }).annualProductionKwh,
    );
    expect(production).toEqual([7320, 7800, 7850]);
  });

  it('takes 5 % off for light shading and 15 % for strong shading', () => {
    const production = [Shading.NONE, Shading.LIGHT, Shading.STRONG].map(
      (shading) => estimateSolarInstallation({ roof: south45, consumption: referenceHousehold, panelCount: 12, shading }).annualProductionKwh,
    );
    expect(production).toEqual([7800, 7410, 6630]);
  });
});

describe('Chosen battery', () => {
  it('offers no battery or one of the Solax modules, snapping any other size to the closest option', () => {
    expect([batteryOptionsKwh(), clampBatteryKwh(7), clampBatteryKwh(13), clampBatteryKwh(40), clampBatteryKwh(1)]).toEqual([
      [0, 5.1, 10.2, 15.3, 20.4, 25.5, 30.6, 35.7, 40.8],
      5.1,
      15.3,
      40.8,
      0,
    ]);
  });

  it('simulates the installation without a battery when the visitor removes it', () => {
    expect(estimateSolarInstallation({ roof: south45, consumption: referenceHousehold, batteryKwh: 0 })).toEqual({
      recommendedKwc: 7.5,
      recommendedPanelCount: 15,
      installedKwc: 7.5,
      panelCount: 15,
      panelChoice: SizingChoice.RECOMMENDED,
      recommendedBatteryKwh: 15.3,
      batteryKwh: 0,
      batteryChoice: SizingChoice.CUSTOM,
      annualProductionKwh: 9750,
      monthlyProductionKwh: [536, 634, 829, 926, 1024, 1073, 1121, 1024, 829, 683, 536, 536],
      annualConsumptionKwh: 9050,
      monthlyConsumptionKwh: [889, 828, 782, 728, 690, 659, 659, 644, 690, 751, 828, 897],
      selfConsumedKwh: 3040,
      selfConsumptionPercent: 31,
      autonomyPercent: 34,
      annualSavingsEur: 640,
      surplusKwh: 6710,
      surplusValueEur: 74,
      reachesSavingsTarget: false,
      withoutBattery: { selfConsumedKwh: 3040, autonomyPercent: 34, annualSavingsEur: 640 },
    });
  });
});

describe('Detailed consumption', () => {
  it('sizes on the yearly consumption the visitor enters instead of the bill, to cover 70 %', () => {
    const estimate = estimateSolarInstallation({ roof: south45, consumption: { ...referenceHousehold, annualKwh: 5000 } });
    expect([estimate.recommendedKwc, estimate.annualConsumptionKwh, estimate.autonomyPercent, estimate.annualSavingsEur]).toEqual([4.5, 5000, 83, 870]);
  });

  it('self-consumes more when the electric car charges in the daytime than at night', () => {
    const household = { ...referenceHousehold, equipment: [HouseholdEquipment.ELECTRIC_VEHICLE], evKmPerYear: 15000 };
    const results = [EvCharging.NIGHT, EvCharging.MIXED, EvCharging.DAYTIME].map((evCharging) => {
      const estimate = estimateSolarInstallation({ roof: south45, consumption: { ...household, evCharging }, panelCount: 12, batteryKwh: 0 });
      return [estimate.selfConsumedKwh, estimate.autonomyPercent, estimate.annualSavingsEur];
    });
    expect(results).toEqual([
      [2240, 25, 470],
      [3580, 40, 750],
      [4510, 50, 950],
    ]);
  });
});

describe('Bill before and after', () => {
  it('takes the yearly savings off the yearly bill, subscription included, per month and as a share of the bill', () => {
    expect([
      billComparisonOf({ annualConsumptionKwh: 8640, annualSavingsEur: 1540 }, 0.25),
      billComparisonOf({ annualConsumptionKwh: 0, annualSavingsEur: 0 }, 0.25),
    ]).toEqual([
      { beforeEur: 2420, afterEur: 880, savedEur: 1540, savedPerMonthEur: 128, savedPercent: 64 },
      { beforeEur: 0, afterEur: 0, savedEur: 0, savedPerMonthEur: 0, savedPercent: 0 },
    ]);
  });
});

describe('Typical day and long-term savings', () => {
  it('traces an average July day hour by hour, the battery filling at noon and covering the evening', () => {
    expect(typicalDayOf({ roof: south45, consumption: referenceHousehold, panelCount: 12, batteryKwh: 10.2 }, 6)).toEqual({
      productionKwh: [0, 0, 0, 0, 0, 0, 0.01, 0.26, 0.99, 1.82, 2.59, 3.22, 3.62, 3.76, 3.63, 3.24, 2.62, 1.85, 1.02, 0.28, 0.01, 0, 0, 0],
      consumptionKwh: [0.65, 0.58, 0.55, 0.55, 0.55, 0.6, 0.83, 1.15, 1.06, 0.74, 0.65, 0.65, 0.69, 0.67, 0.62, 0.65, 0.79, 1.11, 1.48, 1.66, 1.62, 1.43, 1.15, 0.83],
      selfConsumedKwh: [
        0.65,
        0.58,
        0.55,
        0.55,
        0.55,
        0.15,
        0.01,
        0.26,
        0.99,
        0.74,
        0.65,
        0.65,
        0.69,
        0.67,
        0.62,
        0.65,
        0.79,
        1.11,
        1.48,
        1.66,
        1.62,
        1.43,
        1.15,
        0.83,
      ],
      batteryLevelKwh: [2.47, 1.87, 1.3, 0.73, 0.16, 0, 0, 0, 0, 1.08, 3.03, 5.6, 8.52, 10.2, 10.2, 10.2, 10.2, 10.2, 9.73, 8.31, 6.66, 5.18, 3.99, 3.13],
      exportedKwh: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1.41, 3.01, 2.59, 1.84, 0.74, 0, 0, 0, 0, 0, 0],
      importedKwh: [0, 0, 0, 0, 0, 0.45, 0.82, 0.89, 0.07, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    });
  });

  it('adds up the yearly savings with the electricity price trend and the panel ageing', () => {
    expect(cumulativeSavingsEur(1250, { years: 5, priceTrendPercent: 2, degradationPercent: 0.5 })).toEqual([1250, 2520, 3810, 5110, 6440]);
  });

  it('keeps the yearly savings flat with no price trend and no ageing', () => {
    expect(cumulativeSavingsEur(1000, { years: 3, priceTrendPercent: 0, degradationPercent: 0 })).toEqual([1000, 2000, 3000]);
  });
});
