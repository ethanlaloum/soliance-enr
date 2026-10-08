import { describe, expect, it } from 'vitest';
import {
  averageSolarYieldKwhPerKwc,
  DepartmentSolarYield,
  departmentCodeOfPostalCode,
  departmentSolarYieldOf,
  departmentSolarYields,
  solarYieldClassOf,
  solarYieldGapPercent,
} from '@/app/simulator/domain/entities/DepartmentSolarYield';

const yields: DepartmentSolarYield[] = [
  { code: '06', name: 'Alpes-Maritimes', referenceCity: 'Nice', yieldKwhPerKwc: 1500, monthlyYieldKwhPerKwc: [] },
  { code: '2A', name: 'Corse-du-Sud', referenceCity: 'Ajaccio', yieldKwhPerKwc: 1400, monthlyYieldKwhPerKwc: [] },
  { code: '59', name: 'Nord', referenceCity: 'Lille', yieldKwhPerKwc: 1000, monthlyYieldKwhPerKwc: [] },
];

describe('departmentCodeOfPostalCode', () => {
  it('reads the department from the first two digits', () => {
    expect(departmentCodeOfPostalCode(' 06800 ')).toBe('06');
  });

  it('splits Corsica into Corse-du-Sud below 20200 and Haute-Corse from 20200', () => {
    expect([departmentCodeOfPostalCode('20000'), departmentCodeOfPostalCode('20199'), departmentCodeOfPostalCode('20200')]).toEqual(['2A', '2A', '2B']);
  });

  it('returns null for anything but five digits', () => {
    expect([departmentCodeOfPostalCode(''), departmentCodeOfPostalCode('0680'), departmentCodeOfPostalCode('06 800')]).toEqual([null, null, null]);
  });
});

describe('departmentSolarYieldOf', () => {
  it('finds the department of the postal code', () => {
    expect(departmentSolarYieldOf('20090', yields)).toEqual({ code: '2A', name: 'Corse-du-Sud', referenceCity: 'Ajaccio', yieldKwhPerKwc: 1400, monthlyYieldKwhPerKwc: [] });
  });

  it('returns null outside mainland France', () => {
    expect(departmentSolarYieldOf('97400', yields)).toBeNull();
  });

  it('covers the 96 mainland departments, Nice at its PVGIS yield', () => {
    expect([departmentSolarYields.length, departmentSolarYieldOf('06000')?.yieldKwhPerKwc]).toEqual([96, 1518]);
  });
});

describe('solarYieldClassOf', () => {
  it('counts the class bounds reached by the yield', () => {
    expect([1149, 1150, 1199, 1200, 1300, 1399, 1400, 1598].map((value) => solarYieldClassOf(value))).toEqual([0, 1, 1, 2, 3, 3, 4, 4]);
  });
});

describe('averageSolarYieldKwhPerKwc and solarYieldGapPercent', () => {
  it('compares a yield with the rounded average of the departments', () => {
    expect([averageSolarYieldKwhPerKwc(yields), solarYieldGapPercent(1500, yields), solarYieldGapPercent(1000, yields)]).toEqual([1300, 15, -23]);
  });
});
