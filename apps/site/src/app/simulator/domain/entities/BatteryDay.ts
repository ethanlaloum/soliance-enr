export interface Battery {
  capacityKwh: number;
  maxPowerKw: number;
  roundTripEfficiency: number;
}

export interface DayEnergy {
  productionKwh: number;
  consumptionKwh: number;
  directSelfConsumedKwh: number;
  batteryDeliveredKwh: number;
  exportedKwh: number;
  importedKwh: number;
}

export interface HourlyDayEnergy {
  productionKwh: number[];
  consumptionKwh: number[];
  directSelfConsumedKwh: number[];
  batteryDeliveredKwh: number[];
  batteryLevelKwh: number[];
  exportedKwh: number[];
  importedKwh: number[];
}

const warmUpDays = 2;

const emptyHours = (): HourlyDayEnergy => ({
  productionKwh: [],
  consumptionKwh: [],
  directSelfConsumedKwh: [],
  batteryDeliveredKwh: [],
  batteryLevelKwh: [],
  exportedKwh: [],
  importedKwh: [],
});

export const simulateDayHours = (productionKwh: number[], consumptionKwh: number[], battery: Battery): HourlyDayEnergy => {
  let stored = 0;
  let hours = emptyHours();

  for (let run = 0; run <= warmUpDays; run++) {
    hours = emptyHours();
    productionKwh.forEach((produced, hour) => {
      const consumed = consumptionKwh[hour];
      const direct = Math.min(produced, consumed);
      const surplus = produced - direct;
      const deficit = consumed - direct;
      const charged = Math.min(surplus, battery.capacityKwh - stored, battery.maxPowerKw);
      const delivered = Math.min(deficit, stored * battery.roundTripEfficiency, battery.maxPowerKw);
      stored += charged - delivered / battery.roundTripEfficiency;
      hours.productionKwh.push(produced);
      hours.consumptionKwh.push(consumed);
      hours.directSelfConsumedKwh.push(direct);
      hours.batteryDeliveredKwh.push(delivered);
      hours.batteryLevelKwh.push(stored);
      hours.exportedKwh.push(surplus - charged);
      hours.importedKwh.push(deficit - delivered);
    });
  }

  return hours;
};

const total = (values: number[]) => values.reduce((sum, value) => sum + value, 0);

export const simulateDay = (productionKwh: number[], consumptionKwh: number[], battery: Battery): DayEnergy => {
  const hours = simulateDayHours(productionKwh, consumptionKwh, battery);
  return {
    productionKwh: total(hours.productionKwh),
    consumptionKwh: total(hours.consumptionKwh),
    directSelfConsumedKwh: total(hours.directSelfConsumedKwh),
    batteryDeliveredKwh: total(hours.batteryDeliveredKwh),
    exportedKwh: total(hours.exportedKwh),
    importedKwh: total(hours.importedKwh),
  };
};
