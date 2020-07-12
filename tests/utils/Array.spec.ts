import { clone, min, max } from '@/utils/Array';
import Level0 from '@/settings/level0.json';

describe('Array', () => {
  test('clone', () => {
    expect(clone(Level0.bounds)).toStrictEqual(Level0.bounds);
  });

  test('min', () => {
    expect(min([-Infinity, -25, 0, 12, 100])).toStrictEqual(-Infinity);
    expect(min([Infinity, -12, -100, 0, 25])).toStrictEqual(-100);
    expect(min([50, 100, 42, 8, 75, 15, 12])).toStrictEqual(8);
  });

  test('max', () => {
    expect(max([Infinity, -12, -100, 0, 25])).toStrictEqual(Infinity);
    expect(max([65536, 42, 8, 75, 15, 4096])).toStrictEqual(65536);
    expect(max([-Infinity, -999, -12, -100])).toStrictEqual(-12);
  });
});
