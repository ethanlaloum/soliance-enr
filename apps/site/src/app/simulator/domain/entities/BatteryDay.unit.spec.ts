import { describe, expect, it } from 'vitest';
import { DayEnergy, simulateDay } from '@/app/simulator/domain/entities/BatteryDay';

const rounded = (day: DayEnergy): DayEnergy =>
  Object.fromEntries(Object.entries(day).map(([key, value]) => [key, Number(value.toFixed(4))])) as unknown as DayEnergy;

describe('Battery day simulation', () => {
  it('serves the load directly, stores the surplus within the power limit and returns it with the round-trip loss', () => {
    expect(rounded(simulateDay([0, 4, 0], [1, 1, 2], { capacityKwh: 2, maxPowerKw: 1, roundTripEfficiency: 0.9 }))).toEqual({
      productionKwh: 4,
      consumptionKwh: 4,
      directSelfConsumedKwh: 1,
      batteryDeliveredKwh: 0.9,
      exportedKwh: 2,
      importedKwh: 2.1,
    });
  });

  it('carries the charge left at midnight into the next day and reports the settled day', () => {
    expect(rounded(simulateDay([3, 0], [0, 1], { capacityKwh: 2, maxPowerKw: 2, roundTripEfficiency: 0.9 }))).toEqual({
      productionKwh: 3,
      consumptionKwh: 1,
      directSelfConsumedKwh: 0,
      batteryDeliveredKwh: 1,
      exportedKwh: 1.8889,
      importedKwh: 0,
    });
  });

  it('exports every surplus and imports every deficit without a battery', () => {
    expect(rounded(simulateDay([0, 5, 1], [2, 1, 3], { capacityKwh: 0, maxPowerKw: 0, roundTripEfficiency: 0.9 }))).toEqual({
      productionKwh: 6,
      consumptionKwh: 6,
      directSelfConsumedKwh: 2,
      batteryDeliveredKwh: 0,
      exportedKwh: 4,
      importedKwh: 4,
    });
  });
});
