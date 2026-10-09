import { LeadFields } from '@/app/lead/domain/entities/LeadSubmission';
import { SolarEstimate, SolarEstimateParameters, solarEstimateParameters } from '@/app/simulator/domain/entities/SolarEstimate';
import { LocalSunshine, parseMonthlyBill, SimulatorAnswers } from '@/app/simulator/domain/entities/SimulatorWizard';

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
  return {
    email: contact.email,
    phone: contact.phone,
    address: answers.address,
    zip: answers.postalCode,
    roof_area_m2: String(answers.roofAreaM2),
    orientation: answers.orientation,
    roof_covering: answers.roofCovering,
    monthly_bill_eur: monthlyBillEur === null ? null : String(monthlyBillEur),
    equipment: answers.equipment.length > 0 ? answers.equipment.join(equipmentSeparator) : null,
    daytime_presence: answers.daytimePresence,
    annual_consumption_kwh: String(estimate.annualConsumptionKwh),
    recommended_kwc: String(estimate.recommendedKwc),
    panel_count: String(estimate.panelCount),
    recommended_battery_kwh: String(estimate.recommendedBatteryKwh),
    annual_production_kwh: String(estimate.annualProductionKwh),
    self_consumed_kwh: String(estimate.selfConsumedKwh),
    autonomy_percent: String(estimate.autonomyPercent),
    annual_savings_eur: String(estimate.annualSavingsEur),
    solar_yield_kwh_kwc: String(sunshine.yieldKwhPerKwc),
    solar_yield_source: sunshine.scope,
  };
};
