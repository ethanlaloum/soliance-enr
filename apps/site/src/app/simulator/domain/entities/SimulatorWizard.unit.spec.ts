import { describe, expect, it } from 'vitest';
import { DepartmentSolarYield } from '@/app/simulator/domain/entities/DepartmentSolarYield';
import {
  billComparisonOf,
  DaytimePresence,
  estimateSolarInstallation,
  EvCharging,
  HouseholdEquipment,
  RoofOrientation,
  RoofTilt,
  Shading,
  SizingChoice,
  solarEstimateParameters,
} from '@/app/simulator/domain/entities/SolarEstimate';
import {
  ConsumptionSource,
  consumptionSourceOf,
  effectiveRoofTilt,
  initialSimulatorAnswers,
  geocodedAnswersPatch,
  localSolarContext,
  nextSimulatorStep,
  parseAnnualConsumption,
  parseMonthlyBill,
  previewSolarEstimate,
  previewTypicalDay,
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
  panelCount: null,
  monthlyBill: '180 €',
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
        recommendedKwc: 5.5,
        recommendedPanelCount: 11,
        installedKwc: 5.5,
        panelCount: 11,
        panelChoice: SizingChoice.RECOMMENDED,
        recommendedBatteryKwh: 10.2,
        batteryKwh: 10.2,
        batteryChoice: SizingChoice.RECOMMENDED,
        annualProductionKwh: 8270,
        monthlyProductionKwh: [467, 517, 709, 775, 852, 879, 940, 890, 737, 605, 462, 440],
        annualConsumptionKwh: 7600,
        monthlyConsumptionKwh: [747, 696, 657, 612, 580, 554, 554, 541, 580, 631, 696, 754],
        selfConsumedKwh: 5640,
        selfConsumptionPercent: 68,
        autonomyPercent: 74,
        annualSavingsEur: 1410,
        surplusKwh: 2530,
        surplusValueEur: 28,
        reachesSavingsTarget: true,
        withoutBattery: { selfConsumedKwh: 2560, autonomyPercent: 34, annualSavingsEur: 640 },
      },
      referenceMonthlyBillEur: 180,
      sunshine: cagnesSunshine,
    });
  });

  it('uses the reference bill with the chosen equipment and presence while the bill is not valid yet', () => {
    expect(preview({ ...completedAnswers, monthlyBill: '' }, SimulatorStep.CONSUMPTION)).toEqual({
      estimate: {
        recommendedKwc: 5.5,
        recommendedPanelCount: 11,
        installedKwc: 5.5,
        panelCount: 11,
        panelChoice: SizingChoice.RECOMMENDED,
        recommendedBatteryKwh: 10.2,
        batteryKwh: 10.2,
        batteryChoice: SizingChoice.RECOMMENDED,
        annualProductionKwh: 8270,
        monthlyProductionKwh: [467, 517, 709, 775, 852, 879, 940, 890, 737, 605, 462, 440],
        annualConsumptionKwh: 7600,
        monthlyConsumptionKwh: [790, 724, 685, 619, 557, 529, 532, 523, 535, 602, 702, 803],
        selfConsumedKwh: 5720,
        selfConsumptionPercent: 69,
        autonomyPercent: 75,
        annualSavingsEur: 1430,
        surplusKwh: 2470,
        surplusValueEur: 27,
        reachesSavingsTarget: true,
        withoutBattery: { selfConsumedKwh: 3100, autonomyPercent: 41, annualSavingsEur: 780 },
      },
      referenceMonthlyBillEur: 180,
      sunshine: cagnesSunshine,
    });
  });

  it('uses every answer once the bill is valid', () => {
    expect(preview({ ...completedAnswers, monthlyBill: '300', equipment: [], daytimePresence: DaytimePresence.PRESENT }, SimulatorStep.RESULT)).toEqual({
      estimate: {
        recommendedKwc: 9.5,
        recommendedPanelCount: 19,
        installedKwc: 9.5,
        panelCount: 19,
        panelChoice: SizingChoice.RECOMMENDED,
        recommendedBatteryKwh: 15.3,
        batteryKwh: 15.3,
        batteryChoice: SizingChoice.RECOMMENDED,
        annualProductionKwh: 14290,
        monthlyProductionKwh: [807, 892, 1225, 1339, 1472, 1519, 1623, 1538, 1272, 1044, 797, 759],
        annualConsumptionKwh: 13360,
        monthlyConsumptionKwh: [1313, 1223, 1155, 1076, 1019, 974, 974, 951, 1019, 1110, 1223, 1325],
        selfConsumedKwh: 10070,
        selfConsumptionPercent: 70,
        autonomyPercent: 75,
        annualSavingsEur: 2520,
        surplusKwh: 4090,
        surplusValueEur: 45,
        reachesSavingsTarget: true,
        withoutBattery: { selfConsumedKwh: 5810, autonomyPercent: 43, annualSavingsEur: 1450 },
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

  it('recommends more power in the Nord than in the Alpes-Maritimes to produce the same consumption', () => {
    const results = ['06000', '59000'].map((postalCode) => {
      const estimate = preview({ ...completedAnswers, postalCode, location: null }, SimulatorStep.RESULT, null)?.estimate;
      return [estimate?.recommendedKwc, estimate?.annualProductionKwh, estimate?.autonomyPercent, estimate?.annualSavingsEur];
    });
    expect(results).toEqual([
      [5.5, 8350, 76, 1430],
      [8, 8540, 72, 1380],
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

describe('Detailed parameters', () => {
  it('mounts the panels of a flat roof on low frames whatever tilt was picked before', () => {
    expect([
      effectiveRoofTilt({ roofTilt: RoofTilt.STEEP, roofCovering: RoofCovering.FLAT_ROOF }),
      effectiveRoofTilt({ roofTilt: RoofTilt.STEEP, roofCovering: RoofCovering.SLATE }),
    ]).toEqual([RoofTilt.LOW, RoofTilt.STEEP]);
  });

  it('converts the bill with the kWh price the visitor sets', () => {
    const consumption = [0.25, 0.2].map(
      (kwhPriceEur) => preview({ ...completedAnswers, equipment: [], kwhPriceEur }, SimulatorStep.CONSUMPTION)?.estimate.annualConsumptionKwh,
    );
    expect(consumption).toEqual([7600, 9500]);
  });

  it('keeps the reference household on the roof step even when detailed consumption is already filled in', () => {
    expect(preview({ ...completedAnswers, annualConsumption: '3000' }, SimulatorStep.ROOF)?.estimate.annualConsumptionKwh).toEqual(7600);
  });

  it('applies the chosen panels, battery and tilt to the preview', () => {
    const estimate = preview({ ...completedAnswers, panelCount: 10, batteryKwh: 15.3, roofTilt: RoofTilt.LOW }, SimulatorStep.RESULT)?.estimate;
    expect([estimate?.panelCount, estimate?.installedKwc, estimate?.batteryKwh, estimate?.panelChoice, estimate?.batteryChoice]).toEqual([10, 5, 15.3, SizingChoice.CUSTOM, SizingChoice.CUSTOM]);
  });

  it('gives no typical day before the roof is known', () => {
    expect(previewTypicalDay(completedAnswers, SimulatorStep.ADDRESS, 6, cagnesYield, solarEstimateParameters, testYields)).toEqual(null);
  });

  it('gives a typical day of 24 hours once the roof is known', () => {
    expect(previewTypicalDay(completedAnswers, SimulatorStep.RESULT, 0, cagnesYield, solarEstimateParameters, testYields)?.productionKwh.length).toEqual(24);
  });
});

describe('Consumption step validation', () => {
  it('accepts a yearly consumption in place of the monthly bill', () => {
    expect([
      validateSimulatorStep(SimulatorStep.CONSUMPTION, { ...completedAnswers, monthlyBill: '' }),
      validateSimulatorStep(SimulatorStep.CONSUMPTION, { ...completedAnswers, monthlyBill: '', annualConsumption: '6 200' }),
    ]).toEqual([{ monthlyBill: SimulatorFieldError.MONTHLY_BILL_INVALID }, {}]);
  });
});

describe('Yearly consumption typed by the visitor', () => {
  it('reads figures typed with spaces, dots or a decimal comma, within 1 000 to 50 000 kWh', () => {
    expect([
      parseAnnualConsumption('6200'),
      parseAnnualConsumption('6 200'),
      parseAnnualConsumption('6.200'),
      parseAnnualConsumption('6200,4'),
      parseAnnualConsumption('900'),
      parseAnnualConsumption('62000'),
      parseAnnualConsumption('beaucoup'),
      parseAnnualConsumption(''),
    ]).toEqual([6200, 6200, 6200, 6200, null, null, null, null]);
  });

  it('blocks the step on an unreadable yearly figure instead of silently using the bill', () => {
    expect([
      validateSimulatorStep(SimulatorStep.CONSUMPTION, { ...completedAnswers, annualConsumption: '62000' }),
      validateSimulatorStep(SimulatorStep.CONSUMPTION, { ...completedAnswers, monthlyBill: '', annualConsumption: '900' }),
      validateSimulatorStep(SimulatorStep.CONSUMPTION, { ...completedAnswers, monthlyBill: '', annualConsumption: '' }),
      validateSimulatorStep(SimulatorStep.CONSUMPTION, { ...completedAnswers, annualConsumption: '' }),
    ]).toEqual([
      { annualConsumption: SimulatorFieldError.ANNUAL_CONSUMPTION_INVALID },
      { annualConsumption: SimulatorFieldError.ANNUAL_CONSUMPTION_INVALID },
      { monthlyBill: SimulatorFieldError.MONTHLY_BILL_INVALID },
      {},
    ]);
  });

  it('tells where the consumption comes from: the yearly figure, the bill or the reference household', () => {
    expect([
      consumptionSourceOf({ annualConsumption: '6200', monthlyBill: '180' }),
      consumptionSourceOf({ annualConsumption: '62000', monthlyBill: '180' }),
      consumptionSourceOf({ annualConsumption: null, monthlyBill: '' }),
    ]).toEqual([ConsumptionSource.ANNUAL, ConsumptionSource.BILL, ConsumptionSource.REFERENCE]);
  });

  it('simulates on the typed yearly figure once it is readable', () => {
    expect(preview({ ...completedAnswers, equipment: [], annualConsumption: '5 000' }, SimulatorStep.RESULT)?.estimate.annualConsumptionKwh).toEqual(5000);
  });
});

describe('Concordance with the Soliance studies', () => {
  const studyResult = (postalCode: string, orientation: RoofOrientation, annualKwh: number, equipment: HouseholdEquipment[], panelCount: number, batteryKwh: number, kwhPriceEur: number) => {
    const parameters = { ...localSolarContext({ postalCode, location: null, city: null }, null).parameters, kwhPriceEur };
    const estimate = estimateSolarInstallation(
      {
        roof: { areaM2: 200, orientation, tilt: RoofTilt.LOW },
        consumption: { monthlyBillEur: 0, annualKwh, equipment, daytimePresence: DaytimePresence.MOSTLY_ABSENT },
        panelCount,
        batteryKwh,
      },
      parameters,
    );
    const bill = billComparisonOf(estimate, kwhPriceEur, parameters);
    return [estimate.annualProductionKwh, estimate.autonomyPercent, estimate.selfConsumptionPercent, estimate.annualSavingsEur, bill.afterEur];
  };

  it('covers 70 % of a 9 kWc Alpes-Maritimes house with a 10.2 kWh battery, the Soliance study finding 68.9 %, 1 716 € saved and a 1 031 € bill', () => {
    expect(studyResult('06270', RoofOrientation.SOUTH_EAST, 11091, [HouseholdEquipment.ELECTRIC_HEATING, HouseholdEquipment.POOL], 18, 10.2, 0.21)).toEqual([12350, 70, 62, 1620, 970]);
  });

  it('covers 74 % of a 14 kWc east / west Var house with a 20.4 kWh battery, the Soliance study finding 68.8 % under the shading of its north-east side', () => {
    expect(
      studyResult(
        '83340',
        RoofOrientation.EAST_WEST,
        15490,
        [HouseholdEquipment.ELECTRIC_HEATING, HouseholdEquipment.AIR_CONDITIONING, HouseholdEquipment.ELECTRIC_VEHICLE],
        28,
        20.4,
        0.1879,
      ),
    ).toEqual([17580, 74, 65, 2160, 1010]);
  });

  it('covers 67 % of a 7.5 kWc Nice house with a 10.2 kWh battery, the Soliance study finding 67.8 %, 1 321 € saved and a 939 € bill', () => {
    expect(studyResult('06000', RoofOrientation.SOUTH_EAST, 9426, [HouseholdEquipment.ELECTRIC_HEATING], 15, 10.2, 0.1807)).toEqual([10290, 67, 61, 1140, 820]);
  });
});
