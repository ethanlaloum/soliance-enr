import { describe, expect, it } from 'vitest';
import {
  annualConsumptionFromBillKwh,
  DaytimePresence,
  estimateSolarInstallation,
  HouseholdEquipment,
  batteryNeed,
  dailyProductionPerKwc,
  householdDailyLoadsKwh,
  powersFittingRoof,
  recommendBatteryKwh,
  recommendPowerKwc,
  RoofOrientation,
  solarEstimateParameters,
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
      panelCount: 12,
      recommendedBatteryKwh: 10,
      annualProductionKwh: 7800,
      monthlyProductionKwh: [429, 507, 663, 741, 819, 858, 897, 819, 663, 546, 429, 429],
      annualConsumptionKwh: 8640,
      selfConsumedKwh: 5000,
      autonomyPercent: 58,
      annualSavingsEur: 1250,
      surplusKwh: 2540,
      surplusValueEur: 25,
    });
  });

  it('keeps 3 kWc on a 25 m² roof even for a large bill', () => {
    expect(
      estimateSolarInstallation({ roof: { areaM2: 25, orientation: RoofOrientation.SOUTH }, consumption: { ...referenceHousehold, monthlyBillEur: 400 } }),
    ).toEqual({
      recommendedKwc: 3,
      panelCount: 6,
      recommendedBatteryKwh: 5,
      annualProductionKwh: 3900,
      monthlyProductionKwh: [215, 254, 332, 371, 410, 429, 449, 410, 332, 273, 215, 215],
      annualConsumptionKwh: 19200,
      selfConsumedKwh: 3740,
      autonomyPercent: 19,
      annualSavingsEur: 930,
      surplusKwh: 120,
      surplusValueEur: 1,
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
      panelCount: 24,
      recommendedBatteryKwh: 15,
      annualProductionKwh: 13260,
      monthlyProductionKwh: [729, 862, 1127, 1260, 1392, 1459, 1525, 1392, 1127, 928, 729, 729],
      annualConsumptionKwh: 19200,
      selfConsumedKwh: 9460,
      autonomyPercent: 49,
      annualSavingsEur: 2360,
      surplusKwh: 3470,
      surplusValueEur: 35,
    });
  });

  it('chooses the cheapest installation and reports no autonomy and no savings when nothing is consumed', () => {
    expect(
      estimateSolarInstallation({ roof: { areaM2: 45, orientation: RoofOrientation.SOUTH }, consumption: { ...referenceHousehold, monthlyBillEur: 0 } }),
    ).toEqual({
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
    expect(production).toEqual([7800, 7410, 6630]);
  });
});
