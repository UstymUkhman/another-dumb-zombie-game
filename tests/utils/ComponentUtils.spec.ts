import '../globals';
import { Coords } from '@/types.d';
import Level0 from '@/environment/Level0';
import { getScaledCoords, pointInCircle } from '@/components/utils';

describe('ComponentUtils', () => {
  test('getScaledCoords', () => {
    expect(getScaledCoords([0, 0], Level0.minCoords, 1)).toStrictEqual(Level0.minCoords);

    expect(getScaledCoords([50.0, 50.0], [0, 0], 5)).toStrictEqual([250.0, 250.0]);

    expect(getScaledCoords([1, 1], Level0.minCoords, 2)).toStrictEqual([
      Level0.minCoords[0] * 2 + 2, Level0.minCoords[1] * 2 + 2
    ]);
  });

  test('pointInCircle', () => {
    const pCoords = [Math.random(), Math.random()] as Coords;
    const cCoords = [Math.random(), Math.random()] as Coords;

    expect(pointInCircle([1.25, 1.25], [0.5, 0.5], 1)).toStrictEqual(false);
    expect(pointInCircle([0, 0], [0.5, 0.5], 0.75)).toStrictEqual(true);
    expect(pointInCircle(pCoords, cCoords, 0)).toStrictEqual(false);
  });
});
