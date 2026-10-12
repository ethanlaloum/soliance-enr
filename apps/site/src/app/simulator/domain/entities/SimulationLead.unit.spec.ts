import { describe, expect, it } from 'vitest';
import { DaytimePresence, EvCharging, HouseholdEquipment, RoofOrientation, RoofTilt, Shading, SizingChoice, SolarEstimate } from '@/app/simulator/domain/entities/SolarEstimate';
import { RoofCovering, SimulatorAnswers, SunshineScope } from '@/app/simulator/domain/entities/SimulatorWizard';
import { buildSimulationLeadFields } from '@/app/simulator/domain/entities/SimulationLead';

const answers: SimulatorAnswers = {
  address: '12 avenue des Oliviers, Cagnes-sur-Mer',
  postalCode: '06800',
  location: { latitude: 43.6638, longitude: 7.1488 },
  city: 'Cagnes-sur-Mer',
  roofAreaM2: 45,
  orientation: RoofOrientation.SOUTH,
  roofCovering: RoofCovering.TILES,
  panelCount: null,
  monthlyBill: '180,50 €',
  equipment: [HouseholdEquipment.ELECTRIC_HEATING, HouseholdEquipment.POOL],
  daytimePresence: DaytimePresence.MOSTLY_ABSENT,
  roofTilt: RoofTilt.CLASSIC,
  batteryKwh: null,
  shading: Shading.NONE,
  annualConsumption: null,
  evKmPerYear: 13000,
  evCharging: EvCharging.NIGHT,
  kwhPriceEur: 0.25,
  priceTrendPercent: 2,
  projectionYears: 20,
};

const estimate: SolarEstimate = {
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
  annualConsumptionKwh: 8660,
  monthlyConsumptionKwh: [1067, 976, 890, 746, 644, 620, 663, 656, 655, 697, 913, 1082],
  selfConsumedKwh: 5730,
  selfConsumptionPercent: 73,
  autonomyPercent: 66,
  annualSavingsEur: 1430,
  surplusKwh: 1770,
  surplusValueEur: 18,
  withoutBattery: { selfConsumedKwh: 3940, autonomyPercent: 45, annualSavingsEur: 990 },
};

const sunshine = { scope: SunshineScope.COMMUNE, placeName: 'Cagnes-sur-Mer', yieldKwhPerKwc: 1504, peakMonthKwhPerKwc: 171 };

const contact = { email: 'marie.dupont@example.fr', phone: '06 12 34 56 78' };

describe('Simulation lead fields', () => {
  it('sends every answer and the estimate under snake_case names', () => {
    expect(buildSimulationLeadFields(answers, estimate, sunshine, contact)).toEqual({
      email: 'marie.dupont@example.fr',
      phone: '06 12 34 56 78',
      address: '12 avenue des Oliviers, Cagnes-sur-Mer',
      zip: '06800',
      roof_area_m2: '45',
      orientation: 'SOUTH',
      roof_tilt: 'CLASSIC',
      roof_covering: 'TILES',
      monthly_bill_eur: '180.5',
      equipment: 'ELECTRIC_HEATING;POOL',
      daytime_presence: 'MOSTLY_ABSENT',
      ev_km_per_year: null,
      ev_charging: null,
      annual_consumption_kwh: '8660',
      consumption_source: 'BILL',
      kwh_price_eur: '0.25',
      recommended_kwc: '6',
      installed_kwc: '6',
      panel_count: '12',
      panel_choice: 'RECOMMENDED',
      recommended_battery_kwh: '10',
      battery_kwh: '10',
      battery_choice: 'RECOMMENDED',
      shading: 'NONE',
      annual_production_kwh: '7800',
      self_consumed_kwh: '5730',
      autonomy_percent: '66',
      annual_savings_eur: '1430',
      solar_yield_kwh_kwc: '1504',
      solar_yield_source: 'COMMUNE',
    });
  });

  it('leaves the bill and the equipment empty when they were not given', () => {
    expect(buildSimulationLeadFields({ ...answers, monthlyBill: '', equipment: [] }, estimate, sunshine, contact)).toEqual({
      email: 'marie.dupont@example.fr',
      phone: '06 12 34 56 78',
      address: '12 avenue des Oliviers, Cagnes-sur-Mer',
      zip: '06800',
      roof_area_m2: '45',
      orientation: 'SOUTH',
      roof_tilt: 'CLASSIC',
      roof_covering: 'TILES',
      monthly_bill_eur: null,
      equipment: null,
      daytime_presence: 'MOSTLY_ABSENT',
      ev_km_per_year: null,
      ev_charging: null,
      annual_consumption_kwh: '8660',
      consumption_source: 'REFERENCE',
      kwh_price_eur: '0.25',
      recommended_kwc: '6',
      installed_kwc: '6',
      panel_count: '12',
      panel_choice: 'RECOMMENDED',
      recommended_battery_kwh: '10',
      battery_kwh: '10',
      battery_choice: 'RECOMMENDED',
      shading: 'NONE',
      annual_production_kwh: '7800',
      self_consumed_kwh: '5730',
      autonomy_percent: '66',
      annual_savings_eur: '1430',
      solar_yield_kwh_kwc: '1504',
      solar_yield_source: 'COMMUNE',
    });
  });

  it('adds the yearly mileage and the charging hours of the electric car when the visitor has one', () => {
    const fields = buildSimulationLeadFields(
      { ...answers, equipment: [HouseholdEquipment.ELECTRIC_VEHICLE], evKmPerYear: 18000, evCharging: EvCharging.DAYTIME },
      estimate,
      sunshine,
      contact,
    );
    expect([fields.equipment, fields.ev_km_per_year, fields.ev_charging]).toEqual(['ELECTRIC_VEHICLE', '18000', 'DAYTIME']);
  });

  it('sends the tilt of a flat roof as the low tilt of its mounting frames', () => {
    expect(buildSimulationLeadFields({ ...answers, roofCovering: RoofCovering.FLAT_ROOF, roofTilt: RoofTilt.STEEP }, estimate, sunshine, contact).roof_tilt).toEqual('LOW');
  });
});
