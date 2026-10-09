import { describe, expect, it } from 'vitest';
import { DepartmentSolarYield } from '@/app/simulator/domain/entities/DepartmentSolarYield';
import { DaytimePresence, HouseholdEquipment, RoofOrientation, solarEstimateParameters } from '@/app/simulator/domain/entities/SolarEstimate';
import {
  initialSimulatorAnswers,
  geocodedAnswersPatch,
  localSolarContext,
  nextSimulatorStep,
  parseMonthlyBill,
  previewSolarEstimate,
  previousSimulatorStep,
  RoofCovering,
  SimulatorAnswers,
  SimulatorFieldError,
  SimulatorStep,
  simulatorStepNumber,
  SunshineScope,
  toggleEquipment,
  validateSimulatorStep,
} from '@/app/simulator/domain/entities/SimulatorWizard';

const completedAnswers: SimulatorAnswers = {
  address: '12 avenue des Oliviers, Cagnes-sur-Mer',
  postalCode: '06800',
  location: { latitude: 43.6638, longitude: 7.1488 },
  city: 'Cagnes-sur-Mer',
  roofAreaM2: 45,
  orientation: RoofOrientation.SOUTH,
  roofCovering: RoofCovering.TILES,
  monthlyBill: '180 €',
  equipment: [HouseholdEquipment.ELECTRIC_HEATING, HouseholdEquipment.POOL],
  daytimePresence: DaytimePresence.MOSTLY_ABSENT,
};

const niceMonthlyYield = [86, 95, 130, 141, 155, 161, 173, 164, 136, 112, 85, 81];
const lilleMonthlyYield = [38, 56, 94, 123, 129, 130, 129, 116, 102, 73, 44, 34];
const cagnesYield = { yearlyKwhPerKwc: 1504, monthlyKwhPerKwc: [85, 94, 129, 141, 155, 160, 171, 162, 134, 110, 84, 80] };

const testYields: DepartmentSolarYield[] = [
  { code: '06', name: 'Alpes-Maritimes', referenceCity: 'Nice', location: { latitude: 43.7032, longitude: 7.2528 }, yieldKwhPerKwc: 1518, monthlyYieldKwhPerKwc: niceMonthlyYield },
  { code: '59', name: 'Nord', referenceCity: 'Lille', location: { latitude: 50.6311, longitude: 3.0468 }, yieldKwhPerKwc: 1067, monthlyYieldKwhPerKwc: lilleMonthlyYield },
];

const cagnesSunshine = { scope: SunshineScope.COMMUNE, placeName: 'Cagnes-sur-Mer', yieldKwhPerKwc: 1504, peakMonthKwhPerKwc: 171 };

const preview = (answers: SimulatorAnswers, step: SimulatorStep, communeYield: typeof cagnesYield | null = cagnesYield) =>
  previewSolarEstimate(answers, step, communeYield, solarEstimateParameters, testYields);

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
    expect(preview(completedAnswers, SimulatorStep.ADDRESS)).toEqual(null);
  });

  it('uses the reference household and the PVGIS yield of the commune on the roof step', () => {
    expect(preview({ ...completedAnswers, monthlyBill: '400', daytimePresence: DaytimePresence.PRESENT }, SimulatorStep.ROOF)).toEqual({
      estimate: {
        recommendedKwc: 6,
        panelCount: 12,
        recommendedBatteryKwh: 15,
        annualProductionKwh: 9020,
        monthlyProductionKwh: [510, 564, 773, 845, 929, 959, 1025, 971, 803, 660, 504, 480],
        annualConsumptionKwh: 8640,
        selfConsumedKwh: 5970,
        autonomyPercent: 69,
        annualSavingsEur: 1490,
        surplusKwh: 2700,
        surplusValueEur: 27,
      },
      referenceMonthlyBillEur: 180,
      sunshine: cagnesSunshine,
    });
  });

  it('uses the reference bill with the chosen equipment and presence while the bill is not valid yet', () => {
    expect(preview({ ...completedAnswers, monthlyBill: '' }, SimulatorStep.CONSUMPTION)).toEqual({
      estimate: {
        recommendedKwc: 6,
        panelCount: 12,
        recommendedBatteryKwh: 10,
        annualProductionKwh: 9020,
        monthlyProductionKwh: [510, 564, 773, 845, 929, 959, 1025, 971, 803, 660, 504, 480],
        annualConsumptionKwh: 8640,
        selfConsumedKwh: 5170,
        autonomyPercent: 60,
        annualSavingsEur: 1290,
        surplusKwh: 3640,
        surplusValueEur: 36,
      },
      referenceMonthlyBillEur: 180,
      sunshine: cagnesSunshine,
    });
  });

  it('uses every answer once the bill is valid', () => {
    expect(preview({ ...completedAnswers, monthlyBill: '300', equipment: [], daytimePresence: DaytimePresence.PRESENT }, SimulatorStep.RESULT)).toEqual({
      estimate: {
        recommendedKwc: 9,
        panelCount: 18,
        recommendedBatteryKwh: 15,
        annualProductionKwh: 13540,
        monthlyProductionKwh: [764, 845, 1160, 1268, 1394, 1439, 1538, 1457, 1205, 989, 755, 720],
        annualConsumptionKwh: 14400,
        selfConsumedKwh: 8970,
        autonomyPercent: 62,
        annualSavingsEur: 2240,
        surplusKwh: 4210,
        surplusValueEur: 42,
      },
      referenceMonthlyBillEur: null,
      sunshine: cagnesSunshine,
    });
  });

  it('falls back to the department yield until the commune yield is known', () => {
    expect(preview(completedAnswers, SimulatorStep.ROOF, null)?.sunshine).toEqual({
      scope: SunshineScope.DEPARTMENT,
      placeName: 'Alpes-Maritimes',
      yieldKwhPerKwc: 1518,
      peakMonthKwhPerKwc: 173,
    });
  });

  it('keeps the regional default outside the known departments', () => {
    expect(preview({ ...completedAnswers, postalCode: '97400', location: null }, SimulatorStep.ROOF, null)?.sunshine).toEqual({
      scope: SunshineScope.REGIONAL_DEFAULT,
      placeName: null,
      yieldKwhPerKwc: 1300,
      peakMonthKwhPerKwc: 150,
    });
  });

  it('recommends the same installation in the Nord and the Alpes-Maritimes, and saves less in the Nord', () => {
    const results = ['06000', '59000'].map((postalCode) => {
      const estimate = preview({ ...completedAnswers, postalCode, location: null }, SimulatorStep.RESULT, null)?.estimate;
      return [estimate?.recommendedKwc, estimate?.annualProductionKwh, estimate?.annualSavingsEur];
    });
    expect(results).toEqual([
      [6, 9110, 1300],
      [6, 6400, 970],
    ]);
  });
});

describe('Local solar context', () => {
  it('simulates at the address with the PVGIS yearly and monthly yield of the commune', () => {
    const { parameters, sunshine } = localSolarContext(completedAnswers, cagnesYield, solarEstimateParameters, testYields);
    expect([parameters.site, parameters.specificYieldKwhPerKwc, parameters.monthlyProductionShares, sunshine]).toEqual([
      { latitude: 43.6638, longitude: 7.1488 },
      1504,
      cagnesYield.monthlyKwhPerKwc,
      cagnesSunshine,
    ]);
  });

  it('simulates at the reference city of the department without a commune yield', () => {
    const { parameters } = localSolarContext({ ...completedAnswers, postalCode: '59000', location: null }, null, solarEstimateParameters, testYields);
    expect([parameters.site, parameters.specificYieldKwhPerKwc, parameters.monthlyProductionShares]).toEqual([
      { latitude: 50.6311, longitude: 3.0468 },
      1067,
      lilleMonthlyYield,
    ]);
  });
});

describe('Address geocoding', () => {
  const suggestion = (postalCode: string, city: string) => ({
    id: postalCode,
    label: `12 avenue des Oliviers ${postalCode} ${city}`,
    name: '12 avenue des Oliviers',
    postalCode,
    city,
    location: { latitude: 43.66, longitude: 7.15 },
  });

  it('takes the first suggestion in the typed postal code when no suggestion was picked', () => {
    expect(
      geocodedAnswersPatch({ location: null, postalCode: ' 06800 ' }, [suggestion('83000', 'Toulon'), suggestion('06800', 'Cagnes-sur-Mer')]),
    ).toEqual({ location: { latitude: 43.66, longitude: 7.15 }, city: 'Cagnes-sur-Mer' });
  });

  it('keeps the picked location and ignores suggestions in another postal code', () => {
    expect([
      geocodedAnswersPatch({ location: { latitude: 1, longitude: 2 }, postalCode: '06800' }, [suggestion('06800', 'Cagnes-sur-Mer')]),
      geocodedAnswersPatch({ location: null, postalCode: '06800' }, [suggestion('83000', 'Toulon')]),
    ]).toEqual([null, null]);
  });
});
