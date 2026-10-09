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

const warmUpDays = 2;

const emptyDay = (): DayEnergy => ({
  productionKwh: 0,
  consumptionKwh: 0,
  directSelfConsumedKwh: 0,
  batteryDeliveredKwh: 0,
  exportedKwh: 0,
  importedKwh: 0,
});

export const simulateDay = (productionKwh: number[], consumptionKwh: number[], battery: Battery): DayEnergy => {
  let stored = 0;
  let day = emptyDay();

  for (let run = 0; run <= warmUpDays; run++) {
    day = emptyDay();
    productionKwh.forEach((produced, hour) => {
      const consumed = consumptionKwh[hour];
      const direct = Math.min(produced, consumed);
      const surplus = produced - direct;
      const deficit = consumed - direct;
      const charged = Math.min(surplus, battery.capacityKwh - stored, battery.maxPowerKw);
      const delivered = Math.min(deficit, stored * battery.roundTripEfficiency, battery.maxPowerKw);
      stored += charged - delivered / battery.roundTripEfficiency;
      day.productionKwh += produced;
      day.consumptionKwh += consumed;
      day.directSelfConsumedKwh += direct;
      day.batteryDeliveredKwh += delivered;
      day.exportedKwh += surplus - charged;
      day.importedKwh += deficit - delivered;
    });
  }

  return day;
};
