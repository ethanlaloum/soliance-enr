import { describe, expect, it } from 'vitest';
import {
  annualConsumptionFromBillKwh,
  daytimeConsumptionShare,
  DaytimePresence,
  estimateSolarInstallation,
  HouseholdEquipment,
  recommendBatteryKwh,
  recommendPowerKwc,
  RoofOrientation,
  solarEstimateParameters,
} from '@/app/simulator/domain/entities/SolarEstimate';

describe('Solar installation estimate', () => {
  it('sizes a south roof of 45 m² with a 180 € monthly bill at 6 kWc and a 10 kWh battery', () => {
    const estimate = estimateSolarInstallation({
      roof: { areaM2: 45, orientation: RoofOrientation.SOUTH },
      consumption: {
        monthlyBillEur: 180,
        equipment: [HouseholdEquipment.ELECTRIC_HEATING, HouseholdEquipment.POOL],
        daytimePresence: DaytimePresence.MOSTLY_ABSENT,
      },
    });

    expect(estimate).toEqual({
      recommendedKwc: 6,
      panelCount: 12,
      recommendedBatteryKwh: 10,
      annualProductionKwh: 7800,
      monthlyProductionKwh: [429, 507, 663, 741, 819, 858, 897, 819, 663, 546, 429, 429],
      annualConsumptionKwh: 8640,
      selfConsumedKwh: 5720,
      autonomyPercent: 66,
      annualSavingsEur: 1430,
      surplusKwh: 1780,
      surplusValueEur: 18,
    });
  });

  it('caps the power at the smallest offer on the smallest roof, with no surplus left for the battery', () => {
    const estimate = estimateSolarInstallation({
      roof: { areaM2: 20, orientation: RoofOrientation.SOUTH_WEST },
      consumption: {
        monthlyBillEur: 300,
        equipment: [HouseholdEquipment.AIR_CONDITIONING, HouseholdEquipment.ELECTRIC_VEHICLE],
        daytimePresence: DaytimePresence.PRESENT,
      },
    });

    expect(estimate).toEqual({
      recommendedKwc: 3,
      panelCount: 6,
      recommendedBatteryKwh: 5,
      annualProductionKwh: 3710,
      monthlyProductionKwh: [204, 241, 315, 352, 389, 408, 426, 389, 315, 259, 204, 204],
      annualConsumptionKwh: 14400,
      selfConsumedKwh: 3710,
      autonomyPercent: 26,
      annualSavingsEur: 930,
      surplusKwh: 0,
      surplusValueEur: 0,
    });
  });

  it('caps the power at the largest offer and the battery at the largest module on the largest roof', () => {
    const estimate = estimateSolarInstallation({
      roof: { areaM2: 120, orientation: RoofOrientation.SOUTH },
      consumption: { monthlyBillEur: 400, equipment: [], daytimePresence: DaytimePresence.MOSTLY_ABSENT },
    });

    expect(estimate).toEqual({
      recommendedKwc: 12,
      panelCount: 24,
      recommendedBatteryKwh: 15,
      annualProductionKwh: 15600,
      monthlyProductionKwh: [858, 1014, 1326, 1482, 1638, 1716, 1794, 1638, 1326, 1092, 858, 858],
      annualConsumptionKwh: 19200,
      selfConsumedKwh: 10770,
      autonomyPercent: 56,
      annualSavingsEur: 2690,
      surplusKwh: 4380,
      surplusValueEur: 44,
    });
  });

  it('keeps the smallest power and battery for the smallest bill and covers the whole consumption', () => {
    const estimate = estimateSolarInstallation({
      roof: { areaM2: 60, orientation: RoofOrientation.EAST_WEST },
      consumption: { monthlyBillEur: 20, equipment: [HouseholdEquipment.ELECTRIC_HEATING], daytimePresence: DaytimePresence.MOSTLY_ABSENT },
    });

    expect(estimate).toEqual({
      recommendedKwc: 3,
      panelCount: 6,
      recommendedBatteryKwh: 5,
      annualProductionKwh: 3320,
      monthlyProductionKwh: [182, 215, 282, 315, 348, 365, 381, 348, 282, 232, 182, 182],
      annualConsumptionKwh: 960,
      selfConsumedKwh: 960,
      autonomyPercent: 100,
      annualSavingsEur: 240,
      surplusKwh: 2280,
      surplusValueEur: 23,
    });
  });

  it('reports no autonomy and no savings when the bill is zero', () => {
    const estimate = estimateSolarInstallation({
      roof: { areaM2: 45, orientation: RoofOrientation.SOUTH },
      consumption: { monthlyBillEur: 0, equipment: [], daytimePresence: DaytimePresence.PRESENT },
    });

    expect(estimate).toEqual({
      recommendedKwc: 3,
      panelCount: 6,
      recommendedBatteryKwh: 5,
      annualProductionKwh: 3900,
      monthlyProductionKwh: [215, 254, 332, 371, 410, 429, 449, 410, 332, 273, 215, 215],
      annualConsumptionKwh: 0,
      selfConsumedKwh: 0,
      autonomyPercent: 0,
      annualSavingsEur: 0,
      surplusKwh: 3900,
      surplusValueEur: 39,
    });
  });
});

describe('Annual consumption from the monthly bill', () => {
  it('divides twelve monthly bills by the kWh price', () => {
    expect([annualConsumptionFromBillKwh(180), annualConsumptionFromBillKwh(162.5)]).toEqual([8640, 7800]);
  });
});

describe('Recommended power', () => {
  const largeConsumptionKwh = 100000;

  it('keeps 6 kWc when the consumption equals the production of 6 kWc, and drops to 3 kWc just below', () => {
    expect([
      recommendPowerKwc({ areaM2: 120, orientation: RoofOrientation.SOUTH }, 7800),
      recommendPowerKwc({ areaM2: 120, orientation: RoofOrientation.SOUTH }, 7799),
    ]).toEqual([6, 3]);
  });

  it('keeps 9 kWc on an east / west roof when the consumption equals its production', () => {
    expect(recommendPowerKwc({ areaM2: 120, orientation: RoofOrientation.EAST_WEST }, 9945)).toEqual(9);
  });

  it('fits 6 kWc on 30 m² but only 3 kWc on 29 m²', () => {
    expect([
      recommendPowerKwc({ areaM2: 30, orientation: RoofOrientation.SOUTH }, largeConsumptionKwh),
      recommendPowerKwc({ areaM2: 29, orientation: RoofOrientation.SOUTH }, largeConsumptionKwh),
    ]).toEqual([6, 3]);
  });

  it('fits 12 kWc from 60 m² and never exceeds it', () => {
    expect([
      recommendPowerKwc({ areaM2: 59, orientation: RoofOrientation.SOUTH }, largeConsumptionKwh),
      recommendPowerKwc({ areaM2: 60, orientation: RoofOrientation.SOUTH }, largeConsumptionKwh),
      recommendPowerKwc({ areaM2: 120, orientation: RoofOrientation.SOUTH }, largeConsumptionKwh),
    ]).toEqual([9, 12, 12]);
  });

  it('falls back to the smallest offer when neither the roof nor the consumption reaches it', () => {
    expect([
      recommendPowerKwc({ areaM2: 10, orientation: RoofOrientation.SOUTH }, largeConsumptionKwh),
      recommendPowerKwc({ areaM2: 120, orientation: RoofOrientation.SOUTH }, 1000),
    ]).toEqual([3, 3]);
  });
});

describe('Recommended battery', () => {
  it('rounds down to the Solax module that both the evening need and the daily surplus can fill', () => {
    expect([
      recommendBatteryKwh(20, 10),
      recommendBatteryKwh(10, 20),
      recommendBatteryKwh(20, 9.99),
      recommendBatteryKwh(15, 30),
      recommendBatteryKwh(14.99, 30),
    ]).toEqual([10, 10, 5, 15, 10]);
  });

  it('never goes below the smallest module nor above the largest one', () => {
    expect([recommendBatteryKwh(0, 12), recommendBatteryKwh(3, 0), recommendBatteryKwh(40, 40)]).toEqual([5, 5, 15]);
  });
});

describe('Daytime consumption share', () => {
  it('starts from the presence profile and shifts with each piece of equipment', () => {
    expect([
      daytimeConsumptionShare({ monthlyBillEur: 180, equipment: [], daytimePresence: DaytimePresence.MOSTLY_ABSENT }),
      daytimeConsumptionShare({ monthlyBillEur: 180, equipment: [], daytimePresence: DaytimePresence.PRESENT }),
      daytimeConsumptionShare({
        monthlyBillEur: 180,
        equipment: [HouseholdEquipment.ELECTRIC_HEATING, HouseholdEquipment.ELECTRIC_VEHICLE],
        daytimePresence: DaytimePresence.MOSTLY_ABSENT,
      }),
      daytimeConsumptionShare({
        monthlyBillEur: 180,
        equipment: [HouseholdEquipment.AIR_CONDITIONING, HouseholdEquipment.POOL],
        daytimePresence: DaytimePresence.PRESENT,
      }),
    ]).toEqual([0.35, 0.5, 0.25, 0.6]);
  });

  it('stays within the configured bounds', () => {
    const parameters = {
      ...solarEstimateParameters,
      equipmentDaytimeShareShifts: {
        ...solarEstimateParameters.equipmentDaytimeShareShifts,
        [HouseholdEquipment.ELECTRIC_HEATING]: -0.3,
        [HouseholdEquipment.POOL]: 0.3,
      },
    };

    expect([
      daytimeConsumptionShare(
        { monthlyBillEur: 180, equipment: [HouseholdEquipment.ELECTRIC_HEATING], daytimePresence: DaytimePresence.MOSTLY_ABSENT },
        parameters,
      ),
      daytimeConsumptionShare({ monthlyBillEur: 180, equipment: [HouseholdEquipment.POOL], daytimePresence: DaytimePresence.PRESENT }, parameters),
    ]).toEqual([0.2, 0.6]);
  });
});
