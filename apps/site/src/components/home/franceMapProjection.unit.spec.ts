import { describe, expect, it } from 'vitest';
import { projectOnSunshineMap, sunshineMapTransformOf } from '@/components/home/franceMapProjection';
import { projectOnFranceMap } from '@/components/simulator/franceDepartmentShapes';

const rounded = ({ x, y }: { x: number; y: number }) => ({ x: Math.round(x), y: Math.round(y) });

const applyMatrix = (matrix: string, point: { x: number; y: number }) => {
  const [a, , , d, e, f] = matrix.slice('matrix('.length, -1).split(' ').map(Number);
  return { x: a * point.x + e, y: d * point.y + f };
};

describe('Sunshine map projection', () => {
  it('places Marseille, Toulon and Nice on the city markers drawn on the map', () => {
    expect([
      rounded(projectOnSunshineMap({ latitude: 43.2965, longitude: 5.3698 })),
      rounded(projectOnSunshineMap({ latitude: 43.1242, longitude: 5.928 })),
      rounded(projectOnSunshineMap({ latitude: 43.7032, longitude: 7.2528 })),
    ]).toEqual([
      { x: 417, y: 438 },
      { x: 436, y: 446 },
      { x: 481, y: 418 },
    ]);
  });

  it('builds the matrix that lays the simulator department shapes over the sunshine map', () => {
    expect(sunshineMapTransformOf(projectOnFranceMap)).toBe('matrix(0.885 0 0 0.876 63.4883 58.8838)');
  });

  it('lands a point of the simulator map on the same place of the sunshine map', () => {
    const matrix = sunshineMapTransformOf(projectOnFranceMap);
    const nice = { latitude: 43.7032, longitude: 7.2528 };

    expect(rounded(applyMatrix(matrix, projectOnFranceMap(nice)))).toEqual(rounded(projectOnSunshineMap(nice)));
  });
});
