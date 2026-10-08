import { describe, expect, it } from 'vitest';
import { DaytimePresence, HouseholdEquipment, RoofOrientation, SolarEstimate } from '@/app/simulator/domain/entities/SolarEstimate';
import { RoofCovering, SimulatorAnswers } from '@/app/simulator/domain/entities/SimulatorWizard';
import { buildSimulationLeadFields } from '@/app/simulator/domain/entities/SimulationLead';

const answers: SimulatorAnswers = {
  address: '12 avenue des Oliviers, Cagnes-sur-Mer',
  postalCode: '06800',
  location: { latitude: 43.6638, longitude: 7.1488 },
  roofAreaM2: 45,
  orientation: RoofOrientation.SOUTH,
  roofCovering: RoofCovering.TILES,
  monthlyBill: '180,50 €',
  equipment: [HouseholdEquipment.ELECTRIC_HEATING, HouseholdEquipment.POOL],
  daytimePresence: DaytimePresence.MOSTLY_ABSENT,
};

const estimate: SolarEstimate = {
  recommendedKwc: 6,
  panelCount: 12,
  recommendedBatteryKwh: 10,
  annualProductionKwh: 7800,
  monthlyProductionKwh: [429, 507, 663, 741, 819, 858, 897, 819, 663, 546, 429, 429],
  annualConsumptionKwh: 8660,
  selfConsumedKwh: 5730,
  autonomyPercent: 66,
  annualSavingsEur: 1430,
  surplusKwh: 1770,
  surplusValueEur: 18,
};

const contact = { email: 'marie.dupont@example.fr', phone: '06 12 34 56 78' };

describe('Simulation lead fields', () => {
  it('sends every answer and the estimate under snake_case names', () => {
    expect(buildSimulationLeadFields(answers, estimate, contact)).toEqual({
      email: 'marie.dupont@example.fr',
      phone: '06 12 34 56 78',
      address: '12 avenue des Oliviers, Cagnes-sur-Mer',
      zip: '06800',
      roof_area_m2: '45',
      orientation: 'SOUTH',
      roof_covering: 'TILES',
      monthly_bill_eur: '180.5',
      equipment: 'ELECTRIC_HEATING;POOL',
      daytime_presence: 'MOSTLY_ABSENT',
      annual_consumption_kwh: '8660',
      recommended_kwc: '6',
      panel_count: '12',
      recommended_battery_kwh: '10',
      annual_production_kwh: '7800',
      self_consumed_kwh: '5730',
      autonomy_percent: '66',
      annual_savings_eur: '1430',
    });
  });

  it('leaves the bill and the equipment empty when they were not given', () => {
    expect(buildSimulationLeadFields({ ...answers, monthlyBill: '', equipment: [] }, estimate, contact)).toEqual({
      email: 'marie.dupont@example.fr',
      phone: '06 12 34 56 78',
      address: '12 avenue des Oliviers, Cagnes-sur-Mer',
      zip: '06800',
      roof_area_m2: '45',
      orientation: 'SOUTH',
      roof_covering: 'TILES',
      monthly_bill_eur: null,
      equipment: null,
      daytime_presence: 'MOSTLY_ABSENT',
      annual_consumption_kwh: '8660',
      recommended_kwc: '6',
      panel_count: '12',
      recommended_battery_kwh: '10',
      annual_production_kwh: '7800',
      self_consumed_kwh: '5730',
      autonomy_percent: '66',
      annual_savings_eur: '1430',
    });
  });
});
