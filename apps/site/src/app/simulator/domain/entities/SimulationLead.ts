import { LeadFields } from '@/app/lead/domain/entities/LeadSubmission';
import { HouseholdEquipment, SolarEstimate, SolarEstimateParameters, solarEstimateParameters } from '@/app/simulator/domain/entities/SolarEstimate';
import { consumptionSourceOf, effectiveRoofTilt, LocalSunshine, parseMonthlyBill, SimulatorAnswers } from '@/app/simulator/domain/entities/SimulatorWizard';

export interface SimulationContact {
  email: string;
  phone: string;
}

const equipmentSeparator = ';';

export const buildSimulationLeadFields = (
  answers: SimulatorAnswers,
  estimate: SolarEstimate,
  sunshine: LocalSunshine,
  contact: SimulationContact,
  parameters: SolarEstimateParameters = solarEstimateParameters,
): LeadFields => {
  const monthlyBillEur = parseMonthlyBill(answers.monthlyBill, parameters);
  const hasElectricVehicle = answers.equipment.includes(HouseholdEquipment.ELECTRIC_VEHICLE);
  return {
    email: contact.email,
    phone: contact.phone,
    address: answers.address,
    zip: answers.postalCode,
    roof_area_m2: String(answers.roofAreaM2),
    orientation: answers.orientation,
    roof_tilt: effectiveRoofTilt(answers),
    roof_covering: answers.roofCovering,
    monthly_bill_eur: monthlyBillEur === null ? null : String(monthlyBillEur),
    equipment: answers.equipment.length > 0 ? answers.equipment.join(equipmentSeparator) : null,
    daytime_presence: answers.daytimePresence,
    ev_km_per_year: hasElectricVehicle ? String(answers.evKmPerYear) : null,
    ev_charging: hasElectricVehicle ? answers.evCharging : null,
    annual_consumption_kwh: String(estimate.annualConsumptionKwh),
    consumption_source: consumptionSourceOf(answers, parameters),
    kwh_price_eur: String(answers.kwhPriceEur),
    recommended_kwc: String(estimate.recommendedKwc),
    installed_kwc: String(estimate.installedKwc),
    panel_count: String(estimate.panelCount),
    panel_choice: estimate.panelChoice,
    recommended_battery_kwh: String(estimate.recommendedBatteryKwh),
    battery_kwh: String(estimate.batteryKwh),
    battery_choice: estimate.batteryChoice,
    shading: answers.shading,
    annual_production_kwh: String(estimate.annualProductionKwh),
    self_consumed_kwh: String(estimate.selfConsumedKwh),
    autonomy_percent: String(estimate.autonomyPercent),
    annual_savings_eur: String(estimate.annualSavingsEur),
    solar_yield_kwh_kwc: String(sunshine.yieldKwhPerKwc),
    solar_yield_source: sunshine.scope,
  };
};
