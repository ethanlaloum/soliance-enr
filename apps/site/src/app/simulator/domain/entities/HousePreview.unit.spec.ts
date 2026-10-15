import { describe, expect, it } from 'vitest';
import {
  houseLengthOf,
  housePreviewOf,
  panelColumnsFitting,
  panelSlotsOf,
  PanelSlot,
  RoofFace,
} from '@/app/simulator/domain/entities/HousePreview';
import { HouseholdEquipment, RoofOrientation, RoofTilt } from '@/app/simulator/domain/entities/SolarEstimate';
import { RoofCovering } from '@/app/simulator/domain/entities/SimulatorWizard';

const slot = (face: RoofFace, index: number, row: number, column: number): PanelSlot => ({ key: `${face}-${index}`, face, row, column });

const threeFullRowsOfEight = [0, 1, 2].flatMap((row) => Array.from({ length: 8 }, (_, index) => slot(RoofFace.FRONT, row * 8 + index, row, index - 3.5)));

describe('House length', () => {
  it('stretches the house from 9 m to 14 m across the roof area slider', () => {
    expect([houseLengthOf(20), houseLengthOf(45), houseLengthOf(70), houseLengthOf(120)]).toEqual([9, 10.25, 11.5, 14]);
  });

  it('keeps the house within its bounds outside the slider range', () => {
    expect([houseLengthOf(5), houseLengthOf(200), houseLengthOf(1000)]).toEqual([9, 14, 14]);
  });

  it('fits one panel column every 95 cm once the roof edges are kept clear', () => {
    expect([panelColumnsFitting(9), panelColumnsFitting(10.25), panelColumnsFitting(14)]).toEqual([8, 9, 13]);
  });
});

describe('Panel layout', () => {
  it('lays four panels or fewer in a single centred row', () => {
    expect(panelSlotsOf(4, RoofOrientation.SOUTH, 9)).toEqual([
      slot(RoofFace.FRONT, 0, 0, -1.5),
      slot(RoofFace.FRONT, 1, 0, -0.5),
      slot(RoofFace.FRONT, 2, 0, 0.5),
      slot(RoofFace.FRONT, 3, 0, 1.5),
    ]);
  });

  it('splits more than four panels over two balanced rows on the front face', () => {
    expect(panelSlotsOf(6, RoofOrientation.SOUTH_EAST, 8)).toEqual([
      slot(RoofFace.FRONT, 0, 0, -1),
      slot(RoofFace.FRONT, 1, 0, 0),
      slot(RoofFace.FRONT, 2, 0, 1),
      slot(RoofFace.FRONT, 3, 1, -1),
      slot(RoofFace.FRONT, 4, 1, 0),
      slot(RoofFace.FRONT, 5, 1, 1),
    ]);
  });

  it('gives the extra panel of an odd count to the row along the eaves', () => {
    expect(panelSlotsOf(7, RoofOrientation.SOUTH, 9)).toEqual([
      slot(RoofFace.FRONT, 0, 0, -1.5),
      slot(RoofFace.FRONT, 1, 0, -0.5),
      slot(RoofFace.FRONT, 2, 0, 0.5),
      slot(RoofFace.FRONT, 3, 0, 1.5),
      slot(RoofFace.FRONT, 4, 1, -1),
      slot(RoofFace.FRONT, 5, 1, 0),
      slot(RoofFace.FRONT, 6, 1, 1),
    ]);
  });

  it('opens a third row when two rows no longer fit along the ridge', () => {
    expect(panelSlotsOf(24, RoofOrientation.SOUTH, 8)).toEqual(threeFullRowsOfEight);
  });

  it('never lays more panels than three full rows hold', () => {
    expect(panelSlotsOf(30, RoofOrientation.SOUTH, 8)).toEqual(threeFullRowsOfEight);
  });

  it('shares an east-west installation between both faces, the front taking the odd panel', () => {
    expect(panelSlotsOf(7, RoofOrientation.EAST_WEST, 9)).toEqual([
      slot(RoofFace.FRONT, 0, 0, -1.5),
      slot(RoofFace.FRONT, 1, 0, -0.5),
      slot(RoofFace.FRONT, 2, 0, 0.5),
      slot(RoofFace.FRONT, 3, 0, 1.5),
      slot(RoofFace.BACK, 0, 0, -1),
      slot(RoofFace.BACK, 1, 0, 0),
      slot(RoofFace.BACK, 2, 0, 1),
    ]);
  });

  it('lays no panel when none is recommended', () => {
    expect(panelSlotsOf(0, RoofOrientation.EAST_WEST, 9)).toEqual([]);
  });
});

describe('House preview', () => {
  const answers = {
    roofAreaM2: 45,
    orientation: RoofOrientation.SOUTH_WEST,
    roofTilt: RoofTilt.STEEP,
    roofCovering: RoofCovering.SLATE,
    equipment: [HouseholdEquipment.POOL, HouseholdEquipment.ELECTRIC_VEHICLE],
  };

  it('shows the recommended panels, one battery module per 5 kWh and the chosen equipment', () => {
    expect(housePreviewOf(answers, { panelCount: 12, batteryKwh: 10 })).toEqual({
      houseLengthM: 10.25,
      orientation: RoofOrientation.SOUTH_WEST,
      roofTilt: RoofTilt.STEEP,
      roofCovering: RoofCovering.SLATE,
      panels: [
        slot(RoofFace.FRONT, 0, 0, -2.5),
        slot(RoofFace.FRONT, 1, 0, -1.5),
        slot(RoofFace.FRONT, 2, 0, -0.5),
        slot(RoofFace.FRONT, 3, 0, 0.5),
        slot(RoofFace.FRONT, 4, 0, 1.5),
        slot(RoofFace.FRONT, 5, 0, 2.5),
        slot(RoofFace.FRONT, 6, 1, -2.5),
        slot(RoofFace.FRONT, 7, 1, -1.5),
        slot(RoofFace.FRONT, 8, 1, -0.5),
        slot(RoofFace.FRONT, 9, 1, 0.5),
        slot(RoofFace.FRONT, 10, 1, 1.5),
        slot(RoofFace.FRONT, 11, 1, 2.5),
      ],
      batteryModules: 2,
      equipment: [HouseholdEquipment.POOL, HouseholdEquipment.ELECTRIC_VEHICLE],
    });
  });

  it('shows a bare roof and no battery before any estimate exists', () => {
    expect(housePreviewOf(answers, null)).toEqual({
      houseLengthM: 10.25,
      orientation: RoofOrientation.SOUTH_WEST,
      roofTilt: RoofTilt.STEEP,
      roofCovering: RoofCovering.SLATE,
      panels: [],
      batteryModules: 0,
      equipment: [HouseholdEquipment.POOL, HouseholdEquipment.ELECTRIC_VEHICLE],
    });
  });
});

describe('House preview of a flat roof', () => {
  it('draws the panels of a flat roof on low frames and shows no battery when the visitor removes it', () => {
    const preview = housePreviewOf(
      { roofAreaM2: 20, orientation: RoofOrientation.SOUTH, roofTilt: RoofTilt.STEEP, roofCovering: RoofCovering.FLAT_ROOF, equipment: [] },
      { panelCount: 4, batteryKwh: 0 },
    );
    expect(preview).toEqual({
      houseLengthM: 9,
      orientation: RoofOrientation.SOUTH,
      roofTilt: RoofTilt.LOW,
      roofCovering: RoofCovering.FLAT_ROOF,
      panels: [
        slot(RoofFace.FRONT, 0, 0, -1.5),
        slot(RoofFace.FRONT, 1, 0, -0.5),
        slot(RoofFace.FRONT, 2, 0, 0.5),
        slot(RoofFace.FRONT, 3, 0, 1.5),
      ],
      batteryModules: 0,
      equipment: [],
    });
  });
});
