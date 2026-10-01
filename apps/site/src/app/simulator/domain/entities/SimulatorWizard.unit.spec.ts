import { describe, expect, it } from 'vitest';
import { DaytimePresence, HouseholdEquipment, RoofOrientation } from '@/app/simulator/domain/entities/SolarEstimate';
import {
  initialSimulatorAnswers,
  nextSimulatorStep,
  parseMonthlyBill,
  previewSolarEstimate,
  previousSimulatorStep,
  RoofCovering,
  SimulatorAnswers,
  SimulatorFieldError,
  SimulatorStep,
  simulatorStepNumber,
  toggleEquipment,
  validateSimulatorStep,
} from '@/app/simulator/domain/entities/SimulatorWizard';

const completedAnswers: SimulatorAnswers = {
  address: '12 avenue des Oliviers, Cagnes-sur-Mer',
  postalCode: '06800',
  roofAreaM2: 45,
  orientation: RoofOrientation.SOUTH,
  roofCovering: RoofCovering.TILES,
  monthlyBill: '180 €',
  equipment: [HouseholdEquipment.ELECTRIC_HEATING, HouseholdEquipment.POOL],
  daytimePresence: DaytimePresence.MOSTLY_ABSENT,
};

const referenceEstimateOnSouthRoofOf45 = {
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
};

describe('Monthly bill parsing', () => {
  it('reads amounts typed with a currency sign, spaces or a decimal comma', () => {
    expect([parseMonthlyBill('180 €'), parseMonthlyBill('180€'), parseMonthlyBill('1 200'), parseMonthlyBill('180,50'), parseMonthlyBill(' 95.5 ')]).toEqual([
      180, 180, 1200, 180.5, 95.5,
    ]);
  });

  it('accepts the bounds and rejects amounts outside them', () => {
    expect([parseMonthlyBill('19'), parseMonthlyBill('20'), parseMonthlyBill('2000'), parseMonthlyBill('2001')]).toEqual([null, 20, 2000, null]);
  });

  it('rejects empty or malformed amounts', () => {
    expect([parseMonthlyBill(''), parseMonthlyBill('abc'), parseMonthlyBill('12.345'), parseMonthlyBill('-150')]).toEqual([null, null, null, null]);
  });
});

describe('Simulator step validation', () => {
  it('requires the address and a five-digit postal code on the first step', () => {
    expect(validateSimulatorStep(SimulatorStep.ADDRESS, initialSimulatorAnswers)).toEqual({
      address: SimulatorFieldError.ADDRESS_REQUIRED,
      postalCode: SimulatorFieldError.POSTAL_CODE_INVALID,
    });
  });

  it('accepts a trimmed postal code and rejects one of four digits', () => {
    expect([
      validateSimulatorStep(SimulatorStep.ADDRESS, { ...completedAnswers, postalCode: ' 06800 ' }),
      validateSimulatorStep(SimulatorStep.ADDRESS, { ...completedAnswers, postalCode: '0680' }),
      validateSimulatorStep(SimulatorStep.ADDRESS, { ...completedAnswers, address: '  ab ' }),
    ]).toEqual([{}, { postalCode: SimulatorFieldError.POSTAL_CODE_INVALID }, { address: SimulatorFieldError.ADDRESS_REQUIRED }]);
  });

  it('asks nothing more on the roof step', () => {
    expect(validateSimulatorStep(SimulatorStep.ROOF, completedAnswers)).toEqual({});
  });

  it('requires a valid monthly bill on the consumption step and re-checks the earlier answers', () => {
    expect([
      validateSimulatorStep(SimulatorStep.CONSUMPTION, { ...completedAnswers, monthlyBill: '' }),
      validateSimulatorStep(SimulatorStep.CONSUMPTION, { ...completedAnswers, address: '', monthlyBill: '5' }),
      validateSimulatorStep(SimulatorStep.CONSUMPTION, completedAnswers),
    ]).toEqual([
      { monthlyBill: SimulatorFieldError.MONTHLY_BILL_INVALID },
      { address: SimulatorFieldError.ADDRESS_REQUIRED, monthlyBill: SimulatorFieldError.MONTHLY_BILL_INVALID },
      {},
    ]);
  });
});

describe('Simulator step navigation', () => {
  it('numbers the four steps', () => {
    expect([SimulatorStep.ADDRESS, SimulatorStep.ROOF, SimulatorStep.CONSUMPTION, SimulatorStep.RESULT].map(simulatorStepNumber)).toEqual([1, 2, 3, 4]);
  });

  it('moves forward and stops on the result', () => {
    expect([SimulatorStep.ADDRESS, SimulatorStep.ROOF, SimulatorStep.CONSUMPTION, SimulatorStep.RESULT].map(nextSimulatorStep)).toEqual([
      SimulatorStep.ROOF,
      SimulatorStep.CONSUMPTION,
      SimulatorStep.RESULT,
      SimulatorStep.RESULT,
    ]);
  });

  it('moves back and stops on the address', () => {
    expect([SimulatorStep.ADDRESS, SimulatorStep.ROOF, SimulatorStep.CONSUMPTION, SimulatorStep.RESULT].map(previousSimulatorStep)).toEqual([
      SimulatorStep.ADDRESS,
      SimulatorStep.ADDRESS,
      SimulatorStep.ROOF,
      SimulatorStep.CONSUMPTION,
    ]);
  });
});

describe('Equipment selection', () => {
  it('adds an item in the canonical order and removes a selected one', () => {
    expect([
      toggleEquipment([HouseholdEquipment.ELECTRIC_VEHICLE], HouseholdEquipment.ELECTRIC_HEATING),
      toggleEquipment([HouseholdEquipment.ELECTRIC_HEATING, HouseholdEquipment.POOL], HouseholdEquipment.ELECTRIC_HEATING),
    ]).toEqual([[HouseholdEquipment.ELECTRIC_HEATING, HouseholdEquipment.ELECTRIC_VEHICLE], [HouseholdEquipment.POOL]]);
  });
});

describe('Estimate preview', () => {
  it('shows nothing while only the address is known', () => {
    expect(previewSolarEstimate(completedAnswers, SimulatorStep.ADDRESS)).toEqual(null);
  });

  it('uses the reference household on the roof step, whatever the consumption answers', () => {
    expect(previewSolarEstimate({ ...completedAnswers, monthlyBill: '400', daytimePresence: DaytimePresence.PRESENT }, SimulatorStep.ROOF)).toEqual({
      estimate: referenceEstimateOnSouthRoofOf45,
      referenceMonthlyBillEur: 180,
    });
  });

  it('uses the reference bill with the chosen equipment and presence while the bill is not valid yet', () => {
    expect(
      previewSolarEstimate(
        { ...completedAnswers, monthlyBill: '', equipment: [HouseholdEquipment.AIR_CONDITIONING], daytimePresence: DaytimePresence.PRESENT },
        SimulatorStep.CONSUMPTION,
      ),
    ).toEqual({
      estimate: {
        recommendedKwc: 6,
        panelCount: 12,
        recommendedBatteryKwh: 5,
        annualProductionKwh: 7800,
        monthlyProductionKwh: [429, 507, 663, 741, 819, 858, 897, 819, 663, 546, 429, 429],
        annualConsumptionKwh: 8640,
        selfConsumedKwh: 6100,
        autonomyPercent: 71,
        annualSavingsEur: 1530,
        surplusKwh: 1550,
        surplusValueEur: 15,
      },
      referenceMonthlyBillEur: 180,
    });
  });

  it('uses every answer once the bill is valid', () => {
    expect([
      previewSolarEstimate({ ...completedAnswers, monthlyBill: '250', equipment: [], daytimePresence: DaytimePresence.PRESENT }, SimulatorStep.CONSUMPTION),
      previewSolarEstimate(completedAnswers, SimulatorStep.RESULT),
    ]).toEqual([
      {
        estimate: {
          recommendedKwc: 9,
          panelCount: 18,
          recommendedBatteryKwh: 15,
          annualProductionKwh: 11700,
          monthlyProductionKwh: [644, 761, 995, 1112, 1229, 1287, 1346, 1229, 995, 819, 644, 644],
          annualConsumptionKwh: 12000,
          selfConsumedKwh: 10050,
          autonomyPercent: 84,
          annualSavingsEur: 2510,
          surplusKwh: 1200,
          surplusValueEur: 12,
        },
        referenceMonthlyBillEur: null,
      },
      { estimate: referenceEstimateOnSouthRoofOf45, referenceMonthlyBillEur: null },
    ]);
  });
});
